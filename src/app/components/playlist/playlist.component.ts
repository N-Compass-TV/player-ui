import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, map, of, switchMap, take } from 'rxjs';

/** Components */
import { ContentComponent } from '@components/content';

/** Services */
import { HelperService } from '@services/helper';
import { RequestService } from '@services/request';
import { SocketService } from '@services/socket';

/** Environments */
import { API_ENDPOINTS } from '@environments';

/** Interfaces */
import { LPlaylistData, LProgrammaticAd, LProgrammaticAdsResponse } from '@interfaces/local';
import { PLAY_TYPE } from '@constants';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [CommonModule, ContentComponent],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {
    /**
     * Indicates that the zone holding this playlist is a main zone
     */
    @Input() isMainzone: boolean = false;

    /**
     * Playlist ID to be used to fetch playlist data.
     * @type {string}
     * @default ''
     */
    @Input() playlistId: string = '';

    /**
     * Programmatic ads to be diplayed
     * @type {LProgrammaticAds[]}
     * @default []
     */
    @Input() programmaticAds: LProgrammaticAd[] = [];

    /**
     * Emits the playlist content is_fullscreen value
     * @type {number}
     * @default ''
     */
    @Output() onDisplayModeChecked: EventEmitter<number> = new EventEmitter();

    /**
     * The current playlist content item.
     * @type {PlaylistData | null}
     * @default null
     */
    public currentPlaylistContent: LPlaylistData | null = null;

    /**
     * The current playlist sequence
     * @type {number}
     * @default 0
     */
    public currentSequence: number = 0;

    /**
     * The current vendor content sequence tracker but starts with 1
     * @type {number}
     * @default 1
     */
    public currentVendorSequence: number = 1;

    /**
     * Array of playlist items.
     * @type {LPlaylistData[]}
     * @default []
     */
    private playlist: LPlaylistData[] = [];

    /**
     * Set the ticker's activate status
     * @type {boolean}
     * @default true
     */
    public tickerActivated: boolean = true;

    /**
     * Array of vendor ads mapped into playlist data.
     * @type {LPlaylistData[]}
     * @default []
     */
    private vendorAds: LPlaylistData[] = [];

    /**
     * The sequence assigned for the vendor ad
     * @type {number}
     * @default 4 - means programmatic ads will play at every after 4th sequence in the playlist
     * See sample below:
     * p - playlist
     * v - vendor
     * p p p p v p p p p v p p p p v
     * p p p p v p p p p v p p p p v
     */
    private vendorAdPlayPosition: number = 4;

    constructor(
        private _helper: HelperService,
        private _request: RequestService,
        private _socket: SocketService,
    ) {}

    ngOnInit(): void {
        this.getPlaylistData();
        if (this.isMainzone) this.getProgrammaticAds();
    }

    /**
     * Fetches playlist data using the current playlist ID.
     * If the playlist ID is not set, the method returns early.
     * @private
     * @returns {void}
     */
    private getPlaylistData(update: boolean = false): void {
        if (!this.playlistId) return;

        this._request.getRequest(`${API_ENDPOINTS.local.get.playlist}${this.playlistId}`).subscribe({
            next: (playlist: LPlaylistData[]) => {
                // Sort only the internal playlist
                const sortedPlaylist = playlist.sort((a, b) => a.sequence - b.sequence);

                // Concatenate the sorted playlist with the mapped ads
                this.playlist = [...sortedPlaylist];

                // Play ads
                this.tickerActivated = this.playlist.length > 1;
                if (!update) this.playAd();
            },
            error: (error) => {
                console.error({ error });
            },
        });
    }

    private getProgrammaticAds() {
        this._request.getRequest(API_ENDPOINTS.local.get.programmatic_ads).subscribe({
            next: (ads: LProgrammaticAdsResponse) => {
                this.vendorAds = [
                    ...ads.data.map((ad, index) => ({
                        playlist_id: null,
                        playlist_content_id: null,
                        programmatic_ad_id: ad.id,
                        programmatic_source: ad.creative_source,
                        content_id: ad.id,
                        file_name: ad.creative_name,
                        url: ad.creative_url,
                        file_type: ad.creative_type,
                        handler_id: null,
                        sequence: index,
                        is_fullscreen: 1,
                        duration: ad.duration,
                        title: ad.creative_name,
                        play_type: PLAY_TYPE.default,
                        alternate_week: null,
                        date_from: null,
                        date_to: null,
                        play_days: null,
                        play_time_start: null,
                        play_time_end: null,
                        proof_of_play: ad.proof_of_play,
                        credits: null,
                        credit_count: null,
                        schedule_status: null,
                        schedule_status_sent: null,
                        classification: null,
                        played: ad.played,
                    })),
                ];

                if (this.playlist.length < this.vendorAdPlayPosition && this.isMainzone) {
                    this.playlist = [...this.playlist, ...this.vendorAds];
                }
            },
        });
    }

    /**
     * Handles the event when there is an error rendering the content.
     * Increments the current sequence, sets the current playlist content to null,
     * and calls the playAd method to play the next advertisement after a brief delay.
     * @todo - skipping the content but let's improve error handling here soon, maybe a logging mechanism that will inform dealer about the errored asset
     * @public
     * @returns {void}
     */
    public onContentRenderError(e: any): void {
        this.currentSequence += 1;
        if (!this.playlist[this.currentSequence].programmatic_source) this.currentVendorSequence += 1;
        this.currentPlaylistContent = null;

        setTimeout(() => {
            this.playAd();
        }, 0);
    }

    /**
     * Handles the event when the display ends. Increments the current
     * sequence and calls the playAd method to play the next advertisement.
     * @public
     * @returns {void}
     */
    public onDisplayEnded(): void {
        this.currentSequence += 1;
        if (!this.currentPlaylistContent?.programmatic_source) this.currentVendorSequence += 1;
        this.currentPlaylistContent = null;

        setTimeout(() => {
            this.playAd();
        }, 0);
    }

    /**
     * Plays the advertisement by setting the current playlist content
     * based on the current sequence. If the current sequence exceeds
     * the length of the playlist, it resets the sequence to 0.
     * @private
     * @returns {void}
     */
    private playAd(): void {
        if (this.playlist.length === 0) {
            console.warn('Playlist is empty!');
            return;
        }

        if (
            this.isMainzone &&
            this.currentVendorSequence - 1 !== 0 &&
            (this.currentVendorSequence - 1) % this.vendorAdPlayPosition === 0
        ) {
            if (this.vendorAds.length) {
                const vendorAd = this.vendorAds[0];
                this.currentPlaylistContent = vendorAd;
                this.onDisplayModeChecked.emit(vendorAd.is_fullscreen);
                this.currentSequence = this.currentSequence - 1;
                this.currentVendorSequence = 1;

                /** Send programmatic screenshot */
                setTimeout(() => {
                    this.triggerProgrammaticPlaying(vendorAd);
                }, 5000);

                return;
            }

            /** Retry adrequest */
            this.triggerProgrammaticAdRequest();
        }

        do {
            if (!this.playlist[this.currentSequence]) break;

            if (this._helper.canPlayContent(this.playlist[this.currentSequence])) {
                this.currentPlaylistContent = this.playlist[this.currentSequence];
                this.onDisplayModeChecked.emit(this.currentPlaylistContent.is_fullscreen);

                /** Trigger programmatic ad screenshot */
                if (this.isMainzone && this.playlist[this.currentSequence].programmatic_source) {
                    setTimeout(() => {
                        this.triggerProgrammaticPlaying(this.playlist[this.currentSequence]);
                    }, 5000);
                }

                if (this.currentPlaylistContent?.playlist_content_id) {
                    this._socket.onPlayingContent(this.currentPlaylistContent.playlist_content_id);
                }

                return;
            }
        } while (this.currentSequence < this.playlist.length);

        /**
         * Reset sequence, trigger programmatic and reset play
         * @Todo - It should not only check mainZone flag but
         * also if the programmatic is enabled for this license
         */

        this.currentSequence = 0;
        this.playAd();
    }

    /**
     * Trigger programmatic playing request,
     * This sends a screenshot as a proof of play
     */
    private triggerProgrammaticPlaying(playlistContent: LPlaylistData): void {
        this._request
            .getRequest(`${API_ENDPOINTS.local.get.programmatic_playing}/${playlistContent.proof_of_play}`)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.triggerProgrammaticAdRequest();
                },
            });
    }

    /**
     * Trigger ad request from programmatic vendors
     * to renew programmatic ads data
     */
    private triggerProgrammaticAdRequest(): void {
        this._request
            .getRequest(API_ENDPOINTS.local.get.programmatic_adrequest)
            .pipe(take(1))
            .subscribe({
                next: () => this.getProgrammaticAds(),
            });
    }
}
