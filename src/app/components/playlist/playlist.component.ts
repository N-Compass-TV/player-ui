import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestService } from '@services';
import { API_ENDPOINTS } from '@environments';
import { LPlaylistData } from '@interfaces';
import { ContentComponent } from '@components';
import { PLAY_TYPE } from '../../constants/PlayType';

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

    constructor(private _request: RequestService) {}

    ngOnInit(): void {
        this.getPlaylistData();
    }

    /**
     * Checks if the playlist content should be played based on its play type
     * and custom schedule.
     *
     * @private
     * @param {LPlaylistData} playlistContent - The playlist content to check.
     * @returns {boolean} - Returns true if the content should be played, false otherwise.
     */
    private toPlay(playlistContent: LPlaylistData): boolean {
        /**
         *  Day Value
         *  Sunday = 0,
         *  Monday = 1,
         *  Tuesday = 2,
         *  Wednesday = 3,
         *  Thursday = 4,
         *  Friday = 5,
         *  Saturday = 6
         *
         *  1 - Default, 2 - Do Not Play, 3 - Custom Scheduled
         */

        if (!playlistContent) {
            return false;
        }

        const { play_type, play_time_start, play_time_end, date_from, date_to, play_days } = playlistContent;

        if (parseInt(play_type) === PLAY_TYPE.do_not_play) {
            return false;
        }

        if (parseInt(play_type) === PLAY_TYPE.default) {
            return true;
        }

        if (parseInt(play_type) === PLAY_TYPE.custom_scheduled) {
            const now = new Date();
            const currentDayId = now.getDay(); // Current day of the week
            const nowTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since start of the day

            const startDate = new Date(date_from);
            const endDate = new Date(date_to);

            // Check if start and end times are provided and parse them
            const startTime = play_time_start ? this.parseTime(play_time_start) : -1;
            const endTime = play_time_end ? this.parseTime(play_time_end) : -1;

            // Check if current date is within the scheduled date range
            if (now >= startDate && now <= endDate) {
                // Check if the current day is within the play days
                const playDays = play_days.split(',').map(Number);
                if (playDays.includes(currentDayId)) {
                    // Check if current time is within the scheduled time range
                    if (startTime !== -1 && endTime !== -1 && nowTime >= startTime && nowTime <= endTime) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Parses a time string into the number of minutes since the start of the day.
     *
     * @private
     * @param {string} timeStr - The time string to parse.
     * @returns {number} - The number of minutes since the start of the day, or -1 if the time string is invalid.
     */
    private parseTime(timeStr: string): number {
        if (!timeStr) return -1; // Return -1 if timeStr is null or undefined
        const timeMatch = timeStr.match(/(\d+):(\d+)/);
        if (!timeMatch) return -1; // Return -1 if the time string is not in the expected format
        const [hours, minutes] = timeMatch.slice(1).map(Number);
        const isPM = timeStr.toLowerCase().includes('pm');
        return ((hours % 12) + (isPM ? 12 : 0)) * 60 + minutes;
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
    public onContentRenderError(): void {
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
    public onDisplayEnded() {
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
            if (this.toPlay(this.playlist[this.currentSequence])) {
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
