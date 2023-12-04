import React, { useState } from 'react';

const ImageGrid: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | React.SetStateAction<null>>(null);

  const handleImageClick = (imageIndex: number | React.SetStateAction<null>) => {
    setSelectedImage(imageIndex);
  };

  const images = [
    'https://tecdn.b-cdn.net/img/new/avatars/1.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/2.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/3.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/4.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/5.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/1.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/2.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/3.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/4.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/5.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/4.webp',
    'https://tecdn.b-cdn.net/img/new/avatars/5.webp',
    // Add more image URLs as needed
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          className={`w-32 h-32 rounded-full cursor-pointer ${
            selectedImage === index ? 'border-4 border-blue-500' : ''
          }`}
          alt={`Avatar ${index + 1}`}
          onClick={() => handleImageClick(index)}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
