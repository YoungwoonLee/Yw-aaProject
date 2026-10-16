import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  MapPin,
  Eye,
  Pin,
  Play,
} from 'lucide-react';
import { FeedContent } from '../../../types/content';
import { formatRelativeTime } from '../../../shared/lib/relativeTime';
import { buildProfileImageUrl } from '../../../shared/lib/imageUrl';

interface LocalListItemProps {
  feed: FeedContent;
  selectedTown: string;
  onNavigateToDetail: (contentId: number) => void;
  onNavigateToLocalbox: (localboxId: number) => void;
  onShare: (feed: FeedContent) => void;
  onMoreMenu: (feed: FeedContent) => void;
  onRequireLogin: () => void;
}

// Map category badge by content attributes or tags
function getCategoryBadge(feed: FeedContent): { label: string; color: string; bg: string } {
  const title = feed.contentTitle || '';
  const text = feed.contentBodyText || '';
  const tags = feed.contentHashTagElementDtos?.map((t) => t.tagName) || [];

  if (tags.some((t) => ['빵', '맛집', '문방구', '가게', '정미소'].some((k) => t.includes(k))) ||
      title.includes('빵') || title.includes('맛집') || title.includes('문방구')) {
    return { label: '동네가게·맛집', color: '#D97706', bg: '#FEF3C7' };
  }
  if (tags.some((t) => ['산책', '은행나무', '풍경', '물소리', '단풍'].some((k) => t.includes(k))) ||
      title.includes('산책') || title.includes('은행나무') || title.includes('풍경')) {
    return { label: '풍경·산책', color: '#059669', bg: '#D1FAE5' };
  }
  if (tags.some((t) => ['모임', '플리마켓', '이웃', '나눔', '벼룩시장'].some((k) => t.includes(k))) ||
      title.includes('나눔') || title.includes('플리마켓')) {
    return { label: '모임·클래스', color: '#7C3AED', bg: '#EDE9FE' };
  }
  if (tags.some((t) => ['골목', '추억', '일상', '기록'].some((k) => t.includes(k))) ||
      title.includes('골목') || text.includes('골목')) {
    return { label: '골목·일상', color: '#0D9488', bg: '#CCFBF1' };
  }
  return { label: '동네소식', color: '#14B8B0', bg: '#E8F8F7' };
}

