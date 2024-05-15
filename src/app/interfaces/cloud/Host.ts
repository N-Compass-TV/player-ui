/** Host information */
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
