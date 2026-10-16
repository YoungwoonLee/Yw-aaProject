import React from 'react';
import { Search, Bell, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchUnreadNotificationYn,
  localQueryKeys,
} from '../../features/local-tab/api/localApi';

interface HeaderProps {
  mode?: 'latest' | 'regional' | 'residents' | 'experience';
  townName?: string;
  onTownClick?: () => void;
  onSearchClick?: () => void;
  onBellClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode = 'latest',
  townName = '금광동',
  onTownClick,
  onSearchClick,
  onBellClick,
}) => {
  const { data: unreadData } = useQuery({
    queryKey: localQueryKeys.unreadNotification(),
    queryFn: fetchUnreadNotificationYn,
    staleTime: 1000 * 60 * 5,
  });

  const hasUnreadNotification = unreadData?.unreadYn ?? true;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur px-4 py-2.5 min-h-[52px] border-b border-[#F3F4F6] flex items-center justify-between select-none">
      {/* 좌측: 홈(latest)은 비어 있음, 로컬탭(regional) 및 체험(experience)은 위치 핀 아이콘 */}
      <div className="flex items-center min-h-[40px]">
        {(mode === 'regional' || mode === 'experience') && (
          <button
            type="button"
            onClick={onTownClick}
            aria-label={`동네 변경, 현재 ${townName}`}
            className="min-w-[44px] min-h-[44px] -ml-2 px-2 rounded-full flex items-center gap-1.5 text-[#14B8B0] hover:bg-[#E8F8F7] active:scale-95 transition-all cursor-pointer"
          >
            <MapPin
              size={22}
              color="#14B8B0"
              fill="rgba(20, 184, 176, 0.16)"
              strokeWidth={2.2}
            />
            <span className="text-[15px] font-extrabold text-[#0F172A] tracking-tight">
              {townName}
            </span>
          </button>
        )}
      </div>

      {/* 우측 아이콘: 검색, 알림 (안 읽은 알림이 있으면 빨간 점) */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="동네소식 검색"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-[#4B5563]"
        >
          <Search size={21} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={onBellClick}
          aria-label="알림"
          className="min-w-[40px] min-h-[40px] relative flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-[#4B5563]"
        >
          <Bell size={21} strokeWidth={1.8} />
          {hasUnreadNotification && (
            <span
              data-testid="notification-unread-dot"
              className="absolute top-2 right-2 w-[7px] h-[7px] bg-[#EF4444] rounded-full border-[1.5px] border-white"
            />
          )}
        </button>
      </div>
    </header>
  );
};

