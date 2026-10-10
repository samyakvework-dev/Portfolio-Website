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
      { threshold: 0.3 }
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
      className="w-full bg-[#111111] text-[#F5F5F7] py-16 md:py-20 lg:py-24 px-6 sm:px-10 lg:px-16 transition-colors duration-700"
    >
      <div className="max-w-5xl mx-auto">
        {/* Cinematic Header — Tightly Spaced */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 sm:mb-10 pb-5 border-b border-white/10">
          <div>
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#86868B] block mb-1.5">
              02 / SHOWCASE
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-creato font-semibold tracking-tight text-white uppercase">
              SHOWREEL / 2026
            </h2>
          </div>

          <div className="mt-3 sm:mt-0 text-xs sm:text-sm font-creato text-[#86868B] uppercase tracking-wider flex items-center gap-3">
            <span>Duration · {showreelData.duration}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Proportional Video Showcase Container (Balanced size, not oversized) */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full aspect-[16/9] bg-[#0E0E10] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] select-none group"
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
            className={`absolute bottom-5 right-5 z-20 flex items-center gap-2.5 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-85'
            }`}
          >
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause Showreel' : 'Play Showreel'}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-medium tracking-tight flex items-center gap-2 transition-all hover:scale-105"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute Showreel' : 'Mute Showreel'}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Supporting Caption */}
        <p className="mt-5 text-xs sm:text-sm text-[#86868B] max-w-xl leading-relaxed font-normal font-creato">
          {showreelData.description}
        </p>
      </div>
    </section>
  );
};
