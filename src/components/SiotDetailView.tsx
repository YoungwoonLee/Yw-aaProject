import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle2, X, Users, Share2 } from 'lucide-react';
import { SiotProgram } from '../types';
import { createReservation, getCurrentUser } from '../api/mock';

interface SiotDetailViewProps {
  program: SiotProgram;
  onBack: () => void;
  onReservationSuccess: () => void;
  onRequireLogin?: () => void;
  onShowToast?: (msg: string) => void;
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export const SiotDetailView: React.FC<SiotDetailViewProps> = ({
  program,
  onBack,
  onReservationSuccess,
  onShowToast,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formError, setFormError] = useState<string | null>(null);

  const availableDates = Array.from(
    new Set([
      program.startDate.replace(/\./g, '-'),
      ...(program.slots?.map((s) => s.date) || []),
      '2026-10-18',
      '2026-10-22',
      '2026-10-25',
    ])
  ).slice(0, 4);

  const defaultSlots =
    program.slots && program.slots.length > 0
      ? program.slots
      : [
          {
            date: availableDates[0],
            time: program.is24Hours
              ? '자율방문 (00:00 ~ 24:00)'
              : `자율방문 (${program.startTime} ~ ${program.endTime})`,
            maxPeople: program.maxCapacity || 10,
            bookedPeople: Math.max(
              0,
              (program.maxCapacity || 10) - program.availableSeats
            ),
          },
        ];

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(
    defaultSlots[0]?.time || `${program.startTime} ~ ${program.endTime}`
  );

  const currentUser = getCurrentUser();
  const [userName, setUserName] = useState<string>(currentUser?.nickname || '동네 러너');
  const [phone, setPhone] = useState<string>('010-3921-8402');
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [createdReservationId, setCreatedReservationId] = useState<string>('');

  const isUpcoming = program.status === 'UPCOMING';
  const isSoldOut = program.availableSeats <= 0;
  const isTimeSlot = program.bookingType === 'TIME_SLOT';

  const handleOpenBooking = () => {
    if (isUpcoming || isSoldOut) return;
    setFormError(null);
    setIsSheetOpen(true);
    setCurrentStep(1);
  };

  const handleShareProgram = async () => {
    const shareUrl = `${window.location.origin}/experience/${program.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      onShowToast?.('체험 프로그램 링크가 복사되었습니다.');
    } catch {
      onShowToast?.('체험 프로그램 정보를 공유합니다.');
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || phone.replace(/\D/g, '').length < 10) {
      setFormError('예약자 성함과 휴대폰 번호(10~11자리)를 정확히 입력해주세요.');
      return;
    }

    setFormError(null);
    const res = createReservation({
      programId: program.id,
      userName: userName.trim(),
      phone: phone.trim(),
      count: peopleCount,
      date: selectedDate,
      timeSlot: selectedSlot,
    });

    setCreatedReservationId(res.id);
    setCurrentStep(4);
    onShowToast?.('체험 예약이 확정되었습니다!');
  };

  return (
    <div className="bg-white min-h-full pb-[110px] select-none relative">
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur min-h-[52px] px-4 py-2.5 border-b border-[#F3F4F6] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 hover:bg-[#F3F4F6] rounded-full transition-colors cursor-pointer shrink-0"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={21} color="#1E293B" strokeWidth={2.2} />
          </button>
          <h2 className="text-[15px] font-extrabold text-[#0F172A] truncate">
            {program.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleShareProgram}
          className="p-2 hover:bg-[#F3F4F6] rounded-full transition-colors cursor-pointer text-[#475569] shrink-0"
          aria-label="체험 공유하기"
        >
          <Share2 size={18} strokeWidth={2} />
        </button>
      </div>

      {/* 대표 썸네일 (16:9) */}
      <div className="w-full aspect-video bg-[#F8FAFC] overflow-hidden relative">
        <img
          src={program.thumbnailUrl}
          alt={program.title}
          className="w-full h-full object-cover"
        />
        {program.townName && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#14B8B0] text-white shadow-xs">
            {program.townName}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* 상태 배지 줄 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[12px] font-bold px-2.5 py-1 rounded-[10px] ${
              isUpcoming
                ? 'bg-[#FEF3C7] text-[#D97706]'
                : isSoldOut
                ? 'bg-[#F3F4F6] text-[#9CA3AF]'
                : 'bg-[#E6F7F6] text-[#14B8B0]'
            }`}
          >
            {isUpcoming
              ? program.openDateText || '진행예정'
              : isSoldOut
              ? '예약마감'
              : `잔여 ${program.availableSeats}석 / 정원 ${program.maxCapacity}명`}
          </span>

          <span className="text-[12px] font-bold px-2.5 py-1 rounded-[10px] bg-[#F0FDFC] text-[#0F766E] border border-[#CCFBF1] flex items-center gap-1">
            {isTimeSlot ? '⏰ 시간단위 회차예약' : '📅 자율방문 체험'}
          </span>
        </div>

        {/* 제목 및 호스트 정보 */}
        <div>
          <h1 className="text-[19px] font-extrabold text-[#0F172A] leading-snug mb-1.5">
            {program.title}
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E6F7F6] text-[#14B8B0] text-[11px] font-extrabold">
              {program.creatorNickname.slice(0, 1)}
            </span>
            <span>
              호스트 <strong className="font-bold text-[#1E293B]">{program.creatorNickname}</strong>
            </span>
          </div>
        </div>

        {/* 장소 · 운영 기간 · 운영 시간 요약 카드 */}
        <div className="flex flex-col gap-2.5 p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#F1F5F9] text-[13px] text-[#334155]">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} color="#14B8B0" strokeWidth={2.2} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-[#0F172A]">{program.locationName}</div>
              {program.address && (
                <div className="text-[12px] text-[#64748B] mt-0.5">{program.address}</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar size={16} color="#14B8B0" strokeWidth={2.2} className="shrink-0" />
            <span>
              운영 기간: <strong className="font-semibold">{program.startDate} ~ {program.endDate}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock size={16} color="#14B8B0" strokeWidth={2.2} className="shrink-0" />
            <span>
              참여 시간:{' '}
              <strong className="font-semibold">
                {program.is24Hours
                  ? '24시간 상시 운영 (자율 참여)'
                  : `${program.startTime} ~ ${program.endTime}`}
              </strong>
            </span>
          </div>
        </div>

        {/* 운영 회차 현황 */}
        {defaultSlots.length > 0 && (
          <div>
            <h4 className="text-[13px] font-bold text-[#1E293B] mb-2 flex items-center gap-1.5">
              <Users size={15} color="#14B8B0" />
              <span>운영 회차 및 잔여 좌석</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {defaultSlots.map((slot, idx) => {
                const remain = Math.max(0, slot.maxPeople - slot.bookedPeople);
                return (
                  <div
                    key={idx}
                    className="px-3 py-2 rounded-[10px] text-[12px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] flex items-center gap-1.5"
                  >
                    <span className="font-semibold">{slot.time}</span>
                    <span className="text-[11px] text-[#14B8B0] font-bold">
                      ({remain}석 가능)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 체험 상세 소개 */}
        <div className="bg-[#F9FAFB] p-4 rounded-[12px] border border-[#F3F4F6]">
          <h4 className="text-[13px] font-bold text-[#1E293B] mb-2">체험 상세 소개</h4>
          <p className="text-[13px] text-[#475569] leading-relaxed whitespace-pre-wrap">
            {program.description}
          </p>
        </div>

        {/* 강사 / 호스트 소개 */}
        {program.instructorIntro && (
          <div className="bg-[#F9FAFB] p-4 rounded-[12px] border border-[#F3F4F6]">
            <h4 className="text-[13px] font-bold text-[#1E293B] mb-1.5">강사 / 호스트 소개</h4>
            <p className="text-[13px] text-[#475569] leading-relaxed">
              {program.instructorIntro}
            </p>
          </div>
        )}

        {/* 해시태그 목록 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {program.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-bold text-[#14B8B0] bg-[#E6F7F6] px-2.5 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 하단 고정 예약 CTA 버튼 */}
      <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur border-t border-[#F3F4F6] z-20">
        <button
          type="button"
          disabled={isSoldOut || isUpcoming}
          onClick={handleOpenBooking}
          className="w-full py-3.5 rounded-[12px] text-white font-extrabold text-[15px] transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: isSoldOut || isUpcoming ? '#94A3B8' : '#14B8B0',
          }}
        >
          {isUpcoming
            ? `${program.openDateText || '오픈 예정'} 프로그램입니다`
            : isSoldOut
            ? '예약 마감'
            : `체험 예약하기 (잔여 ${program.availableSeats}석)`}
        </button>
      </div>

      {/* 4단계 예약 바텀시트 */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[1px] transition-opacity"
            onClick={() => {
              if (currentStep === 4) {
                onReservationSuccess();
              }
              setIsSheetOpen(false);
            }}
          />

          <div className="relative w-full max-w-[430px] bg-white rounded-t-[20px] max-h-[85vh] overflow-y-auto p-5 z-10 shadow-2xl">
            {/* 단계 진행 바 */}
            <div className="flex items-center gap-1.5 mb-3">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-[#14B8B0]' : 'bg-[#E2E8F0]'
                  }`}
                />
              ))}
            </div>

            {/* 시트 헤더 */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] mb-4">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#0F172A]">
                  {currentStep === 4 ? '체험 예약 확정 완료' : '체험 프로그램 예약'}
                </h3>
                <p className="text-[12px] text-[#14B8B0] font-semibold mt-0.5">
                  {currentStep === 1 && '1단계 · 참여 희망 날짜 선택'}
                  {currentStep === 2 && '2단계 · 참여 시간 회차 선택'}
                  {currentStep === 3 && '3단계 · 예약자 정보 및 인원 입력'}
                  {currentStep === 4 && '4단계 · 모바일 예약 티켓 발급 완료'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 4) {
                    onReservationSuccess();
                  }
                  setIsSheetOpen(false);
                }}
                className="p-1.5 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
                aria-label="예약창 닫기"
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* STEP 1: 날짜 선택 */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-4">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  참여 희망 일자를 선택해주세요
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {availableDates.map((dateStr) => {
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-3.5 rounded-[12px] border text-[13px] font-bold text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#14B8B0] bg-[#E6F7F6] text-[#0F766E] shadow-2xs'
                            : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {dateStr}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full mt-2 py-3.5 rounded-[12px] bg-[#14B8B0] text-white font-extrabold text-[15px] cursor-pointer hover:bg-[#119E97] transition-colors"
                >
                  다음 단계 (시간 선택)
                </button>
              </div>
            )}

            {/* STEP 2: 시간 회차 선택 */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-4">
                <label className="text-[13px] font-bold text-[#1E293B]">
                  참여 회차를 선택해주세요 ({selectedDate})
                </label>
                <div className="flex flex-col gap-2.5">
                  {defaultSlots.map((slot, i) => {
                    const isSelected = selectedSlot === slot.time;
                    const remain = Math.max(1, slot.maxPeople - slot.bookedPeople);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-3.5 rounded-[12px] border text-left flex justify-between items-center cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#14B8B0] bg-[#E6F7F6] text-[#0F766E]'
                            : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFB]'
                        }`}
                      >
                        <span className="font-bold text-[13px]">{slot.time}</span>
                        <span className="text-[11px] font-extrabold text-[#14B8B0]">
                          잔여 {remain}석 가능
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3.5 rounded-[12px] bg-[#F1F5F9] text-[#475569] font-bold text-[14px] cursor-pointer"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-[2] py-3.5 rounded-[12px] bg-[#14B8B0] text-white font-extrabold text-[14px] cursor-pointer hover:bg-[#119E97]"
                  >
                    다음 단계 (정보 입력)
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: 예약자 정보 입력 */}
            {currentStep === 3 && (
              <form onSubmit={handleConfirmReservation} className="flex flex-col gap-4">
                {formError && (
                  <div className="p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#DC2626] font-semibold">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-1">
                    예약자 성함 *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="예약자 성함을 입력하세요"
                    className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none focus:border-[#14B8B0]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-1">
                    휴대폰 번호 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                    className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none focus:border-[#14B8B0]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-1.5">
                    참여 인원 (최대 {program.availableSeats}명)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="w-9 h-9 rounded-[8px] bg-[#F1F5F9] text-[#0F172A] font-extrabold text-base cursor-pointer hover:bg-[#E2E8F0]"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-[15px] min-w-[36px] text-center">
                      {peopleCount}명
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPeopleCount(Math.min(program.availableSeats, peopleCount + 1))
                      }
                      className="w-9 h-9 rounded-[8px] bg-[#E6F7F6] text-[#14B8B0] font-extrabold text-base cursor-pointer hover:bg-[#D1F2EF]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#F0FDFC] border border-[#CCFBF1] rounded-[10px] text-[12px] text-[#0F766E] font-medium">
                  선택 일시: <strong>{selectedDate}</strong> ({selectedSlot}) ·{' '}
                  <strong>{peopleCount}명</strong>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 py-3.5 rounded-[12px] bg-[#F1F5F9] text-[#475569] font-bold text-[14px] cursor-pointer"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3.5 rounded-[12px] bg-[#14B8B0] text-white font-extrabold text-[14px] cursor-pointer hover:bg-[#119E97]"
                  >
                    예약 확정하기
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: 예약 완료 */}
            {currentStep === 4 && (
              <div className="flex flex-col items-center py-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#E6F7F6] flex items-center justify-center text-[#14B8B0] mb-3">
                  <CheckCircle2 size={34} color="#14B8B0" />
                </div>
                <h4 className="text-[17px] font-extrabold text-[#0F172A] mb-1">
                  체험 예약이 확정되었습니다!
                </h4>
                <p className="text-[13px] text-[#64748B] mb-4">
                  예약번호:{' '}
                  <span className="font-mono font-extrabold text-[#14B8B0]">
                    {createdReservationId}
                  </span>
                </p>

                <div className="w-full bg-[#F8FAFC] p-4 rounded-[12px] border border-[#E2E8F0] text-left text-[12px] text-[#334155] mb-5 flex flex-col gap-1.5">
                  <div>
                    <span className="text-[#64748B]">• 프로그램:</span>{' '}
                    <strong>{program.title}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B]">• 예약일시:</span> {selectedDate} (
                    {selectedSlot})
                  </div>
                  <div>
                    <span className="text-[#64748B]">• 예약자:</span> {userName} ({phone})
                  </div>
                  <div>
                    <span className="text-[#64748B]">• 참여인원:</span> {peopleCount}명
                  </div>
                  <div>
                    <span className="text-[#64748B]">• 모임장소:</span> {program.locationName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsSheetOpen(false);
                    onReservationSuccess();
                  }}
                  className="w-full py-3.5 rounded-[12px] bg-[#14B8B0] text-white font-extrabold text-[15px] cursor-pointer hover:bg-[#119E97]"
                >
                  내 예약 티켓 확인하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

