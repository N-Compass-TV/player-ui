// Main interface for the player data
export interface PlayerData {
    piContents: PiContents;
    globalSettings: GlobalSetting[];
    rebootTime: RebootTime[];
    isCecEnabled: number;
    fastEdgeMonitoringTool: number;
    tvBrand: string;
}

// Detailed contents within the player data
export interface PiContents {
    screen: Screen;
    screenType: ScreenType;
    contents: Content[];
    dealer: Dealer;
    host: Host;
    template: any; // Undefined in the sample, specify as needed.
    createdBy: string | null;
    timezone: Timezone;
    licenses: any; // Undefined in the sample, specify as needed.
    piFieldGroupValues: any; // Undefined in the sample, specify as needed.
}

// Screen information
export interface Screen {
    screenId: string;
    screenName: string;
    description: string;
    dealerId: string;
    hostId: string;
    templateId: string;
    templateName: string | null;
    screenTypeId: string;
    createdBy: string;
    dateCreated: string;
    dateUpdated: string | null;
    licenseType: string | null;
    name: string | null;
}

// Screen type details
export interface ScreenType {
    screenTypeId: string;
    name: string;
    description: string;
    dateCreated: string;
    dateUpdated: string;
}

// Content information, extending PiContent from earlier definition
export interface Content {
    playlistContentId: string;
    contentId: string;
    dealerId: string | null;
    advertiserId: string;
    hostId: string;
    fileName: string;
    url: string;
    fileType: string;
    handlerId: string;
    dateCreated: string;
    uuid: string | null;
    isFullScreen: number;
    filesize: string;
    thumbnail: string | null;
    previewThumbnail: string | null;
    seq: number;
    frequency: string | null;
    parentId: string | null;
    duration: number;
    totalPlayed: number;
    isActive: number;
    isConverted: number;
    createdBy: string | null;
    createdByName: string | null;
    ownerType: string | null;
    title: string;
    description: string | null;
    classification: string | null;
    prefix: string | null;
    refDealerId: string | null;
    playlistContentsSchedule: PlaylistContentSchedule | null;
    playlistContentCredits: string | null;
    creditsEnabled: number;
    playsTotal: number;
    durationsTotal: number;
    feedId: string | null;
    isProtected: string | null;
    ownerRoleId: number;
    contentPlaysListCount: string | null;
    contentCategory: number;
    fillerGroupName: string | null;
    dateUpdated: string | null;
}

// Playlist content schedule details
export interface PlaylistContentSchedule {
    playlistContentsScheduleId: string;
    playlistContentId: string;
    type: number;
    liveStream: number;
    from: string;
    to: string;
    days: string;
    alternateWeek: number;
    playTimeStart: string | null;
    playTimeEnd: string | null;
    dateCreated: string;
    status: string;
}

// Dealer information
export interface Dealer {
    dealerId: string;
    generatedId: string | null;
    businessName: string;
    contactPerson: string | null;
    contactNumber: string | null;
    region: string | null;
    state: string | null;
    city: string | null;
    userId: string | null;
    dateCreated: string;
    dateUpdated: string | null;
    createdBy: string | null;
    updatedBy: string | null;
    status: string | null;
    address: string | null;
    zip: string | null;
    dealerType: string | null;
    licenseCount: number;
    dealerIdAlias: string | null;
    logo: string | null;
}

// Host information
export interface Host {
    hostId: string;
    dealerId: string | null;
    dealer: string | null;
    businessName: string | null;
    name: string;
    createdBy: string | null;
    latitude: string | null;
    longitude: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    region: string | null;
    storeHours: string;
    category: string | null;
    address: string | null;
    timeZone: string;
    notes: string | null;
    dealerIdAlias: string | null;
    vistarVenueId: string | null;
    others: string | null;
    logo: string | null;
    status: string | null;
    contactPerson: string | null;
    contactNumber: string | null;
    images: string | null;
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
    vistarNetworkId: string;
    vistarApiKey: string;
}

// Reboot times
export interface RebootTime {
    rebootTime: string;
}
