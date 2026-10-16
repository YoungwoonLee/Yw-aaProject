import { describe, it, expect } from 'vitest';
import { formatRelativeTime, formatRegionalDate } from './relativeTime';

describe('formatRelativeTime', () => {
  it('formats minutes ago correctly', () => {
    const now = Date.now();
    const fourteenMinsAgo = new Date(now - 14 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fourteenMinsAgo)).toBe('14분전');
  });

  it('formats hours ago correctly', () => {
    const now = Date.now();
    const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(oneHourAgo)).toBe('1시간전');

    const fiveHoursAgo = new Date(now - 5 * 3600 * 1000).toISOString();
    expect(formatRelativeTime(fiveHoursAgo)).toBe('5시간전');
  });

  it('formats yesterday correctly', () => {
    const now = Date.now();
    const yesterday = new Date(now - 25 * 3600 * 1000).toISOString();
    expect(formatRelativeTime(yesterday)).toBe('어제');
  });

  it('formats days ago correctly within 7 days', () => {
    const now = Date.now();
    const threeDaysAgo = new Date(now - 3 * 86400 * 1000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe('3일전');
  });

  it('formats YYYY.MM.DD when over 7 days', () => {
    const pastDate = new Date('2026-01-15T10:00:00Z');
    expect(formatRelativeTime(pastDate.toISOString())).toBe('2026.01.15');
  });

  it('handles KST string format YYYY-MM-DD HH:mm:ss', () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const nowKST = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    expect(formatRelativeTime(nowKST)).toBe('방금전');
  });
});

describe('formatRegionalDate', () => {
  it('formats within 7 days as N일전', () => {
    const now = Date.now();
    const threeDaysAgo = new Date(now - 3 * 86400 * 1000).toISOString();
    expect(formatRegionalDate(threeDaysAgo)).toBe('3일전');

    const sevenDaysAgo = new Date(now - 7 * 86400 * 1000).toISOString();
    expect(formatRegionalDate(sevenDaysAgo)).toBe('7일전');
  });

  it('formats dates older than 7 days as MM.DD', () => {
    const pastDate = new Date('2026-03-08T10:00:00Z');
    expect(formatRegionalDate(pastDate.toISOString())).toBe('03.08');
  });
});

