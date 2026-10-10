import React, { useState, useEffect } from 'react';
import { siteConfig } from '../data/site';
import { Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Video Editing', path: '/video-editing' },
    { label: 'Motion Graphics', path: '/motion-graphics' },
    { label: 'Graphic Design', path: '/graphic-design' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleItemClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F5F4F0]/92 backdrop-blur-md border-b border-black/[0.07] py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* Left: Brand Monogram & Name */}
        <button
          type="button"
          onClick={() => handleItemClick('/')}
          className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded py-1"
        >
          <span className="w-2 h-2 rounded-full bg-[#171717] transition-transform duration-300 group-hover:scale-125" />
          <span className="text-[15px] font-creato font-semibold tracking-[-0.02em] text-[#171717] group-hover:text-black transition-colors">
            {siteConfig.name}
          </span>
        </button>

        {/* Desktop Nav Items: Clean, Right-Aligned */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleItemClick(item.path)}
                className={`text-[12px] font-creato font-medium tracking-[0.06em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-black/30 rounded py-1 ${
                  isActive
                    ? 'text-[#171717] font-semibold border-b-2 border-[#171717]'
                    : 'text-[#686764] hover:text-[#171717]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#171717] hover:bg-black/5 transition-colors focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[#F5F4F0]/98 backdrop-blur-xl border-b border-black/[0.08] shadow-xl py-6 px-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col space-y-3.5">
            <button
              type="button"
              onClick={() => handleItemClick('/')}
              className={`text-left text-base font-creato font-medium py-1 transition-colors ${
                currentPath === '/' ? 'text-black font-semibold' : 'text-[#686764] hover:text-black'
              }`}
            >
              Home (Featured)
            </button>
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleItemClick(item.path)}
                className={`text-left text-base font-creato font-medium py-1 transition-colors ${
                  currentPath === item.path ? 'text-black font-semibold' : 'text-[#686764] hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-5 border-t border-black/[0.08] flex items-center justify-between text-xs font-creato text-[#686764]">
            <span>{siteConfig.availability}</span>
            <button
              type="button"
              onClick={() => handleItemClick('/admin')}
              className="inline-flex items-center gap-1 text-[#171717] hover:underline"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
