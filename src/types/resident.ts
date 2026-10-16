export interface ResidentNewsSearchRequest {
  size: number; // 운영값 12
  hdongCodeValue: string; // 행정동 코드 (예: '4125051000')
  interests: string[] | null; // 선택 안 하면 null ('전체'도 null)
  ageGroups: string[] | null;
  targetGroups: string[] | null;
  lastSearchSort: string[] | null; // 커서. 첫 요청 null, 다음은 직전 응답값
}

export interface ResidentNewsContent {
  contentId: number;
  contentType: 'RESIDENT_NEWS';
  contentTitle: string;
  contentBodyText: string; // 마크다운 일부 포함(**굵게**, - 목록, ###, 이모지)
  contentLikeCount: number;
  contentReplyCount: number;
  contentLikeYn: boolean;
  contentBookmarkYn: boolean;
  viewCount: number;
  regDt: string; // 'YYYY-MM-DD HH:mm:ss'
  isPinnedToTopGroup: boolean;
  pinTabTypes: string[];
  postedYn: boolean;
  eventStartDate: string | null; // 'YYYY-MM-DD'
  eventEndDate: string | null;
  contentHashTagElementDtos: {
    hashTagId: number;
    tagName: string;
    orderNum: number;
  }[];
  contentFileElementDtos: {
    contentFileUrl: string;
    contentFileType: 'IMG_FILE' | string;
    displayOrder: number;
    width: number;
    height: number;
  }[];
  localboxElementDto: {
    localboxId: number;
    localboxName: string;
    localboxProfileImgUrl: string | null;
    memberShipStatus: string;
    localboxMyTownName: string;
    localboxMyTownCodeValue: string;
    isUserFollowingMe: boolean;
    isUserFollowedByMe: boolean;
    localboxCreatorType: string;
  };
}

export interface ResidentNewsResponse {
  message: string;
  result: {
    content: ResidentNewsContent[];
    lastSearchSort: string[] | null;
  };
}

export type EventStatus = 'LIVE' | 'UPCOMING' | 'ENDED' | 'NONE';

export interface HangjungdongItem {
  name: string;
  code: string;
}
