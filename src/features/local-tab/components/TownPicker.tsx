import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  Search,
  Crosshair,
  Home,
  MapPin,
  X,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addRecentSearchKeyword,
  deleteRecentVisitTown,
  fetchAreaByCoordinates,
  fetchMyTownByCodeValue,
  fetchMyTownByPoint,
  fetchRecentSearchKeywords,
  fetchRecentVisitTowns,
  localQueryKeys,
  recordRecentVisitTown,
  searchPolygonAreas,
} from '../api/localApi';
import {
  asBeopjungdongCode,
  BeopjungdongCode,
  PartialMultiPolygonArea,
  RecentVisitTownItem,
  SelectedTownState,
} from '../../../types/local';
import { extractDongName, parseMultiPolygon } from '../../../shared/lib/polygon';
import { createMapAdapter, MapAdapter } from '../map/MapAdapter';

export interface TownPickerProps {
  isOpen: boolean;
  selectedTown: SelectedTownState;
  myTown: SelectedTownState;
  onSelectTown: (town: SelectedTownState) => void;
  onSetMyTown?: (town: SelectedTownState) => void;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  mapAdapterFactory?: (container: HTMLElement) => MapAdapter;
}

export const TownPicker: React.FC<TownPickerProps> = ({
  isOpen,
  selectedTown,
  myTown,
  onSelectTown,
  onSetMyTown,
  onClose,
  onShowToast,
  mapAdapterFactory = createMapAdapter,
}) => {
  const queryClient = useQueryClient();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapAdapterRef = useRef<MapAdapter | null>(null);

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // 1) 좌표 기반 동네 영역(global + partial 7개) 조회
  const { data: areaData } = useQuery({
    queryKey: localQueryKeys.areaByCoordinates(
      selectedTown.centerLatitude,
      selectedTown.centerLongitude
    ),
    queryFn: () =>
      fetchAreaByCoordinates({
        latiY: selectedTown.centerLatitude,
        longiX: selectedTown.centerLongitude,
      }),
    enabled: isOpen,
  });

  // 2) 최근 설정된 동네 목록 조회
  const { data: recentVisitTowns = [] } = useQuery({
    queryKey: localQueryKeys.recentVisitTowns(),
    queryFn: fetchRecentVisitTowns,
    enabled: isOpen,
  });

  // 3) 최근 검색어 조회
  const { data: recentKeywords = [] } = useQuery({
    queryKey: localQueryKeys.recentSearchKeywords(),
    queryFn: fetchRecentSearchKeywords,
    enabled: isOpen && isSearchMode,
  });

  // 4) 읍·면·동 키워드 검색 (GET /api/area/polygon-search?findKeyword=...&page=0)
  const { data: searchResultPage, isFetching: isSearching } = useQuery({
    queryKey: localQueryKeys.polygonSearch(searchKeyword, 0),
    queryFn: () => searchPolygonAreas(searchKeyword, 0),
    enabled: isOpen && isSearchMode,
  });

  // 최근 방문 동네 삭제 뮤테이션
  const deleteRecentMutation = useMutation({
    mutationFn: (visitTownId: number) => deleteRecentVisitTown(visitTownId),
    onSuccess: (updated) => {
      queryClient.setQueryData(localQueryKeys.recentVisitTowns(), updated);
    },
  });

  // 동네 확정 공통 함수: 선택 동네 반영 + 최근 방문 동네 추가 + 모달 닫기
  const confirmTownSelection = async (nextTown: SelectedTownState) => {
    const updatedRecents = await recordRecentVisitTown(nextTown);
    queryClient.setQueryData(localQueryKeys.recentVisitTowns(), updatedRecents);
    onSelectTown(nextTown);
    onShowToast?.(`현재 동네가 '${nextTown.areaName}'(으)로 설정되었습니다.`);
    setIsSearchMode(false);
    setSearchKeyword('');
    onClose();
  };

  // 주변 동네 폴리곤 또는 라벨 클릭 시 즉시 동네 변경 확정 및 닫기
  const handlePartialTownClick = async (partial: PartialMultiPolygonArea) => {
    const dongName = extractDongName(partial.townName);
    const nextTown: SelectedTownState = {
      codeValue: partial.codeValue,
      areaName: dongName,
      areaFullName: partial.townName,
      centerLatitude: partial.centerLatitude,
      centerLongitude: partial.centerLongitude,
    };
    await confirmTownSelection(nextTown);
  };

  // 법정동 코드로 상세 조회 후 동네 변경 확정 (검색 결과 클릭 시)
  const handleSelectByCodeValue = async (
    codeValue: BeopjungdongCode,
    keywordToRecord?: string
  ) => {
    if (keywordToRecord) {
      const updatedKeywords = await addRecentSearchKeyword(keywordToRecord);
      queryClient.setQueryData(
        localQueryKeys.recentSearchKeywords(),
        updatedKeywords
      );
    }
    const myTownDetail = await fetchMyTownByCodeValue(codeValue);
    const nextTown: SelectedTownState = {
      codeValue: myTownDetail.codeValue,
      areaName: myTownDetail.areaName,
      areaFullName: myTownDetail.areaFullName,
      centerLatitude: myTownDetail.centerPointY,
      centerLongitude: myTownDetail.centerPointX,
    };
    await confirmTownSelection(nextTown);
  };

  // 최근 방문 동네 클릭 시
  const handleSelectRecentTown = async (item: RecentVisitTownItem) => {
    if (item.codeValue) {
      await handleSelectByCodeValue(item.codeValue);
      return;
    }
    const pointResult = await fetchMyTownByPoint({
      latiY: item.visitTownLatitude,
      longiX: item.visitTownLongitude,
    });
    await confirmTownSelection({
      codeValue: pointResult.codeValue,
      areaName: extractDongName(item.visitTownName) || pointResult.areaName,
      areaFullName: item.visitTownName || pointResult.areaFullName,
      centerLatitude: item.visitTownLatitude,
      centerLongitude: item.visitTownLongitude,
    });
  };

  // [ ⊕ 현재 위치로 설정 ] 버튼 핸들러 (POST /api/area/point/my-town)
  const handleSetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let latiY = 37.4465;
      let longiX = 127.1678;

      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 1500,
            });
          });
          latiY = pos.coords.latitude;
          longiX = pos.coords.longitude;
        } catch {
          // 권한 거부 또는 타임아웃 시 성남시 금광동 기본 좌표 사용
        }
      }

      const pointTown = await fetchMyTownByPoint({ latiY, longiX });
      const nextTown: SelectedTownState = {
        codeValue: pointTown.codeValue,
        areaName: pointTown.areaName,
        areaFullName: pointTown.areaFullName,
        centerLatitude: pointTown.centerPointY,
        centerLongitude: pointTown.centerPointX,
      };
      onSetMyTown?.(nextTown);
      await confirmTownSelection(nextTown);
    } finally {
      setIsLocating(false);
    }
  };

  // 지도 어댑터 초기화 및 폴리곤/마커 렌더링
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const adapter = mapAdapterFactory(mapContainerRef.current);
    mapAdapterRef.current = adapter;

    return () => {
      adapter.destroy();
      mapAdapterRef.current = null;
    };
  }, [isOpen, mapAdapterFactory]);

  useEffect(() => {
    const adapter = mapAdapterRef.current;
    if (!isOpen || !adapter || !areaData) return;

    adapter.clearOverlays();

    // 1. globalMultiPolygonArea 파싱 및 바운드 맞춤 + 진한 틸 외곽선(채움 없음)
    const globalRings = parseMultiPolygon(
      areaData.globalMultiPolygonArea.multipolygon
    );
    const allCoords = globalRings.flat();
    if (allCoords.length > 0) {
      adapter.fitBounds(
        allCoords,
        areaData.globalMultiPolygonArea.maxLength
      );
      adapter.drawPolygon({
        id: 'global-boundary',
        paths: globalRings,
        strokeColor: '#0D9488',
        strokeWeight: 3.5,
        strokeOpacity: 0.95,
        fillOpacity: 0,
        zIndex: 5,
      });
    } else {
      adapter.setCenter({
        lat: selectedTown.centerLatitude,
        lng: selectedTown.centerLongitude,
      });
    }

    // 2. partialMultiPolygonAreas 렌더링 (선택 동네 1개 + 주변 동네 6개)
    for (const partial of areaData.partialMultiPolygonAreas) {
      const rings = parseMultiPolygon(partial.multipolygon);
      const dongName = extractDongName(partial.townName);
      const isSelected =
        partial.codeValue === selectedTown.codeValue ||
        dongName === selectedTown.areaName;

      if (isSelected) {
        // 선택 동네: 틸 테두리 3px + 틸 채움(투명도 0.25) + 중심에 체크 핀 마커 + 흰 배경 라벨
        adapter.drawPolygon({
          id: partial.codeValue,
          paths: rings,
          strokeColor: '#14B8B0',
          strokeWeight: 3,
          strokeOpacity: 1,
          fillColor: '#14B8B0',
          fillOpacity: 0.25,
          zIndex: 15,
        });
        adapter.addLabelMarker({
          id: partial.codeValue,
          position: {
            lat: partial.centerLatitude,
            lng: partial.centerLongitude,
          },
          label: dongName,
          variant: 'selected',
        });
      } else {
        // 주변 동네: 얇은 틸 선 + 반투명 채움 + 중심에 틸 반투명 pill 라벨
        adapter.drawPolygon({
          id: partial.codeValue,
          paths: rings,
          strokeColor: '#14B8B0',
          strokeWeight: 1.5,
          strokeOpacity: 0.75,
          fillColor: '#14B8B0',
          fillOpacity: 0.06,
          zIndex: 10,
          onClick: () => handlePartialTownClick(partial),
        });
        adapter.addLabelMarker({
          id: partial.codeValue,
          position: {
            lat: partial.centerLatitude,
            lng: partial.centerLongitude,
          },
          label: dongName,
          variant: 'neighbor',
          onClick: () => handlePartialTownClick(partial),
        });
      }
    }
  }, [isOpen, areaData, selectedTown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="동네 변경 화면"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 select-none"
    >
      <div className="w-full max-w-[430px] h-[100dvh] bg-white relative flex flex-col overflow-hidden">
        {/* 상단: 지도 위에 떠 있는 검색바 */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-[0_4px_16px_rgba(15,23,42,0.12)] border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => {
              if (isSearchMode) {
                setIsSearchMode(false);
                setSearchKeyword('');
              } else {
                onClose();
              }
            }}
            aria-label="뒤로가기"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#1E293B] cursor-pointer shrink-0"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <Search size={17} className="text-[#14B8B0] shrink-0" />
            <input
              type="text"
              value={searchKeyword}
              onFocus={() => setIsSearchMode(true)}
              onChange={(e) => {
                setIsSearchMode(true);
                setSearchKeyword(e.target.value);
              }}
              placeholder="지역은 읍/면/동 단위로 검색됩니다."
              aria-label="지역은 읍/면/동 단위로 검색됩니다."
              className="w-full text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] font-medium outline-none bg-transparent"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                aria-label="검색어 지우기"
                className="p-1 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* 읍·면·동 검색 오버레이 화면 (검색바 포커스/입력 시) */}
        {isSearchMode && (
          <div
            data-testid="town-search-overlay"
            className="absolute inset-0 z-20 bg-white pt-20 px-4 pb-8 overflow-y-auto flex flex-col"
          >
            {/* 최근 검색어 (검색어 입력 전) */}
            {!searchKeyword.trim() && recentKeywords.length > 0 && (
              <div className="mb-5">
                <div className="text-[12px] font-bold text-[#64748B] mb-2.5">
                  최근 검색어
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentKeywords.map((kw) => (
                    <button
                      key={kw.keywordId}
                      type="button"
                      onClick={() => setSearchKeyword(kw.keyword)}
                      className="px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[12px] font-medium text-[#334155] cursor-pointer transition-colors"
                    >
                      {kw.keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 검색 결과 목록 */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-[#64748B]">
                {searchKeyword.trim()
                  ? `'${searchKeyword}' 검색 결과 (${searchResultPage?.totalElements ?? 0})`
                  : '추천 읍·면·동 목록'}
              </span>
            </div>

            {isSearching ? (
              <div className="py-12 text-center text-[13px] text-[#94A3B8]">
                동네를 검색하는 중...
              </div>
            ) : searchResultPage && searchResultPage.content.length > 0 ? (
              <ul className="divide-y divide-[#F1F5F9]">
                {searchResultPage.content.map((item) => (
                  <li key={item.codeValue}>
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectByCodeValue(
                          asBeopjungdongCode(item.codeValue),
                          searchKeyword
                        )
                      }
                      className="w-full py-3.5 px-1 flex items-center justify-between text-left hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin size={16} className="text-[#14B8B0] shrink-0" />
                        <span className="text-[14px] font-medium text-[#1E293B]">
                          {item.areaFullName}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#14B8B0] bg-[#E8F8F7] px-2 py-0.5 rounded">
                        선택
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-16 text-center text-[13px] text-[#94A3B8]">
                일치하는 읍/면/동 검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}

        {/* 5-1. 지도 영역 (MapAdapter 주입) */}
        <div className="relative flex-1 w-full min-h-[320px] bg-[#EEF3F2]">
          <div
            ref={mapContainerRef}
            data-testid="town-picker-map"
            className="w-full h-full"
          />
        </div>

        {/* 드래그 핸들 있는 바텀시트 */}
        <div
          className={`w-full bg-white rounded-t-3xl shadow-[0_-6px_24px_rgba(15,23,42,0.1)] border-t border-[#F1F5F9] px-4 pt-2.5 pb-6 z-10 transition-all duration-200 ${
            sheetExpanded ? 'max-h-[70dvh]' : 'max-h-[48dvh]'
          } overflow-y-auto`}
        >
          {/* 드래그 핸들 */}
          <button
            type="button"
            onClick={() => setSheetExpanded((prev) => !prev)}
            aria-label="바텀시트 크기 조절"
            className="w-full py-1.5 flex items-center justify-center cursor-pointer"
          >
            <span className="w-10 h-1.5 rounded-full bg-[#CBD5E1]" />
          </button>

          {/* [ ⊕ 현재 위치로 설정 ] 테두리 버튼, 폭 100% */}
          <button
            type="button"
            onClick={handleSetCurrentLocation}
            disabled={isLocating}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-[#14B8B0] text-[#14B8B0] font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-[#E8F8F7]/60 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
          >
            <Crosshair size={16} />
            <span>{isLocating ? '현재 위치 확인 중...' : '현재 위치로 설정'}</span>
          </button>

          {/* 12px 회색 안내 */}
          <p className="mt-2 text-[12px] text-[#94A3B8] text-center">
            앱을 다시 실행하면, 현재 위치한 동네로 자동 설정됩니다.
          </p>

          {/* 내 동네 섹션 */}
          <div className="mt-5">
            <h3 className="text-[12px] font-bold text-[#64748B] mb-2">내 동네</h3>
            <button
              type="button"
              onClick={() => confirmTownSelection(myTown)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#E8F8F7]/50 flex items-center justify-between text-left transition-colors cursor-pointer border border-[#E2E8F0]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Home size={16} className="text-[#14B8B0] shrink-0" />
                <span className="text-[13px] font-bold text-[#1E293B] truncate">
                  {myTown.areaFullName}
                </span>
              </div>
              {selectedTown.codeValue === myTown.codeValue && (
                <span className="text-[11px] font-bold text-[#14B8B0] shrink-0">
                  현재 선택됨
                </span>
              )}
            </button>
          </div>

          {/* 최근 설정된 동네 섹션 */}
          <div className="mt-5">
            <h3 className="text-[12px] font-bold text-[#64748B] mb-2">
              최근 설정된 동네
            </h3>
            {recentVisitTowns.length === 0 ? (
              <p className="text-[12px] text-[#94A3B8] py-3">
                최근 설정된 동네 내역이 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-[#F1F5F9]">
                {recentVisitTowns.map((item) => (
                  <li
                    key={item.visitTownId}
                    className="py-2.5 flex items-center justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectRecentTown(item)}
                      className="flex-1 flex items-center gap-2 text-left hover:text-[#14B8B0] transition-colors cursor-pointer min-w-0"
                    >
                      <MapPin size={15} className="text-[#14B8B0] shrink-0" />
                      <span className="text-[13px] font-medium text-[#334155] truncate">
                        {item.visitTownName}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRecentMutation.mutate(item.visitTownId)}
                      aria-label={`${item.visitTownName} 최근 동네 삭제`}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2]/50 transition-colors cursor-pointer shrink-0"
                    >
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
