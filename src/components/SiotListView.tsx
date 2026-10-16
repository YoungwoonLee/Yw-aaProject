import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Ticket, Plus, Sparkles } from 'lucide-react';
import { SiotProgram } from '../types';
import { getSiotPrograms, getReservations } from '../api/mock';

interface SiotListViewProps {
  townName?: string;
  onCardClick: (programId: number) => void;
  onViewMyReservations: () => void;
  onCreateClick?: () => void;
}

type FilterTab = 'ALL' | 'IN_PROGRESS' | 'UPCOMING';

const DAY_TYPE_LABEL: Record<string, string> = {
  EVERYDAY: '매일',
  WEEKDAYS: '평일',
  WEEKENDS: '주말',
};

export const SiotListView: React.FC<SiotListViewProps> = ({
  townName = '금광동',
  onCardClick,
  onViewMyReservations,
  onCreateClick,
}) => {
  const [filter, setFilter] = useState<FilterTab>('ALL');
  const [programs, setPrograms] = useState<SiotProgram[]>([]);
  const [activeResCount, setActiveResCount] = useState<number>(0);

  useEffect(() => {
    setPrograms(getSiotPrograms());
    const reservations = getReservations();
    setActiveResCount(
      reservations.filter((r) => r.status === 'CONFIRMED').length
    );
  }, []);

  const filteredPrograms = programs.filter((p) => {
    if (filter === 'IN_PROGRESS') return p.status === 'IN_PROGRESS';
    if (filter === 'UPCOMING') return p.status === 'UPCOMING';
    return true;
  });

  const inProgressCount = programs.filter((p) => p.status === 'IN_PROGRESS').length;
  const upcomingCount = programs.filter((p) => p.status === 'UPCOMING').length;

  return (
    <div className="bg-white min-h-full pb-24 select-none relative">
      {/* 상단 타이틀 & 내 예약 티켓 바로가기 */}
      <div className="px-4 py-3.5 border-b border-[#F3F4F6] bg-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-[16px] font-extrabold text-[#0F172A] tracking-tight">
              {townName} 주변 체험
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F7F6] text-[#14B8B0]">
              LOCAL CLASS
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            동네 이웃과 함께하는 원데이 클래스 · 투어 · 소모임
          </p>
        </div>

        <button
          type="button"
          onClick={onViewMyReservations}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E6F7F6] text-[#14B8B0] text-[12px] font-bold hover:bg-[#D1F2EF] active:scale-95 transition-all cursor-pointer"
        >
          <Ticket size={14} color="#14B8B0" strokeWidth={2.2} />
          <span>내 예약</span>
          {activeResCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#14B8B0] text-white text-[10px] font-extrabold leading-4">
              {activeResCount}
            </span>
          )}
        </button>
      </div>

      {/* 상태 필터 탭 (전체 / 진행중 / 진행예정) */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#14B8B0] text-white font-bold shadow-xs'
                : 'bg-[#F3F4F6] text-[#6B7280] font-medium hover:bg-[#E5E7EB]'
            }`}
          >
            전체 {programs.length}
          </button>

          <button
            type="button"
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] transition-all cursor-pointer ${
              filter === 'IN_PROGRESS'
                ? 'bg-[#14B8B0] text-white font-bold shadow-xs'
                : 'bg-[#F3F4F6] text-[#6B7280] font-medium hover:bg-[#E5E7EB]'
            }`}
          >
            진행중 {inProgressCount}
          </button>

          <button
            type="button"
            onClick={() => setFilter('UPCOMING')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] transition-all cursor-pointer ${
              filter === 'UPCOMING'
                ? 'bg-[#14B8B0] text-white font-bold shadow-xs'
                : 'bg-[#F3F4F6] text-[#6B7280] font-medium hover:bg-[#E5E7EB]'
            }`}
          >
            진행예정 {upcomingCount}
          </button>
        </div>
      </div>

      {/* 체험 프로그램 카드 목록 */}
      <div className="px-4 flex flex-col gap-5">
        {filteredPrograms.map((program) => {
          const isUpcoming = program.status === 'UPCOMING';
          const isSoldOut = program.availableSeats <= 0;
          const dayLabel = program.dayType
            ? DAY_TYPE_LABEL[program.dayType] || '매일'
            : '매일';

          return (
            <div
              key={program.id}
              onClick={() => onCardClick(program.id)}
              className="cursor-pointer transition-transform active:scale-[0.99] group"
            >
              {/* Thumbnail 180px */}
              <div className="relative overflow-hidden h-[180px] rounded-[14px] bg-[#F8FAFC] border border-[#F1F5F9]">
                <img
                  src={program.thumbnailUrl}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)',
                  }}
                />

                {/* 상단 좌측 동네/카테고리 배지 */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                  {program.townName && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#14B8B0] text-white shadow-xs">
                      {program.townName}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/45 text-white backdrop-blur-xs">
                    {program.bookingType === 'TIME_SLOT' ? '회차예약' : '자율방문'}
                  </span>
                </div>

                {/* UPCOMING Overlay */}
                {isUpcoming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/60 backdrop-blur-[1px]">
                    <span className="px-3 py-1 rounded-full bg-[#14B8B0] text-white text-[11px] font-extrabold mb-1.5">
                      OPEN SOON
                    </span>
                    <span className="text-white text-[20px] font-black tracking-tight drop-shadow">
                      {program.openDateText || '진행예정'}
                    </span>
                  </div>
                )}

                {/* 하단 좌측: 운영 시간 배지 + 제목 */}
                <div className="absolute left-3.5 bottom-3.5 right-3.5 flex flex-col gap-1.5 pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                      <Clock size={11} color="#ffffff" strokeWidth={2.2} />
                      <span>
                        {dayLabel} ·{' '}
                        {program.is24Hours
                          ? '24시간 자율참여'
                          : `${program.startTime} ~ ${program.endTime}`}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-white line-clamp-1 leading-snug drop-shadow-xs">
                    {program.title}
                  </h3>
                </div>
              </div>

              {/* 썸네일 하단 정보: 장소 + 호스트 + 잔여석 */}
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748B] truncate pr-2">
                  <MapPin size={13} color="#14B8B0" strokeWidth={2.2} className="shrink-0" />
                  <span className="truncate text-[#334155] font-semibold">
                    {program.locationName}
                  </span>
                  <span className="text-[#CBD5E1]">|</span>
                  <span className="text-[#64748B] truncate">
                    {program.creatorNickname}
                  </span>
                </div>

                {!isUpcoming ? (
                  <span
                    className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isSoldOut
                        ? 'bg-[#F1F5F9] text-[#94A3B8]'
                        : 'bg-[#E6F7F6] text-[#14B8B0]'
                    }`}
                  >
                    {isSoldOut ? '예약마감' : `잔여 ${program.availableSeats}석`}
                  </span>
                ) : (
                  <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706]">
                    오픈예정
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 우측 하단 체험 등록 플로팅 버튼 */}
      {onCreateClick && (
        <button
          type="button"
          onClick={onCreateClick}
          aria-label="체험 프로그램 등록"
          className="fixed bottom-[76px] right-[max(16px,calc(50vw-199px))] z-20 flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#14B8B0] text-white text-[13px] font-extrabold shadow-[0_6px_20px_rgba(20,184,176,0.38)] hover:bg-[#119E97] active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={17} strokeWidth={2.6} />
          <span>체험 등록</span>
        </button>
      )}
    </div>
  );
};

