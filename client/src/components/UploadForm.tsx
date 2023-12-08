import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';

const UploadForm: React.FC = () => {
    const [pinnedFiles, setPinnedFiles] = useState([]);
    const [file, setFile] = useState<File | null>(null);
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
            queryPinataFiles();
          } else {
            alert('select file first')
          }
        } catch (error) {
          console.log(error)
        }
      }

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        console.log(selectedFile);
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // useEffect(() => {
    //   testPinataConnection()
    // });

    return (
        <div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Song name:</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: Dandelions etc."></input>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Artist / Band name:</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="Eg: AUR etc."></input>
                </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Genre of the Song:</label>
                    <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option selected>Select the Genre</option>
                        <option value="#">Pop</option>
                        <option value="#">Classical</option>
                        <option value="#">Folk</option>
                        <option value="#">Country</option>
                    </select>
                </div>
                <div className="md:px-10 sm:px-5 py-5">
                    <label className="block text-left m-2">Do you want this to be a Paid Content?</label>
                    <input className="block text-black text-left h-10 w-full bg-gray-100 border rounded-lg focus:bg-gray-300 p-2" type="text" placeholder="If yes, enter the amount."></input>
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
            </div>
        </div>
    )
}

export {UploadForm};