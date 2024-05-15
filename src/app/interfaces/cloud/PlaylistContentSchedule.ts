/** Playlist content schedule details */
export interface PlaylistContentSchedule {
    alternateWeek: number;
    dateCreated: string;
    days: string;
    from: string;
    liveStream: number;
    playTimeEnd: string | null;
    playTimeStart: string | null;
    playlistContentId: string;
    playlistContentsScheduleId: string;
    status: string;
    to: string;
    type: number;
}
