import React, { useState } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { FilterSheet } from './FilterSheet';
import { FILTER_OPTIONS } from '../constants/filterOptions';
import { ResidentFilterState } from '../hooks/useResidentFilters';

interface FilterChipBarProps {
  filters: ResidentFilterState;
  onSetInterestFilters: (values: string[] | null) => void;
  onSetAgeGroupFilters: (values: string[] | null) => void;
  onSetTargetGroupFilters: (values: string[] | null) => void;
  onResetAllFilters: () => void;
}

type ActiveSheetType = 'interests' | 'ageGroups' | 'targetGroups' | null;

export const FilterChipBar: React.FC<FilterChipBarProps> = ({
  filters,
  onSetInterestFilters,
  onSetAgeGroupFilters,
  onSetTargetGroupFilters,
  onResetAllFilters,
}) => {
  const [activeSheet, setActiveSheet] = useState<ActiveSheetType>(null);

  const isInterestActive = Boolean(filters.interests && filters.interests.length > 0);
  const isAgeGroupActive = Boolean(filters.ageGroups && filters.ageGroups.length > 0);
  const isTargetGroupActive = Boolean(filters.targetGroups && filters.targetGroups.length > 0);

  const isAnyActive = isInterestActive || isAgeGroupActive || isTargetGroupActive;

  // 칩 라벨 포맷터
  const getChipLabel = (defaultLabel: string, selected: string[] | null) => {
    if (!selected || selected.length === 0) return `${defaultLabel} ∨`;
    if (selected.length === 1) return `${selected[0]} ∨`;
    return `${selected[0]} 외 ${selected.length - 1} ∨`;
  };

  return (
    <>
      <div className="w-full px-4 py-2 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
        {/* 하나라도 적용되면 맨 앞에 새로고침(초기화) 아이콘 버튼 노출 */}
        {isAnyActive && (
          <button
            type="button"
            onClick={onResetAllFilters}
            aria-label="필터 전체 초기화"
            className="w-8 h-8 rounded-full border border-[#B3B3B3] flex items-center justify-center text-[#7F7F7F] hover:bg-[#F8FAFC] transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw size={14} />
          </button>
        )}

        {/* 1. 관심분야 칩 */}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={
            isInterestActive
              ? `관심분야: ${filters.interests?.join(', ')} 선택됨`
              : '관심분야 필터 열기'
          }
          onClick={() => setActiveSheet('interests')}
          className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
            isInterestActive
              ? 'border border-[#59BFB3] text-[#59BFB3] bg-[#E8F8F7]'
              : 'border border-[#E5E7EB] text-[#1E1E1E] bg-white hover:bg-[#F8FAFC]'
          }`}
        >
          <span>{getChipLabel('관심분야', filters.interests)}</span>
        </button>

        {/* 2. 대상 칩 */}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={
            isAgeGroupActive
              ? `대상: ${filters.ageGroups?.join(', ')} 선택됨`
              : '대상 필터 열기'
          }
          onClick={() => setActiveSheet('ageGroups')}
          className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
            isAgeGroupActive
              ? 'border border-[#59BFB3] text-[#59BFB3] bg-[#E8F8F7]'
              : 'border border-[#E5E7EB] text-[#1E1E1E] bg-white hover:bg-[#F8FAFC]'
          }`}
        >
          <span>{getChipLabel('대상', filters.ageGroups)}</span>
        </button>

        {/* 3. 특성 칩 */}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={
            isTargetGroupActive
              ? `특성: ${filters.targetGroups?.join(', ')} 선택됨`
              : '특성 필터 열기'
          }
          onClick={() => setActiveSheet('targetGroups')}
          className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
            isTargetGroupActive
              ? 'border border-[#59BFB3] text-[#59BFB3] bg-[#E8F8F7]'
              : 'border border-[#E5E7EB] text-[#1E1E1E] bg-white hover:bg-[#F8FAFC]'
          }`}
        >
          <span>{getChipLabel('특성', filters.targetGroups)}</span>
        </button>
      </div>

      {/* 바텀시트들 */}
      <FilterSheet
        isOpen={activeSheet === 'interests'}
        title="관심분야"
        options={FILTER_OPTIONS.interests}
        selectedValues={filters.interests}
        onClose={() => setActiveSheet(null)}
        onApply={onSetInterestFilters}
      />

      <FilterSheet
        isOpen={activeSheet === 'ageGroups'}
        title="대상"
        options={FILTER_OPTIONS.ageGroups}
        selectedValues={filters.ageGroups}
        onClose={() => setActiveSheet(null)}
        onApply={onSetAgeGroupFilters}
      />

      <FilterSheet
        isOpen={activeSheet === 'targetGroups'}
        title="특성"
        options={FILTER_OPTIONS.targetGroups}
        selectedValues={filters.targetGroups}
        onClose={() => setActiveSheet(null)}
        onApply={onSetTargetGroupFilters}
      />
    </>
  );
};
