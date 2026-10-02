import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../data/site';
import { Compass, Sparkles, Layers, PlayCircle, Award } from 'lucide-react';

export const CreativeProcess: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const icons = [Compass, Sparkles, Layers, PlayCircle, Award];

  // Intersection observer to track which step is currently most visible in viewport
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
    <section id="process" className="w-full py-28 md:py-36 lg:py-44 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 bg-[#F5F4F0]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-28 pb-8 border-b border-black/[0.08]">
        <div>
          <span className="text-xs font-creato uppercase tracking-[0.2em] text-[#9A9185] block mb-3">
            02 / METHODOLOGY
          </span>
          <h2 className="section-headline text-[#171717] font-creato">
            CREATIVE PROCESS
          </h2>
          <p className="mt-3 text-xl sm:text-2xl text-[#686764] font-editorial">
            From abstract concept to visceral movement.
          </p>
        </div>

        <p className="mt-6 md:mt-0 text-sm sm:text-base text-[#686764] font-creato max-w-md font-normal leading-relaxed">
          A disciplined 5-phase motion trajectory balancing conceptual precision, neural exploration, and mathematical execution.
        </p>
      </div>

      {/* Vertical Timeline & Process Steps */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Sticky Process Overview Column */}
        <div className="hidden lg:block lg:col-span-4 sticky top-32 space-y-6">
          <div className="p-8 rounded-2xl bg-[#ECEBE7] border border-black/[0.06]">
            <div className="text-xs font-creato uppercase tracking-[0.18em] text-[#9A9185] mb-2">
              Timeline Progress
            </div>
            <div className="text-2xl font-creato font-medium text-[#171717] tracking-tight mb-4">
              Step {siteConfig.creativeProcess[activeStep]?.step} — {siteConfig.creativeProcess[activeStep]?.title}
            </div>
            <p className="text-sm font-creato text-[#686764] leading-relaxed">
              {siteConfig.creativeProcess[activeStep]?.subtitle}
            </p>

            {/* Micro Progress Bar */}
            <div className="mt-8 pt-6 border-t border-black/[0.08]">
              <div className="flex items-center justify-between text-xs font-creato text-[#686764] mb-2">
                <span>Phase Progress</span>
                <span className="font-medium text-[#171717]">
                  {Math.round(((activeStep + 1) / siteConfig.creativeProcess.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1 bg-black/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#171717] transition-all duration-500 ease-out"
                  style={{ width: `${((activeStep + 1) / siteConfig.creativeProcess.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Vertical Steps Journey */}
        <div className="lg:col-span-8 relative">
          {/* Thin elegant vertical progress line */}
          <div
            className="absolute left-6 sm:left-8 top-8 bottom-8 w-px bg-black/[0.08] pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-full bg-[#171717] transition-all duration-700 ease-out"
              style={{
                height: `${(activeStep / (siteConfig.creativeProcess.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {siteConfig.creativeProcess.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              const isActive = activeStep === idx;

              return (
                <div
                  key={item.step}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative pl-16 sm:pl-20 transition-all duration-500 cursor-pointer ${
                    isActive ? 'opacity-100' : 'opacity-65 hover:opacity-90'
                  }`}
                >
                  {/* Step Node Indicator on Progress Path */}
                  <div
                    className={`absolute left-3.5 sm:left-5.5 top-1 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] scale-110'
                        : 'bg-[#F5F4F0] border border-black/[0.18] text-[#9A9185] group-hover:border-black/50'
                    }`}
                  >
                    <span className="text-[10px] font-creato font-semibold">
                      {item.step}
                    </span>
                  </div>

                  {/* Step Content Container */}
                  <div className="p-7 sm:p-9 rounded-2xl bg-[#ECEBE7] border border-black/[0.06] transition-all duration-500 group-hover:translate-x-1 group-hover:border-black/[0.12] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black/[0.05] flex items-center justify-center text-[#171717]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-creato uppercase tracking-[0.16em] text-[#9A9185]">
                            Phase {item.step}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-creato font-medium text-[#171717] tracking-tight">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <div className="text-sm font-editorial text-[#686764]">
                        {item.subtitle}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-creato text-[#686764] leading-relaxed mb-6 font-normal">
                      {item.description}
                    </p>

                    {/* Keywords / Deliverables Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-black/[0.06]">
                      {item.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1 rounded-full text-xs font-creato bg-white/70 text-[#171717] border border-black/[0.05]"
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
      </div>
    </section>
  );
};
