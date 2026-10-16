import { EventStatus } from '../../../types/resident';

/**
 * KST 기준 오늘 날짜 문자열(YYYY-MM-DD) 반환
 */
export function getKSTTodayString(now: Date = new Date()): string {
  // KST: UTC+9
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 3600000);
  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 행사 상태 판정:
 * - 시작일이 없으면 'NONE'
 * - 오늘 < 시작일: 'UPCOMING' ('예정')
 * - 오늘 > 종료일: 'ENDED' ('종료')
 * - 시작일 <= 오늘 <= 종료일: 'LIVE' ('진행중')
 */
export function getEventStatus(
  eventStartDate: string | null | undefined,
  eventEndDate: string | null | undefined,
  todayStr: string = getKSTTodayString()
): EventStatus {
  if (!eventStartDate) {
    return 'NONE';
  }

  const start = eventStartDate.slice(0, 10);
  const end = (eventEndDate || eventStartDate).slice(0, 10);

  if (todayStr < start) {
    return 'UPCOMING';
  }
  if (todayStr > end) {
    return 'ENDED';
  }
  return 'LIVE';
}
