export type MyContentType = 'VILLAGE_NEWS' | 'RESIDENT_NEWS';

export interface MyContentMedia {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  posterUrl?: string;
  width: number;
  height: number;
  durationSeconds?: number; // 동영상 시작 남은 시간(초), 기본 29초(00:29)
}

export interface MyContentLocation {
  address: string;
  placeName?: string;
  lat: number;
  lng: number;
}

export interface MyContentComment {
  id: number;
  authorName: string;
  authorAvatarUrl: string;
  createdAtLabel: string;
  content: string;
  likeCount: number;
  isLiked?: boolean;
  replies?: Array<{
    id: number;
    authorName: string;
    authorAvatarUrl: string;
    createdAtLabel: string;
    content: string;
    likeCount: number;
  }>;
}

export interface MyLocalboxItem {
  id: number;
  contentType: MyContentType;
  title: string;
  body: string;
  imageUrl: string;
  isVideo: boolean;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  isBookmarked: boolean;
  daysAgo: number;
  dateLabel: string; // 홈 탭: '2일전' 등 / 주민 탭: 7일 이내 'N일전', 7일 초과 '10.05' 등 MM.DD
  viewCount: number;
  // 상세 화면 전용 확장 필드
  dongExposureText?: string; // 동네소식: '삼동면 100%' 또는 '금광동 54% 상대원동 29% 은행동 15%'
  eventPeriodText?: string; // 주민소식: '2026.10.05(월)~2026.10.20(화)'
  mediaList: MyContentMedia[];
  location?: MyContentLocation; // 동네소식에만(장소가 있을 때만) 존재, 주민소식은 없음
  hashtags: string[]; // 동네소식에만 존재, 주민소식은 빈 배열([])
  comments: MyContentComment[];
}

export interface DongRatioItem {
  name: string;
  percent: number;
  barPercent: number; // 막대 그래프 시각적 비율
  color: string;
}

export interface MyLocalboxProfile {
  name: string;
  avatarUrl: string;
  contentCount: number;
  followerCount: number;
  region: string;
  todayVisitors: number;
  dongRatios: DongRatioItem[];
  intro: string;
  hashtags: string[];
}

export const SAMPLE_VIDEO_URL =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export const INITIAL_MY_PROFILE: MyLocalboxProfile = {
  name: '동네 러너',
  avatarUrl: 'https://picsum.photos/seed/ondaji-runner/600/600',
  contentCount: 260,
  followerCount: 91,
  region: '경기도 성남시 중원구 금광동',
  todayVisitors: 2,
  dongRatios: [
    { name: '성남시 금광동', percent: 6, barPercent: 38, color: '#14B8B0' },
    { name: '성남시 상대원동', percent: 6, barPercent: 28, color: '#59BFB3' },
    { name: '성남시 단대동', percent: 6, barPercent: 20, color: '#A6E3DC' },
  ],
  intro:
    '성남시 중원구 금광동과 상대원동, 단대동 골목길을 달리고 산책하며 마주치는 사소한 풍경들을 기록합니다.\n계절마다 바뀌는 가로수 색깔, 오래된 동네 빵집의 아침 연기, 저녁 무렵 공원 벤치의 온기를 사진과 짧은 글로 남기고 있어요.\n오늘도 운동화 끈을 묶고 우리 동네의 숨은 이야기를 찾아 천천히 달립니다. 함께 동네를 기록하는 이웃분들 언제나 환영합니다!',
  hashtags: ['#성남', '#산책', '#기록'],
};

const DEFAULT_COMMENTS: MyContentComment[] = [
  {
    id: 1,
    authorName: '금광동 산책자',
    authorAvatarUrl: 'https://picsum.photos/seed/commenter-1/200/200',
    createdAtLabel: '1일전',
    content: '사진 색감이 너무 따뜻하네요! 저도 오늘 저녁에 이 코스로 걸어봐야겠어요.',
    likeCount: 3,
    isLiked: false,
    replies: [
      {
        id: 11,
        authorName: '동네 러너',
        authorAvatarUrl: 'https://picsum.photos/seed/ondaji-runner/200/200',
        createdAtLabel: '1일전',
        content: '해 질 무렵에 걸으면 바람도 선선하고 정말 좋습니다 :)',
        likeCount: 1,
      },
    ],
  },
  {
    id: 2,
    authorName: '단대천 자전거',
    authorAvatarUrl: 'https://picsum.photos/seed/commenter-2/200/200',
    createdAtLabel: '2일전',
    content: '늘 정성스러운 동네 기록 잘 보고 있습니다. 응원해요!',
    likeCount: 2,
    isLiked: true,
  },
];

