const KOREAN_DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

function formatSingleDate(dateStr: string): string {
  // YYYY-MM-DD 또는 YYYY.MM.DD
  const clean = dateStr.slice(0, 10).replace(/\./g, '-');
  const parts = clean.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  // 요일 계산
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  const dayName = KOREAN_DAY_NAMES[dateObj.getDay()];

  return `${year}.${month}.${day}(${dayName})`;
}

/**
 * 행사일 표기:
 * - 하루짜리: 2026.10.10(토)
 * - 기간: 2026.10.06(화)~2027.04.30(금)
 */
export function formatEventDate(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  if (!startDate) return '';

  const formattedStart = formatSingleDate(startDate);
  if (!endDate || startDate.slice(0, 10) === endDate.slice(0, 10)) {
    return formattedStart;
  }

  const formattedEnd = formatSingleDate(endDate);
  return `${formattedStart}~${formattedEnd}`;
}
