import React from 'react';
import { X, Check } from 'lucide-react';
import { DEFAULT_HDONGS } from '../constants/filterOptions';
import { HangjungdongItem } from '../../../types/resident';

interface HdongSelectorModalProps {
  isOpen: boolean;
  selectedCode: string;
  onSelect: (hdong: HangjungdongItem) => void;
  onClose: () => void;
}

export const HdongSelectorModal: React.FC<HdongSelectorModalProps> = ({
  isOpen,
  selectedCode,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="행정동 선택"
      className="absolute inset-0 z-50 flex items-end justify-center select-none overflow-hidden"
    >
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* 바텀시트 본체 */}
      <div className="relative w-full bg-white rounded-t-[20px] p-5 z-10 shadow-2xl animate-fade-in-menu flex flex-col max-h-[70vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] mb-3">
          <h3 className="text-[17px] font-bold text-[#1E293B]">동네(행정동) 선택</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1 rounded-full hover:bg-[#F3F4F6] text-[#7F7F7F] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 동네 목록 */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-1 divide-y divide-[#F3F4F6]">
          {DEFAULT_HDONGS.map((hdong) => {
            const isSelected = selectedCode === hdong.code;
            return (
              <button
                key={hdong.code}
                type="button"
                onClick={() => {
                  onSelect(hdong);
                  onClose();
                }}
                className="w-full py-3.5 px-2 flex items-center justify-between text-left hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
              >
                <span
                  className={`text-[15px] ${
                    isSelected ? 'font-bold text-[#14B8B0]' : 'text-[#1E293B]'
                  }`}
                >
                  {hdong.name}
                </span>
                {isSelected && <Check size={18} className="text-[#14B8B0]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
