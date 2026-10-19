import React, { useEffect } from 'react';
import type { Project } from '../data/projects';
import { VideoFrame } from './VideoFrame';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onNextProject: () => void;
}

function parseProjectRatio(ratioStr?: string): { isPortrait: boolean; isSquare: boolean; cssRatio?: string; numericRatio: number } {
  if (!ratioStr) return { isPortrait: false, isSquare: false, numericRatio: 16 / 9, cssRatio: '16/9' };
  
  const clean = ratioStr.trim();
  if (clean.includes('/')) {
    const parts = clean.split('/').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] > 0) {
      const num = parts[0] / parts[1];
      const isPortrait = parts[1] > parts[0];
      const isSquare = Math.abs(parts[0] - parts[1]) < 0.05;
      return { isPortrait, isSquare, cssRatio: clean, numericRatio: num };
    }
  }
  
  const num = parseFloat(clean);
  if (!isNaN(num) && num > 0) {
    return {
      isPortrait: num < 0.95,
      isSquare: Math.abs(num - 1) < 0.05,
      cssRatio: `${num}`,
      numericRatio: num
    };
  }
  
  return { isPortrait: false, isSquare: false, cssRatio: '16/9', numericRatio: 16 / 9 };
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onNextProject,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  const { isPortrait, isSquare, cssRatio } = parseProjectRatio(project.aspectRatio);
  const hasVideo = Boolean(project.video && project.video.trim() !== '');
  const stillsList = project.caseStudy?.stills || project.caseStudy?.images || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 bg-[#F5F4F0] overflow-y-auto overflow-x-hidden animate-in fade-in duration-300"
    >
      {/* Top Floating Navigation Bar */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#F5F4F0]/90 backdrop-blur-md border-b border-black/[0.08] py-4 px-6 sm:px-12 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="group flex items-center gap-2 text-xs font-creato uppercase tracking-wider text-[#686764] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>All Works</span>
        </button>

        <span className="text-xs font-creato uppercase tracking-widest text-[#9A9185] hidden sm:block truncate max-w-xs">
          {project.title}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#171717] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Case Study Content Container */}
      <main className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-32">
        {/* Header Block */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-4">
            {project.category} · {project.year}
          </span>
          <h1 id="case-study-title" className="hero-headline text-[#171717] font-creato tracking-tight">
            {project.title}
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-[#686764] font-editorial leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Cinematic Hero Media — Respects natural aspect ratio for images & videos */}
        {hasVideo ? (
          <div className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/[0.08] mb-16 bg-black ${
            isPortrait ? 'max-w-[440px] sm:max-w-[480px] mx-auto' : isSquare ? 'max-w-[620px] mx-auto' : 'max-w-5xl mx-auto'
          }`}>
            <VideoFrame
              src={project.video}
              poster={project.poster}
              aspectRatio={project.aspectRatio}
              alt={project.title}
              priority={true}
              allowSoundToggle={true}
              hoverScale={false}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center mb-16">
            <div
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/[0.08] bg-[#EBEAE5] transition-all duration-300 flex items-center justify-center max-w-full"
              style={{
                maxWidth: isPortrait ? 'min(580px, 92vw)' : isSquare ? 'min(640px, 92vw)' : 'min(1080px, 92vw)',
                maxHeight: '82vh'
              }}
            >
              <img
                src={project.poster}
                alt={project.title}
                loading="eager"
                className="w-full h-auto max-h-[82vh] object-contain rounded-2xl sm:rounded-3xl"
                style={cssRatio && cssRatio !== 'auto' ? { aspectRatio: cssRatio } : undefined}
              />
            </div>
          </div>
        )}

        {/* Project Metadata Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-black/[0.08] mb-24 text-xs font-creato uppercase">
          <div>
            <span className="text-[#9A9185] block mb-1 tracking-wider">Client</span>
            <span className="text-[#171717] font-medium text-sm">{project.client}</span>
          </div>
          <div>
            <span className="text-[#9A9185] block mb-1 tracking-wider">Role</span>
            <span className="text-[#171717] font-medium text-sm">
              {project.caseStudy.role.join(', ')}
            </span>
          </div>
          <div>
            <span className="text-[#9A9185] block mb-1 tracking-wider">Year</span>
            <span className="text-[#171717] font-medium text-sm">{project.year}</span>
          </div>
          <div>
            <span className="text-[#9A9185] block mb-1 tracking-wider">Disciplines</span>
            <span className="text-[#171717] font-medium text-sm">
              {project.tags.slice(0, 2).join(' · ')}
            </span>
          </div>
        </div>

        {/* Case Study Editorial Narrative */}
        <div className="space-y-24 max-w-4xl mx-auto">
          {/* Section: The Challenge */}
          <section className="space-y-4">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185]">
              01 / The Challenge
            </span>
            <h2 className="text-2xl sm:text-3xl font-creato font-medium text-[#171717] tracking-tight">
              A modern translation of acoustic perception into physical velocity.
            </h2>
            <p className="text-base sm:text-lg font-creato text-[#686764] leading-relaxed font-normal">
              {project.caseStudy.challenge}
            </p>
          </section>

          {/* Section: The Concept */}
          <section className="space-y-4">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185]">
              02 / The Concept
            </span>
            <h2 className="text-2xl sm:text-3xl font-creato font-medium text-[#171717] tracking-tight">
              Sound as physical architecture.
            </h2>
            <p className="text-base sm:text-lg font-creato text-[#686764] leading-relaxed font-normal">
              {project.caseStudy.concept}
            </p>
          </section>

          {/* Section: The Motion System */}
          <section className="space-y-4">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185]">
              03 / The Motion System
            </span>
            <h2 className="text-2xl sm:text-3xl font-creato font-medium text-[#171717] tracking-tight">
              Standardized velocity curves & harmonic frequency mapping.
            </h2>
            <p className="text-base sm:text-lg font-creato text-[#686764] leading-relaxed font-normal">
              {project.caseStudy.motionSystem}
            </p>
          </section>

          {/* Section: Results */}
          <section className="space-y-4 p-8 rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#171717] font-semibold">
              04 / Outcome & Impact
            </span>
            <h2 className="text-xl sm:text-2xl font-creato font-medium text-[#171717] tracking-tight">
              Measured Performance
            </h2>
            <p className="text-base font-creato text-[#686764] leading-relaxed">
              {project.caseStudy.results}
            </p>
          </section>
        </div>

        {/* Additional Project Stills & Visual Gallery */}
        {stillsList.length > 0 && (
          <section className="mt-24 pt-16 border-t border-black/[0.08] max-w-5xl mx-auto">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-6">
              05 / Project Gallery & Stills
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
              {stillsList.map((stillUrl, sIdx) => (
                <div
                  key={sIdx}
                  className="relative rounded-2xl overflow-hidden shadow-lg border border-black/[0.08] bg-[#ECEBE7] group"
                >
                  <img
                    src={stillUrl}
                    alt={`${project.title} - Asset ${sIdx + 1}`}
                    loading="lazy"
                    className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Next Project Footer Switcher */}
        <div className="mt-32 pt-16 border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-creato uppercase tracking-widest text-[#9A9185] block mb-1">
              Next Case Study
            </span>
            <span className="text-2xl sm:text-3xl font-creato font-medium text-[#171717]">
              Continue Exploring
            </span>
          </div>

          <button
            type="button"
            onClick={onNextProject}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#171717] hover:bg-black text-[#F5F4F0] font-creato font-medium text-sm tracking-tight transition-all duration-300 hover:scale-105"
          >
            <span>Next Project</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </main>
    </div>
  );
};
