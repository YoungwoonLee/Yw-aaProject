import { describe, it, expect } from 'vitest';
import { getEventStatus } from './eventStatus';

describe('getEventStatus', () => {
  const TODAY = '2026-10-11';

  it('returns NONE when eventStartDate is missing', () => {
    expect(getEventStatus(null, null, TODAY)).toBe('NONE');
    expect(getEventStatus('', '', TODAY)).toBe('NONE');
    expect(getEventStatus(undefined, undefined, TODAY)).toBe('NONE');
  });

  it('returns LIVE when today is exactly eventStartDate', () => {
    expect(getEventStatus('2026-10-11', '2026-10-15', TODAY)).toBe('LIVE');
    expect(getEventStatus('2026-10-11', '2026-10-11', TODAY)).toBe('LIVE');
  });

  it('returns LIVE when today is exactly eventEndDate', () => {
    expect(getEventStatus('2026-10-01', '2026-10-11', TODAY)).toBe('LIVE');
  });

  it('returns LIVE when today is between start and end date', () => {
    expect(getEventStatus('2026-10-05', '2026-10-20', TODAY)).toBe('LIVE');
  });

  it('returns UPCOMING when today is before eventStartDate', () => {
    expect(getEventStatus('2026-10-12', '2026-10-25', TODAY)).toBe('UPCOMING');
  });

  it('returns ENDED when today is after eventEndDate', () => {
    expect(getEventStatus('2026-10-01', '2026-10-10', TODAY)).toBe('ENDED');
  });
});