const HOME_BASE_ITEMS: Array<{
  title: string;
  body: string;
  seed: string;
  isVideo: boolean;
  slideCount: number;
  dongExposureText: string;
  address?: string;
  placeName?: string;
  lat?: number;
  lng?: number;
  hashtags: string[];
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  isBookmarked: boolean;
  dateLabel: string;
  viewCount: number;
}> = [
  {
    title: '금광동 래미안 언덕길 아침 러닝 5km 완료했습니다',
    body: '안개가 살짝 낀 새벽 6시 반, 금광동 언덕 코스를 천천히 달렸어요.\n상쾌한 가을 공기 덕분에 발걸음이 한결 가벼웠습니다.\n\n언덕 정상에서 내려다본 동네 지붕들과 막 문을 여는 분식집 풍경까지 총 7장의 사진으로 오늘 아침을 기록해 둡니다.',
    seed: 'home-run-1',
    isVideo: false,
    slideCount: 7,
    dongExposureText: '금광동 54% 상대원동 29% 은행동 15%',
    address: '경남 남해군 삼동면 독일로 92',
    placeName: '독일마을 전망대 산책로',
    lat: 34.7938,
    lng: 128.0457,
    hashtags: ['#성남', '#산책', '#기록', '#아침러닝'],
    likeCount: 18,
    isLiked: true,
    commentCount: 4,
    isBookmarked: false,
    dateLabel: '2일전',
    viewCount: 16,
  },
  {
    title: '황송공원 산책로 메타세쿼이아 길 바람 소리 영상',
    body: '나뭇잎 사이로 비치는 햇살과 사각거리는 바람 소리가 너무 좋아서 잠시 걸음을 멈추고 짧은 영상과 사진으로 담아봤습니다.\n\n첫 번째 슬라이드 영상을 재생해 보시면 산책로의 고요한 분위기를 그대로 느끼실 수 있어요.',
    seed: 'home-video-2',
    isVideo: true,
    slideCount: 7,
    dongExposureText: '삼동면 100%',
    address: '경남 남해군 삼동면 독일로 92',
    placeName: '삼동면 메타세쿼이아 산책길',
    lat: 34.7938,
    lng: 128.0457,
    hashtags: ['#산책로', '#바람소리', '#동네풍경', '#기록'],
    likeCount: 32,
    isLiked: false,
    commentCount: 7,
    isBookmarked: true,
    dateLabel: '2일전',
    viewCount: 45,
  },
  {
    title: '단대천 물길 따라 저녁 산책하며 만난 노을 풍경',
    body: '퇴근 후 가볍게 걸으러 나온 단대천 산책로에서 붉게 물든 가을 저녁 하늘을 만났습니다.\n물결에 비친 노을빛이 참 곱네요.\n\n징검다리 위에서 잠시 멈춰 서서 해가 완전히 넘어갈 때까지 바라보았습니다.',
    seed: 'home-walk-3',
    isVideo: false,
    slideCount: 6,
    dongExposureText: '금광동 54% 상대원동 29% 은행동 15%',
    address: '경기도 성남시 중원구 금광동 120',
    placeName: '단대천 산책로 입구',
    lat: 37.4465,
    lng: 127.1672,
    hashtags: ['#단대천', '#저녁노을', '#성남산책'],
    likeCount: 24,
    isLiked: true,
    commentCount: 5,
    isBookmarked: false,
    dateLabel: '3일전',
    viewCount: 29,
  },
  {
    title: '상대원 시장 골목 갓 찐 옥수수와 따뜻한 어묵 국물',
    body: '저녁 러닝 끝나고 집으로 돌아오는 길에 참지 못하고 들른 상대원 시장 골목.\n김이 모락모락 나는 풍경이 정겹습니다.\n\n사장님께서 어묵 국물을 종이컵 가득 담아주셔서 몸도 마음도 따뜻해졌어요.',
    seed: 'home-market-4',
    isVideo: false,
    slideCount: 5,
    dongExposureText: '상대원동 62% 금광동 25% 하대원동 13%',
    address: '경기도 성남시 중원구 희망로 295',
    placeName: '상대원 종합시장',
    lat: 37.4391,
    lng: 127.1695,
    hashtags: ['#상대원시장', '#동네간식', '#골목기록'],
    likeCount: 41,
    isLiked: false,
    commentCount: 9,
    isBookmarked: false,
    dateLabel: '3일전',
    viewCount: 64,
  },
  {
    title: '비 개인 뒤 금광동 골목길 빗물 고인 풍경과 고양이',
    body: '오전 내내 내리던 비가 그치고 골목 담벼락 아래에서 식빵을 굽고 있는 치즈냥이를 만났어요.\n카메라를 봐도 도망가지 않고 가만히 눈인사를 건네주네요.',
    seed: 'home-cat-5',
    isVideo: true,
    slideCount: 7,
    dongExposureText: '금광동 54% 상대원동 29% 은행동 15%',
    address: '경남 남해군 삼동면 독일로 92',
    placeName: '골목 담벼락 쉼터',
    lat: 34.7938,
    lng: 128.0457,
    hashtags: ['#동네고양이', '#금광동', '#비개인오후'],
    likeCount: 53,
    isLiked: true,
    commentCount: 11,
    isBookmarked: true,
    dateLabel: '4일전',
    viewCount: 82,
  },
  {
    title: '남한산성 입구 유원지까지 주말 장거리 트레일 러닝 기록',
    body: '이번 주말엔 마음먹고 금광동에서 출발해 단대동을 지나 남한산성 입구까지 왕복 10km 코스를 완주했습니다.\n오르막 구간은 숨이 찼지만 정상 약수터 물 한 모금에 피로가 싹 가셨습니다.',
    seed: 'home-trail-6',
    isVideo: false,
    slideCount: 7,
    dongExposureText: '금광동 54% 상대원동 29% 은행동 15%',
    address: '경기도 성남시 수정구 산성대로 525',
    placeName: '남한산성 유원지 입구',
    lat: 37.4581,
    lng: 127.1632,
    hashtags: ['#트레일러닝', '#남한산성', '#주말운동'],
    likeCount: 29,
    isLiked: false,
    commentCount: 6,
    isBookmarked: false,
    dateLabel: '5일전',
    viewCount: 37,
  },
  {
    title: '골목 모퉁이 작은 로스터리 카페의 아침 원두 볶는 향기',
    body: '아침 산책길마다 고소한 커피 향으로 발길을 붙잡는 금광동 로스터리 카페입니다.\n창가에 앉아 따뜻한 드립 커피 한 잔 마시며 오늘 하루 일정을 정리해 보았습니다.',
    seed: 'home-cafe-7',
    isVideo: false,
    slideCount: 4,
    dongExposureText: '삼동면 100%',
    address: '경남 남해군 삼동면 독일로 92',
    placeName: '골목 로스터리 카페',
    lat: 34.7938,
    lng: 128.0457,
    hashtags: ['#동네카페', '#모닝커피', '#금광동'],
    likeCount: 19,
    isLiked: false,
    commentCount: 3,
    isBookmarked: false,
    dateLabel: '5일전',
    viewCount: 22,
  },
  {
    title: '단대공원 야간 트랙 한 바퀴 돌며 찍은 야경 타임랩스',
    body: '저녁 식사 후 동네 주민분들과 함께 단대공원 트랙을 돌며 담아본 영상입니다.\n가로등 불빛이 참 따뜻해요.',
    seed: 'home-track-8',
    isVideo: true,
    slideCount: 6,
    dongExposureText: '금광동 54% 상대원동 29% 은행동 15%',
    address: '경기도 성남시 수정구 단대동 180',
    placeName: '단대근린공원 트랙',
    lat: 37.4521,
    lng: 127.1598,
    hashtags: ['#야간러닝', '#단대공원', '#타임랩스'],
    likeCount: 15,
    isLiked: false,
    commentCount: 2,
    isBookmarked: false,
    dateLabel: '6일전',
    viewCount: 19,
  },
  {
    title: '오래된 동네 문방구 앞 추억의 뽑기 기계가 아직 있네요',
    body: '초등학교 담장 맞은편 문방구 앞을 지나다가 반가운 마음에 찍어봤습니다.\n세월이 흘러도 변하지 않는 골목의 보물 같네요.',
    seed: 'home-shop-9',
    isVideo: false,
    slideCount: 5,
    dongExposureText: '금광동 54% 상대원동 29% 은행동 15%',
    hashtags: ['#추억의문방구', '#동네골목', '#기록'],
    likeCount: 36,
    isLiked: true,
    commentCount: 8,
    isBookmarked: false,
    dateLabel: '6일전',
    viewCount: 51,
  },
  {
    title: '성남시 중원구 도서관 3층 창가 자리에서 바라본 은행나무',
    body: '주말 오후 조용히 책 읽으러 들른 중원도서관.\n창밖으로 보이는 은행나무 잎이 조금씩 노랗게 물들어가고 있습니다.',
    seed: 'home-lib-10',
    isVideo: false,
    slideCount: 6,
    dongExposureText: '금광동 54% 상대원동 29% 은행동 15%',
    address: '경기도 성남시 중원구 원터로 123',
    placeName: '성남시 중원도서관',
    lat: 37.4342,
    lng: 127.1589,
    hashtags: ['#중원도서관', '#가을은행나무', '#주말독서'],
    likeCount: 22,
    isLiked: false,
    commentCount: 4,
    isBookmarked: true,
    dateLabel: '7일전',
    viewCount: 33,
  },
];

