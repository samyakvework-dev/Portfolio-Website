import React, { useState } from 'react';
import { type Project } from '../data/projects';
import { ArrowUpRight, Palette, Maximize2 } from 'lucide-react';

interface GraphicDesignPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const GraphicDesignPage: React.FC<GraphicDesignPageProps> = ({
  projects,
  onSelectProject,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter for Graphic Design projects
  const designProjects = projects.filter(
    (p) => p.category.toLowerCase().includes('graphic') || p.category.toLowerCase().includes('design') || p.subCategory?.includes('Poster') || p.subCategory?.includes('Visual Identity')
  );

  const filterOptions = ['All', 'Posters & Key Art', 'Visual Identity', 'Editorial Layout'];

  const filtered = activeFilter === 'All'
    ? designProjects
    : designProjects.filter((p) => {
        if (activeFilter === 'Posters & Key Art') return p.subCategory?.includes('Poster') || p.tags.includes('Poster Design');
        if (activeFilter === 'Visual Identity') return p.subCategory?.includes('Identity') || p.tags.includes('Brand Identity');
        if (activeFilter === 'Editorial Layout') return p.subCategory?.includes('Layout') || p.tags.includes('Typography');
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
            GRAPHIC DESIGN
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-[#686764] font-editorial max-w-2xl">
            Cinematic key art, modernist editorial posters, Swiss typography grids, and visual brand identity.
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

      {/* Static Artwork Grid (Honors natural artwork proportions) */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
          <Palette className="w-8 h-8 text-[#9A9185] mx-auto mb-3" />
          <p className="text-sm font-creato text-[#686764]">No graphic design projects found matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {filtered.map((p, idx) => (
            <article
              key={p.id}
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(p)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(p)}
              className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-xl flex flex-col justify-between"
              aria-label={`View design artwork: ${p.title}`}
            >
              {/* Metadata Header */}
              <div className="flex items-center justify-between pb-2.5 text-xs font-creato uppercase tracking-[0.16em] text-[#686764]">
                <div className="flex items-center gap-2">
                  <span className="text-[#171717] font-semibold">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-[#9A9185]">/</span>
                  <span className="text-[#171717] font-medium">{p.client}</span>
                </div>
                <span>{p.year}</span>
              </div>

              {/* Artwork Container (Natural artwork aspect ratio: 4:3 or 16:9 without stretching) */}
              <div className="relative rounded-xl overflow-hidden bg-[#ECEBE7] ring-1 ring-black/[0.06] transition-all duration-700 ease-out group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/5">
                  <img
                    src={p.poster || p.thumbnail}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-creato flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Artwork</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Bar */}
              <div className="mt-3.5 flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-[#171717] group-hover:text-black transition-colors font-creato text-lg">
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
          ))}
        </div>
      )}
    </div>
  );
};
