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

const PremiumCard = () => {
  const [like, setLike] = useState(false);
  const [pause, setPause] = useState(false);

  return (
    <>
      {/* <!-- CARD 1 --> */}
      <div className="bg-[#ffca28] shadow-lg rounded p-3">
        <div className="group relative">
          <img
            className="w-full md:w-72 block rounded"
            src="https://upload.wikimedia.org/wikipedia/en/f/f1/Tycho_-_Epoch.jpg"
            alt=""
          />
          <div className="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly">
            <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
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
            </button>

            <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
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

            <button className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <FontAwesomeIcon icon={faWallet} size="xl" />
            </button>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between">
            <h3 className="text-black text-lg">Epoch</h3>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Premium"
                color="primary"
                className="hover:bg-blue-500 cursor-pointer"
              />
            </Stack>
          </div>

          <p className="text-gray-900">Tycho</p>
        </div>
      </div>
      {/* <!-- END OF CARD 1 --> */}
    </>
  );
};

export default PremiumCard;
