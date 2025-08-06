import React from 'react';
import { ThemeSpecs } from '../utils/theme';

interface SvgBackgroundProps {
  path_variant: number;
  currentTheme: ThemeSpecs;
}

const SvgBackground: React.FC<SvgBackgroundProps> = ({ path_variant, currentTheme }) => {


  const define_path_variant = (variant: number) => {
    switch (Number(variant)) { // <-- Ensure it's a number
      case 1:
        return (
          <path
            d="M720 400C760 390 790 370 805 340C825 
              300 820 250 800 210C780 170 740 150 700 
              160C660 170 620 190 602 230C580 270 580 
              320 600 360C620 400 680 410 720 400Z"
            fill={currentTheme['--hover-color']}
          />
        );

      case 2:
        return (
          <path d="M720 400C760 390 805.446 392.874
           871.984 354.022 942.545 308.919 931.381
            244.613 857.697 216.479 782.226 188.792
             771.509 192.811 696.039 195.044 651.382
              201.296 620 190 600 230 580 270 580 320
               600 360 620 400 680 410 720 400Z"
            fill={currentTheme['--hover-color']}
          />

        );

      case 3:
        return (
          <path d="M751.9 359.4C782.2 350 792.5 329.9 826.4 287 858.6
             251.8 837.6 216.9 819.7 207.5 782.2 188.8 725.5 204.4 
             683.5 223.6 642 246.4 628.6 255.3 613.9 275.4 602.7 291.5
              596.9 309.8 630.4 354.5 659.9 377.7 660.3 375 701.4 371.9Z"

            fill={currentTheme['--hover-color']}
          />
        );

      case 4:
        return (
          <path d="M 735.441 343.564 C 790.373 343.894 806.945 317.427 
          813.1 303.5 C 821.967 287.083 820 250 780.5 233.4 C 748.3 
          215.9 736.3 208.4 681.168 193.497 C 634.9 183.3 613 173.1
           571.5 200.8 C 522.8 246.3 541.6 280.2 565.985 302.439 C 
           585.513 319.464 599.07 330.664 655.975 337.327 Z"
            fill={currentTheme['--hover-color']}
          />
        )

      default:
        return (
          <path
            d="M720 400C760 390 790 370 805 340C825 
              300 820 250 800 210C780 170 740 150 700 
              160C660 170 620 190 602 230C580 270 580 
              320 600 360C620 400 680 410 720 400Z"
            fill="#DB8A48"
          />
        );
    }
  };


  const define_viewport = (variant: number) => {
    switch (Number(variant)) { // <-- Ensure it's a number
      case 1:
        return "550 150 300 300"; // Original viewport
      case 2:
        return "550 130 400 300"; // Zoomed/cropped area
      case 3:
        return "550 140 350 300"; // Zoomed/cropped area
      case 4:
        return "480 110 400 300"; // Zoomed/cropped area
    }
  }
  return (
    <div style={{
      position: 'absolute',
      zIndex: -1,
      opacity: 0.5,
    }}>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="480"
        height="187"
        preserveAspectRatio="none"
        viewBox={String(define_viewport(Number(path_variant)))}
      >
        {define_path_variant(Number(path_variant))}
      </svg>
    </div>
  );
};

export default SvgBackground;