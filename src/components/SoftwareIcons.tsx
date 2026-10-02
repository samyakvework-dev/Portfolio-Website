import React from 'react';

interface SoftwareItem {
  name: string;
  category: string;
  color: string;
  badge: string;
  iconSvg: React.ReactNode;
}

export const softwareList: SoftwareItem[] = [
  {
    name: 'Premiere Pro',
    category: 'NLE Editing',
    color: '#9999FF',
    badge: 'Pr',
    iconSvg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#00005B" />
        <text x="24" y="32" fill="#9999FF" fontSize="22" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">Pr</text>
      </svg>
    )
  },
  {
    name: 'After Effects',
    category: 'Motion Design',
    color: '#D291FF',
    badge: 'Ae',
    iconSvg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#00005B" />
        <text x="24" y="32" fill="#D291FF" fontSize="22" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">Ae</text>
      </svg>
    )
  },
  {
    name: 'DaVinci Resolve',
    category: 'Colour Grading',
    color: '#FF4D4D',
    badge: 'DR',
    iconSvg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#18181B" />
        <circle cx="24" cy="24" r="16" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="#121214" />
        {/* DaVinci iconic 3-petal color wheel pinwheel */}
        <path d="M24 12 C28 12 33 16 32 21 C31 23 28 24 24 24 C24 19 24 15 24 12 Z" fill="#EF4444" />
        <path d="M34 29 C32 33 27 36 22 34 C20 33 19 30 20 27 C24 28 28 27 34 29 Z" fill="#3B82F6" />
        <path d="M14 23 C14 18 19 14 24 16 C25 18 25 21 23 24 C19 23 16 23 14 23 Z" fill="#EAB308" />
        <circle cx="24" cy="24" r="3.5" fill="#18181B" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>
    )
  },
  {
    name: 'Photoshop',
    category: 'Asset Prep',
    color: '#31A8FF',
    badge: 'Ps',
    iconSvg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#001E36" />
        <text x="24" y="32" fill="#31A8FF" fontSize="22" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">Ps</text>
      </svg>
    )
  },
  {
    name: 'Illustrator',
    category: 'Vector Graphics',
    color: '#FF9A00',
    badge: 'Ai',
    iconSvg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#330000" />
        <text x="24" y="32" fill="#FF9A00" fontSize="22" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">Ai</text>
      </svg>
    )
  }
];

export const SoftwareIcons: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {softwareList.map((software) => (
          <div
            key={software.name}
            className="group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#171717]/80 hover:bg-[#202020] border border-white/6 hover:border-white/16 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 drop-shadow-md">
              {software.iconSvg}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                {software.name}
              </span>
              <span className="text-[11px] text-[#A1A1A1] font-mono">
                {software.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
