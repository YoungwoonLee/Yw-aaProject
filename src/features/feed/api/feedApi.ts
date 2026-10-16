import { FeedResponse, FeedDetailContent, BannerItem } from '../../../types/content';
import {
  mockFetchVillageNewsLatest,
  mockFetchBanners,
  mockFetchContentDetail,
  mockToggleContentLike,
  mockToggleContentBookmark,
} from '../../../mocks/handlers';

export const feedKeys = {
  all: ['village-news'] as const,
  latest: () => [...feedKeys.all, 'latest'] as const,
  detail: (id: number) => [...feedKeys.all, 'detail', id] as const,
  banners: () => ['banners'] as const,
};

/**
 * POST /api/content/village-news/search/latest
 */
export async function fetchVillageNewsLatest(params: {
  size?: number;
  lastSearchSort?: string[];
}): Promise<FeedResponse> {
  // 실제 네트워크 지연 시뮬레이션 (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockFetchVillageNewsLatest(params);
}

/**
 * GET /api/banner
 */
export async function fetchBanners(): Promise<BannerItem[]> {
  return mockFetchBanners();
}

/**
 * GET /api/content/{contentId}
 * TODO(확인필요): 실제 상세 엔드포인트 경로 명세 확인 필요
 */
export async function fetchContentDetail(
  contentId: number
): Promise<FeedDetailContent | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockFetchContentDetail(contentId);
}

/**
 * POST /api/content/{contentId}/like
 */
export async function toggleContentLike(contentId: number) {
  return mockToggleContentLike(contentId);
}

/**
 * POST /api/content/{contentId}/bookmark
 */
export async function toggleContentBookmark(contentId: number) {
  return mockToggleContentBookmark(contentId);
}
