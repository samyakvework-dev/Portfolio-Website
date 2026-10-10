import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SelectedWork } from './components/SelectedWork';
import { CreativeProcess } from './components/CreativeProcess';
import { ReelSection } from './components/ReelSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { VideoEditingPage } from './pages/VideoEditingPage';
import { MotionGraphicsPage } from './pages/MotionGraphicsPage';
import { GraphicDesignPage } from './pages/GraphicDesignPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { projects as defaultProjects, fetchLiveProjects, type Project } from './data/projects';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith('/admin') || hash === '#admin') return '/admin';
      if (path.startsWith('/video-editing') || hash === '#video-editing') return '/video-editing';
      if (path.startsWith('/motion-graphics') || hash === '#motion-graphics') return '/motion-graphics';
      if (path.startsWith('/graphic-design') || hash === '#graphic-design') return '/graphic-design';
      if (path.startsWith('/about') || hash === '#about') return '/about';
      if (path.startsWith('/contact') || hash === '#contact') return '/contact';
    }
    return '/';
  });

  const [allProjects, setAllProjects] = useState<Project[]>(defaultProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch live projects from persistent backend on mount
  useEffect(() => {
    fetchLiveProjects().then((live) => {
      if (Array.isArray(live) && live.length > 0) {
        setAllProjects(live);
      }
    });
  }, [currentPath]);

  // Sync state with URL path & hash
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // Handle Case Study Modal deep links: #work/slug
      if (hash.startsWith('#work/')) {
        const slug = hash.replace('#work/', '');
        const found = allProjects.find((p) => p.slug === slug || p.id === slug);
        if (found) {
          setSelectedProject(found);
          return;
        }
      } else {
        setSelectedProject(null);
      }

      // Check routes
      if (path.startsWith('/admin') || hash === '#admin') {
        setCurrentPath('/admin');
      } else if (path.startsWith('/video-editing') || hash === '#video-editing') {
        setCurrentPath('/video-editing');
      } else if (path.startsWith('/motion-graphics') || hash === '#motion-graphics') {
        setCurrentPath('/motion-graphics');
      } else if (path.startsWith('/graphic-design') || hash === '#graphic-design') {
        setCurrentPath('/graphic-design');
      } else if (path.startsWith('/about') || hash === '#about') {
        setCurrentPath('/about');
      } else if (path.startsWith('/contact') || hash === '#contact') {
        setCurrentPath('/contact');
      } else {
        setCurrentPath('/');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [allProjects]);

  const navigateTo = useCallback((targetPath: string) => {
    setCurrentPath(targetPath);
    window.history.pushState(null, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    window.location.hash = `work/${project.slug || project.id}`;
  }, []);

  const handleCloseCaseStudy = useCallback(() => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#work/')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const handleNextProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = allProjects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % allProjects.length;
    const nextProject = allProjects[nextIndex];
    setSelectedProject(nextProject);
    window.location.hash = `work/${nextProject.slug || nextProject.id}`;
  }, [selectedProject, allProjects]);

  // Scroll to section on home page
  const handleScrollToSection = (sectionId: string) => {
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const target = document.getElementById(sectionId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD ROUTE: /admin
  // --------------------------------------------------------------------------
  if (currentPath === '/admin') {
    return (
      <div className="relative min-h-screen bg-[#F5F4F0] text-[#171717] font-creato">
        <Navbar currentPath="/admin" onNavigate={navigateTo} />
        <main className="w-full">
          <AdminPage />
        </main>
        <Footer onNavigate={navigateTo} />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // PUBLIC PORTFOLIO DESTINATIONS
  // --------------------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#F5F4F0] text-[#171717] selection:bg-[#171717] selection:text-[#F5F4F0] font-creato">
      {/* Sticky Minimal Navigation */}
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />

      <main className="w-full">
        {/* Route 1: Video Editing Dedicated Page */}
        {currentPath === '/video-editing' && (
          <VideoEditingPage
            projects={allProjects}
            onSelectProject={handleSelectProject}
          />
        )}

        {/* Route 2: Motion Graphics Dedicated Page */}
        {currentPath === '/motion-graphics' && (
          <MotionGraphicsPage
            projects={allProjects}
            onSelectProject={handleSelectProject}
          />
        )}

        {/* Route 3: Graphic Design Dedicated Page */}
        {currentPath === '/graphic-design' && (
          <GraphicDesignPage
            projects={allProjects}
            onSelectProject={handleSelectProject}
          />
        )}

        {/* Route 4: About Dedicated Page */}
        {currentPath === '/about' && (
          <AboutPage onNavigateContact={() => navigateTo('/contact')} />
        )}

        {/* Route 5: Contact Dedicated Page */}
        {currentPath === '/contact' && (
          <ContactPage />
        )}

        {/* Route 6: Home Page (Flagship Featured Showcases & Portals) */}
        {currentPath === '/' && (
          <>
            {/* 01 — HERO (Approved identity, focus pills) */}
            <Hero onExploreWork={() => handleScrollToSection('work')} />

            {/* 02 — SELECTED WORK (Preserves top 3 showcases in order: Spotify, Nike, Apple Music + Discipline Portals) */}
            <SelectedWork
              projects={allProjects}
              onSelectProject={handleSelectProject}
              onNavigateCategory={navigateTo}
            />

            {/* 03 — CREATIVE PROCESS (Disciplined 5-phase workflow, tightened spacing) */}
            <CreativeProcess />

            {/* 04 — SHOWREEL 2026 (Proportional container, no excessive free space) */}
            <ReelSection />

            {/* 05 — ABOUT PERSPECTIVE (Authentic disciplines & Citadel signature) */}
            <AboutSection onNavigateAbout={() => navigateTo('/about')} />

            {/* 06 — SERVICES & DISCIPLINES (Approved 3 services: Video, Motion, Graphic Design) */}
            <ServicesSection />

            {/* 07 — CONTACT SECTION & DIRECT INQUIRY (Balanced 2 columns, email copy) */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Minimal Cinematic Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Deep-Dive Case Study Modal */}
      <CaseStudyModal
        project={selectedProject}
        onClose={handleCloseCaseStudy}
        onNextProject={handleNextProject}
      />
    </div>
  );
};

export default App;
