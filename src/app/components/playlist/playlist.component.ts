import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/** Components */
import { ContentComponent } from '@components/content';

/** Services */
import { RequestService } from '@services/request';
import { HelperService } from '@services/helper';

/** Environments */
import { API_ENDPOINTS } from '@environments';

/** Interfaces */
import { LPlaylistData } from '@interfaces/local';

@Component({
    selector: 'app-playlist',
    standalone: true,
    imports: [CommonModule, ContentComponent],
    templateUrl: './playlist.component.html',
    styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {
    /**
     * Playlist ID to be used to fetch playlist data.
     * @type {string}
     * @default ''
     */
    @Input() playlistId: string = '';

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
    private getPlaylistData(): void {
        if (!this.playlistId) return;

        this._request.getRequest(`${API_ENDPOINTS.local.get.playlist}${this.playlistId}`).subscribe({
            next: (playlist: LPlaylistData[]) => {
                this.playlist = playlist.sort((a, b) => a.sequence - b.sequence);
                this.tickerActivated = playlist.length > 1;
                this.playAd();
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
            console.warn('Playlist is empty.');
            return;
        }

        let initialSequence = this.currentSequence;
        do {
            if (this._helper.canPlayContent(this.playlist[this.currentSequence])) {
                this.currentPlaylistContent = this.playlist[this.currentSequence];
                this.onDisplayModeChecked.emit(this.currentPlaylistContent.is_fullscreen);
                return;
            }

            /**
             * This ensures that the sequence number always stays within the valid range
             * of indices for the playlist array, effectively cycling through the playlist
             * items repeatedly.
             */
            this.currentSequence = (this.currentSequence + 1) % this.playlist.length;
        } while (this.currentSequence !== initialSequence);

        console.warn('No playable content found in the playlist.');
    }
}
