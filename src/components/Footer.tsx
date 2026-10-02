import React from 'react';
import { siteConfig } from '../data/site';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#111111] text-[#ECEBE7] py-20 md:py-28 border-t border-white/[0.08]">
      {/* Subtle Atmospheric Light Variation in Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(154, 145, 133, 0.25) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Top Statement & Invitation */}
        <div className="pb-16 md:pb-24 border-b border-white/[0.1] flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-3">
              Next Step
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-creato font-medium tracking-tight text-white max-w-2xl leading-[1.08]">
              Have an idea worth <span className="font-editorial font-normal text-[#9A9185]">bringing to life?</span>
            </h2>
          </div>

          <div>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="group inline-flex items-center gap-3 text-xl sm:text-2xl font-creato font-medium text-white hover:text-[#ECEBE7] transition-all py-2"
            >
              <span className="relative pb-1">
                Let's Create
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5 text-white" />
            </a>
          </div>
        </div>

        {/* Middle Navigation & Contact Details */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-white/[0.08] text-xs font-creato">
          {/* Brand Monogram */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="text-base font-semibold text-white tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-[#9A9185] text-xs tracking-normal">
              {siteConfig.role}
            </p>
          </div>

          {/* Quick Section Navigation */}
          <div className="md:col-span-4 flex flex-wrap gap-x-8 gap-y-3 uppercase tracking-wider text-[#9A9185]">
            <button
              type="button"
              onClick={() => scrollTo('hero')}
              className="hover:text-white transition-colors"
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => scrollTo('work')}
              className="hover:text-white transition-colors"
            >
              Work
            </button>
            <button
              type="button"
              onClick={() => scrollTo('process')}
              className="hover:text-white transition-colors"
            >
              Process
            </button>
            <button
              type="button"
              onClick={() => scrollTo('experiments')}
              className="hover:text-white transition-colors"
            >
              Experiments
            </button>
            <button
              type="button"
              onClick={() => scrollTo('about')}
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollTo('contact')}
              className="hover:text-white transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Direct Email & Social Handle */}
          <div className="md:col-span-4 flex flex-col md:items-end space-y-1.5 text-right">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-white hover:underline text-sm font-medium tracking-tight"
            >
              {siteConfig.contactEmail}
            </a>
            {siteConfig.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9A9185] hover:text-white transition-colors text-xs"
              >
                {s.label} ({s.handle})
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-creato text-[#686764]">
          <div>
            <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
          </div>
          <div>
            <span>Built with precision & restraint.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
