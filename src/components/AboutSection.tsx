import React from 'react';
import { siteConfig } from '../data/site';

export const AboutSection: React.FC = () => {
  const disciplines = [
    { title: "Motion Design", desc: "Kinetic brand tokens, design systems, and identity choreography." },
    { title: "Visual Storytelling", desc: "Commercial rhythm, narrative timing, and sound-reactive editing." },
    { title: "Creative Technology", desc: "Generative AI workflows, procedural pipelines, and creative code." },
    { title: "3D & Simulation", desc: "Spatial lighting, material physics, and tactile object rendering." },
    { title: "Animation", desc: "Sub-pixel UI spring dynamics, micro-interactions, and title sequences." },
  ];

  return (
    <section
      id="about"
      className="w-full py-28 md:py-36 lg:py-44 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]"
    >
      {/* Editorial Category Tag */}
      <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-4">
        04 / PERSPECTIVE
      </span>

      {/* Main Statement — Editorial Typography */}
      <div className="max-w-4xl mb-16 sm:mb-24">
        <h2 className="section-headline text-[#171717] font-creato">
          I turn ideas into <span className="font-editorial font-normal">movement</span>.
        </h2>
        <p className="mt-6 text-xl sm:text-2xl text-[#686764] font-editorial max-w-2xl leading-relaxed">
          "Motion is not decoration — it is behavior, hierarchy, and emotion."
        </p>
      </div>

      {/* 2-Column Asymmetric Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Left: Clean Architectural Portrait */}
        <div className="lg:col-span-5">
          <div className="relative w-full max-w-[460px] aspect-[4/5] bg-[#ECEBE7] rounded-2xl overflow-hidden border border-black/[0.08] shadow-[0_16px_36px_rgba(0,0,0,0.04)]">
            <img
              src="/images/profile.png"
              alt="Samyak Mahajan"
              className="w-full h-full object-cover grayscale contrast-[1.05]"
              loading="lazy"
            />
            {/* Subtle corner metadata */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-creato uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="font-medium">Samyak Mahajan</span>
              <span className="text-white/60">Creative Studio</span>
            </div>
          </div>

          {/* Personal Signature in Citadel Font */}
          <div className="mt-8 pl-2 flex flex-col items-start">
            <span className="text-[11px] font-creato uppercase tracking-[0.18em] text-[#9A9185] mb-1">
              Personal Mark
            </span>
            <div className="font-signature text-4xl sm:text-5xl text-[#171717] opacity-90 select-none tracking-wide">
              Samyak Mahajan
            </div>
          </div>
        </div>

        {/* Right: Narrative & Editorial Disciplines */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-6 text-lg sm:text-xl text-[#171717] font-creato leading-relaxed font-normal">
            {siteConfig.aboutNarrative.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Core Disciplines List */}
          <div className="pt-8 border-t border-black/[0.08]">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-6">
              Practices & Disciplines
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {disciplines.map((item, idx) => (
                <div key={item.title} className="p-5 rounded-xl bg-[#ECEBE7] border border-black/[0.05]">
                  <div className="text-[11px] font-creato text-[#9A9185] font-semibold mb-1">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-creato font-medium text-[#171717] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-creato text-[#686764] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
