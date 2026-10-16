import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeedCard } from './FeedCard';
import { FeedContent } from '../../../types/content';

const mockFeed: FeedContent = {
  contentId: 999,
  contentType: 'VILLAGE_NEWS',
  contentTitle: '도봉산 단풍 소식',
  contentBodyText: '오늘 도봉산 단풍이 정말 곱게 물들었습니다.',
  contentLikeCount: 10,
  contentReplyCount: 2,
  contentLikeYn: false,
  contentBookmarkYn: false,
  viewCount: 150,
  regDt: '2026-10-11 06:00:00',
  isPinnedToTopGroup: false,
  contentDisplayRateCityName: '서울 도봉구',
  contentDisplayRateDongName: '도봉동',
  contentDisplayRateDongs: [{ dongName: '도봉동', percentage: 100 }],
  contentHashTagElementDtos: [],
  contentFileElementDtos: [
    {
      contentFileUrl: 'https://cdn.ondaji.com/sample.jpg',
      contentFileType: 'IMG_FILE',
      displayOrder: 1,
      width: 800,
      height: 600,
    },
  ],
  localboxElementDto: {
    localboxId: 10,
    localboxName: '도봉 산사랑',
    localboxProfileImgUrl: 'https://cdn.ondaji.com/avatar.jpg',
    memberShipStatus: 'REGULAR',
    localboxMyTownName: '도봉구',
    localboxMyTownCodeValue: '11320',
    localboxCreatorType: 'LOCALBOX_RESIDENT',
  },
};

describe('FeedCard', () => {
  it('renders author info, city name, title and body text', () => {
    const onNavigateToDetail = vi.fn();
    const onNavigateToLocalbox = vi.fn();
    const onOpenMoreMenu = vi.fn();
    const onToggleLike = vi.fn();
    const onToggleBookmark = vi.fn();
    const onShare = vi.fn();

    render(
      <FeedCard
        feed={mockFeed}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToLocalbox={onNavigateToLocalbox}
        onOpenMoreMenu={onOpenMoreMenu}
        onToggleLike={onToggleLike}
        onToggleBookmark={onToggleBookmark}
        onShare={onShare}
      />
    );

    expect(screen.getByText('도봉 산사랑')).toBeDefined();
    expect(screen.getByText('서울 도봉구')).toBeDefined();
    expect(screen.getByText('도봉산 단풍 소식')).toBeDefined();
    expect(screen.getByText('오늘 도봉산 단풍이 정말 곱게 물들었습니다.')).toBeDefined();
  });

  it('triggers onToggleLike when like button is clicked', () => {
    const onToggleLike = vi.fn();

    render(
      <FeedCard
        feed={mockFeed}
        onNavigateToDetail={vi.fn()}
        onNavigateToLocalbox={vi.fn()}
        onOpenMoreMenu={vi.fn()}
        onToggleLike={onToggleLike}
        onToggleBookmark={vi.fn()}
        onShare={vi.fn()}
      />
    );

    const likeButton = screen.getByLabelText('좋아요 10개');
    fireEvent.click(likeButton);

    expect(onToggleLike).toHaveBeenCalledWith(999, false, 10);
  });

  it('triggers onNavigateToDetail when title area is clicked', () => {
    const onNavigateToDetail = vi.fn();

    render(
      <FeedCard
        feed={mockFeed}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToLocalbox={vi.fn()}
        onOpenMoreMenu={vi.fn()}
        onToggleLike={vi.fn()}
        onToggleBookmark={vi.fn()}
        onShare={vi.fn()}
      />
    );

    const titleEl = screen.getByText('도봉산 단풍 소식');
    fireEvent.click(titleEl);

    expect(onNavigateToDetail).toHaveBeenCalledWith(999);
  });

  it('triggers onNavigateToLocalbox when author profile is clicked', () => {
    const onNavigateToLocalbox = vi.fn();

    render(
      <FeedCard
        feed={mockFeed}
        onNavigateToDetail={vi.fn()}
        onNavigateToLocalbox={onNavigateToLocalbox}
        onOpenMoreMenu={vi.fn()}
        onToggleLike={vi.fn()}
        onToggleBookmark={vi.fn()}
        onShare={vi.fn()}
      />
    );

    const authorBtn = screen.getByLabelText('도봉 산사랑 로컬박스 프로필 보기');
    fireEvent.click(authorBtn);

    expect(onNavigateToLocalbox).toHaveBeenCalledWith(10);
  });

  it('renders top 3 contentDisplayRateDongs in regional variant', () => {
    const regionalFeed: FeedContent = {
      ...mockFeed,
      regDt: '2026-03-08 10:00:00',
      contentDisplayRateDongs: [
        { dongName: '금광동', percentage: 50 },
        { dongName: '상대원동', percentage: 29 },
        { dongName: '은행동', percentage: 20 },
        { dongName: '단대동', percentage: 1 },
      ],
    };

    render(
      <FeedCard
        feed={regionalFeed}
        variant="regional"
        onNavigateToDetail={vi.fn()}
        onNavigateToLocalbox={vi.fn()}
        onOpenMoreMenu={vi.fn()}
        onToggleLike={vi.fn()}
        onToggleBookmark={vi.fn()}
        onShare={vi.fn()}
      />
    );

    expect(screen.getByTestId('regional-dong-rates').textContent).toBe(
      '금광동 50% 상대원동 29% 은행동 20%'
    );
    expect(screen.getByTestId('feed-card-date').textContent).toBe('03.08');
  });
});

