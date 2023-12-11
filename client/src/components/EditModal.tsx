import React, { SetStateAction, useState, useEffect } from 'react';
import axios from 'axios';


const pinataConfig = {
  root: 'https://api.pinata.cloud',
  headers: { 
    'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
    'pinata_secret_api_key': process.env.REACT_APP_PINATA_API_SECRET
  }
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    location: string,
    profession: string,
    aboutMe: string,
    selectedImage:string
  },
  setFormData: React.Dispatch<SetStateAction<{
    location: string,
    profession: string,
    aboutMe: string,
    selectedImage: string
  }>>
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, formData, setFormData }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pinnedFiles, setPinnedFiles] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [ipfsimage,setIpfsimage] =useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => {
        return ({
            ...prev,
            [name]: value
        })
    })
  }
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => {
        return ({
            ...prev,
            [name]: value
        })
    })
  }
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // await handleclick();
    }
  };
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //code to save the bio
    //await handleclick();
    e.preventDefault();
    console.log(ipfsimage);
      const moduleAddress=process.env.REACT_APP_MODULE_ADDR_TEST;
      try {
        const payload = {
          type: "entry_function_payload",
          function: `${moduleAddress}::user::update_bio`,
          arguments: [formData.location,formData.profession,formData.aboutMe, ipfsimage],
          type_arguments: [],
        };
        console.log(payload);
      // sign and submit transaction to chain
     const response= await window.aptos.signAndSubmitTransaction(payload);
      // Close the EditModal
      console.log(response);
      onClose();
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
  };
  const handleCancel = () => {
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
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
    if(!selectedImage || selectedImage.type.split('/')[0] !== 'image') return;
      //console.log(file);
        const formData = new FormData();
        // console.log(file)
        formData.append('file', selectedImage);
        const pinataBody = {
          options: {
            cidVersion: 1,
          },
          metadata: {
            name: selectedImage.name,
          }
        }
        formData.append('pinataOptions', JSON.stringify(pinataBody.options));
        formData.append('pinataMetadata', JSON.stringify(pinataBody.metadata));
        const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
        try {
          const response = await axios({
            method: 'post',
            url: url,
            data: formData,
            headers: pinataConfig.headers
          })
          // console.log(response.data)
          console.log(response.data.IpfsHash);
          setIpfsimage(response.data.IpfsHash);
          queryPinataFiles();
        } catch (error) {
          console.log(error)
        }
  }

  useEffect(() => {
    handleclick();
  } ,[selectedImage])


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-10 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4 text-center">Edit Profile</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm text-left font-bold mb-2" htmlFor="location">
                Location
              </label>
              <input
                type="text"
                id="location"
                name='location'
                value={formData.location}
                onChange={handleChange}
                className="border rounded w-full p-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm text-left font-bold mb-2" htmlFor="profession">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                name='profession'
                value={formData.profession}
                onChange={handleChange}
                className="border rounded w-full p-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm text-left font-bold mb-2" htmlFor="aboutMe">
                About Me
              </label>
              <textarea
                id="aboutMe"
                name='aboutMe'
                value={formData.aboutMe}
                onChange={handleTextarea}
                className="border rounded w-full p-3 focus:outline-none focus:border-blue-500"
                rows={4}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm text-left font-bold mb-2" htmlFor="image">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="border rounded w-full p-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="mx-auto mb-4 h-32 object-contain rounded-lg"
              />
            )}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded focus:outline-none hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="ml-4 border px-6 py-3 rounded focus:outline-none hover:border-blue-500"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModal;
