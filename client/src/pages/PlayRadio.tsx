import React, { useState, useEffect } from "react";
import ladyMusic from "../assets/ladyMusic.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faFlag } from "@fortawesome/free-solid-svg-icons";
import TipModal from "../components/TipModal";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Song } from "../utils/types";
import { useAccountContext } from "../utils/context";
import { Provider, Network } from "aptos";

interface PlayRadioProps {
  premium: boolean;
}

const PlayRadio: React.FC<PlayRadioProps> = ({premium}) => {
  const [like, setLike] = useState(false);
  const navigate = useNavigate();  
  const {genre} = useParams();
  const provider = new Provider(Network.TESTNET);
  const moduleAddress = process.env.REACT_APP_MODULE_ADDR_TEST as string;
  const isUserPremium = useAccountContext()?.premium || false;
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

  const seed = Math.floor(Date.now() / 120000);
  const [songTableHandle, setSongTableHandle] = useState("");
  const [num_songs, setNumSongs] = useState(0);
  const [songIndex, setSongIndex] = useState(-1);
  const [key_type, setKeyType] = useState("");
  const [duration, setDuration] = useState<string>('00:00');
  const [playbakTime, setPlaybackTime] = useState('00:00');
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const audioPlayerRef = React.createRef<HTMLAudioElement>();

  useEffect(() => {
    const setSong = async () => {
      // let gatewayToken = process.env.REACT_APP_PINATA_GATEWAY_TOKEN;
      // const url = `https://red-personal-python-426.mypinata.cloud/ipfs/${currentSong.ipfs_hash}?pinataGatewayToken=${gatewayToken}`;
      if(currentSong.artist_wallet_address === "") return;
      // console.log(currentSong);
      const url = `https://ipfs.io/ipfs/${currentSong.ipfs_hash}`
      console.log(url);
      // setAudioUrl(url);
      if (audioPlayerRef.current) audioPlayerRef.current.src = url;
  };
    setSong();
  }, [currentSong]);

  useEffect(() => {
    if (audioPlayerRef.current) {

      // console.log(audioPlayerRef.current);
      // Event listener for when the browser estimates it can play through the entire media
      audioPlayerRef.current.addEventListener('loadedmetadata', () => {
        const totalSeconds = audioPlayerRef.current?.duration || 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        // console.log(`Audio duration: ${minutes}:${seconds.toString().padStart(2, '0')}`);
        setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      });

      const updateSlider = () => {
        if (audioPlayerRef.current) {
          const currentTime = audioPlayerRef.current.currentTime;
          const duration = audioPlayerRef.current.duration;
          let minutes = Math.floor(currentTime / 60);
          let seconds = Math.floor(currentTime % 60);
          const progressPercentage = (currentTime / duration) * 100;
          setPlaybackProgress(progressPercentage);
          setPlaybackTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      };
  
      audioPlayerRef.current.addEventListener('timeupdate', updateSlider);

      audioPlayerRef.current.addEventListener('ended', () => {
        console.log("Song ended");
        // setSongIndex(-1);
        fetchSong();
      });


      return () => {
        if(audioPlayerRef.current){
          audioPlayerRef.current.removeEventListener('loadedmetadata', () => {});
          audioPlayerRef.current.removeEventListener('timeupdate', updateSlider);
          audioPlayerRef.current.removeEventListener('ended', () => {});
          // audioPlayerRef.current.removeEventListener('canplaythrough', () => {})
        };
      }

  };
}, [audioPlayerRef]);

  const fetchSongHandle = async () => {
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

    if( song_lib_type === "free_songs" || song_lib_type === "premium_songs") {
      let songLib;
      setKeyType("u64");
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
      console.log("genreTableHandle",genreHandle);
      // console.log(genreItem);
      try{
        let songTable = await provider.getTableItem(genreHandle, genreItem);
        setNumSongs((songTable as any).num_songs);
        setSongTableHandle((songTable as any).songs.handle);
        console.log("Genre",songTable);
      } catch(e){
        console.log(e);
        return;
      }
    } else {
      setKeyType("u8");
      if(song_lib_type === "new_arrivals") {
        setNumSongs((songStore as any).data.new_arrivals.num_songs);
        setSongTableHandle((songStore as any).data.new_arrivals.songs.handle);
      } else {
        setNumSongs((songStore as any).data.trending_songs.num_songs);
        setSongTableHandle((songStore as any).data.trending_songs.songs.handle);
      }
    }
    // console.log(num_songs);
    // console.log(songTableHandle);
  }

  const fetchSong = async () => {
    if(songTableHandle === "" || num_songs === 0) return;
    let sidx;
    if(songIndex === -1){  setSongIndex(seed % num_songs); sidx = seed % num_songs; }
    else {setSongIndex((songIndex + 1) % num_songs); sidx = (songIndex + 1) % num_songs;}

    // console.log(seed);
    // console.log(sidx);
    // console.log(num_songs);
    // console.log(key_type);
    // console.log(songTableHandle);

    try{
    let songData = await provider.getTableItem(songTableHandle, {
      key_type: key_type,
      value_type: `${moduleAddress}::songStore::Song`,
      key: key_type === "u8" ? sidx : `${sidx}`  // Uncomment later
      // key: 4
      });
      setCurrentSong((songData as any));
      if(songData.premium && !isUserPremium) setAuthorized(false);
      else setAuthorized(true);
      // console.log(songData);
    } catch(e){
      console.log(e);}
  }

  useEffect(() => {
    fetchSongHandle();
  }, []);

  useEffect(() => {
    fetchSong();
  }, [songTableHandle]);

  return (
    <div className="h-screen bg-[#7CA4AE] ">
      <div className="bg-[#7CA4AE] font-sans grid place-items-center py-12">
        <div className="bg-gray-800 md:grid md:grid-cols-2 rounded-md overflow-hidden mx-2 ">


          {/* --------------------------------cover image------------------------------- */}
          <div>
            <img
              src={`https://ipfs.io/ipfs/${currentSong.ipfs_hash_cover_img}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>


          {/* -------------------------------------details---------------------------------- */}
          <div className="text-center bg-black text-gray-200">
            <div className="px-10 py-12">
              {/* ----title-------- */}
              <h2 className="text-2xl font-bold mt-3">{currentSong.title}</h2>
              <a href="" onClick={() => navigate('/profile', {state:{username: "user"}})} className="text-3x font-bold text-[#7CA4AE]">
                {`by ${currentSong.vocalist}`}
              </a>

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

              {/* <audio ref={audioPlayerRef} controls autoPlay>
              <source src={audioUrl} type="audio/mp3" />Your browser does not support the audio element.
              </audio>  */}
              

              <audio ref={audioPlayerRef} 
              autoPlay 
              // controls
              muted = {!authorized}
              // style={{ display: 'none' }}
              >
              <source src="" type="audio/mp3" />
              {/* <source src="https://ipfs.io/ipfs/bafybeifc2tqqiltfieu7jwesvc4rq4xbzxxlgv5u7akqwbawdz5kyksatm" type="audio/mp3" /> */}
              Your browser does not support the audio element.
              </audio>

              <div className="flex items-center gap-5 my-4 md:mb-8">
                <div className="text-sm opacity-80">{playbakTime}</div>
                <div className="relative bg-gray-800 w-full h-2 rounded">
                  <div id="progress-slider" className="absolute top-0 left-0"></div>
                  <input type="range" className="slider" 
                  value={playbackProgress} 
                  disabled
                  />
                </div>
                <div className="text-sm opacity-80">{duration}</div>
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