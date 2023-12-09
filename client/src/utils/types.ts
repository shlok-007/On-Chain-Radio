export interface Account {
    wallet_address: string;
    name: string;
    email: string,
    bio: Bio,
    premium: boolean,
    subscription_expiry: number,
    public_key: string | string[],
}

export interface Bio {
    location: string,
    profession: string,
    about: string,
}

export interface CommunityParams {
    artist_premium_cut: number,
    artist_gen_cut: number,
    premium_price: number,
    report_threshold: number,
}

export interface Poll {
    proposed_cut: number,
    justification: string,
    votes_for: number,
    votes_against: number,
    end_time: number,
    voters: string[]
}