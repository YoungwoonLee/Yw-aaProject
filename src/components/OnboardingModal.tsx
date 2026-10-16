import React, { useState } from 'react';
import { setSeenOnboarding } from '../api/mock';

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: '동네이야기',
      subtitle: '우리 동네의 모든 이야기를\n담은 아카이브',
      icon: '🏘️',
      color: '#00B4C5',
    },
    {
      title: '주민소식',
      subtitle: '공사, 공지, 회의, 행사 등 주민들에게\n필요한 행정 정보를 한 눈에',
      icon: '📢',
      color: '#10B981',
    },
    {
      title: '로컬박스',
      subtitle: '내가 남긴 동네이야기와\n주민소식 · 광고를 볼 수 있는 채널',
      icon: '📦',
      color: '#7C3AED',
    },
  ];

  const handleFinish = () => {
    setSeenOnboarding();
    onComplete();
  };

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const currentSlide = slides[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-[24px] max-w-[360px] w-full p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden animate-fadeIn">
        {/* Skip button on top right */}
        {step < slides.length - 1 && (
          <button
            type="button"
            onClick={handleFinish}
            className="absolute top-4 right-4 text-[13px] text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
          >
            건너뛰기
          </button>
        )}

        {/* Visual Graphic */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 mt-4 shadow-sm"
          style={{ backgroundColor: `${currentSlide.color}15` }}
        >
          {currentSlide.icon}
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-extrabold text-[#111827] mb-2">
          {currentSlide.title}
        </h2>

        {/* Subtitle */}
        <p className="text-[14px] text-[#4B5563] leading-relaxed whitespace-pre-line mb-8 min-h-[48px]">
          {currentSlide.subtitle}
        </p>

        {/* Dots */}
        <div className="flex items-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className="h-2 rounded-full transition-all"
              style={{
                width: step === idx ? '24px' : '8px',
                backgroundColor: step === idx ? '#00B4C5' : '#E5E7EB',
              }}
            />
          ))}
        </div>

        {/* Bottom Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-3.5 rounded-[14px] text-white font-extrabold text-[15px] cursor-pointer shadow-md hover:opacity-90 active:scale-[0.99] transition-all"
          style={{ backgroundColor: '#00B4C5' }}
        >
          {step === slides.length - 1 ? '시작하기' : '다음'}
        </button>
      </div>
    </div>
  );
};
