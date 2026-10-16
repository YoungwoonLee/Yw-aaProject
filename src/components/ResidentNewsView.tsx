import React, { useState, useEffect } from 'react';
import { ResidentFeed } from '../types';
import { getResidentFeeds, formatRelativeTime } from '../api/mock';

interface ResidentNewsViewProps {
  onCardClick: (resident: ResidentFeed) => void;
}

export const ResidentNewsView: React.FC<ResidentNewsViewProps> = ({ onCardClick }) => {
  const [residentFeeds, setResidentFeeds] = useState<ResidentFeed[]>([]);

  useEffect(() => {
    setResidentFeeds(getResidentFeeds());
  }, []);

  return (
    <div className="bg-white pb-[90px] select-none min-h-screen">
      {/* Header Title */}
      <div className="px-4 py-4 border-b border-[#F3F4F6] sticky top-[52px] bg-white z-10">
        <h1 className="text-[16px] font-extrabold text-[#1E293B]">주민소식</h1>
      </div>

      {/* Notice Banner */}
      <div className="mx-4 mt-3 p-3 bg-[#F8FAFC] rounded-[10px] border border-[#EEEEEE] text-[12px] text-[#64748B] flex items-center justify-between">
        <span>우리 동네 공사, 행사, 행정 공지를 확인하세요.</span>
        <span className="text-[#00B4C5] font-bold text-[11px] shrink-0">실시간 반영</span>
      </div>

      {/* Cards List */}
      <div className="p-4 flex flex-col gap-4">
        {residentFeeds.map((item) => (
          <article
            key={item.id}
            onClick={() => onCardClick(item)}
            className="rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
            style={{
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            {/* Card Image 150px */}
            <div className="relative w-full h-[150px] bg-[#F8FAFC] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Badge "주민소식" */}
              <div
                className="absolute top-3 left-3 text-[10px] font-bold text-[#00B4C5] bg-[#E6F8F9] rounded-[10px] px-2.5 py-1 backdrop-blur-sm"
              >
                {item.category || '주민소식'}
              </div>

              {/* Organization chip if available */}
              {item.organization && (
                <div className="absolute bottom-2.5 right-3 text-[10px] font-medium text-white/90 bg-black/50 rounded-full px-2 py-0.5 backdrop-blur-sm">
                  {item.organization}
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-3.5">
              <h2 className="text-[14px] font-bold text-[#1E293B] mb-1.5 leading-[1.35] line-clamp-2">
                {item.title}
              </h2>

              <p className="text-[12px] text-[#6B7280] line-clamp-2 mb-2 leading-relaxed">
                {item.content}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] pt-2 border-t border-[#F8FAFC]">
                <span>{formatRelativeTime(item.createdAt)}</span>
                <span className="text-[#00B4C5] font-semibold text-[11px]">자세히 보기 ›</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
