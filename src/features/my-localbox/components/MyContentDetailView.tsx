import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  VolumeX,
  Volume2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Eye,
  Pin,
  Edit3,
  Archive,
  Share2,
  Trash2,
} from 'lucide-react';
import {
  MyLocalboxItem,
  MyLocalboxProfile,
  MyContentComment,
} from '../mocks/myLocalboxData';

interface MyContentDetailViewProps {
  item: MyLocalboxItem | null;
  profile: MyLocalboxProfile;
  isOpen: boolean;
  onClose: () => void;
  onToggleLike: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  onShowToast: (message: string) => void;
}

function formatRemainingTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export const MyContentDetailView: React.FC<MyContentDetailViewProps> = ({
  item,
  profile,
  isOpen,
  onClose,
  onToggleLike,
  onToggleBookmark,
  onShowToast,
}) => {
  // 캐러셀 슬라이드 인덱스
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // 동영상 상태: 음소거(기본 true), 재생중(기본 true), 남은 시간(기본 29초 -> 00:29)
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(29);

  // 이미지 로딩 완료 상태 (주민소식 포스터형 원본 비율 #F7F7F7 자리 표시용)
  const [loadedMediaIds, setLoadedMediaIds] = useState<Record<string, boolean>>(
    {}
  );

  // 위치 줄 지도 카드 펼침 상태
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  // 작성자 전용 더보기 메뉴(⋮) 열림 상태
  const [isAuthorMenuOpen, setIsAuthorMenuOpen] = useState<boolean>(false);

  // 댓글 목록 및 입력창 상태
  const [comments, setComments] = useState<MyContentComment[]>([]);
  const [commentInput, setCommentInput] = useState<string>('');

  // 마우스 드래그 스와이프용 ref
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const dragStateRef = useRef<{
    isDown: boolean;
    startX: number;
    startScrollLeft: number;
    didMove: boolean;
  }>({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    didMove: false,
  });

  const detailScrollRef = useRef<HTMLDivElement | null>(null);
  const commentSectionRef = useRef<HTMLDivElement | null>(null);

  // 아이템이 바뀔 때 상세 내부 상태 초기화
  useEffect(() => {
    if (!item) return;
    setCurrentSlide(0);
    setIsMuted(true);
    setIsPlaying(true);
    const firstVideo = item.mediaList.find((m) => m.type === 'VIDEO');
    setRemainingSeconds(firstVideo?.durationSeconds ?? 29);
    setIsMapExpanded(false);
    setIsAuthorMenuOpen(false);
    setComments(item.comments || []);
    setCommentInput('');
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
    if (detailScrollRef.current) {
      detailScrollRef.current.scrollTop = 0;
    }
  }, [item?.id]);

  // 현재 슬라이드가 동영상인지 확인하고 자동 재생 / 일시정지 제어
  useEffect(() => {
    if (!item || !isOpen) return;

    item.mediaList.forEach((media, idx) => {
      if (media.type !== 'VIDEO') return;
      const videoEl = videoRefs.current[idx];
      if (!videoEl) return;

      if (idx === currentSlide) {
        videoEl.muted = isMuted;
        setIsPlaying(true);
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // jsdom 등 비디오 재생 미지원 환경 무시
          });
        }
      } else {
        try {
          videoEl.pause();
        } catch {
          // ignore
        }
      }
    });
  }, [currentSlide, item, isOpen]);

  // 음소거 변경 시 활성 비디오 반영
  useEffect(() => {
    const activeVideo = videoRefs.current[currentSlide];
    if (activeVideo) {
      activeVideo.muted = isMuted;
    }
  }, [isMuted, currentSlide]);

  // 동영상 슬라이드가 화면에 보일 때 남은 시간 00:29에서 1초마다 줄어드는 타이머 (반복 재생)
  useEffect(() => {
    if (!item || !isOpen) return;
    const currentMedia = item.mediaList[currentSlide];
    if (!currentMedia || currentMedia.type !== 'VIDEO' || !isPlaying) return;

    const initialDuration = currentMedia.durationSeconds ?? 29;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? initialDuration : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [item, isOpen, currentSlide, isPlaying]);

  if (!item) return null;

  const isVillageNews = item.contentType === 'VILLAGE_NEWS';
  const mediaList = item.mediaList || [];
  const totalSlides = mediaList.length;

  // 스크롤 이벤트로 현재 슬라이드 인덱스 계산
  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el || el.clientWidth === 0) return;
    const nextIdx = Math.round(el.scrollLeft / el.clientWidth);
    if (nextIdx !== currentSlide && nextIdx >= 0 && nextIdx < totalSlides) {
      setCurrentSlide(nextIdx);
    }
  };

  // 특정 슬라이드로 이동
  const scrollToSlide = (targetIdx: number) => {
    const clamped = Math.max(0, Math.min(totalSlides - 1, targetIdx));
    setCurrentSlide(clamped);
    const el = carouselRef.current;
    if (el && el.clientWidth > 0) {
      el.scrollTo({
        left: clamped * el.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  // 마우스 드래그 스와이프 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el || totalSlides <= 1) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      didMove: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    const el = carouselRef.current;
    if (!state.isDown || !el) return;
    const deltaX = e.clientX - state.startX;
    if (Math.abs(deltaX) > 6) {
      state.didMove = true;
    }
    el.scrollLeft = state.startScrollLeft - deltaX;
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.isDown) return;
    const deltaX = e.clientX - state.startX;
    state.isDown = false;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0 && currentSlide < totalSlides - 1) {
        scrollToSlide(currentSlide + 1);
      } else if (deltaX > 0 && currentSlide > 0) {
        scrollToSlide(currentSlide - 1);
      } else {
        scrollToSlide(currentSlide);
      }
    }
  };

  // 영상 탭하면 일시정지/재생 토글
  const handleToggleVideoPlay = (slideIdx: number) => {
    if (dragStateRef.current.didMove) {
      dragStateRef.current.didMove = false;
      return;
    }
    const videoEl = videoRefs.current[slideIdx];
    if (isPlaying) {
      setIsPlaying(false);
      try {
        videoEl?.pause();
      } catch {
        // ignore
      }
    } else {
      setIsPlaying(true);
      try {
        const p = videoEl?.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch {
        // ignore
      }
    }
  };

  // 인스타그램식 최대 5개 점 인디케이터 계산
  const getInstagramDots = () => {
    if (totalSlides <= 5) {
      return Array.from({ length: totalSlides }, (_, idx) => ({
        index: idx,
        isCurrent: idx === currentSlide,
        size: 'normal' as const,
      }));
    }

    // totalSlides > 5일 때 현재 위치 기준으로 최대 5개 창 계산
    let start = Math.max(0, Math.min(currentSlide - 2, totalSlides - 5));
    const end = start + 4;

    return Array.from({ length: 5 }, (_, offset) => {
      const idx = start + offset;
      const isCurrent = idx === currentSlide;
      const isLeftEdgeShrunk = offset === 0 && start > 0;
      const isRightEdgeShrunk = offset === 4 && end < totalSlides - 1;
      const isSecondEdgeMedium =
        (offset === 1 && start > 0) ||
        (offset === 3 && end < totalSlides - 1);

      let size: 'normal' | 'medium' | 'small' = 'normal';
      if (!isCurrent) {
        if (isLeftEdgeShrunk || isRightEdgeShrunk) {
          size = 'small';
        } else if (isSecondEdgeMedium) {
          size = 'medium';
        }
      }

      return {
        index: idx,
        isCurrent,
        size,
      };
    });
  };

  const visibleDots = getInstagramDots();

  // 작성자 전용 더보기 메뉴 항목 (동네소식 / 주민소식 구분)
  const authorMenuItems = isVillageNews
    ? [
        {
          id: 'pin',
          icon: Pin,
          label: '대표 콘텐츠로 고정',
          danger: false,
        },
        {
          id: 'edit',
          icon: Edit3,
          label: '수정하기',
          danger: false,
        },
        {
          id: 'archive',
          icon: Archive,
          label: '보관함으로 이동',
          danger: false,
        },
        {
          id: 'share',
          icon: Share2,
          label: '공유하기',
          danger: false,
        },
        {
          id: 'delete',
          icon: Trash2,
          label: '삭제하기',
          danger: true,
        },
      ]
    : [
        {
          id: 'pin-resident',
          icon: Pin,
          label: '주민소식 상단 고정',
          danger: false,
        },
        {
          id: 'edit',
          icon: Edit3,
          label: '수정하기',
          danger: false,
        },
        {
          id: 'archive',
          icon: Archive,
          label: '보관함으로 이동',
          danger: false,
        },
        {
          id: 'share',
          icon: Share2,
          label: '공유하기',
          danger: false,
        },
        {
          id: 'delete',
          icon: Trash2,
          label: '삭제하기',
          danger: true,
        },
      ];

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center pointer-events-none ${
        isOpen ? 'pointer-events-auto' : ''
      }`}
      aria-hidden={!isOpen}
    >
      {/* 폭 430px 모바일 화면 안에서 오른쪽에서 밀려 들어오는 애니메이션(250ms) */}
      <div className="w-full max-w-[430px] h-full overflow-hidden relative">
        <div
          className={`w-full h-full bg-white flex flex-col transition-transform duration-[250ms] ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* 1. 상단 바 (스크롤해도 위에 고정, 흰 배경, 아래 1px #EEEEEE 선, 높이 48px, 왼쪽 < 뒤로가기 / 오른쪽 ⋮ 더보기, 가운데 제목 없음) */}
          <header className="sticky top-0 z-30 w-full h-[48px] px-3 bg-white border-b border-[#EEEEEE] flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              aria-label="뒤로가기"
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} className="text-[#1E1E1E]" />
            </button>

            <button
              type="button"
              onClick={() => setIsAuthorMenuOpen(true)}
              aria-label="작성자 더보기 메뉴"
              className="w-9 h-9 -mr-1 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors cursor-pointer"
            >
              <MoreVertical size={20} className="text-[#1E1E1E]" />
            </button>
          </header>

          {/* 상세 본문 스크롤 영역 */}
          <div
            ref={detailScrollRef}
            className="flex-1 overflow-y-auto no-scrollbar bg-white pb-16"
          >
            {/* 2. 작성자 줄 (좌우 16px, 위아래 12px) */}
            <div className="px-[16px] py-[12px] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 원형 프로필 28px */}
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-[28px] h-[28px] rounded-full object-cover shrink-0 border border-[#EEEEEE] bg-[#F5F5F5]"
                />
                {/* 오른쪽에 2줄: 1줄 로컬박스 이름 13px 굵게 #1E1E1E / 2줄 11px #B3B3B3 */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold text-[#1E1E1E] leading-tight truncate">
                    {profile.name}
                  </span>
                  <span className="text-[11px] text-[#B3B3B3] leading-tight mt-0.5 truncate">
                    {isVillageNews
                      ? item.dongExposureText ||
                        '금광동 54% 상대원동 29% 은행동 15%'
                      : item.eventPeriodText || '2026.10.05(월)~2026.10.20(화)'}
                  </span>
                </div>
              </div>
              {/* 본인 글이므로 오른쪽에 팔로우 버튼 없음 */}
            </div>

            {/* 3. 미디어 영역 (화면 폭 100%, 좌우 여백 없음. 미디어가 없으면 영역 자체를 그리지 않음) */}
            {totalSlides > 0 && (
              <div className="w-full relative bg-[#F7F7F7] select-none">
                {/* 가로 스와이프 캐러셀(scroll-snap) + 마우스 드래그 */}
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
                >
                  {mediaList.map((media, sIdx) => {
                    const isLoaded = Boolean(loadedMediaIds[media.id]);

                    return (
                      <div
                        key={media.id}
                        className={`w-full shrink-0 snap-center relative overflow-hidden ${
                          isVillageNews
                            ? 'aspect-[4/3] bg-[#F5F5F5]'
                            : 'bg-[#F7F7F7] min-h-[260px]'
                        }`}
                      >
                        {media.type === 'VIDEO' ? (
                          <div
                            onClick={() => handleToggleVideoPlay(sIdx)}
                            className="w-full h-full relative cursor-pointer"
                          >
                            <video
                              ref={(el) => {
                                videoRefs.current[sIdx] = el;
                              }}
                              src={media.url}
                              poster={media.posterUrl}
                              muted={isMuted}
                              loop
                              playsInline
                              autoPlay={sIdx === currentSlide}
                              className={
                                isVillageNews
                                  ? 'w-full h-full object-cover'
                                  : 'w-full h-auto block bg-[#F7F7F7]'
                              }
                            />

                            {/* 오른쪽 아래: 음소거 토글 아이콘(VolumeX/Volume2) + 그 아래 남은 시간 00:29 (흰 글자 11px 굵게) */}
                            <div className="absolute bottom-3 right-3 z-20 flex flex-col items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsMuted((prev) => !prev);
                                }}
                                aria-label={
                                  isMuted ? '음소거 해제' : '음소거 전환'
                                }
                                className="w-7 h-7 flex items-center justify-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] cursor-pointer"
                              >
                                {isMuted ? (
                                  <VolumeX size={18} />
                                ) : (
                                  <Volume2 size={18} />
                                )}
                              </button>
                              <span className="text-[11px] font-bold text-white leading-none [text-shadow:0_1px_3px_rgba(0,0,0,0.75)]">
                                {formatRemainingTime(remainingSeconds)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* 이미지 슬라이드: 동네소식은 4:3 object-cover, 주민소식은 원본 비율 그대로(#F7F7F7 자리 표시) */
                          <div className="w-full h-full relative bg-[#F7F7F7]">
                            {!isLoaded && !isVillageNews && (
                              <div
                                className="w-full bg-[#F7F7F7]"
                                style={{
                                  aspectRatio: `${media.width} / ${media.height}`,
                                }}
                              />
                            )}
                            <img
                              src={media.url}
                              alt={`${item.title} - ${sIdx + 1}`}
                              draggable={false}
                              onLoad={() =>
                                setLoadedMediaIds((prev) => ({
                                  ...prev,
                                  [media.id]: true,
                                }))
                              }
                              className={
                                isVillageNews
                                  ? 'w-full h-full object-cover block'
                                  : 'w-full h-auto block'
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 오른쪽 위: 1/7 형식 페이지 숫자 (흰 글자 11px, 배경 없이 약한 텍스트 그림자) */}
                {totalSlides > 1 && (
                  <div className="pointer-events-none absolute top-3 right-3.5 z-20 text-[11px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                    {currentSlide + 1}/{totalSlides}
                  </div>
                )}

                {/* 아래 가운데: 점 인디케이터 (최대 5개, 양 끝 점이 작아지는 인스타그램식, 현재 점 흰색 / 나머지 반투명 흰색) */}
                {totalSlides > 1 && (
                  <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                    {visibleDots.map((dot) => {
                      const sizeClass =
                        dot.size === 'small'
                          ? 'w-[4px] h-[4px]'
                          : dot.size === 'medium'
                          ? 'w-[5px] h-[5px]'
                          : 'w-[6px] h-[6px]';
                      return (
                        <span
                          key={dot.index}
                          className={` rounded-full transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] ${sizeClass} ${
                            dot.isCurrent ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. 위치 줄 (동네소식에만, 장소가 있을 때만) */}
            {isVillageNews && item.location && (
              <div className="w-full bg-white">
                <button
                  type="button"
                  onClick={() => setIsMapExpanded((prev) => !prev)}
                  className="w-full px-4 pt-3 pb-1 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin
                      size={14}
                      className="text-[#7F7F7F] shrink-0"
                    />
                    <span className="text-[12px] text-[#7F7F7F] truncate">
                      {item.location.address}
                    </span>
                  </div>
                  <span className="text-[#7F7F7F] ml-2 shrink-0">
                    {isMapExpanded ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </span>
                </button>

                {/* 누르면 아래로 지도 카드가 펼쳐짐: 좌우 24px 여백의 정사각형 카드, 모서리 4px */}
                {isMapExpanded && (
                  <div className="mx-[24px] mt-2 mb-1 aspect-square rounded-[4px] overflow-hidden relative bg-[#EEF1F0] border border-[#EEEEEE]">
                    {/* OpenStreetMap 정적 타일 및 연한 회색 지도 배경 */}
                    <img
                      src="https://tile.openstreetmap.org/15/27996/12872.png"
                      alt={item.location.address}
                      className="w-full h-full object-cover opacity-85"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          'none';
                      }}
                    />

                    {/* 타일 로드 전/오프라인 시에도 보이는 연한 회색 지도 도로망 레이어 */}
                    <svg
                      viewBox="0 0 300 300"
                      className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
                    >
                      <rect width="300" height="300" fill="#F1F3F2" />
                      <path
                        d="M0 70 L300 95 M0 165 L300 145 M0 240 L300 250 M80 0 L65 300 M165 0 L185 300 M245 0 L230 300"
                        stroke="#FFFFFF"
                        strokeWidth="8"
                      />
                      <path
                        d="M0 120 L300 120 M125 0 L125 300"
                        stroke="#E2E6E5"
                        strokeWidth="3"
                      />
                    </svg>

                    {/* 가운데: 틸 원형 핀(흰 체크 아이콘) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative flex flex-col items-center -mt-3">
                        <div className="w-[34px] h-[34px] rounded-full bg-[#14B8B0] border-2 border-white shadow-md flex items-center justify-center">
                          <Check
                            size={18}
                            strokeWidth={3}
                            className="text-white"
                          />
                        </div>
                        <div className="w-2.5 h-2.5 bg-[#14B8B0] rotate-45 -mt-1.5" />
                      </div>
                    </div>

                    {/* 하단 주소 안내 캡션 */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 rounded-[4px] px-3 py-2 border border-[#EEEEEE] flex items-center justify-between">
                      <div className="min-w-0">
                        {item.location.placeName && (
                          <p className="text-[12px] font-bold text-[#1E1E1E] truncate">
                            {item.location.placeName}
                          </p>
                        )}
                        <p className="text-[11px] text-[#7F7F7F] truncate">
                          {item.location.address}
                        </p>
                      </div>
                      <span className="text-[10px] text-[#B3B3B3] shrink-0 ml-2">
                        OSM
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. 반응 아이콘 줄 (하트 + 숫자, 말풍선 + 숫자, 종이비행기 / 오른쪽 끝 북마크) */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onToggleLike(item.id)}
                  className="flex items-center gap-1 text-[#1E1E1E] cursor-pointer"
                >
                  <Heart
                    size={21}
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
                  onClick={() => {
                    commentSectionRef.current?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className="flex items-center gap-1 text-[#1E1E1E] cursor-pointer"
                >
                  <MessageCircle size={21} />
                  <span className="text-[13px] font-medium">
                    {item.commentCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onShowToast('콘텐츠 링크가 복사되었습니다.')}
                  aria-label="공유하기"
                  className="flex items-center text-[#1E1E1E] cursor-pointer"
                >
                  <Send size={20} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onToggleBookmark(item.id)}
                aria-label="북마크"
                className="flex items-center text-[#1E1E1E] cursor-pointer"
              >
                <Bookmark
                  size={21}
                  className={
                    item.isBookmarked
                      ? 'text-[#14B8B0] fill-[#14B8B0]'
                      : 'text-[#1E1E1E]'
                  }
                />
              </button>
            </div>

            {/* 6. 제목 · 본문 · 해시태그 · 날짜/조회수 영역 */}
            <div className="px-4 pb-5">
              {/* 제목 */}
              <h1 className="text-[16px] font-bold text-[#1E1E1E] leading-[1.4]">
                {item.title}
              </h1>

              {/* 본문 전문 (말줄임 없음, 줄바꿈 유지) */}
              <p className="mt-2.5 text-[14px] text-[#1E1E1E] leading-[1.6] whitespace-pre-line">
                {item.body}
              </p>

              {/* 해시태그 칩들 (동네소식에만 표시, 주민소식은 해시태그 없음) */}
              {isVillageNews && item.hashtags && item.hashtags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[#F5F5F5] text-[#7F7F7F] text-[12px] rounded-[4px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 날짜 · 조회수: 2일전 · 👁 16회 (12px #B3B3B3) */}
              <div className="mt-3.5 flex items-center gap-1 text-[12px] text-[#B3B3B3]">
                <span>{item.dateLabel}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Eye size={13} className="text-[#B3B3B3]" />
                  <span>{item.viewCount}회</span>
                </span>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full h-[1px] bg-[#EEEEEE]" />

            {/* 7. 댓글 영역 */}
            <div ref={commentSectionRef} className="px-4 py-4">
              <div className="text-[13px] font-bold text-[#1E1E1E] mb-3">
                댓글 {comments.length}개
              </div>

              {comments.length === 0 ? (
                <div className="py-8 text-center text-[13px] text-[#B3B3B3]">
                  첫 번째 댓글을 남겨보세요.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex flex-col gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={comment.authorAvatarUrl}
                          alt={comment.authorName}
                          className="w-[28px] h-[28px] rounded-full object-cover shrink-0 bg-[#F5F5F5]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-bold text-[#1E1E1E]">
                              {comment.authorName}
                            </span>
                            <span className="text-[11px] text-[#B3B3B3]">
                              {comment.createdAtLabel}
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] text-[#1E1E1E] leading-[1.45]">
                            {comment.content}
                          </p>
                          <button
                            type="button"
                            className="mt-1 text-[11px] text-[#7F7F7F] cursor-pointer"
                          >
                            답글 달기
                          </button>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 text-[#B3B3B3]">
                          <Heart size={13} />
                          {comment.likeCount > 0 && (
                            <span className="text-[10px]">
                              {comment.likeCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 대댓글(답글) */}
                      {comment.replies &&
                        comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="pl-9 flex items-start gap-2.5"
                          >
                            <img
                              src={reply.authorAvatarUrl}
                              alt={reply.authorName}
                              className="w-[24px] h-[24px] rounded-full object-cover shrink-0 bg-[#F5F5F5]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-bold text-[#1E1E1E]">
                                  {reply.authorName}
                                </span>
                                <span className="text-[11px] text-[#B3B3B3]">
                                  {reply.createdAtLabel}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[13px] text-[#1E1E1E] leading-[1.45]">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 8. 하단 댓글 입력창 (고정) */}
          <div className="sticky bottom-0 z-30 w-full bg-white border-t border-[#EEEEEE] px-4 py-2.5 flex items-center gap-2.5 shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-[28px] h-[28px] rounded-full object-cover shrink-0 border border-[#EEEEEE]"
            />
            <div className="flex-1 h-[36px] bg-[#F5F5F5] rounded-full px-3.5 flex items-center">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 남겨보세요..."
                className="w-full bg-transparent text-[13px] text-[#1E1E1E] placeholder-[#B3B3B3] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!commentInput.trim()) return;
                setCommentInput('');
                onShowToast('프로토타입에서는 댓글 작성이 실행되지 않습니다.');
              }}
              className={`text-[13px] font-bold px-1.5 cursor-pointer ${
                commentInput.trim() ? 'text-[#14B8B0]' : 'text-[#B3B3B3]'
              }`}
            >
              등록
            </button>
          </div>

          {/* 9. 작성자 전용 더보기 메뉴 (⋮ 버튼 클릭 시 바텀시트) */}
          {isAuthorMenuOpen && (
            <div
              onClick={() => setIsAuthorMenuOpen(false)}
              className="absolute inset-0 z-50 bg-black/40 flex flex-col justify-end"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-white rounded-t-[16px] pt-2 pb-6 overflow-hidden animate-in slide-in-from-bottom duration-200"
              >
                <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mb-2" />
                <div className="px-4 py-2 border-b border-[#EEEEEE]">
                  <span className="text-[12px] font-medium text-[#7F7F7F]">
                    내 콘텐츠 관리 ({isVillageNews ? '동네소식' : '주민소식'})
                  </span>
                </div>

                <div className="flex flex-col py-1">
                  {authorMenuItems.map((menuItem) => {
                    const IconComp = menuItem.icon;
                    return (
                      <button
                        key={menuItem.id}
                        type="button"
                        onClick={() => {
                          setIsAuthorMenuOpen(false);
                          // 분석 중 메뉴는 열어보기만 하고 고정·삭제 등은 실제 실행하지 않음
                          onShowToast(
                            `'${menuItem.label}' 메뉴를 확인했습니다.`
                          );
                        }}
                        className={`w-full px-5 py-3.5 flex items-center gap-3 text-left hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors cursor-pointer ${
                          menuItem.danger ? 'text-[#FF3B30]' : 'text-[#1E1E1E]'
                        }`}
                      >
                        <IconComp
                          size={18}
                          className={
                            menuItem.danger
                              ? 'text-[#FF3B30]'
                              : 'text-[#7F7F7F]'
                          }
                        />
                        <span className="text-[14px] font-medium">
                          {menuItem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="px-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthorMenuOpen(false)}
                    className="w-full h-[44px] rounded-[8px] bg-[#F5F5F5] text-[#1E1E1E] text-[14px] font-bold cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
