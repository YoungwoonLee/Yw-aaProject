import { FeedContent } from './content';

/**
 * 법정동 코드 (10자리, 로컬탭 전용) vs 행정동 코드 (주민탭 전용) 브랜드 타입 분리
 * 주의: 로컬탭은 법정동(API_BEOP_JUNG_DONG) 코드, 주민탭은 행정동(hdongCodeValue) 코드를 쓴다.
 */
export type BeopjungdongCode = string & { readonly __brand: 'BeopjungdongCode' };
export type HangjungdongCode = string & { readonly __brand: 'HangjungdongCode' };

export function asBeopjungdongCode(code: string): BeopjungdongCode {
  return code as BeopjungdongCode;
}

export function asHangjungdongCode(code: string): HangjungdongCode {
  return code as HangjungdongCode;
}

export type FeedMode = 'LATEST' | 'REGIONAL';

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * 1) 로컬 피드 요청
 * POST /api/content/village-news/search
 */
export interface RegionalFeedRequest {
  displayLatitude: number;   // 선택 동네 중심 위도 (centerLatitude)
  displayLongitude: number;  // 선택 동네 중심 경도
  readContentIds: number[];  // 읽은 글 ID (GET /api/content/read-history?mainMode=REGIONAL)
  size: number;              // 12
  lastSearchSort: [string, string] | null; // 예: ["2349.6191","7625"] = [중심으로부터 거리(m), contentId]
}

export interface RegionalFeedResponse {
  message: string;
  result: {
    content: FeedContent[];
    lastSearchSort: [string, string] | null;
  };
}

/**
 * 2) 좌표로 동네 영역 조회 (지도 그리기의 핵심)
 * POST /api/area/polygon-search/by-coordinates   body: { latiY: number; longiX: number }
 */
export interface PartialMultiPolygonArea {
  codeValue: BeopjungdongCode; // 법정동 코드 10자리
  townName: string;            // "경기도 성남시 중원구 금광동"
  multipolygon: string;
  centerLatitude: number;
  centerLongitude: number;
}

export interface AreaByCoordinatesResult {
  globalMultiPolygonArea: {
    multipolygon: string;   // 선택 동네 + 주변 동네를 합친 바깥 경계 "[[[lng, lat], ...]]"
    maxLength: number;      // 영역 최대 길이(m) → 지도 줌 계산에 사용
  };
  partialMultiPolygonAreas: PartialMultiPolygonArea[];
}

/**
 * 3) 법정동 코드로 동네 조회
 * GET /api/area/code-value/my-town?codeValue=4113310300
 */
export interface MyTownResult {
  apiType: 'API_BEOP_JUNG_DONG';
  apiDepth: 3;
  codeValue: BeopjungdongCode;
  areaName: string;          // "금광동"
  areaFullName: string;      // "경기도 성남시 중원구 금광동"
  multiPolygonStr: string;
  centerPointX: number;      // 경도
  centerPointY: number;      // 위도
}

/**
 * 4) 좌표 → 내 동네(현재 위치로 설정)
 * POST /api/area/point/my-town   body: { latiY, longiX }
 */
export interface PointMyTownResult extends MyTownResult {
  hangjungdongName: string;  // 예: "금광2동"
}

/**
 * 5) 읍·면·동 검색
 * GET /api/area/polygon-search?findKeyword=삼성&page=0
 */
export interface PolygonSearchItem {
  codeValue: BeopjungdongCode;
  areaFullName: string;
}

export interface SpringPage<T> {
  content: T[];
  pageSize: number;
  pageNumber: number;
  last: boolean;
  totalElements: number;
}

/**
 * 6) 최근 설정된 동네
 * GET /api/localbox/recent-visit-town
 */
export interface RecentVisitTownItem {
  visitTownId: number;
  visitTownName: string;
  visitTownLatitude: number;
  visitTownLongitude: number;
  codeValue?: BeopjungdongCode;
}

/**
 * 7) 최근 검색어
 * GET /api/area/polygon-search/recent-search-keyword
 * TODO(확인필요): 실제 응답 스키마 미확인, 키워드 문자열 배열 또는 객체 형태 확인 필요
 */
export interface RecentSearchKeywordItem {
  keywordId: number;
  keyword: string;
}

/**
 * 전역 스토어에 유지되는 현재 선택 동네 상태
 */
export interface SelectedTownState {
  codeValue: BeopjungdongCode;
  areaName: string;       // 예: "금광동"
  areaFullName: string;   // 예: "경기도 성남시 중원구 금광동"
  centerLatitude: number; // 위도 (centerPointY)
  centerLongitude: number;// 경도 (centerPointX)
}
