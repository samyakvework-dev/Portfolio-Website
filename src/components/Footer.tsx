import React from 'react';
import { siteConfig } from '../data/site';
import { ArrowRight, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden bg-[#111111] text-[#ECEBE7] py-14 md:py-18 border-t border-white/[0.08]">
      {/* Subtle Atmospheric Light Variation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(154, 145, 133, 0.25) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Top Statement & Invitation */}
        <div className="pb-10 md:pb-12 border-b border-white/[0.1] flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-[11px] font-creato uppercase tracking-[0.2em] text-[#86868B] block mb-2">
              Next Step
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-creato font-semibold text-white tracking-tight leading-[1.05]">
              Have an idea worth<br />
              <span className="font-editorial font-normal italic text-[#ECEBE7]">bringing to life?</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/contact') : window.location.assign('#contact')}
            className="group inline-flex items-center gap-3 text-sm sm:text-base font-creato font-medium tracking-tight text-white hover:text-white/80 transition-colors py-2"
          >
            <span>Let's Create</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>

        {/* Middle Navigation & Information */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs font-creato">
          {/* Col 1: Identity */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="text-sm font-semibold tracking-[-0.01em] text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-[#86868B] leading-relaxed">
              Video Editor · Motion Graphics · Graphic Designer
            </p>
          </div>

          {/* Col 2: Categories */}
          <div>
            <span className="text-white/40 uppercase tracking-widest block mb-3 text-[11px]">
              Categories
            </span>
            <ul className="space-y-2 text-[#86868B]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/video-editing')}
                  className="hover:text-white transition-colors"
                >
                  Video Editing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/motion-graphics')}
                  className="hover:text-white transition-colors"
                >
                  Motion Graphics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/graphic-design')}
                  className="hover:text-white transition-colors"
                >
                  Graphic Design
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <span className="text-white/40 uppercase tracking-widest block mb-3 text-[11px]">
              Navigation
            </span>
            <ul className="space-y-2 text-[#86868B]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/')}
                  className="hover:text-white transition-colors"
                >
                  Featured Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Perspective
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Direct Inquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div>
            <span className="text-white/40 uppercase tracking-widest block mb-3 text-[11px]">
              Direct Contact
            </span>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-[#86868B] hover:text-white transition-colors block mb-1"
            >
              {siteConfig.contactEmail}
            </a>
            <a
              href="https://www.instagram.com/sam7archives"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868B] hover:text-white transition-colors block"
            >
              Instagram (@sam7archives)
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Admin Portal Link */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-creato text-[#86868B]">
          <span>© {currentYear} {siteConfig.name}. All rights reserved.</span>

          <div className="flex items-center gap-6">
            <span>Built with precision & restraint.</span>
            <button
              type="button"
              onClick={() => onNavigate?.('/admin')}
              className="inline-flex items-center gap-1.5 text-[#86868B] hover:text-white transition-colors"
              title="Admin CMS Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
