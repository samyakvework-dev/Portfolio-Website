import React from 'react';
import { projects, type Project } from '../data/projects';
import { ArrowUpRight } from 'lucide-react';

interface ProjectIndexProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectIndex: React.FC<ProjectIndexProps> = ({ onSelectProject }) => {
  return (
    <section
      id="index"
      className="relative w-full py-24 md:py-32 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-14 pb-6 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
            04 / ARCHIVE
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            PROJECT ARCHIVE
          </h2>
        </div>
        <p className="mt-2 sm:mt-0 text-xs sm:text-sm font-creato uppercase tracking-[0.14em] text-[#686764]">
          Index of All Works · ({projects.length} Commissions)
        </p>
      </div>

      {/* Editorial Table / Row Index (No cursor-following floating card) */}
      <div className="divide-y divide-black/[0.08] border-b border-black/[0.08]">
        {projects.map((project, idx) => {
          const formattedIdx = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={project.id}
              tabIndex={0}
              role="button"
              onClick={() => onSelectProject(project)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectProject(project)}
              className="group flex flex-col md:flex-row md:items-center justify-between py-6 sm:py-7 cursor-pointer focus:outline-none focus-visible:bg-black/5 transition-all duration-300 -mx-4 px-4 rounded-xl hover:bg-[#ECEBE7]"
              aria-label={`Open case study for ${project.title}`}
            >
              {/* Left: Number & Title */}
              <div className="flex items-baseline gap-6 sm:gap-10">
                <span className="font-creato text-xs text-[#9A9185] group-hover:text-[#171717] transition-colors w-6">
                  {formattedIdx}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-creato font-medium tracking-tight text-[#171717] group-hover:text-black group-hover:translate-x-1 transition-all">
                    {project.title}
                  </h3>
                  <span className="text-xs text-[#686764] md:hidden block mt-1 font-creato">
                    {project.category} · {project.year}
                  </span>
                </div>
              </div>

              {/* Right: Category, Year & Subtle Arrow */}
              <div className="hidden md:flex items-center gap-10 text-xs sm:text-sm text-[#686764] font-creato">
                <span className="w-56 text-left truncate">{project.category}</span>
                <span className="font-creato text-xs text-[#9A9185] w-12 text-right">
                  {project.year}
                </span>
                <div className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-[#9A9185] group-hover:text-[#171717] group-hover:border-black/30 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
