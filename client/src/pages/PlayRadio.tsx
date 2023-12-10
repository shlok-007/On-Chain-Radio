import { useState, useEffect } from "react";
import ladyMusic from "../assets/ladyMusic.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faFlag } from "@fortawesome/free-solid-svg-icons";
import TipModal from "../components/TipModal";
import { useParams, useNavigate } from "react-router-dom";
import { Song } from "../utils/types";
import { useAccountContext } from "../utils/context";
import { Provider, Network } from "aptos";

interface PlayRadioProps {
  premium: boolean;
}

// export interface Song {
//   song_store_ID: number,
//   artist_store_ID: number,
//   artist_wallet_address: string,
//   title: string,
//   ipfs_hash: string,
//   ipfs_hash_cover_img: string,
//   total_tips: number,
//   premium: boolean,
//   genre: string,
//   vocalist: string,
//   lyricist: string,
//   musician: string,
//   audio_engineer: string,
//   reports: number,
//   reporters: string[],
// }

const PlayRadio: React.FC<PlayRadioProps> = ({premium}) => {
  const [like, setLike] = useState(false);
  const navigate = useNavigate();
  const {genre} = useParams();
  const provider = new Provider(Network.TESTNET);
  const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST as string;
  const genreMap = new Map<string, string>([
    ["rock", "Rock"],
    ["pop", "Pop"],
    ["hiphop", "HipHop"],
    ["classical", "Classical"],
    ["jazz", "Jazz"]
  ]);

  const [authorized, setAuthorized] = useState(true);
  const [currentSong, setCurrentSong] = useState<Song>({
    song_store_ID: 0,
    artist_store_ID: 0,
    artist_wallet_address: "",
    title: "The Fat Rat",
    ipfs_hash: "",
    ipfs_hash_cover_img: "",
    total_tips: 0,
    premium: false,
    genre: "",
    vocalist: "Laura Brehm",
    lyricist: "",
    musician: "",
    audio_engineer: "",
    reports: 0,
    reporters: [],
  });

  const fetchSong = async () => {
    if(genre === undefined) return;
    let song_lib_type;
    if(premium) {
      song_lib_type = "premium_songs";
    }
    else{
      if(genre === "newarrivals") song_lib_type = "new_arrivals";
      else if(genre === "trending") song_lib_type = "trending_songs";
      else song_lib_type = "free_songs";
    }
    let seed = Math.floor(Date.now() / 120000);
    let songStore;
    try{
      songStore = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::songStore::SongStore`,
      );
    } catch(e){
      console.log(e);
      alert("Error fetching song store");
      return;
    }

    let songTableHandle;
    let num_songs;
    if( song_lib_type === "free_songs" || song_lib_type === "premium_songs") {
      let songLib;
      if( song_lib_type === "free_songs") {
        songLib = (songStore as any).data.free_songs;
      }
      else {
        songLib = (songStore as any).data.premium_songs;
      }
      // console.log(songLib);
      let genreHandle = songLib.songs.handle;
      let genreItem = {
        key_type: "0x1::string::String",
        value_type: `${moduleAddress}::songStore::Genre`,
        key: genreMap.get(genre),
      }
      // console.log(genreHandle);
      // console.log(genreItem);
      try{
        let songTable = await provider.getTableItem(genreHandle, genreItem);
        songTableHandle = (songTable as any).songs.handle;
        num_songs = (songTable as any).num_songs;
        // console.log(songTableHandle);
      } catch(e){
        console.log(e);
        return;
      }
    } else {
      if(song_lib_type === "new_arrivals") {
        songTableHandle = (songStore as any).data.new_arrivals.songs.handle;
        num_songs = (songStore as any).data.new_arrivals.num_songs;
      } else {
        songTableHandle = (songStore as any).data.trending_songs.songs.handle;
        num_songs = (songStore as any).data.trending_songs.num_songs;
      }
      // console.log(songTableHandle);
    }
    console.log(num_songs);
    let songIndex = seed % num_songs;
    
  }

  // useEffect(() => {
  //   fetchSong();
  // }, []);

  return (
    <div className="h-screen bg-[#7CA4AE] ">
      <div className="bg-[#7CA4AE] font-sans grid place-items-center py-12">
        <div className="bg-gray-800 md:grid md:grid-cols-2 rounded-md overflow-hidden mx-2 ">


          {/* --------------------------------cover image------------------------------- */}
          <div>
            <img
              src={ladyMusic}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>


          {/* -------------------------------------details---------------------------------- */}
          <div className="text-center bg-black text-gray-200">
            <div className="px-10 py-12">
              {/* ----title-------- */}
              <a href="" onClick={() => navigate('/profile', {state:{username: "user"}})} className="text-3x font-bold text-[#7CA4AE]">
                Melody (feat. Laura Brehm)
              </a>
              <h2 className="text-2xl font-bold mt-3">The Fat Rat</h2>

              {/* -----------------controls---------------- */}
              <div className=" py-4 md:py-12 flex items-center justify-around text-[#7CA4AE] px-5">
                {/* ---------previous button------------- */}
                <button className="control-button">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <g fill="none">
                      <path
                        d="M2.75 20a1 1 0 1 0 2 0V4a1 1 0 1 0-2 0v16z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M20.75 19.053c0 1.424-1.612 2.252-2.77 1.422L7.51 12.968a1.75 1.75 0 0 1 .075-2.895l10.47-6.716c1.165-.748 2.695.089 2.695 1.473v14.223z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </button>

                {/* ---------Play/pause button--------- */}
                <button className="control-button">
                  <svg className="w-9 h-9" viewBox="0 0 36 36">
                    <rect
                      className="clr-i-solid clr-i-solid-path-1"
                      x="3.95"
                      y="4"
                      width="11"
                      height="28"
                      rx="2.07"
                      ry="2.07"
                      fill="currentColor"
                    ></rect>
                    <rect
                      className="clr-i-solid clr-i-solid-path-2"
                      x="20.95"
                      y="4"
                      width="11"
                      height="28"
                      rx="2.07"
                      ry="2.07"
                      fill="currentColor"
                    ></rect>
                  </svg>
                </button>

                {/* ---------next button--------- */}
                <button className="control-button">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <g fill="none">
                      <path
                        d="M21 4a1 1 0 1 0-2 0v16a1 1 0 1 0 2 0V4z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M3 4.947c0-1.424 1.612-2.252 2.77-1.422l10.47 7.507a1.75 1.75 0 0 1-.075 2.895l-10.47 6.716C4.53 21.39 3 20.554 3 19.17V4.947z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </button>
              </div>

              {/* -------------silder music duration------------ */}
              <div className="flex items-center gap-5 my-4 md:mb-8">
                <div className="text-sm opacity-80">00:00</div>
                <div className="relative bg-gray-800 w-full h-2 rounded">
                  <div
                    id="progress-slider"
                    className="absolute top-0 left-0"
                  ></div>
                  <input type="range" className="slider" />
                </div>
                <div className="text-sm opacity-80">04:30</div>
              </div>


              {/* -------------------------------Like and Tip buttons------------------------------ */}
              <div className="pt-8 md:py-12 flex items-center justify-around text-[#7CA4AE] px-5">
                <button>
                <FontAwesomeIcon
                      icon={faCircleInfo}
                      className="text-center"
                      onClick={() => setLike(!like)}
                      size="xl"
                    />
                </button>
                  <TipModal />
                <button>
                  <FontAwesomeIcon
                    icon={faFlag}
                    className="text-center"
                    size="xl"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayRadio;