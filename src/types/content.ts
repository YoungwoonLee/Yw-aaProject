export type ContentFileType = 'IMG_FILE' | 'VIDEO_FILE'; // VIDEO 실제 enum 값은 TODO(확인필요)

export interface ContentFile {
  contentFileUrl: string;
  contentFileType: ContentFileType;
  displayOrder: number;
  width: number;
  height: number;
  encodedFileUrl?: string;
  thumbnailFileUrl?: string;
}

export interface HashTag {
  contentHashTagId: number;
  hashTagId: number;
  tagName: string;
  orderNum: number;
}

export interface Localbox {
  localboxId: number;
  localboxName: string;
  localboxProfileImgUrl: string | null;
  memberShipStatus: 'REGULAR' | string;
  localboxMyTownName: string;
  localboxMyTownCodeValue: string;
  localboxCreatorType: string; // 예: LOCALBOX_LOCAL_MEDIA
}

export interface FeedContent {
  contentId: number;
  contentType: 'VILLAGE_NEWS' | string;
  contentTitle: string;
  contentBodyText: string;
  contentLikeCount: number;
  contentReplyCount: number;
  contentLikeYn: boolean;
  contentBookmarkYn: boolean;
  viewCount: number;
  regDt: string; // 'YYYY-MM-DD HH:mm:ss' (KST)
  isPinnedToTopGroup: boolean;
  contentDisplayRateCityName: string; // 예: '서울 도봉구'
  contentDisplayRateDongName: string;
  contentDisplayRateDongs: { dongName: string; percentage: number }[];
  contentHashTagElementDtos: HashTag[];
  contentFileElementDtos: ContentFile[];
  localboxElementDto: Localbox;
}

export interface FeedResponse {
  message: string;
  result: {
    content: FeedContent[];
    lastSearchSort: string[];
  };
}

// 상세 API 응답 (GET /api/content/{contentId} 가정)
// TODO(확인필요): 실제 상세 API 엔드포인트 및 응답 필드 명세 확인 필요
export interface FeedDetailContent extends FeedContent {
  address?: string; // 예: "서울 도봉구 시루봉로17길 48-30"
}

export interface BannerItem {
  bannerId: number;
  bannerTitle: string;
  bannerImageUrl: string;
  linkUrl: string;
}
