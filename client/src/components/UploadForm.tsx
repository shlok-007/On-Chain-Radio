import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';
import { useWallet, AptosWalletProviderProps } from "@aptos-labs/wallet-adapter-react";
import ImageUpload from "./ImageUpload";
import AudioUpload from "./AudioUpload";

const UploadForm: React.FC = () => {
    const [pinnedFiles, setPinnedFiles] = useState([]);
    const [pinnedFiles1, setPinnedFiles1] = useState([]);
    const [file, setFile] = useState<File | null>(null);
    const [song,setSong] =useState("");
    const [vocalist,setVocalist] =useState("");
    const [lyricist,setlyricist] =useState("");
    const [musician,setMusician] =useState("");
    const [audio,setAudio] =useState("");
    const [genre,setGenre] =useState("");
    const [pre,setPre] =useState(false);
    const [ipfsimage,setIpfsimage] =useState("");
    const [ipfsaudio,setIpfsaudio] =useState(""); 
    const pinataConfig = {
        root: 'https://api.pinata.cloud',
        headers: { 
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_API_SECRET
        }
    };
    
    const testPinataConnection = async() => {
      try {
        const url =`${pinataConfig.root}/data/testAuthentication`
        const res = await axios.get(url, {headers: pinataConfig.headers});
        console.log(res.data);
      } catch (error) {
        console.log(error)
      }
    }

    const queryPinataFiles = async () => {
        try {
          const url = `${pinataConfig.root}/data/pinList?status=pinned`;
          const response = await axios.get(url, pinataConfig);
          //console.log(response.data.rows)
          setPinnedFiles(response.data.rows);
        } catch (error) {
          console.log(error)
        }
      };

      const queryPinataFiles1 = async () => {
        try {
          const url = `${pinataConfig.root}/data/pinList?status=pinned`;
          const response = await axios.get(url, pinataConfig);
          //console.log(response.data.rows)
          setPinnedFiles1(response.data.rows);
        } catch (error) {
          console.log(error)
        }
      };

    const handleclick = async () => {
        try {
          //console.log(file);
          if (file) {
            const formData = new FormData();
            // console.log(file)
            formData.append('file', file);
            const pinataBody = {
              options: {
                cidVersion: 1,
              },
              metadata: {
                name: file.name,
              }
            }
            formData.append('pinataOptions', JSON.stringify(pinataBody.options));
            formData.append('pinataMetadata', JSON.stringify(pinataBody.metadata));
            const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
            const response = await axios({
              method: 'post',
              url: url,
              data: formData,
              headers: pinataConfig.headers
            })
            console.log(response.data)
            if(file.type === "image/png")
            setIpfsimage(response.data.IpfsHash);
            else 
            setIpfsaudio(response.data.IpfsHash);
            queryPinataFiles();
          } else {
            alert('select file first')
          }
        } catch (error) {
          console.log(error)
        }
      }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      console.log(selectedFile);
      if (selectedFile) {
          setFile(selectedFile);
      }
    };

    useEffect(() => {
      if(file !== null)
        handleclick();
    } ,[file]);

    const {wallet} = useWallet();

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // console.log(genre);
        // console.log(ipfsaudio);
        // console.log(ipfsimage);
        console.log(pre);
        e.preventDefault();
        if (!wallet) {
          alert("Please connect your wallet");
          return;
        }
        const moduleAddress=process.env.REACT_APP_MODULE_ADDR_TEST;
        try {
          const payload = {
            type: "entry_function_payload",
            function: `${moduleAddress}::song::upload_song`,
            arguments: [song,ipfsaudio,ipfsimage,pre,genre,vocalist,lyricist,musician,audio],
            type_arguments: [],
          };
        // sign and submit transaction to chain
        await window.aptos.signAndSubmitTransaction(payload);
        } catch (error) {
          console.error("Failed to connect wallet", error);
        }
      };

    return (
        <div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="md:px-10 sm:px-5 py-5 md:col-span-2">
                    <label className="block text-left m-2">Song name:</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: Dandelions etc." onChange={(e)=>{ setSong(e.target.value) }}></input>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Vocalist</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: AUR etc." onChange={(e)=>{ setVocalist(e.target.value) }}></input>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Lyricist</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: AUR etc." onChange={(e)=>{ setlyricist(e.target.value) }}></input>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Musician</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: AUR etc." onChange={(e)=>{ setMusician(e.target.value) }}></input>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Audio_Engineer</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: AUR etc." onChange={(e)=>{ setAudio(e.target.value) }}></input>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Genre of the Song:</label>
                    <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e)=>{ setGenre(e.target.value) }}>
                        <option selected>Select the Genre</option>
                        <option value="Rock">Rock</option>
                        <option value="Pop">Pop</option>
                        <option value="HipHop">HipHop</option>
                        <option value="Classical">Classical</option>
                        <option value="Jazz">Jazz</option>
                    </select>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                <label className="block text-left m-2">Want the song to be premium</label>
                    <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    onChange={(e) => { setPre(e.target.value === "1") }} >
                        <option selected disabled>Select the option</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                    {/* <label className="block text-left m-2">Do you want this to be a Paid Content?</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="If yes, enter the amount."></input> */}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 md:gap-20 md:px-10 sm:px-5 py-5">
                <ImageUpload />
                <AudioUpload />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2 m-auto"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export {UploadForm};