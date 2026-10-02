import React, { useState } from 'react';
import { siteConfig } from '../data/site';
import { ArrowUpRight } from 'lucide-react';

export const Experiments: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'AI', '3D', 'Motion', 'Web'];

  const filteredExperiments =
    activeCategory === 'All'
      ? siteConfig.experiments
      : siteConfig.experiments.filter((exp) => exp.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="experiments" className="w-full py-28 md:py-36 lg:py-44 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-3">
            03 / LABORATORY
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            EXPERIMENTS
          </h2>
          <p className="mt-3 text-xl sm:text-2xl text-[#686764] font-editorial">
            AI / 3D / Motion / Web
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-creato tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#171717] text-white'
                  : 'bg-[#ECEBE7] text-[#686764] hover:text-[#171717] hover:bg-black/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Experimental Laboratory Grid — Overlapping & Asymmetrical */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {filteredExperiments.map((exp, idx) => {
          // Asymmetrical column spans for an intentional editorial layout
          const colSpan = idx % 3 === 0 ? 'lg:col-span-7' : idx % 3 === 1 ? 'lg:col-span-5' : 'lg:col-span-12';

          return (
            <div
              key={exp.id}
              className={`${colSpan} group relative rounded-2xl bg-[#ECEBE7] border border-black/[0.06] overflow-hidden transition-all duration-500 hover:border-black/[0.14] hover:shadow-[0_16px_36px_rgba(0,0,0,0.04)]`}
            >
              {/* Media Preview Box */}
              <div className="relative overflow-hidden bg-black/5 aspect-[16/10] w-full">
                <img
                  src={exp.src}
                  alt={exp.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] filter contrast-[1.03]"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-creato uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#171717] border border-black/[0.06] font-medium">
                    {exp.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#171717] shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Experiment Metadata */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs font-creato uppercase tracking-[0.16em] text-[#9A9185] mb-2">
                  <span>EXP {exp.number}</span>
                  <span>{exp.aspectRatio}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-creato font-medium text-[#171717] tracking-tight mb-2 group-hover:text-black transition-colors">
                  {exp.title}
                </h3>

                <p className="text-sm font-creato text-[#686764] leading-relaxed mb-6 font-normal">
                  {exp.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-black/[0.06]">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded text-[11px] font-creato text-[#686764] bg-black/[0.04]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
