import React from 'react';
import { Home, MapPin, Heart, Flag, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomGNBProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// Custom Siot 'ㅅ' Korean consonant icon
const SiotIcon: React.FC<{ color: string; strokeWidth: number; size?: number }> = ({
  color,
  strokeWidth,
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* (12,5) -> (4,19) and (12,5) -> (20,19) */}
    <path d="M12 5L4 19" />
    <path d="M12 5L20 19" />
  </svg>
);

export const BottomGNB: React.FC<BottomGNBProps> = ({ currentTab, onTabChange }) => {
  const tabs: { label: TabType; icon: (isActive: boolean) => React.ReactNode }[] = [
    {
      label: '홈',
      icon: (isActive) => (
        <Home
          size={20}
          color={isActive ? '#00B4C5' : '#9CA3AF'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      ),
    },
    {
      label: '삼성동',
      icon: (isActive) => (
        <MapPin
          size={20}
          color={isActive ? '#00B4C5' : '#9CA3AF'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      ),
    },
    {
      label: '주민',
      icon: (isActive) => (
        <Heart
          size={20}
          color={isActive ? '#00B4C5' : '#9CA3AF'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      ),
    },
    {
      label: '시옷',
      icon: (isActive) => (
        <SiotIcon
          size={20}
          color={isActive ? '#00B4C5' : '#9CA3AF'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      ),
    },
    {
      label: '연결',
      icon: (isActive) => (
        <Flag
          size={20}
          color={isActive ? '#00B4C5' : '#9CA3AF'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      ),
    },
    {
      label: '마이',
      icon: (isActive) => (
        <User
          size={20}
          color={isActive ? '#00B4C5' : '#9CA3AF'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      ),
    },
  ];

  return (
    <nav
      className="sticky bottom-0 z-30 w-full bg-white border-t border-[#E5E7EB] flex items-center select-none"
      style={{
        height: '60px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.label;
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onTabChange(tab.label)}
            className="flex-1 h-full py-1 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center w-5 h-5">
              {tab.icon(isActive)}
            </div>
            <span
              className="whitespace-nowrap transition-colors"
              style={{
                fontSize: '10px',
                lineHeight: 1.2,
                marginTop: '2px',
                color: isActive ? '#00B4C5' : '#9CA3AF',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
