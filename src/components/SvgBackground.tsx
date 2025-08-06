import React, { useRef, useEffect } from 'react';
import { ThemeSpecs } from '../utils/theme';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

interface SvgBackgroundProps {
  path_variant: number;
  currentTheme: ThemeSpecs;
}

// Subtle bubble-like variations of the same base shape
const paths = [
  // Base shape
  "M720 400C760 390 790 370 805 340C825 300 820 250 800 210C780 170 740 150 700 160C660 170 620 190 602 230C580 270 580 320 600 360C620 400 680 410 720 400Z",
  // Slightly squeezed horizontally
  "M720 400C750 392 780 372 795 342C815 302 810 252 790 212C770 172 730 152 710 162C670 172 630 192 612 232C590 272 590 322 610 362C630 402 690 408 720 400Z",
  // Slightly expanded vertically
  "M720 400C760 385 790 365 805 335C825 295 820 245 800 205C780 165 740 145 700 155C660 165 620 185 602 225C580 265 580 315 600 355C620 395 680 415 720 400Z",
  // Gentle squeeze from top/bottom
  "M720 400C765 388 795 368 810 338C830 298 825 248 805 208C785 168 745 148 705 158C665 168 625 188 607 228C585 268 585 318 605 358C625 398 685 412 720 400Z"
];

const SvgBackground: React.FC<SvgBackgroundProps> = ({ path_variant, currentTheme }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const tl = gsap.timeline({ repeat: -1 }); // Infinite loop

      paths.forEach((path, _) => {
        tl.to(pathRef.current, {
          duration: 2,
          morphSVG: path,
          ease: "none" // Constant speed
        });
      });
    }
  }, []);

  const define_viewport = (variant: number) => {
    switch (Number(variant)) {
      case 1: return "550 150 300 300";
      case 2: return "550 130 300 300";
      case 3: return "550 140 350 300";
      case 4: return "480 110 400 300";
      default: return "550 150 300 300";
    }
  };

  return (
    <div style={{
      position: 'absolute',
      zIndex: -1,
      opacity: 0.3, // Slightly more subtle
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="480"
        height="187"
        preserveAspectRatio="none"
        viewBox={String(define_viewport(Number(path_variant)))}
      >
        <path
          ref={pathRef}
          d={paths[0]}
          fill={currentTheme['--hover-color']}
        />
      </svg>
    </div>
  );
};

export default SvgBackground;
// ...existing code...