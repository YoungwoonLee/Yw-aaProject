import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useRegionalFeed } from '../hooks/useRegionalFeed';
import { useContentActions } from '../../feed/hooks/useContentActions';
import { feedKeys, fetchBanners } from '../../feed/api/feedApi';
import { FeedCard } from '../../feed/components/FeedCard';
import { FeedCardSkeleton } from '../../feed/components/FeedCardSkeleton';
import { BannerCarousel } from '../../feed/components/BannerCarousel';
import { FeedContent, BannerItem } from '../../../types/content';
import { SelectedTownState } from '../../../types/local';
import { useLocalTabStore } from '../store/useLocalTabStore';

export interface LocalFeedViewProps {
  selectedTown: SelectedTownState;
  onNavigateToDetail: (contentId: number, anchor?: string) => void;
  onNavigateToLocalbox: (localboxId: number) => void;
  onShare: (feed: FeedContent) => void;
  onMoreMenu: (feed: FeedContent) => void;
  onRequireLogin: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const LocalFeedView: React.FC<LocalFeedViewProps> = ({
  selectedTown,
  onNavigateToDetail,
  onNavigateToLocalbox,
  onShare,
  onMoreMenu,
  onRequireLogin,
  containerRef,
}) => {
  const markContentAsRead = useLocalTabStore((s) => s.markContentAsRead);
  const isLoggedIn = useLocalTabStore((s) => s.isLoggedIn);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useRegionalFeed(selectedTown);

  const { data: banners } = useQuery<BannerItem[]>({
    queryKey: feedKeys.banners(),
    queryFn: fetchBanners,
    staleTime: 1000 * 60 * 10,
  });

  const { handleToggleLike, handleToggleBookmark } = useContentActions({
    onRequireLogin,
    isLoggedIn,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const prevCodeValueRef = useRef<string>(selectedTown.codeValue);

  // 동네가 바뀌면 스크롤을 맨 위로 이동
  useEffect(() => {
    if (prevCodeValueRef.current !== selectedTown.codeValue) {
      prevCodeValueRef.current = selectedTown.codeValue;
      if (containerRef?.current) {
        containerRef.current.scrollTop = 0;
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0 });
      }
    }
  }, [selectedTown.codeValue, containerRef]);

  // 무한 스크롤 Sentinel (12건 단위, lastSearchSort 커서)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

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

  // 상세를 열면 그 contentId를 읽은 글 목록에 추가한다 (로컬 상태 + 서버 기록은 TODO)
  const handleCardDetailClick = (contentId: number, anchor?: string) => {
    markContentAsRead(contentId);
    onNavigateToDetail(contentId, anchor);
  };

  const allFeeds = data
    ? data.pages.flatMap((page) => page.result.content)
    : [];

  return (
    <div
      data-testid="local-feed-view"
      className="w-full pb-24 bg-white min-h-screen select-none"
    >
      {/* 띠 배너 캐러셀 (홈과 동일) */}
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

      {/* 에러 상태 */}
      {isError && (
        <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
          <p className="text-[14px] text-[#475569] mb-4">
            동네 피드 목록을 불러오지 못했습니다.
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
            {selectedTown.areaName} 주변에 등록된 동네소식이 없습니다.
          </p>
          <p className="text-[12px] text-[#94A3B8] mt-1">
            우리 동네의 첫 번째 소식을 작성해보세요!
          </p>
        </div>
      )}

      {/* 피드 카드 리스트: 홈 FeedCard를 재사용하되 variant="regional"로 */}
      {!isLoading && allFeeds.length > 0 && (
        <div className="flex flex-col">
          {allFeeds.map((feed) => (
            <FeedCard
              key={feed.contentId}
              feed={feed}
              variant="regional"
              onNavigateToDetail={handleCardDetailClick}
              onNavigateToLocalbox={onNavigateToLocalbox}
              onOpenMoreMenu={onMoreMenu}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              onShare={onShare}
            />
          ))}
        </div>
      )}

      {/* 무한 스크롤 감지 Sentinel */}
      <div ref={sentinelRef} className="h-4 w-full" />

      {/* 다음 페이지 로딩 스피너 */}
      {isFetchingNextPage && (
        <div className="py-6 flex items-center justify-center gap-2 text-[#94A3B8] text-[13px]">
          <div className="w-5 h-5 border-2 border-[#14B8B0] border-t-transparent rounded-full animate-spin" />
          <span>주변 동네 소식을 더 불러오는 중...</span>
        </div>
      )}

      {/* 마지막 페이지 안내 */}
      {!hasNextPage && allFeeds.length > 0 && (
        <div className="py-8 text-center text-[12px] text-[#94A3B8]">
          {selectedTown.areaName} 및 주변 동네 소식을 모두 확인했습니다
        </div>
      )}
    </div>
  );
};
