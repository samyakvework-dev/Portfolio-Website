import React, { useRef, useState } from 'react';
import type { Project } from '../data/projects';
import { Play, Film } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  projectNumber: number;
  onSelectProject?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  projectNumber,
  onSelectProject
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isVertical = project.aspectRatio === '9/16';
  const formattedNumber = String(projectNumber).padStart(2, '0');

  // Desktop hover playback
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !hasVideoError && isVideoLoaded) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy was prevented or file not ready
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && !hasVideoError) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  const showFallback = hasVideoError || !project.video || project.status === 'coming-soon';

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`View project: ${project.title}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative w-full overflow-hidden rounded-[24px] bg-[#161616] border border-white/8 hover:border-white/20 transition-all duration-500 ease-out cursor-pointer shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/70 select-none ${
        isVertical ? 'aspect-[9/16]' : 'aspect-[16/9]'
      }`}
    >
      {/* Visual media container */}
      <div className="absolute inset-0 w-full h-full bg-[#141414] overflow-hidden">
        {/* If video source is provided, attempt to render HTML5 video */}
        {project.video && !hasVideoError && (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.thumbnail}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setHasVideoError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? 'scale-105 brightness-105' : 'scale-100 brightness-95'
            }`}
          />
        )}

        {/* Thumbnail fallback when video is not playing or loading */}
        {project.thumbnail && !isVideoLoaded && !hasVideoError && (
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            onError={() => setHasVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Elegant Apple-Level Fallback State (when video file is awaiting upload) */}
        {showFallback && (
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7 bg-gradient-to-b from-[#1A1A1A] via-[#141414] to-[#101010] subtle-grid">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white/40 tracking-wider">
                NO. {formattedNumber}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/5 border border-white/10 text-white/80">
                <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'in-progress' ? 'bg-amber-400 animate-pulse' : 'bg-[#FF6A00]'}`} />
                {project.status === 'in-progress' ? 'IN PROGRESS' : 'READY FOR MEDIA'}
              </span>
            </div>

            <div className="my-auto flex flex-col items-center justify-center text-center px-2">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 mb-3 group-hover:scale-110 group-hover:text-[#FF6A00] group-hover:border-[#FF6A00]/30 transition-all duration-300">
                {isVertical ? <Film className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6A00]/90 mb-1">
                {project.category}
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug max-w-[280px]">
                {project.title}
              </h3>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 font-mono border-t border-white/6 pt-3">
              <span>{project.aspectRatio} FRAME</span>
              <span>{project.year || '2024'}</span>
            </div>
          </div>
        )}

        {/* Subtle Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />
      </div>

      {/* Top Bar inside Card */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
        <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70">
          {formattedNumber}
        </span>
        <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/80">
          {project.category}
        </span>
      </div>

      {/* Bottom Content Information Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end transform transition-transform duration-300">
        {project.client && (
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#FF6A00] mb-1">
            {project.client}
          </p>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug group-hover:text-white transition-colors">
          {project.title}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1.5 line-clamp-2 leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>

        {/* Tags & Action row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap gap-1.5">
            {project.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/6 text-white/70 border border-white/6"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 group-hover:text-[#FF6A00] transition-colors">
            <span>Play</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
      </div>
    </article>
  );
};
