import React, { useState, useEffect } from 'react';
import { PenLine, X } from 'lucide-react';

interface HomeFABProps {
  onWriteClick: () => void;
}

const TOOLTIP_STORAGE_KEY = 'ondaji_fab_tooltip_dismissed';

export const HomeFAB: React.FC<HomeFABProps> = ({ onWriteClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(TOOLTIP_STORAGE_KEY);
      if (!dismissed) {
        setShowTooltip(true);
      }
    } catch (e) {
      // localStorage 접근 제한 대비
    }
  }, []);

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    try {
      localStorage.setItem(TOOLTIP_STORAGE_KEY, 'true');
    } catch (e) {}
  };

  return (
    <div className="absolute bottom-[74px] right-4 z-40 flex flex-col items-end select-none pointer-events-none">
      {/* 말풍선 툴팁: 최초 진입 시 표시 */}
      {showTooltip && (
        <div className="mb-2 bg-[#1E293B] text-white text-[12px] font-medium py-2 px-3 rounded-xl shadow-lg border border-white/10 flex items-center gap-2 pointer-events-auto animate-fade-in-menu max-w-[220px]">
          <span>내 주변 로컬박스를 확인해 보세요!</span>
          <button
            type="button"
            onClick={handleDismissTooltip}
            className="p-0.5 hover:bg-white/20 rounded-full cursor-pointer text-[#94A3B8] hover:text-white"
            aria-label="툴팁 닫기"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* FAB 원형 글쓰기 버튼 */}
      <button
        type="button"
        onClick={onWriteClick}
        aria-label="동네소식 글쓰기"
        className="w-[50px] h-[50px] rounded-full bg-[#14B8B0] text-white flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(20,184,176,0.38)] active:scale-95 hover:opacity-95 transition-all pointer-events-auto"
      >
        <PenLine size={22} strokeWidth={2.2} />
      </button>
    </div>
  );
};