// 무한 스크롤(20개씩 불러오기)을 위해 60개의 동네소식 목 데이터 생성
export const MY_HOME_CONTENTS: MyLocalboxItem[] = Array.from(
  { length: 60 },
  (_, idx) => {
    const base = HOME_BASE_ITEMS[idx % HOME_BASE_ITEMS.length];
    const cycle = Math.floor(idx / HOME_BASE_ITEMS.length);
    const mainImageUrl = `https://picsum.photos/seed/${base.seed}-${idx}/800/600`;

    const mediaList: MyContentMedia[] = Array.from(
      { length: base.slideCount },
      (__, sIdx) => {
        if (sIdx === 0 && base.isVideo) {
          return {
            id: `v-${idx}-0`,
            type: 'VIDEO',
            url: SAMPLE_VIDEO_URL,
            posterUrl: mainImageUrl,
            width: 800,
            height: 600,
            durationSeconds: 29,
          };
        }
        return {
          id: `img-${idx}-${sIdx}`,
          type: 'IMAGE',
          url:
            sIdx === 0
              ? mainImageUrl
              : `https://picsum.photos/seed/${base.seed}-${idx}-slide-${sIdx}/800/600`,
          width: 800,
          height: 600,
        };
      }
    );

    return {
      id: 1001 + idx,
      contentType: 'VILLAGE_NEWS',
      title: cycle === 0 ? base.title : `${base.title} (${cycle + 1})`,
      body: base.body,
      imageUrl: `https://picsum.photos/seed/${base.seed}-${idx}/600/600`,
      isVideo: base.isVideo,
      likeCount: base.likeCount + cycle * 3,
      isLiked: cycle === 0 ? base.isLiked : idx % 5 === 0,
      commentCount: base.commentCount + (idx % 3),
      isBookmarked: cycle === 0 ? base.isBookmarked : idx % 7 === 0,
      daysAgo: (idx % 14) + 1,
      dateLabel: idx < 10 ? base.dateLabel : `${(idx % 6) + 2}일전`,
      viewCount: base.viewCount + idx * 2,
      dongExposureText: base.dongExposureText,
      mediaList,
      location: base.address
        ? {
            address: base.address,
            placeName: base.placeName,
            lat: base.lat ?? 34.7938,
            lng: base.lng ?? 128.0457,
          }
        : undefined,
      hashtags: base.hashtags,
      comments: DEFAULT_COMMENTS,
    };
  }
);

