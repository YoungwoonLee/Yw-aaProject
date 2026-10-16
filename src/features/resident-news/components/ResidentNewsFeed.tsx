import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  MapPin,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Search,
  X,
  PenSquare,
  Sparkles,
  Info,
} from 'lucide-react';
import { useResidentFilters } from '../hooks/useResidentFilters';
import { useResidentNews } from '../hooks/useResidentNews';
import {
  residentNewsKeys,
  toggleResidentNewsLike,
  toggleResidentNewsBookmark,
  toggleResidentLocalboxFollow,
} from '../api/residentNewsApi';
import { DEFAULT_HDONGS } from '../constants/filterOptions';
import { ResidentNewsContent, HangjungdongItem } from '../../../types/resident';
import { FilterChipBar } from './FilterChipBar';
import { ResidentNewsListItem } from './ResidentNewsListItem';
import { HdongSelectorModal } from './HdongSelectorModal';

interface ResidentNewsFeedProps {
  onNavigateToDetail: (contentId: number) => void;
  onNavigateToLocalbox?: (localboxId: number) => void;
  onShare: (content: ResidentNewsContent) => void;
  onRequireLogin: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

type ResidentSortMode = 'latest' | 'popular' | 'replies';

export const ResidentNewsFeed: React.FC<ResidentNewsFeedProps> = ({
  onNavigateToDetail,
  onNavigateToLocalbox,
  onShare,
  onRequireLogin,
}) => {
  const queryClient = useQueryClient();
  const [isHdongModalOpen, setIsHdongModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortMode, setSortMode] = useState<ResidentSortMode>('latest');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const {
    filters,
    setHdong,
    setInterestFilters,
    setAgeGroupFilters,
    setTargetGroupFilters,
    resetAllFilters,
    isAnyFilterActive,
  } = useResidentFilters('4125051000'); // Default: 생연1동

  const currentHdongItem =
    DEFAULT_HDONGS.find((h) => h.code === filters.hdongCodeValue) || DEFAULT_HDONGS[0];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useResidentNews(filters);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sentinel IntersectionObserver for infinite scrolling
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
        rootMargin: '500px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle Like
  const handleToggleLike = async (contentId: number) => {
    try {
      await toggleResidentNewsLike(contentId);
      queryClient.invalidateQueries({ queryKey: residentNewsKeys.all });
    } catch {
      onRequireLogin();
    }
  };

  // Handle Bookmark
  const handleToggleBookmark = async (contentId: number) => {
    try {
      await toggleResidentNewsBookmark(contentId);
      queryClient.invalidateQueries({ queryKey: residentNewsKeys.all });
    } catch {
      onRequireLogin();
    }
  };

  const handleSelectHdong = (hdong: HangjungdongItem) => {
    setHdong(hdong.code);
    setIsHdongModalOpen(false);
    showToast(`행정동이 '${hdong.name}'(으)로 변경되었습니다.`);
  };

  const rawItems = data?.pages.flatMap((page) => page.result.content) || [];

  // Filter and sort items locally for smooth immediate user feedback
  const processedItems = useMemo(() => {
    let list = [...rawItems];

    // Search filter
    if (searchKeyword.trim()) {
      const q = searchKeyword.trim().toLowerCase();
      list = list.filter((item) => {
        const titleMatch = item.contentTitle.toLowerCase().includes(q);
        const bodyMatch = item.contentBodyText.toLowerCase().includes(q);
        const authorMatch = item.localboxElementDto.localboxName.toLowerCase().includes(q);
        const tagMatch = item.contentHashTagElementDtos?.some((t) =>
          t.tagName.toLowerCase().includes(q)
        );
        return titleMatch || bodyMatch || authorMatch || tagMatch;
      });
    }

    // Sort order
    if (sortMode === 'popular') {
      list.sort((a, b) => b.contentLikeCount - a.contentLikeCount);
    } else if (sortMode === 'replies') {
      list.sort((a, b) => b.contentReplyCount - a.contentReplyCount);
    } else {
      // Default: latest / pinned first
      list.sort((a, b) => {
        if (a.isPinnedToTopGroup && !b.isPinnedToTopGroup) return -1;
        if (!a.isPinnedToTopGroup && b.isPinnedToTopGroup) return 1;
        return new Date(b.regDt).getTime() - new Date(a.regDt).getTime();
      });
    }

    return list;
  }, [rawItems, searchKeyword, sortMode]);

  return (
    <div className="w-full bg-[#F8FAFC] min-h-full pb-24 select-none relative">
      {/* 1. 상단 고정 헤더: 행정동 선택기 & 검색 */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#F1F5F9] shadow-2xs">
        <div className="px-4 py-2.5 flex items-center justify-between">
          {/* 동네 선택 버튼 */}
          <button
            type="button"
            onClick={() => setIsHdongModalOpen(true)}
            aria-label="동네 선택"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F8F7] text-[#0F766E] border border-[#CCF0EE] text-[13px] font-extrabold cursor-pointer hover:bg-[#D3F3F0] transition-colors shadow-2xs"
          >
            <MapPin size={15} className="text-[#14B8B0]" />
            <span>{currentHdongItem.name}</span>
            <ChevronDown size={14} className="text-[#14B8B0]" />
          </button>

          <div className="flex items-center gap-1">
            {/* 검색 토글 버튼 */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen((prev) => !prev);
                if (isSearchOpen) setSearchKeyword('');
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isSearchOpen
                  ? 'bg-[#14B8B0] text-white'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
              aria-label="주민소식 검색"
            >
              {isSearchOpen ? <X size={16} /> : <Search size={16} />}
            </button>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0EA5E9] bg-sky-50 px-2 py-1 rounded-md">
              <Sparkles size={11} />
              <span>주민소식</span>
            </span>
          </div>
        </div>

        {/* 실시간 검색창 (토글 시 노출) */}
        {isSearchOpen && (
          <div className="px-4 pb-2.5 pt-0">
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-[#94A3B8] pointer-events-none"
              />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={`${currentHdongItem.name} 소식, 행사, 강좌 검색...`}
                className="w-full pl-8 pr-8 py-1.5 bg-[#F1F5F9] rounded-xl text-[12px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8B0] transition-all"
                autoFocus
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2.5 p-0.5 text-[#94A3B8] hover:text-[#475569]"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 온닫이 톤앤매너 상단 안내 배너 */}
        <div className="bg-[#E8F8F7]/60 border-t border-[#CCF0EE]/60 px-4 py-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px] font-extrabold text-white px-1.5 py-0.2 rounded-full bg-[#14B8B0] shrink-0">
              안내
            </span>
            <span className="truncate text-[#334155] font-medium">
              {currentHdongItem.name} 주민센터와 이웃들이 전하는 실시간 소식입니다.
            </span>
          </div>
          <span className="text-[#14B8B0] font-bold text-[10px] shrink-0 ml-2">
            실시간 연동
          </span>
        </div>

        {/* 2. 필터 칩 바 (관심분야, 대상, 연령대) */}
        <FilterChipBar
          filters={filters}
          onSetInterestFilters={setInterestFilters}
          onSetAgeGroupFilters={setAgeGroupFilters}
          onSetTargetGroupFilters={setTargetGroupFilters}
          onResetAllFilters={resetAllFilters}
        />

        {/* 3. 소식 건수 & 정렬 바 */}
        <div className="px-4 py-2 flex items-center justify-between border-t border-[#F8FAFC] text-[12px] text-[#64748B] bg-white">
          <div className="font-semibold text-[#334155]">
            총 <span className="text-[#14B8B0] font-black">{processedItems.length}</span>건의 주민소식
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setSortMode('latest')}
              className={`font-medium transition-colors cursor-pointer ${
                sortMode === 'latest' ? 'text-[#14B8B0] font-bold' : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              최신순
            </button>
            <span className="text-[#CBD5E1]">·</span>
            <button
              type="button"
              onClick={() => setSortMode('popular')}
              className={`font-medium transition-colors cursor-pointer ${
                sortMode === 'popular' ? 'text-[#14B8B0] font-bold' : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              인기순
            </button>
            <span className="text-[#CBD5E1]">·</span>
            <button
              type="button"
              onClick={() => setSortMode('replies')}
              className={`font-medium transition-colors cursor-pointer ${
                sortMode === 'replies' ? 'text-[#14B8B0] font-bold' : 'text-[#64748B] hover:text-[#334155]'
              }`}
            >
              댓글순
            </button>
          </div>
        </div>
      </div>

      {/* 4. 주민소식 리스트 영역 */}
      <div>
        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="p-4 flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3.5 animate-pulse flex items-start gap-3 border border-[#E2E8F0]"
              >
                <div className="flex-1 space-y-2">
                  <div className="w-16 h-3 bg-gray-200 rounded" />
                  <div className="w-4/5 h-4 bg-gray-200 rounded" />
                  <div className="w-full h-3 bg-gray-100 rounded" />
                  <div className="w-1/3 h-3 bg-gray-100 rounded" />
                </div>
                <div className="w-[76px] h-[76px] bg-gray-200 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* 에러 상태 */}
        {isError && (
          <div className="py-16 text-center flex flex-col items-center justify-center px-4">
            <AlertCircle size={36} className="text-[#EF4444] mb-3" />
            <p className="text-[14px] font-medium text-[#1E293B] mb-2">
              주민소식을 불러오는 중 오류가 발생했습니다.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-lg bg-[#14B8B0] text-white text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw size={14} />
              <span>다시 시도</span>
            </button>
          </div>
        )}

        {/* 데이터 없음 (Empty State) */}
        {!isLoading && !isError && processedItems.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center px-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F8F7] text-[#14B8B0] flex items-center justify-center text-2xl mx-auto mb-3">
              📰
            </div>
            <h3 className="text-[16px] font-bold text-[#1E293B] mb-1">
              선택한 조건의 주민소식이 없습니다
            </h3>
            <p className="text-[13px] text-[#64748B] mb-5">
              {searchKeyword
                ? `'${searchKeyword}' 검색 결과를 찾을 수 없습니다.`
                : '필터 조건을 변경하거나 초기화해보세요.'}
            </p>
            {isAnyFilterActive || searchKeyword ? (
              <button
                type="button"
                onClick={() => {
                  resetAllFilters();
                  setSearchKeyword('');
                }}
                className="px-4 py-2 rounded-full border border-[#14B8B0] text-[#14B8B0] text-[13px] font-semibold bg-white hover:bg-[#E8F8F7] transition-colors cursor-pointer"
              >
                검색 및 필터 초기화
              </button>
            ) : null}
          </div>
        )}

        {/* 온닫이 톤앤매너 리스트 화면 렌더링 */}
        {!isLoading && !isError && processedItems.length > 0 && (
          <div className="divide-y divide-[#F1F5F9] bg-white">
            {processedItems.map((content) => (
              <ResidentNewsListItem
                key={content.contentId}
                content={content}
                onNavigateToDetail={onNavigateToDetail}
                onNavigateToLocalbox={onNavigateToLocalbox}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
                onShare={onShare}
                onMoreMenu={(item) =>
                  showToast(`'${item.contentTitle.slice(0, 10)}...' 옵션 메뉴`)
                }
              />
            ))}
          </div>
        )}

        {/* 무한스크롤 감지 센티널 */}
        <div ref={sentinelRef} className="h-6 w-full flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-[12px] text-[#94A3B8]">
              <div className="w-3.5 h-3.5 border-2 border-[#14B8B0] border-t-transparent rounded-full animate-spin" />
              <span>소식을 더 불러오는 중...</span>
            </div>
          )}
        </div>

        {/* 목록 끝 도달 안내 */}
        {!hasNextPage && processedItems.length > 0 && (
          <div className="text-center py-6 text-[12px] text-[#94A3B8]">
            {currentHdongItem.name}의 모든 주민소식을 확인했습니다.
          </div>
        )}
      </div>

      {/* 5. 플로팅 글쓰기 버튼 (FAB) */}
      <div className="fixed bottom-20 right-4 z-30 max-w-[430px]">
        <button
          type="button"
          onClick={() =>
            showToast(`'${currentHdongItem.name}' 주민소식 등록 화면을 엽니다.`)
          }
          className="flex items-center gap-2 px-4 py-3 bg-[#14B8B0] text-white rounded-full shadow-lg hover:bg-[#0EA5E9] active:scale-95 transition-all cursor-pointer font-bold text-[13px]"
          aria-label={`${currentHdongItem.name} 소식 등록`}
        >
          <PenSquare size={17} />
          <span>{currentHdongItem.name} 소식 쓰기</span>
        </button>
      </div>

      {/* 행정동 선택 모달 */}
      <HdongSelectorModal
        isOpen={isHdongModalOpen}
        selectedCode={filters.hdongCodeValue}
        onSelect={handleSelectHdong}
        onClose={() => setIsHdongModalOpen(false)}
      />

      {/* 내부 토스트 */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B]/90 text-white text-[12px] font-medium px-4 py-2 rounded-full shadow-md backdrop-blur-xs transition-all pointer-events-none">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
