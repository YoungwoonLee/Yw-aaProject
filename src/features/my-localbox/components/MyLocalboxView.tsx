import React, { useState, useEffect, useRef } from 'react';
import {
  MoreVertical,
  LayoutGrid,
  List,
  Play,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Share2,
  User,
  BarChart2,
  MapPin,
  Bell,
  Ban,
  Archive,
  Pin,
  Megaphone,
  HelpCircle,
  Settings,
  LogOut,
  Camera,
  Ticket,
  CalendarCheck,
} from 'lucide-react';
import {
  INITIAL_MY_PROFILE,
  MY_HOME_CONTENTS,
  MY_RESIDENT_CONTENTS,
  MyLocalboxItem,
  MyLocalboxProfile,
} from '../mocks/myLocalboxData';
import { MyContentDetailView } from './MyContentDetailView';

type MyTabType = 'home' | 'resident' | 'intro';
type ViewModeType = 'grid' | 'list';

interface MyLocalboxViewProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  onShowToast?: (message: string) => void;
  onOpenTownPicker?: () => void;
  onBack?: () => void;
  onNavigateToExperience?: (subScreen?: 'list' | 'reservations' | 'create') => void;
}

const PAGE_SIZE = 20;

export const MyLocalboxView: React.FC<MyLocalboxViewProps> = ({
  containerRef,
  onShowToast,
  onOpenTownPicker,
  onBack,
  onNavigateToExperience,
}) => {
  // React state로 모든 상태 관리 (외부 API / localStorage 미사용)
  const [profile, setProfile] = useState<MyLocalboxProfile>(INITIAL_MY_PROFILE);
  const [activeTab, setActiveTab] = useState<MyTabType>('home');
  const [homeViewMode, setHomeViewMode] = useState<ViewModeType>('grid');
  const [residentViewMode, setResidentViewMode] = useState<ViewModeType>('grid');

  // 콘텐츠 상태 (좋아요, 북마크 토글 반영)
  const [homeItems, setHomeItems] = useState<MyLocalboxItem[]>(MY_HOME_CONTENTS);
  const [residentItems, setResidentItems] = useState<MyLocalboxItem[]>(
    MY_RESIDENT_CONTENTS
  );

  // 상세 화면 열림 상태 (선택된 콘텐츠 ID, 뒤로가기 시 마이 화면 탭·보기방식·스크롤 그대로 유지)
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null
  );

  // 무한 스크롤 페이지네이션 개수 (20개씩 증가)
  const [homeVisibleCount, setHomeVisibleCount] = useState<number>(PAGE_SIZE);
  const [residentVisibleCount, setResidentVisibleCount] =
    useState<number>(PAGE_SIZE);

  // 소개 탭 더보기/접기 상태
  const [isIntroExpanded, setIsIntroExpanded] = useState<boolean>(false);

  // 우측에서 밀려 들어오는 전체 메뉴 화면 상태
  const [isFullMenuOpen, setIsFullMenuOpen] = useState<boolean>(false);

  // 프로필 편집 서브 화면 상태
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(profile.name);
  const [editIntro, setEditIntro] = useState<string>(profile.intro);
  const [editHashtags, setEditHashtags] = useState<string>(
    profile.hashtags.join(' ')
  );
  const [editAvatarSeed, setEditAvatarSeed] = useState<number>(1);

  // 북마크 모아보기 서브 화면 상태
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState<boolean>(false);

  // 내부 토스트 폴백
  const [internalToast, setInternalToast] = useState<string | null>(null);

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  const notify = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      setInternalToast(msg);
      setTimeout(() => setInternalToast(null), 2200);
    }
  };

  // 무한 스크롤: 아래로 스크롤하면 20개씩 더 불러오기
  useEffect(() => {
    if (activeTab === 'intro') return;
    if (typeof IntersectionObserver === 'undefined') return;

    const target = loadMoreTriggerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;

        if (activeTab === 'home') {
          setHomeVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, homeItems.length)
          );
        } else if (activeTab === 'resident') {
          setResidentVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, residentItems.length)
          );
        }
      },
      {
        root: containerRef?.current || null,
        rootMargin: '160px',
        threshold: 0.05,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    activeTab,
    homeViewMode,
    residentViewMode,
    homeItems.length,
    residentItems.length,
    containerRef,
  ]);

  // 좋아요 토글 핸들러
  const handleToggleLike = (tab: 'home' | 'resident', id: number) => {
    const updater = (items: MyLocalboxItem[]) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const nextLiked = !item.isLiked;
        return {
          ...item,
          isLiked: nextLiked,
          likeCount: nextLiked
            ? item.likeCount + 1
            : Math.max(0, item.likeCount - 1),
        };
      });

    if (tab === 'home') {
      setHomeItems(updater);
    } else {
      setResidentItems(updater);
    }
  };

  // 북마크 토글 핸들러
  const handleToggleBookmark = (tab: 'home' | 'resident', id: number) => {
    const updater = (items: MyLocalboxItem[]) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const nextBookmarked = !item.isBookmarked;
        notify(
          nextBookmarked ? '북마크에 저장했습니다.' : '북마크를 해제했습니다.'
        );
        return {
          ...item,
          isBookmarked: nextBookmarked,
        };
      });

    if (tab === 'home') {
      setHomeItems(updater);
    } else {
      setResidentItems(updater);
    }
  };

  // 프로필 편집 열기
  const handleOpenEditProfile = () => {
    setEditName(profile.name);
    setEditIntro(profile.intro);
    setEditHashtags(profile.hashtags.join(' '));
    setIsEditProfileOpen(true);
  };

  // 프로필 편집 저장
  const handleSaveProfile = () => {
    const parsedTags = editHashtags
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    setProfile((prev) => ({
      ...prev,
      name: editName.trim() || '동네 러너',
      intro: editIntro.trim() || prev.intro,
      hashtags: parsedTags.length > 0 ? parsedTags : ['#성남', '#산책', '#기록'],
    }));
    setIsEditProfileOpen(false);
    notify('로컬박스 프로필이 수정되었습니다.');
  };

  const currentViewMode =
    activeTab === 'home' ? homeViewMode : residentViewMode;
  const setCurrentViewMode =
    activeTab === 'home' ? setHomeViewMode : setResidentViewMode;

  const visibleHomeItems = homeItems.slice(0, homeVisibleCount);
  const visibleResidentItems = residentItems.slice(0, residentVisibleCount);
  const currentItems =
    activeTab === 'home' ? visibleHomeItems : visibleResidentItems;
  const totalCount =
    activeTab === 'home' ? homeItems.length : residentItems.length;
  const hasMore = currentItems.length < totalCount;

  const bookmarkedItems = [
    ...homeItems.filter((i) => i.isBookmarked),
    ...residentItems.filter((i) => i.isBookmarked),
  ];

  // 상세 화면용 선택 콘텐츠 조회 (닫힐 때 250ms 애니메이션 동안 이전 아이템 유지)
  const lastSelectedItemRef = useRef<MyLocalboxItem | null>(null);
  const activeDetailItem =
    selectedContentId !== null
      ? homeItems.find((i) => i.id === selectedContentId) ||
        residentItems.find((i) => i.id === selectedContentId) ||
        null
      : null;
  if (activeDetailItem) {
    lastSelectedItemRef.current = activeDetailItem;
  }
  const detailItemToRender = activeDetailItem || lastSelectedItemRef.current;

  // 전체 메뉴 섹션 정의 (6. 전체 메뉴 화면)
  const menuSections = [
    {
      title: '로컬박스 관리',
      items: [
        {
          id: 'share',
          icon: Share2,
          title: '로컬박스 공유하기',
          desc: '내 로컬박스 주소를 복사해 이웃에게 공유해요',
          onClick: () => notify('로컬박스 링크가 복사되었습니다.'),
        },
        {
          id: 'account',
          icon: User,
          title: '회원 정보',
          desc: '내 계정 정보와 로그인 연결을 관리해요',
          onClick: () => {
            setIsFullMenuOpen(false);
            handleOpenEditProfile();
          },
        },
        {
          id: 'insight',
          icon: BarChart2,
          title: '인사이트',
          desc: '내 콘텐츠 조회수와 활동 동네 통계를 확인해요',
          onClick: () =>
            notify('최근 30일 조회수 1,420회 · 금광동 도달률 1위입니다.'),
        },
        {
          id: 'town-setting',
          icon: MapPin,
          title: '동네 설정',
          desc: '주로 활동하는 우리 동네를 설정하고 인증해요',
          onClick: () => {
            setIsFullMenuOpen(false);
            if (onOpenTownPicker) {
              onOpenTownPicker();
            } else {
              notify('현재 활동 동네: 경기도 성남시 중원구 금광동');
            }
          },
        },
        {
          id: 'subscribe',
          icon: Bell,
          title: '주민소식 구독',
          desc: '관심 동네의 새로운 주민소식 알림을 받아봐요',
          onClick: () => notify('성남시 중원구 금광동 주민소식을 구독 중입니다.'),
        },
        {
          id: 'blocked',
          icon: Ban,
          title: '차단 사용자 관리',
          desc: '차단한 로컬박스 및 사용자를 관리해요',
          onClick: () => notify('차단된 사용자가 없습니다.'),
        },
      ],
    },
    {
      title: '콘텐츠 관리',
      items: [
        {
          id: 'bookmark',
          icon: Bookmark,
          title: '북마크',
          desc: `다시 보려고 저장한 콘텐츠 ${bookmarkedItems.length}개`,
          onClick: () => setIsBookmarkModalOpen(true),
        },
        {
          id: 'archive',
          icon: Archive,
          title: '보관함',
          desc: '나만 볼 수 있도록 보관한 콘텐츠를 확인해요',
          onClick: () => notify('보관함에 저장된 콘텐츠가 없습니다.'),
        },
        {
          id: 'pin-resident',
          icon: Pin,
          title: '주민소식 붙이기',
          desc: '우리 동네에 알리고 싶은 공모전·행사 소식을 등록해요',
          onClick: () => notify('주민소식 붙이기 신청 화면을 준비 중입니다.'),
        },
        {
          id: 'experience-reservations',
          icon: Ticket,
          title: '내 체험 예약 티켓',
          desc: '신청한 동네 원데이 클래스·모임 예약 내역 및 체크인',
          onClick: () => {
            setIsFullMenuOpen(false);
            if (onNavigateToExperience) {
              onNavigateToExperience('reservations');
            } else {
              notify('체험 예약 내역으로 이동합니다.');
            }
          },
        },
        {
          id: 'experience-create',
          icon: CalendarCheck,
          title: '체험 프로그램 등록',
          desc: '이웃과 함께할 원데이 클래스·소모임을 직접 개설해요',
          onClick: () => {
            setIsFullMenuOpen(false);
            if (onNavigateToExperience) {
              onNavigateToExperience('create');
            } else {
              notify('체험 프로그램 등록 화면으로 이동합니다.');
            }
          },
        },
      ],
    },
    {
      title: '고객 지원 및 설정',
      items: [
        {
          id: 'notice',
          icon: Megaphone,
          title: '공지사항',
          desc: '온닫이의 새로운 기능과 안내 소식을 확인해요',
          onClick: () => notify('온닫이 로컬박스 업데이트 안내 (v1.4.0)'),
        },
        {
          id: 'cs',
          icon: HelpCircle,
          title: '고객센터',
          desc: '자주 묻는 질문과 1:1 문의를 이용할 수 있어요',
          onClick: () => notify('고객센터 운영시간: 평일 09:00 ~ 18:00'),
        },
        {
          id: 'settings',
          icon: Settings,
          title: '환경 설정',
          desc: '알림 설정, 약관 및 버전 정보를 확인해요',
          onClick: () => notify('현재 최신 버전(v1.4.0)을 사용 중입니다.'),
        },
        {
          id: 'logout',
          icon: LogOut,
          title: '로그아웃',
          desc: '현재 로그인된 계정에서 로그아웃해요',
          onClick: () => notify('프로토타입 화면에서는 로그인 상태가 유지됩니다.'),
        },
      ],
    },
  ];

  return (
    <div className="w-full min-h-full bg-white text-[#1E1E1E] flex flex-col relative select-none pb-10">
      {/* 1. 상단 바 */}
      <header className="w-full h-[52px] px-4 flex items-center justify-between bg-white border-b border-[#EEEEEE] shrink-0">
        <h1
          role="button"
          tabIndex={0}
          aria-label="뒤로가기"
          onClick={() => {
            if (selectedContentId !== null) {
              setSelectedContentId(null);
            } else if (isBookmarkModalOpen) {
              setIsBookmarkModalOpen(false);
            } else if (isEditProfileOpen) {
              setIsEditProfileOpen(false);
            } else if (isFullMenuOpen) {
              setIsFullMenuOpen(false);
            } else if (onBack) {
              onBack();
            } else if (activeTab !== 'home') {
              setActiveTab('home');
            } else {
              window.history.back();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
          className="text-[17px] font-bold text-[#1E1E1E] tracking-tight truncate cursor-pointer flex items-center gap-1.5 hover:opacity-80 active:opacity-60 transition-opacity"
        >
          <ChevronLeft size={20} className="text-[#1E1E1E] -ml-1 shrink-0" />
          <span className="truncate">{profile.name}</span>
        </h1>
        <button
          type="button"
          onClick={() => setIsFullMenuOpen(true)}
          aria-label="전체 메뉴 열기"
          className="w-9 h-9 -mr-1.5 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors cursor-pointer"
        >
          <MoreVertical size={20} className="text-[#1E1E1E]" />
        </button>
      </header>

      {/* 2. 프로필 영역 */}
      <section className="px-4 pt-4 pb-3 bg-white">
        <div className="flex items-start gap-3.5">
          {/* 왼쪽: 원형 프로필 사진 60px */}
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-[60px] h-[60px] rounded-full object-cover shrink-0 border border-[#EEEEEE] bg-[#F5F5F5]"
          />

          {/* 가운데 위 통계 + 오른쪽 편집 버튼 + 아래 동네/오늘 방문 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              {/* 숫자 통계 2개를 가로로: 260 / 콘텐츠, 91 / 팔로워 */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-start">
                  <span className="text-[15px] font-bold text-[#1E1E1E] leading-tight">
                    {profile.contentCount}
                  </span>
                  <span className="text-[13px] font-normal text-[#1E1E1E] leading-tight mt-0.5">
                    콘텐츠
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[15px] font-bold text-[#1E1E1E] leading-tight">
                    {profile.followerCount}
                  </span>
                  <span className="text-[13px] font-normal text-[#1E1E1E] leading-tight mt-0.5">
                    팔로워
                  </span>
                </div>
              </div>

              {/* 오른쪽: 편집 버튼 (연회색 #F0F0F0 배경, 13px 굵게, 모서리 6px, 폭 약 66px) */}
              <button
                type="button"
                onClick={handleOpenEditProfile}
                className="w-[66px] h-[32px] bg-[#F0F0F0] hover:bg-[#E6E6E6] active:bg-[#DCDCDC] text-[#1E1E1E] text-[13px] font-bold rounded-[6px] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                편집
              </button>
            </div>

            {/* 통계 아래: 작은 회색 글씨 경기도 성남시 중원구 금광동 | 오늘 2 (12px, #7F7F7F, |는 더 연한 색) */}
            <p className="text-[12px] text-[#7F7F7F] mt-2 leading-snug truncate">
              <span>{profile.region}</span>
              <span className="mx-1.5 text-[#D4D4D4]">|</span>
              <span>오늘 {profile.todayVisitors}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. 활동 동네 비율 영역 */}
      <section className="px-4 pb-4 bg-white">
        {/* 폭 100%의 얇은 가로 막대(높이 4px, 둥근 끝, 배경 #EEEEEE)를 동네 비율만큼 3가지 틸 농도로 나눠 채운다 */}
        <div className="w-full h-[4px] rounded-full bg-[#EEEEEE] overflow-hidden flex">
          {profile.dongRatios.map((dong) => (
            <div
              key={dong.name}
              style={{
                width: `${dong.barPercent}%`,
                backgroundColor: dong.color,
              }}
              className="h-full transition-all duration-300"
            />
          ))}
        </div>

        {/* 그 아래 연회색 둥근 박스 안에 범례를 가운데 정렬로 한 줄 배치 */}
        <div className="mt-2 w-full bg-[#F5F5F5] rounded-[6px] py-2 px-2.5 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
          {profile.dongRatios.map((dong) => (
            <div
              key={dong.name}
              className="flex items-center gap-1 text-[11px] text-[#1E1E1E] whitespace-nowrap"
            >
              <span
                className="inline-block w-[6px] h-[6px] rounded-full shrink-0"
                style={{ backgroundColor: dong.color }}
              />
              <span className="text-[#7F7F7F]">{dong.name}</span>
              <span className="font-semibold text-[#1E1E1E]">
                {dong.percent}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 탭 메뉴 (스크롤해도 화면 위에 붙어 있는 sticky) */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EEEEEE]">
        <div className="grid grid-cols-3 w-full">
          {(
            [
              { id: 'home', label: '홈' },
              { id: 'resident', label: '주민' },
              { id: 'intro', label: '소개' },
            ] as const
          ).map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative h-[44px] flex items-center justify-center text-[14px] transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-[#1E1E1E] font-bold'
                    : 'text-[#B3B3B3] font-medium hover:text-[#7F7F7F]'
                }`}
              >
                <span>{tab.label}</span>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1E1E1E]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. 탭 내용 */}
      <div className="flex-1 bg-white flex flex-col">
        {/* 5-1. 홈 탭 & 5-2. 주민 탭 공통 격자/목록 레이아웃 */}
        {(activeTab === 'home' || activeTab === 'resident') && (
          <div className="flex flex-col">
            {/* 오른쪽 위에 보기 전환 아이콘 2개: 격자(2×2 사각형) / 목록(가로 막대) */}
            <div className="px-4 py-2.5 flex items-center justify-end gap-2 bg-white">
              <button
                type="button"
                onClick={() => setCurrentViewMode('grid')}
                aria-label="격자 보기"
                className={`p-1 transition-colors cursor-pointer ${
                  currentViewMode === 'grid'
                    ? 'text-[#1E1E1E]'
                    : 'text-[#B3B3B3] hover:text-[#7F7F7F]'
                }`}
              >
                <LayoutGrid size={18} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentViewMode('list')}
                aria-label="목록 보기"
                className={`p-1 transition-colors cursor-pointer ${
                  currentViewMode === 'list'
                    ? 'text-[#1E1E1E]'
                    : 'text-[#B3B3B3] hover:text-[#7F7F7F]'
                }`}
              >
                <List size={19} strokeWidth={2.2} />
              </button>
            </div>

            {/* 격자 보기(기본): 2열 그리드, 열 간격 6px, 행 간격 16px */}
            {currentViewMode === 'grid' ? (
              <div className="px-4 pb-6 grid grid-cols-2 gap-x-[6px] gap-y-[16px]">
                {currentItems.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => setSelectedContentId(item.id)}
                    className="flex flex-col cursor-pointer group"
                  >
                    {/* 정사각형 썸네일(모서리 각짐, object-cover) */}
                    <div className="w-full aspect-square bg-[#F5F5F5] relative overflow-hidden rounded-none">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                      {/* 동영상 콘텐츠는 썸네일 오른쪽 위에 흰색 재생(▶) 아이콘 */}
                      {item.isVideo && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/35 flex items-center justify-center">
                          <Play
                            size={13}
                            className="text-white fill-white ml-0.5"
                          />
                        </div>
                      )}
                    </div>
                    {/* 썸네일 아래 제목 13px, 최대 2줄 말줄임 */}
                    <h3 className="mt-2 text-[13px] leading-[1.38] text-[#1E1E1E] line-clamp-2 break-keep">
                      {item.title}
                    </h3>
                  </article>
                ))}
              </div>
            ) : (
              /* 목록 보기: 홈 피드형 큰 카드 + 카드 사이 8px 연회색 띠로 구분 */
              <div className="flex flex-col pb-6">
                {currentItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <article
                      onClick={() => setSelectedContentId(item.id)}
                      className="w-full bg-white flex flex-col cursor-pointer"
                    >
                      {/* 폭 100% 정사각 이미지(동영상이면 오른쪽 위 ▶) */}
                      <div className="w-full aspect-square bg-[#F5F5F5] relative overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        {item.isVideo && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
                            <Play
                              size={15}
                              className="text-white fill-white ml-0.5"
                            />
                          </div>
                        )}
                      </div>

                      {/* 아이콘 줄 + 제목 + 본문 미리보기 + 날짜·조회수 */}
                      <div className="px-4 pt-3 pb-4">
                        {/* 아이콘 줄: 하트(좋아요한 상태면 빨강으로 채움) + 숫자, 말풍선 + 숫자, 종이비행기(공유) / 오른쪽 끝 북마크 */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLike(
                                  activeTab === 'home' ? 'home' : 'resident',
                                  item.id
                                );
                              }}
                              className="flex items-center gap-1 text-[#1E1E1E] cursor-pointer"
                            >
                              <Heart
                                size={20}
                                className={
                                  item.isLiked
                                    ? 'text-[#FF3B30] fill-[#FF3B30]'
                                    : 'text-[#1E1E1E]'
                                }
                              />
                              <span className="text-[13px] font-medium">
                                {item.likeCount}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContentId(item.id);
                              }}
                              className="flex items-center gap-1 text-[#1E1E1E] cursor-pointer"
                            >
                              <MessageCircle size={20} />
                              <span className="text-[13px] font-medium">
                                {item.commentCount}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                notify('콘텐츠 링크가 복사되었습니다.');
                              }}
                              aria-label="공유하기"
                              className="flex items-center text-[#1E1E1E] cursor-pointer"
                            >
                              <Send size={19} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(
                                activeTab === 'home' ? 'home' : 'resident',
                                item.id
                              );
                            }}
                            aria-label="북마크"
                            className="flex items-center text-[#1E1E1E] cursor-pointer"
                          >
                            <Bookmark
                              size={20}
                              className={
                                item.isBookmarked
                                  ? 'text-[#14B8B0] fill-[#14B8B0]'
                                  : 'text-[#1E1E1E]'
                              }
                            />
                          </button>
                        </div>

                        {/* 제목 15px 굵게 1줄 말줄임 */}
                        <h3 className="text-[15px] font-bold text-[#1E1E1E] truncate">
                          {item.title}
                        </h3>

                        {/* 본문 미리보기 14px #7F7F7F 2줄 말줄임 */}
                        <p className="mt-1 text-[14px] text-[#7F7F7F] leading-[1.45] line-clamp-2">
                          {item.body}
                        </p>

                        {/* 2일전 · 👁 16회 (12px #B3B3B3) */}
                        <div className="mt-2 flex items-center gap-1 text-[12px] text-[#B3B3B3]">
                          <span>{item.dateLabel}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Eye size={13} className="text-[#B3B3B3]" />
                            <span>{item.viewCount}회</span>
                          </span>
                        </div>
                      </div>
                    </article>

                    {/* 카드 사이 8px 연회색 띠로 구분 */}
                    {index < currentItems.length - 1 && (
                      <div className="w-full h-[8px] bg-[#F5F5F5]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* 무한 스크롤 감지 트리거 (20개씩 추가 로드) */}
            <div
              ref={loadMoreTriggerRef}
              className="w-full py-4 flex items-center justify-center text-[12px] text-[#B3B3B3]"
            >
              {hasMore ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'home') {
                      setHomeVisibleCount((prev) =>
                        Math.min(prev + PAGE_SIZE, homeItems.length)
                      );
                    } else {
                      setResidentVisibleCount((prev) =>
                        Math.min(prev + PAGE_SIZE, residentItems.length)
                      );
                    }
                  }}
                  className="px-3 py-1.5 rounded bg-[#F5F5F5] text-[#7F7F7F] text-[12px] cursor-pointer"
                >
                  콘텐츠 더 불러오는 중... ({currentItems.length}/{totalCount})
                </button>
              ) : (
                <span>모든 콘텐츠를 불러왔습니다.</span>
              )}
            </div>
          </div>
        )}

        {/* 5-3. 소개 탭 */}
        {activeTab === 'intro' && (
          <div className="p-4 flex-1 flex flex-col bg-white min-h-[380px]">
            {/* 연회색 둥근 박스 */}
            <div className="w-full bg-[#F5F5F5] rounded-[8px] p-4">
              {/* 첫 줄: 로컬박스 이름(13px 굵게) */}
              <h3 className="text-[13px] font-bold text-[#1E1E1E]">
                {profile.name}
              </h3>

              {/* 그 아래 소개글(13px), 처음엔 3줄까지만 보이고 마지막 줄은 흐려지는 그라데이션 처리 */}
              <div className="relative mt-2">
                <p
                  className={`text-[13px] text-[#1E1E1E] leading-[1.6] whitespace-pre-line ${
                    !isIntroExpanded ? 'line-clamp-3' : ''
                  }`}
                >
                  {profile.intro}
                </p>

                {!isIntroExpanded && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5]/85 to-transparent" />
                )}
              </div>

              {/* 가운데 더보기 ⌄ 버튼 → 누르면 전체 펼침, 접기 ⌃로 바뀜 */}
              <div className="mt-2.5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsIntroExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#7F7F7F] hover:text-[#1E1E1E] py-1 px-2 cursor-pointer"
                >
                  <span>{isIntroExpanded ? '접기' : '더보기'}</span>
                  {isIntroExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* 박스 아래 해시태그 칩들: #성남 #산책 #기록 (연회색 배경, 12px, 모서리 4px) */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#F5F5F5] text-[#7F7F7F] text-[12px] rounded-[4px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 콘텐츠가 없으면 나머지는 빈 흰 공간 */}
            <div className="flex-1 bg-white" />
          </div>
        )}
      </div>

      {/* 6. 전체 메뉴 화면 (⋮ 눌렀을 때 오른쪽에서 밀려 들어오는 전체 화면 흰 페이지) */}
      <div
        className={`fixed inset-0 z-50 flex justify-center pointer-events-none transition-opacity duration-300 ${
          isFullMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="w-full max-w-[430px] h-full bg-white flex flex-col overflow-hidden relative">
          <div
            className={`w-full h-full bg-white flex flex-col transition-transform duration-300 ease-out ${
              isFullMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* 상단 바: 왼쪽 위 < 뒤로가기 */}
            <div className="h-[52px] px-3 border-b border-[#EEEEEE] flex items-center gap-2 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setIsFullMenuOpen(false)}
                aria-label="뒤로가기"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] cursor-pointer"
              >
                <ChevronLeft size={24} className="text-[#1E1E1E]" />
              </button>
              <span className="text-[16px] font-bold text-[#1E1E1E]">
                전체 메뉴
              </span>
            </div>

            {/* 메뉴 리스트 */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
              {menuSections.map((section, sIdx) => (
                <div key={section.title}>
                  <div className="px-4 pt-5 pb-2">
                    {/* 섹션 제목 (12px #7F7F7F) */}
                    <h2 className="text-[12px] font-medium text-[#7F7F7F] mb-2">
                      {section.title}
                    </h2>

                    <div className="flex flex-col">
                      {section.items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={item.onClick}
                            className="w-full py-3 flex items-center gap-3.5 text-left hover:bg-[#FAFAFA] active:bg-[#F5F5F5] rounded-[8px] px-1 transition-colors cursor-pointer"
                          >
                            {/* 왼쪽 원형 테두리 안 회색 아이콘(36px) */}
                            <div className="w-[36px] h-[36px] rounded-full border border-[#E5E5E5] flex items-center justify-center shrink-0 text-[#7F7F7F] bg-white">
                              <IconComponent size={17} strokeWidth={1.9} />
                            </div>

                            {/* 제목(14px 굵게) + 보조 설명(12px #7F7F7F) */}
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] font-bold text-[#1E1E1E] leading-snug">
                                {item.title}
                              </div>
                              <div className="text-[12px] text-[#7F7F7F] mt-0.5 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {sIdx < menuSections.length - 1 && (
                    <div className="w-full h-[8px] bg-[#F5F5F5] mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 프로필 편집 화면 (편집 버튼 클릭 시) */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/30">
          <div className="w-full max-w-[430px] h-full bg-white flex flex-col">
            <div className="h-[52px] px-3 border-b border-[#EEEEEE] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] cursor-pointer"
                >
                  <ChevronLeft size={24} className="text-[#1E1E1E]" />
                </button>
                <span className="text-[16px] font-bold text-[#1E1E1E]">
                  로컬박스 편집
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-3.5 py-1.5 rounded-[6px] bg-[#59BFB3] text-white text-[13px] font-bold cursor-pointer"
              >
                저장
              </button>
            </div>

            <div className="p-4 flex flex-col gap-5 overflow-y-auto">
              <div className="flex flex-col items-center py-2">
                <div className="relative">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-[76px] h-[76px] rounded-full object-cover border border-[#EEEEEE]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextSeed = editAvatarSeed + 1;
                      setEditAvatarSeed(nextSeed);
                      setProfile((prev) => ({
                        ...prev,
                        avatarUrl: `https://picsum.photos/seed/ondaji-runner-${nextSeed}/600/600`,
                      }));
                    }}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#14B8B0] text-white flex items-center justify-center border-2 border-white cursor-pointer"
                    aria-label="프로필 이미지 변경"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <span className="text-[12px] text-[#7F7F7F] mt-2">
                  카메라 아이콘을 눌러 프로필 사진을 변경해보세요
                </span>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#7F7F7F] mb-1.5">
                  로컬박스 이름
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[6px] border border-[#E5E5E5] text-[14px] text-[#1E1E1E] focus:outline-none focus:border-[#14B8B0]"
                  placeholder="로컬박스 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#7F7F7F] mb-1.5">
                  소개글
                </label>
                <textarea
                  rows={5}
                  value={editIntro}
                  onChange={(e) => setEditIntro(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[6px] border border-[#E5E5E5] text-[14px] text-[#1E1E1E] leading-relaxed focus:outline-none focus:border-[#14B8B0]"
                  placeholder="로컬박스 소개글을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#7F7F7F] mb-1.5">
                  해시태그 (공백으로 구분)
                </label>
                <input
                  type="text"
                  value={editHashtags}
                  onChange={(e) => setEditHashtags(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[6px] border border-[#E5E5E5] text-[14px] text-[#1E1E1E] focus:outline-none focus:border-[#14B8B0]"
                  placeholder="#성남 #산책 #기록"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 북마크 모아보기 서브 화면 */}
      {isBookmarkModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/30">
          <div className="w-full max-w-[430px] h-full bg-white flex flex-col">
            <div className="h-[52px] px-3 border-b border-[#EEEEEE] flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsBookmarkModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] cursor-pointer"
              >
                <ChevronLeft size={24} className="text-[#1E1E1E]" />
              </button>
              <span className="text-[16px] font-bold text-[#1E1E1E]">
                북마크 ({bookmarkedItems.length})
              </span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 gap-x-[6px] gap-y-[16px] content-start">
              {bookmarkedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setIsBookmarkModalOpen(false);
                    setIsFullMenuOpen(false);
                    setSelectedContentId(item.id);
                  }}
                  className="flex flex-col cursor-pointer"
                >
                  <div className="w-full aspect-square bg-[#F5F5F5] relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-1.5 text-[13px] text-[#1E1E1E] line-clamp-2">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. 콘텐츠 상세 화면 (격자나 목록의 콘텐츠를 누르면 오른쪽에서 250ms로 밀려 들어옴) */}
      <MyContentDetailView
        item={detailItemToRender}
        profile={profile}
        isOpen={selectedContentId !== null}
        onClose={() => setSelectedContentId(null)}
        onToggleLike={(id) => {
          const isHome = homeItems.some((i) => i.id === id);
          handleToggleLike(isHome ? 'home' : 'resident', id);
        }}
        onToggleBookmark={(id) => {
          const isHome = homeItems.some((i) => i.id === id);
          handleToggleBookmark(isHome ? 'home' : 'resident', id);
        }}
        onShowToast={notify}
      />

      {/* 내부 토스트 알림 */}
      {internalToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] bg-[#1E1E1E]/90 text-white text-[13px] px-4 py-2.5 rounded-full">
          {internalToast}
        </div>
      )}
    </div>
  );
};
