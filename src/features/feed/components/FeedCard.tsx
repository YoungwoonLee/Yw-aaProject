import React from 'react';
import { MoreVertical, Pin } from 'lucide-react';
import { FeedContent } from '../../../types/content';
import { MediaCarousel } from './MediaCarousel';
import { ActionBar } from './ActionBar';
import { formatRelativeTime, formatRegionalDate } from '../../../shared/lib/relativeTime';
import { buildProfileImageUrl } from '../../../shared/lib/imageUrl';

export type FeedCardVariant = 'latest' | 'regional';

interface FeedCardProps {
  feed: FeedContent;
  variant?: FeedCardVariant;
  onNavigateToDetail: (contentId: number, anchor?: string) => void;
  onNavigateToLocalbox: (localboxId: number) => void;
  onOpenMoreMenu: (feed: FeedContent) => void;
  onToggleLike: (contentId: number, currentLikeYn: boolean, count: number) => void;
  onToggleBookmark: (contentId: number, currentBookmarkYn: boolean) => void;
  onShare: (feed: FeedContent) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  feed,
  variant = 'latest',
  onNavigateToDetail,
  onNavigateToLocalbox,
  onOpenMoreMenu,
  onToggleLike,
  onToggleBookmark,
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
    regDt,
    isPinnedToTopGroup,
    contentDisplayRateCityName,
    contentDisplayRateDongs,
    contentFileElementDtos,
    localboxElementDto,
  } = feed;

  const profileImageUrl = buildProfileImageUrl(localboxElementDto.localboxProfileImgUrl);

  // 로컬탭(regional)일 경우 노출 동네 비율 상위 3개를 "{동} {n}%" 공백 연결
  const regionalDongRatesText =
    variant === 'regional' &&
    contentDisplayRateDongs &&
    contentDisplayRateDongs.length > 0
      ? [...contentDisplayRateDongs]
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 3)
          .map((d) => `${d.dongName} ${d.percentage}%`)
          .join(' ')
      : '';

  const formattedDate =
    variant === 'regional' ? formatRegionalDate(regDt) : formatRelativeTime(regDt);

  return (
    <article className="bg-white pb-5 border-b border-[#F3F4F6] content-visibility-auto select-none">
      {/* Pinned Badge if isPinnedToTopGroup */}
      {isPinnedToTopGroup && (
        <div className="flex items-center gap-1.5 px-4 pt-2.5 pb-1 text-[11px] font-bold text-[#14B8B0]">
          <Pin size={12} className="rotate-45" />
          <span>고정된 동네소식</span>
        </div>
      )}

      {/* Header: Profile (34px) + localboxName + subtitle + More Button */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          type="button"
          onClick={() => onNavigateToLocalbox(localboxElementDto.localboxId)}
          className="flex items-center gap-2.5 text-left cursor-pointer group flex-1 min-w-0"
          aria-label={`${localboxElementDto.localboxName} 로컬박스 프로필 보기`}
        >
          {/* Profile Avatar (34px) */}
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

          {/* Name & Subtitle (홈: 시/구, 로컬탭: 상위 3개 동네 노출 비율 12px #B3B3B3) */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[14px] font-bold text-[#1E293B] truncate group-hover:text-[#14B8B0] transition-colors">
              {localboxElementDto.localboxName}
            </span>
            {variant === 'regional' ? (
              <span
                data-testid="regional-dong-rates"
                className="text-[12px] text-[#B3B3B3] truncate leading-tight"
              >
                {regionalDongRatesText ||
                  contentDisplayRateCityName ||
                  localboxElementDto.localboxMyTownName}
              </span>
            ) : (
              <span className="text-[11px] text-[#94A3B8] truncate leading-tight">
                {contentDisplayRateCityName || localboxElementDto.localboxMyTownName}
              </span>
            )}
          </div>
        </button>

        {/* More Options Button (⋮) */}
        <button
          type="button"
          onClick={() => onOpenMoreMenu(feed)}
          aria-label="더보기 메뉴"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-[#64748B]"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Media Carousel (4:3) - 미디어가 없으면 영역 자체를 렌더링하지 않는다 */}
      {contentFileElementDtos && contentFileElementDtos.length > 0 && (
        <MediaCarousel
          files={contentFileElementDtos}
          contentTitle={contentTitle}
          onMediaClick={() => onNavigateToDetail(contentId)}
        />
      )}

      {/* Action Bar (Like, Comment, Share, Bookmark) */}
      <ActionBar
        contentId={contentId}
        likeCount={contentLikeCount}
        replyCount={contentReplyCount}
        isLiked={contentLikeYn}
        isBookmarked={contentBookmarkYn}
        onToggleLike={() => onToggleLike(contentId, contentLikeYn, contentLikeCount)}
        onToggleBookmark={() => onToggleBookmark(contentId, contentBookmarkYn)}
        onCommentClick={() => onNavigateToDetail(contentId, '#comments')}
        onShareClick={() => onShare(feed)}
      />

      {/* Content Text: Title, Body Preview, Meta */}
      <div
        onClick={() => onNavigateToDetail(contentId)}
        className="px-4 cursor-pointer group"
      >
        {/* Title: 굵게, 최대 2줄 line-clamp-2 */}
        <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2 mb-1 group-hover:text-[#14B8B0] transition-colors">
          {contentTitle}
        </h3>

        {/* Body Preview: 회색, 최대 2줄 line-clamp-2 */}
        <p className="text-[13px] text-[#475569] leading-relaxed line-clamp-2 mb-1.5 whitespace-pre-line">
          {contentBodyText}
        </p>

        {/* Meta: 날짜 · 👁 조회수 */}
        <div className="text-[11px] font-medium text-[#94A3B8] flex items-center gap-1.5">
          <span data-testid="feed-card-date">{formattedDate}</span>
          <span>·</span>
          <span>👁 {viewCount}회</span>
        </div>
      </div>
    </article>
  );
};