// 주민 탭 (공모전·행사·지원사업 같은 주민소식 콘텐츠: 위치·해시태그 없음, 이미지 원본 비율)
const RESIDENT_BASE_ITEMS: Array<{
  title: string;
  body: string;
  seed: string;
  isVideo: boolean;
  slideCount: number;
  eventPeriodText: string;
  posterWidth: number;
  posterHeight: number;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  isBookmarked: boolean;
  daysAgo: number;
  dateLabel: string;
  viewCount: number;
}> = [
  {
    title: '[공모전] 2026 성남시 우리동네 골목기록 사진·영상 공모전 안내',
    body: '성남시 중원구·수정구 골목의 아름다운 사계절과 이웃의 일상을 담은 사진 및 숏폼 영상을 공모합니다.\n\n■ 접수 기간: 2026.10.05(월)~2026.10.20(화)\n■ 공모 대상: 성남시를 사랑하는 주민 누구나\n■ 출품 규격: 디지털 사진(JPG) 또는 60초 이내 세로형 영상\n■ 시상 내역: 대상 1명(50만 원), 최우수상 2명(각 30만 원), 우수상 5명(각 10만 원)\n\n수상작은 연말 금광동 마을전시회 및 온닫이 공식 채널에 소개됩니다.',
    seed: 'res-contest-1',
    isVideo: false,
    slideCount: 3,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 840,
    likeCount: 42,
    isLiked: true,
    commentCount: 12,
    isBookmarked: true,
    daysAgo: 2,
    dateLabel: '2일전',
    viewCount: 128,
  },
  {
    title: '[행사] 금광동 가을빛 나눔 플리마켓 & 거리 음악회 개최',
    body: '이번 주 토요일 오후 1시부터 금광동 근린공원 광장에서 주민 누구나 참여할 수 있는 플리마켓과 어쿠스틱 버스킹 공연이 열립니다.\n\n■ 행사 일시: 2026.10.05(월)~2026.10.20(화)\n■ 행사 장소: 금광동 근린공원 야외무대 일원\n■ 주요 프로그램: 수공예 마켓, 중고 그림책 나눔, 가을 저녁 어쿠스틱 공연',
    seed: 'res-fest-2',
    isVideo: true,
    slideCount: 4,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 800,
    likeCount: 35,
    isLiked: false,
    commentCount: 8,
    isBookmarked: false,
    daysAgo: 4,
    dateLabel: '4일전',
    viewCount: 94,
  },
  {
    title: '[지원사업] 중원구 청년 로컬크리에이터 동네활동 지원사업 모집',
    body: '지역 자원을 활용해 동네의 가치를 높이는 청년 활동가 및 소모임 팀에게 활동비 최대 300만 원과 공유 공간 대관을 지원합니다.\n\n■ 신청 기간: 2026.10.05(월)~2026.10.20(화)\n■ 지원 대상: 성남시 거주 또는 활동 중인 3인 이상 청년 팀',
    seed: 'res-grant-3',
    isVideo: false,
    slideCount: 2,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 860,
    likeCount: 27,
    isLiked: false,
    commentCount: 5,
    isBookmarked: true,
    daysAgo: 6,
    dateLabel: '6일전',
    viewCount: 76,
  },
  {
    title: '[행사] 상대원동 주민자치센터 어르신 스마트폰 사진교실 참가자 모집',
    body: '스마트폰으로 동네 풍경과 가족 사진을 멋지게 찍고 편집하는 법을 배우는 무료 강좌입니다. 선착순 20명 모집합니다.\n\n■ 교육 기간: 2026.10.05(월)~2026.10.20(화)\n■ 신청 방법: 주민자치센터 방문 또는 전화 접수',
    seed: 'res-class-4',
    isVideo: false,
    slideCount: 2,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 820,
    likeCount: 19,
    isLiked: false,
    commentCount: 3,
    isBookmarked: false,
    daysAgo: 9,
    dateLabel: '10.05',
    viewCount: 52,
  },
  {
    title: '[지원사업] 단독·다가구 주택 노후 LED 보안등 무상 교체 지원 안내',
    body: '안전하고 밝은 밤길 조성을 위해 금광동·단대동 일대 노후 골목 조명 및 주택 외벽 센서등 무상 점검과 교체를 지원합니다.',
    seed: 'res-light-5',
    isVideo: false,
    slideCount: 1,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 840,
    likeCount: 31,
    isLiked: true,
    commentCount: 6,
    isBookmarked: false,
    daysAgo: 12,
    dateLabel: '10.02',
    viewCount: 110,
  },
  {
    title: '[공모전] 제5회 탄천·단대천 생태환경 보전 어린이 그림그리기 대회',
    body: '우리 동네 하천의 자연 생태계를 주제로 한 어린이 그림그리기 대회가 열립니다. 참가 어린이 전원에게 기념품을 드립니다.',
    seed: 'res-kids-6',
    isVideo: true,
    slideCount: 3,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 800,
    likeCount: 24,
    isLiked: false,
    commentCount: 4,
    isBookmarked: false,
    daysAgo: 16,
    dateLabel: '09.28',
    viewCount: 67,
  },
  {
    title: '[행사] 황송공원 맨발 황톳길 개장 기념 건강 걷기 캠페인',
    body: '새롭게 단장한 황송공원 황톳길과 세족장 개장을 기념해 이웃과 함께 걷는 건강 산책 캠페인을 진행합니다.',
    seed: 'res-walk-7',
    isVideo: false,
    slideCount: 2,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 850,
    likeCount: 48,
    isLiked: true,
    commentCount: 14,
    isBookmarked: true,
    daysAgo: 21,
    dateLabel: '09.23',
    viewCount: 143,
  },
  {
    title: '[지원사업] 소상공인 동네가게 간판 개선 및 인테리어 컨설팅 지원',
    body: '골목상권 활성화를 위해 10년 이상 운영된 노후 점포의 간판 디자인 개선 비용을 최대 80%까지 지원해 드립니다.',
    seed: 'res-sign-8',
    isVideo: false,
    slideCount: 2,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 840,
    likeCount: 16,
    isLiked: false,
    commentCount: 2,
    isBookmarked: false,
    daysAgo: 26,
    dateLabel: '09.18',
    viewCount: 49,
  },
  {
    title: '[행사] 우리 동네 작은 도서관 가을밤 작가와의 만남 북토크',
    body: '동네를 산책하며 글을 쓰는 에세이 작가님을 모시고 골목 기록의 즐거움에 대해 이야기 나누는 따뜻한 북토크 시간입니다.',
    seed: 'res-book-9',
    isVideo: false,
    slideCount: 2,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 820,
    likeCount: 29,
    isLiked: false,
    commentCount: 7,
    isBookmarked: false,
    daysAgo: 30,
    dateLabel: '09.14',
    viewCount: 81,
  },
  {
    title: '[공모전] 2026 성남시 주민참여예산 우리동네 아이디어 제안 접수',
    body: '산책로 벤치 추가, 골목길 화단 조성 등 우리 동네에 꼭 필요한 생활 밀착형 사업을 주민 여러분이 직접 제안해 주세요.',
    seed: 'res-idea-10',
    isVideo: true,
    slideCount: 3,
    eventPeriodText: '2026.10.05(월)~2026.10.20(화)',
    posterWidth: 600,
    posterHeight: 840,
    likeCount: 33,
    isLiked: false,
    commentCount: 9,
    isBookmarked: false,
    daysAgo: 35,
    dateLabel: '09.09',
    viewCount: 105,
  },
];

