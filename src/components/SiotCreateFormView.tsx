import React, { useState } from 'react';
import { ArrowLeft, X, Upload, Clock, MapPin } from 'lucide-react';
import { createSiotProgram } from '../api/mock';

interface SiotCreateFormViewProps {
  townName?: string;
  onBack: () => void;
  onSuccess: (newId: number) => void;
  onShowToast?: (msg: string) => void;
}

const PRESET_THUMBNAILS = [
  { label: '공방·목공', url: 'https://picsum.photos/id/1070/800/600' },
  { label: '쿠킹·베이킹', url: 'https://picsum.photos/id/292/800/600' },
  { label: '가드닝·식물', url: 'https://picsum.photos/id/106/800/600' },
  { label: '도예·드로잉', url: 'https://picsum.photos/id/1062/800/600' },
];

export const SiotCreateFormView: React.FC<SiotCreateFormViewProps> = ({
  townName = '금광동',
  onBack,
  onSuccess,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026.10.20');
  const [endDate, setEndDate] = useState('2026.11.10');
  const [dayType, setDayType] = useState<'EVERYDAY' | 'WEEKDAYS' | 'WEEKENDS'>('EVERYDAY');
  const [bookingType, setBookingType] = useState<'TIME_SLOT' | 'OPEN_DATE'>('TIME_SLOT');
  const [maxCapacity, setMaxCapacity] = useState<number>(8);
  const [is24Hours, setIs24Hours] = useState(false);
  const [startAmPm, setStartAmPm] = useState('오전');
  const [startHour, setStartHour] = useState('10');
  const [startMinute, setStartMinute] = useState('00');
  const [endAmPm, setEndAmPm] = useState('오후');
  const [endHour, setEndHour] = useState('02');
  const [endMinute, setEndMinute] = useState('00');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://picsum.photos/id/1070/800/600'
  );
  const [content, setContent] = useState('');
  const [instructorIntro, setInstructorIntro] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([`${townName}체험`, '원데이클래스']);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const startTimeFormatted = is24Hours
    ? '00:00'
    : `${startHour}:${startMinute}${startAmPm === '오전' ? 'am' : 'pm'}`;
  const endTimeFormatted = is24Hours
    ? '24:00'
    : `${endHour}:${endMinute}${endAmPm === '오전' ? 'am' : 'pm'}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !placeName.trim() || !content.trim()) {
      setFormError('제목, 장소명, 체험 상세 내용을 모두 입력해주세요.');
      return;
    }

    setFormError(null);
    const newProg = createSiotProgram({
      title: title.trim(),
      startDate,
      endDate,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      dayType,
      is24Hours,
      bookingType: is24Hours ? 'OPEN_DATE' : bookingType,
      maxCapacity,
      townName,
      thumbnailUrl,
      description: content.trim(),
      instructorIntro: instructorIntro.trim(),
      locationName: placeName.trim(),
      address: address.trim(),
      tags,
    });

    onShowToast?.('새로운 체험 프로그램이 등록되었습니다!');
    onSuccess(newProg.id);
  };

  return (
    <div className="bg-white min-h-full pb-[130px] select-none">
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
        <h1 className="text-[16px] font-extrabold text-[#0F172A]">체험 프로그램 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-5">
        {formError && (
          <div className="p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#DC2626] font-semibold">
            {formError}
          </div>
        )}

        {/* 제목 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            프로그램 제목 *{' '}
            <span className="text-[11px] font-normal text-[#94A3B8]">
              ({title.length}/50자)
            </span>
          </label>
          <input
            type="text"
            required
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="이웃과 함께할 원데이 클래스·모임 제목을 입력하세요"
            className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none transition-colors focus:border-[#14B8B0]"
          />
        </div>

        {/* 예약 방식 및 정원 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
              예약 운영 방식 *
            </label>
            <div className="flex gap-1.5">
              {[
                { id: 'TIME_SLOT', label: '회차예약' },
                { id: 'OPEN_DATE', label: '자율방문' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBookingType(b.id as 'TIME_SLOT' | 'OPEN_DATE')}
                  className={`flex-1 py-2 text-[12px] font-bold rounded-[8px] border transition-colors cursor-pointer ${
                    bookingType === b.id
                      ? 'border-[#14B8B0] bg-[#E6F7F6] text-[#0F766E]'
                      : 'border-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
              회차당 모집 정원
            </label>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setMaxCapacity(Math.max(2, maxCapacity - 1))}
                className="w-6 h-6 rounded bg-white border border-[#E2E8F0] font-bold text-xs cursor-pointer"
              >
                -
              </button>
              <span className="text-[13px] font-extrabold text-[#0F172A]">
                {maxCapacity}명
              </span>
              <button
                type="button"
                onClick={() => setMaxCapacity(Math.min(50, maxCapacity + 1))}
                className="w-6 h-6 rounded bg-[#E6F7F6] text-[#14B8B0] font-bold text-xs cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 이벤트 기간 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            운영 기간 *{' '}
            <span className="text-[11px] font-normal text-[#94A3B8]">
              (YYYY.MM.DD ~ YYYY.MM.DD)
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="2026.10.20"
              className="flex-1 px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none focus:border-[#14B8B0]"
            />
            <span className="text-[#94A3B8]">~</span>
            <input
              type="text"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2026.11.10"
              className="flex-1 px-3 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none focus:border-[#14B8B0]"
            />
          </div>
        </div>

        {/* 현장 참여 시간 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            현장 참여 시간 *
          </label>

          {/* 요일 선택 */}
          <div className="flex gap-2 mb-2.5">
            {[
              { id: 'EVERYDAY', label: '매일' },
              { id: 'WEEKDAYS', label: '평일' },
              { id: 'WEEKENDS', label: '주말' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDayType(d.id as any)}
                className={`flex-1 py-2 text-[12px] font-bold rounded-[8px] border transition-colors cursor-pointer ${
                  dayType === d.id
                    ? 'border-[#14B8B0] bg-[#E6F7F6] text-[#0F766E]'
                    : 'border-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* 24시간 운영 체크박스 */}
          <div className="flex items-center gap-2 mb-2.5">
            <input
              type="checkbox"
              id="chk24"
              checked={is24Hours}
              onChange={(e) => setIs24Hours(e.target.checked)}
              className="w-4 h-4 accent-[#14B8B0] cursor-pointer"
            />
            <label htmlFor="chk24" className="text-[12px] text-[#475569] font-medium cursor-pointer">
              24시간 상시 운영 / 자율 참여
            </label>
          </div>

          {!is24Hours && (
            <div className="flex flex-col gap-2 p-3 bg-[#F8FAFC] rounded-[10px] border border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="w-12 font-semibold text-[#64748B]">시작:</span>
                <select
                  value={startAmPm}
                  onChange={(e) => setStartAmPm(e.target.value)}
                  className="p-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px]"
                >
                  <option value="오전">오전</option>
                  <option value="오후">오후</option>
                </select>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="p-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px]"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(
                    (h) => (
                      <option key={h} value={h}>
                        {h}시
                      </option>
                    )
                  )}
                </select>
                <select
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  className="p-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px]"
                >
                  {['00', '10', '20', '30', '40', '50'].map((m) => (
                    <option key={m} value={m}>
                      {m}분
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-[12px]">
                <span className="w-12 font-semibold text-[#64748B]">종료:</span>
                <select
                  value={endAmPm}
                  onChange={(e) => setEndAmPm(e.target.value)}
                  className="p-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px]"
                >
                  <option value="오전">오전</option>
                  <option value="오후">오후</option>
                </select>
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="p-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px]"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(
                    (h) => (
                      <option key={h} value={h}>
                        {h}시
                      </option>
                    )
                  )}
                </select>
                <select
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  className="p-1.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px]"
                >
                  {['00', '10', '20', '30', '40', '50'].map((m) => (
                    <option key={m} value={m}>
                      {m}분
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 대표 이미지 등록 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            대표 이미지 등록 *{' '}
            <span className="text-[11px] font-normal text-[#94A3B8]">(20MB 이하)</span>
          </label>
          <div className="flex items-start gap-3">
            <div className="w-[96px] h-[96px] rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col items-center justify-center overflow-hidden shrink-0">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="대표 이미지 미리보기"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Upload size={22} color="#94A3B8" />
                  <span className="text-[10px] text-[#94A3B8] mt-1">20MB 이하</span>
                </>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="이미지 URL을 입력하거나 아래 테마를 선택하세요"
                className="w-full px-3 py-2 rounded-[8px] border-[1.5px] border-[#E2E8F0] text-[12px] outline-none focus:border-[#14B8B0]"
              />
              <div className="flex flex-wrap gap-1.5">
                {PRESET_THUMBNAILS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setThumbnailUrl(preset.url)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer transition-colors ${
                      thumbnailUrl === preset.url
                        ? 'border-[#14B8B0] bg-[#E6F7F6] text-[#0F766E]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 체험 상세 내용 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            체험 상세 내용 *{' '}
            <span className="text-[11px] font-normal text-[#94A3B8]">
              ({content.length}/500자)
            </span>
          </label>
          <textarea
            required
            maxLength={500}
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="체험 커리큘럼, 준비물, 참여 대상 등 상세 안내를 적어주세요."
            className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none transition-colors focus:border-[#14B8B0] resize-none"
          />
        </div>

        {/* 강사 소개 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            강사 / 호스트 소개{' '}
            <span className="text-[11px] font-normal text-[#94A3B8]">
              ({instructorIntro.length}/500자)
            </span>
          </label>
          <textarea
            maxLength={500}
            rows={3}
            value={instructorIntro}
            onChange={(e) => setInstructorIntro(e.target.value)}
            placeholder="호스트의 경험, 약력, 이웃에게 전하고 싶은 인사말을 작성해주세요."
            className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none transition-colors focus:border-[#14B8B0] resize-none"
          />
        </div>

        {/* 장소 등록 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            모임 장소 등록 *
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              required
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder={`장소명 (예: ${townName} 마을 공유공방 1층)`}
              className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none focus:border-[#14B8B0]"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="상세 주소 (선택, 예: 성남시 중원구 금광로 42)"
              className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none focus:border-[#14B8B0]"
            />
          </div>
        </div>

        {/* 태그 등록 */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-1.5">
            태그 등록 <span className="text-[11px] font-normal text-[#94A3B8]">({tags.length}/10개)</span>
          </label>
          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="태그 입력 후 추가 (예: 목공방, 쿠킹클래스)"
              className="flex-1 px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-[#E2E8F0] text-[13px] outline-none focus:border-[#14B8B0]"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-[#14B8B0] text-white rounded-[10px] text-[13px] font-bold cursor-pointer hover:bg-[#119E97] transition-colors"
            >
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#E6F7F6] text-[#14B8B0]"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                  aria-label={`${tag} 태그 삭제`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 하단 고정 버튼 (미리보기 / 등록하기) */}
        <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3.5 bg-white/95 backdrop-blur border-t border-[#F3F4F6] z-20 flex gap-2.5">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 py-3.5 rounded-[12px] text-[14px] font-bold text-[#334155] bg-[#F1F5F9] cursor-pointer hover:bg-[#E2E8F0] transition-colors"
          >
            미리보기
          </button>
          <button
            type="submit"
            className="flex-[2] py-3.5 rounded-[12px] text-[14px] font-extrabold text-white bg-[#14B8B0] cursor-pointer hover:bg-[#119E97] transition-colors shadow-xs"
          >
            체험 등록하기
          </button>
        </div>
      </form>

      {/* 미리보기 모달 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]">
          <div className="bg-white rounded-[18px] max-w-[390px] w-full max-h-[82vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-extrabold text-[#0F172A]">체험 카드 미리보기</h3>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-full hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div className="rounded-[14px] overflow-hidden border border-[#E2E8F0] mb-4">
              <div className="relative h-44 bg-[#F8FAFC]">
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                  }}
                />
                <div className="absolute left-3 bottom-3 right-3 text-white">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/25 backdrop-blur-xs px-2 py-0.5 rounded-full mb-1">
                    <Clock size={11} />
                    <span>
                      {startTimeFormatted} ~ {endTimeFormatted}
                    </span>
                  </span>
                  <h4 className="font-bold text-[15px] line-clamp-1">
                    {title || '체험 프로그램 제목 미입력'}
                  </h4>
                </div>
              </div>

              <div className="p-3.5 bg-white">
                <div className="flex items-center justify-between text-[12px] mb-2">
                  <span className="flex items-center gap-1 font-semibold text-[#334155]">
                    <MapPin size={13} color="#14B8B0" />
                    {placeName || '장소 미지정'}
                  </span>
                  <span className="font-bold text-[#14B8B0] bg-[#E6F7F6] px-2 py-0.5 rounded">
                    잔여 {maxCapacity}석
                  </span>
                </div>
                <p className="text-[12px] text-[#475569] whitespace-pre-wrap leading-relaxed">
                  {content || '상세 내용이 여기에 표시됩니다.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="w-full py-3 bg-[#14B8B0] text-white font-extrabold rounded-[12px] text-[14px] cursor-pointer hover:bg-[#119E97]"
            >
              확인 후 계속 작성하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

