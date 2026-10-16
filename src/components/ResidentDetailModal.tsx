import React from 'react';
import { ArrowLeft, Share2, Building2 } from 'lucide-react';
import { ResidentFeed } from '../types';
import { formatRelativeTime } from '../api/mock';

interface ResidentDetailModalProps {
  item: ResidentFeed;
  onBack: () => void;
  onShare: () => void;
}

export const ResidentDetailModal: React.FC<ResidentDetailModalProps> = ({
  item,
  onBack,
  onShare,
}) => {
  return (
    <div className="bg-white min-h-screen pb-[100px] select-none">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white min-h-[52px] px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.2} />
        </button>
        <span className="text-[15px] font-bold text-[#1E293B]">주민소식</span>
        <button
          type="button"
          onClick={onShare}
          className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer text-[#4B5563]"
          aria-label="공유"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Image */}
      <div className="w-full h-[220px] bg-[#F8FAFC] overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#00B4C5] bg-[#E6F8F9] px-2.5 py-1 rounded-full">
            {item.category || '주민소식'}
          </span>
          {item.organization && (
            <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
              <Building2 size={12} />
              {item.organization}
            </span>
          )}
        </div>

        <h1 className="text-[18px] font-extrabold text-[#0F172A] leading-snug">
          {item.title}
        </h1>

        <div className="text-[11px] text-[#94A3B8] pb-2 border-b border-[#F3F4F6]">
          {formatRelativeTime(item.createdAt)} 게시
        </div>

        <div className="text-[14px] text-[#374151] leading-[1.6] whitespace-pre-line py-2">
          {item.content}
        </div>

        <div className="mt-4 p-4 rounded-[12px] bg-[#F8FAFC] border border-[#EEEEEE] text-[12px] text-[#64748B]">
          <p className="font-bold text-[#1E293B] mb-1">안내사항</p>
          <p>
            본 소식은 행정복지센터 및 마을자치위원회에서 제공하는 공식 정보입니다. 문의사항은 해당 부서로 연락 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};
