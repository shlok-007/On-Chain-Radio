import { useState } from "react";
import ladyMusic from "../assets/ladyMusic.png";
import { Navbar } from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as outlineHeart } from "@fortawesome/free-regular-svg-icons";
import TipModal from "../components/TipModal";
import { useLocation } from "react-router-dom";

const SongDetails = () => {
  const [like, setLike] = useState(false);
  const location = useLocation();
  const genre = location.state?.id || 'No genre Selected';
  console.log(genre)

  return (
    <div className="h-screen bg-[#7CA4AE] ">
      <Navbar />

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
              <h1 className="text-3x font-bold text-[#7CA4AE]">
                Melody (feat. Laura Brehm)
              </h1>
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
                  <TipModal />
                <button>
                  <FontAwesomeIcon
                    icon={faHeart}
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

export default SongDetails;
