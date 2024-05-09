/**
 * This file defines the interface for data received from the .NET API.
 * Ensure this file is updated whenever new properties are added to maintain
 * alignment with the .NET API data hosted on AWS.
 */

// Main player data interface
export interface PlayerData {
    fastEdgeMonitoringTool: number;
    globalSettings: GlobalSetting[];
    isCecEnabled: number;
    piContents: PiContents;
    rebootTime: RebootTime[];
    tvBrand: string;
}

// Detailed contents within the player data
export interface PiContents {
    contents: Content[];
    createdBy: string | null;
    dealer: Dealer;
    host: Host;
    licenses: any;
    piFieldGroupValues: any;
    screen: Screen;
    screenType: ScreenType;
    screenZonePlaylistsContents: {
        contents: Content[];
        screenTemplateZonePlaylist: ScreenTemplateZone[];
    };
    template: any;
    timezone: Timezone;
}

// Defines the zone properties of a template
export class ScreenTemplateZone {
    background!: string;
    description!: string | null;
    height!: string;
    name!: string | null;
    order!: number;
    playlistDescription!: string | null;
    playlistId!: string;
    playlistName!: string | null;
    screenId!: string;
    screenTemplateZonePlaylistId!: string | null;
    templateId!: string;
    templateZoneId!: string | null;
    width!: string;
    xPos!: string;
    yPos!: string;
}

// Defines the screen information
export interface Screen {
    createdBy: string;
    dateCreated: string;
    dateUpdated: string | null;
    dealerId: string;
    description: string;
    hostId: string;
    licenseType: string | null;
    name: string | null;
    screenId: string;
    screenName: string;
    screenTypeId: string;
    templateId: string;
    templateName: string | null;
}

// Screen type details
export interface ScreenType {
    dateCreated: string;
    dateUpdated: string;
    description: string;
    name: string;
    screenTypeId: string;
}

// Content information, extending PiContent from earlier definition
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
}

// Playlist content schedule details
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

// Dealer information
export interface Dealer {
    address: string | null;
    businessName: string;
    city: string | null;
    contactNumber: string | null;
    contactPerson: string | null;
    createdBy: string | null;
    dateCreated: string;
    dateUpdated: string | null;
    dealerId: string;
    dealerIdAlias: string | null;
    dealerType: string | null;
    generatedId: string | null;
    licenseCount: number;
    logo: string | null;
    region: string | null;
    state: string | null;
    status: string | null;
    updatedBy: string | null;
    userId: string | null;
    zip: string | null;
}

// Host information
export interface Host {
    address: string | null;
    businessName: string | null;
    category: string | null;
    city: string | null;
    contactNumber: string | null;
    contactPerson: string | null;
    createdBy: string | null;
    dealer: string | null;
    dealerId: string | null;
    dealerIdAlias: string | null;
    hostId: string;
    images: string | null;
    latitude: string | null;
    logo: string | null;
    longitude: string | null;
    name: string;
    notes: string | null;
    others: string | null;
    postalCode: string | null;
    region: string | null;
    state: string | null;
    status: string | null;
    storeHours: string;
    timeZone: string;
    vistarVenueId: string | null;
}

// Timezone details
export interface Timezone {
    id: string;
    name: string;
    status: string;
}

// Global settings configuration
export interface GlobalSetting {
    id: number;
    vistarApiKey: string;
    vistarNetworkId: string;
}

// Reboot times
export interface RebootTime {
    rebootTime: string;
}