// 무한 스크롤(20개씩 불러오기)을 위해 45개의 주민소식 목 데이터 생성
export const MY_RESIDENT_CONTENTS: MyLocalboxItem[] = Array.from(
  { length: 45 },
  (_, idx) => {
    const base = RESIDENT_BASE_ITEMS[idx % RESIDENT_BASE_ITEMS.length];
    const cycle = Math.floor(idx / RESIDENT_BASE_ITEMS.length);
    const posterUrl = `https://picsum.photos/seed/${base.seed}-${idx}/${base.posterWidth}/${base.posterHeight}`;

    const mediaList: MyContentMedia[] = Array.from(
      { length: base.slideCount },
      (__, sIdx) => {
        if (sIdx === 0 && base.isVideo) {
          return {
            id: `res-v-${idx}-0`,
            type: 'VIDEO',
            url: SAMPLE_VIDEO_URL,
            posterUrl,
            width: base.posterWidth,
            height: base.posterHeight,
            durationSeconds: 29,
          };
        }
        return {
          id: `res-img-${idx}-${sIdx}`,
          type: 'IMAGE',
          url:
            sIdx === 0
              ? posterUrl
              : `https://picsum.photos/seed/${base.seed}-${idx}-poster-${sIdx}/${base.posterWidth}/${base.posterHeight}`,
          width: base.posterWidth,
          height: base.posterHeight,
        };
      }
    );

    return {
      id: 2001 + idx,
      contentType: 'RESIDENT_NEWS',
      title: cycle === 0 ? base.title : `${base.title} (${cycle + 1}차)`,
      body: base.body,
      imageUrl: `https://picsum.photos/seed/${base.seed}-${idx}/600/600`,
      isVideo: base.isVideo,
      likeCount: base.likeCount + cycle * 2,
      isLiked: cycle === 0 ? base.isLiked : idx % 6 === 0,
      commentCount: base.commentCount + (idx % 4),
      isBookmarked: cycle === 0 ? base.isBookmarked : idx % 8 === 0,
      daysAgo: base.daysAgo + cycle * 7,
      dateLabel:
        cycle === 0
          ? base.dateLabel
          : `08.${String(28 - (idx % 20)).padStart(2, '0')}`,
      viewCount: base.viewCount + idx * 3,
      eventPeriodText: base.eventPeriodText,
      mediaList,
      location: undefined, // 주민소식은 위치 없음
      hashtags: [], // 주민소식은 해시태그 없음
      comments: DEFAULT_COMMENTS,
    };
  }
);
