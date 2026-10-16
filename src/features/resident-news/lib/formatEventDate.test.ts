import { describe, it, expect } from 'vitest';
import { formatEventDate } from './formatEventDate';

describe('formatEventDate', () => {
  it('formats single day event correctly with day of week', () => {
    // 2026-10-10 was a Saturday (토)
    expect(formatEventDate('2026-10-10', '2026-10-10')).toBe('2026.10.10(토)');
    expect(formatEventDate('2026-10-10', null)).toBe('2026.10.10(토)');
  });

  it('formats range event correctly', () => {
    // 2026-10-06 is Tuesday (화), 2026-10-15 is Thursday (목)
    expect(formatEventDate('2026-10-06', '2026-10-15')).toBe('2026.10.06(화)~2026.10.15(목)');
  });

  it('formats range crossing year boundary correctly', () => {
    // 2026-10-06(화) ~ 2027-04-30(금)
    expect(formatEventDate('2026-10-06', '2027-04-30')).toBe('2026.10.06(화)~2027.04.30(금)');
  });

  it('returns empty string when startDate is missing', () => {
    expect(formatEventDate(null, null)).toBe('');
  });
});
