import React, { useEffect } from 'react';
import type { Project } from '../data/projects';
import { VideoFrame } from './VideoFrame';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onNextProject: () => void;
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

        {/* Large Cinematic Hero Media */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/[0.08] mb-20 bg-black">
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
