import React, { useState, useEffect } from "react";
import { Polls } from "../components/Polls";
import Timer from "../components/Timer";
import { Parameter } from "../components/Parameter";
import PollModal from "../components/PollModal";
import { CommunityParams } from "../utils/types";
import { Provider, Network } from "aptos";
import { Poll } from "../utils/types";

const styles = {
    gradientDiv: {
      background: 'linear-gradient(to bottom, #030712, #0d1733)', // Adjust colors as needed
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white', // Text color on the gradient background
    },
  };

const Community: React.FC = () => {
    const [votes, setVotes] = useState({for:3, against:2});
    const [polls, setPolls] = useState<(Poll | null)[]>([null, null, null, null]);
    const [params, setParams] = useState<CommunityParams | null>(null);
    const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST || "";
    const provider = new Provider(Network.TESTNET);

    const fetchCommunityParams = async () => {
        try {
          const commParams = await provider.getAccountResource(
            moduleAddress,
            `${moduleAddress}::community::CommunityParams`,
            );
            console.log(commParams.data);
            setParams((commParams as any).data);
        } catch (error) {
          console.log(error);
        }
    };

    const fetchPolls = async () => {
        let pollsResource: (Poll | null)[] = [];
        let pollResource;
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
                `${moduleAddress}::community::Poll4PremiumPrice`,
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
            // console.log(pollsResource);
            setPolls(pollsResource);
        }
    }
    // fetchCommunityParams();
    // export interface CommunityParams {
    //     artist_premium_cut: number,
    //     artist_gen_cut: number,
    //     premium_price: number,
    //     report_threshold: number,
    // }
    useEffect(() => {
        fetchPolls();
        // fetchCommunityParams();
    }, []);

    useEffect(() => {
        console.log(polls);
        fetchCommunityParams();
    }
    , [polls]);

    return (
        <div className="text-center p-4 " style={styles.gradientDiv}>
            {/* Parameters */}
            <div className="grid md:grid-cols-4 sm:grid-cols-2 lg:w-3/4 m-auto">
                <Parameter title= "Premium Subscription Price" value= { params ? (params?.premium_price / 100000000).toString()+" APT" : "1 APT"} />
                <Parameter title= "Artists' cut on subscription" value= { params ? params?.artist_premium_cut.toString()+"%" : "60%"} />
                <Parameter title= "Artist's cut on tips" value= { params ? params?.artist_gen_cut.toString()+"%" : "90%"} />
                <Parameter title= "Report Threshold" value= { params ? params?.report_threshold.toString() : "20"} />
            </div>
            <PollModal setPolls={setPolls} polls={polls} />
            {/* <Polls question="What is your faviorite Song" options={["Tu hai Kahan", "Rap God", "Sham", "Faded"]} time={10} votes={10} optionVotes={[2, 2, 3, 3]} /> */}
            {
                <div>
                {polls.map((pollItem, index) => (
                  <div key={index}>
                    {pollItem !== null ? <Polls question={pollItem.justification} proposed_value={pollItem.proposed_value} time={pollItem.end_time} votes_for={pollItem.votes_for} votes_against={pollItem.votes_against} setPolls={setPolls} polls={polls} index={index} voters={pollItem.voters} /> : <></>}
                  </div>
                ))}
                </div>
            }
            
        </div>
    )
}

export {Community}