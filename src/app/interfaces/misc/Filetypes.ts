/** Allowed Image Types */
export type ImageTypes = 'JPEG' | 'JPG' | 'PNG' | 'jfif' | 'jpeg' | 'jpg' | 'png' | 'webp';

/** Allowed Video Types */
export type VideoTypes = 'MP4' | 'WEBM' | 'mp4' | 'webm';

/** Allowed Feed Types */
export type FeedTypes = 'feed';

/** Player supported image file types */
export const IMAGE_TYPES: ImageTypes[] = ['JPEG', 'JPG', 'PNG', 'jfif', 'jpeg', 'jpg', 'png', 'webp'];

/** Player supported video file types */
export const VIDEO_TYPES: VideoTypes[] = ['MP4', 'WEBM', 'mp4', 'webm'];

/** Player supported feed types */
export const FEED_TYPES: FeedTypes[] = ['feed'];
