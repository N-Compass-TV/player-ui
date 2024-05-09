export interface ProgressStep {
    title: string;
    subtitle: string;
    step: number;
}

export interface AssetDownloadProgress {
    progress: string;
    content_id: string;
}
