import React from 'react';
import { Search, Bell, MapPin } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onSearchClick?: () => void;
  onBellClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSearchClick, onBellClick }) => {
  const isSamseongTab = currentTab === '삼성동';

  return (
    <header
      className="sticky top-0 z-10 bg-white px-4 py-3 min-h-[52px] border-b border-[#F3F4F6] flex justify-between items-center select-none"
      style={{ height: '52px' }}
    >
      {/* Left: MapPin icon if '삼성동' is active, otherwise invisible placeholder */}
      <div className="flex items-center min-w-[28px]">
        {isSamseongTab ? (
          <div className="flex items-center gap-1.5 animate-fadeIn">
            <MapPin size={24} color="#00B4C5" strokeWidth={2.2} />
            <span className="text-[15px] font-bold text-[#1E293B]">삼성동</span>
          </div>
        ) : (
          <div className="invisible w-6 h-6" />
        )}
      </div>

      {/* Right icons: Search & Bell */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="검색"
          className="p-1 text-[#4B5563] hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Search size={22} color="#4B5563" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={onBellClick}
          aria-label="알림"
          className="relative p-1 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Bell size={22} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
          {/* Red Notification Dot: 7x7 #EF4444 with 1.5px white border */}
          <span
            className="absolute -top-[2px] -right-[3px] w-[7px] h-[7px] bg-[#EF4444] rounded-full border-[1.5px] border-white"
          />
        </button>
      </div>
    </header>
  );
};
