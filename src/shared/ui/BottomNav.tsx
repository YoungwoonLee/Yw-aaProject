import React from 'react';
import { Home, MapPin, Heart, Compass, CalendarCheck, User } from 'lucide-react';

export type NavTab = 'home' | 'town' | 'residents' | 'nearby' | 'experience' | 'my';

interface BottomNavProps {
  currentTab: NavTab;
  townName?: string;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  townName = '금광동',
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'home' as const,
      label: '홈',
      path: '/villages',
      icon: (active: boolean) => (
        <Home
          size={19}
          color={active ? '#14B8B0' : '#9CA3AF'}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      id: 'town' as const,
      label: townName,
      path: '/villages',
      icon: (active: boolean) => (
        <MapPin
          size={19}
          color={active ? '#14B8B0' : '#9CA3AF'}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      id: 'residents' as const,
      label: '주민',
      path: '/residents',
      icon: (active: boolean) => (
        <Heart
          size={19}
          color={active ? '#14B8B0' : '#9CA3AF'}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      id: 'nearby' as const,
      label: '연결',
      path: '/localbox/check-nearby',
      icon: (active: boolean) => (
        <Compass
          size={19}
          color={active ? '#14B8B0' : '#9CA3AF'}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      id: 'experience' as const,
      label: '체험',
      path: '/experience',
      icon: (active: boolean) => (
        <CalendarCheck
          size={19}
          color={active ? '#14B8B0' : '#9CA3AF'}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
    {
      id: 'my' as const,
      label: '마이',
      path: '/my/information',
      icon: (active: boolean) => (
        <User
          size={19}
          color={active ? '#14B8B0' : '#9CA3AF'}
          strokeWidth={active ? 2.5 : 2}
        />
      ),
    },
  ];

  return (
    <nav
      className="w-full shrink-0 z-30 bg-white/95 backdrop-blur border-t border-[#E5E7EB] h-[60px] flex items-center px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] select-none"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex-1 min-w-0 h-full py-1 flex flex-col items-center justify-center cursor-pointer transition-colors relative"
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#14B8B0]" />
            )}
            <div className="w-5 h-5 flex items-center justify-center">
              {tab.icon(isActive)}
            </div>
            <span
              className="text-[10px] leading-tight mt-1 truncate max-w-full px-0.5 transition-colors"
              style={{
                color: isActive ? '#14B8B0' : '#9CA3AF',
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

