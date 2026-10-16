import React from 'react';

interface LoginRequiredModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 select-none animate-fadeIn">
      <div className="bg-white rounded-[20px] max-w-[320px] w-full p-6 text-center shadow-2xl flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#EBFBFC] text-[#00B4C5] flex items-center justify-center text-xl mb-3">
          🔒
        </div>
        <h3 className="text-[16px] font-bold text-[#1E293B] mb-2 leading-relaxed whitespace-pre-line">
          로그인 후 이용 가능합니다.{'\n'}로그인 하시겠습니까?
        </h3>
        <p className="text-[12px] text-[#64748B] mb-5">
          로그인하시면 원데이 클래스 예약, 글쓰기 등 온닫이의 모든 기능을 이용할 수 있습니다.
        </p>

        <div className="w-full flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-[12px] bg-[#F3F4F6] text-[#4B5563] font-bold text-[13px] cursor-pointer hover:bg-[#E5E7EB] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-[12px] bg-[#00B4C5] text-white font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm transition-opacity"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};
