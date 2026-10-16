import { useInfiniteQuery } from '@tanstack/react-query';
import { feedKeys, fetchVillageNewsLatest } from '../api/feedApi';
import { FeedResponse } from '../../../types/content';

const PAGE_SIZE = 10;

export function useHomeFeed() {
  return useInfiniteQuery<FeedResponse, Error>({
    queryKey: feedKeys.latest(),
    initialPageParam: undefined as string[] | undefined,
    queryFn: async ({ pageParam }) => {
      const lastSearchSort = pageParam as string[] | undefined;
      return fetchVillageNewsLatest({
        size: PAGE_SIZE,
        lastSearchSort,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextSort = lastPage.result.lastSearchSort;
      if (!nextSort || nextSort.length === 0) {
        return undefined; // 마지막 페이지
      }
      return nextSort;
    },
    staleTime: 1000 * 60 * 5, // 5분 캐시 유지 (상세에서 뒤로가기 시 복원)
    gcTime: 1000 * 60 * 30,
  });
}
