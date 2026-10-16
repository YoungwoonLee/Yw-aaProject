import { useState, useMemo } from 'react';
import { MOCK_FEED_CONTENTS } from '../../../mocks/fixtures';
import { FeedContent } from '../../../types/content';
import { SortMode } from '../components/LocalCategoryTabs';

interface UseLocalFeedsParams {
  selectedTown: string;
  selectedCategory: string;
  sortMode: SortMode;
  searchKeyword?: string;
}

export function useLocalFeeds({
  selectedTown,
  selectedCategory,
  sortMode,
  searchKeyword = '',
}: UseLocalFeedsParams) {
  const [isLoading, setIsLoading] = useState(false);

  const feeds = useMemo(() => {
    // 1. Filter by town
    let list = MOCK_FEED_CONTENTS.filter((item) => {
      const matchDong = item.contentDisplayRateDongName === selectedTown;
      const matchInDongs = item.contentDisplayRateDongs.some(
        (d) => d.dongName === selectedTown
      );
      return matchDong || matchInDongs;
    });

    // If matching feeds are scarce (e.g. newly selected town), include neighboring/all feeds with current town context
    if (list.length < 3) {
      const remaining = MOCK_FEED_CONTENTS.filter(
        (item) => !list.some((l) => l.contentId === item.contentId)
      );
      list = [...list, ...remaining];
    }

    // 2. Filter by searchKeyword (if provided)
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

    // 3. Filter by Category
    if (selectedCategory !== 'ALL') {
      list = list.filter((item) => {
        if (selectedCategory === 'STORY') {
          return (
            item.contentHashTagElementDtos.some((t) =>
              ['골목', '추억', '일상', '기록'].some((k) => t.tagName.includes(k))
            ) ||
            item.contentBodyText.includes('골목') ||
            item.contentTitle.includes('골목')
          );
        }
        if (selectedCategory === 'STORE') {
          return (
            item.contentHashTagElementDtos.some((t) =>
              ['빵', '맛집', '문방구', '가게', '정미소'].some((k) =>
                t.tagName.includes(k)
              )
            ) ||
            item.contentTitle.includes('빵') ||
            item.contentTitle.includes('문방구') ||
            item.contentTitle.includes('정미소') ||
            item.contentTitle.includes('맛집')
          );
        }
        if (selectedCategory === 'MEETING') {
          return (
            item.contentHashTagElementDtos.some((t) =>
              ['모임', '플리마켓', '이웃', '나눔', '벼룩시장'].some((k) =>
                t.tagName.includes(k)
              )
            ) ||
            item.contentTitle.includes('나눔') ||
            item.contentTitle.includes('플리마켓')
          );
        }
        if (selectedCategory === 'NATURE') {
          return (
            item.contentHashTagElementDtos.some((t) =>
              ['산책', '은행나무', '물소리', '풍경', '단풍'].some((k) =>
                t.tagName.includes(k)
              )
            ) ||
            item.contentTitle.includes('산책') ||
            item.contentTitle.includes('은행나무') ||
            item.contentTitle.includes('물소리')
          );
        }
        if (selectedCategory === 'NEWS') {
          return item.contentType === 'VILLAGE_NEWS';
        }
        return true;
      });
    }

    // 4. Sort
    const sorted = [...list].sort((a, b) => {
      if (sortMode === 'popular') {
        return b.contentLikeCount - a.contentLikeCount;
      }
      if (sortMode === 'replies') {
        return b.contentReplyCount - a.contentReplyCount;
      }
      // latest
      return b.contentId - a.contentId;
    });

    return sorted;
  }, [selectedTown, selectedCategory, sortMode, searchKeyword]);

  return {
    feeds,
    isLoading,
  };
}
