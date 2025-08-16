import '../styles/GifSlider.css';
import React, { useState } from 'react';


interface GifSliderProps {
  isMobile: boolean;
}

const GifSlider: React.FC<GifSliderProps> = ({ isMobile }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);



  const gifUrls = [
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265914/chrome-capture-2025-08-15_usgquj.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265912/chrome-capture-2025-08-15_7_yhmnpw.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265911/chrome-capture-2025-08-15_2_facexa.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265909/chrome-capture-2025-08-15_3_y1zh2r.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265911/chrome-capture-2025-08-15_9_cfvfyu.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265910/chrome-capture-2025-08-15_1_jvt0rj.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265910/chrome-capture-2025-08-15_6_cy1zkd.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265910/chrome-capture-2025-08-15_8_smwkgz.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265910/chrome-capture-2025-08-15_4_spswjd.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1755265909/chrome-capture-2025-08-15_5_mh4zgn.gif',

  ];



  return (
    <div className="slider-wrapper_gif">
      <div className={`slider-track_gif${hoveredIndex !== null ? ' hovering' : ''}`}>
        {[...gifUrls, ...gifUrls].map((gif, index) => (
          <div
            className={`each_task_gif${hoveredIndex === index ? ' hovered' : ''}`}
            key={index}
            style={{
              minWidth: isMobile ? 300 : 100,
              margin: '0 15px',
              borderRadius: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'auto'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={gif}
              alt={`gif-${index}`}
              style={{
                maxWidth: isMobile ? '500px' : '100%',
                maxHeight: '380px',
                borderRadius: 8
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GifSlider;