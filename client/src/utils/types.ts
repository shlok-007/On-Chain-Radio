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