import { z } from 'zod';
import { LatLng } from '../../types/local';

/**
 * 폴리곤 좌표 튜플: [lng(경도), lat(위도)]
 * 대한민국 주변 유효 위경도 범위 또는 일반 숫자 튜플을 검증
 */
const LngLatTupleSchema = z.tuple([z.number().finite(), z.number().finite()]);

/**
 * 3단계 배열 "[[[lng, lat], ...]]" 또는 4단계 MultiPolygon "[[[[lng, lat], ...]]]" 모두 수용
 */
const RingSchema = z.array(LngLatTupleSchema).min(3);
const MultiPolygon3DSchema = z.array(RingSchema).min(1);
const MultiPolygon4DSchema = z.array(z.array(RingSchema).min(1)).min(1);

/**
 * 폴리곤 문자열 파싱 유틸:
 * "[[[lng, lat], ...]]" JSON 배열 문자열을 파싱하고 zod로 검증하여 LatLng[][] 반환.
 * 주의: 원본 문자열의 [lng, lat] 순서를 { lat, lng } 로 정확히 매핑한다.
 */
export function parseMultiPolygon(str: string): LatLng[][] {
  if (!str || typeof str !== 'string') {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(str);
  } catch {
    return [];
  }

  const res3D = MultiPolygon3DSchema.safeParse(parsed);
  if (res3D.success) {
    return res3D.data.map((ring) =>
      ring.map(([lng, lat]) => ({
        lat,
        lng,
      }))
    );
  }

  const res4D = MultiPolygon4DSchema.safeParse(parsed);
  if (res4D.success) {
    const rings: LatLng[][] = [];
    for (const poly of res4D.data) {
      for (const ring of poly) {
        rings.push(
          ring.map(([lng, lat]) => ({
            lat,
            lng,
          }))
        );
      }
    }
    return rings;
  }

  return [];
}

/**
 * 두 위경도 좌표 사이의 거리(m) 계산 (Haversine 공식)
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 지구 반지름 (m)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 전체 주소명("경기도 성남시 중원구 금광동")에서 마지막 읍·면·동 이름("금광동") 추출
 */
export function extractDongName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || fullName;
}
