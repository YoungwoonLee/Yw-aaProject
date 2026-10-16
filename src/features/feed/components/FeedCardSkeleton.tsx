import React from 'react';

export const FeedCardSkeleton: React.FC = () => {
  return (
    <article className="bg-white pb-6 border-b border-[#F3F4F6] animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-full bg-[#E5E7EB]" />
          <div className="flex flex-col gap-1.5">
            <div className="w-24 h-3.5 bg-[#E5E7EB] rounded-sm" />
            <div className="w-16 h-2.5 bg-[#F3F4F6] rounded-sm" />
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#F3F4F6]" />
      </div>

      {/* 4:3 Media Skeleton */}
      <div className="w-full aspect-[4/3] bg-[#E5E7EB]" />

      {/* Action Bar Skeleton */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-4">
          <div className="w-12 h-5 bg-[#F3F4F6] rounded-md" />
          <div className="w-12 h-5 bg-[#F3F4F6] rounded-md" />
          <div className="w-6 h-5 bg-[#F3F4F6] rounded-md" />
        </div>
        <div className="w-6 h-5 bg-[#F3F4F6] rounded-md" />
      </div>

      {/* Content Text Skeleton */}
      <div className="px-4 flex flex-col gap-2">
        <div className="w-4/5 h-4 bg-[#E5E7EB] rounded-sm" />
        <div className="w-full h-3 bg-[#F3F4F6] rounded-sm" />
        <div className="w-1/3 h-2.5 bg-[#F3F4F6] rounded-sm mt-1" />
      </div>
    </article>
  );
};
