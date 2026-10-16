import React from 'react';
import {
  Pin,
  Calendar,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Check,
  Plus,
} from 'lucide-react';
import { ResidentNewsContent } from '../../../types/resident';
import { getEventStatus } from '../lib/eventStatus';
import { formatEventDate } from '../lib/formatEventDate';
import { stripMarkdown } from '../lib/stripMarkdown';
import { buildProfileImageUrl } from '../../../shared/lib/imageUrl';

interface ResidentNewsCardProps {
  content: ResidentNewsContent;
  onNavigateToDetail: (contentId: number) => void;
  onNavigateToLocalbox?: (localboxId: number) => void;
  onToggleLike: (contentId: number) => void;
  onToggleBookmark: (contentId: number) => void;
  onToggleFollow?: (localboxId: number) => void;
  onShare: (content: ResidentNewsContent) => void;
}

export const ResidentNewsCard: React.FC<ResidentNewsCardProps> = ({
  content,
  onNavigateToDetail,
  onNavigateToLocalbox,
  onToggleLike,
  onToggleBookmark,
  onToggleFollow,
  onShare,
}) => {
  const {
    contentId,
    contentTitle,
    contentBodyText,
    contentLikeCount,
    contentReplyCount,
    contentLikeYn,
    contentBookmarkYn,
    viewCount,
    isPinnedToTopGroup,
    eventStartDate,
    eventEndDate,
    contentHashTagElementDtos,
    contentFileElementDtos,
    localboxElementDto,
  } = content;

  const eventStatus = getEventStatus(eventStartDate, eventEndDate);
  const formattedEventDate = formatEventDate(eventStartDate, eventEndDate);
  const previewText = stripMarkdown(contentBodyText);
  const profileImageUrl = buildProfileImageUrl(localboxElementDto.localboxProfileImgUrl);

  const firstImage = contentFileElementDtos?.[0]?.contentFileUrl;
  const imageCount = contentFileElementDtos?.length || 0;

  return (
    <article className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md transition-shadow select-none mb-4">
      {/* 1. 상단 고정 뱃지 */}
      {isPinnedToTopGroup && (
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 text-[11px] font-bold text-[#14B8B0] bg-[#F0FDF4]/50 border-b border-[#E5E7EB]/50">
          <Pin size={13} className="rotate-45" />
          <span>고정된 주민소식</span>
        </div>
      )}

      {/* 2. 발행자 프로필 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F8FAFC]">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateToLocalbox?.(localboxElementDto.localboxId)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigateToLocalbox?.(localboxElementDto.localboxId);
          }}
          className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1 group"
        >
          {/* 아바타 (34px) */}
          <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#E2E8F0] shrink-0 flex items-center justify-center text-[#64748B] font-bold text-xs">
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
            <span className="text-[11px] text-[#94A3B8] truncate leading-tight">
              {localboxElementDto.localboxMyTownName}
            </span>
          </div>
        </div>

        {/* 팔로우 버튼 */}
        {onToggleFollow && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(localboxElementDto.localboxId);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              localboxElementDto.isUserFollowedByMe
                ? 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                : 'border border-[#14B8B0] text-[#14B8B0] bg-white hover:bg-[#E8F8F7]'
            }`}
          >
            {localboxElementDto.isUserFollowedByMe ? (
              <>
                <Check size={12} />
                <span>팔로잉</span>
              </>
            ) : (
              <>
                <Plus size={12} />
                <span>팔로우</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 3. 카드 본문 (클릭 시 상세 이동) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onNavigateToDetail(contentId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onNavigateToDetail(contentId);
        }}
        className="p-4 cursor-pointer active:bg-gray-50/50 transition-colors"
      >
        {/* 행사 상태 뱃지 & 일시 */}
        {eventStatus !== 'NONE' && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
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

            {formattedEventDate && (
              <div className="flex items-center gap-1 text-[12px] font-medium text-[#475569]">
                <Calendar size={13} className="text-[#64748B]" />
                <span>{formattedEventDate}</span>
              </div>
            )}
          </div>
        )}

        {/* 제목 */}
        <h3 className="text-[16px] font-bold text-[#1E293B] mb-2 leading-snug hover:text-[#14B8B0] transition-colors line-clamp-2">
          {contentTitle}
        </h3>

        {/* 요약 본문 */}
        {previewText && (
          <p className="text-[13px] text-[#4B5563] mb-3 line-clamp-2 leading-relaxed">
            {previewText}
          </p>
        )}

        {/* 썸네일 이미지 */}
        {firstImage && (
          <div className="relative w-full h-[170px] rounded-[10px] overflow-hidden bg-[#F1F5F9] mb-3">
            <img
              src={firstImage}
              alt={contentTitle}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {imageCount > 1 && (
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium rounded-full">
                1 / {imageCount}
              </div>
            )}
          </div>
        )}

        {/* 해시태그 목록 */}
        {contentHashTagElementDtos && contentHashTagElementDtos.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {contentHashTagElementDtos.map((tag) => (
              <span
                key={tag.hashTagId}
                className="text-[11px] text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-[4px] font-medium"
              >
                #{tag.tagName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. 하단 액션 & 메타 정보 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F3F4F6] bg-white">
        {/* 좋아요 / 댓글 / 조회수 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(contentId);
            }}
            aria-label={`좋아요 ${contentLikeCount}개`}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
              contentLikeYn ? 'text-[#FF4D6D]' : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Heart
              size={17}
              fill={contentLikeYn ? '#FF4D6D' : 'none'}
              strokeWidth={contentLikeYn ? 2.5 : 2}
            />
            <span>{contentLikeCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToDetail(contentId)}
            aria-label={`댓글 ${contentReplyCount}개`}
            className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748B] hover:text-[#1E293B] cursor-pointer"
          >
            <MessageCircle size={17} strokeWidth={2} />
            <span>{contentReplyCount}</span>
          </button>

          <span className="text-[11px] text-[#94A3B8]">조회 {viewCount}</span>
        </div>

        {/* 북마크 & 공유 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(contentId);
            }}
            aria-label="북마크 저장"
            className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer ${
              contentBookmarkYn ? 'text-[#14B8B0]' : 'text-[#64748B]'
            }`}
          >
            <Bookmark
              size={18}
              fill={contentBookmarkYn ? '#14B8B0' : 'none'}
              strokeWidth={contentBookmarkYn ? 2.5 : 2}
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare(content);
            }}
            aria-label="소식 공유하기"
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#64748B] transition-colors cursor-pointer"
          >
            <Share2 size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
};
