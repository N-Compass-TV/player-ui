/** Interface representing the data structure for a playlist item. */
export interface LPlaylistData {
    playlist_id: string;
    playlist_content_id: string;
    content_id: string;
    file_name: string;
    url: string;
    file_type: string;
    handler_id: string;
    sequence: number;
    is_fullscreen: number;
    duration: number;
    title: string;
    play_type: string;
    alternate_week: number;
    date_from: string;
    date_to: string;
    play_days: string;
    play_time_start: string | null;
    play_time_end: string | null;
    credits: number;
    credit_count: number | null;
    schedule_status: string | null;
    schedule_status_sent: string | null;
    classification: string | null;
}
