import { MOCK_FEED_CONTENTS, MOCK_BANNERS } from './fixtures';
import { MOCK_REGIONAL_FEEDS } from '../features/local-tab/mocks/localFixtures';
import { FeedContent, FeedDetailContent, FeedResponse, BannerItem } from '../types/content';

const STORAGE_KEY_FEEDS = 'ondaji_v3_all_feeds';

// Local storage synced feed state (Home + Regional)
export function getStoredFeeds(): FeedDetailContent[] {
  const defaultAll: FeedDetailContent[] = [
    ...MOCK_FEED_CONTENTS,
    ...MOCK_REGIONAL_FEEDS,
  ];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FEEDS);
    if (raw) {
      const parsed = JSON.parse(raw) as FeedDetailContent[];
      if (Array.isArray(parsed) && parsed.length >= defaultAll.length) {
        return parsed;
      }
    }
  } catch {}
  return defaultAll;
}

export function saveStoredFeeds(feeds: FeedDetailContent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FEEDS, JSON.stringify(feeds));
  } catch {}
}

/**
 * POST /api/content/village-news/search/latest
 * 커서 기반 (search_after) 페이지네이션 시뮬레이션
 */
export async function mockFetchVillageNewsLatest(params: {
  size?: number;
  lastSearchSort?: string[];
}): Promise<FeedResponse> {
  const size = params.size || 10;
  const lastSearchSort = params.lastSearchSort;
  const homeIds = new Set(MOCK_FEED_CONTENTS.map((f) => f.contentId));
  const allFeeds = getStoredFeeds().filter((f) => homeIds.has(f.contentId));

  // 정렬: isPinnedToTopGroup 우선, 이후 contentId 역순
  const sortedFeeds = [...allFeeds].sort((a, b) => {
    if (a.isPinnedToTopGroup !== b.isPinnedToTopGroup) {
      return a.isPinnedToTopGroup ? -1 : 1;
    }
    return b.contentId - a.contentId;
  });

  let startIndex = 0;
  if (lastSearchSort && lastSearchSort.length > 0) {
    const cursorId = Number(lastSearchSort[1] || lastSearchSort[0]);
    const foundIndex = sortedFeeds.findIndex((item) => item.contentId === cursorId);
    if (foundIndex !== -1) {
      startIndex = foundIndex + 1;
    }
  }

  const pagedItems = sortedFeeds.slice(startIndex, startIndex + size);
  const isLastPage = startIndex + size >= sortedFeeds.length;

  let nextSort: string[] = [];
  if (!isLastPage && pagedItems.length > 0) {
    const lastItem = pagedItems[pagedItems.length - 1];
    nextSort = [lastItem.isPinnedToTopGroup ? '1' : '0', String(lastItem.contentId)];
  }

  return {
    message: 'SUCCESS',
    result: {
      content: pagedItems,
      lastSearchSort: nextSort,
    },
  };
}

/**
 * GET /api/banner
 */
export async function mockFetchBanners(): Promise<BannerItem[]> {
  return MOCK_BANNERS;
}

/**
 * GET /api/content/{contentId}
 * TODO(확인필요): 실제 상세 API 경로 및 파라미터 확인 필요
 */
export async function mockFetchContentDetail(
  contentId: number
): Promise<FeedDetailContent | null> {
  const feeds = getStoredFeeds();
  const found = feeds.find((f) => f.contentId === contentId);
  return found || null;
}

/**
 * POST /api/content/{contentId}/like (토글)
 */
export async function mockToggleContentLike(contentId: number): Promise<{
  contentLikeYn: boolean;
  contentLikeCount: number;
}> {
  const feeds = getStoredFeeds();
  let updatedLikeYn = false;
  let updatedCount = 0;

  const nextFeeds = feeds.map((item) => {
    if (item.contentId === contentId) {
      updatedLikeYn = !item.contentLikeYn;
      updatedCount = updatedLikeYn
        ? item.contentLikeCount + 1
        : Math.max(0, item.contentLikeCount - 1);
      return {
        ...item,
        contentLikeYn: updatedLikeYn,
        contentLikeCount: updatedCount,
      };
    }
    return item;
  });

  saveStoredFeeds(nextFeeds);
  return { contentLikeYn: updatedLikeYn, contentLikeCount: updatedCount };
}

/**
 * POST /api/content/{contentId}/bookmark (토글)
 */
export async function mockToggleContentBookmark(contentId: number): Promise<{
  contentBookmarkYn: boolean;
}> {
  const feeds = getStoredFeeds();
  let updatedBookmarkYn = false;

  const nextFeeds = feeds.map((item) => {
    if (item.contentId === contentId) {
      updatedBookmarkYn = !item.contentBookmarkYn;
      return {
        ...item,
        contentBookmarkYn: updatedBookmarkYn,
      };
    }
    return item;
  });

  saveStoredFeeds(nextFeeds);
  return { contentBookmarkYn: updatedBookmarkYn };
}
