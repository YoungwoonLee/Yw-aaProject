import React from 'react';
import { Share2, AlertTriangle, EyeOff, X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'report' | 'share' | 'hide') => void;
  title?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  title = '더보기',
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center select-none overflow-hidden">
      {/* Dim Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div className="relative w-full bg-white rounded-t-[20px] p-5 z-10 shadow-2xl animate-fade-in-menu flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6] mb-1">
          <span className="text-[15px] font-bold text-[#1E293B]">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#F3F4F6] cursor-pointer text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. 공유하기 */}
        <button
          type="button"
          onClick={() => {
            onSelectAction('share');
            onClose();
          }}
          className="flex items-center gap-3 w-full py-3 px-2 text-left text-[14px] font-semibold text-[#1E293B] hover:bg-[#F8FAFC] rounded-xl cursor-pointer transition-colors"
        >
          <Share2 size={18} color="#14B8B0" />
          <span>공유하기</span>
        </button>

        {/* 2. 관심없음 */}
        <button
          type="button"
          onClick={() => {
            onSelectAction('hide');
            onClose();
          }}
          className="flex items-center gap-3 w-full py-3 px-2 text-left text-[14px] font-semibold text-[#475569] hover:bg-[#F8FAFC] rounded-xl cursor-pointer transition-colors"
        >
          <EyeOff size={18} color="#64748B" />
          <span>이 작성자의 글 관심없음</span>
        </button>

        {/* 3. 신고하기 */}
        <button
          type="button"
          onClick={() => {
            onSelectAction('report');
            onClose();
          }}
          className="flex items-center gap-3 w-full py-3 px-2 text-left text-[14px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl cursor-pointer transition-colors"
        >
          <AlertTriangle size={18} color="#EF4444" />
          <span>신고하기</span>
        </button>
      </div>
    </div>
  );
};
