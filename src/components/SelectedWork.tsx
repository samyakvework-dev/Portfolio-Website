import React from 'react';
import { type Project } from '../data/projects';
import { VideoFrame } from './VideoFrame';
import { ArrowUpRight, ArrowRight, Film, Sparkles, Palette } from 'lucide-react';

interface SelectedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigateCategory?: (categorySlug: string) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  projects,
  onSelectProject,
  onNavigateCategory,
}) => {
  // Preserve the first three featured showcases strictly in order 1, 2, 3
  const featured = projects.filter((p) => p.featured !== false).slice(0, 3);
  const p1 = featured[0] || projects[0]; // 01 Spotify (Motion Graphics)
  const p2 = featured[1] || projects[1]; // 02 Nike (Video Editing)
  const p3 = featured[2] || projects[2]; // 03 Apple Music (Graphic Design)

  return (
    <section id="work" className="w-full py-16 md:py-24 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 pb-6 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
            01 / SELECTED WORK
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            FEATURED SHOWCASES
          </h2>
          <p className="mt-2 text-lg sm:text-xl text-[#686764] font-editorial">
            Crafted with rhythmic precision, pacing, and typographic intent.
          </p>
        </div>

        <p className="mt-4 md:mt-0 text-xs sm:text-sm text-[#686764] font-creato max-w-md font-normal leading-relaxed">
          Preserved flagship projects across Video Editing, Motion Graphics, and Graphic Design.
        </p>
      </div>

      <div className="space-y-16 sm:space-y-20">
        {/* ================================================================== */}
        {/* 01 — FULL-WIDTH HERO FEATURE (Spotify: Motion Graphics)            */}
        {/* ================================================================== */}
        {p1 && (
          <article
            tabIndex={0}
            role="button"
            onClick={() => onSelectProject(p1)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p1)}
            className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
            aria-label={`View project: ${p1.title}`}
          >
            {/* Top Metadata Strip */}
            <div className="flex items-center justify-between pb-3 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
              <div className="flex items-center gap-3">
                <span className="text-[#171717] font-semibold">01</span>
                <span className="text-[#9A9185]">/</span>
                <span className="text-[#171717] font-medium">{p1.client || 'Featured'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2.5 py-0.5 rounded-full bg-black/[0.05] text-[#171717] font-medium text-[11px]">
                  {p1.category}
                </span>
                <span className="text-[#9A9185] hidden sm:inline">·</span>
                <span className="hidden sm:inline">{p1.year}</span>
              </div>
            </div>

            {/* Media Presentation */}
            <div className="relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
              <VideoFrame
                src={p1.video}
                poster={p1.poster}
                aspectRatio="16/9"
                alt={p1.title}
                priority={true}
                hoverScale={true}
              />
            </div>

            {/* Bottom Project Info Bar */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                  {p1.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#686764] mt-1.5 max-w-2xl font-creato font-normal leading-relaxed">
                  {p1.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-creato font-medium tracking-[0.14em] uppercase text-[#171717] group-hover:text-black transition-colors shrink-0">
                <span>View Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          </article>
        )}

        {/* ================================================================== */}
        {/* 02 & 03 — BALANCED TWO-COLUMN ROW (Nike & Apple Music)             */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Showcase 02: Nike (Video Editing) */}
          {p2 && (
            <article
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(p2)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p2)}
              className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
              aria-label={`View project: ${p2.title}`}
            >
              <div className="flex items-center justify-between pb-3 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#171717] font-semibold">02</span>
                  <span className="text-[#9A9185]">/</span>
                  <span className="text-[#171717] font-medium">{p2.client}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-[#171717] text-[11px]">
                    {p2.category}
                  </span>
                  <span>{p2.year}</span>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
                <VideoFrame
                  src={p2.video}
                  poster={p2.poster}
                  aspectRatio="16/9"
                  alt={p2.title}
                  hoverScale={true}
                />
              </div>

              <div className="mt-4 flex flex-col justify-between gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                    {p2.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs sm:text-sm text-[#686764] mt-1 line-clamp-2 font-creato font-normal leading-relaxed">
                  {p2.description}
                </p>
              </div>
            </article>
          )}

          {/* Showcase 03: Apple Music (Graphic Design) */}
          {p3 && (
            <article
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(p3)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p3)}
              className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
              aria-label={`View project: ${p3.title}`}
            >
              <div className="flex items-center justify-between pb-3 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#171717] font-semibold">03</span>
                  <span className="text-[#9A9185]">/</span>
                  <span className="text-[#171717] font-medium">{p3.client}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-[#171717] text-[11px]">
                    {p3.category}
                  </span>
                  <span>{p3.year}</span>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
                <VideoFrame
                  src={p3.video}
                  poster={p3.poster}
                  aspectRatio="16/9"
                  alt={p3.title}
                  hoverScale={true}
                />
              </div>

              <div className="mt-4 flex flex-col justify-between gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                    {p3.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs sm:text-sm text-[#686764] mt-1 line-clamp-2 font-creato font-normal leading-relaxed">
                  {p3.description}
                </p>
              </div>
            </article>
          )}
        </div>

        {/* ================================================================== */}
        {/* DEDICATED CATEGORY PORTALS (Directing Visitors to Dedicated Pages) */}
        {/* ================================================================== */}
        <div className="pt-10 border-t border-black/[0.08]">
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-6">
            EXPLORE COMPLETE ARCHIVES BY DISCIPLINE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Portal 1: Video Editing */}
            <button
              type="button"
              onClick={() => onNavigateCategory?.('/video-editing')}
              className="text-left p-6 sm:p-7 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] hover:border-black/[0.16] hover:bg-[#E7E5E0] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Film className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-creato font-semibold text-[#171717] group-hover:text-black">
                  Video Editing
                </h4>
                <p className="text-xs sm:text-sm text-[#686764] mt-2 leading-relaxed font-creato">
                  Commercials, sports cuts, high-velocity edits, retention pacing, and talking-head narratives.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-creato font-semibold uppercase tracking-wider text-[#171717]">
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>

            {/* Portal 2: Motion Graphics */}
            <button
              type="button"
              onClick={() => onNavigateCategory?.('/motion-graphics')}
              className="text-left p-6 sm:p-7 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] hover:border-black/[0.16] hover:bg-[#E7E5E0] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-creato font-semibold text-[#171717] group-hover:text-black">
                  Motion Graphics
                </h4>
                <p className="text-xs sm:text-sm text-[#686764] mt-2 leading-relaxed font-creato">
                  2D kinetic typography, animated brand systems, logo choreographies, and vector motion.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-creato font-semibold uppercase tracking-wider text-[#171717]">
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>

            {/* Portal 3: Graphic Design */}
            <button
              type="button"
              onClick={() => onNavigateCategory?.('/graphic-design')}
              className="text-left p-6 sm:p-7 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] hover:border-black/[0.16] hover:bg-[#E7E5E0] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Palette className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-creato font-semibold text-[#171717] group-hover:text-black">
                  Graphic Design
                </h4>
                <p className="text-xs sm:text-sm text-[#686764] mt-2 leading-relaxed font-creato">
                  Editorial posters, Swiss grid layouts, key visuals, campaign collateral, and typography art.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-creato font-semibold uppercase tracking-wider text-[#171717]">
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
