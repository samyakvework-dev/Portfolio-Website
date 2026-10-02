import React, { useRef, useState, useEffect } from 'react';
import { showreelData } from '../data/projects';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const ReelSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Viewport autoplay observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current || hasError) return;
        if (entry.isIntersecting) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          }
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasError]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section
      id="reel"
      className="w-full bg-[#000000] text-[#F5F5F7] py-28 md:py-40 lg:py-48 px-6 sm:px-10 lg:px-16 transition-colors duration-700"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Cinematic Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#86868B] block mb-2">
              02 / SHOWCASE
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              SHOWREEL / 2026
            </h2>
          </div>

          <div className="mt-4 sm:mt-0 text-xs sm:text-sm font-mono text-[#86868B] uppercase tracking-wider flex items-center gap-4">
            <span>Duration · {showreelData.duration}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Large Cinematic Video Container (2.39:1 Cinema Scope) */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full aspect-[16/9] sm:aspect-[2.39/1] bg-[#0E0E10] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)] select-none group"
        >
          {/* High-res Cinema Poster */}
          <img
            src={showreelData.poster}
            alt="Samyak Mahajan Showreel"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          />

          {/* HTML5 Video */}
          <video
            ref={videoRef}
            src={showreelData.video}
            poster={showreelData.poster}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onError={() => setHasError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Very subtle dark gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Minimal Controls Affordance */}
          <div
            className={`absolute bottom-6 right-6 z-20 flex items-center gap-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-80'
            }`}
          >
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause Showreel' : 'Play Showreel'}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-medium tracking-tight flex items-center gap-2 transition-all hover:scale-105"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute Showreel' : 'Mute Showreel'}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Supporting Caption */}
        <p className="mt-8 text-sm sm:text-base text-[#86868B] max-w-2xl leading-relaxed font-normal">
          {showreelData.description}
        </p>
      </div>
    </section>
  );
};
