/** Defines progress step data */
export interface ProgressStep {
    title: string;
    subtitle: string;
    step: number;
}

/** Defines asset download progress data */
export interface AssetDownloadProgress {
    progress: string;
    content_id: string;
}
