import React, { useState, useEffect, useRef } from 'react';
import { BannerItem } from '../../../types/content';

interface BannerCarouselProps {
  banners: BannerItem[];
  onBannerClick?: (banner: BannerItem) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  onBannerClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const bannerCount = banners?.length || 0;

  // 자동 롤링 (3.5초 주기)
  useEffect(() => {
    if (bannerCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % bannerCount;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: next * scrollRef.current.clientWidth,
            behavior: 'smooth',
          });
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [bannerCount]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !banners) return;
    const width = el.clientWidth;
    if (width > 0) {
      const idx = Math.round(el.scrollLeft / width);
      if (idx !== currentIndex && idx >= 0 && idx < banners.length) {
        setCurrentIndex(idx);
      }
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden select-none px-4 py-2.5 bg-white">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-[68px] flex overflow-x-auto no-scrollbar snap-x snap-mandatory rounded-[12px] bg-[#EBFBFC] border border-[#14B8B0]/20"
      >
        {banners.map((banner, idx) => (
          <div
            key={banner.bannerId}
            onClick={() => onBannerClick?.(banner)}
            className="w-full h-full shrink-0 snap-center p-3 flex items-center justify-between cursor-pointer relative"
          >
            <div className="flex items-center gap-2.5 z-10">
              <span
                className="text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: '#14B8B0' }}
              >
                안내
              </span>
              <span className="text-[13px] font-bold text-[#0F172A] truncate max-w-[240px]">
                {banner.bannerTitle}
              </span>
            </div>

            {/* 우측 하단 1/3 형식 인디케이터 */}
            <div
              className="absolute bottom-2 right-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full z-10"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            >
              {idx + 1}/{banners.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
