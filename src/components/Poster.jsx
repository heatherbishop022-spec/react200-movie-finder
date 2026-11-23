import React, { useState } from 'react';

// Shows the movie poster, or a placeholder if there's no poster
// or the image link is broken. Wide images (like game cover art)
// are shown whole over a blurred backdrop instead of being cropped.
const Poster = ({ src, title, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const hasPoster = src && src !== 'N/A' && !failed;

  if (!hasPoster) {
    return (
      <div className={`aspect-[2/3] shrink-0 bg-slate-800 flex flex-col items-center justify-center text-slate-500 p-4 text-center ${className}`}>
        <span className="text-4xl mb-2">🎬</span>
        <span className="text-sm">No poster available</span>
      </div>
    );
  }

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    // A real poster is about 2:3 (0.67). Anything much wider gets the "whole image" treatment.
    setIsWide(naturalHeight > 0 && naturalWidth / naturalHeight > 0.8);
  };

  return (
    <div className={`relative aspect-[2/3] shrink-0 overflow-hidden bg-slate-800 ${className}`}>
      {isWide && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
        />
      )}
      <img
        src={src}
        alt={`${title} poster`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={() => setFailed(true)}
        className={`relative w-full h-full ${isWide ? 'object-contain' : 'object-cover'}`}
      />
    </div>
  );
};

export default Poster;