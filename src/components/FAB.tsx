import React, { useState, useEffect, useRef } from 'react';
import { PenLine, X, Heart, CalendarCheck } from 'lucide-react';

interface FABProps {
  onSelectAction: (action: 'village_story' | 'resident_news' | 'create_siot') => void;
}

export const FAB: React.FC<FABProps> = ({ onSelectAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: 'village_story' | 'resident_news' | 'create_siot') => {
    setIsOpen(false);
    onSelectAction(action);
  };

  return (
    <div
      ref={containerRef}
      className="absolute right-4 select-none pointer-events-auto"
      style={{
        bottom: '76px',
        zIndex: 99,
      }}
    >
      {/* Menu Popup (slides up) */}
      {isOpen && (
        <div
          className="absolute right-0 bottom-[60px] bg-white rounded-[12px] border border-[#F3F4F6] overflow-hidden animate-fade-in-menu py-1.5"
          style={{
            width: '148px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          }}
        >
          <button
            type="button"
            onClick={() => handleAction('village_story')}
            className="w-full flex items-center gap-2.5 px-[14px] py-[12px] text-[13px] font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-left"
          >
            <PenLine size={16} color="#00B4C5" strokeWidth={2} />
            <span>동네 이야기</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('resident_news')}
            className="w-full flex items-center gap-2.5 px-[14px] py-[12px] text-[13px] font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-left border-t border-[#F8FAFC]"
          >
            <Heart size={16} color="#FF4D6D" strokeWidth={2} />
            <span>주민소식</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('create_siot')}
            className="w-full flex items-center gap-2.5 px-[14px] py-[12px] text-[13px] font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-left border-t border-[#F8FAFC]"
          >
            <CalendarCheck size={16} color="#7C3AED" strokeWidth={2} />
            <span>프로그램 예약</span>
          </button>
        </div>
      )}

      {/* FAB Circle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="글쓰기 메뉴 열기"
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 text-white"
        style={{
          backgroundColor: '#00B4C5',
          boxShadow: '0 4px 12px rgba(0,180,197,0.35)',
        }}
      >
        {isOpen ? (
          <X size={22} color="#ffffff" strokeWidth={2.5} />
        ) : (
          <PenLine size={22} color="#ffffff" strokeWidth={2.2} />
        )}
      </button>
    </div>
  );
};
