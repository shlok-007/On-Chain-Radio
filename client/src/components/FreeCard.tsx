import React, { useState } from "react";
import {
  faHeart,
  faWallet,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as outlineHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useAccountContext } from "../utils/context";
import Jazz from '../assets/Jazz.jpeg'
import Classical from '../assets/Classical.jpeg'
import Hiphop from '../assets/Hip hop.jpeg'
import Rock from '../assets/Rock.jpeg'
import Pop from '../assets/Pop.jpeg'
import newArrivals from '../assets/newarrivals.jpg'
import trending from '../assets/trending.png'

interface FreeCardProps {
  genre: string
}

const categoryMap = new Map([
  ['Rock', 'rock'],
  ['Pop', 'pop'],
  ['HipHop', 'hiphop'],
  ['Classical', 'classical'],
  ['Jazz', 'jazz'],
  ['Trending Now', 'trending'],
  ['New Arrivals', 'newarrivals']
])

const FreeCard: React.FC<FreeCardProps> = ({genre}) => {
  const [like, setLike] = useState(false);
  const [pause, setPause] = useState(false);
  const navigate = useNavigate();
  let login = useAccountContext() !== null;
  const handlePlay = () => {
    login ? navigate("/playsongs/"+categoryMap.get(genre)) : navigate("/signup")
  }
  const [image, setImage] = useState(genre === 'Jazz' ? Jazz : genre === 'HipHop' ? Hiphop : genre === 'Pop' ? Pop : genre === 'Classical' ? Classical : genre === 'Rock' ? Rock : genre === 'Trending Now' ? trending : newArrivals );
  return (
    <>
      {/* <!-- CARD 1 --> */}
      <div className="bg-gray-900 shadow-lg rounded p-3">
        <div className="group relative">
          <img
            className="w-full md:w-72 block rounded h-64"
            src={image}
            alt=""
          />
          <div className="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly">
            {/* <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              {like ? (
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-center"
                  onClick={() => setLike(!like)}
                  size="xl"
                />
              ) : (
                <FontAwesomeIcon
                  icon={outlineHeart}
                  onClick={() => setLike(!like)}
                  size="xl"
                />
              )}
            </button> */}

            <button onClick={handlePlay} className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              {pause ? (
                <FontAwesomeIcon
                  icon={faPause}
                  size="2xl"
                  onClick={() => setPause(!pause)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPlay}
                  size="2xl"
                  onClick={() => setPause(!pause)}
                />
              )}
            </button>
{/* 
            <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <FontAwesomeIcon icon={faWallet} size="xl" />
            </button> */}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-white text-lg">{genre}</h3>
        </div>
      </div>
      {/* <!-- END OF CARD 1 --> */}
    </>
  );
};

export default FreeCard;
