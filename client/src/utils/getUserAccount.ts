import {AccountInfo}  from '@aptos-labs/wallet-adapter-core';
import { Provider, Network } from 'aptos';

export default async function getUserAccount(address: string | null) {

    const provider = new Provider(Network.TESTNET);

    if (!address) {
        return -1;
    }
    try {
        const accountResource = await provider.getAccountResource(
        address,
        `${process.env.REACT_APP_MODULE_ADDR_TEST}::user::Account`,
        );
        let userAccount = {
        wallet_address: (accountResource as any).data.wallet_address,
        name: (accountResource as any).data.name,
        email: (accountResource as any).data.email,
        bio: {
            location: (accountResource as any).data.bio.location,
            profession: (accountResource as any).data.bio.profession,
            about: (accountResource as any).data.bio.about,
        },
        premium: (accountResource as any).data.premium,
        subscription_expiry: (accountResource as any).data.subscription_expiry,
        public_key: ""
        }
        return userAccount;
    } catch (e: any) {
        return 0;
    }
}