import React, { useEffect, useRef, useState } from 'react';
import type { Project } from '../data/projects';
import { X, Play, Calendar, User } from 'lucide-react';

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ project, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const isVertical = project.aspectRatio === '9/16';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#161616] border border-white/12 rounded-[28px] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#181818]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase bg-white/6 text-[#FF6A00] border border-white/8">
              {project.category}
            </span>
            <h2 id="modal-title" className="text-base sm:text-lg font-semibold text-white truncate max-w-md">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/16 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display Area */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden flex-1 min-h-[320px] max-h-[60vh]">
          {project.video && !hasError ? (
            <video
              ref={videoRef}
              src={project.video}
              autoPlay
              playsInline
              controls
              onError={() => setHasError(true)}
              className={`max-h-[60vh] object-contain rounded-lg ${
                isVertical ? 'max-w-[340px]' : 'w-full'
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-white/60">
              <div className="w-14 h-14 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-[#FF6A00] mb-3">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
              <p className="font-semibold text-white">Media Preview Awaiting Upload</p>
              <p className="text-xs text-white/40 mt-1 max-w-md font-mono">
                Place your video at <span className="text-[#FF6A00]">{project.video}</span> to watch full playback.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-[#161616] border-t border-white/8 space-y-3">
          <p className="text-sm text-[#A1A1A1] leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/6 text-xs text-white/50 font-mono">
            <div className="flex items-center gap-4">
              {project.client && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF6A00]" />
                  {project.client}
                </span>
              )}
              {project.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF6A00]" />
                  {project.year}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.tags?.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-white/6 text-white/70">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
