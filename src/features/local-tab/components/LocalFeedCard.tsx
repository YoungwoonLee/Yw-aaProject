import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  MapPin,
  Play,
} from 'lucide-react';
import { FeedContent } from '../../../types/content';
import { MediaCarousel } from '../../feed/components/MediaCarousel';
import { formatRelativeTime } from '../../../shared/lib/relativeTime';

interface LocalFeedCardProps {
  feed: FeedContent;
  viewMode: 'feed' | 'grid';
  onNavigateToDetail: (contentId: number) => void;
  onNavigateToLocalbox: (localboxId: number) => void;
  onShare: (feed: FeedContent) => void;
  onMoreMenu: (feed: FeedContent) => void;
  onRequireLogin: () => void;
}

export const LocalFeedCard: React.FC<LocalFeedCardProps> = ({
  feed,
  viewMode,
  onNavigateToDetail,
  onNavigateToLocalbox,
  onShare,
  onMoreMenu,
  onRequireLogin,
}) => {
  const [isLiked, setIsLiked] = useState(feed.contentLikeYn);
  const [likeCount, setLikeCount] = useState(feed.contentLikeCount);
  const [isBookmarked, setIsBookmarked] = useState(feed.contentBookmarkYn);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
  };

  // 1. Grid Mode
  if (viewMode === 'grid') {
    const mainImg = feed.contentFileElementDtos[0]?.contentFileUrl;
    const isVideo = feed.contentFileElementDtos[0]?.contentFileType === 'VIDEO_FILE';

    return (
      <div
        onClick={() => onNavigateToDetail(feed.contentId)}
        className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F1F5F9] cursor-pointer shadow-2xs hover:shadow-md transition-all border border-[#E2E8F0]"
      >
        {mainImg ? (
          <img
            src={mainImg}
            alt={feed.contentTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full p-3 flex flex-col justify-center bg-gradient-to-br from-[#E8F8F7] to-[#F1F5F9]">
            <span className="text-[10px] font-bold text-[#14B8B0] mb-1">
              {feed.contentDisplayRateDongName}
            </span>
            <p className="text-[12px] font-bold text-[#1E293B] line-clamp-3">
              {feed.contentTitle}
            </p>
          </div>
        )}

        {/* Video Icon Badge */}
        {isVideo && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
            <Play size={10} fill="white" />
          </div>
        )}

        {/* Dong Badge */}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {feed.contentDisplayRateDongName}
          </span>
        </div>

        {/* Bottom Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white text-[11px] font-bold line-clamp-1 mb-1">
            {feed.contentTitle}
          </p>
          <div className="flex items-center justify-between text-[10px] text-white/80">
            <span className="truncate max-w-[80px]">
              {feed.localboxElementDto.localboxName}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="flex items-center gap-0.5">
                <Heart size={10} fill="white" /> {likeCount}
              </span>
              <span className="flex items-center gap-0.5">
                <MessageCircle size={10} /> {feed.contentReplyCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Feed View Mode
  return (
    <article
      onClick={() => onNavigateToDetail(feed.contentId)}
      className="bg-white border-b border-[#F1F5F9] cursor-pointer hover:bg-[#FAFAFA] transition-colors select-none"
    >
      {/* Author Header Row */}
      <div className="p-4 pb-2.5 flex items-center justify-between">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onNavigateToLocalbox(feed.localboxElementDto.localboxId);
          }}
          className="flex items-center gap-2.5 group/author cursor-pointer"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E2E8F0] shrink-0 border border-black/5">
            {feed.localboxElementDto.localboxProfileImgUrl ? (
              <img
                src={feed.localboxElementDto.localboxProfileImgUrl}
                alt={feed.localboxElementDto.localboxName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-white bg-[#14B8B0] text-sm">
                {feed.localboxElementDto.localboxName.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-[#0F172A] group-hover/author:text-[#14B8B0] transition-colors">
                {feed.localboxElementDto.localboxName}
              </span>
              <span className="text-[10px] font-bold text-[#14B8B0] bg-[#E8F8F7] px-1.5 py-0.2 rounded-full">
                로컬박스
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mt-0.5">
              <span>{formatRelativeTime(feed.regDt)}</span>
              <span>·</span>
              <span className="text-[#64748B] font-medium flex items-center gap-0.5">
                <MapPin size={11} className="text-[#14B8B0]" />
                {feed.contentDisplayRateDongName}
              </span>
              {feed.contentDisplayRateDongs.length > 0 && (
                <span className="text-[#14B8B0] font-semibold text-[10px]">
                  {feed.contentDisplayRateDongs[0].percentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* More Menu */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoreMenu(feed);
          }}
          aria-label="더보기"
          className="p-1 text-[#94A3B8] hover:text-[#475569] rounded-full transition-colors cursor-pointer"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Title & Body */}
      <div className="px-4 pb-2.5">
        <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug mb-1">
          {feed.contentTitle}
        </h3>
        <p className="text-[13px] text-[#475569] line-clamp-2 leading-relaxed">
          {feed.contentBodyText}
        </p>
      </div>

      {/* Media Carousel */}
      {feed.contentFileElementDtos.length > 0 && (
        <div className="mb-3 px-4">
          <div className="rounded-2xl overflow-hidden border border-[#F1F5F9] shadow-2xs">
            <MediaCarousel
              files={feed.contentFileElementDtos}
              contentTitle={feed.contentTitle}
            />
          </div>
        </div>
      )}

      {/* HashTags */}
      {feed.contentHashTagElementDtos.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {feed.contentHashTagElementDtos.map((tag) => (
            <span
              key={tag.contentHashTagId}
              className="text-[11px] text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-full font-medium"
            >
              #{tag.tagName}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="px-4 py-2.5 border-t border-[#F8FAFC] flex items-center justify-between text-[#64748B]">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            type="button"
            onClick={handleToggleLike}
            className="flex items-center gap-1.5 text-[12px] font-semibold hover:text-[#EF4444] transition-colors cursor-pointer"
          >
            <Heart
              size={18}
              className={`transition-transform active:scale-125 ${
                isLiked ? 'text-[#EF4444] fill-[#EF4444]' : 'text-[#64748B]'
              }`}
            />
            <span className={isLiked ? 'text-[#EF4444]' : ''}>{likeCount}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToDetail(feed.contentId);
            }}
            className="flex items-center gap-1.5 text-[12px] font-semibold hover:text-[#14B8B0] transition-colors cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>{feed.contentReplyCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            aria-label="북마크"
            className="p-1.5 hover:text-[#14B8B0] transition-colors cursor-pointer"
          >
            <Bookmark
              size={18}
              className={isBookmarked ? 'text-[#14B8B0] fill-[#14B8B0]' : 'text-[#94A3B8]'}
            />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare(feed);
            }}
            aria-label="공유"
            className="p-1.5 hover:text-[#14B8B0] transition-colors cursor-pointer"
          >
            <Share2 size={18} className="text-[#94A3B8]" />
          </button>
        </div>
      </div>
    </article>
  );
};
