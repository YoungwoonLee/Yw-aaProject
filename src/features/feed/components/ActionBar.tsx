import React from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface ActionBarProps {
  contentId: number;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  likeCount,
  replyCount,
  isLiked,
  isBookmarked,
  onToggleLike,
  onToggleBookmark,
  onCommentClick,
  onShareClick,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 select-none">
      {/* Left Actions: Heart, Reply, Share */}
      <div className="flex items-center gap-2">
        {/* Like Button */}
        <button
          type="button"
          onClick={onToggleLike}
          aria-label={`좋아요 ${likeCount}개`}
          aria-pressed={isLiked}
          className="min-w-[44px] min-h-[44px] flex items-center gap-1.5 p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform cursor-pointer"
        >
          <Heart
            size={22}
            color={isLiked ? '#FF4D6D' : '#1E293B'}
            fill={isLiked ? '#FF4D6D' : 'none'}
            strokeWidth={1.8}
          />
          <span className="text-[13px] font-bold text-[#1E293B]">
            {likeCount}
          </span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          onClick={onCommentClick}
          aria-label={`댓글 ${replyCount}개`}
          className="min-w-[44px] min-h-[44px] flex items-center gap-1.5 p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform cursor-pointer"
        >
          <MessageCircle size={22} color="#1E293B" strokeWidth={1.8} />
          <span className="text-[13px] font-bold text-[#1E293B]">
            {replyCount}
          </span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onShareClick}
          aria-label="공유하기"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform cursor-pointer"
        >
          <Send size={20} color="#1E293B" strokeWidth={1.8} />
        </button>
      </div>

      {/* Right Action: Bookmark */}
      <button
        type="button"
        onClick={onToggleBookmark}
        aria-label="북마크"
        aria-pressed={isBookmarked}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 -mr-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform cursor-pointer"
      >
        <Bookmark
          size={22}
          color={isBookmarked ? '#14B8B0' : '#1E293B'}
          fill={isBookmarked ? '#14B8B0' : 'none'}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
};
