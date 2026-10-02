import React, { useRef, useState, useEffect } from 'react';
import type { AspectRatio } from '../data/projects';
import { Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoFrameProps {
  src?: string;
  poster: string;
  aspectRatio?: AspectRatio;
  alt?: string;
  className?: string;
  autoPlayInView?: boolean;
  allowSoundToggle?: boolean;
  priority?: boolean;
  onClick?: () => void;
  hoverScale?: boolean;
}

export const VideoFrame: React.FC<VideoFrameProps> = ({
  src,
  poster,
  aspectRatio = '16/9',
  alt = 'Motion project preview',
  className = '',
  autoPlayInView = true,
  allowSoundToggle = false,
  priority = false,
  onClick,
  hoverScale = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isInView, setIsInView] = useState(priority);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Aspect ratio class mapping
  const ratioClasses: Record<AspectRatio, string> = {
    '16/9': 'aspect-[16/9]',
    '9/16': 'aspect-[9/16]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '2.39/1': 'aspect-[2.39/1]',
  };

  // Lazy loading & Viewport Intersection Observer
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: '150px 0px',
        threshold: 0.15,
      }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [priority]);

  // Autoplay control based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || hasVideoError) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    if (autoPlayInView && isInView) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled silently by autoplay policies
        });
      }
    } else {
      video.pause();
    }
  }, [isInView, autoPlayInView, src, hasVideoError]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-full overflow-hidden bg-[#E5E5EA] transition-all duration-700 ease-out select-none ${
        ratioClasses[aspectRatio] || 'aspect-[16/9]'
      } ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* High-resolution Poster Image (always acts as backdrop & graceful fallback) */}
      <img
        src={poster}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
          hoverScale && isHovered ? 'scale-[1.025]' : 'scale-100'
        } ${isVideoLoaded && !hasVideoError ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* HTML5 Video element */}
      {src && isInView && !hasVideoError && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={isMuted}
          loop
          playsInline
          preload={priority ? 'auto' : 'metadata'}
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
            hoverScale && isHovered ? 'scale-[1.025]' : 'scale-100'
          } ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Very subtle edge border framing */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5" />

      {/* Minimalistic audio/fullscreen controls on hover (only if enabled) */}
      {allowSoundToggle && isVideoLoaded && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Fullscreen video"
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