export const LocalListItem: React.FC<LocalListItemProps> = ({
  feed,
  selectedTown,
  onNavigateToDetail,
  onNavigateToLocalbox,
  onShare,
  onMoreMenu,
  onRequireLogin,
}) => {
  const [isLiked, setIsLiked] = useState(feed.contentLikeYn);
  const [likeCount, setLikeCount] = useState(feed.contentLikeCount);
  const [isBookmarked, setIsBookmarked] = useState(feed.contentBookmarkYn);

  const category = getCategoryBadge(feed);
  const profileUrl = buildProfileImageUrl(feed.localboxElementDto.localboxProfileImgUrl);
  const firstImage = feed.contentFileElementDtos?.[0]?.contentFileUrl;
  const isVideo = feed.contentFileElementDtos?.[0]?.contentFileType === 'VIDEO_FILE';
  const imageCount = feed.contentFileElementDtos?.length || 0;

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
  };

  return (
    <article
      onClick={() => onNavigateToDetail(feed.contentId)}
      className="bg-white border-b border-[#F1F5F9] p-4 cursor-pointer hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors select-none group"
    >
      {/* 1. 상단 정보: 카테고리 태그 / 핀 고정 + 작성자 · 동네 · 시간 + 더보기 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* 카테고리 or 고정 뱃지 */}
          {feed.isPinnedToTopGroup ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#14B8B0] bg-[#E8F8F7] px-2 py-0.5 rounded-full shrink-0">
              <Pin size={11} className="rotate-45" /> 고정
            </span>
          ) : (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ color: category.color, backgroundColor: category.bg }}
            >
              {category.label}
            </span>
          )}

          {/* 작성자 아바타 (22px) + 작성자명 + 동네 + 상대시간 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToLocalbox(feed.localboxElementDto.localboxId);
            }}
            className="flex items-center gap-1.5 text-[12px] text-[#64748B] min-w-0 truncate hover:text-[#14B8B0] transition-colors"
          >
            <div className="w-[20px] h-[20px] rounded-full overflow-hidden bg-[#14B8B0] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={feed.localboxElementDto.localboxName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span>{feed.localboxElementDto.localboxName.charAt(0)}</span>
              )}
            </div>
            <span className="font-semibold text-[#334155] truncate max-w-[90px]">
              {feed.localboxElementDto.localboxName}
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="truncate">
              {feed.contentDisplayRateDongName || selectedTown}
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="shrink-0">{formatRelativeTime(feed.regDt)}</span>
          </div>
        </div>

        {/* 더보기 버튼 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoreMenu(feed);
          }}
          aria-label="더보기"
          className="p-1 text-[#94A3B8] hover:text-[#475569] rounded-full transition-colors cursor-pointer shrink-0"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* 2. 본문 영역: 좌측 텍스트 (제목 + 본문 미리보기 + 태그) + 우측 썸네일 (76x76) */}
      <div className="flex gap-3 items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* 제목 (15px 볼드, 최대 2줄) */}
          <h3 className="text-[15px] font-bold text-[#1E293B] leading-snug line-clamp-2 mb-1 group-hover:text-[#14B8B0] transition-colors">
            {feed.contentTitle}
          </h3>

          {/* 본문 요약 (13px, 최대 2줄) */}
          <p className="text-[13px] text-[#475569] leading-relaxed line-clamp-2 mb-2">
            {feed.contentBodyText}
          </p>

          {/* 해시태그 목록 */}
          {feed.contentHashTagElementDtos && feed.contentHashTagElementDtos.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              {feed.contentHashTagElementDtos.slice(0, 3).map((tag) => (
                <span
                  key={tag.contentHashTagId}
                  className="text-[11px] text-[#0D9488] bg-[#F0FDFA] px-1.5 py-0.5 rounded font-medium"
                >
                  #{tag.tagName}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 우측 썸네일 (78x78px) */}
        {firstImage && (
          <div className="relative w-[78px] h-[78px] rounded-[10px] overflow-hidden bg-[#F1F5F9] shrink-0 border border-[#F1F5F9]">
            <img
              src={firstImage}
              alt={feed.contentTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* 사진 수 배지 */}
            {imageCount > 1 && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold">
                +{imageCount - 1}
              </div>
            )}
            {/* 동영상 표시 */}
            {isVideo && (
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <Play size={16} fill="white" className="text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. 하단 메타 바: 위치 표시 + 인터랙션 (좋아요, 댓글, 조회수, 북마크) */}
      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-[#F8FAFC] text-[12px] text-[#64748B]">
        {/* 위치 */}
        <div className="flex items-center gap-1 text-[11px] text-[#94A3B8] truncate max-w-[170px]">
          <MapPin size={12} className="text-[#94A3B8] shrink-0" />
          <span className="truncate">
            {(feed as { address?: string }).address ||
              feed.contentDisplayRateCityName ||
              feed.contentDisplayRateDongName ||
              selectedTown}
          </span>
        </div>

        {/* 상호작용 (좋아요, 댓글, 조회수, 북마크) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* 좋아요 토글 */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isLiked ? 'text-[#EF4444] font-bold' : 'text-[#64748B] hover:text-[#EF4444]'
            }`}
          >
            <Heart size={14} fill={isLiked ? '#EF4444' : 'none'} />
            <span>{likeCount}</span>
          </button>

          {/* 댓글 수 */}
          <div className="flex items-center gap-1 text-[#64748B]">
            <MessageCircle size={14} />
            <span>{feed.contentReplyCount}</span>
          </div>

          {/* 조회수 */}
          <div className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
            <Eye size={13} />
            <span>{feed.viewCount}</span>
          </div>

          {/* 북마크 토글 */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-label="북마크"
            className={`transition-colors cursor-pointer p-0.5 ${
              isBookmarked ? 'text-[#14B8B0]' : 'text-[#94A3B8] hover:text-[#14B8B0]'
            }`}
          >
            <Bookmark size={14} fill={isBookmarked ? '#14B8B0' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
};
