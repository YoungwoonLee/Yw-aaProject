import React, { useState } from 'react';
import { Users, Check, Plus, ArrowRight } from 'lucide-react';
import { LocalboxCreatorItem, MOCK_LOCALBOX_CREATORS } from '../constants/localData';

interface LocalboxCreatorStripProps {
  currentTown: string;
  onNavigateToLocalbox: (localboxId: number) => void;
  onShowToast: (msg: string) => void;
}

export const LocalboxCreatorStrip: React.FC<LocalboxCreatorStripProps> = ({
  currentTown,
  onNavigateToLocalbox,
  onShowToast,
}) => {
  const [followingMap, setFollowingMap] = useState<Record<number, boolean>>({
    1: true,
  });

  const handleToggleFollow = (e: React.MouseEvent, creator: LocalboxCreatorItem) => {
    e.stopPropagation();
    setFollowingMap((prev) => {
      const nextState = !prev[creator.id];
      onShowToast(
        nextState
          ? `'${creator.name}' 로컬박스를 구독했습니다.`
          : `'${creator.name}' 구독을 취소했습니다.`
      );
      return { ...prev, [creator.id]: nextState };
    });
  };

  return (
    <div className="py-3 bg-white border-b border-[#F1F5F9] select-none">
      {/* Title Header */}
      <div className="px-4 mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-black text-[#0F172A]">
            우리 동네 로컬박스
          </span>
          <span className="text-[11px] font-bold text-[#14B8B0] bg-[#E8F8F7] px-2 py-0.5 rounded-full">
            {currentTown} 추천
          </span>
        </div>
        <span className="text-[11px] text-[#94A3B8]">
          이웃 & 단골가게
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar scroll-smooth">
        {MOCK_LOCALBOX_CREATORS.map((creator) => {
          const isFollowing = !!followingMap[creator.id];
          return (
            <div
              key={creator.id}
              onClick={() => onNavigateToLocalbox(creator.id)}
              className="min-w-[150px] max-w-[150px] p-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col items-center text-center cursor-pointer hover:border-[#14B8B0] hover:bg-white transition-all shadow-2xs group"
            >
              {/* Avatar 48px with Badge */}
              <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E2E8F0] border-2 border-white shadow-xs flex items-center justify-center font-bold text-white text-base">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="bg-[#14B8B0] w-full h-full flex items-center justify-center">
                      {creator.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span
                  className="absolute -bottom-1 -right-1 text-[9px] font-bold text-white px-1.5 py-0.2 rounded-full shadow-2xs"
                  style={{ backgroundColor: creator.categoryColor }}
                >
                  {creator.category.slice(0, 2)}
                </span>
              </div>

              {/* Name & Tagline */}
              <h4 className="text-[13px] font-bold text-[#0F172A] truncate w-full mb-0.5">
                {creator.name}
              </h4>
              <p className="text-[10px] text-[#64748B] line-clamp-1 w-full mb-2">
                {creator.tagline}
              </p>

              {/* Stats */}
              <div className="text-[10px] text-[#94A3B8] mb-2.5 flex items-center gap-1">
                <span>팔로워 {creator.followersCount + (isFollowing ? 1 : 0)}</span>
                <span>·</span>
                <span className="text-[#14B8B0] font-semibold">{creator.engagementRate}</span>
              </div>

              {/* Subscribe / Follow Button */}
              <button
                type="button"
                onClick={(e) => handleToggleFollow(e, creator)}
                className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isFollowing
                    ? 'bg-[#E2E8F0] text-[#475569] hover:bg-red-50 hover:text-red-600'
                    : 'bg-[#14B8B0] text-white hover:bg-[#0D9488] shadow-2xs'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check size={12} strokeWidth={2.5} />
                    <span>구독중</span>
                  </>
                ) : (
                  <>
                    <Plus size={12} strokeWidth={2.5} />
                    <span>구독</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
