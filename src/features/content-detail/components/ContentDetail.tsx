import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft,
  MoreVertical,
  MapPin,
  ChevronDown,
  ChevronUp,
  Map,
  MessageCircle,
} from 'lucide-react';
import { feedKeys, fetchContentDetail } from '../../feed/api/feedApi';
import { useContentActions } from '../../feed/hooks/useContentActions';
import { MediaCarousel } from '../../feed/components/MediaCarousel';
import { ActionBar } from '../../feed/components/ActionBar';
import { ImageViewerModal } from './ImageViewerModal';
import { FeedDetailContent, FeedResponse } from '../../../types/content';
import { formatRelativeTime } from '../../../shared/lib/relativeTime';
import { buildProfileImageUrl } from '../../../shared/lib/imageUrl';

interface ContentDetailProps {
  contentId: number;
  onBack: () => void;
  onNavigateToLocalbox: (localboxId: number) => void;
  onOpenMoreMenu: (feed: FeedDetailContent) => void;
  onShare: (feed: FeedDetailContent) => void;
  onRequireLogin: () => void;
  targetAnchor?: string;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({
  contentId,
  onBack,
  onNavigateToLocalbox,
  onOpenMoreMenu,
  onShare,
  onRequireLogin,
  targetAnchor,
}) => {
  const queryClient = useQueryClient();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // 피드 캐시에서 initialData 가져와 즉시 렌더링
  const cachedFeedList = queryClient.getQueryData<{
    pages: FeedResponse[];
    pageParams: any[];
  }>(feedKeys.latest());

  let initialFeed: FeedDetailContent | undefined;
  if (cachedFeedList) {
    for (const page of cachedFeedList.pages) {
      const found = page.result.content.find((item) => item.contentId === contentId);
      if (found) {
        initialFeed = found as FeedDetailContent;
        break;
      }
    }
  }

  // 상세 쿼리 실행
  const {
    data: feed,
    isLoading,
    isError,
  } = useQuery<FeedDetailContent | null>({
    queryKey: feedKeys.detail(contentId),
    queryFn: () => fetchContentDetail(contentId),
    initialData: initialFeed,
    staleTime: 1000 * 60 * 5,
  });

  const { handleToggleLike, handleToggleBookmark } = useContentActions({
    onRequireLogin,
  });

  // 앵커 이동 처리 (#comments 등)
  React.useEffect(() => {
    if (targetAnchor === '#comments') {
      setTimeout(() => {
        const el = document.getElementById('comments');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  }, [targetAnchor]);

  if (isLoading && !feed) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#14B8B0] border-t-transparent rounded-full animate-spin" />
        <span className="text-[13px] text-[#94A3B8] mt-3">동네소식을 불러오는 중...</span>
      </div>
    );
  }

  if (isError || !feed) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-3xl mb-4">
          🗑️
        </div>
        <h2 className="text-[17px] font-extrabold text-[#1E293B] mb-2">
          삭제되었거나 존재하지 않는 글입니다
        </h2>
        <p className="text-[13px] text-[#64748B] mb-6">
          요청하신 콘텐츠가 이동되었거나 삭제되어 표시할 수 없습니다.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full bg-[#14B8B0] text-white font-bold text-[14px] cursor-pointer hover:opacity-90 shadow-sm"
        >
          동네소식 홈으로 돌아가기
        </button>
      </div>
    );
  }

  const {
    contentTitle,
    contentBodyText,
    contentLikeCount,
    contentReplyCount,
    contentLikeYn,
    contentBookmarkYn,
    viewCount,
    regDt,
    contentDisplayRateDongs,
    contentHashTagElementDtos,
    contentFileElementDtos,
    localboxElementDto,
    address,
  } = feed;

  // 동별 노출 비율 포맷: "방학동 67% 도봉동 33%"
  const dongsDisplay =
    contentDisplayRateDongs && contentDisplayRateDongs.length > 0
      ? contentDisplayRateDongs.map((d) => `${d.dongName} ${d.percentage}%`).join(' ')
      : localboxElementDto.localboxMyTownName;

  const profileImageUrl = buildProfileImageUrl(localboxElementDto.localboxProfileImgUrl);

  return (
    <div className="w-full min-h-screen bg-white pb-[90px] select-none relative">
      {/* Sticky Header: < 뒤로가기, ⋮ 더보기 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur px-3 py-2.5 min-h-[52px] border-b border-[#F3F4F6] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center p-1 rounded-full hover:bg-black/5 cursor-pointer text-[#1E293B]"
        >
          <ChevronLeft size={24} />
        </button>

        <span className="text-[15px] font-bold text-[#1E293B] truncate max-w-[240px]">
          동네이야기
        </span>

        <button
          type="button"
          onClick={() => onOpenMoreMenu(feed)}
          aria-label="더보기"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center p-1 rounded-full hover:bg-black/5 cursor-pointer text-[#64748B]"
        >
          <MoreVertical size={20} />
        </button>
      </header>

      {/* 작성자 영역: 프로필 + localboxName + 동별 노출 비율 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#F8FAFC]">
        <div
          onClick={() => onNavigateToLocalbox(localboxElementDto.localboxId)}
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
        >
          {/* Avatar (34px) */}
          <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#14B8B0] shrink-0 flex items-center justify-center text-white font-bold text-xs">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={localboxElementDto.localboxName}
                width={34}
                height={34}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{localboxElementDto.localboxName.charAt(0)}</span>
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[14px] font-bold text-[#1E293B] truncate group-hover:text-[#14B8B0] transition-colors">
              {localboxElementDto.localboxName}
            </span>
            {/* 노출 동네 비율 (피드 카드의 시/구와 다름) */}
            <span className="text-[11px] text-[#94A3B8] truncate leading-tight">
              {dongsDisplay}
            </span>
          </div>
        </div>

        {/* 로컬박스 뱃지 */}
        <span className="text-[10px] font-bold text-[#14B8B0] bg-[#E8F8F7] px-2 py-0.5 rounded-full shrink-0">
          로컬박스
        </span>
      </div>

      {/* 미디어 캐러셀 (피드 컴포넌트 재사용, 폭 100%, 탭 시 전체화면 뷰어) */}
      {contentFileElementDtos && contentFileElementDtos.length > 0 && (
        <MediaCarousel
          files={contentFileElementDtos}
          contentTitle={contentTitle}
          isDetailView={true}
          onMediaClick={(idx) => setViewerIndex(idx)}
        />
      )}

      {/* 본문 콘텐츠 컨테이너 */}
      <div className="p-4 flex flex-col gap-3">
        {/* 위치 영역: 핀 아이콘 + 주소 + 토글 펼치기 */}
        {address && (
          <div className="p-3 bg-[#F8FAFC] rounded-[12px] border border-[#EEEEEE]">
            <button
              type="button"
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 text-[12px] text-[#374151] flex-1 min-w-0">
                <MapPin size={15} color="#14B8B0" className="shrink-0" />
                <span className="font-semibold truncate">{address}</span>
              </div>
              <div className="text-[#9CA3AF] shrink-0 ml-2">
                {isMapExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {/* 지도 플레이스홀더 (펼침 시) */}
            {isMapExpanded && (
              <div className="mt-3 w-full h-[140px] rounded-[10px] bg-[#E5E7EB] border border-[#D1D5DB] flex flex-col items-center justify-center text-[#64748B] text-center p-3">
                <Map size={24} className="mb-1 text-[#14B8B0]" />
                <span className="text-[12px] font-bold text-[#1E293B]">{address}</span>
                {/* TODO(확인필요): 네이버 지도 SDK 연동 스펙 및 클라이언트 ID 확인 필요 */}
                <span className="text-[10px] text-[#94A3B8] mt-1">
                  [지도 미리보기] TODO(확인필요): 지도 연동 예정
                </span>
              </div>
            )}
          </div>
        )}

        {/* 제목 (굵게) */}
        <h1 className="text-[18px] font-extrabold text-[#0F172A] leading-snug">
          {contentTitle}
        </h1>

        {/* 본문 전문: white-space: pre-line으로 문단 줄바꿈 보존, 말줄임 없음 */}
        <p className="text-[14px] text-[#374151] leading-[1.65] whitespace-pre-line">
          {contentBodyText}
        </p>

        {/* 해시태그 목록 */}
        {contentHashTagElementDtos && contentHashTagElementDtos.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {contentHashTagElementDtos.map((tag) => (
              <button
                key={tag.contentHashTagId}
                type="button"
                onClick={() => console.log('Tag clicked:', tag.tagName)}
                className="text-[12px] font-semibold text-[#14B8B0] bg-[#E8F8F7] px-2.5 py-1 rounded-[8px] hover:bg-[#d5f4f2] transition-colors cursor-pointer"
              >
                #{tag.tagName}
              </button>
            ))}
          </div>
        )}

        {/* 메타: 상대시간 · 👁 {viewCount}회 */}
        <div className="text-[11px] font-medium text-[#94A3B8] pt-2 border-t border-[#F8FAFC]">
          <span>{formatRelativeTime(regDt)}</span>
          <span className="mx-1.5">·</span>
          <span>조회 {viewCount}회</span>
        </div>

        {/* 댓글 영역 (id="comments") */}
        <section id="comments" className="mt-4 pt-4 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} color="#1E293B" />
            <h4 className="text-[14px] font-bold text-[#1E293B]">
              댓글 {contentReplyCount}개
            </h4>
          </div>

          {/* TODO(확인필요): 댓글 목록 조회 및 작성 API 확인 필요 */}
          <div className="p-4 bg-[#F8FAFC] rounded-[12px] border border-[#EEEEEE] text-center text-[#94A3B8] text-[12px]">
            <p className="font-semibold text-[#475569] mb-1">
              댓글 기능 준비 중입니다
            </p>
            <p>TODO(확인필요): 댓글 API 연동 및 입력 폼 구현 예정</p>
          </div>
        </section>
      </div>

      {/* 하단 고정 액션바 (sticky, 피드 카드와 상태 동기화) */}
      <div className="sticky bottom-0 w-full bg-white/95 backdrop-blur border-t border-[#F3F4F6] z-30 shadow-lg">
        <ActionBar
          contentId={contentId}
          likeCount={contentLikeCount}
          replyCount={contentReplyCount}
          isLiked={contentLikeYn}
          isBookmarked={contentBookmarkYn}
          onToggleLike={() =>
            handleToggleLike(contentId, contentLikeYn, contentLikeCount)
          }
          onToggleBookmark={() =>
            handleToggleBookmark(contentId, contentBookmarkYn)
          }
          onCommentClick={() => {
            const el = document.getElementById('comments');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onShareClick={() => onShare(feed)}
        />
      </div>

      {/* 이미지 전체화면 뷰어 모달 */}
      {viewerIndex !== null && (
        <ImageViewerModal
          files={contentFileElementDtos}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
};
