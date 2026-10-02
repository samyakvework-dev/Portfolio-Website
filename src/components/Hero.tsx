import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { siteConfig } from '../data/site';

interface HeroProps {
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position tracking with smooth lerp
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Detect touch devices to gracefully disable cursor reveal effect
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
  }, []);

  // Smooth lerp loop for the radial cursor reveal mask
  useEffect(() => {
    if (isTouchDevice) return;
    let raf: number;
    const lerpSpeed = 0.12;

    const animateMask = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * lerpSpeed;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * lerpSpeed;

      if (revealRef.current) {
        const x = Math.round(currentPos.current.x);
        const y = Math.round(currentPos.current.y);
        const maskGradient = `radial-gradient(circle 260px at ${x}px ${y}px, black 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)`;
        revealRef.current.style.maskImage = maskGradient;
        revealRef.current.style.webkitMaskImage = maskGradient;
      }

      raf = requestAnimationFrame(animateMask);
    };

    raf = requestAnimationFrame(animateMask);
    return () => cancelAnimationFrame(raf);
  }, [isTouchDevice]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouchDevice) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePos.current.x = e.clientX - rect.left;
    mousePos.current.y = e.clientY - rect.top;
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouchDevice) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current.x = x;
    mousePos.current.y = y;
    currentPos.current.x = x;
    currentPos.current.y = y;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Subtle procedural warm kinetic light canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let t = 0;
    const render = () => {
      t += 0.0025;
      ctx.clearRect(0, 0, width, height);

      // Atmospheric warm radiant field (Warm Ivory palette)
      const grad = ctx.createRadialGradient(
        width * 0.72 + Math.sin(t * 0.7) * 50,
        height * 0.38 + Math.cos(t * 0.5) * 35,
        25,
        width * 0.72,
        height * 0.38,
        width * 0.6
      );
      grad.addColorStop(0, 'rgba(236, 235, 231, 0.55)');
      grad.addColorStop(0.55, 'rgba(245, 244, 240, 0.25)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle architectural harmonic curve
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(23, 23, 23, 0.025)';
      ctx.lineWidth = 1;
      const yMid = height * 0.58 + Math.sin(t * 0.9) * 12;
      ctx.moveTo(width * 0.08, yMid);
      ctx.bezierCurveTo(
        width * 0.38,
        yMid - 25,
        width * 0.62,
        yMid + 25,
        width * 0.92,
        yMid
      );
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between pt-32 pb-14 px-6 sm:px-10 lg:px-16 max-w-[1500px] mx-auto overflow-hidden bg-[#F5F4F0]"
    >
      {/* 01. Background Canvas — Calm Atmospheric Tone */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none -z-20 opacity-80"
        aria-hidden="true"
      />

      {/* 02. Cursor Reveal Layer — Supplied Portrait Asset */}
      <div
        ref={revealRef}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500 ease-out flex items-center justify-center lg:justify-end lg:pr-24"
        style={{
          opacity: isHovered && !isTouchDevice ? 0.92 : 0,
          maskImage: 'radial-gradient(circle 0px at 0px 0px, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle 0px at 0px 0px, transparent 100%)'
        }}
        aria-hidden="true"
      >
        <img
          src="/images/profile.png"
          alt="Samyak Mahajan — Motion Designer"
          className="h-[78%] max-h-[720px] w-auto object-contain select-none filter contrast-[1.02]"
          draggable={false}
        />
      </div>

      {/* 03. Soft Natural Feathered Shadow behind Typography for 100% Crisp Legibility */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-75"
        style={{
          background: 'radial-gradient(circle at 25% 45%, rgba(245, 244, 240, 0.9) 0%, rgba(245, 244, 240, 0.5) 55%, transparent 80%)'
        }}
        aria-hidden="true"
      />

      {/* 04. Top Editorial Metadata */}
      <div className="relative z-10 pt-4">
        <div className="inline-flex items-center gap-2.5 text-xs font-creato uppercase tracking-[0.2em] text-[#686764]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
          <span>Motion Designer & Art Director</span>
          <span className="text-[#9A9185]">/</span>
          <span className="text-[#9A9185]">Archive 2024–2026</span>
        </div>
      </div>

      {/* 05. Core Typography — Large, Confident, Editorial Restraint */}
      <div className="relative z-10 my-auto py-12 max-w-5xl">
        <h1 className="hero-headline text-[#171717] font-creato">
          Crafting <span className="font-editorial font-normal text-[#171717]">movement</span>, identity & visual stories.
        </h1>
        <p className="mt-8 text-lg sm:text-xl lg:text-2xl text-[#686764] font-creato font-normal max-w-2xl leading-relaxed tracking-tight">
          {siteConfig.subheadline}
        </p>
      </div>

      {/* 06. Bottom Editorial Metadata & Action Trigger */}
      <div className="relative z-10 pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs font-creato text-[#686764] tracking-wider uppercase">
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <span className="text-black/40 block mb-1 text-[11px] tracking-[0.14em]">Focus</span>
            <span className="text-[#171717] font-medium tracking-normal text-xs">Brand Motion · 3D · Direction</span>
          </div>
          <div>
            <span className="text-black/40 block mb-1 text-[11px] tracking-[0.14em]">Location</span>
            <span className="text-[#171717] font-medium tracking-normal text-xs">{siteConfig.location}</span>
          </div>
          <div>
            <span className="text-black/40 block mb-1 text-[11px] tracking-[0.14em]">Status</span>
            <span className="text-[#171717] font-medium tracking-normal text-xs">{siteConfig.availability}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExploreWork}
          className="group inline-flex items-center gap-2.5 text-[#171717] hover:text-black font-creato font-medium text-xs uppercase tracking-[0.16em] transition-all py-1.5 px-3 rounded-full hover:bg-black/[0.04]"
        >
          <span>Selected Work</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 text-[#171717]" />
        </button>
      </div>
    </section>
  );
};
