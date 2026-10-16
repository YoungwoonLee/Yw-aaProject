import {
  AreaByCoordinatesResult,
  asBeopjungdongCode,
  BeopjungdongCode,
  MyTownResult,
  PartialMultiPolygonArea,
  PointMyTownResult,
  PolygonSearchItem,
  RecentSearchKeywordItem,
  RecentVisitTownItem,
  RegionalFeedRequest,
  RegionalFeedResponse,
  SelectedTownState,
  SpringPage,
} from '../../../types/local';
import {
  INITIAL_RECENT_SEARCH_KEYWORDS,
  INITIAL_RECENT_VISIT_TOWNS,
  MOCK_REGIONAL_FEEDS,
  SEONGNAM_AREA_BY_COORDINATES,
  SEONGNAM_PARTIAL_AREAS,
  TOWN_CATALOG,
} from '../mocks/localFixtures';
import { getStoredFeeds } from '../../../mocks/handlers';
import { calculateDistanceMeters, extractDongName } from '../../../shared/lib/polygon';

const RECENT_TOWNS_STORAGE_KEY = 'ondaji_recent_visit_towns_v1';
const RECENT_KEYWORDS_STORAGE_KEY = 'ondaji_recent_keywords_v1';

/**
 * TanStack Query 키 규칙
 * 동네가 바뀌면 쿼리 키(['feed', 'regional', codeValue])가 바뀌어 처음부터 다시 조회한다.
 */
export const localQueryKeys = {
  regionalFeed: (codeValue: BeopjungdongCode) =>
    ['feed', 'regional', codeValue] as const,
  readHistory: () => ['content', 'read-history', 'REGIONAL'] as const,
  areaByCoordinates: (lat: number, lng: number) =>
    ['area', 'by-coordinates', Number(lat.toFixed(4)), Number(lng.toFixed(4))] as const,
  myTownByCode: (codeValue: BeopjungdongCode) =>
    ['area', 'my-town', codeValue] as const,
  polygonSearch: (keyword: string, page: number) =>
    ['area', 'polygon-search', keyword, page] as const,
  recentVisitTowns: () => ['localbox', 'recent-visit-town'] as const,
  recentSearchKeywords: () => ['area', 'recent-search-keyword'] as const,
  unreadNotification: () => ['notification', 'unread-yn', 'NOTIFICATION'] as const,
};

