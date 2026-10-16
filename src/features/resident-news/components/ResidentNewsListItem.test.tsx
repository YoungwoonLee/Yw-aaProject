import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResidentNewsListItem } from './ResidentNewsListItem';
import { ResidentNewsContent } from '../../../types/resident';

const mockResidentContent: ResidentNewsContent = {
  contentId: 501,
  contentType: 'RESIDENT_NEWS',
  contentTitle: '생연1동 주민자치프로그램 수강생 모집',
  contentBodyText: '가을학기 문화강좌 서예, 캘리그라피, 요가 수강생을 모집합니다.',
  contentLikeCount: 15,
  contentReplyCount: 4,
  contentLikeYn: false,
  contentBookmarkYn: false,
  viewCount: 300,
  regDt: '2026-10-11 09:00:00',
  isPinnedToTopGroup: true,
  pinTabTypes: ['RESIDENT_NEWS'],
  postedYn: true,
  eventStartDate: '2026-10-10',
  eventEndDate: '2026-10-20',
  contentHashTagElementDtos: [
    { hashTagId: 1, tagName: '문화강좌', orderNum: 1 },
  ],
  contentFileElementDtos: [
    {
      contentFileUrl: 'https://cdn.ondaji.com/test.jpg',
      contentFileType: 'IMG_FILE',
      displayOrder: 1,
      width: 800,
      height: 600,
    },
  ],
  localboxElementDto: {
    localboxId: 99,
    localboxName: '생연1동 주민자치회',
    localboxProfileImgUrl: null,
    memberShipStatus: 'REGULAR',
    localboxMyTownName: '생연1동',
    localboxMyTownCodeValue: '4125051000',
    isUserFollowingMe: false,
    isUserFollowedByMe: false,
    localboxCreatorType: 'LOCALBOX_COMMUNITY',
  },
};

describe('ResidentNewsListItem', () => {
  it('renders title, localbox name, pinned badge, and event badge', () => {
    const onNavigateToDetail = vi.fn();
    const onToggleLike = vi.fn();
    const onToggleBookmark = vi.fn();
    const onShare = vi.fn();

    render(
      <ResidentNewsListItem
        content={mockResidentContent}
        onNavigateToDetail={onNavigateToDetail}
        onToggleLike={onToggleLike}
        onToggleBookmark={onToggleBookmark}
        onShare={onShare}
      />
    );

    expect(screen.getByText('생연1동 주민자치프로그램 수강생 모집')).toBeDefined();
    expect(screen.getByText('생연1동 주민자치회')).toBeDefined();
    expect(screen.getByText('고정')).toBeDefined();
    expect(screen.getByText('진행중')).toBeDefined();
    expect(screen.getByText('#문화강좌')).toBeDefined();
  });

  it('triggers onNavigateToDetail when item is clicked', () => {
    const onNavigateToDetail = vi.fn();
    const onToggleLike = vi.fn();
    const onToggleBookmark = vi.fn();
    const onShare = vi.fn();

    render(
      <ResidentNewsListItem
        content={mockResidentContent}
        onNavigateToDetail={onNavigateToDetail}
        onToggleLike={onToggleLike}
        onToggleBookmark={onToggleBookmark}
        onShare={onShare}
      />
    );

    fireEvent.click(screen.getByText('생연1동 주민자치프로그램 수강생 모집'));
    expect(onNavigateToDetail).toHaveBeenCalledWith(501);
  });

  it('triggers onToggleLike when like button is clicked without triggering detail', () => {
    const onNavigateToDetail = vi.fn();
    const onToggleLike = vi.fn();
    const onToggleBookmark = vi.fn();
    const onShare = vi.fn();

    render(
      <ResidentNewsListItem
        content={mockResidentContent}
        onNavigateToDetail={onNavigateToDetail}
        onToggleLike={onToggleLike}
        onToggleBookmark={onToggleBookmark}
        onShare={onShare}
      />
    );

    const likeBtn = screen.getByLabelText('좋아요 15개');
    fireEvent.click(likeBtn);

    expect(onToggleLike).toHaveBeenCalledWith(501);
    expect(onNavigateToDetail).not.toHaveBeenCalled();
  });
});
