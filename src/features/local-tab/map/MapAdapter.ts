import { LatLng } from '../../../types/local';

export interface DrawPolygonOptions {
  id: string;
  paths: LatLng[][];
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  zIndex?: number;
  onClick?: () => void;
}

export interface AddLabelMarkerOptions {
  id: string;
  position: LatLng;
  label: string;
  variant: 'selected' | 'neighbor';
  onClick?: () => void;
}

/**
 * 네이버 지도 v3 및 SVG 목 구현을 추상화하는 MapAdapter 인터페이스
 * 컴포넌트는 지도 SDK를 직접 호출하지 않고 이 인터페이스만 사용한다.
 */
export interface MapAdapter {
  setCenter(center: LatLng, zoom?: number): void;
  fitBounds(coords: LatLng[], maxLength?: number): void;
  drawPolygon(options: DrawPolygonOptions): void;
  addLabelMarker(options: AddLabelMarkerOptions): void;
  clearOverlays(): void;
  onIdle(callback: (center: LatLng) => void): () => void;
  destroy(): void;
}

interface BoundsBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * maxLength(m) 기반 네이버 지도 줌 레벨 계산 유틸
 */
export function calculateZoomFromMaxLength(maxLength?: number): number {
  if (!maxLength || maxLength <= 0) return 14;
  if (maxLength < 1500) return 15;
  if (maxLength < 3500) return 14;
  if (maxLength < 7000) return 13;
  if (maxLength < 15000) return 12;
  return 11;
}

/**
 * SVG 기반 인터랙티브 지도 어댑터 (환경변수 키가 없거나 테스트 환경일 때 동작)
 */
export class SvgMapAdapter implements MapAdapter {
  private container: HTMLElement;
  private center: LatLng = { lat: 37.4465, lng: 127.1678 };
  private bounds: BoundsBox = {
    minLat: 37.428,
    maxLat: 37.466,
    minLng: 127.142,
    maxLng: 127.19,
  };
  private polygons: DrawPolygonOptions[] = [];
  private markers: AddLabelMarkerOptions[] = [];
  private idleCallbacks: ((center: LatLng) => void)[] = [];
  private rootEl: HTMLDivElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.initDOM();
  }

  private initDOM() {
    this.container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className =
      'relative w-full h-full overflow-hidden bg-[#EEF3F2] select-none';
    wrapper.setAttribute('data-testid', 'svg-map-canvas');
    this.container.appendChild(wrapper);
    this.rootEl = wrapper;
    this.render();
  }

  private project(lat: number, lng: number, width = 430, height = 460) {
    const padX = 34;
    const padY = 48;
    const latSpan = Math.max(0.005, this.bounds.maxLat - this.bounds.minLat);
    const lngSpan = Math.max(0.005, this.bounds.maxLng - this.bounds.minLng);

    const x =
      padX +
      ((lng - this.bounds.minLng) / lngSpan) * (width - padX * 2);
    // 위도(lat)는 북쪽이 위(y가 작음)이므로 반전
    const y =
      padY +
      ((this.bounds.maxLat - lat) / latSpan) * (height - padY * 2);
    return { x, y };
  }

  setCenter(center: LatLng, _zoom?: number): void {
    this.center = center;
    this.render();
  }

  fitBounds(coords: LatLng[], _maxLength?: number): void {
    if (!coords || coords.length === 0) return;
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    for (const c of coords) {
      if (c.lat < minLat) minLat = c.lat;
      if (c.lat > maxLat) maxLat = c.lat;
      if (c.lng < minLng) minLng = c.lng;
      if (c.lng > maxLng) maxLng = c.lng;
    }

    if (isFinite(minLat) && isFinite(maxLat) && isFinite(minLng) && isFinite(maxLng)) {
      const latMargin = (maxLat - minLat) * 0.12 || 0.004;
      const lngMargin = (maxLng - minLng) * 0.12 || 0.004;
      this.bounds = {
        minLat: minLat - latMargin,
        maxLat: maxLat + latMargin,
        minLng: minLng - lngMargin,
        maxLng: maxLng + lngMargin,
      };
      this.center = {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2,
      };
      this.render();
    }
  }

  drawPolygon(options: DrawPolygonOptions): void {
    this.polygons.push(options);
    this.render();
  }

  addLabelMarker(options: AddLabelMarkerOptions): void {
    this.markers.push(options);
    this.render();
  }

  clearOverlays(): void {
    this.polygons = [];
    this.markers = [];
    this.render();
  }

  onIdle(callback: (center: LatLng) => void): () => void {
    this.idleCallbacks.push(callback);
    return () => {
      this.idleCallbacks = this.idleCallbacks.filter((cb) => cb !== callback);
    };
  }

  destroy(): void {
    this.polygons = [];
    this.markers = [];
    this.idleCallbacks = [];
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  private render() {
    if (!this.rootEl) return;
    const width = 430;
    const height = 460;

    this.rootEl.innerHTML = '';

    // 1. 배경 지도 격자 및 도로 그래픽 SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'w-full h-full block');

    // 배경 지형 장식 (도로망 및 공원 녹지 표현)
    const bgGroup = document.createElementNS(svgNS, 'g');
    bgGroup.innerHTML = `
      <rect width="${width}" height="${height}" fill="#F1F5F4" />
      <path d="M 0 110 Q 180 130 430 95" stroke="#E2E8F0" stroke-width="10" fill="none" />
      <path d="M 90 0 Q 130 220 110 460" stroke="#E2E8F0" stroke-width="8" fill="none" />
      <path d="M 310 0 Q 290 240 340 460" stroke="#E2E8F0" stroke-width="7" fill="none" />
      <path d="M 0 320 Q 210 295 430 340" stroke="#E2E8F0" stroke-width="9" fill="none" />
      <circle cx="340" cy="110" r="45" fill="#E3EFEA" opacity="0.7" />
      <circle cx="85" cy="280" r="38" fill="#E3EFEA" opacity="0.7" />
    `;
    svg.appendChild(bgGroup);

    // 2. 폴리곤 정렬 후 그리기 (zIndex 오름차순)
    const sortedPolygons = [...this.polygons].sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    );

    for (const poly of sortedPolygons) {
      for (const ring of poly.paths) {
        if (ring.length < 3) continue;
        const pointsStr = ring
          .map((pt) => {
            const { x, y } = this.project(pt.lat, pt.lng, width, height);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' ');

        const polygonEl = document.createElementNS(svgNS, 'polygon');
        polygonEl.setAttribute('points', pointsStr);
        polygonEl.setAttribute('stroke', poly.strokeColor);
        polygonEl.setAttribute('stroke-width', String(poly.strokeWeight));
        polygonEl.setAttribute(
          'stroke-opacity',
          String(poly.strokeOpacity ?? 1)
        );
        polygonEl.setAttribute('stroke-linejoin', 'round');
        polygonEl.setAttribute('data-testid', `map-polygon-${poly.id}`);

        if (poly.fillColor && (poly.fillOpacity ?? 0) > 0) {
          polygonEl.setAttribute('fill', poly.fillColor);
          polygonEl.setAttribute('fill-opacity', String(poly.fillOpacity));
        } else {
          polygonEl.setAttribute('fill', 'transparent');
        }

        if (poly.onClick) {
          polygonEl.style.cursor = 'pointer';
          polygonEl.addEventListener('click', (e) => {
            e.stopPropagation();
            poly.onClick?.();
          });
        }

        svg.appendChild(polygonEl);
      }
    }

    this.rootEl.appendChild(svg);

    // 3. 라벨 마커 오버레이 레이어
    const overlayLayer = document.createElement('div');
    overlayLayer.className = 'absolute inset-0 pointer-events-none';

    for (const marker of this.markers) {
      const { x, y } = this.project(
        marker.position.lat,
        marker.position.lng,
        width,
        height
      );
      const leftPct = (x / width) * 100;
      const topPct = (y / height) * 100;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.left = `${leftPct}%`;
      btn.style.top = `${topPct}%`;
      btn.setAttribute('data-testid', `map-marker-${marker.label}`);

      if (marker.variant === 'selected') {
        // 선택 동네: 중심에 체크 핀 마커 + 흰 배경 라벨
        btn.className =
          'absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-auto cursor-pointer group z-20';
        btn.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-[#14B8B0] text-white flex items-center justify-center shadow-md border-2 border-white font-bold text-[13px]">
            ✔
          </div>
          <span class="px-2.5 py-1 rounded-md bg-white text-[#0F172A] font-extrabold text-[12px] shadow-md border border-[#14B8B0]/40 whitespace-nowrap">
            ${marker.label}
          </span>
        `;
      } else {
        // 주변 동네: 틸 반투명 pill 라벨 (흰 글자)
        btn.className =
          'absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#14B8B0]/85 hover:bg-[#0D9488] active:scale-95 transition-all text-white font-bold text-[12px] shadow-sm pointer-events-auto cursor-pointer whitespace-nowrap z-10';
        btn.textContent = marker.label;
      }

      if (marker.onClick) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          marker.onClick?.();
        });
      }

      overlayLayer.appendChild(btn);
    }

    this.rootEl.appendChild(overlayLayer);
  }
}

/**
 * 네이버 지도 JS SDK v3 어댑터 (환경변수 키가 설정되어 있고 window.naver.maps가 로드된 경우)
 */
export class NaverMapAdapter implements MapAdapter {
  private map: any;
  private naver: any;
  private overlays: any[] = [];
  private listeners: any[] = [];

  constructor(container: HTMLElement, naverMaps: any) {
    this.naver = naverMaps;
    this.map = new naverMaps.Map(container, {
      center: new naverMaps.LatLng(37.4465, 127.1678),
      zoom: 14,
      zoomControl: false,
      mapDataControl: false,
    });
  }

  setCenter(center: LatLng, zoom?: number): void {
    const latLng = new this.naver.LatLng(center.lat, center.lng);
    this.map.setCenter(latLng);
    if (zoom !== undefined) {
      this.map.setZoom(zoom);
    }
  }

  fitBounds(coords: LatLng[], maxLength?: number): void {
    if (!coords || coords.length === 0) return;
    const bounds = new this.naver.LatLngBounds(
      new this.naver.LatLng(coords[0].lat, coords[0].lng),
      new this.naver.LatLng(coords[0].lat, coords[0].lng)
    );
    for (const c of coords) {
      bounds.extend(new this.naver.LatLng(c.lat, c.lng));
    }
    this.map.fitBounds(bounds);
    if (maxLength) {
      const targetZoom = calculateZoomFromMaxLength(maxLength);
      this.map.setZoom(targetZoom);
    }
  }

  drawPolygon(options: DrawPolygonOptions): void {
    const paths = options.paths.map((ring) =>
      ring.map((pt) => new this.naver.LatLng(pt.lat, pt.lng))
    );
    const polygon = new this.naver.Polygon({
      map: this.map,
      paths,
      strokeColor: options.strokeColor,
      strokeWeight: options.strokeWeight,
      strokeOpacity: options.strokeOpacity ?? 1,
      fillColor: options.fillColor || '#14B8B0',
      fillOpacity: options.fillOpacity ?? 0,
      clickable: Boolean(options.onClick),
      zIndex: options.zIndex || 1,
    });

    if (options.onClick) {
      const listener = this.naver.Event.addListener(polygon, 'click', () => {
        options.onClick?.();
      });
      this.listeners.push(listener);
    }
    this.overlays.push(polygon);
  }

  addLabelMarker(options: AddLabelMarkerOptions): void {
    const contentHtml =
      options.variant === 'selected'
        ? `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);cursor:pointer;">
             <div style="width:28px;height:28px;border-radius:9999px;background:#14B8B0;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.18);">✔</div>
             <span style="margin-top:4px;padding:3px 9px;border-radius:6px;background:#fff;color:#0F172A;font-weight:800;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.14);white-space:nowrap;">${options.label}</span>
           </div>`
        : `<div style="transform:translate(-50%,-50%);padding:4px 12px;border-radius:9999px;background:rgba(20,184,176,0.86);color:#fff;font-weight:700;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.12);white-space:nowrap;cursor:pointer;">${options.label}</div>`;

    const marker = new this.naver.Marker({
      position: new this.naver.LatLng(options.position.lat, options.position.lng),
      map: this.map,
      icon: {
        content: contentHtml,
      },
      zIndex: options.variant === 'selected' ? 20 : 10,
    });

    if (options.onClick) {
      const listener = this.naver.Event.addListener(marker, 'click', () => {
        options.onClick?.();
      });
      this.listeners.push(listener);
    }
    this.overlays.push(marker);
  }

  clearOverlays(): void {
    for (const l of this.listeners) {
      this.naver.Event.removeListener(l);
    }
    this.listeners = [];
    for (const ov of this.overlays) {
      ov.setMap(null);
    }
    this.overlays = [];
  }

  onIdle(callback: (center: LatLng) => void): () => void {
    const listener = this.naver.Event.addListener(this.map, 'idle', () => {
      const c = this.map.getCenter();
      callback({ lat: c.lat(), lng: c.lng() });
    });
    return () => {
      this.naver.Event.removeListener(listener);
    };
  }

  destroy(): void {
    this.clearOverlays();
    if (this.map && this.map.destroy) {
      this.map.destroy();
    }
  }
}

/**
 * 환경변수(NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 또는 VITE_NAVER_MAP_CLIENT_ID)와
 * window.naver.maps 유무에 따라 적절한 MapAdapter 인스턴스를 생성한다.
 */
export function createMapAdapter(container: HTMLElement): MapAdapter {
  const win = typeof window !== 'undefined' ? (window as any) : undefined;
  const envClientId =
    (typeof import.meta !== 'undefined' &&
      (import.meta as any).env?.VITE_NAVER_MAP_CLIENT_ID) ||
    (typeof import.meta !== 'undefined' &&
      (import.meta as any).env?.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID);

  if (envClientId && win?.naver?.maps) {
    return new NaverMapAdapter(container, win.naver.maps);
  }

  return new SvgMapAdapter(container);
}
