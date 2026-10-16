import {
  ResidentNewsSearchRequest,
  ResidentNewsResponse,
  ResidentNewsContent,
} from '../../../types/resident';
import { MOCK_RESIDENT_NEWS_CONTENTS } from '../../../mocks/residentFixtures';

const STORAGE_KEY_RESIDENTS = 'ondaji_v2_resident_news';

function getStoredResidents(): ResidentNewsContent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESIDENTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return MOCK_RESIDENT_NEWS_CONTENTS;
}

function saveStoredResidents(items: ResidentNewsContent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RESIDENTS, JSON.stringify(items));
  } catch {}
}

export const residentNewsKeys = {
  all: ['resident-news'] as const,
  list: (params: Omit<ResidentNewsSearchRequest, 'lastSearchSort' | 'size'>) =>
    [...residentNewsKeys.all, 'list', params] as const,
  detail: (id: number) => [...residentNewsKeys.all, 'detail', id] as const,
};

/**
 * POST /api/content/resident-news/search
 */
export async function fetchResidentNews(
  params: ResidentNewsSearchRequest
): Promise<ResidentNewsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const all = getStoredResidents();
  const { size = 12, hdongCodeValue, interests, ageGroups, targetGroups, lastSearchSort } = params;

  // 1. 필터링
  let filtered = all.filter((item) => {
    // 행정동 필터
    if (hdongCodeValue && hdongCodeValue !== 'all') {
      if (item.localboxElementDto.localboxMyTownCodeValue !== hdongCodeValue) {
        return false;
      }
    }

    // 관심분야 필터
    if (interests && interests.length > 0 && !interests.includes('전체')) {
      const tags = item.contentHashTagElementDtos.map((t) => t.tagName);
      const match = interests.some((interest) =>
        tags.includes(interest) || item.contentTitle.includes(interest) || item.contentBodyText.includes(interest)
      );
      if (!match) return false;
    }

    // 대상 필터
    if (ageGroups && ageGroups.length > 0 && !ageGroups.includes('전체')) {
      const tags = item.contentHashTagElementDtos.map((t) => t.tagName);
      const match = ageGroups.some((ag) =>
        tags.includes(ag) || item.contentTitle.includes(ag) || item.contentBodyText.includes(ag)
      );
      if (!match) return false;
    }

    // 특성 필터
    if (targetGroups && targetGroups.length > 0 && !targetGroups.includes('전체')) {
      const tags = item.contentHashTagElementDtos.map((t) => t.tagName);
      const match = targetGroups.some((tg) =>
        tags.includes(tg) || item.contentTitle.includes(tg) || item.contentBodyText.includes(tg)
      );
      if (!match) return false;
    }

    return true;
  });

  // 2. 정렬: 고정글 우선, 그 외 contentId 역순
  filtered.sort((a, b) => {
    if (a.isPinnedToTopGroup !== b.isPinnedToTopGroup) {
      return a.isPinnedToTopGroup ? -1 : 1;
    }
    return b.contentId - a.contentId;
  });

  // 3. 커서 페이지네이션
  let startIndex = 0;
  if (lastSearchSort && lastSearchSort.length > 0) {
    const cursorId = Number(lastSearchSort[1] || lastSearchSort[0]);
    const foundIdx = filtered.findIndex((item) => item.contentId === cursorId);
    if (foundIdx !== -1) {
      startIndex = foundIdx + 1;
    }
  }

  const pagedItems = filtered.slice(startIndex, startIndex + size);
  const isLast = startIndex + size >= filtered.length;

  let nextSort: string[] | null = null;
  if (!isLast && pagedItems.length > 0) {
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
 * GET /api/content/{contentId}
 * TODO(확인필요): 실제 상세 엔드포인트 명세 확인 필요
 */
export async function fetchResidentNewsDetail(
  contentId: number
): Promise<ResidentNewsContent | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const all = getStoredResidents();
  return all.find((item) => item.contentId === contentId) || null;
}

/**
 * POST /api/content/{contentId}/like
 */
export async function toggleResidentNewsLike(contentId: number): Promise<{
  contentLikeYn: boolean;
  contentLikeCount: number;
}> {
  const all = getStoredResidents();
  let updatedYn = false;
  let updatedCount = 0;

  const next = all.map((item) => {
    if (item.contentId === contentId) {
      updatedYn = !item.contentLikeYn;
      updatedCount = updatedYn
        ? item.contentLikeCount + 1
        : Math.max(0, item.contentLikeCount - 1);
      return {
        ...item,
        contentLikeYn: updatedYn,
        contentLikeCount: updatedCount,
      };
    }
    return item;
  });

  saveStoredResidents(next);
  return { contentLikeYn: updatedYn, contentLikeCount: updatedCount };
}

/**
 * POST /api/content/{contentId}/bookmark
 */
export async function toggleResidentNewsBookmark(contentId: number): Promise<{
  contentBookmarkYn: boolean;
}> {
  const all = getStoredResidents();
  let updatedYn = false;

  const next = all.map((item) => {
    if (item.contentId === contentId) {
      updatedYn = !item.contentBookmarkYn;
      return {
        ...item,
        contentBookmarkYn: updatedYn,
      };
    }
    return item;
  });

  saveStoredResidents(next);
  return { contentBookmarkYn: updatedYn };
}

/**
 * POST /api/localbox/{localboxId}/follow
 */
export async function toggleResidentLocalboxFollow(localboxId: number): Promise<{
  isUserFollowedByMe: boolean;
}> {
  const all = getStoredResidents();
  let followed = false;

  const next = all.map((item) => {
    if (item.localboxElementDto.localboxId === localboxId) {
      followed = !item.localboxElementDto.isUserFollowedByMe;
      return {
        ...item,
        localboxElementDto: {
          ...item.localboxElementDto,
          isUserFollowedByMe: followed,
        },
      };
    }
    return item;
  });

  saveStoredResidents(next);
  return { isUserFollowedByMe: followed };
}
