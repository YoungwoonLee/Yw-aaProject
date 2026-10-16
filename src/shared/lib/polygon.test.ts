import { describe, it, expect } from 'vitest';
import {
  parseMultiPolygon,
  calculateDistanceMeters,
  extractDongName,
} from './polygon';

describe('parseMultiPolygon', () => {
  it('parses valid 3D [[[lng, lat], ...]] JSON string and maps lng/lat order correctly', () => {
    const raw = JSON.stringify([
      [
        [127.162, 37.442],
        [127.173, 37.442],
        [127.173, 37.451],
        [127.162, 37.451],
      ],
    ]);

    const rings = parseMultiPolygon(raw);
    expect(rings).toHaveLength(1);
    expect(rings[0]).toHaveLength(4);
    expect(rings[0][0]).toEqual({ lat: 37.442, lng: 127.162 });
    expect(rings[0][2]).toEqual({ lat: 37.451, lng: 127.173 });
  });

  it('returns empty array for invalid JSON or malformed coordinates', () => {
    expect(parseMultiPolygon('not-json')).toEqual([]);
    expect(parseMultiPolygon('[[[127.162]]]')).toEqual([]);
    expect(parseMultiPolygon('')).toEqual([]);
  });

  it('extracts short dong name from full town name', () => {
    expect(extractDongName('경기도 성남시 중원구 금광동')).toBe('금광동');
    expect(extractDongName('충청북도 청주시 상당구 남주동')).toBe('남주동');
  });

  it('calculates distance in meters accurately', () => {
    const dist = calculateDistanceMeters(37.4465, 127.1678, 37.4562, 127.1725);
    expect(dist).toBeGreaterThan(1000);
    expect(dist).toBeLessThan(1500);
  });
});
