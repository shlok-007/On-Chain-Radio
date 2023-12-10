import React, {useState} from "react";

const ImageUpload: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
  
      if (file) {
        setSelectedImage(file);
  
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleclick = () => {
      // Handle the click event if needed
    };
  
    return (
      <div className="extraOutline p-10 bg-gray-200 w-full m-auto col-span-2 lg:col-span-1 rounded-lg py-5">
        <div className="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg w-full">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mx-auto mb-4 max-h-32 object-contain rounded-lg"
            />
          ) : (
            <svg
              className="text-indigo-500 w-24 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
          <div className="input_field flex flex-col w-max mx-auto text-center">
            <label>
              <input
                className="text-sm cursor-pointer w-36 hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500" onClick={handleclick}>
                Select
              </div>
            </label>
            <div className="title text-indigo-500 uppercase">or drop image here</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ImageUpload;
  