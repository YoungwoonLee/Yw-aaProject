import React, { useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { ContentFile } from '../../../types/content';
import { buildContentImageUrl } from '../../../shared/lib/imageUrl';

interface MediaCarouselProps {
  files: ContentFile[];
  contentTitle: string;
  onMediaClick?: (index: number) => void;
  isDetailView?: boolean;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  files,
  contentTitle,
  onMediaClick,
  isDetailView = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 동영상 재생 관리: 화면에 50% 이상 보이면 음소거 자동재생, 벗어나면 일시정지
  const videoFile = files?.find((f) => f.contentFileType === 'VIDEO_FILE');

  useEffect(() => {
    if (!videoFile || !videoRef.current) return;
    const video = videoRef.current;

    // HLS 세팅 (encodedFileUrl 우선 사용)
    const videoSrc = videoFile.encodedFileUrl || videoFile.contentFileUrl;
    let hlsInstance: Hls | null = null;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari 네이티브 HLS
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      hlsInstance = new Hls({ enableWorker: true });
      hlsInstance.loadSource(videoSrc);
      hlsInstance.attachMedia(video);
    } else {
      video.src = videoSrc;
    }

    // IntersectionObserver: 50% 이상 노출 시 재생
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(video);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [videoFile]);

  // Scroll-snap 감지하여 currentIndex 동기화
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !files) return;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < files.length) {
        setCurrentIndex(newIndex);
      }
    }
  }, [currentIndex, files]);

  // 키보드 네비게이션 지원 (←/→)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const container = scrollContainerRef.current;
    if (!container || !files) return;
    if (e.key === 'ArrowRight') {
      const next = Math.min(currentIndex + 1, files.length - 1);
      container.scrollTo({ left: next * container.clientWidth, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      const prev = Math.max(currentIndex - 1, 0);
      container.scrollTo({ left: prev * container.clientWidth, behavior: 'smooth' });
    }
  };

  const handleImageLoaded = (idx: number) => {
    setLoadedMap((prev) => ({ ...prev, [idx]: true }));
  };

  if (!files || files.length === 0) {
    return null;
  }

  const total = files.length;
  const isMultiple = total > 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${contentTitle} 미디어`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${isDetailView ? 'aspect-[4/3] sm:aspect-video' : 'aspect-[4/3]'} bg-[#F8FAFC] overflow-hidden select-none outline-none group`}
    >
      {/* Scroll-Snap Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full h-full flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {files.map((file, idx) => {
          const isVideo = file.contentFileType === 'VIDEO_FILE';
          const isPriority = idx === 0;
          const isLoaded = loadedMap[idx];

          return (
            <div
              key={`${file.contentFileUrl}-${idx}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${total}장 중 ${idx + 1}번째`}
              className="w-full h-full shrink-0 snap-center relative cursor-pointer"
              onClick={() => onMediaClick?.(idx)}
            >
              {/* 회색 스켈레톤 로딩 플레이스홀더 */}
              {!isLoaded && !isVideo && (
                <div className="absolute inset-0 bg-[#E5E7EB] animate-pulse" />
              )}

              {isVideo ? (
                <video
                  ref={videoRef}
                  poster={file.thumbnailFileUrl ? buildContentImageUrl(file.thumbnailFileUrl) : undefined}
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                  aria-label={`${contentTitle} 동영상`}
                />
              ) : (
                <img
                  src={buildContentImageUrl(file.contentFileUrl)}
                  alt={`${contentTitle} 이미지 ${idx + 1}`}
                  loading={isPriority ? 'eager' : 'lazy'}
                  fetchPriority={isPriority ? 'high' : 'auto'}
                  onLoad={() => handleImageLoaded(idx)}
                  className={`w-full h-full object-cover transition-opacity duration-200 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 2장 이상일 때만 우상단 현재/전체 배지 (반투명 검정 pill) */}
      {isMultiple && (
        <div
          className="absolute top-3 right-3 text-white text-[11px] font-bold rounded-full backdrop-blur-sm pointer-events-none"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            padding: '3px 9px',
          }}
          aria-live="polite"
        >
          {currentIndex + 1}/{total}
        </div>
      )}

      {/* 2장 이상일 때만 하단 점 인디케이터 */}
      {isMultiple && (
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
          {files.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                currentIndex === idx
                  ? 'w-4 bg-white shadow-xs'
                  : 'w-1.5 bg-white/50 backdrop-blur-xs'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
