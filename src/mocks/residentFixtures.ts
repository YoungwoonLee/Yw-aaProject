import { ResidentNewsContent } from '../types/resident';

export const MOCK_RESIDENT_NEWS_CONTENTS: ResidentNewsContent[] = [
  {
    contentId: 2001,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '2026 동두천 가을 숲속 북페스티벌 참여 안내',
    contentBodyText: `### 온 가족이 함께하는 가을 독서 축제 📚
자연 속에서 책과 음악을 즐기는 북페스티벌이 열립니다!

- **행사 일시**: 2026.10.10(토) ~ 2026.10.18(일)
- **장소**: 소요산 야외음악당 잔디광장
- **주요 프로그램**: 작가와의 만남, 숲속 북크닉, 어린이 구연동화 콘서트
- **참가비**: 무료 (일부 체험 프로그램 재료비 별도)`,
    contentLikeCount: 14,
    contentReplyCount: 3,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 240,
    regDt: '2026-10-11 06:10:00',
    isPinnedToTopGroup: true,
    pinTabTypes: ['RESIDENT_NEWS'],
    postedYn: true,
    eventStartDate: '2026-10-10',
    eventEndDate: '2026-10-18', // LIVE (진행중: 10/11 기준)
    contentHashTagElementDtos: [
      { hashTagId: 201, tagName: '문화·관광', orderNum: 1 },
      { hashTagId: 202, tagName: '북페스티벌', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/1060/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 101,
      localboxName: '동두천 문화나눔터',
      localboxProfileImgUrl: 'https://picsum.photos/id/64/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_COMMUNITY',
    },
  },
  {
    contentId: 2002,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '10월 어르신 무료 독감 예방접종 지정 의료기관 안내',
    contentBodyText: `관내 만 65세 이상 어르신 대상 인플루엔자 무료 예방접종을 실시합니다.
안전한 접종을 위해 건강 상태가 좋은 날 방문해주세요.

**접종 일정**:
- 75세 이상: 10.11부터
- 70~74세: 10.15부터
- 65~69세: 10.18부터

신분증을 반드시 지참하시기 바랍니다.`,
    contentLikeCount: 28,
    contentReplyCount: 5,
    contentLikeYn: true,
    contentBookmarkYn: false,
    viewCount: 420,
    regDt: '2026-10-10 14:30:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-10-11',
    eventEndDate: '2026-11-30', // LIVE
    contentHashTagElementDtos: [
      { hashTagId: 203, tagName: '보건·의료·건강', orderNum: 1 },
      { hashTagId: 204, tagName: '어르신', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/1084/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 102,
      localboxName: '동두천시 보건소',
      localboxProfileImgUrl: 'https://picsum.photos/id/201/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: true,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2003,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '생연1동 주민자치회 10월 정기회의 방청 공지',
    contentBodyText: `살기 좋은 마을 조성을 위한 주민자치회 정기회의를 개최합니다.
주민 누구나 자유롭게 방청 가능합니다.

- **안건**: 2026년 마을 꽃길 가꾸기 사업 결산 및 골목 안전 반사경 설치 제안
- **일시**: 2026.10.20(화) 19:00
- **장소**: 행정복지센터 3층 대회의실`,
    contentLikeCount: 7,
    contentReplyCount: 1,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 160,
    regDt: '2026-10-09 11:20:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-10-20',
    eventEndDate: '2026-10-20', // UPCOMING (10/20 시작)
    contentHashTagElementDtos: [
      { hashTagId: 205, tagName: '생활지원', orderNum: 1 },
      { hashTagId: 206, tagName: '주민자치', orderNum: 2 },
    ],
    // 썸네일 없음 케이스
    contentFileElementDtos: [],
    localboxElementDto: {
      localboxId: 103,
      localboxName: '생연1동 주민자치위원회',
      localboxProfileImgUrl: null,
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_COMMUNITY',
    },
  },
  {
    contentId: 2004,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '2026년 청년 로컬 크리에이터 창업 멘토링 데이',
    contentBodyText: `지역 자원을 활용해 창업을 준비 중인 청년들을 위한 실무 멘토링 프로그램입니다.
전문가 1:1 비즈니스 모델 진단 및 네트워킹 만찬을 제공합니다.

- **대상**: 만 19세~39세 청년 예비 창업자
- **일시**: 2026.10.25(일) 14:00~18:00
- **신청 기한**: 10월 22일(목)까지`,
    contentLikeCount: 32,
    contentReplyCount: 8,
    contentLikeYn: false,
    contentBookmarkYn: true,
    viewCount: 390,
    regDt: '2026-10-08 17:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-10-25',
    eventEndDate: '2026-10-25', // UPCOMING
    contentHashTagElementDtos: [
      { hashTagId: 207, tagName: '취업·창업', orderNum: 1 },
      { hashTagId: 208, tagName: '대학생·청년', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/1070/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 104,
      localboxName: '동두천 청년허브',
      localboxProfileImgUrl: 'https://picsum.photos/id/342/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '중앙동',
      localboxMyTownCodeValue: '4125053000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2005,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '신천변 산책로 보수공사에 따른 일부 구간 통행 제한',
    contentBodyText: `주민 안전 및 쾌적한 보행 환경 조성을 위해 신천변 데크길 교체 공사를 진행합니다.
공사 기간 중 일부 구간이 우회 통행되오니 양해 부탁드립니다.

공사 기간: 2026.09.20 ~ 2026.10.05
공사 문의: 도시재생과 도로관리팀 (031-860-0000)`,
    contentLikeCount: 19,
    contentReplyCount: 6,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 310,
    regDt: '2026-09-20 09:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-09-20',
    eventEndDate: '2026-10-05', // ENDED (종료: 10/11 기준)
    contentHashTagElementDtos: [
      { hashTagId: 209, tagName: '교통·건설', orderNum: 1 },
      { hashTagId: 210, tagName: '재난·안전', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/111/800/600',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 600,
      },
    ],
    localboxElementDto: {
      localboxId: 105,
      localboxName: '도시안전지킴이',
      localboxProfileImgUrl: 'https://picsum.photos/id/214/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2006,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '가을철 올바른 재활용품 분리배출 요일제 준수 안내',
    contentBodyText: `깨끗한 골목 조성을 위해 투명 페트병 및 비닐류 요일별 배출을 철저히 준수해주세요.

- 배출 시간: 일·화·목 19:00 ~ 익일 06:00
- 수거 불가 품목: 오염된 스티로폼, 음식물 묻은 비닐`,
    contentLikeCount: 11,
    contentReplyCount: 2,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 190,
    regDt: '2026-10-04 18:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: null, // 행사일 없음 케이스
    eventEndDate: null,
    contentHashTagElementDtos: [
      { hashTagId: 211, tagName: '환경·에너지', orderNum: 1 },
      { hashTagId: 212, tagName: '생활지원', orderNum: 2 },
    ],
    contentFileElementDtos: [],
    localboxElementDto: {
      localboxId: 106,
      localboxName: '자원순환과 환경지킴이',
      localboxProfileImgUrl: 'https://picsum.photos/id/160/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '보산동',
      localboxMyTownCodeValue: '4125054000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2007,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '취약계층 및 독거 어르신 따뜻한 겨울나기 김장 나눔',
    contentBodyText: `마을 자원봉사자분들과 함께 어려운 이웃을 위한 김장 김치 담그기 행사를 진행합니다.
따뜻한 손길을 모아주실 자원봉사자를 모집합니다!

- 봉사 일시: 2026.11.05(목) 09:00~16:00
- 장소: 생연1동 복지관 주차장`,
    contentLikeCount: 45,
    contentReplyCount: 12,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 380,
    regDt: '2026-10-03 10:15:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-11-05',
    eventEndDate: '2026-11-05', // UPCOMING
    contentHashTagElementDtos: [
      { hashTagId: 213, tagName: '보호·돌봄', orderNum: 1 },
      { hashTagId: 214, tagName: '저소득·생계위기', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/225/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 107,
      localboxName: '동두천 희망나눔회',
      localboxProfileImgUrl: 'https://picsum.photos/id/237/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_COMMUNITY',
    },
  },
  {
    contentId: 2008,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '어린이 숲체험 및 생태 교실 가을학기 참여자 모집',
    contentBodyText: `자연과 교감하며 오감을 깨우는 유아 및 어린이 주말 숲체험 교실입니다.
전문 숲해설가 선생님과 함께 도토리 줍기, 단풍잎 책갈피 만들기 등을 체험합니다.

- 대상: 관내 영유아 및 초등 저학년 (보호자 동반)
- 기간: 2026.10.15(목) ~ 2026.11.15(일)`,
    contentLikeCount: 22,
    contentReplyCount: 4,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 290,
    regDt: '2026-10-02 15:40:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-10-15',
    eventEndDate: '2026-11-15', // UPCOMING
    contentHashTagElementDtos: [
      { hashTagId: 215, tagName: '교육·자기개발', orderNum: 1 },
      { hashTagId: 216, tagName: '영유아', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/1062/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 108,
      localboxName: '초록 숲놀이터',
      localboxProfileImgUrl: 'https://picsum.photos/id/1025/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '불현동',
      localboxMyTownCodeValue: '4125055000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_COMMUNITY',
    },
  },
  {
    contentId: 2009,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '다문화가족 행복 한국어 교실 수강생 상시 모집',
    contentBodyText: `이주민 및 다문화가족의 안정적인 정착을 돕는 단계별 한국어 강좌입니다.
초급부터 생활 한국어 회화, 한국 문화 체험까지 무료로 지원합니다.`,
    contentLikeCount: 16,
    contentReplyCount: 3,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 180,
    regDt: '2026-09-28 11:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-09-01',
    eventEndDate: '2026-12-31', // LIVE
    contentHashTagElementDtos: [
      { hashTagId: 217, tagName: '교육·자기개발', orderNum: 1 },
      { hashTagId: 218, tagName: '다문화·새터민', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/1069/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 109,
      localboxName: '다문화가족지원센터',
      localboxProfileImgUrl: 'https://picsum.photos/id/1080/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '보산동',
      localboxMyTownCodeValue: '4125054000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2010,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '1인가구 안심홈세트 무료 보급 지원 사업',
    contentBodyText: `여성 1인가구 및 범죄취약가구를 대상으로 스마트 초인종, 문열림 센서, 휴대용 비상벨을 무상 지원합니다.

- 신청 기간: 2026.10.01 ~ 예산 소진 시까지
- 지원 자격: 관내 단독 거주 1인가구`,
    contentLikeCount: 38,
    contentReplyCount: 9,
    contentLikeYn: false,
    contentBookmarkYn: true,
    viewCount: 510,
    regDt: '2026-09-25 14:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-10-01',
    eventEndDate: '2026-10-31', // LIVE
    contentHashTagElementDtos: [
      { hashTagId: 219, tagName: '재난·안전', orderNum: 1 },
      { hashTagId: 220, tagName: '1인가구', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/1078/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 110,
      localboxName: '안심동행 네트워크',
      localboxProfileImgUrl: 'https://picsum.photos/id/24/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2011,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '소상공인 경영환경개선 맞춤형 컨설팅 지원 안내',
    contentBodyText: `관내 골목상권 소상공인의 자생력 강화를 위한 온라인 마케팅, 매장 인테리어 개선 무료 컨설팅을 지원합니다.`,
    contentLikeCount: 15,
    contentReplyCount: 2,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 210,
    regDt: '2026-09-20 16:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: null, // 행사일 없음
    eventEndDate: null,
    contentHashTagElementDtos: [
      { hashTagId: 221, tagName: '취업·창업', orderNum: 1 },
      { hashTagId: 222, tagName: '금융·조세·법률', orderNum: 2 },
    ],
    contentFileElementDtos: [],
    localboxElementDto: {
      localboxId: 111,
      localboxName: '골목상권 활성화단',
      localboxProfileImgUrl: 'https://picsum.photos/id/180/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연2동',
      localboxMyTownCodeValue: '4125052000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_COMMUNITY',
    },
  },
  {
    contentId: 2012,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '장애인 이동편의를 위한 전동보조기기 배터리 무료 점검',
    contentBodyText: `전동휠체어 및 전동스쿠터를 이용하는 등록장애인을 위해 배터리 점검 및 스팀 세척 서비스를 지원합니다.

일시: 2026.10.16(금) 10:00~16:00
장소: 동두천시장애인종합복지관 앞마당`,
    contentLikeCount: 27,
    contentReplyCount: 4,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 280,
    regDt: '2026-09-15 13:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-10-16',
    eventEndDate: '2026-10-16', // UPCOMING
    contentHashTagElementDtos: [
      { hashTagId: 223, tagName: '보호·돌봄', orderNum: 1 },
      { hashTagId: 224, tagName: '장애인', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/1058/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 112,
      localboxName: '장애인편의증진센터',
      localboxProfileImgUrl: 'https://picsum.photos/id/219/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '상패동',
      localboxMyTownCodeValue: '4125057000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2013,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '가을 국화 향기 가득한 소요산 국화 축제 개막',
    contentBodyText: `소요산 입구에 10만 송이 오색 국화꽃 조형물이 설치되었습니다.
가족, 연인과 함께 가을의 향기를 만끽해보세요.

기간: 2026.10.05 ~ 2026.10.25`,
    contentLikeCount: 65,
    contentReplyCount: 14,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 780,
    regDt: '2026-09-12 17:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-10-05',
    eventEndDate: '2026-10-25', // LIVE
    contentHashTagElementDtos: [
      { hashTagId: 225, tagName: '문화·관광', orderNum: 1 },
      { hashTagId: 226, tagName: '국화축제', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/214/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 113,
      localboxName: '소요산 관광특구',
      localboxProfileImgUrl: 'https://picsum.photos/id/10/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '소요동',
      localboxMyTownCodeValue: '4125056000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2014,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '반려견 동물등록 자진신고 기간 및 무료 내장형 칩 지원',
    contentBodyText: `동물보호법에 따른 2개월령 이상 반려견 동물등록 자진신고 기간을 운영합니다.
관내 동물병원 방문 시 선착순으로 마이크로칩 시술비를 지원합니다.`,
    contentLikeCount: 18,
    contentReplyCount: 4,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 220,
    regDt: '2026-09-10 11:30:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: '2026-09-01',
    eventEndDate: '2026-09-30', // ENDED
    contentHashTagElementDtos: [
      { hashTagId: 227, tagName: '농림·수산·축산·동물', orderNum: 1 },
      { hashTagId: 228, tagName: '반려동물', orderNum: 2 },
    ],
    contentFileElementDtos: [
      {
        contentFileUrl: 'https://picsum.photos/id/237/800/1000',
        contentFileType: 'IMG_FILE',
        displayOrder: 1,
        width: 800,
        height: 1000,
      },
    ],
    localboxElementDto: {
      localboxId: 114,
      localboxName: '동물보호복지팀',
      localboxProfileImgUrl: 'https://picsum.photos/id/40/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: false,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
  {
    contentId: 2015,
    contentType: 'RESIDENT_NEWS',
    contentTitle: '가을 환절기 영유아 호흡기 감염병 예방수칙 공지',
    contentBodyText: `어린이집 및 유치원 단체생활 시 올바른 손 씻기와 마스크 착용, 기침 예절을 철저히 준수해주시기 바랍니다.`,
    contentLikeCount: 21,
    contentReplyCount: 3,
    contentLikeYn: false,
    contentBookmarkYn: false,
    viewCount: 260,
    regDt: '2026-09-08 10:00:00',
    isPinnedToTopGroup: false,
    pinTabTypes: [],
    postedYn: true,
    eventStartDate: null, // 행사일 없음
    eventEndDate: null,
    contentHashTagElementDtos: [
      { hashTagId: 229, tagName: '보건·의료·건강', orderNum: 1 },
      { hashTagId: 230, tagName: '임신·출산·육아', orderNum: 2 },
    ],
    contentFileElementDtos: [],
    localboxElementDto: {
      localboxId: 102,
      localboxName: '동두천시 보건소',
      localboxProfileImgUrl: 'https://picsum.photos/id/201/100/100',
      memberShipStatus: 'REGULAR',
      localboxMyTownName: '생연1동',
      localboxMyTownCodeValue: '4125051000',
      isUserFollowingMe: false,
      isUserFollowedByMe: true,
      localboxCreatorType: 'LOCALBOX_PUBLIC',
    },
  },
];
