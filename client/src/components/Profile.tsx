import React, { useState, useEffect } from "react";
import ladyMusic from "../assets/ladyMusic.png";
import { useNavigate, useParams } from "react-router-dom";
import { useAccountContext } from "../utils/context";
import getUserAccount from "../utils/getUserAccount";
import { Account } from "../utils/types";
import EditModal from "./EditModal";
import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from 'axios';
import { ProfileSong } from "./ProfileSong";
import { Chip } from "@mui/material";

interface ProfileProps {
}

interface SongResourceData {
  artist_address: string;
  num_songs: number;
  songs: { [handle: string]: SongDetails }; 
}


interface SongDetails {
  // Define the structure of each song
  song_store_ID: number;
  artist_store_ID: number;
  artist_wallet_address: string;
  title: string;
  ipfs_hash: string;
  ipfs_hash_cover_img: string;
  total_tips: number;
  premium: boolean;
  genre: string;
  vocalist: string;
  lyricist: string;
  musician: string;
  audio_engineer: string;
  reports: number;
  reporters: string[]; 
}

const Profile: React.FC<ProfileProps> = ({}) => {  
  const [songArray, setSongArray] = useState<SongDetails[]>([]);
  const [sub, setSub] = useState(true);
  const styles = {
    premium: {
      backgroundColor: sub ? '#f0c44c' : "white"
    }
  }
  const navigate = useNavigate();
  let [userAcc, setUserAcc] = useState<Account | null>(useAccountContext());
  let {address} = useParams();
  const provider = new Provider(Network.TESTNET);
  const [formData, setFormData] = useState({
    location: "",
    profession: "",
    aboutMe: "",
    selectedImage: ""
  });
  const [show, setShow] = useState(false);
  const getAcc = async () => {
    if(address){
      const acc = await getUserAccount(address);
      console.log(acc);
      if(typeof(acc) !== "number"){
        setUserAcc(acc);
      }
    } 
  }
  useEffect(() => {
    getAcc();
  }, [address]);
  const { account } = useWallet();
  const fetchList = async () => {
    //let address=useWallet();
    console.log(account?.address);
    const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST;
    try {
      const SongResource = await provider.getAccountResource(
        account?.address?? '',
        `${moduleAddress}::song::ArtistStore`
      );
      console.log('SongResource:', SongResource);
      //after songs fetch from particular artist required
      const data = SongResource.data as SongResourceData;

      console.log(`Artist Address: ${data.artist_address}`);
      console.log(`Number of Songs: ${data.num_songs}`);

      Object.keys(data.songs).forEach((handle) => {
          const songDetails = data.songs[handle] as SongDetails;
          setSongArray((prev) => {
            return (
              [...prev, songDetails]
            )
          })
          console.log(`Handle: ${handle}, Song Details: `, songDetails);
      });
    } catch (e: any) {
      console.log(e);
    }
  };
  
  useEffect(() => {
    fetchList();
  }, [address]);
  
  return (
    <main className="profile-page md:py-10 text-black">
      <section className="relative block h-[500px]">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80')",
          }}
        >
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-50 bg-black"
          ></span>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style={{ transform: "translateZ(0px)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg -mt-64" style={styles.premium}>
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <img
                      alt="ladymusic"
                      src={`https://ipfs.io/ipfs/bafkreifdj3wvyuqaue7zsro7tz5judci2m42pbddcbo2sgqtogxr7rq6wa`}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    
                      <button
                      className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      type="button" 
                      onClick={() => setShow(true)}
                    >
                      Edit Bio
                    </button>
                  </div>
                  <EditModal isOpen={show} onClose={() => setShow(false)} formData={formData} setFormData={setFormData} />
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1 my-4">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        22
                      </span>
                      <span className="text-sm text-blueGray-400">Total Tips Received</span>
                    </div>
                    {/* <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        10
                      </span>
                      <span className="text-sm text-blueGray-400">Photos</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        89
                      </span>
                      <span className="text-sm text-blueGray-400">
                        Comments
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="text-center mt-5">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                  {userAcc?.name}
                </h3>
                {sub ? <Chip
                label="Premium"
                color="primary"
                className="hover:bg-blue-500 cursor-pointer"
              /> : <></>}
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {userAcc?.bio.location !== "" ? userAcc?.bio.location : "Bangalore, India"}
                  
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                  {userAcc?.bio.profession !== "" ? userAcc?.bio.profession : "Influencer / Artist"}
                </div>
                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                  
                </div>
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      {userAcc?.bio.about !== "" ? userAcc?.bio.about : "An artist who loves to sing and dance."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------Music cards------------------------- */}

      <section className="text-gray-600 body-font text-white">
        <div className="container px-5 py-10 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="text-4xl text-white font-medium title-font mb-4 text-gray-900">
              Songs
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
              gentrify, subway tile poke farm-to-table. Franzen you probably
              haven't heard of them.
            </p>
          </div>
          <div className="flex flex-wrap m-4">


            
              {songArray.map((song: SongDetails, index) => (
                <div key={index}>
                  <ProfileSong song={song} />
                </div>
              ))}
            
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
