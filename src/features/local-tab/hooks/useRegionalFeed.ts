import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchRegionalVillageNews,
  localQueryKeys,
} from '../api/localApi';
import {
  RegionalFeedResponse,
  SelectedTownState,
} from '../../../types/local';
import { useLocalTabStore } from '../store/useLocalTabStore';

const REGIONAL_PAGE_SIZE = 12;

export function useRegionalFeed(selectedTown: SelectedTownState) {
  return useInfiniteQuery<RegionalFeedResponse, Error>({
    queryKey: localQueryKeys.regionalFeed(selectedTown.codeValue),
    initialPageParam: null as [string, string] | null,
    queryFn: async ({ pageParam }) => {
      const state = useLocalTabStore.getState();
      const readContentIds = state.isLoggedIn ? state.readContentIds : [];
      const lastSearchSort = (pageParam as [string, string] | null) ?? null;

      return fetchRegionalVillageNews({
        displayLatitude: selectedTown.centerLatitude,
        displayLongitude: selectedTown.centerLongitude,
        readContentIds,
        size: REGIONAL_PAGE_SIZE,
        lastSearchSort,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextSort = lastPage.result.lastSearchSort;
      if (!nextSort) {
        return undefined;
      }
      return nextSort;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
