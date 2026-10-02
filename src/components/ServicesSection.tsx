import React from 'react';
import { siteConfig } from '../data/site';

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="w-full py-28 md:py-36 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-black/[0.08] bg-[#F5F4F0]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 sm:mb-20">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
            05 / CAPABILITIES
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            SERVICES & DISCIPLINES
          </h2>
        </div>
        <p className="mt-2 sm:mt-0 text-sm text-[#686764] font-creato max-w-sm">
          Collaborating with creative agencies, brands, and directors from initial thesis to final cinema finishing.
        </p>
      </div>

      {/* Elegant Numbered List (No clunky cards) */}
      <div className="divide-y divide-black/[0.08] border-b border-black/[0.08]">
        {siteConfig.capabilities.map((cap) => (
          <div
            key={cap.number}
            className="group py-8 sm:py-12 transition-all duration-300 hover:bg-[#ECEBE7] -mx-4 px-4 rounded-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
              {/* Number & Title */}
              <div className="lg:col-span-6 flex items-baseline gap-6 sm:gap-10">
                <span className="font-creato text-sm sm:text-base text-[#9A9185] group-hover:text-[#171717] font-medium transition-colors">
                  {cap.number}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-creato font-medium tracking-tight text-[#171717] group-hover:translate-x-1 transition-all">
                    {cap.title}
                  </h3>
                  <span className="text-xs font-creato uppercase tracking-wider text-[#9A9185] mt-1 block">
                    {cap.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="lg:col-span-4 mt-2 lg:mt-1">
                <p className="text-sm sm:text-base font-creato text-[#686764] leading-relaxed">
                  {cap.description}
                </p>
              </div>

              {/* Deliverables tags */}
              <div className="lg:col-span-2 mt-3 lg:mt-1 flex flex-wrap gap-1.5 lg:justify-end">
                {cap.deliverables.map((item) => (
                  <span
                    key={item}
                    className="text-[11px] font-creato px-2.5 py-1 rounded-full bg-white text-[#171717] border border-black/[0.05]"
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
