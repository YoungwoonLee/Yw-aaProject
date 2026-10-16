import React from 'react';
import { Flag } from 'lucide-react';

export const ReadyView: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pb-[90px] select-none flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#EBFBFC] flex items-center justify-center text-[#00B4C5] mb-4 shadow-sm">
        <Flag size={30} color="#00B4C5" strokeWidth={2.2} />
      </div>
      <h2 className="text-[18px] font-extrabold text-[#111827] mb-2">
        준비 중입니다
      </h2>
      <p className="text-[13px] text-[#64748B] leading-relaxed max-w-[260px]">
        이웃과 이웃, 동네 가게와 주민을 잇는{' '}
        <span className="font-bold text-[#00B4C5]">온닫이 연결망</span> 서비스가 곧 오픈될 예정입니다.
      </p>
      <div className="mt-6 px-4 py-2 bg-[#F8FAFC] rounded-full border border-[#EEEEEE] text-[11px] text-[#94A3B8]">
        COMING SOON · 온닫이 연결
      </div>
    </div>
  );
};
