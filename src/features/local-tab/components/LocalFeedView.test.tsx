import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalFeedView } from './LocalFeedView';
import { TownPicker } from './TownPicker';
import {
  DEFAULT_SELECTED_TOWN,
  useLocalTabStore,
} from '../store/useLocalTabStore';
import { fetchRegionalVillageNews } from '../api/localApi';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe('LocalFeedView & TownPicker (REGIONAL Tab)', () => {
  beforeEach(() => {
    useLocalTabStore.setState({
      feedMode: 'REGIONAL',
      selectedTown: DEFAULT_SELECTED_TOWN,
      myTown: DEFAULT_SELECTED_TOWN,
      readContentIds: [],
      isLoggedIn: true,
    });
  });

  it('renders regional feed cards with top 3 dong exposure percentages and regional date format', async () => {
    const queryClient = createTestQueryClient();
    const onNavigateToDetail = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <LocalFeedView
          selectedTown={DEFAULT_SELECTED_TOWN}
          onNavigateToDetail={onNavigateToDetail}
          onNavigateToLocalbox={vi.fn()}
          onShare={vi.fn()}
          onMoreMenu={vi.fn()}
          onRequireLogin={vi.fn()}
        />
      </QueryClientProvider>
    );

    // Wait for regional feed items to load
    await waitFor(() => {
      expect(
        screen.getByText('금광동 신구대 식물원 앞 가을 산책로 단풍 소식')
      ).toBeDefined();
    });

    // Top 3 dong display rates: 금광동 50% 상대원동 29% 은행동 20%
    const rateLabels = screen.getAllByTestId('regional-dong-rates');
    expect(rateLabels[0].textContent).toBe('금광동 50% 상대원동 29% 은행동 20%');

    // Clicking a card adds its contentId (7625) to readContentIds
    fireEvent.click(
      screen.getByText('금광동 신구대 식물원 앞 가을 산책로 단풍 소식')
    );
    expect(onNavigateToDetail).toHaveBeenCalledWith(7625, undefined);
    expect(useLocalTabStore.getState().readContentIds).toContain(7625);
  });

  it('pushes read contentIds to the back on subsequent regional feed search', async () => {
    const firstResp = await fetchRegionalVillageNews({
      displayLatitude: DEFAULT_SELECTED_TOWN.centerLatitude,
      displayLongitude: DEFAULT_SELECTED_TOWN.centerLongitude,
      readContentIds: [],
      size: 12,
      lastSearchSort: null,
    });

    const firstId = firstResp.result.content[0].contentId;
    expect(firstId).toBe(7625);

    // Now request with 7625 in readContentIds
    const secondResp = await fetchRegionalVillageNews({
      displayLatitude: DEFAULT_SELECTED_TOWN.centerLatitude,
      displayLongitude: DEFAULT_SELECTED_TOWN.centerLongitude,
      readContentIds: [7625],
      size: 12,
      lastSearchSort: null,
    });

    // 7625 should no longer be the first item
    expect(secondResp.result.content[0].contentId).not.toBe(7625);
  });

  it('renders TownPicker polygons/labels and confirms town selection immediately when a neighbor town is clicked', async () => {
    const queryClient = createTestQueryClient();
    const onSelectTown = vi.fn();
    const onClose = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <TownPicker
          isOpen={true}
          selectedTown={DEFAULT_SELECTED_TOWN}
          myTown={DEFAULT_SELECTED_TOWN}
          onSelectTown={onSelectTown}
          onClose={onClose}
        />
      </QueryClientProvider>
    );

    // Bottom sheet elements
    expect(screen.getByText('현재 위치로 설정')).toBeDefined();
    expect(
      screen.getByText('앱을 다시 실행하면, 현재 위치한 동네로 자동 설정됩니다.')
    ).toBeDefined();
    expect(screen.getByText('경기도 성남시 중원구 금광동')).toBeDefined();

    // Wait for by-coordinates polygons and markers to render on SvgMapAdapter
    await waitFor(() => {
      expect(screen.getByTestId('map-marker-금광동')).toBeDefined();
      expect(screen.getByTestId('map-marker-은행동')).toBeDefined();
    });

    // Click neighbor town pill label '은행동' -> immediately selects and closes
    fireEvent.click(screen.getByTestId('map-marker-은행동'));

    await waitFor(() => {
      expect(onSelectTown).toHaveBeenCalledWith(
        expect.objectContaining({
          areaName: '은행동',
          areaFullName: '경기도 성남시 중원구 은행동',
        })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });
});
