import { Injectable } from '@angular/core';
import { LPlaylistData } from '@interfaces/local';
import { PLAY_TYPE } from '@constants';

@Injectable({
    providedIn: 'root',
})
export class HelperService {
    /**
     * Checks if the playlist content should be played based on its play type
     * and custom schedule.
     *
     * @param {LPlaylistData} playlistContent - The playlist content to check.
     * @returns {boolean} - Returns true if the content should be played, false otherwise.
     */
    public canPlayContent(playlistContent: LPlaylistData): boolean {
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

        if (!playlistContent) return false;

        const { play_type, play_time_start, play_time_end, date_from, date_to, play_days } = playlistContent;

        if (parseInt(play_type) === PLAY_TYPE.do_not_play) return false;

        if (parseInt(play_type) === PLAY_TYPE.default) return true;

        if (parseInt(play_type) === PLAY_TYPE.custom_scheduled) {
            // Setup dates
            const now = new Date();
            const currentDayId = now.getDay();
            const nowTime = now.getHours() * 60 + now.getMinutes();
            const startDate = new Date(date_from);
            const endDate = new Date(date_to);

            // Function to strip the time part of the date
            const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

            // Remove time for date checking
            const nowDate = stripTime(now);
            const strippedStartDate = stripTime(startDate);
            const strippedEndDate = stripTime(endDate);

            // Parse start and end times if provided, otherwise set to -1
            const startTime = play_time_start ? this.parseTime(play_time_start) : -1;
            const endTime = play_time_end ? this.parseTime(play_time_end) : -1;

            // Check and Compare Dates
            if (nowDate >= strippedStartDate && nowDate <= strippedEndDate) {
                const playDays = play_days.split(',').map(Number);
                if (playDays.includes(currentDayId)) {
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
        // Return -1 if timeStr is null or undefined
        if (!timeStr) return -1;
        const timeMatch = timeStr.match(/(\d+):(\d+)/);

        // Return -1 if the time string is not in the expected format
        if (!timeMatch) return -1;
        const [hours, minutes] = timeMatch.slice(1).map(Number);
        const isPM = timeStr.toLowerCase().includes('pm');

        // Return
        return ((hours % 12) + (isPM ? 12 : 0)) * 60 + minutes;
    }
}
