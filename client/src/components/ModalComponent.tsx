import React from "react";
import { Song } from "../utils/types";
import Jazz from '../assets/Jazz.jpeg'

interface ModalComponentProps {
    isOpen: boolean,
    onClose: React.Dispatch<React.SetStateAction<boolean>>
    song: Song
}

const ModalComponent: React.FC<ModalComponentProps> = ({isOpen, onClose, song}) => {
    return (
        <div>
          {
            isOpen && 
            <div className="text-center justify-center" onClick={() => onClose(false)}>
                    <div id="deleteModal" tabIndex={-1} aria-hidden="true" className="absolute z-50 justify-center items-center flex md:inset-0 h-modal md:h-full">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                {/* <!-- Modal content --> */}
                <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div>
                    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md my-4">
                      <img className="w-full h-48 object-cover" src={song.ipfs_hash_cover_img} alt="Song Cover" />
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-black mb-2">{song.title}</h2>
                        {
                          song.vocalist !== "" ? <div className="mb-2 text-black">
                          <span className="text-black=">Vocalist:</span> {song.vocalist}
                        </div> : <></>
                        }
                         {
                          song.lyricist !== "" ? <div className="mb-2 text-black">
                          <span className="text-black=">Lyricist:</span> {song.lyricist}
                        </div> : <></>
                        }
                         {
                          song.musician !== "" ? <div className="mb-2 text-black">
                          <span className="text-black=">Musician:</span> {song.musician}
                        </div> : <></>
                        }
                         {
                          song.audio_engineer !== "" ? <div className="mb-2 text-black">
                          <span className="text-black=">Audio Engineer:</span> {song.audio_engineer}
                        </div> : <></>
                        }
                      </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
          }
        </div>
    )
}

export {ModalComponent}