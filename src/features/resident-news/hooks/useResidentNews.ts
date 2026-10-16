import { useInfiniteQuery } from '@tanstack/react-query';
import { residentNewsKeys, fetchResidentNews } from '../api/residentNewsApi';
import { ResidentNewsResponse } from '../../../types/resident';
import { ResidentFilterState } from './useResidentFilters';

const PAGE_SIZE = 12;

export function useResidentNews(filters: ResidentFilterState) {
  return useInfiniteQuery<ResidentNewsResponse, Error>({
    queryKey: residentNewsKeys.list(filters),
    initialPageParam: null as string[] | null,
    queryFn: async ({ pageParam }) => {
      const lastSearchSort = pageParam as string[] | null;
      return fetchResidentNews({
        size: PAGE_SIZE,
        hdongCodeValue: filters.hdongCodeValue,
        interests: filters.interests,
        ageGroups: filters.ageGroups,
        targetGroups: filters.targetGroups,
        lastSearchSort,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextSort = lastPage.result.lastSearchSort;
      if (!nextSort || nextSort.length === 0) {
        return null;
      }
      return nextSort;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
