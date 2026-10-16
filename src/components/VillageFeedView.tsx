import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, VolumeX } from 'lucide-react';
import { VillageFeed } from '../types';
import { getVillageFeeds, toggleFeedLike, toggleFeedBookmark, formatRelativeTime } from '../api/mock';

interface VillageFeedViewProps {
  onCardClick: (feedId: number) => void;
  onShareClick: (feed: VillageFeed) => void;
  onMoreClick: (feed: VillageFeed) => void;
}

const PAGE_SIZE = 4;

export const VillageFeedView: React.FC<VillageFeedViewProps> = ({
  onCardClick,
  onShareClick,
  onMoreClick,
}) => {
  const [allFeeds, setAllFeeds] = useState<VillageFeed[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Load feeds from mock API/storage
  useEffect(() => {
    const feeds = getVillageFeeds();
    setAllFeeds(feeds);
  }, []);

  // IntersectionObserver for infinite scroll (threshold 0.5)
  useEffect(() => {
    const currentTarget = observerTargetRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleCount < allFeeds.length && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate slight network delay for smooth experience
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allFeeds.length));
            setIsLoadingMore(false);
          }, 450);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(currentTarget);
    return () => {
      observer.disconnect();
    };
  }, [allFeeds.length, visibleCount, isLoadingMore]);

  // Handle Like Toggle
  const handleLike = (e: React.MouseEvent, feedId: number) => {
    e.stopPropagation();
    const result = toggleFeedLike(feedId);
    setAllFeeds((prev) =>
      prev.map((f) =>
        f.id === feedId ? { ...f, isLiked: result.isLiked, likeCount: result.count } : f
      )
    );
  };

  // Handle Bookmark Toggle
  const handleBookmark = (e: React.MouseEvent, feedId: number) => {
    e.stopPropagation();
    const isBookmarked = toggleFeedBookmark(feedId);
    setAllFeeds((prev) =>
      prev.map((f) => (f.id === feedId ? { ...f, isBookmarked } : f))
    );
  };

  const displayedFeeds = allFeeds.slice(0, visibleCount);

  return (
    <div className="bg-white pb-[90px] select-none">
      {/* Notice Banner */}
      <div
        className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-95"
        style={{
          margin: '12px 16px',
          padding: '10px 14px',
          backgroundColor: '#EBFBFC',
          borderRadius: '10px',
        }}
      >
        <span
          className="text-white text-[10px] font-extrabold flex items-center justify-center shrink-0"
          style={{
            backgroundColor: '#00B4C5',
            padding: '2px 6px',
            borderRadius: '12px',
          }}
        >
          3/3
        </span>
        <span
          className="text-[13px] font-bold truncate"
          style={{ color: '#0F172A' }}
        >
          동네이야기, 이런 것까지 기록돼요!
        </span>
      </div>

      {/* Feed Cards List */}
      <div className="flex flex-col gap-6">
        {displayedFeeds.map((feed) => {
          const imageCount = feed.imageUrls?.length || 0;
          const firstImage = feed.imageUrls?.[0] || 'https://picsum.photos/id/10/800/600';

          return (
            <article
              key={feed.id}
              className="bg-white"
              style={{
                /* card spacing 24px via flex gap-6 */
              }}
            >
              {/* Profile Row */}
              <div
                className="flex items-center justify-between"
                style={{
                  padding: '0 16px 10px',
                  gap: '10px',
                }}
              >
                <div
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  onClick={() => onCardClick(feed.id)}
                >
                  {/* Avatar 36x36 circle */}
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: '#00A7B4' }}
                  >
                    {feed.user.avatarUrl ? (
                      <img
                        src={feed.user.avatarUrl}
                        alt={feed.user.nickname}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to initial
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{feed.user.nickname.charAt(0)}</span>
                    )}
                  </div>

                  {/* Nickname & Region */}
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-[14px] font-extrabold truncate"
                      style={{ color: '#1E293B' }}
                    >
                      {feed.user.nickname}
                    </span>
                    <span
                      className="text-[11px] truncate"
                      style={{ color: '#94A3B8' }}
                    >
                      {feed.user.villageName}
                    </span>
                  </div>
                </div>

                {/* More Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreClick(feed);
                  }}
                  className="p-1 hover:opacity-75 transition-opacity cursor-pointer shrink-0"
                  aria-label="더보기 메뉴"
                >
                  <MoreVertical size={18} color="#64748B" />
                </button>
              </div>

              {/* Feed Image Container */}
              <div
                className="relative w-full bg-[#F8FAFC] cursor-pointer overflow-hidden"
                style={{ maxHeight: '420px' }}
                onClick={() => onCardClick(feed.id)}
              >
                <img
                  src={firstImage}
                  alt={feed.title}
                  className="w-full max-h-[420px] object-cover block"
                  loading="lazy"
                />

                {/* Multiple Images Badge (1/{n}) if >= 2 images */}
                {imageCount >= 2 && (
                  <div
                    className="absolute top-3 right-3 text-white text-[11px] font-bold rounded-[12px] backdrop-blur select-none pointer-events-none"
                    style={{
                      backgroundColor: 'rgba(15,23,42,0.65)',
                      padding: '3px 9px',
                    }}
                  >
                    1/{imageCount}
                  </div>
                )}

                {/* VolumeX Button on bottom right (always visible, 14px circle button) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute bottom-3 right-3 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: 'rgba(15,23,42,0.6)',
                    padding: '6px',
                  }}
                  aria-label="음소거"
                >
                  <VolumeX size={14} color="#ffffff" strokeWidth={2.2} />
                </button>
              </div>

              {/* Action Bar */}
              <div
                className="flex items-center justify-between"
                style={{ padding: '10px 16px 4px' }}
              >
                {/* Left Actions: Heart + Count, MessageCircle + Count, Send */}
                <div className="flex items-center gap-[14px]">
                  {/* Heart */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(e, feed.id)}
                    className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                    aria-label="좋아요"
                  >
                    <Heart
                      size={22}
                      color={feed.isLiked ? '#FF4D6D' : '#1E293B'}
                      fill={feed.isLiked ? '#FF4D6D' : 'none'}
                      strokeWidth={1.8}
                    />
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: '#1E293B' }}
                    >
                      {feed.likeCount}
                    </span>
                  </button>

                  {/* Comment */}
                  <button
                    type="button"
                    onClick={() => onCardClick(feed.id)}
                    className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                    aria-label="댓글"
                  >
                    <MessageCircle size={22} color="#1E293B" strokeWidth={1.8} />
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: '#1E293B' }}
                    >
                      {feed.commentCount}
                    </span>
                  </button>

                  {/* Send */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareClick(feed);
                    }}
                    className="p-0.5 hover:opacity-75 transition-opacity cursor-pointer active:scale-95"
                    aria-label="공유하기"
                  >
                    <Send size={20} color="#1E293B" strokeWidth={1.8} />
                  </button>
                </div>

                {/* Right: Bookmark */}
                <button
                  type="button"
                  onClick={(e) => handleBookmark(e, feed.id)}
                  className="p-0.5 cursor-pointer active:scale-95 transition-transform"
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

              {/* Content Row: Title, Summary, Meta */}
              <div
                className="cursor-pointer"
                style={{ padding: '4px 16px 0' }}
                onClick={() => onCardClick(feed.id)}
              >
                {/* Title */}
                <h3
                  className="text-[15px] font-extrabold leading-[1.35] mb-1 hover:text-[#00B4C5] transition-colors"
                  style={{ color: '#0F172A' }}
                >
                  {feed.title}
                </h3>

                {/* Summary (2-line clamp) */}
                <p
                  className="text-[13px] leading-[1.45] line-clamp-2 mb-1.5"
                  style={{ color: '#475569' }}
                >
                  {feed.summary}
                </p>

                {/* Meta: {n}시간전 · 👁 {viewCount}회 */}
                <div
                  className="text-[11px] flex items-center gap-1.5 font-medium"
                  style={{ color: '#94A3B8' }}
                >
                  <span>{formatRelativeTime(feed.createdAt)}</span>
                  <span>·</span>
                  <span>👁 {feed.viewCount}회</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Infinite Scroll Trigger & Indicator */}
      <div ref={observerTargetRef} className="py-6 flex justify-center items-center">
        {isLoadingMore ? (
          <span className="text-[12px] font-medium" style={{ color: '#94A3B8' }}>
            콘텐츠를 더 불러오는 중...
          </span>
        ) : visibleCount < allFeeds.length ? (
          <span className="text-[12px] font-medium opacity-50" style={{ color: '#94A3B8' }}>
            스크롤하여 더 보기
          </span>
        ) : (
          <span className="text-[12px] font-medium opacity-60" style={{ color: '#94A3B8' }}>
            모든 동네이야기를 확인했습니다
          </span>
        )}
      </div>
    </div>
  );
};
