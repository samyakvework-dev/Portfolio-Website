import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ExperimentItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  aspectRatio: string;
  mediaType: string;
  src: string;
  tags: string[];
}

const motionExperiments: ExperimentItem[] = [
  {
    id: "exp-01",
    number: "01",
    category: "Motion",
    title: "Kinetic Micro-Typography & Velocity Ramps",
    description: "Parametric variable type choreography reacting to vocal cadence, temporal easing, and simulated surface friction.",
    aspectRatio: "16/9",
    mediaType: "image",
    src: "/projects/project-01/poster.jpg",
    tags: ["Kinetic Type", "Temporal Easing", "After Effects"]
  },
  {
    id: "exp-02",
    number: "02",
    category: "Edit",
    title: "Sound-Transient Cutting & Match Cuts",
    description: "Frame-accurate rhythmic cuts locked to low-end bass transients and micro-percussion hits.",
    aspectRatio: "16/9",
    mediaType: "image",
    src: "/projects/project-02/poster.jpg",
    tags: ["Pacing", "Sound Sync", "Premiere Pro"]
  },
  {
    id: "exp-03",
    number: "03",
    category: "Design",
    title: "Acoustic Waveforms & Swiss Grid Systems",
    description: "Exploring mathematical concentric circular forms and typographic grids for audio visualizers.",
    aspectRatio: "16/9",
    mediaType: "image",
    src: "/projects/project-03/poster.jpg",
    tags: ["Visual Identity", "Grid System", "Illustrator"]
  },
  {
    id: "exp-04",
    number: "04",
    category: "Motion",
    title: "Spatial Vector Displacement & Title Sequences",
    description: "Subtle optical aberration, film halation, and austere modernist title typography.",
    aspectRatio: "16/9",
    mediaType: "image",
    src: "/projects/project-04/poster.jpg",
    tags: ["Film Halation", "Title Sequence", "Motion"]
  }
];

export const Experiments: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Motion', 'Edit', 'Design'];

  const filteredExperiments =
    activeCategory === 'All'
      ? motionExperiments
      : motionExperiments.filter((exp) => exp.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="experiments" className="w-full py-16 md:py-24 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 pb-6 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
            03 / LABORATORY
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            MOTION & TYPE STUDIES
          </h2>
          <p className="mt-2 text-lg sm:text-xl text-[#686764] font-editorial">
            Kinetic typography, editorial pacing & visual experiments
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

      {/* Balanced 2-Column Grid eliminating trailing blank space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        {filteredExperiments.map((exp) => (
          <div
            key={exp.id}
            className="group relative rounded-2xl bg-[#ECEBE7] border border-black/[0.06] overflow-hidden transition-all duration-500 hover:border-black/[0.14] hover:shadow-[0_16px_36px_rgba(0,0,0,0.04)] flex flex-col justify-between"
          >
            {/* Media Preview Box */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/5">
              <img
                src={exp.src}
                alt={exp.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-creato tracking-widest uppercase">
                {exp.category}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-creato uppercase tracking-widest text-[#9A9185]">
                    EXP {exp.number}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#9A9185] transition-transform duration-300 group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="text-lg font-creato font-medium text-[#171717] group-hover:text-black transition-colors">
                  {exp.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#686764] leading-relaxed font-creato">
                  {exp.description}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-5 pt-4 border-t border-black/[0.06] flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-creato text-[#686764] bg-black/[0.03] px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
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
