import React, { useState, useEffect } from 'react';
import { siteConfig } from '../data/site';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (targetId: string) => void;
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'Process', id: 'process' },
    { label: 'Experiments', id: 'experiments' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleItemClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'contact' && onOpenContact) {
      onOpenContact();
    } else {
      onNavigate(id);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#F5F4F0]/90 backdrop-blur-md border-b border-black/[0.07] py-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* Left: Brand Monogram & Name */}
        <button
          type="button"
          onClick={() => handleItemClick('hero')}
          className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded py-1"
        >
          <span className="w-2 h-2 rounded-full bg-[#171717] transition-transform duration-300 group-hover:scale-125" />
          <span className="text-[15px] font-creato font-semibold tracking-[-0.02em] text-[#171717] group-hover:text-black transition-colors">
            {siteConfig.name}
          </span>
        </button>

        {/* Desktop Nav Items: Clean, Right-Aligned, Apple Spacing */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className="text-[13px] font-creato font-medium tracking-[0.04em] uppercase text-[#686764] hover:text-[#171717] transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-black/30 rounded py-1"
            >
              {item.label}
            </button>
          ))}
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

      {/* Mobile Drawer (Minimal, Content-First) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[#F5F4F0]/98 backdrop-blur-xl border-b border-black/[0.08] shadow-xl py-6 px-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className="text-left text-base font-creato font-medium text-[#171717] hover:text-black py-1.5 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-5 border-t border-black/[0.08] text-xs font-creato text-[#686764]">
            {siteConfig.availability}
          </div>
        </div>
      )}
    </header>
  );
};
