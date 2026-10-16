import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import {
  asBeopjungdongCode,
  FeedMode,
  SelectedTownState,
} from '../../../types/local';

export const DEFAULT_SELECTED_TOWN: SelectedTownState = {
  codeValue: asBeopjungdongCode('4113310300'),
  areaName: '금광동',
  areaFullName: '경기도 성남시 중원구 금광동',
  centerLatitude: 37.4465,
  centerLongitude: 127.1678,
};

/**
 * 안전한 localStorage 어댑터 (try/catch 감싸기)
 */
const safeLocalStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // 시크릿 모드 또는 스토리지 용량 초과 시 무시
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // 무시
    }
  },
};

export interface LocalTabStoreState {
  feedMode: FeedMode;
  selectedTown: SelectedTownState;
  myTown: SelectedTownState;
  readContentIds: number[];
  isLoggedIn: boolean;
  setFeedMode: (mode: FeedMode) => void;
  setSelectedTown: (town: SelectedTownState) => void;
  setMyTown: (town: SelectedTownState) => void;
  markContentAsRead: (contentId: number) => void;
  setReadContentIds: (ids: number[]) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

export const useLocalTabStore = create<LocalTabStoreState>()(
  persist(
    (set) => ({
      feedMode: 'LATEST',
      selectedTown: DEFAULT_SELECTED_TOWN,
      myTown: DEFAULT_SELECTED_TOWN,
      readContentIds: [],
      isLoggedIn: true,
      setFeedMode: (mode) => set({ feedMode: mode }),
      setSelectedTown: (town) => set({ selectedTown: town }),
      setMyTown: (town) => set({ myTown: town, selectedTown: town }),
      markContentAsRead: (contentId) =>
        set((state) => {
          if (state.readContentIds.includes(contentId)) {
            return state;
          }
          // TODO(확인필요): 읽은 글 서버 기록 API (예: POST /api/content/read-history) 명세 확인 필요
          return {
            readContentIds: [...state.readContentIds, contentId],
          };
        }),
      setReadContentIds: (ids) => set({ readContentIds: ids }),
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
    }),
    {
      name: 'ondaji_local_tab_store_v1',
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
