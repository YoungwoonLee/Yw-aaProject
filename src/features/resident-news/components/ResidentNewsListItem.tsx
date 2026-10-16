import React from 'react';
import {
  Pin,
  Calendar,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { ResidentNewsContent } from '../../../types/resident';
import { getEventStatus } from '../lib/eventStatus';
import { formatEventDate } from '../lib/formatEventDate';
import { stripMarkdown } from '../lib/stripMarkdown';
import { formatRelativeTime } from '../../../shared/lib/relativeTime';
import { buildProfileImageUrl } from '../../../shared/lib/imageUrl';

interface ResidentNewsListItemProps {
  content: ResidentNewsContent;
  onNavigateToDetail: (contentId: number) => void;
  onNavigateToLocalbox?: (localboxId: number) => void;
  onToggleLike: (contentId: number) => void;
  onToggleBookmark: (contentId: number) => void;
  onShare: (content: ResidentNewsContent) => void;
  onMoreMenu?: (content: ResidentNewsContent) => void;
}

export const ResidentNewsListItem: React.FC<ResidentNewsListItemProps> = ({
  content,
  onNavigateToDetail,
  onNavigateToLocalbox,
  onToggleLike,
  onToggleBookmark,
  onShare,
  onMoreMenu,
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
  const previewText = stripMarkdown(contentBodyText);
  const profileImageUrl = buildProfileImageUrl(localboxElementDto?.localboxProfileImgUrl);

  const images = contentFileElementDtos || [];
  const firstImage = images[0]?.contentFileUrl;
  const imageCount = images.length;

  return (
    <article
      onClick={() => onNavigateToDetail(contentId)}
      className="group bg-white px-4 py-3.5 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer select-none"
    >
      {/* 1. 상단 정보: 뱃지 + 작성자 프로필 + 더보기 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* 상단 고정 뱃지 */}
          {isPinnedToTopGroup && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#14B8B0] bg-[#E8F8F7] px-2 py-0.5 rounded-full shrink-0 border border-[#B3ECE8]">
              <Pin size={10} className="rotate-45" />
              <span>고정</span>
            </span>
          )}

          {/* 행사 진행 상태 뱃지 */}
          {eventStatus === 'LIVE' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8F7] text-[#14B8B0] border border-[#A2E7E2] shrink-0">
              진행중
            </span>
          )}
          {eventStatus === 'UPCOMING' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] shrink-0">
              예정
            </span>
          )}
          {eventStatus === 'ENDED' && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB] shrink-0">
              종료
            </span>
          )}

          {/* 작성자 아바타 & 닉네임 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (localboxElementDto?.localboxId) {
                onNavigateToLocalbox?.(localboxElementDto.localboxId);
              }
            }}
            className="flex items-center gap-1.5 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-[20px] h-[20px] rounded-full overflow-hidden bg-[#E2E8F0] shrink-0 flex items-center justify-center font-bold text-[10px] text-white">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={localboxElementDto.localboxName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="bg-[#14B8B0] w-full h-full flex items-center justify-center">
                  {localboxElementDto?.localboxName?.charAt(0) || '주'}
                </span>
              )}
            </div>

            <span className="text-[12px] font-bold text-[#334155] truncate max-w-[90px]">
              {localboxElementDto?.localboxName}
            </span>

            <span className="text-[11px] text-[#94A3B8] shrink-0">
              {localboxElementDto?.localboxMyTownName || '동두천시'}
            </span>

            <span className="text-[10px] text-[#CBD5E1]">·</span>

            <span className="text-[11px] text-[#94A3B8] shrink-0">
              {formatRelativeTime(regDt)}
            </span>
          </div>
        </div>

        {/* 더보기 버튼 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoreMenu?.(content);
          }}
          className="p-1 text-[#94A3B8] hover:text-[#64748B] transition-colors rounded-full hover:bg-black/5 shrink-0"
          aria-label="더보기"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* 2. 중단 콘텐츠 영역: (텍스트 + 썸네일) */}
      <div className="flex gap-3 items-start justify-between">
        {/* 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#14B8B0] transition-colors">
            {contentTitle}
          </h3>

          {previewText && (
            <p className="text-[12px] text-[#64748B] line-clamp-2 leading-relaxed mt-1">
              {previewText}
            </p>
          )}

          {/* 행사 일정 표시 (있는 경우) */}
          {formattedEventDate && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#0F766E] mt-1.5">
              <Calendar size={12} className="text-[#14B8B0] shrink-0" />
              <span>{formattedEventDate}</span>
            </div>
          )}

          {/* 해시태그 목록 */}
          {contentHashTagElementDtos && contentHashTagElementDtos.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {contentHashTagElementDtos.slice(0, 3).map((tag) => (
                <span
                  key={tag.hashTagId}
                  className="text-[10px] text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded font-medium"
                >
                  #{tag.tagName}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 썸네일 이미지 (우측 정방형 76px) */}
        {firstImage && (
          <div className="relative w-[76px] h-[76px] rounded-xl overflow-hidden bg-[#F1F5F9] shrink-0 border border-[#E2E8F0] shadow-2xs group-hover:border-[#14B8B0]/50 transition-colors">
            <img
              src={firstImage}
              alt={contentTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {imageCount > 1 && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded-md flex items-center gap-0.5">
                <Layers size={9} />
                <span>{imageCount}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. 하단 액션 & 반응 바 */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F8FAFC]">
        {/* 좌측: 좋아요 / 댓글 / 조회수 */}
        <div className="flex items-center gap-3">
          {/* 좋아요 버튼 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(contentId);
            }}
            className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
              contentLikeYn ? 'text-[#FF4D6D]' : 'text-[#94A3B8] hover:text-[#64748B]'
            }`}
            aria-label={`좋아요 ${contentLikeCount}개`}
          >
            <Heart
              size={13}
              fill={contentLikeYn ? '#FF4D6D' : 'none'}
              strokeWidth={contentLikeYn ? 2.5 : 2}
            />
            <span>{contentLikeCount}</span>
          </button>

          {/* 댓글 수 */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#94A3B8]">
            <MessageCircle size={13} strokeWidth={2} />
            <span>{contentReplyCount}</span>
          </div>

          <span className="text-[10px] text-[#CBD5E1]">·</span>

          {/* 조회수 */}
          <span className="text-[11px] text-[#94A3B8]">
            조회 {viewCount}
          </span>
        </div>

        {/* 우측: 북마크 & 공유 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(contentId);
            }}
            className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${
              contentBookmarkYn ? 'text-[#14B8B0]' : 'text-[#94A3B8]'
            }`}
            aria-label="북마크"
          >
            <Bookmark
              size={14}
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
            className="p-1.5 rounded-full hover:bg-black/5 text-[#94A3B8] hover:text-[#64748B] transition-colors"
            aria-label="공유하기"
          >
            <Share2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
};
