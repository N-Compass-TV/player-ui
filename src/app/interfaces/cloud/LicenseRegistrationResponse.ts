export interface LicenseRegistrationResponse {
    licenseInfo: LicenseInfo;
    screenType: ScreenType;
}

export interface LicenseInfo {
    licenseId: string;
    licenseKey: string;
    macAddress: string;
    isRegistered: number;
    isActivated: number;
    dealerId: string;
    hostId: string;
    dateCreated: string;
    internetType: string;
    internetSpeed: string;
    memory: string;
    totalStorage: string;
    freeStorage: string;
    dateUpdated: string;
    contentsUpdated: string;
    playerSocketId: string | null;
    piSocketId: string;
    playerStatus: number;
    piStatus: number;
    sequence: number;
    alias: string;
    timeIn: string;
    timeOut: string;
    anydeskId: string;
    appVersion: string;
    playerUiKey: string | null;
    playerAssetServerKey: string | null;
    installDate: string;
    internetInfo: string;
    screenshot: string;
    displayStatus: number;
    serverVersion: string;
    uiVersion: string;
    screenshotSettings: number;
    speedtestSettings: number;
    displayControlSettings: number;
    resourceSettings: number;
    bootDelay: number;
    emailSettings: number;
    notificationSettings: number;
    tvDisplaySettings: number;
    rebootTime: string;
    isCecEnabled: number;
    isCecCtlEnabled: number | null;
    fastEdgeMonitoringTool: number;
    tvBrand: string;
    publicIP: string;
    prevPublicIP: string;
    installRequestDate: string | null;
    backgroundImageUrl: string | null;
}

export interface ScreenType {
    screenTypeId: string;
    name: string;
    description: string;
    dateCreated: string;
    dateUpdated: string;
}
