import React from 'react';
import { siteConfig } from '../data/site';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onNavigateAbout?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigateAbout }) => {
  const disciplines = [
    { title: "Video Editing", desc: "Commercial rhythm, narrative timing, velocity ramps, and retention pacing." },
    { title: "Motion Graphics", desc: "Kinetic typography, animated brand systems, and fluid vector transitions." },
    { title: "Graphic Design", desc: "Editorial posters, Swiss grid typography, brand key visuals, and album art." }
  ];

  return (
    <section
      id="about"
      className="w-full py-16 md:py-24 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]"
    >
      {/* Editorial Category Tag */}
      <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-3">
        03 / PERSPECTIVE
      </span>

      {/* Main Statement — Editorial Typography */}
      <div className="max-w-4xl mb-12 sm:mb-16">
        <h2 className="section-headline text-[#171717] font-creato">
          I turn ideas into <span className="font-editorial font-normal">movement</span>.
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-[#686764] font-editorial max-w-2xl leading-relaxed">
          "Editing and motion design are not mere decoration — they are rhythm, narrative timing, and visual emotion."
        </p>
      </div>

      {/* Two Column Layout — Photo Card & Detailed Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Portrait & Personal Signature */}
        <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-[#ECEBE7] border border-black/[0.08] p-2 shadow-sm">
            <img
              src="/images/profile.png"
              alt="Samyak Mahajan"
              className="w-full h-auto object-cover rounded-xl grayscale contrast-[1.05]"
            />
            <div className="p-4 flex items-center justify-between text-xs font-creato text-[#686764] uppercase tracking-wider">
              <span>{siteConfig.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#171717]">Creative Portfolio</span>
            </div>
          </div>

          {/* Personal Mark in Citadel Font */}
          <div className="mt-6 text-center sm:text-left">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-1">
              Personal Mark
            </span>
            <span className="font-signature text-3xl sm:text-4xl text-[#171717]">
              Samyak Mahajan
            </span>
          </div>
        </div>

        {/* Right Column: Narrative & Disciplines */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-5 text-sm sm:text-base text-[#686764] font-creato font-normal leading-relaxed">
            {siteConfig.aboutNarrative.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Core Disciplines */}
          <div className="pt-6 border-t border-black/[0.08]">
            <span className="text-xs font-creato uppercase tracking-[0.16em] text-[#9A9185] block mb-4">
              Core Disciplines & Practice
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {disciplines.map((d, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#ECEBE7] border border-black/[0.04]">
                  <span className="text-[11px] font-creato text-[#9A9185] block mb-1">0{i + 1}</span>
                  <h4 className="text-sm font-creato font-semibold text-[#171717]">{d.title}</h4>
                  <p className="mt-1 text-xs text-[#686764] leading-relaxed font-creato">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action to Full About Page if provided */}
          {onNavigateAbout && (
            <div className="pt-4">
              <button
                type="button"
                onClick={onNavigateAbout}
                className="inline-flex items-center gap-2 text-xs font-creato font-semibold uppercase tracking-wider text-[#171717] hover:text-black hover:underline"
              >
                <span>Read Full Background & Technical Stack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
