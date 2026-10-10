import React, { useState } from 'react';
import { type Project } from '../data/projects';
import { VideoFrame } from '../components/VideoFrame';
import { ArrowUpRight, Film } from 'lucide-react';

interface VideoEditingPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const VideoEditingPage: React.FC<VideoEditingPageProps> = ({
  projects,
  onSelectProject,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter for Video Editing projects
  const videoProjects = projects.filter(
    (p) => p.category.toLowerCase().includes('video') || p.category.toLowerCase().includes('edit')
  );

  const filterOptions = ['All', 'Commercial', 'Sports & Action', 'Talking Head & Social'];

  const filtered = activeFilter === 'All'
    ? videoProjects
    : videoProjects.filter((p) => {
        if (activeFilter === 'Commercial') return p.subCategory?.includes('Commercial') || p.tags.includes('Commercial');
        if (activeFilter === 'Sports & Action') return p.subCategory?.includes('Sports') || p.tags.includes('Sports Edit');
        if (activeFilter === 'Talking Head & Social') return p.subCategory?.includes('Social') || p.tags.includes('Social Video') || p.aspectRatio === '9/16';
        return true;
      });

  return (
    <div className="w-full min-h-screen pt-28 pb-24 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Page Header */}
      <div className="mb-12 pb-8 border-b border-black/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
            DISCIPLINE ARCHIVE
          </span>
          <h1 className="hero-headline text-[#171717] font-creato">
            VIDEO EDITING
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-[#686764] font-editorial max-w-2xl">
            Commercial campaigns, high-velocity sports edits, spec ads, and retention-focused storytelling.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setActiveFilter(opt)}
              className={`px-4 py-1.5 rounded-full text-xs font-creato tracking-wider uppercase transition-all duration-300 ${
                activeFilter === opt
                  ? 'bg-[#171717] text-white'
                  : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717] hover:bg-black/[0.06]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
          <Film className="w-8 h-8 text-[#9A9185] mx-auto mb-3" />
          <p className="text-sm font-creato text-[#686764]">No video projects found matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {filtered.map((p, idx) => {
            const isVertical = p.aspectRatio === '9/16';
            return (
              <article
                key={p.id}
                tabIndex={0}
                role="button"
                onClick={() => onSelectProject(p)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p)}
                className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl flex flex-col justify-between"
                aria-label={`View project: ${p.title}`}
              >
                {/* Metadata Header */}
                <div className="flex items-center justify-between pb-3 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#171717] font-semibold">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-[#9A9185]">/</span>
                    <span className="text-[#171717] font-medium">{p.client}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#171717] text-[10px]">
                      {p.aspectRatio}
                    </span>
                    <span>{p.year}</span>
                  </div>
                </div>

                {/* Media Container — Handles both 16:9 and 9:16 cleanly */}
                <div className={`relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] ${
                  isVertical ? 'flex justify-center items-center py-6 bg-[#E5E3DF]' : ''
                }`}>
                  <div className={isVertical ? 'w-full max-w-[320px]' : 'w-full'}>
                    <VideoFrame
                      src={p.video}
                      poster={p.poster}
                      aspectRatio={p.aspectRatio}
                      alt={p.title}
                      hoverScale={true}
                    />
                  </div>
                </div>

                {/* Info Bar */}
                <div className="mt-4 flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato">
                      {p.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#9A9185] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#686764] line-clamp-2 font-creato font-normal leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-creato text-[#686764] bg-black/[0.04] px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
