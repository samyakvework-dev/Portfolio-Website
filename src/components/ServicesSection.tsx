import React from 'react';
import { siteConfig } from '../data/site';

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="w-full py-16 md:py-20 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-black/[0.08] bg-[#F5F4F0]"
    >
      {/* Header — Tightly Spaced */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 sm:mb-14 pb-5 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-1.5">
            04 / DISCIPLINES
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            SERVICES & DISCIPLINES
          </h2>
        </div>
        <p className="mt-2 sm:mt-0 text-xs sm:text-sm text-[#686764] font-creato max-w-sm font-normal">
          Collaborating with creators, brands, and agencies across commercial video, kinetic motion, and design.
        </p>
      </div>

      {/* Elegant Numbered List for the 3 Approved Disciplines */}
      <div className="divide-y divide-black/[0.08] border-b border-black/[0.08]">
        {siteConfig.capabilities.map((cap) => (
          <div
            key={cap.number}
            className="group py-8 sm:py-10 transition-all duration-300 hover:bg-[#ECEBE7] -mx-4 px-4 rounded-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
              {/* Number & Title */}
              <div className="lg:col-span-5 flex items-baseline gap-5 sm:gap-6">
                <span className="text-xs sm:text-sm font-creato font-semibold text-[#9A9185] group-hover:text-[#171717] transition-colors shrink-0">
                  {cap.number}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-creato font-medium text-[#171717] group-hover:text-black transition-colors">
                    {cap.title}
                  </h3>
                  <span className="inline-block mt-1 text-[11px] font-creato uppercase tracking-wider text-[#9A9185]">
                    {cap.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="lg:col-span-4 text-xs sm:text-sm text-[#686764] leading-relaxed font-creato font-normal">
                {cap.description}
              </div>

              {/* Deliverable Tags */}
              <div className="lg:col-span-3 flex flex-wrap gap-1.5 lg:justify-end">
                {cap.deliverables.map((item, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-creato text-[#686764] bg-[#ECEBE7] group-hover:bg-white/80 px-2.5 py-1 rounded-full transition-colors border border-black/[0.04]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
