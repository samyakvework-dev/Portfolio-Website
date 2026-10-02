import React, { useState } from 'react';
import { projects, type Project, type ProjectCategory } from '../data/projects';
import { CategoryNavigation } from '../components/CategoryNavigation';
import { ProjectGrid } from '../components/ProjectGrid';
import { VideoModal } from '../components/VideoModal';

export const ProjectsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Compute category counts dynamically from projects array
  const categoryCounts = projects.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#FF6A00] block mb-3">
          SHOWCASE
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
          PROJECTS
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1A1] mt-3 max-w-xl mx-auto leading-relaxed">
          Carefully choreographed motion design, retention-focused talking head edits, and color-graded stories.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="mb-12">
        <CategoryNavigation
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Project Grid */}
      <ProjectGrid
        projects={projects}
        activeCategory={activeCategory}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      {/* Video Modal Player */}
      <VideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
