import React from 'react';
import { ChevronLeft, User, ChevronRight, HelpCircle, FileText, Smartphone } from 'lucide-react';

interface MyInfoViewProps {
  onBack: () => void;
  onGoLogin: () => void;
  onShowToast: (msg: string) => void;
}

export const MyInfoView: React.FC<MyInfoViewProps> = ({
  onBack,
  onGoLogin,
  onShowToast,
}) => {
  return (
    <div className="bg-white min-h-screen pb-[90px] select-none">
      {/* Header 56px: "‹" + "내 정보" */}
      <div
        className="sticky top-0 z-10 bg-white px-4 border-b border-[#F3F4F6] flex items-center gap-2"
        style={{ height: '56px' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} color="#1E293B" />
        </button>
        <h1 className="text-[17px] font-bold text-[#1E293B]">내 정보</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Login Banner: radius 16px, bg #f9fafb, 44px #59bfb3 circle with 👤 */}
        <div
          onClick={onGoLogin}
          className="p-4 rounded-[16px] bg-[#F9FAFB] border border-[#EEEEEE] flex items-center gap-3.5 cursor-pointer hover:bg-[#F3F4F6] transition-colors"
        >
          <div
            className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 text-white"
            style={{ backgroundColor: '#59BFB3' }}
          >
            <User size={24} color="#ffffff" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-[#0F172A]">로그인/회원가입</h2>
            <p className="text-[12px] text-[#64748B] mt-0.5 truncate">
              로그인하고 우리 동네 온닫이 소식을 만나보세요.
            </p>
          </div>

          <ChevronRight size={18} color="#94A3B8" />
        </div>

        {/* Section 1: 서비스 이용 */}
        <div className="bg-white rounded-[14px] border border-[#F3F4F6] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#F3F4F6] text-[11px] font-bold text-[#94A3B8]">
            서비스 이용
          </div>
          <div className="flex flex-col text-[14px] text-[#374151]">
            <button
              type="button"
              onClick={() => onShowToast('최신 공지사항이 없습니다.')}
              className="flex items-center justify-between px-4 py-3.5 border-b border-[#F8FAFC] hover:bg-[#F9FAFB] cursor-pointer"
            >
              <span>공지사항</span>
              <ChevronRight size={16} color="#9CA3AF" />
            </button>
            <button
              type="button"
              onClick={() => onShowToast('온닫이 고객센터: contact@ondaji.com')}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-[#F9FAFB] cursor-pointer"
            >
              <span>고객센터</span>
              <ChevronRight size={16} color="#9CA3AF" />
            </button>
          </div>
        </div>

        {/* Section 2: 이용약관 */}
        <div className="bg-white rounded-[14px] border border-[#F3F4F6] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#F3F4F6] text-[11px] font-bold text-[#94A3B8]">
            이용약관
          </div>
          <div className="flex flex-col text-[14px] text-[#374151]">
            <button
              type="button"
              onClick={() => onShowToast('이용약관 및 정책')}
              className="flex items-center justify-between px-4 py-3.5 border-b border-[#F8FAFC] hover:bg-[#F9FAFB] cursor-pointer"
            >
              <span>약관 및 정책</span>
              <ChevronRight size={16} color="#9CA3AF" />
            </button>
            <button
              type="button"
              onClick={() => onShowToast('오픈소스 라이선스 내역 (React, Tailwind CSS, Lucide)')}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-[#F9FAFB] cursor-pointer"
            >
              <span>오픈소스 라이선스 내역</span>
              <ChevronRight size={16} color="#9CA3AF" />
            </button>
          </div>
        </div>

        {/* Section 3: 업데이트 */}
        <div className="bg-white rounded-[14px] border border-[#F3F4F6] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#F3F4F6] text-[11px] font-bold text-[#94A3B8]">
            업데이트
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between text-[14px]">
            <div>
              <span className="font-medium text-[#374151]">앱버전</span>
              <span className="ml-2 font-bold text-[#00B4C5]">V1.3.0</span>
            </div>
            <span className="text-[12px] text-[#10B981] font-semibold bg-[#ECFDF5] px-2.5 py-1 rounded-full">
              최신 버전입니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
