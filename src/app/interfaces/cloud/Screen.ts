/** Defines the screen information */
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
