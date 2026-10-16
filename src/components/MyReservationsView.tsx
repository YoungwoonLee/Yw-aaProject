import React, { useState, useEffect } from 'react';
import { ArrowLeft, Ticket, CheckCircle, XCircle, Search, ChevronRight } from 'lucide-react';
import { Reservation } from '../types';
import {
  getReservations,
  cancelReservation,
  checkInReservation,
} from '../api/mock';

interface MyReservationsViewProps {
  onBack: () => void;
  onSelectProgram?: (programId: number) => void;
  onShowToast?: (msg: string) => void;
}

export const MyReservationsView: React.FC<MyReservationsViewProps> = ({
  onBack,
  onSelectProgram,
  onShowToast,
}) => {
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED'>('ALL');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const refresh = () => {
    setAllReservations(getReservations());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleConfirmCancel = (id: string) => {
    cancelReservation(id);
    setConfirmCancelId(null);
    refresh();
    onShowToast?.('예약이 취소되었으며 잔여 좌석이 복원되었습니다.');
  };

  const handleCheckIn = (id: string) => {
    checkInReservation(id);
    refresh();
    onShowToast?.('현장 체크인이 완료되었습니다!');
  };

  const filteredList = allReservations.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) {
      return false;
    }
    const q = searchQuery.trim();
    if (q) {
      return (
        r.phone.includes(q) ||
        r.userName.includes(q) ||
        r.programTitle.includes(q) ||
        r.id.toLowerCase().includes(q.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="bg-white min-h-full pb-[100px] select-none">
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur min-h-[52px] px-4 py-3 border-b border-[#F3F4F6] flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={21} color="#1E293B" strokeWidth={2.2} />
        </button>
        <h1 className="text-[16px] font-extrabold text-[#0F172A]">내 체험 예약 티켓</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* 예약자 정보 검색 바 */}
        <div className="p-3.5 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] flex flex-col gap-2">
          <div className="text-[12px] font-bold text-[#0F172A] flex items-center gap-1.5">
            <Search size={14} color="#14B8B0" strokeWidth={2.4} />
            <span>예약자 성함 · 연락처 · 예약번호 조회</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="성함, 연락처 뒷자리 또는 예약번호 입력"
              className="flex-1 text-[12px] px-3 py-2 bg-white rounded-[8px] border border-[#E2E8F0] outline-none focus:border-[#14B8B0]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2.5 text-[11px] text-[#64748B] font-semibold cursor-pointer hover:text-[#0F172A]"
              >
                초기화
              </button>
            )}
          </div>
        </div>

        {/* 상태별 필터 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: `전체 ${allReservations.length}` },
            {
              id: 'CONFIRMED',
              label: `예약확정 ${allReservations.filter((r) => r.status === 'CONFIRMED').length}`,
            },
            {
              id: 'CHECKED_IN',
              label: `체크인완료 ${allReservations.filter((r) => r.status === 'CHECKED_IN').length}`,
            },
            {
              id: 'CANCELLED',
              label: `취소됨 ${allReservations.filter((r) => r.status === 'CANCELLED').length}`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#14B8B0] text-white font-bold'
                  : 'bg-[#F1F5F9] text-[#64748B] font-medium hover:bg-[#E2E8F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 티켓 목록 */}
        {filteredList.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center text-[#94A3B8]">
            <Ticket size={48} strokeWidth={1.3} className="mb-2 text-[#14B8B0] opacity-50" />
            <p className="text-[14px] font-bold text-[#334155]">조회된 예약 티켓이 없습니다</p>
            <p className="text-[12px] text-[#94A3B8] mt-1">
              체험 탭에서 우리 동네 원데이 클래스와 모임을 예약해보세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredList.map((res) => {
              const isConfirmed = res.status === 'CONFIRMED';
              const isCheckedIn = res.status === 'CHECKED_IN';
              const isCancelled = res.status === 'CANCELLED';
              const isAskingCancel = confirmCancelId === res.id;

              return (
                <div
                  key={res.id}
                  className={`rounded-[16px] border overflow-hidden bg-white shadow-xs transition-all ${
                    isCancelled ? 'border-[#E2E8F0] opacity-75' : 'border-[#B2ECE9]'
                  }`}
                >
                  {/* 틸 티켓 헤더 */}
                  <div
                    className="px-4 py-3 text-white flex items-center justify-between"
                    style={{
                      backgroundColor: isCancelled
                        ? '#94A3B8'
                        : isCheckedIn
                        ? '#0F766E'
                        : '#14B8B0',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Ticket size={17} color="#ffffff" />
                      <span className="font-extrabold text-[13px] tracking-tight">
                        온닫이 체험 티켓
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isConfirmed
                          ? 'bg-white text-[#0F766E]'
                          : isCheckedIn
                          ? 'bg-[#D1FAE5] text-[#065F46]'
                          : 'bg-white/25 text-white'
                      }`}
                    >
                      {isConfirmed && '예약확정'}
                      {isCheckedIn && '체크인완료'}
                      {isCancelled && '예약취소'}
                    </span>
                  </div>

                  {/* 티켓 본문 */}
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onSelectProgram?.(res.programId)}
                          className="text-left group flex items-center gap-1 cursor-pointer"
                        >
                          <h3 className="font-extrabold text-[15px] text-[#0F172A] leading-snug group-hover:text-[#14B8B0] transition-colors">
                            {res.programTitle}
                          </h3>
                          {onSelectProgram && (
                            <ChevronRight
                              size={15}
                              className="text-[#94A3B8] group-hover:text-[#14B8B0] shrink-0"
                            />
                          )}
                        </button>
                        <p className="text-[12px] text-[#64748B] mt-0.5">
                          예약번호:{' '}
                          <span className="font-mono font-extrabold text-[#14B8B0]">
                            {res.id}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F0FDFC] border border-[#CCFBF1] rounded-[10px] text-[12px] text-[#134E4A] flex flex-col gap-1.5">
                      <div className="flex justify-between gap-2">
                        <span className="text-[#0F766E] font-medium shrink-0">예약일시</span>
                        <span className="font-bold text-right">
                          {res.date} {res.timeSlot && `(${res.timeSlot})`}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#0F766E] font-medium shrink-0">모임장소</span>
                        <span className="font-bold text-right">{res.locationName}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-[#0F766E] font-medium shrink-0">예약자명</span>
                        <span className="font-bold text-right">
                          {res.userName} ({res.phone}) · {res.count}명
                        </span>
                      </div>
                    </div>

                    {/* 하단 액션 영역 */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                      {isConfirmed && !isAskingCancel && (
                        <>
                          <button
                            type="button"
                            onClick={() => setConfirmCancelId(res.id)}
                            className="px-3 py-1.5 text-[12px] font-semibold text-[#EF4444] hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer"
                          >
                            예약취소
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCheckIn(res.id)}
                            className="px-3.5 py-1.5 bg-[#14B8B0] text-white text-[12px] font-bold rounded-[8px] hover:bg-[#119E97] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle size={13} />
                            <span>현장 체크인</span>
                          </button>
                        </>
                      )}

                      {isConfirmed && isAskingCancel && (
                        <div className="w-full flex items-center justify-between bg-[#FEF2F2] px-3 py-2 rounded-[8px] border border-[#FECACA]">
                          <span className="text-[11px] font-bold text-[#DC2626]">
                            정말 이 예약을 취소할까요?
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setConfirmCancelId(null)}
                              className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E2E8F0] text-[11px] font-semibold text-[#475569] cursor-pointer"
                            >
                              유지
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmCancel(res.id)}
                              className="px-2.5 py-1 rounded-[6px] bg-[#EF4444] text-white text-[11px] font-bold cursor-pointer"
                            >
                              취소 확정
                            </button>
                          </div>
                        </div>
                      )}

                      {isCheckedIn && (
                        <span className="text-[12px] text-[#0F766E] font-bold flex items-center gap-1">
                          <CheckCircle size={14} color="#14B8B0" /> 현장 체크인 완료
                        </span>
                      )}

                      {isCancelled && (
                        <span className="text-[12px] text-[#94A3B8] font-medium flex items-center gap-1">
                          <XCircle size={14} /> 취소된 예약 티켓입니다
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

