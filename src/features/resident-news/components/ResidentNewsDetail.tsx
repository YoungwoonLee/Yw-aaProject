import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft,
  Share2,
  Calendar,
  Heart,
  Bookmark,
  MessageCircle,
  Eye,
  Pin,
  Check,
  Plus,
  Send,
  Building2,
} from 'lucide-react';
import {
  residentNewsKeys,
  fetchResidentNewsDetail,
  toggleResidentNewsLike,
  toggleResidentNewsBookmark,
  toggleResidentLocalboxFollow,
} from '../api/residentNewsApi';
import { getEventStatus } from '../lib/eventStatus';
import { formatEventDate } from '../lib/formatEventDate';
import { formatRelativeTime } from '../../../shared/lib/relativeTime';
import { buildProfileImageUrl } from '../../../shared/lib/imageUrl';
import { ResidentNewsContent } from '../../../types/resident';

interface ResidentNewsDetailProps {
  contentId: number;
  onBack: () => void;
  onNavigateToLocalbox?: (localboxId: number) => void;
  onShare: (content: ResidentNewsContent) => void;
  onRequireLogin: () => void;
}

export const ResidentNewsDetail: React.FC<ResidentNewsDetailProps> = ({
  contentId,
  onBack,
  onNavigateToLocalbox,
  onShare,
  onRequireLogin,
}) => {
  const queryClient = useQueryClient();

  const { data: content, isLoading, isError } = useQuery({
    queryKey: residentNewsKeys.detail(contentId),
    queryFn: () => fetchResidentNewsDetail(contentId),
    staleTime: 1000 * 60 * 5,
  });

  const handleToggleLike = async () => {
    if (!content) return;
    try {
      await toggleResidentNewsLike(content.contentId);
      queryClient.invalidateQueries({ queryKey: residentNewsKeys.all });
    } catch {
      onRequireLogin();
    }
  };

  const handleToggleBookmark = async () => {
    if (!content) return;
    try {
      await toggleResidentNewsBookmark(content.contentId);
      queryClient.invalidateQueries({ queryKey: residentNewsKeys.all });
    } catch {
      onRequireLogin();
    }
  };

  const handleToggleFollow = async () => {
    if (!content) return;
    try {
      await toggleResidentLocalboxFollow(content.localboxElementDto.localboxId);
      queryClient.invalidateQueries({ queryKey: residentNewsKeys.all });
    } catch {
      onRequireLogin();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-[#14B8B0] border-t-transparent rounded-full animate-spin" />
          <span className="text-[12px] text-[#94A3B8]">주민소식을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="w-full min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center">
        <p className="text-[15px] font-bold text-[#1E293B] mb-2">
          소식을 찾을 수 없거나 삭제되었습니다.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-full bg-[#14B8B0] text-white text-[13px] font-bold cursor-pointer"
        >
          목록으로 돌아가기
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
    isPinnedToTopGroup,
    eventStartDate,
    eventEndDate,
    contentHashTagElementDtos,
    contentFileElementDtos,
    localboxElementDto,
  } = content;

  const eventStatus = getEventStatus(eventStartDate, eventEndDate);
  const formattedEventDate = formatEventDate(eventStartDate, eventEndDate);
  const profileImageUrl = buildProfileImageUrl(localboxElementDto.localboxProfileImgUrl);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col select-none relative">
      {/* 1. 상단 고정 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#F3F4F6] h-[52px] px-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="p-1.5 rounded-full hover:bg-gray-100 text-[#1E293B] cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-[16px] font-bold text-[#1E293B]">주민소식</h1>

        <button
          type="button"
          onClick={() => onShare(content)}
          aria-label="공유하기"
          className="p-1.5 rounded-full hover:bg-gray-100 text-[#475569] cursor-pointer"
        >
          <Share2 size={20} />
        </button>
      </header>

      {/* 2. 본문 스크롤 컨테이너 */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* 고정글 뱃지 */}
        {isPinnedToTopGroup && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-[#F0FDF4] text-[#14B8B0] text-[12px] font-bold border-b border-[#E5E7EB]/60">
            <Pin size={13} className="rotate-45" />
            <span>상단 고정된 주민소식</span>
          </div>
        )}

        {/* 작성자 프로필 카드 */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-[#F8FAFC]">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigateToLocalbox?.(localboxElementDto.localboxId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNavigateToLocalbox?.(localboxElementDto.localboxId);
            }}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
          >
            <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-[#E2E8F0] shrink-0 flex items-center justify-center text-[#64748B] font-bold text-sm">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={localboxElementDto.localboxName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{localboxElementDto.localboxName.charAt(0)}</span>
              )}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[15px] font-bold text-[#1E293B] truncate group-hover:text-[#14B8B0] transition-colors">
                {localboxElementDto.localboxName}
              </span>
              <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
                <span>{localboxElementDto.localboxMyTownName}</span>
                <span>·</span>
                <span>{formatRelativeTime(regDt)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleFollow}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              localboxElementDto.isUserFollowedByMe
                ? 'bg-[#F1F5F9] text-[#64748B]'
                : 'border border-[#14B8B0] text-[#14B8B0] bg-white hover:bg-[#E8F8F7]'
            }`}
          >
            {localboxElementDto.isUserFollowedByMe ? (
              <>
                <Check size={13} />
                <span>팔로잉</span>
              </>
            ) : (
              <>
                <Plus size={13} />
                <span>팔로우</span>
              </>
            )}
          </button>
        </div>

        {/* 본문 콘텐츠 */}
        <article className="p-4">
          {/* 행사 상태 및 기간 배너 */}
          {eventStatus !== 'NONE' && (
            <div className="p-3 mb-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {eventStatus === 'LIVE' && (
                  <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[#E8F8F7] text-[#14B8B0] border border-[#A2E7E2]">
                    진행중
                  </span>
                )}
                {eventStatus === 'UPCOMING' && (
                  <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
                    예정
                  </span>
                )}
                {eventStatus === 'ENDED' && (
                  <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-medium bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB]">
                    종료
                  </span>
                )}
                <div className="flex items-center gap-1 text-[13px] font-semibold text-[#1E293B]">
                  <Calendar size={15} className="text-[#64748B]" />
                  <span>{formattedEventDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* 제목 */}
          <h2 className="text-[20px] font-bold text-[#1E293B] mb-3 leading-snug">
            {contentTitle}
          </h2>

          {/* 조회수 / 댓글수 */}
          <div className="flex items-center gap-3 text-[12px] text-[#94A3B8] pb-4 mb-4 border-b border-[#F3F4F6]">
            <span className="flex items-center gap-1">
              <Eye size={14} /> 조회 {viewCount}
            </span>
            <span>·</span>
            <span>댓글 {contentReplyCount}</span>
            <span>·</span>
            <span>{regDt}</span>
          </div>

          {/* 첨부 이미지 목록 */}
          {contentFileElementDtos && contentFileElementDtos.length > 0 && (
            <div className="flex flex-col gap-3 mb-5">
              {contentFileElementDtos.map((img, idx) => (
                <div
                  key={idx}
                  className="w-full rounded-xl overflow-hidden bg-[#F1F5F9] shadow-xs"
                >
                  <img
                    src={img.contentFileUrl}
                    alt={`${contentTitle} 첨부 ${idx + 1}`}
                    className="w-full h-auto object-cover max-h-[460px]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 본문 텍스트 (줄바꿈 및 마크다운 친화적) */}
          <div className="text-[15px] text-[#334155] leading-relaxed whitespace-pre-line mb-6 font-normal">
            {contentBodyText}
          </div>

          {/* 해시태그 목록 */}
          {contentHashTagElementDtos && contentHashTagElementDtos.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#F3F4F6] mb-6">
              {contentHashTagElementDtos.map((tag) => (
                <span
                  key={tag.hashTagId}
                  className="text-[12px] text-[#14B8B0] bg-[#E8F8F7] px-2.5 py-1 rounded-md font-medium"
                >
                  #{tag.tagName}
                </span>
              ))}
            </div>
          )}

          {/* 로컬박스 안내 박스 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 size={20} className="text-[#14B8B0]" />
              <div>
                <p className="text-[13px] font-bold text-[#1E293B]">
                  {localboxElementDto.localboxName}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  공식 로컬 채널에서 더 많은 소식을 확인하세요.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToLocalbox?.(localboxElementDto.localboxId)}
              className="px-3 py-1.5 rounded-lg bg-[#14B8B0] text-white text-[12px] font-bold cursor-pointer"
            >
              채널보기
            </button>
          </div>
        </article>
      </div>

      {/* 3. 하단 고정 액션바 */}
      <footer className="sticky bottom-0 z-30 bg-white border-t border-[#E5E7EB] px-4 py-2.5 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          {/* 좋아요 */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors cursor-pointer ${
              contentLikeYn ? 'text-[#FF4D6D]' : 'text-[#64748B]'
            }`}
          >
            <Heart
              size={20}
              fill={contentLikeYn ? '#FF4D6D' : 'none'}
              strokeWidth={contentLikeYn ? 2.5 : 2}
            />
            <span>{contentLikeCount}</span>
          </button>

          {/* 댓글 */}
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B]">
            <MessageCircle size={20} strokeWidth={2} />
            <span>{contentReplyCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 북마크 */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-label="북마크"
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${
              contentBookmarkYn ? 'text-[#14B8B0]' : 'text-[#64748B]'
            }`}
          >
            <Bookmark
              size={20}
              fill={contentBookmarkYn ? '#14B8B0' : 'none'}
              strokeWidth={contentBookmarkYn ? 2.5 : 2}
            />
          </button>

          {/* 공유 */}
          <button
            type="button"
            onClick={() => onShare(content)}
            aria-label="공유"
            className="p-2 rounded-full hover:bg-gray-100 text-[#64748B] transition-colors cursor-pointer"
          >
            <Share2 size={20} strokeWidth={2} />
          </button>
        </div>
      </footer>
    </div>
  );
};
