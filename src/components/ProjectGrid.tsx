import React from 'react';
import type { Project, ProjectCategory } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { FolderGit2 } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  activeCategory: ProjectCategory | 'All';
  onSelectProject?: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  activeCategory,
  onSelectProject
}) => {
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  if (filteredProjects.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center rounded-[24px] bg-[#161616]/50 border border-white/6 px-4">
        <FolderGit2 className="w-10 h-10 text-white/30 mb-3" />
        <h3 className="text-lg font-semibold text-white">No projects found in this category</h3>
        <p className="text-sm text-[#A1A1A1] mt-1 max-w-sm">
          Add new projects to <code className="text-[#FF6A00] font-mono text-xs">src/data/projects.ts</code> to see them rendered here automatically.
        </p>
      </div>
    );
  }

  // Determine grid layout based on category aspect ratio
  // If activeCategory is Talking Head or Testimonial -> pure 9:16 vertical grid: 4 cols desktop, 2 cols tablet, 1 col mobile
  // If activeCategory is Motion Graphics or Colour Grading -> pure 16:9 landscape grid: 2 cols desktop, 1 col mobile
  // If 'All', we can group them logically or display them in responsive adaptive layout
  const isAllVertical = activeCategory === 'Talking Head' || activeCategory === 'Testimonial';
  const isAllLandscape = activeCategory === 'Motion Graphics' || activeCategory === 'Colour Grading';

  if (isAllVertical) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
        {filteredProjects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            projectNumber={idx + 1}
            onSelectProject={onSelectProject}
          />
        ))}
      </div>
    );
  }

  if (isAllLandscape) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
        {filteredProjects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            projectNumber={idx + 1}
            onSelectProject={onSelectProject}
          />
        ))}
      </div>
    );
  }

  // Mixed 'All' view: group landscape, vertical, and artwork sections cleanly
  const landscapeProjects = filteredProjects.filter(p => p.aspectRatio === '16/9' || p.aspectRatio === '2.39/1');
  const verticalProjects = filteredProjects.filter(p => p.aspectRatio === '9/16');
  const artworkProjects = filteredProjects.filter(p => !landscapeProjects.includes(p) && !verticalProjects.includes(p));

  return (
    <div className="space-y-16 w-full">
      {/* Landscape Section (Motion Graphics & Commercials) */}
      {landscapeProjects.length > 0 && (
        <section aria-labelledby="landscape-showcase">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-white/6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6A00]">
                Landscape Format (16:9)
              </span>
              <h3 id="landscape-showcase" className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Motion Graphics & Colour Grading
              </h3>
            </div>
            <span className="text-xs font-mono text-white/40">
              {landscapeProjects.length} Projects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {landscapeProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                projectNumber={idx + 1}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        </section>
      )}

      {/* Vertical Section (Talking Head & Vertical Reels) */}
      {verticalProjects.length > 0 && (
        <section aria-labelledby="vertical-showcase">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-white/6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6A00]">
                Vertical Format (9:16)
              </span>
              <h3 id="vertical-showcase" className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Talking Head & Retention Reels
              </h3>
            </div>
            <span className="text-xs font-mono text-white/40">
              {verticalProjects.length} Projects
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {verticalProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                projectNumber={landscapeProjects.length + idx + 1}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        </section>
      )}

      {/* Artwork & Key Art Section (Graphic Design, Posters & Exhibition Prints) */}
      {artworkProjects.length > 0 && (
        <section aria-labelledby="artwork-showcase">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-white/6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6A00]">
                Key Visuals & Poster Art
              </span>
              <h3 id="artwork-showcase" className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Graphic Design & Typography
              </h3>
            </div>
            <span className="text-xs font-mono text-white/40">
              {artworkProjects.length} Projects
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {artworkProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                projectNumber={landscapeProjects.length + verticalProjects.length + idx + 1}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
