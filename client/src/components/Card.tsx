import React, {useState} from "react";
import songImage from "../assets/download.jpeg";
import { faHeart, faWallet, faUserPlus, faPause, faPlay, faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { faHeart as outlineHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type cardProps = {
    songName: string,
    likes: number
}

const Card: React.FC = () => {
    const [like, setLike] = useState(false);
    const [pause, setPause] = useState(false);
    
    return (
        <div className="text-center bg-black border-0 rounded-xl m-4 text-white p-2">
            <img src={songImage} className="w-4/5 h-5/9 border-0 rounded-xl mx-auto mt-4" alt="song"/> 
            <div className="h-1/4 w-4/5 m-auto mt-2">
                <div className="text-2xl font-bold m-auto">Song Name</div>
                <div className="w-2/3 grid grid-cols-3 gap-4 m-auto mt-3">
                    <div className="text-center"><FontAwesomeIcon icon={faBackward}  size="xl" /></div>
                    <div className="text-center">{pause ? <FontAwesomeIcon icon={faPause}  size="xl" onClick={() => setPause(!pause)} /> : <FontAwesomeIcon icon={faPlay}  size="xl" onClick={() => setPause(!pause)} />}</div>
                    <div className="text-center"><FontAwesomeIcon icon={faForward}  size="xl" /></div>
                </div>
            </div>
            <div className="grid grid-cols-3 mx-auto my-5">
                <div className="text-center">{like ? <FontAwesomeIcon icon={faHeart} className="text-center" onClick={() => setLike(!like)} size="xl" /> : <FontAwesomeIcon icon={outlineHeart} onClick={() => setLike(!like)} size="xl" />}</div>
                <div className="text-center"><FontAwesomeIcon icon={faWallet} size="xl" /></div>
                <div className="text-center"><FontAwesomeIcon icon={faUserPlus} size="xl" /></div>
            </div>
        </div>
    )
}

export {Card};

// ------------------------------Commeneted styles--------------------------------
// const styles: Record<string, React.CSSProperties> = {
//     card: {
//         height: '40vh',
//         width: '30vh',
//         backgroundColor: '#03045e',
//         margin: '3vh',
//         paddingTop: '1vh',
//         borderRadius: '5%'
//     }, 
//     image: {
//         height: '15vh',
//         width: '25vh',
//         margin: '2.5vh',
//         borderRadius: '5%'
//     },
//     controls: {
//         height: '10vh',
//         width: '25vh',
//         margin: '2.5vh',
//         marginBottom: '0'
//     },
//     songName: {
//         color: '#ffffff',
//         fontSize: '20px',
//         fontWeight: 'bold'
//     },
//     icons: {
//         color: "#ffffff",
//         padding: '2vh'
//     }
// }