import React from 'react';
import { CATEGORIES, type ProjectCategory } from '../data/projects';

interface CategoryNavigationProps {
  activeCategory: ProjectCategory | 'All';
  onSelectCategory: (category: ProjectCategory | 'All') => void;
  categoryCounts: Record<string, number>;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts
}) => {
  const allCategories: { id: ProjectCategory | 'All'; label: string; ratio?: string }[] = [
    { id: 'All', label: 'All Work' },
    ...CATEGORIES.map(c => ({ id: c.id, label: c.label, ratio: c.ratio }))
  ];

  return (
    <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-3 px-1">
      <div 
        role="tablist" 
        aria-label="Project Categories"
        className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#171717] border border-white/8 shadow-inner"
      >
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = cat.id === 'All' 
            ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
            : categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#FF6A00]/50 ${
                isActive
                  ? 'bg-white/10 text-white font-semibold shadow-sm border border-white/12'
                  : 'text-[#A1A1A1] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{cat.label}</span>
              {cat.ratio && (
                <span className="text-[10px] font-mono text-white/40 hidden md:inline">
                  [{cat.ratio}]
                </span>
              )}
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-[#FF6A00] text-black font-bold' : 'bg-white/10 text-white/50'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
