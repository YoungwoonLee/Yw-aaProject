import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  title: string;
  options: readonly string[];
  selectedValues: string[] | null;
  onClose: () => void;
  onApply: (values: string[] | null) => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  title,
  options,
  selectedValues,
  onClose,
  onApply,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string[]>(
    selectedValues && selectedValues.length > 0 ? selectedValues : ['전체']
  );

  // Sync when sheet opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSelected(
        selectedValues && selectedValues.length > 0 ? selectedValues : ['전체']
      );
    }
  }, [isOpen, selectedValues]);

  if (!isOpen) return null;

  const handleChipClick = (option: string) => {
    if (option === '전체') {
      setCurrentSelected(['전체']);
      return;
    }

    const withoutAll = currentSelected.filter((item) => item !== '전체');
    if (withoutAll.includes(option)) {
      const filtered = withoutAll.filter((item) => item !== option);
      setCurrentSelected(filtered.length === 0 ? ['전체'] : filtered);
    } else {
      setCurrentSelected([...withoutAll, option]);
    }
  };

  const handleReset = () => {
    setCurrentSelected(['전체']);
  };

  const handleApplyClick = () => {
    if (currentSelected.includes('전체') || currentSelected.length === 0) {
      onApply(null);
    } else {
      onApply(currentSelected);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} 필터`}
      className="absolute inset-0 z-50 flex items-end justify-center select-none overflow-hidden"
    >
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* 시트 본체 */}
      <div className="relative w-full bg-white rounded-t-[20px] p-5 z-10 shadow-2xl animate-fade-in-menu flex flex-col max-h-[85vh]">
        {/* 상단 헤더: 제목 + 초기화 + X */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-bold text-[#1E1E1E]">{title}</h3>
            <button
              type="button"
              onClick={handleReset}
              className="text-[14px] text-[#7F7F7F] hover:text-[#1E1E1E] cursor-pointer"
            >
              초기화
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1 rounded-full hover:bg-[#F3F4F6] text-[#7F7F7F] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 칩 목록: 12px/500, #999 글자, #B3B3B3 0.5px 테두리, radius 5px, 패딩 8px, 줄바꿈 배치 */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const isSelected = currentSelected.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleChipClick(option)}
                  className={`text-[12px] font-medium transition-colors cursor-pointer text-center leading-none ${
                    isSelected
                      ? 'border-[#59BFB3] bg-[#E8F8F7] text-[#59BFB3]'
                      : 'border-[#B3B3B3] bg-white text-[#999999] hover:bg-[#F8FAFC]'
                  }`}
                  style={{
                    borderWidth: '0.5px',
                    borderRadius: '5px',
                    padding: '8px 12px',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* 하단 적용 버튼: 폭 100%, 높이 54px, #59BFB3 배경, 흰 글자 15px/500, radius 5px */}
        <div className="pt-4 mt-2">
          <button
            type="button"
            onClick={handleApplyClick}
            className="w-full text-white font-medium text-[15px] cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center shadow-xs"
            style={{
              height: '54px',
              backgroundColor: '#59BFB3',
              borderRadius: '5px',
            }}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};
