/**
 * 상대 시간 표기 유틸:
 * Intl.RelativeTimeFormat 기반
 * - 1시간 미만: n분전
 * - 24시간 미만: n시간전
 * - 1일 전 (24~48시간): 어제
 * - 2~7일: n일전
 * - 7일 초과: YYYY.MM.DD
 */
export function formatRelativeTime(dateInput: string | Date | number): string {
  if (!dateInput) return '';

  let date: Date;
  if (typeof dateInput === 'string') {
    if (dateInput.includes(' ') && !dateInput.includes('T')) {
      // Parse 'YYYY-MM-DD HH:mm:ss' in local timezone
      date = new Date(dateInput.replace(/-/g, '/'));
      if (isNaN(date.getTime())) {
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return String(dateInput);
  }

  const now = Date.now();
  const diffMs = now - date.getTime();

  // 미래 시각일 경우 방금 전
  if (diffMs <= 0) {
    return '방금전';
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) {
    return '방금전';
  }

  if (diffMin < 60) {
    return `${diffMin}분전`;
  }

  if (diffHour < 24) {
    return `${diffHour}시간전`;
  }

  if (diffDay === 1) {
    return '어제';
  }

  if (diffDay <= 7) {
    return `${diffDay}일전`;
  }

  // 7일 초과: YYYY.MM.DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 로컬탭 날짜 표기 유틸:
 * - 7일 이내: N일전 (당일/24시간 미만도 1일전 또는 N일전 표기)
 * - 7일 초과: MM.DD
 */
export function formatRegionalDate(dateInput: string | Date | number): string {
  if (!dateInput) return '';

  let date: Date;
  if (typeof dateInput === 'string') {
    if (dateInput.includes(' ') && !dateInput.includes('T')) {
      date = new Date(dateInput.replace(/-/g, '/'));
      if (isNaN(date.getTime())) {
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return String(dateInput);
  }

  const now = Date.now();
  const diffMs = Math.max(0, now - date.getTime());
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDay <= 7) {
    const days = Math.max(1, diffDay);
    return `${days}일전`;
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}`;
}

