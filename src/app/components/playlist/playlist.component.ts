import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, map, of, switchMap, take } from 'rxjs';

/** Components */
import { ContentComponent } from '@components/content';

/** Services */
import { RequestService } from '@services/request';
import { HelperService } from '@services/helper';

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
     * Array of playlist items.
     * @type {PlaylistData[]}
     * @default []
     */
    private playlist: LPlaylistData[] = [];

    /**
     * Set the ticker's activate status
     * @type {boolean}
     * @default true
     */
    public tickerActivated: boolean = true;

    constructor(
        private _helper: HelperService,
        private _request: RequestService,
    ) {}

    ngOnInit(): void {
        this.getPlaylistData();
    }

    /**
     * Fetches playlist data using the current playlist ID.
     * If the playlist ID is not set, the method returns early.
     * @private
     * @returns {void}
     */
    private getPlaylistData(update: boolean = false): void {
        if (!this.playlistId) return;

        this._request
            .getRequest(`${API_ENDPOINTS.local.get.playlist}${this.playlistId}`)
            .pipe(
                switchMap((playlist: LPlaylistData[]) => {
                    if (this.isMainzone) {
                        return this._request.getRequest(API_ENDPOINTS.local.get.programmatic_ads).pipe(
                            map((ads: LProgrammaticAdsResponse) => {
                                // Map programmatic ads to LPlaylistData format
                                const mappedAds: LPlaylistData[] = ads.data.map((ad, index) => ({
                                    playlist_id: null,
                                    playlist_content_id: null,
                                    programmatic_ad_id: ad.id,
                                    programmatic_source: ad.creative_source,
                                    content_id: ad.id,
                                    file_name: ad.creative_name,
                                    url: ad.creative_url,
                                    file_type: ad.creative_type,
                                    handler_id: null,
                                    sequence: playlist.length + index,
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
                                }));

                                // Return the playlist and the mapped ads separately
                                return { playlist, mappedAds };
                            }),
                            catchError((error) => {
                                console.error('Error fetching programmatic ads:', error);
                                return of({ playlist, mappedAds: [] }); // Continue with the original playlist if ads fetch fails
                            }),
                        );
                    } else {
                        return of({ playlist, mappedAds: [] }); // If not mainzone, return only the playlist
                    }
                }),
            )
            .subscribe({
                next: ({ playlist, mappedAds }: { playlist: LPlaylistData[]; mappedAds: LPlaylistData[] }) => {
                    // Sort only the internal playlist
                    const sortedPlaylist = playlist.sort((a, b) => a.sequence - b.sequence);

                    // Concatenate the sorted playlist with the mapped ads
                    this.playlist = [...sortedPlaylist, ...mappedAds];

                    console.log('==>', this.playlist);

                    // Play ads
                    this.tickerActivated = this.playlist.length > 1;
                    if (!update) this.playAd();
                },
                error: (error) => {
                    console.error({ error });
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

        do {
            if (!this.playlist[this.currentSequence]) break;

            if (this._helper.canPlayContent(this.playlist[this.currentSequence])) {
                this.currentPlaylistContent = this.playlist[this.currentSequence];
                this.onDisplayModeChecked.emit(this.currentPlaylistContent.is_fullscreen);
                return;
            }

            this.currentSequence = this.currentSequence + 1;
        } while (this.currentSequence < this.playlist.length);

        // Reset sequence, trigger programmatic and reset play
        this.currentSequence = 0;
        if (this.isMainzone) this.triggerProgrammaticAdRequest();
        this.playAd();
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
                next: () => {
                    this.getPlaylistData(true);
                },
            });
    }
}
