import { FeedTypes, ImageTypes, VideoTypes } from '@interfaces/misc';

/** Player supported image file types */
export const IMAGE_TYPES: ImageTypes[] = [
    'JPEG',
    'JPG',
    'PNG',
    'jfif',
    'jpeg',
    'jpg',
    'png',
    'webp',
    'image/png',
    'image/jpg',
    'image/jpeg',
];

/** Player supported video file types */
export const VIDEO_TYPES: VideoTypes[] = ['MP4', 'WEBM', 'mp4', 'webm', 'video/mp4', 'video/webm'];

/** Player supported feed types */
export const FEED_TYPES: FeedTypes[] = ['feed'];
