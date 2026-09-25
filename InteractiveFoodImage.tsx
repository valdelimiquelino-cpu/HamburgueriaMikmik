'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { Sparkles, ZoomIn } from 'lucide-react';
import { ProductCategory } from '@/lib/types';

interface InteractiveFoodImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: ProductCategory;
  tag?: string;
  priority?: boolean;
  sizes?: string;
  enableTilt?: boolean;
  enableZoomLens?: boolean;
  roundedClassName?: string;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onClick?: () => void;
}

export function InteractiveFoodImage({
  src,
  alt,
  className = '',
  category = 'burgers',
  tag,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  enableTilt = true,
  enableZoomLens = false,
  roundedClassName = 'rounded-2xl',
  topContent,
  bottomContent,
  onClick,
}: InteractiveFoodImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLensActive, setIsLensActive] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  // Spring physics for smooth 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Rotation ranges
  const rotateX = useTransform(smoothY, [0, 1], [5, -5]);
  const rotateY = useTransform(smoothX, [0, 1], [-5, 5]);

  // Dynamic light glare position
  const glareX = useTransform(smoothX, [0, 1], [10, 90]);
  const glareY = useTransform(smoothY, [0, 1], [10, 90]);
  const glareBackground = useMotionTemplate`radial-gradient(circle 280px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.35), transparent 70%)`;

  // Ambient underglow colors based on food category
  const glowColor =
    category === 'combos'
      ? 'from-amber-500/25 via-orange-500/20 to-amber-600/25'
      : category === 'burgers'
      ? 'from-amber-600/25 via-red-500/15 to-orange-500/25'
      : category === 'drinks'
      ? 'from-cyan-500/25 via-blue-500/15 to-teal-500/25'
      : 'from-pink-500/25 via-rose-500/15 to-amber-500/25';

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));

      mouseX.set(clampedX);
      mouseY.set(clampedY);

      if (enableZoomLens) {
        setLensPos({
          x: Math.round(clampedX * 100),
          y: Math.round(clampedY * 100),
        });
      }
    },
    [mouseX, mouseY, enableZoomLens]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsLensActive(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1000 }}
      className={`relative group/food-img select-none ${className}`}
    >
      {/* Ambient Colored Backlight Glow */}
      <div
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${glowColor} blur-xl opacity-0 group-hover/food-img:opacity-100 transition-opacity duration-700 pointer-events-none -z-10`}
      />

      {/* 3D Motion Container */}
      <motion.div
        style={{
          rotateX: enableTilt && !isLensActive ? rotateX : 0,
          rotateY: enableTilt && !isLensActive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full h-full overflow-hidden bg-stone-900 ${roundedClassName} transition-all duration-300`}
      >
        {/* The Base High-Resolution Image - Always visible, vibrant food grading */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          referrerPolicy="no-referrer"
          className="object-cover object-center brightness-[1.02] contrast-[1.03] saturate-[1.08] transition-transform duration-500 ease-out group-hover/food-img:scale-108"
        />

        {/* Dynamic Specular Lighting Sheen (Cursor-following Gloss) */}
        {isHovered && !isLensActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay z-10 transition-opacity duration-300"
            style={{
              background: glareBackground,
            }}
          />
        )}

        {/* Light-Sweep Shimmer Beam */}
        <div className="absolute inset-0 -translate-x-full group-hover/food-img:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />

        {/* Ambient Dark-to-Clear Vignette on bottom for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/15 to-transparent pointer-events-none z-10" />

        {/* High-Definition Zoom Lens Mode (Interactive Magnifier) */}
        {enableZoomLens && isLensActive && (
          <div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
              backgroundSize: '240%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Lens crosshair indicator */}
            <div
              className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400 shadow-2xl bg-amber-400/10 pointer-events-none"
              style={{ left: `${lensPos.x}%`, top: `${lensPos.y}%` }}
            />
          </div>
        )}

        {/* Tag Badge with Shimmer Sheen */}
        {tag && (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="relative inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md overflow-hidden">
              <Sparkles className="w-3 h-3 text-stone-950" />
              <span>{tag}</span>
              <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover/food-img:translate-x-full transition-transform duration-700 ease-out" />
            </span>
          </div>
        )}

        {/* Top Content (Badges, Pills, etc.) */}
        {topContent && (
          <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none">
            {topContent}
          </div>
        )}

        {/* Zoom Lens Toggle Button (Placed at top-left or custom position to NEVER collide with modal close X) */}
        {enableZoomLens && (
          <div className="absolute top-3 left-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLensActive((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md transition-all cursor-pointer ${
                isLensActive
                  ? 'bg-amber-500 text-stone-950 border border-amber-300 scale-105'
                  : 'bg-stone-950/80 text-stone-200 hover:text-white hover:bg-stone-900 border border-white/20'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              <span>{isLensActive ? 'Zoom Ativo (Mova o mouse)' : 'Lente HD'}</span>
            </button>
          </div>
        )}

        {/* Bottom Content (Price, Title, Prep Time, etc.) */}
        {bottomContent && (
          <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
            {bottomContent}
          </div>
        )}
      </motion.div>
    </div>
  );
}
