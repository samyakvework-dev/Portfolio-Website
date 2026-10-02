import React from 'react';
import { projects, type Project } from '../data/projects';
import { VideoFrame } from './VideoFrame';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  const p1 = projects[0]; // 01 Spotify (Full-width feature)
  const p2 = projects[1]; // 02 Nike (Column 1)
  const p3 = projects[2]; // 03 Apple Music (Column 2)
  const p4 = projects[3]; // 04 Meta (Full-width feature)
  const p5 = projects[4]; // 05 A24 (Column 1)
  const p6 = projects[5]; // 06 Polestar (Column 2)

  return (
    <section id="work" className="w-full py-28 md:py-36 lg:py-44 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-28 pb-8 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-3">
            01 / ARCHIVE
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            SELECTED WORKS
          </h2>
          <p className="mt-3 text-xl sm:text-2xl text-[#686764] font-editorial">
            Things I've brought to life.
          </p>
        </div>

        <p className="mt-6 md:mt-0 text-sm sm:text-base text-[#686764] font-creato max-w-md font-normal leading-relaxed">
          Motion systems, cinematic direction, and interaction physics designed for forward-thinking brands and culture.
        </p>
      </div>

      <div className="space-y-24 sm:space-y-32 lg:space-y-36">
        {/* ================================================================== */}
        {/* 01 — FULL-WIDTH FEATURE (Spotify)                                   */}
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
            <div className="flex items-center justify-between pb-4 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
              <div className="flex items-center gap-3">
                <span className="text-[#171717] font-semibold">01</span>
                <span className="text-[#9A9185]">/</span>
                <span className="text-[#171717] font-medium">{p1.client}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{p1.category}</span>
                <span className="text-[#9A9185] hidden sm:inline">·</span>
                <span className="hidden sm:inline">{p1.year}</span>
              </div>
            </div>

            {/* Large Cinematic Media */}
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
            <div className="mt-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                  {p1.title}
                </h3>
                <p className="text-sm sm:text-base text-[#686764] mt-1.5 max-w-2xl font-creato font-normal leading-relaxed">
                  {p1.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-creato font-medium tracking-[0.14em] uppercase text-[#171717] group-hover:text-black transition-colors shrink-0">
                <span>View Project</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          </article>
        )}

        {/* ================================================================== */}
        {/* 02 + 03 — BALANCED TWO-COLUMN PRESENTATION (Nike & Apple Music)    */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Project 02: Nike */}
          {p2 && (
            <article
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(p2)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p2)}
              className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
              aria-label={`View project: ${p2.title}`}
            >
              <div className="flex items-center justify-between pb-3.5 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#171717] font-semibold">02</span>
                  <span className="text-[#9A9185]">/</span>
                  <span className="text-[#171717] font-medium">{p2.client}</span>
                </div>
                <span>{p2.year}</span>
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

              <div className="mt-4 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                    {p2.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xs font-creato text-[#686764] tracking-normal">
                  {p2.category}
                </div>
                <p className="text-sm text-[#686764] mt-1 line-clamp-2 font-creato font-normal leading-relaxed">
                  {p2.description}
                </p>
              </div>
            </article>
          )}

          {/* Project 03: Apple Music */}
          {p3 && (
            <article
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(p3)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p3)}
              className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
              aria-label={`View project: ${p3.title}`}
            >
              <div className="flex items-center justify-between pb-3.5 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#171717] font-semibold">03</span>
                  <span className="text-[#9A9185]">/</span>
                  <span className="text-[#171717] font-medium">{p3.client}</span>
                </div>
                <span>{p3.year}</span>
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

              <div className="mt-4 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                    {p3.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xs font-creato text-[#686764] tracking-normal">
                  {p3.category}
                </div>
                <p className="text-sm text-[#686764] mt-1 line-clamp-2 font-creato font-normal leading-relaxed">
                  {p3.description}
                </p>
              </div>
            </article>
          )}
        </div>

        {/* ================================================================== */}
        {/* 04 — FULL-WIDTH FEATURE (Meta Interaction Choreography)           */}
        {/* ================================================================== */}
        {p4 && (
          <article
            tabIndex={0}
            role="button"
            onClick={() => onSelectProject(p4)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p4)}
            className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
            aria-label={`View project: ${p4.title}`}
          >
            <div className="flex items-center justify-between pb-4 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
              <div className="flex items-center gap-3">
                <span className="text-[#171717] font-semibold">04</span>
                <span className="text-[#9A9185]">/</span>
                <span className="text-[#171717] font-medium">{p4.client}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{p4.category}</span>
                <span className="text-[#9A9185] hidden sm:inline">·</span>
                <span className="hidden sm:inline">{p4.year}</span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex justify-center items-center py-6 sm:py-10">
              <div className="w-full max-w-[420px]">
                <VideoFrame
                  src={p4.video}
                  poster={p4.poster}
                  aspectRatio="9/16"
                  alt={p4.title}
                  hoverScale={true}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                  {p4.title}
                </h3>
                <p className="text-sm sm:text-base text-[#686764] mt-1.5 max-w-2xl font-creato font-normal leading-relaxed">
                  {p4.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-creato font-medium tracking-[0.14em] uppercase text-[#171717] group-hover:text-black transition-colors shrink-0">
                <span>View Project</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          </article>
        )}

        {/* ================================================================== */}
        {/* 05 + 06 — BALANCED TWO-COLUMN PRESENTATION (A24 & Polestar)       */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Project 05: A24 */}
          {p5 && (
            <article
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(p5)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p5)}
              className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
              aria-label={`View project: ${p5.title}`}
            >
              <div className="flex items-center justify-between pb-3.5 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#171717] font-semibold">05</span>
                  <span className="text-[#9A9185]">/</span>
                  <span className="text-[#171717] font-medium">{p5.client}</span>
                </div>
                <span>{p5.year}</span>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
                <VideoFrame
                  src={p5.video}
                  poster={p5.poster}
                  aspectRatio="16/9"
                  alt={p5.title}
                  hoverScale={true}
                />
              </div>

              <div className="mt-4 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                    {p5.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xs font-creato text-[#686764] tracking-normal">
                  {p5.category}
                </div>
                <p className="text-sm text-[#686764] mt-1 line-clamp-2 font-creato font-normal leading-relaxed">
                  {p5.description}
                </p>
              </div>
            </article>
          )}

          {/* Project 06: Polestar */}
          {p6 && (
            <article
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(p6)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p6)}
              className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl"
              aria-label={`View project: ${p6.title}`}
            >
              <div className="flex items-center justify-between pb-3.5 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#171717] font-semibold">06</span>
                  <span className="text-[#9A9185]">/</span>
                  <span className="text-[#171717] font-medium">{p6.client}</span>
                </div>
                <span>{p6.year}</span>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
                <VideoFrame
                  src={p6.video}
                  poster={p6.poster}
                  aspectRatio="16/9"
                  alt={p6.title}
                  hoverScale={true}
                />
              </div>

              <div className="mt-4 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                    {p6.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xs font-creato text-[#686764] tracking-normal">
                  {p6.category}
                </div>
                <p className="text-sm text-[#686764] mt-1 line-clamp-2 font-creato font-normal leading-relaxed">
                  {p6.description}
                </p>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};
