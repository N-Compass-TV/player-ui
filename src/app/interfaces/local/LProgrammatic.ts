export interface LProgrammaticAdsResponse {
    status: string;
    data: LProgrammaticAd[];
}

export interface LProgrammaticAd {
    id: string;
    creative_name: string;
    creative_url: string;
    creative_source: string;
    creative_type: string;
    duration: number;
    proof_of_play: string;
    played: number;
}
