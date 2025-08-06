import '../styles/GifSlider.css';
import React, { useState } from 'react';
import { ThemeSpecs } from '../utils/theme';




interface GifSliderProps {
  currentTheme: ThemeSpecs;
}

const GifSlider: React.FC<GifSliderProps> = ({  currentTheme }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

const gifUrls = [
'https://res.cloudinary.com/ddy2f7uoa/image/upload/v1754489815/chrome-capture-2025-08-06_u7ytbj.gif',


];



  return (
    <div className="slider-wrapper_gif">
      <div className={`slider-track_gif${hoveredIndex !== null ? ' hovering' : ''}`}>
        {[...gifUrls, ...gifUrls].map((gif, index) => (
          <div
            className={`each_task_gif${hoveredIndex === index ? ' hovered' : ''}`}
            key={index}
            style={{
              minWidth: 300,
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
            <img src={gif} alt={`gif-${index}`} style={{ maxWidth: '100%', maxHeight: '380px', borderRadius: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GifSlider;