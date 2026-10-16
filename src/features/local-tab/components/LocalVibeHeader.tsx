import React from 'react';
import { MapPin, ChevronDown, Sparkles, TrendingUp, Users } from 'lucide-react';
import { TownInfo } from '../constants/localData';

interface LocalVibeHeaderProps {
  town: TownInfo;
  onOpenTownModal: () => void;
}

export const LocalVibeHeader: React.FC<LocalVibeHeaderProps> = ({
  town,
  onOpenTownModal,
}) => {
  return (
    <div className="bg-white border-b border-[#F1F5F9] select-none">
      {/* 1. Town Switcher Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-[#F8FAFC]/80">
        <button
          type="button"
          onClick={onOpenTownModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#14B8B0] transition-colors cursor-pointer"
        >
          <MapPin size={16} className="text-[#14B8B0]" />
          <span className="text-[14px] font-extrabold text-[#0F172A]">
            {town.dongName}
          </span>
          <span className="text-[11px] font-medium text-[#64748B]">
            {town.cityName}
          </span>
          <ChevronDown size={14} className="text-[#94A3B8]" />
        </button>

        <button
          type="button"
          onClick={onOpenTownModal}
          className="text-[12px] font-bold text-[#14B8B0] hover:underline cursor-pointer"
        >
          동네 변경
        </button>
      </div>

      {/* 2. Neighborhood Vibe Briefing Card */}
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#E6F8F7] via-[#F0FDF4] to-[#EFF6FF] p-4 border border-[#CCF0EE] shadow-xs relative overflow-hidden">
          {/* Background Decorative Bubble */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#14B8B0]/10 rounded-full blur-xl pointer-events-none" />

          {/* Top Row: Weather & Mood Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0F766E] bg-white/80 px-2.5 py-1 rounded-full shadow-2xs">
              <span>{town.weather.icon}</span>
              <span>{town.weather.temp} {town.weather.condition}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0369A1] bg-sky-50 px-2 py-0.5 rounded-md">
              <Sparkles size={12} />
              <span>동네 바이브</span>
            </span>
          </div>

          {/* Town Tagline */}
          <h2 className="text-[16px] font-black text-[#0F172A] leading-snug mb-1.5">
            {town.tagline}
          </h2>
          <p className="text-[12px] text-[#475569] mb-3 leading-relaxed">
            {town.weather.message}
          </p>

          {/* Neighborhood Share Bar (점유율) */}
          <div className="bg-white/90 rounded-xl p-2.5 mb-3 shadow-2xs border border-[#E2E8F0]/70">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#334155] mb-1.5">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} className="text-[#14B8B0]" />
                <span>우리 동네 소식 점유율</span>
              </span>
              <span className="text-[#14B8B0]">
                {town.shareDongs[0]?.dongName} {town.shareDongs[0]?.percentage}%
              </span>
            </div>

            {/* Segmented Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#E2E8F0]">
              {town.shareDongs.map((item, idx) => (
                <div
                  key={idx}
                  className="h-full transition-all"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.dongName}: ${item.percentage}%`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#64748B]">
              {town.shareDongs.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.dongName} {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/80 rounded-xl py-2 px-1 border border-white/60">
              <span className="block text-[15px] font-black text-[#0F172A]">
                {town.stats.newsCount}
              </span>
              <span className="text-[10px] font-semibold text-[#64748B]">
                동네 소식
              </span>
            </div>
            <div className="bg-white/80 rounded-xl py-2 px-1 border border-white/60">
              <span className="block text-[15px] font-black text-[#14B8B0]">
                {town.stats.localboxCount}
              </span>
              <span className="text-[10px] font-semibold text-[#64748B]">
                로컬박스
              </span>
            </div>
            <div className="bg-white/80 rounded-xl py-2 px-1 border border-white/60">
              <span className="block text-[15px] font-black text-[#3B82F6]">
                {town.stats.engagementRate}%
              </span>
              <span className="text-[10px] font-semibold text-[#64748B]">
                소통 만족도
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
