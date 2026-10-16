import React, { useState } from 'react';
import { ChevronLeft, MoreVertical, Heart, MessageCircle, Send, Bookmark, MapPin, Play } from 'lucide-react';
import { VillageFeed } from '../types';
import { toggleFeedLike, toggleFeedBookmark, formatRelativeTime } from '../api/mock';

interface ContentDetailViewProps {
  feed: VillageFeed;
  onBack: () => void;
  onMoreClick: () => void;
  onShareClick: () => void;
  onShowToast: (msg: string) => void;
}

export const ContentDetailView: React.FC<ContentDetailViewProps> = ({
  feed: initialFeed,
  onBack,
  onMoreClick,
  onShareClick,
  onShowToast,
}) => {
  const [feed, setFeed] = useState<VillageFeed>(initialFeed);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const images = feed.imageUrls || ['https://picsum.photos/id/10/800/600'];

  const handleLike = () => {
    const res = toggleFeedLike(feed.id);
    setFeed({ ...feed, isLiked: res.isLiked, likeCount: res.count });
  };

  const handleBookmark = () => {
    const isBookmarked = toggleFeedBookmark(feed.id);
    setFeed({ ...feed, isBookmarked });
    onShowToast(isBookmarked ? '북마크에 저장되었습니다.' : '북마크가 취소되었습니다.');
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    onShowToast(isFollowing ? '팔로우를 취소했습니다.' : `${feed.user.nickname}님을 팔로우했습니다.`);
  };

  return (
    <div className="bg-white min-h-screen pb-[120px] select-none max-w-[480px] mx-auto relative">
      {/* Sticky Header: "‹" + "⋮" */}
      <div className="sticky top-0 z-20 bg-white min-h-[52px] px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} color="#1E293B" />
        </button>
        <button
          type="button"
          onClick={onMoreClick}
          className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
          aria-label="더보기"
        >
          <MoreVertical size={20} color="#64748B" />
        </button>
      </div>

      {/* Author Row */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#F8FAFC]">
        <div className="flex items-center gap-3">
          {/* Avatar 40px */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: '#00A7B4' }}
          >
            {feed.user.avatarUrl ? (
              <img src={feed.user.avatarUrl} alt={feed.user.nickname} className="w-full h-full object-cover" />
            ) : (
              <span>{feed.user.nickname.charAt(0)}</span>
            )}
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-[#1E293B]">{feed.user.nickname}</h3>
            {/* Engagement Rate: 11px #00B4C5 */}
            <span className="text-[11px] font-bold text-[#00B4C5]">
              {feed.authorEngagementRate || '소통율 100%'}
            </span>
          </div>
        </div>

        {/* + 팔로우 Button */}
        <button
          type="button"
          onClick={handleFollowToggle}
          className={`text-[12px] font-bold transition-colors cursor-pointer ${
            isFollowing ? 'bg-[#F3F4F6] text-[#6B7280]' : 'text-white'
          }`}
          style={{
            backgroundColor: isFollowing ? '#F3F4F6' : '#00B4C5',
            borderRadius: '16px',
            padding: '6px 14px',
          }}
        >
          {isFollowing ? '팔로잉' : '+ 팔로우'}
        </button>
      </div>

      {/* Media: Height 280px */}
      <div className="relative w-full h-[280px] bg-[#F8FAFC] overflow-hidden">
        <img
          src={images[currentImgIndex]}
          alt={feed.title}
          className="w-full h-full object-cover"
        />

        {/* Video Overlay if isVideo */}
        {feed.isVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
            <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center text-white mb-2">
              <Play size={28} className="ml-1" />
            </div>
            {feed.videoDuration && (
              <span className="text-[11px] text-white font-medium bg-black/50 px-2 py-0.5 rounded-full">
                {feed.videoDuration}
              </span>
            )}
          </div>
        )}

        {/* Multiple image badge: n/m */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 text-white text-[11px] font-bold bg-black/60 px-2.5 py-1 rounded-[12px] backdrop-blur-xs">
            {currentImgIndex + 1}/{images.length}
          </div>
        )}

        {/* Next/Prev buttons if multiple images */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              disabled={currentImgIndex === 0}
              onClick={() => setCurrentImgIndex((prev) => Math.max(0, prev - 1))}
              className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center pointer-events-auto disabled:opacity-0 cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              disabled={currentImgIndex === images.length - 1}
              onClick={() => setCurrentImgIndex((prev) => Math.min(images.length - 1, prev + 1))}
              className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center pointer-events-auto disabled:opacity-0 cursor-pointer"
            >
              ›
            </button>
          </div>
        )}

        {/* Carousel Dots: 6px */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className="w-[6px] h-[6px] rounded-full transition-colors"
                style={{
                  backgroundColor: currentImgIndex === idx ? '#00B4C5' : '#D1D5DB',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col gap-3">
        {/* Location Chip: bg #F3F4F6, radius 12px */}
        {feed.locationName && (
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 bg-[#F3F4F6] rounded-[12px] text-[12px] text-[#475569] font-medium">
            <MapPin size={13} color="#00B4C5" strokeWidth={2.2} />
            <span>{feed.locationName}</span>
          </div>
        )}

        {/* Title: 16px/800 */}
        <h1 className="text-[16px] font-extrabold text-[#0F172A] leading-snug">
          {feed.title}
        </h1>

        {/* Body: 14px lh 1.6 pre-wrap */}
        <p className="text-[14px] text-[#374151] leading-[1.6] whitespace-pre-wrap">
          {feed.content || feed.summary}
        </p>

        {/* Meta: {작성일} · 조회 {n} 11px */}
        <div className="text-[11px] text-[#94A3B8] pt-2 border-t border-[#F8FAFC]">
          <span>{formatRelativeTime(feed.createdAt)}</span>
          <span className="mx-1.5">·</span>
          <span>조회 {feed.viewCount}회</span>
        </div>

        {/* Tags: 12px #00B4C5 bg #F0FDFA */}
        {feed.tags && feed.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {feed.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[12px] font-semibold text-[#00B4C5] bg-[#F0FDFA] px-2.5 py-1 rounded-[8px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar (above GNB): Heart · Comment · Share · Bookmark */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white/95 backdrop-blur border-t border-[#F3F4F6] z-20 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Heart */}
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Heart
              size={22}
              color={feed.isLiked ? '#FF4D6D' : '#1E293B'}
              fill={feed.isLiked ? '#FF4D6D' : 'none'}
              strokeWidth={1.8}
            />
            <span className="text-[13px] font-bold text-[#1E293B]">{feed.likeCount}</span>
          </button>

          {/* Comment */}
          <div className="flex items-center gap-1.5 text-[#1E293B]">
            <MessageCircle size={22} strokeWidth={1.8} />
            <span className="text-[13px] font-bold">{feed.commentCount}</span>
          </div>

          {/* Share */}
          <button
            type="button"
            onClick={onShareClick}
            className="cursor-pointer active:scale-95 text-[#1E293B] p-0.5"
            aria-label="공유하기"
          >
            <Send size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          className="cursor-pointer active:scale-95 p-0.5"
          aria-label="북마크"
        >
          <Bookmark
            size={22}
            color={feed.isBookmarked ? '#00A7B4' : '#1E293B'}
            fill={feed.isBookmarked ? '#00A7B4' : 'none'}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
};
