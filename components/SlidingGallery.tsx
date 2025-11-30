import React, { useState, useEffect } from 'react';

interface SlidingGalleryProps {
  images: string[];
}

export default function SlidingGallery({ images }: SlidingGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return <div className="text-center p-4 border rounded">No images available for gallery.</div>;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img src={src} alt={`Gallery image ${index + 1}`} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>
      
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &lt;
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &gt;
      </button>
    </div>
  );
}
