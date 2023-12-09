import { Poll } from "./types";
import { Provider, Network } from "aptos";

export default async function fetchPolls(setPolls: React.Dispatch<React.SetStateAction<(Poll | null)[]>>) {
    
    const provider = new Provider(Network.TESTNET);
    const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST;

    let pollsResource: (Poll | null)[] = [];
    let pollResource;
    try {
        pollResource = await provider.getAccountResource(
            moduleAddress || "",
            `${moduleAddress}::community::Poll4PremiumPrice`,
            );
        pollsResource.push((pollResource as any).data);
    } catch (error) {
        pollsResource.push(null);
    }

    try {
        pollResource = await provider.getAccountResource(
            moduleAddress || "",
            `${moduleAddress}::community::Poll4ArtistPremiumCut`,
            );
        pollsResource.push((pollResource as any).data);
    } catch (error) {
        pollsResource.push(null);
    }

    try {
        pollResource = await provider.getAccountResource(
            moduleAddress || "",
            `${moduleAddress}::community::Poll4ArtistGenCut`,
            );
        pollsResource.push((pollResource as any).data);
    } catch (error) {
        pollsResource.push(null);
    }

    try {
        pollResource = await provider.getAccountResource(
            moduleAddress || "",
            `${moduleAddress}::community::Poll4ReportThreshold`,
            );
        pollsResource.push((pollResource as any).data);
    } catch (error) {
        pollsResource.push(null);
    }
    finally {
        setPolls(pollsResource);
    }
}