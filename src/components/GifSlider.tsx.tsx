import '../styles/GifSlider.css';
import React, { useState } from 'react';


interface GifSliderProps {
  isMobile: boolean;
}

const GifSlider: React.FC<GifSliderProps> = ({ isMobile }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);



  const gifUrls = [
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1754494912/chrome-capture-2025-08-06_4_z9sbzi.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1754494394/chrome-capture-2025-08-06_3_w46nts.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1754494256/chrome-capture-2025-08-06_2_rqj4s1.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1754494111/chrome-capture-2025-08-06_gj3igb.gif',
    'https://res.cloudinary.com/dnnyjuc9u/image/upload/v1754494106/chrome-capture-2025-08-06_1_f35och.gif',

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