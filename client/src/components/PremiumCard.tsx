import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
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

interface PremiumCardProps {
  genre: string
}

const PremiumCard: React.FC<PremiumCardProps> = ({ genre }) => {
  const [like, setLike] = useState(false);
  const [pause, setPause] = useState(false);
  const navigate = useNavigate();
  let login = useAccountContext() !== null;
  let subscribe = useAccountContext()?.premium;

  const handlePlay = () => {
    !login ? navigate("/signup") : !subscribe ? navigate("/subscribe") : navigate("/premiumsongs/" + genre)
  }
  const [image, setImage] = useState(genre === 'Jazz' ? Jazz : genre === 'HipHop' ? Hiphop : genre === 'Pop' ? Pop : genre === 'Classical' ? Classical : Rock);

  return (
    <>
      {/* <!-- CARD 1 --> */}
      <div className="bg-[#ebc247] shadow-lg rounded p-3">
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

            {/* <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <FontAwesomeIcon icon={faWallet} size="xl" />
            </button> */}
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between grid-cols-2 md:grid-cols-1 lg-grid-cols-2">
            <h3 className="text-black text-lg">{genre}</h3>
            
              <Chip
                label="Premium"
                color="primary"
                className="hover:bg-blue-500 cursor-pointer"
              />
          </div>
        </div>
      </div>
      {/* <!-- END OF CARD 1 --> */}
    </>
  );
};

export default PremiumCard;
