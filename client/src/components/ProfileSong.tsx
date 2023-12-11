import React from "react";
import {Song} from '../utils/types';

interface ProfileSongProps {
    song: Song
}

const ProfileSong: React.FC<ProfileSongProps> = ({ song }) => {
    return (
        <div className="p-4 lg:w-1/4 md:w-1/2">
            <div className="h-full flex flex-col items-center text-center">
                <img
                    alt="team"
                    className="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4"
                    src={"https://ipfs.io/ipfs/"+song.ipfs_hash_cover_img}
                    />
                <div className="w-full">
                    <h2 className="title-font font-medium text-lg text-white">
                        {song.title}
                    </h2>
                    <h3 className="text-gray-400 mb-3">{song.genre}</h3>
                </div>
            </div>
        </div>
    )
}

export {ProfileSong};