/** Dealer information */
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
