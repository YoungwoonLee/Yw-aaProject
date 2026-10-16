import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { LOCAL_CATEGORIES, LocalCategory } from '../constants/localData';

export type SortMode = 'latest' | 'popular' | 'replies';
export type ViewMode = 'feed' | 'grid';

interface LocalCategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  sortMode: SortMode;
  onSelectSort: (sort: SortMode) => void;
  itemCount: number;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
}

export const LocalCategoryTabs: React.FC<LocalCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  sortMode,
  onSelectSort,
  itemCount,
  viewMode,
  onSelectViewMode,
}) => {
  return (
    <div className="bg-white border-b border-[#F1F5F9] sticky top-[52px] z-20 shadow-2xs select-none">
      {/* 1. Category Chips Bar */}
      <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {LOCAL_CATEGORIES.map((cat: LocalCategory) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                isActive
                  ? 'bg-[#14B8B0] text-white shadow-2xs scale-[1.02]'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              <span className="text-[12px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-bar: Count + ViewMode Switcher + Sort Controls */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-[#F8FAFC] text-[12px] text-[#64748B]">
        {/* Count */}
        <div className="font-semibold text-[#334155]">
          총 <span className="text-[#14B8B0] font-black">{itemCount}</span>개의 이야기
        </div>

        {/* Right: ViewMode switcher & Sort controls */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => onSelectViewMode('feed')}
              aria-label="피드형 보기"
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-white text-[#14B8B0] shadow-2xs'
                  : 'text-[#94A3B8] hover:text-[#64748B]'
              }`}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => onSelectViewMode('grid')}
              aria-label="그리드형 보기"
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#14B8B0] shadow-2xs'
                  : 'text-[#94A3B8] hover:text-[#64748B]'
              }`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <span className="text-[#E2E8F0]">|</span>

          {/* Sort Controls */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => onSelectSort('latest')}
              className={`font-medium transition-colors cursor-pointer ${
                sortMode === 'latest' ? 'text-[#14B8B0] font-bold' : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              최신순
            </button>
            <span className="text-[#CBD5E1]">·</span>
            <button
              type="button"
              onClick={() => onSelectSort('popular')}
              className={`font-medium transition-colors cursor-pointer ${
                sortMode === 'popular' ? 'text-[#14B8B0] font-bold' : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              인기순
            </button>
            <span className="text-[#CBD5E1]">·</span>
            <button
              type="button"
              onClick={() => onSelectSort('replies')}
              className={`font-medium transition-colors cursor-pointer ${
                sortMode === 'replies' ? 'text-[#14B8B0] font-bold' : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              댓글순
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
