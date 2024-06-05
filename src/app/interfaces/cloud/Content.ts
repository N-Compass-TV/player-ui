import { PlaylistContentSchedule } from './PlaylistContentSchedule';

/** Content information, extending PiContent from earlier definition */
export interface Content {
    advertiserId: string;
    classification: string | null;
    contentCategory: number;
    contentId: string;
    contentPlaysListCount: string | null;
    createdBy: string | null;
    createdByName: string | null;
    creditsEnabled: number;
    dateCreated: string;
    dateUpdated: string | null;
    dealerId: string | null;
    description: string | null;
    duration: number;
    durationsTotal: number;
    feedId: string | null;
    fileName: string;
    fileType: string;
    filesize: string;
    fillerGroupName: string | null;
    frequency: string | null;
    handlerId: string;
    hostId: string;
    isActive: number;
    isConverted: number;
    isFullScreen: number;
    isProtected: string | null;
    ownerRoleId: number;
    ownerType: string | null;
    parentId: string | null;
    playlistContentCredits: string | null;
    playlistContentId: string;
    playlistContentsSchedule: PlaylistContentSchedule | null;
    playsTotal: number;
    prefix: string | null;
    previewThumbnail: string | null;
    refDealerId: string | null;
    seq: number;
    thumbnail: string | null;
    title: string;
    totalPlayed: number;
    url: string;
    uuid: string | null;
    progressWidthTracker: any;
}
