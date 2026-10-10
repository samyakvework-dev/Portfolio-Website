import React from 'react';
import { siteConfig } from '../data/site';
import { Film, Sparkles, Palette, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateContact?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateContact }) => {
  const tools = [
    { name: "Adobe Premiere Pro", desc: "Long-form & commercial editorial, speed ramping, sound sync", category: "Video Editing" },
    { name: "After Effects", desc: "2D kinetic typography, logo animation, vector motion systems", category: "Motion Graphics" },
    { name: "DaVinci Resolve", desc: "Color correction, film emulation, ACES color science", category: "Finishing & Color" },
    { name: "Adobe Photoshop", desc: "Key visuals, cinema posters, duotone treatments, textures", category: "Graphic Design" },
    { name: "Adobe Illustrator", desc: "Vector brand tokens, icon systems, Swiss grid layouts", category: "Graphic Design" },
    { name: "Adobe Audition", desc: "Transient alignment, sound design mixing, stem cleanup", category: "Audio Sync" }
  ];

  return (
    <div className="w-full min-h-screen pt-28 pb-24 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Page Header */}
      <div className="mb-14 pb-8 border-b border-black/[0.08]">
        <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
          PROFILE & PHILOSOPHY
        </span>
        <h1 className="hero-headline text-[#171717] font-creato">
          ABOUT SAMYAK MAHAJAN
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-[#686764] font-editorial max-w-2xl">
          Video Editor · Motion Graphics Designer · Graphic Designer
        </p>
      </div>

      {/* Main Grid: Left Portrait & Citadel Signature, Right Narrative & Tooling */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Portrait & Personal Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative rounded-2xl overflow-hidden bg-[#ECEBE7] border border-black/[0.08] p-2 shadow-sm max-w-md">
            <img
              src="/images/profile.png"
              alt="Samyak Mahajan"
              className="w-full h-auto object-cover rounded-xl grayscale contrast-[1.05]"
            />
            <div className="p-4 flex items-center justify-between text-xs font-creato text-[#686764] uppercase tracking-wider">
              <span>{siteConfig.name}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-black/5 text-[#171717] font-medium">
                {siteConfig.location}
              </span>
            </div>
          </div>

          {/* Personal Mark in Citadel script font */}
          <div className="p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] max-w-md">
            <span className="text-[11px] font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-1">
              Personal Mark
            </span>
            <span className="font-signature text-3xl sm:text-4xl text-[#171717] block">
              Samyak Mahajan
            </span>
            <p className="mt-2 text-xs text-[#686764] font-creato leading-relaxed">
              Every edit, motion sequence, and design layout is signed with a commitment to craft, discipline, and human emotion.
            </p>
          </div>
        </div>

        {/* Right Column: Bio Narrative, Pillars & Software */}
        <div className="lg:col-span-7 space-y-12">
          {/* Narrative */}
          <div className="space-y-5 text-base sm:text-lg text-[#686764] font-creato leading-relaxed">
            <p>
              I work across three deeply intertwined disciplines: <strong className="text-[#171717] font-medium">Video Editing</strong>, <strong className="text-[#171717] font-medium">Motion Graphics</strong>, and <strong className="text-[#171717] font-medium">Graphic Design</strong>.
            </p>
            <p>
              Motion is not decoration — it is behavior, hierarchy, and emotion. By prioritizing pacing over speed and intention over flashiness, I craft visual experiences that earn and reward human attention.
            </p>
            <p>
              Whether cutting high-energy commercial edits that demand frame-accurate audio synchronization, designing kinetic typography sequences for music and brands, or building static campaign key art that holds strong in print and digital, I focus on the underlying rhythm and visual balance of every single frame.
            </p>
          </div>

          {/* 3 Disciplines Breakdown */}
          <div className="pt-8 border-t border-black/[0.08]">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-5">
              Three Core Disciplines
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center mb-3">
                  <Film className="w-4 h-4" />
                </div>
                <h3 className="text-base font-creato font-semibold text-[#171717]">
                  Video Editing
                </h3>
                <p className="text-xs text-[#686764] mt-1.5 leading-relaxed font-creato">
                  Rhythmic pacing, speed ramping, retention narrative cuts, commercials, and spec ads.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-creato font-semibold text-[#171717]">
                  Motion Graphics
                </h3>
                <p className="text-xs text-[#686764] mt-1.5 leading-relaxed font-creato">
                  2D kinetic typography, logo choreography, brand motion tokens, and vector animation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center mb-3">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="text-base font-creato font-semibold text-[#171717]">
                  Graphic Design
                </h3>
                <p className="text-xs text-[#686764] mt-1.5 leading-relaxed font-creato">
                  Modernist posters, Swiss grid layouts, album artwork, brand identity, and key visuals.
                </p>
              </div>
            </div>
          </div>

          {/* Software & Technical Stack */}
          <div className="pt-8 border-t border-black/[0.08]">
            <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-5">
              Software & Production Toolkit
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="p-4 rounded-xl bg-[#ECEBE7] border border-black/[0.04] flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#171717] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-creato font-semibold text-[#171717]">{tool.name}</span>
                      <span className="text-[10px] font-creato text-[#9A9185] uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#686764] mt-1 leading-relaxed font-creato">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Action */}
          {onNavigateContact && (
            <div className="pt-6">
              <button
                type="button"
                onClick={onNavigateContact}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#171717] text-white hover:bg-black font-creato font-medium text-xs uppercase tracking-wider transition-all"
              >
                <span>Initiate a Collaboration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
