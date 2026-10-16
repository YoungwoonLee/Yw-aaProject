/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './shared/ui/Header';
import { BottomNav, NavTab } from './shared/ui/BottomNav';
import { BottomSheet } from './shared/ui/BottomSheet';
import { Toast } from './shared/ui/Toast';
import { LoginPromptModal } from './shared/ui/LoginPromptModal';
import { HomeFeed } from './features/feed/components/HomeFeed';
import { HomeFAB } from './features/feed/components/HomeFAB';
import { ContentDetail } from './features/content-detail/components/ContentDetail';
import { ResidentNewsFeed } from './features/resident-news/components/ResidentNewsFeed';
import { ResidentNewsDetail } from './features/resident-news/components/ResidentNewsDetail';
import { LocalFeedView } from './features/local-tab/components/LocalFeedView';
import { TownPicker } from './features/local-tab/components/TownPicker';
import { useLocalTabStore } from './features/local-tab/store/useLocalTabStore';
import { MyLocalboxView } from './features/my-localbox/components/MyLocalboxView';
import { LocalboxView } from './components/LocalboxView';
import {
  ExperienceView,
  ExperienceSubScreen,
} from './features/experience/ExperienceView';
import { SEED_USERS } from './api/mock';
import { FeedContent, FeedDetailContent } from './types/content';
import { ResidentNewsContent } from './types/resident';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}

