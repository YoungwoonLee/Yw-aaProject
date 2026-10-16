import { useQueryClient } from '@tanstack/react-query';
import { feedKeys, toggleContentLike, toggleContentBookmark } from '../api/feedApi';
import { FeedResponse, FeedDetailContent } from '../../../types/content';

interface UseContentActionsOptions {
  onRequireLogin?: () => void;
  isLoggedIn?: boolean;
}

export function useContentActions(options?: UseContentActionsOptions) {
  const queryClient = useQueryClient();
  const isLoggedIn = options?.isLoggedIn ?? true; // 기본적으로 로그인 상태 가정 (비로그인 전환 시 콜백 호출)

  const handleToggleLike = async (contentId: number, currentLikeYn: boolean, currentCount: number) => {
    if (!isLoggedIn && options?.onRequireLogin) {
      options.onRequireLogin();
      return;
    }

    const optimisticLikeYn = !currentLikeYn;
    const optimisticCount = optimisticLikeYn ? currentCount + 1 : Math.max(0, currentCount - 1);

    // 1. 홈 피드 및 로컬탭(regional) 인피니트 쿼리 캐시 낙관적 업데이트
    const updateInfinitePages = (oldData: { pages: { result: { content: any[] } }[]; pageParams: any[] } | undefined) => {
      if (!oldData || !oldData.pages) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          result: {
            ...page.result,
            content: page.result.content.map((item) => {
              if (item.contentId === contentId) {
                return {
                  ...item,
                  contentLikeYn: optimisticLikeYn,
                  contentLikeCount: optimisticCount,
                };
              }
              return item;
            }),
          },
        })),
      };
    };

    queryClient.setQueryData(feedKeys.latest(), updateInfinitePages);
    queryClient.setQueriesData({ queryKey: ['feed', 'regional'] }, updateInfinitePages);

    // 2. 상세 페이지 캐시 낙관적 업데이트
    queryClient.setQueryData<FeedDetailContent | null>(
      feedKeys.detail(contentId),
      (oldDetail) => {
        if (!oldDetail) return oldDetail;
        return {
          ...oldDetail,
          contentLikeYn: optimisticLikeYn,
          contentLikeCount: optimisticCount,
        };
      }
    );

    // 3. 서버/목 동기화
    try {
      await toggleContentLike(contentId);
    } catch (e) {
      console.error('Failed to toggle like', e);
    }
  };

  const handleToggleBookmark = async (contentId: number, currentBookmarkYn: boolean) => {
    if (!isLoggedIn && options?.onRequireLogin) {
      options.onRequireLogin();
      return;
    }

    const optimisticBookmarkYn = !currentBookmarkYn;

    const updateBookmarkPages = (oldData: { pages: { result: { content: any[] } }[]; pageParams: any[] } | undefined) => {
      if (!oldData || !oldData.pages) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          result: {
            ...page.result,
            content: page.result.content.map((item) => {
              if (item.contentId === contentId) {
                return {
                  ...item,
                  contentBookmarkYn: optimisticBookmarkYn,
                };
              }
              return item;
            }),
          },
        })),
      };
    };

    // 1. 홈 피드 및 로컬탭(regional) 인피니트 쿼리 캐시 낙관적 업데이트
    queryClient.setQueryData(feedKeys.latest(), updateBookmarkPages);
    queryClient.setQueriesData({ queryKey: ['feed', 'regional'] }, updateBookmarkPages);

    // 2. 상세 캐시 낙관적 업데이트
    queryClient.setQueryData<FeedDetailContent | null>(
      feedKeys.detail(contentId),
      (oldDetail) => {
        if (!oldDetail) return oldDetail;
        return {
          ...oldDetail,
          contentBookmarkYn: optimisticBookmarkYn,
        };
      }
    );

    try {
      await toggleContentBookmark(contentId);
    } catch (e) {
      console.error('Failed to toggle bookmark', e);
    }
  };

  return {
    handleToggleLike,
    handleToggleBookmark,
  };
}