function getStoredRecentTowns(): RecentVisitTownItem[] {
  try {
    const raw = localStorage.getItem(RECENT_TOWNS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return INITIAL_RECENT_VISIT_TOWNS;
}

function saveStoredRecentTowns(items: RecentVisitTownItem[]): void {
  try {
    localStorage.setItem(RECENT_TOWNS_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

/**
 * 1) 로컬 피드 조회
 * POST /api/content/village-news/search
 * - 선택 동네 중심점(displayLatitude, displayLongitude)으로부터 거리순 정렬
 * - 읽은 글 ID 목록(readContentIds)에 포함된 글은 서버가 뒤로 미룸
 * - 12건 단위 커서(lastSearchSort: [distanceStr, contentIdStr] | null) 페이지네이션
 */
export async function fetchRegionalVillageNews(
  req: RegionalFeedRequest
): Promise<RegionalFeedResponse> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const size = req.size || 12;
  const readSet = new Set(req.readContentIds || []);

  // 저장된 좋아요/북마크 상태 반영
  const storedMap = new Map(getStoredFeeds().map((f) => [f.contentId, f]));

  // 거리 계산 및 선택 동네 맞춤 노출 비율 보정
  const enriched = MOCK_REGIONAL_FEEDS.map((fixture) => {
    const stored = storedMap.get(fixture.contentId);
    const merged = stored ? { ...fixture, ...stored } : fixture;
    const distance = calculateDistanceMeters(
      req.displayLatitude,
      req.displayLongitude,
      fixture.latitude,
      fixture.longitude
    );
    const isRead = readSet.has(fixture.contentId);
    return {
      feed: merged,
      distance,
      isRead,
    };
  });

  // 정렬:
  // 1순위: 안 읽은 글(isRead === false) 우선, 읽은 글(isRead === true)은 뒤로 미룸
  // 2순위: 중심점으로부터의 거리(distance) 오름차순
  // 3순위: contentId 내림차순
  enriched.sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    if (Math.abs(a.distance - b.distance) > 0.01) {
      return a.distance - b.distance;
    }
    return b.feed.contentId - a.feed.contentId;
  });

  let startIndex = 0;
  if (req.lastSearchSort && req.lastSearchSort.length === 2) {
    const cursorContentId = Number(req.lastSearchSort[1]);
    const idx = enriched.findIndex((item) => item.feed.contentId === cursorContentId);
    if (idx !== -1) {
      startIndex = idx + 1;
    }
  }

  const paged = enriched.slice(startIndex, startIndex + size);
  const hasMore = startIndex + size < enriched.length;

  let nextSort: [string, string] | null = null;
  if (hasMore && paged.length > 0) {
    const lastItem = paged[paged.length - 1];
    nextSort = [lastItem.distance.toFixed(4), String(lastItem.feed.contentId)];
  }

  return {
    message: 'SUCCESS',
    result: {
      content: paged.map((p) => p.feed),
      lastSearchSort: nextSort,
    },
  };
}

/**
 * 읽은 글 ID 목록 조회
 * GET /api/content/read-history?mainMode=REGIONAL
 */
export async function fetchReadHistory(isLoggedIn = true): Promise<number[]> {
  if (!isLoggedIn) {
    return [];
  }
  return [];
}

/**
 * 2) 좌표로 동네 영역 조회 (지도 그리기의 핵심)
 * POST /api/area/polygon-search/by-coordinates   body: { latiY: number; longiX: number }
 */
export async function fetchAreaByCoordinates(body: {
  latiY: number;
  longiX: number;
}): Promise<AreaByCoordinatesResult> {
  await new Promise((resolve) => setTimeout(resolve, 80));

  // 성남시 중원구/수정구 인근이면 기본 7개 동네 폴리곤 반환
  const distToGeumgwang = calculateDistanceMeters(
    body.latiY,
    body.longiX,
    37.4465,
    127.1678
  );
  if (distToGeumgwang < 5000) {
    return SEONGNAM_AREA_BY_COORDINATES;
  }

  // 그 외 지역(예: 남주동, 삼성동, 도봉동 등)일 경우 중심 좌표 기준 7개 동네 다각형 동적 생성
  const matchedTown =
    TOWN_CATALOG.find(
      (t) =>
        calculateDistanceMeters(
          body.latiY,
          body.longiX,
          t.centerLatitude,
          t.centerLongitude
        ) < 3000
    ) || TOWN_CATALOG[0];

  const cLat = matchedTown.centerLatitude;
  const cLng = matchedTown.centerLongitude;
  const prefix = matchedTown.areaFullName.split(' ').slice(0, -1).join(' ');

  const neighborNames = ['중앙동', '북부동', '동부동', '서부동', '남부동', '신촌동'];
  const offsets = [
    { dLat: 0.011, dLng: -0.006 },
    { dLat: 0.011, dLng: 0.008 },
    { dLat: 0.002, dLng: -0.014 },
    { dLat: -0.008, dLng: -0.013 },
    { dLat: -0.008, dLng: 0.011 },
    { dLat: -0.01, dLng: 0.0 },
  ];

  const partials: PartialMultiPolygonArea[] = [
    {
      codeValue: matchedTown.codeValue,
      townName: matchedTown.areaFullName,
      centerLatitude: cLat,
      centerLongitude: cLng,
      multipolygon: JSON.stringify([
        [
          [cLng - 0.0065, cLat - 0.0045],
          [cLng + 0.0065, cLat - 0.0045],
          [cLng + 0.0065, cLat + 0.0045],
          [cLng - 0.0065, cLat + 0.0045],
          [cLng - 0.0065, cLat - 0.0045],
        ],
      ]),
    },
    ...offsets.map((off, idx) => {
      const nLat = cLat + off.dLat;
      const nLng = cLng + off.dLng;
      return {
        codeValue: asBeopjungdongCode(
          `${matchedTown.codeValue.slice(0, 7)}${idx + 2}00`
        ),
        townName: `${prefix} ${neighborNames[idx]}`,
        centerLatitude: nLat,
        centerLongitude: nLng,
        multipolygon: JSON.stringify([
          [
            [nLng - 0.006, nLat - 0.004],
            [nLng + 0.006, nLat - 0.004],
            [nLng + 0.006, nLat + 0.004],
            [nLng - 0.006, nLat + 0.004],
            [nLng - 0.006, nLat - 0.004],
          ],
        ]),
      };
    }),
  ];

  const globalMultiPolygon = JSON.stringify([
    [
      [cLng - 0.02, cLat - 0.015],
      [cLng + 0.018, cLat - 0.015],
      [cLng + 0.018, cLat + 0.016],
      [cLng - 0.02, cLat + 0.016],
      [cLng - 0.02, cLat - 0.015],
    ],
  ]);

  return {
    globalMultiPolygonArea: {
      multipolygon: globalMultiPolygon,
      maxLength: 4200,
    },
    partialMultiPolygonAreas: partials,
  };
}

/**
 * 3) 법정동 코드로 동네 조회
 * GET /api/area/code-value/my-town?codeValue=4113310300
 */
export async function fetchMyTownByCodeValue(
  codeValue: BeopjungdongCode
): Promise<MyTownResult> {
  await new Promise((resolve) => setTimeout(resolve, 60));

  const found = TOWN_CATALOG.find((t) => t.codeValue === codeValue);
  if (found) {
    return {
      apiType: 'API_BEOP_JUNG_DONG',
      apiDepth: 3,
      codeValue: found.codeValue,
      areaName: found.areaName,
      areaFullName: found.areaFullName,
      multiPolygonStr: found.multiPolygonStr,
      centerPointX: found.centerLongitude,
      centerPointY: found.centerLatitude,
    };
  }

  // 성남시 부분 영역에서 탐색
  const partial = SEONGNAM_PARTIAL_AREAS.find((p) => p.codeValue === codeValue);
  if (partial) {
    return {
      apiType: 'API_BEOP_JUNG_DONG',
      apiDepth: 3,
      codeValue: partial.codeValue,
      areaName: extractDongName(partial.townName),
      areaFullName: partial.townName,
      multiPolygonStr: partial.multipolygon,
      centerPointX: partial.centerLongitude,
      centerPointY: partial.centerLatitude,
    };
  }

  const fallback = TOWN_CATALOG[0];
  return {
    apiType: 'API_BEOP_JUNG_DONG',
    apiDepth: 3,
    codeValue,
    areaName: fallback.areaName,
    areaFullName: fallback.areaFullName,
    multiPolygonStr: fallback.multiPolygonStr,
    centerPointX: fallback.centerLongitude,
    centerPointY: fallback.centerLatitude,
  };
}

/**
 * 4) 좌표 → 내 동네(현재 위치로 설정)
 * POST /api/area/point/my-town   body: { latiY, longiX }
 * → MyTownResult와 같은 형태 + hangjungdongName("금광2동")
 */
export async function fetchMyTownByPoint(body: {
  latiY: number;
  longiX: number;
}): Promise<PointMyTownResult> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 가장 가까운 동네 찾기
  let closest = TOWN_CATALOG[0];
  let minDistance = Infinity;

  for (const item of TOWN_CATALOG) {
    const d = calculateDistanceMeters(
      body.latiY,
      body.longiX,
      item.centerLatitude,
      item.centerLongitude
    );
    if (d < minDistance) {
      minDistance = d;
      closest = item;
    }
  }

  return {
    apiType: 'API_BEOP_JUNG_DONG',
    apiDepth: 3,
    codeValue: closest.codeValue,
    areaName: closest.areaName,
    areaFullName: closest.areaFullName,
    multiPolygonStr: closest.multiPolygonStr,
    centerPointX: closest.centerLongitude,
    centerPointY: closest.centerLatitude,
    hangjungdongName: closest.hangjungdongName,
  };
}

/**
 * 5) 읍·면·동 검색
 * GET /api/area/polygon-search?findKeyword=삼성&page=0
 * → Spring Page<{ codeValue: string; areaFullName: string }> (pageSize 20, last, totalElements)
 */
export async function searchPolygonAreas(
  findKeyword: string,
  page = 0
): Promise<SpringPage<PolygonSearchItem>> {
  await new Promise((resolve) => setTimeout(resolve, 80));

  const trimmed = findKeyword.trim();
  const filtered = trimmed
    ? TOWN_CATALOG.filter(
        (t) =>
          t.areaFullName.includes(trimmed) ||
          t.areaName.includes(trimmed)
      )
    : TOWN_CATALOG;

  const pageSize = 20;
  const start = page * pageSize;
  const sliced = filtered.slice(start, start + pageSize).map((item) => ({
    codeValue: item.codeValue,
    areaFullName: item.areaFullName,
  }));

  return {
    content: sliced,
    pageSize,
    pageNumber: page,
    last: start + pageSize >= filtered.length,
    totalElements: filtered.length,
  };
}

/**
 * 6) 최근 설정된 동네 조회
 * GET /api/localbox/recent-visit-town
 */
export async function fetchRecentVisitTowns(): Promise<RecentVisitTownItem[]> {
  return getStoredRecentTowns();
}

/**
 * 최근 설정된 동네 기록 추가
 */
export async function recordRecentVisitTown(
  town: SelectedTownState
): Promise<RecentVisitTownItem[]> {
  const current = getStoredRecentTowns();
  const filtered = current.filter(
    (item) =>
      item.visitTownName !== town.areaFullName &&
      item.codeValue !== town.codeValue
  );
  const nextItem: RecentVisitTownItem = {
    visitTownId: Date.now(),
    visitTownName: town.areaFullName,
    visitTownLatitude: town.centerLatitude,
    visitTownLongitude: town.centerLongitude,
    codeValue: town.codeValue,
  };
  const updated = [nextItem, ...filtered].slice(0, 8);
  saveStoredRecentTowns(updated);
  return updated;
}

/**
 * 최근 설정된 동네 삭제
 * DELETE /api/localbox/recent-visit-town/{visitTownId} 가정
 * TODO(확인필요): 최근 설정 동네 삭제 API 실제 엔드포인트 및 메서드 명세 확인 필요
 */
export async function deleteRecentVisitTown(
  visitTownId: number
): Promise<RecentVisitTownItem[]> {
  const current = getStoredRecentTowns();
  const updated = current.filter((item) => item.visitTownId !== visitTownId);
  saveStoredRecentTowns(updated);
  return updated;
}

/**
 * 7) 최근 검색어 조회
 * GET /api/area/polygon-search/recent-search-keyword
 * TODO(확인필요): 로그인 필요, 최근 검색어 응답 형태 및 저장/삭제 API 확인 필요
 */
export async function fetchRecentSearchKeywords(): Promise<
  RecentSearchKeywordItem[]
> {
  try {
    const raw = localStorage.getItem(RECENT_KEYWORDS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return INITIAL_RECENT_SEARCH_KEYWORDS;
}

export async function addRecentSearchKeyword(
  keyword: string
): Promise<RecentSearchKeywordItem[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return fetchRecentSearchKeywords();
  const current = await fetchRecentSearchKeywords();
  const filtered = current.filter((k) => k.keyword !== trimmed);
  const updated = [
    { keywordId: Date.now(), keyword: trimmed },
    ...filtered,
  ].slice(0, 6);
  try {
    localStorage.setItem(RECENT_KEYWORDS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

/**
 * 8) 안 읽은 알림 여부 조회
 * GET /api/notification/unread-yn?unreadType=NOTIFICATION
 */
export async function fetchUnreadNotificationYn(): Promise<{
  unreadYn: boolean;
}> {
  return { unreadYn: true };
}
