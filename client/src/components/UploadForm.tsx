import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';
import { useWallet, AptosWalletProviderProps } from "@aptos-labs/wallet-adapter-react";

const UploadForm: React.FC = () => {
    const [pinnedFiles, setPinnedFiles] = useState([]);
    const [pinnedFiles1, setPinnedFiles1] = useState([]);
    const [file, setFile] = useState<File | null>(null);
    const [file1, setFile1] = useState<File | null>(null);
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
            console.log(file)
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

    //   const handleclick1 = async () => {
    //     try {
    //       //console.log(file);
    //       if (file1) {
    //         const formData = new FormData();
    //         console.log(file1)
    //         formData.append('file1', file1);
    //         const pinataBody = {
    //           options: {
    //             cidVersion: 1,
    //           },
    //           metadata: {
    //             name: file1.name,
    //           }
    //         }
    //         formData.append('pinataOptions', JSON.stringify(pinataBody.options));
    //         formData.append('pinataMetadata', JSON.stringify(pinataBody.metadata));
    //         const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
    //         const response = await axios({
    //           method: 'post',
    //           url: url,
    //           data: formData,
    //           headers: pinataConfig.headers
    //         })
    //         console.log(response.data)
    //         queryPinataFiles1();
    //       } else {
    //         alert('select file first')
    //       }
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        console.log(selectedFile);
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFile = e.target.files?.[0];
    //     console.log(selectedFile);
    //     if (selectedFile) {
    //         setFile1(selectedFile);
    //     }
    // };

    // useEffect(() => {
    //   testPinataConnection()
    // });

    const {wallet} = useWallet();

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(genre);
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
            arguments: [song,ipfsaudio,ipfsimage,pre,"Classical",vocalist,lyricist,musician,audio],
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
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Song name:</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: Dandelions etc." onChange={(e)=>{ setSong(e.target.value) }}></input>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Vocalist</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: AUR etc." onChange={(e)=>{ setVocalist(e.target.value) }}></input>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">lyricist</label>
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
                        <option value="#">Pop</option>
                        <option value="#">Classical</option>
                        <option value="#">Folk</option>
                        <option value="#">Country</option>
                    </select>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                <label className="block text-left m-2">Want the song to be premium</label>
                    <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" >
                        <option selected>Select the option</option>
                        <option value="#" onChange={(e)=>{ setPre(true) }}>Yes</option>
                        <option value="#" onChange={(e)=>{ setPre(false) }}>No</option>
                    </select>
                    {/* <label className="block text-left m-2">Do you want this to be a Paid Content?</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="If yes, enter the amount."></input> */}
                </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-10 md:gap-20 md:px-10 sm:px-5 py-5">
                <div className="extraOutline p-10 bg-gray-200 w-full m-auto rounded-lg py-5">
                    <div className="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg w-full">
                        <svg className="text-indigo-500 w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <div className="input_field flex flex-col w-max mx-auto text-center">
                            <label>
                                <input className="text-sm cursor-pointer w-36 hidden" type="file" multiple accept="image/*"  onChange={handleFileChange} />
                                    <div className="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500" onClick={handleclick}>Select</div>
                            </label>
                            <div className="title text-indigo-500 uppercase" >or drop image here</div>
                        </div>
                    </div>
                </div>
                <div className="extraOutline p-10 bg-gray-200 w-full m-auto rounded-lg py-5">
                    <div className="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg w-full">
                        <svg className="text-indigo-500 w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <div className="input_field flex flex-col w-max mx-auto text-center">
                            <label>
                                <input className="text-sm cursor-pointer w-36 hidden" type="file" multiple accept="audio/*" onChange={handleFileChange}/>
                                    <div className="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500" onClick={handleclick}>Select</div>
                            </label>
                            <div className="title text-indigo-500 uppercase">or drop song here</div>
                        </div>
                    </div>
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export {UploadForm};