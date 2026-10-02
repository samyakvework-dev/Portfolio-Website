import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SelectedWork } from './components/SelectedWork';
import { CreativeProcess } from './components/CreativeProcess';
import { Experiments } from './components/Experiments';
import { ReelSection } from './components/ReelSection';
import { ProjectIndex } from './components/ProjectIndex';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { projects, type Project } from './data/projects';

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sync state with URL hash (e.g. #work/spotify-motion-system)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#work/')) {
        const slug = hash.replace('#work/', '');
        const found = projects.find((p) => p.slug === slug || p.id === slug);
        if (found) {
          setSelectedProject(found);
          return;
        }
      }
      setSelectedProject(null);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    window.location.hash = `work/${project.slug}`;
  }, []);

  const handleCloseCaseStudy = useCallback(() => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#work/')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const handleNextProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    const nextProject = projects[nextIndex];
    setSelectedProject(nextProject);
    window.location.hash = `work/${nextProject.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProject]);

  const handleNavigateSection = (sectionId: string) => {
    if (selectedProject) {
      handleCloseCaseStudy();
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5F4F0] text-[#171717] selection:bg-[#171717] selection:text-[#F5F4F0] font-creato">
      {/* Minimal Sticky Navigation */}
      <Navbar
        onNavigate={handleNavigateSection}
        onOpenContact={() => handleNavigateSection('contact')}
      />

      <main className="w-full">
        {/* 01 — HERO with Cursor Reveal Effect */}
        <Hero onExploreWork={() => handleNavigateSection('work')} />

        {/* 02 — SELECTED WORK (Clean Editorial Rhythm) */}
        <SelectedWork onSelectProject={handleSelectProject} />

        {/* 03 — CREATIVE PROCESS (5-Step Editorial Journey) */}
        <CreativeProcess />

        {/* 04 — EXPERIMENTS (AI / 3D / Motion / Web Laboratory) */}
        <Experiments />

        {/* 05 — DEDICATED DARK CINEMATIC SHOWREEL */}
        <ReelSection />

        {/* 06 — COMPLETE PROJECT ARCHIVE INDEX */}
        <ProjectIndex onSelectProject={handleSelectProject} />

        {/* 07 — ABOUT PERSPECTIVE, CRAFT & CITADEL SIGNATURE */}
        <AboutSection />

        {/* 08 — SERVICES & CAPABILITIES */}
        <ServicesSection />

        {/* 09 — CONTACT FINALE & LET'S CREATE → CTA */}
        <ContactSection />
      </main>

      {/* 10 — MINIMAL CINEMATIC FOOTER */}
      <Footer />

      {/* DEEP-DIVE EDITORIAL CASE STUDY MODAL */}
      <CaseStudyModal
        project={selectedProject}
        onClose={handleCloseCaseStudy}
        onNextProject={handleNextProject}
      />
    </div>
  );
};

export default App;
