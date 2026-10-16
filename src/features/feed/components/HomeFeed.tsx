import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useHomeFeed } from '../hooks/useHomeFeed';
import { useContentActions } from '../hooks/useContentActions';
import { feedKeys, fetchBanners } from '../api/feedApi';
import { FeedCard } from './FeedCard';
import { FeedCardSkeleton } from './FeedCardSkeleton';
import { BannerCarousel } from './BannerCarousel';
import { FeedContent, BannerItem } from '../../../types/content';
import { RefreshCw } from 'lucide-react';

interface HomeFeedProps {
  onNavigateToDetail: (contentId: number, anchor?: string) => void;
  onNavigateToLocalbox: (localboxId: number) => void;
  onOpenMoreMenu: (feed: FeedContent) => void;
  onShare: (feed: FeedContent) => void;
  onRequireLogin: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const SCROLL_POS_KEY = 'ondaji_home_feed_scroll_pos';

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onNavigateToDetail,
  onNavigateToLocalbox,
  onOpenMoreMenu,
  onShare,
  onRequireLogin,
  containerRef,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useHomeFeed();

  const { data: banners } = useQuery<BannerItem[]>({
    queryKey: feedKeys.banners(),
    queryFn: fetchBanners,
    staleTime: 1000 * 60 * 10,
  });

  const { handleToggleLike, handleToggleBookmark } = useContentActions({
    onRequireLogin,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sentinel IntersectionObserver (rootMargin 600px)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '600px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 스크롤 위치 복원 & 저장
  useEffect(() => {
    const scrollTarget = containerRef?.current || window;
    // 복원 시도
    try {
      const saved = sessionStorage.getItem(SCROLL_POS_KEY);
      if (saved && containerRef?.current) {
        const top = parseInt(saved, 10);
        if (!isNaN(top) && top > 0) {
          // 다음 렌더링 프레임에 스크롤 복원
          requestAnimationFrame(() => {
            if (containerRef.current) {
              containerRef.current.scrollTop = top;
            }
          });
        }
      }
    } catch (e) {
      // sessionStorage 보안 제약 대비
    }

    // 스크롤 위치 저장 핸들러
    const handleScrollSave = () => {
      try {
        if (containerRef?.current) {
          sessionStorage.setItem(SCROLL_POS_KEY, String(containerRef.current.scrollTop));
        }
      } catch (e) {}
    };

    if (containerRef?.current) {
      containerRef.current.addEventListener('scroll', handleScrollSave, { passive: true });
    }

    return () => {
      if (containerRef?.current) {
        containerRef.current.removeEventListener('scroll', handleScrollSave);
      }
    };
  }, [containerRef]);

  // 모든 페이지의 피드 콘텐츠를 평탄화
  const allFeeds = data ? data.pages.flatMap((page) => page.result.content) : [];

  return (
    <div className="w-full pb-24 bg-white min-h-screen select-none">
      {/* 띠 배너 캐러셀 (GET /api/banner) */}
      <BannerCarousel
        banners={banners || []}
        onBannerClick={(b) => console.log('Banner clicked:', b.linkUrl)}
      />

      {/* 최초 로딩: 카드 스켈레톤 3개 */}
      {isLoading && (
        <div className="flex flex-col">
          <FeedCardSkeleton />
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </div>
      )}

      {/* 에러 상태: "다시 시도" 버튼 */}
      {isError && (
        <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
          <p className="text-[14px] text-[#475569] mb-4">
            피드 목록을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14B8B0] text-white text-[13px] font-bold cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <RefreshCw size={16} />
            <span>다시 시도</span>
          </button>
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && !isError && allFeeds.length === 0 && (
        <div className="py-24 px-4 text-center text-[#94A3B8]">
          <p className="text-[14px] font-semibold text-[#475569]">
            아직 등록된 동네소식이 없습니다.
          </p>
          <p className="text-[12px] text-[#94A3B8] mt-1">
            우리 동네의 첫 번째 소식을 작성해보세요!
          </p>
        </div>
      )}

      {/* 피드 카드 목록 */}
      {!isLoading && allFeeds.length > 0 && (
        <div className="flex flex-col">
          {allFeeds.map((feed) => (
            <FeedCard
              key={feed.contentId}
              feed={feed}
              onNavigateToDetail={onNavigateToDetail}
              onNavigateToLocalbox={onNavigateToLocalbox}
              onOpenMoreMenu={onOpenMoreMenu}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              onShare={onShare}
            />
          ))}
        </div>
      )}

      {/* 리스트 하단 Sentinel (rootMargin 600px 감지) */}
      <div ref={sentinelRef} className="h-4 w-full" />

      {/* 다음 페이지 로딩: 하단 스피너 */}
      {isFetchingNextPage && (
        <div className="py-6 flex items-center justify-center gap-2 text-[#94A3B8] text-[13px]">
          <div className="w-5 h-5 border-2 border-[#14B8B0] border-t-transparent rounded-full animate-spin" />
          <span>소식을 더 불러오는 중...</span>
        </div>
      )}

      {/* 마지막 페이지 도달 안내 */}
      {!hasNextPage && allFeeds.length > 0 && (
        <div className="py-8 text-center text-[12px] text-[#94A3B8]">
          모든 동네소식을 확인했습니다
        </div>
      )}
    </div>
  );
};
