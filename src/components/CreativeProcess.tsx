import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../data/site';
import { Compass, Sparkles, Scissors, PlayCircle, Award } from 'lucide-react';

export const CreativeProcess: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const icons = [Compass, Sparkles, Scissors, PlayCircle, Award];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(index);
          }
        },
        { threshold: 0.5, rootMargin: '-10% 0px -20% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section id="process" className="w-full py-16 md:py-24 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Section Header — Tightly Spaced */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-2">
            02 / METHODOLOGY
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            CREATIVE PROCESS
          </h2>
          <p className="mt-2 text-lg sm:text-xl text-[#686764] font-editorial">
            From narrative concept to finished frame.
          </p>
        </div>

        <p className="mt-4 md:mt-0 text-xs sm:text-sm text-[#686764] font-creato max-w-sm font-normal">
          A disciplined 5-phase trajectory balancing editorial timing, rhythmic precision, and color science.
        </p>
      </div>

      {/* 2-Column Responsive Layout: Sticky Summary Left, Scrolling Timeline Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Sticky Progress Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="p-6 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] shadow-sm">
            <span className="text-[11px] font-creato uppercase tracking-[0.16em] text-[#9A9185] block mb-2">
              Timeline Progress
            </span>
            <div className="text-xl font-creato font-semibold text-[#171717]">
              Step 0{activeStep + 1} — {siteConfig.creativeProcess[activeStep]?.title}
            </div>
            <p className="mt-1 text-xs text-[#686764] font-creato">
              {siteConfig.creativeProcess[activeStep]?.subtitle}
            </p>

            {/* Visual Progress Bar */}
            <div className="mt-5 w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#171717] h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((activeStep + 1) / siteConfig.creativeProcess.length) * 100}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[11px] font-creato text-[#9A9185]">
              <span>Phase Progress</span>
              <span>{Math.round(((activeStep + 1) / siteConfig.creativeProcess.length) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Right Scrolling Timeline Items */}
        <div className="lg:col-span-8 relative border-l border-black/[0.1] pl-6 sm:pl-10 space-y-8 sm:space-y-12">
          {siteConfig.creativeProcess.map((step, idx) => {
            const Icon = icons[idx] || Sparkles;
            const isActive = activeStep === idx;

            return (
              <div
                key={step.step}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className={`relative transition-all duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-65 hover:opacity-90'
                }`}
              >
                {/* Node on Vertical Timeline Line */}
                <div
                  className={`absolute -left-[31px] sm:-left-[47px] top-6 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-[10px] font-creato font-bold ${
                    isActive
                      ? 'bg-[#171717] border-[#171717] text-white scale-125'
                      : 'bg-[#F5F4F0] border-black/30 text-[#686764]'
                  }`}
                >
                  {step.step}
                </div>

                {/* Step Card */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] hover:border-black/[0.12] transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-[#171717]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-creato uppercase tracking-wider text-[#9A9185] block">
                          Phase {step.step}
                        </span>
                        <h3 className="text-lg sm:text-xl font-creato font-semibold text-[#171717]">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-editorial text-[#686764] hidden sm:inline">
                      {step.subtitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#686764] leading-relaxed font-creato mt-2">
                    {step.description}
                  </p>

                  {/* Keywords */}
                  <div className="mt-4 pt-4 border-t border-black/[0.06] flex flex-wrap gap-2">
                    {step.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-creato text-[#686764] bg-black/[0.04] px-2.5 py-0.5 rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