function AppShell() {
  const {
    feedMode,
    selectedTown,
    myTown,
    setFeedMode,
    setSelectedTown,
    setMyTown,
  } = useLocalTabStore();

  // /villages 경로는 홈(LATEST)과 로컬탭(REGIONAL)이 공유하고 feedMode로 구분한다
  const [currentRoute, setCurrentRoute] = useState<{
    path:
      | 'villages'
      | 'detail'
      | 'residents'
      | 'resident-detail'
      | 'experience'
      | 'localbox'
      | 'my'
      | 'other';
    contentId?: number;
    localboxId?: number;
    programId?: number;
    experienceSub?: ExperienceSubScreen;
    anchor?: string;
    fromTab?: NavTab;
  }>({ path: 'villages' });

  const [otherTab, setOtherTab] = useState<'nearby' | 'experience' | 'my'>('nearby');
  const [experienceSubScreen, setExperienceSubScreen] =
    useState<ExperienceSubScreen>('list');
  const [isTownPickerOpen, setIsTownPickerOpen] = useState(false);
  const [activeBottomSheetFeed, setActiveBottomSheetFeed] = useState<
    FeedContent | FeedDetailContent | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const mobileFrameRef = useRef<HTMLDivElement>(null);

  // 현재 활성 하단 GnB 탭 계산 (/villages 재진입 시 마지막 feedMode 기억)
  const activeTab: NavTab =
    currentRoute.path === 'villages'
      ? feedMode === 'REGIONAL'
        ? 'town'
        : 'home'
      : currentRoute.path === 'residents' ||
        currentRoute.path === 'resident-detail'
      ? 'residents'
      : currentRoute.path === 'experience'
      ? 'experience'
      : currentRoute.path === 'my'
      ? 'my'
      : currentRoute.fromTab || otherTab;

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNavigateToDetail = (contentId: number, anchor?: string) => {
    setCurrentRoute({ path: 'detail', contentId, anchor, fromTab: activeTab });
    if (mobileFrameRef.current) {
      mobileFrameRef.current.scrollTop = 0;
    }
  };

  const handleNavigateToResidentDetail = (contentId: number) => {
    setCurrentRoute({ path: 'resident-detail', contentId, fromTab: activeTab });
    if (mobileFrameRef.current) {
      mobileFrameRef.current.scrollTop = 0;
    }
  };

  const handleNavigateToLocalbox = (localboxId: number) => {
    setCurrentRoute({ path: 'localbox', localboxId, fromTab: activeTab });
    if (mobileFrameRef.current) {
      mobileFrameRef.current.scrollTop = 0;
    }
  };

  const handleBackToFeed = () => {
    setCurrentRoute({ path: 'villages' });
  };

  const handleBackToResidents = () => {
    setCurrentRoute({ path: 'residents' });
  };

  const handleShare = async (feed: FeedContent | FeedDetailContent) => {
    const url = `${window.location.origin}/villages/detail/${feed.contentId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: feed.contentTitle,
          text: feed.contentBodyText.slice(0, 80),
          url,
        });
        return;
      } catch {
        // 클립보드 폴백
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('소식 링크가 클립보드에 복사되었습니다.');
    } catch {
      showToast('링크를 복사하지 못했습니다.');
    }
  };

  const handleShareResident = async (item: ResidentNewsContent) => {
    const url = `${window.location.origin}/residents/detail/${item.contentId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.contentTitle,
          text: item.contentBodyText.slice(0, 80),
          url,
        });
        return;
      } catch {
        // 클립보드 폴백
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('주민소식 링크가 클립보드에 복사되었습니다.');
    } catch {
      showToast('링크를 복사하지 못했습니다.');
    }
  };

  const handleBottomSheetAction = (action: 'report' | 'share' | 'hide') => {
    if (!activeBottomSheetFeed) return;
    if (action === 'share') {
      handleShare(activeBottomSheetFeed);
    } else if (action === 'report') {
      showToast('신고가 접수되었습니다. 검토 후 조치됩니다.');
    } else if (action === 'hide') {
      showToast('해당 작성자의 소식을 피드에서 숨깁니다.');
    }
  };

  const handleTabChange = (tab: NavTab) => {
    if (mobileFrameRef.current) {
      mobileFrameRef.current.scrollTop = 0;
    }
    if (tab === 'home') {
      setFeedMode('LATEST');
      setCurrentRoute({ path: 'villages' });
    } else if (tab === 'town') {
      setFeedMode('REGIONAL');
      setCurrentRoute({ path: 'villages' });
    } else if (tab === 'residents') {
      setCurrentRoute({ path: 'residents' });
    } else if (tab === 'experience') {
      setOtherTab('experience');
      setExperienceSubScreen('list');
      setCurrentRoute({
        path: 'experience',
        experienceSub: 'list',
        programId: undefined,
        fromTab: activeTab,
      });
    } else if (tab === 'my') {
      setOtherTab('my');
      setCurrentRoute({
        path: 'my',
        fromTab: activeTab !== 'my' ? activeTab : currentRoute.fromTab || 'home',
      });
    } else {
      setOtherTab('nearby');
      setCurrentRoute({ path: 'other', fromTab: tab });
    }
  };

  const isDetailView =
    currentRoute.path === 'detail' || currentRoute.path === 'resident-detail';
  const isVillagesView = currentRoute.path === 'villages';
  const isHomeFeedView = isVillagesView && feedMode === 'LATEST';
  const isRegionalFeedView = isVillagesView && feedMode === 'REGIONAL';
  const isResidentsView = currentRoute.path === 'residents';
  const isExperienceView = currentRoute.path === 'experience';
  const isMyView = currentRoute.path === 'my';

  return (
    <div className="w-full min-h-screen bg-[#EAF3F2] flex items-center justify-center font-sans antialiased text-[#1E1E1E] select-none">
      {/* 430px 고정 모바일 뷰 (배경 흰색, 그림자 없음, 얇은 회색 구분선 위주) */}
      <div className="w-full max-w-[430px] h-[100dvh] bg-white border-x border-[#EEEEEE] relative flex flex-col overflow-hidden">
        {/* 상단 고정 헤더: 홈(좌측 비어있음), 로컬탭/체험 목록(좌측 틸 위치 핀 아이콘), 주민 목록 */}
        {(isVillagesView ||
          isResidentsView ||
          (isExperienceView && experienceSubScreen === 'list')) && (
          <Header
            mode={
              isRegionalFeedView
                ? 'regional'
                : isExperienceView
                ? 'experience'
                : isResidentsView
                ? 'residents'
                : 'latest'
            }
            townName={selectedTown.areaName}
            onTownClick={() => setIsTownPickerOpen(true)}
            onSearchClick={() =>
              showToast(`${selectedTown.areaName} 이야기 검색 기능 준비 중입니다.`)
            }
            onBellClick={() => showToast('알림 목록을 확인합니다.')}
          />
        )}

        {/* 화면 라우팅 - 스크롤 위임 컨테이너 */}
        <main
          ref={mobileFrameRef}
          className="flex-1 w-full overflow-y-auto no-scrollbar relative"
        >
          {/* 1. 홈 피드 (/villages, feedMode === 'LATEST') */}
          {isHomeFeedView && (
            <HomeFeed
              containerRef={mobileFrameRef}
              onNavigateToDetail={handleNavigateToDetail}
              onNavigateToLocalbox={handleNavigateToLocalbox}
              onOpenMoreMenu={(feed) => setActiveBottomSheetFeed(feed)}
              onShare={handleShare}
              onRequireLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {/* 2. 로컬탭 (/villages, feedMode === 'REGIONAL') - GnB 2번째 탭 */}
          {isRegionalFeedView && (
            <LocalFeedView
              containerRef={mobileFrameRef}
              selectedTown={selectedTown}
              onNavigateToDetail={handleNavigateToDetail}
              onNavigateToLocalbox={handleNavigateToLocalbox}
              onShare={handleShare}
              onMoreMenu={(feed) => setActiveBottomSheetFeed(feed)}
              onRequireLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {/* 3. 콘텐츠 상세 (/villages/detail/[contentId]) */}
          {currentRoute.path === 'detail' && currentRoute.contentId && (
            <ContentDetail
              contentId={currentRoute.contentId}
              targetAnchor={currentRoute.anchor}
              onBack={handleBackToFeed}
              onNavigateToLocalbox={handleNavigateToLocalbox}
              onOpenMoreMenu={(feed) => setActiveBottomSheetFeed(feed)}
              onShare={handleShare}
              onRequireLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {/* 4. 주민 탭 (/residents) */}
          {isResidentsView && (
            <ResidentNewsFeed
              containerRef={mobileFrameRef}
              onNavigateToDetail={handleNavigateToResidentDetail}
              onNavigateToLocalbox={handleNavigateToLocalbox}
              onShare={handleShareResident}
              onRequireLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {/* 5. 주민소식 상세 (/residents/detail/[contentId]) */}
          {currentRoute.path === 'resident-detail' && currentRoute.contentId && (
            <ResidentNewsDetail
              contentId={currentRoute.contentId}
              onBack={handleBackToResidents}
              onNavigateToLocalbox={handleNavigateToLocalbox}
              onShare={handleShareResident}
              onRequireLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {/* 6. 체험 탭 (/experience) - 연결과 마이 사이 5번째 GnB 탭 */}
          {isExperienceView && (
            <ExperienceView
              townName={selectedTown.areaName}
              containerRef={mobileFrameRef}
              initialScreen={currentRoute.experienceSub || 'list'}
              initialProgramId={currentRoute.programId}
              onSubScreenChange={(sub) => setExperienceSubScreen(sub)}
              onShowToast={showToast}
              onRequireLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {/* 7. 마이 탭 (나의 로컬박스) - GnB 6번째 탭 */}
          {isMyView && (
            <MyLocalboxView
              containerRef={mobileFrameRef}
              onShowToast={showToast}
              onOpenTownPicker={() => setIsTownPickerOpen(true)}
              onNavigateToExperience={(subScreen = 'list') => {
                setExperienceSubScreen(subScreen);
                setCurrentRoute({
                  path: 'experience',
                  experienceSub: subScreen,
                  fromTab: 'my',
                });
              }}
              onBack={() => {
                const prevTab = currentRoute.fromTab;
                if (prevTab && prevTab !== 'my') {
                  handleTabChange(prevTab);
                } else {
                  setCurrentRoute({ path: 'villages' });
                }
              }}
            />
          )}

          {/* 8. 타인 로컬박스 프로필 화면 (/localbox/detail/{localboxId}) */}
          {currentRoute.path === 'localbox' && (
            <div className="flex flex-col min-h-full bg-white">
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur px-4 py-2.5 border-b border-[#F1F5F9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (currentRoute.fromTab === 'residents') {
                      setCurrentRoute({ path: 'residents' });
                    } else if (currentRoute.fromTab === 'experience') {
                      setCurrentRoute({ path: 'experience' });
                    } else {
                      setCurrentRoute({ path: 'villages' });
                    }
                  }}
                  className="flex items-center gap-1 text-[13px] font-bold text-[#14B8B0] cursor-pointer hover:underline"
                >
                  ← 돌아가기
                </button>
                <span className="text-[14px] font-bold text-[#1E293B]">
                  로컬박스 채널
                </span>
                <div className="w-12" />
              </div>

              <LocalboxView
                user={{
                  ...SEED_USERS[0],
                  id: currentRoute.localboxId || 1,
                  nickname:
                    currentRoute.localboxId === 101
                      ? '금광동 마을기록가'
                      : currentRoute.localboxId === 2
                      ? '창동 산책러'
                      : '도봉산 자락 지킴이',
                  regionText: selectedTown.areaName,
                  villageName: `${selectedTown.areaName} 85%`,
                }}
                onSelectFeed={(feedId) => handleNavigateToDetail(feedId)}
                onSelectSiot={(programId) => {
                  setExperienceSubScreen('detail');
                  setCurrentRoute({
                    path: 'experience',
                    experienceSub: 'detail',
                    programId,
                    fromTab: 'experience',
                  });
                }}
                onLogout={() => showToast('로그아웃되었습니다.')}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* 9. 기타 GnB 라우트 안내 (연결 탭) */}
          {currentRoute.path === 'other' && (
            <div className="p-6 text-center select-none pt-24">
              <div className="w-16 h-16 rounded-full bg-[#E6F7F6] text-[#14B8B0] flex items-center justify-center text-2xl mx-auto mb-3">
                🧭
              </div>
              <h2 className="text-[17px] font-bold text-[#1E293B] mb-1">
                동네 연결 탭 준비 중
              </h2>
              <p className="text-[13px] text-[#64748B] mb-6 leading-relaxed">
                이웃과 함께하는 원데이 클래스와 소모임은 새로 오픈한{' '}
                <strong className="text-[#14B8B0]">체험 탭</strong>에서 바로 이용하실 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => handleTabChange('experience')}
                className="px-5 py-2.5 rounded-full bg-[#14B8B0] text-white font-bold text-[13px] cursor-pointer hover:bg-[#119E97] transition-colors"
              >
                우리 동네 체험 보러가기
              </button>
            </div>
          )}
        </main>

        {/* FAB + 말풍선: 홈 피드 및 로컬탭(/villages)에서 표시 */}
        {isVillagesView && (
          <HomeFAB
            onWriteClick={() =>
              showToast('글쓰기 폼은 준비 중입니다. (TODO: 확인필요)')
            }
          />
        )}

        {/* 하단 GnB (2번째 탭 라벨 = 현재 선택된 동네명, 예: 금광동) */}
        {!isDetailView && (
          <BottomNav
            currentTab={activeTab}
            townName={selectedTown.areaName}
            onTabChange={handleTabChange}
          />
        )}

        {/* 더보기 바텀시트 */}
        <BottomSheet
          isOpen={activeBottomSheetFeed !== null}
          onClose={() => setActiveBottomSheetFeed(null)}
          onSelectAction={handleBottomSheetAction}
        />

        {/* 동네 변경 전체 화면 지도 <TownPicker /> */}
        <TownPicker
          isOpen={isTownPickerOpen}
          selectedTown={selectedTown}
          myTown={myTown}
          onSelectTown={(town) => setSelectedTown(town)}
          onSetMyTown={(town) => setMyTown(town)}
          onClose={() => setIsTownPickerOpen(false)}
          onShowToast={showToast}
        />

        {/* 로그인 유도 모달 */}
        <LoginPromptModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={() => {
            setIsLoginModalOpen(false);
            showToast('로그인 화면으로 이동합니다.');
          }}
        />

        {/* 토스트 알림 */}
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </div>
    </div>
  );
}
