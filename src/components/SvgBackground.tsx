import React, { useRef, useEffect } from 'react';
import { ThemeSpecs } from '../utils/theme';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

interface SvgBackgroundProps {
  path_variant: number;
  currentTheme: ThemeSpecs;
  isMobile: boolean;
}

// Subtle bubble-like variations of the same base shape
const paths = [
  "M720,400 C760,390 790,370 805,340 C825,300 820,250 800,210 C780,170 740,150 700,160 C660,170 620,190 602,230 C580,270 580,320 600,360 C620,400 680,410 720,400 Z",
  "M720,400 C750,392 780,372 795,342 C815,302 810,252 790,212 C770,172 730,152 710,162 C670,172 630,192 612,232 C590,272 590,322 610,362 C630,402 690,408 720,400 Z",
  "M720,400 C760,385 790,365 805,335 C825,295 820,245 800,205 C780,165 740,145 700,155 C660,165 620,185 602,225 C580,265 580,315 600,355 C620,395 680,415 720,400 Z",
  "M720,400 C765,388 795,368 810,338 C830,298 825,248 805,208 C785,168 745,148 705,158 C665,168 625,188 607,228 C585,268 585,318 605,358 C625,398 685,412 720,400 Z",
];

const SvgBackground: React.FC<SvgBackgroundProps> = ({ path_variant, currentTheme , isMobile }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true }); // Add yoyo for back-and-forth

      // Start from base shape and morph through variants
      tl.to(pathRef.current, {
        duration: 4,
        morphSVG: paths[1],
        ease: "power1.inOut"
      })
        .to(pathRef.current, {
          duration: 4,
          morphSVG: paths[2],
          ease: "power1.inOut"
        })
        .to(pathRef.current, {
          duration: 4,
          morphSVG: paths[3],
          ease: "power1.inOut"
        })
        .to(pathRef.current, {
          duration: 4,
          morphSVG: paths[0], // Back to base
          ease: "power1.inOut"
        });
    }
  }, []);

  const define_viewport = (variant: number) => {
    switch (Number(variant)) {
      case 1: return "550 150 300 300";
      case 2: return "550 130 300 300";
      case 3: return "520 140 350 300";
      case 4: return "500 110 400 300";
      case 5: return "550 120 300 300";
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
        style={{
          maxWidth: isMobile ? '100%' : ''
        }}
      >
        <path
          ref={pathRef}
          d={paths[0]}
          fill={currentTheme['--task-background-color']}
        />
      </svg>
    </div>
  );
};

export default SvgBackground;
