import { User, VillageFeed, ResidentFeed, SiotProgram, Reservation } from '../types';

// Storage keys
const STORAGE_KEYS = {
  SESSION_USER_ID: 'siut_session',
  SESSION_NICKNAME: 'siut_nickname',
  RESERVATIONS: 'siut_reservations',
  VILLAGE_FEEDS: 'ondaji_village_feeds',
  RESIDENT_FEEDS: 'ondaji_resident_feeds',
  SIOT_PROGRAMS: 'ondaji_siot_programs',
  LIKED_FEEDS: 'ondaji_liked_feeds',
  BOOKMARKED_FEEDS: 'ondaji_bookmarked_feeds',
  ONBOARDED: 'ondaji_onboarded',
};

// Seed Users
export const SEED_USERS: User[] = [
  {
    id: 1,
    username: 'test01',
    password: '1234',
    nickname: '동네 러너',
    villageName: '금광동 50% 상대원동 29% 은행동 20%',
    regionText: '금광동',
    avatarUrl: 'https://picsum.photos/seed/runner_profile/200/200',
    followersCount: 91,
    postCount: 260,
  },
  {
    id: 2,
    username: 'user02',
    password: '1234',
    nickname: '아산댁',
    villageName: '아산면 100%',
    regionText: '아산면',
    avatarUrl: 'https://picsum.photos/id/1027/150/150',
    followersCount: 42,
    postCount: 9,
  },
  {
    id: 3,
    username: 'user03',
    password: '1234',
    nickname: '골목지기',
    villageName: '수정구 80% 중원구 20%',
    regionText: '수정구',
    avatarUrl: 'https://picsum.photos/id/1005/150/150',
    followersCount: 120,
    postCount: 28,
  },
];

// Helper to make ISO dates relative to now
const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86400 * 1000).toISOString();

// Seed Village Feeds
export const SEED_VILLAGE_FEEDS: VillageFeed[] = [
  {
    id: 1,
    userId: 1,
    user: SEED_USERS[0],
    title: '골목 안 낡은 간판, 30년째 그대로예요',
    summary: '어릴 때부터 지나다니던 골목 입구 문방구 간판이 아직도 그대로 걸려있네요. 페인트는 좀 벗겨졌지만 정겹습니다.',
    content: '어릴 때부터 매일 학교 끝나고 참새 방앗간처럼 들르던 동네 문방구예요. 낡은 간판에 적힌 손글씨 전화번호가 아직도 그대로입니다.\n\n주인 할머니께서 여전히 자리를 지키고 계시며, 지나가는 아이들에게 반갑게 인사해주시네요. 이런 따스한 골목 풍경이 오래오래 남아있으면 좋겠습니다.',
    imageUrls: [
      'https://picsum.photos/id/175/800/600',
      'https://picsum.photos/id/164/800/600',
    ],
    viewCount: 142,
    likeCount: 28,
    commentCount: 7,
    createdAt: hoursAgo(2),
    locationName: '삼성동 골목길',
    tags: ['동네기록', '추억의장소', '골목길'],
    authorEngagementRate: '소통율 100%',
  },
  {
    id: 2,
    userId: 2,
    user: SEED_USERS[1],
    title: '삼성동 은행나무길 단풍이 절정입니다',
    summary: '오늘 아침 산책길에 찍은 은행나무 가로수길입니다. 노란 융단을 깔아놓은 듯 너무 예뻐서 주민분들과 공유해요.',
    content: '매년 이맘때면 온 동네를 황금빛으로 물들이는 은행나무길이에요. 바람이 불 때마다 잎이 흩날리는 모습이 정말 장관입니다.\n\n주말에 가족들이나 반려견과 함께 가볍게 산책해보세요. 햇살 비치는 오전 10시쯤 가시면 가장 예쁜 사진을 건질 수 있어요!',
    imageUrls: [
      'https://picsum.photos/id/10/800/600',
      'https://picsum.photos/id/15/800/600',
      'https://picsum.photos/id/19/800/600',
    ],
    viewCount: 310,
    likeCount: 54,
    commentCount: 12,
    createdAt: hoursAgo(5),
    locationName: '삼성동 가로수길',
    tags: ['가을산책', '은행나무길', '동네풍경'],
    authorEngagementRate: '소통율 98%',
  },
  {
    id: 3,
    userId: 3,
    user: SEED_USERS[2],
    title: '동네 빵집 신메뉴 먹어봤어요',
    summary: '사거리 베이커리에서 오늘 출시된 흑임자 맘모스빵을 사먹어봤는데 정말 고소하고 달지 않아 어르신들도 좋아할 맛입니다.',
    content: '매일 아침 갓 구운 빵 냄새로 골목을 깨우는 우리 동네 빵집에서 가을 신메뉴로 흑임자 맘모스빵을 냈어요.\n\n크림이 너무 달지 않고 견과류가 오독오독 씹혀서 진짜 든든하네요. 오전 11시에 갓 구워져 나온다고 하니 참고하세요!',
    imageUrls: [
      'https://picsum.photos/id/1080/800/600',
    ],
    viewCount: 228,
    likeCount: 39,
    commentCount: 8,
    createdAt: hoursAgo(11),
    locationName: '사거리 로컬 베이커리',
    tags: ['동네맛집', '빵지순례', '디저트'],
    authorEngagementRate: '소통율 95%',
  },
  {
    id: 4,
    userId: 1,
    user: SEED_USERS[0],
    title: '주말 벼룩시장 다녀온 후기',
    summary: '동네 어귀 공원에서 열린 나눔 플리마켓에서 아기자기한 도자기 머그컵과 읽고 싶었던 소설책을 단돈 3천원에 득템했네요!',
    content: '주민자치센터 앞마당에서 주민들이 자발적으로 모여 연 소소한 벼룩시장이었습니다.\n\n사용하지 않는 물건들을 서로 나누고, 이웃끼리 인사도 나누는 정다운 시간이었습니다. 매월 셋째 주 토요일마다 열린다니 다음엔 저도 셀러로 참여해보려 합니다.',
    imageUrls: [
      'https://picsum.photos/id/225/800/600',
      'https://picsum.photos/id/250/800/600',
    ],
    viewCount: 189,
    likeCount: 33,
    commentCount: 5,
    createdAt: daysAgo(1),
    locationName: '삼성동 근린공원',
    tags: ['동네플리마켓', '이웃나눔', '소소한일상'],
    authorEngagementRate: '소통율 100%',
  },
  {
    id: 5,
    userId: 2,
    user: SEED_USERS[1],
    title: '우리 동네 길고양이 삼색이 근황',
    summary: '정미소 앞 화단에서 늘 졸고 있는 삼색이가 겨울나기 준비로 털이 복슬복슬해졌어요. 이웃들이 챙겨주는 겨울집도 잘 쓰네요.',
    content: '동네 지킴이 삼색이입니다. 주민들이 십시일반 사료를 챙겨주고 따뜻한 쉼터를 마련해준 덕분에 건강하게 잘 지내고 있어요.\n\n날이 쌀쌀해지니 털이 빵빵하게 쪘네요. 지나가실 때 스트레스 받지 않게 조용히 눈인사만 건네주세요.',
    imageUrls: [
      'https://picsum.photos/id/219/800/600',
    ],
    viewCount: 450,
    likeCount: 88,
    commentCount: 19,
    createdAt: daysAgo(2),
    locationName: '마을 안길 화단',
    tags: ['길고양이', '동네마스코트', '반려생활'],
    authorEngagementRate: '소통율 100%',
  },
  {
    id: 6,
    userId: 3,
    user: SEED_USERS[2],
    title: '탄천 산책로 야간 조명 새로 생겼네요',
    summary: '어제 저녁 퇴근길에 보니 다리 밑 어두웠던 산책 구간에 따뜻한 주황빛 LED 풋라이트가 설치되어 훨씬 걷기 좋아졌습니다.',
    content: '그동안 어두워서 밤에 혼자 걷기 조금 무서웠던 탄천 합류부 구간이었는데, 구청에서 바닥형 조명을 꼼꼼하게 설치해줬네요.\n\n벌레 꼬임 방지 조명이라 눈도 편안하고 밤공기 쐬며 산책하기 딱 좋습니다.',
    imageUrls: [
      'https://picsum.photos/id/318/800/600',
      'https://picsum.photos/id/319/800/600',
    ],
    viewCount: 260,
    likeCount: 41,
    commentCount: 6,
    createdAt: daysAgo(3),
    locationName: '탄천변 수변산책로',
    tags: ['야간산책', '안전한동네', '동네시설'],
    authorEngagementRate: '소통율 92%',
  },
  {
    id: 7,
    userId: 1,
    user: SEED_USERS[0],
    title: '오래된 세탁소 사장님의 따뜻한 한마디',
    summary: '아끼던 코트에 커피를 쏟아 절망했는데, 세탁소 삼촌께서 웃으시며 걱정말라고 마법처럼 깨끗하게 지워주셨습니다.',
    content: '이 동네에서 40년 동안 옷을 다려오신 세탁소 어르신 솜씨는 역시 대한민국 최고입니다.\n\n찾으러 갔을 때 "이제 새 옷처럼 예쁘게 입어라" 하시며 비닐을 씌워주시는데 코끝이 찡했네요. 오래오래 건강하셨으면 좋겠습니다.',
    imageUrls: [
      'https://picsum.photos/id/366/800/600',
    ],
    viewCount: 195,
    likeCount: 37,
    commentCount: 4,
    createdAt: daysAgo(4),
    locationName: '성남 세탁소',
    tags: ['장인정신', '이웃정', '마을이야기'],
    authorEngagementRate: '소통율 100%',
  },
  {
    id: 8,
    userId: 2,
    user: SEED_USERS[1],
    title: '동네 작은 서점에서 찾은 인생 책',
    summary: '독립서점 구석 서가에서 우연히 발견한 에세이 한 권. 사장님이 직접 손글씨로 적어둔 추천 메모 덕분에 마음에 쏙 들었습니다.',
    content: '대형서점에서는 눈에 띄지 않던 보물 같은 독립출판물들을 만날 수 있는 곳이에요.\n\n따뜻한 드립 커피 한 잔 마시며 책장을 넘기는 시간 자체가 힐링이었습니다. 이번 주말 조용히 머물다 가실 분들께 추천합니다.',
    imageUrls: [
      'https://picsum.photos/id/24/800/600',
    ],
    viewCount: 280,
    likeCount: 49,
    commentCount: 9,
    createdAt: daysAgo(5),
    locationName: '골목 모퉁이 책방',
    tags: ['독립서점', '책스타그램', '동네서점'],
    authorEngagementRate: '소통율 96%',
  },
];

// Seed Resident Feeds
export const SEED_RESIDENT_FEEDS: ResidentFeed[] = [
  {
    id: 101,
    title: '○○공원 보수공사 안내 (10/14~10/20)',
    imageUrl: 'https://picsum.photos/id/111/600/400',
    createdAt: hoursAgo(3),
    content: '주민 여러분의 안전한 여가활동을 위해 공원 내 노후 탄성포장재 전면 교체 및 어린이 조합놀이대 보수 공사를 진행합니다.\n\n공사 기간 동안 일부 구역의 통행이 제한되오니 양해 부탁드립니다.\n- 공사기간: 2026.10.14(수) ~ 10.20(화)\n- 문의: 공원녹지과 (02-555-0119)',
    category: '시설보수',
    organization: '구청 공원녹지과',
  },
  {
    id: 102,
    title: '주민자치회 10월 정기회의 공지',
    imageUrl: 'https://picsum.photos/id/160/600/400',
    createdAt: hoursAgo(8),
    content: '살기 좋은 마을 조성을 위한 10월 주민자치회 정기회의를 개최합니다.\n\n주요 안건: 2026년 마을축제 추진 경과보고 및 골목길 가로등 개선 주민제안 심의\n주민 누구나 방청 가능합니다.\n- 일시: 2026.10.18(일) 19:00\n- 장소: 주민센터 3층 대회의실',
    category: '자치회의',
    organization: '주민자치위원회',
  },
  {
    id: 103,
    title: '동네 어르신 건강검진 순회 차량 방문 일정',
    imageUrl: 'https://picsum.photos/id/201/600/400',
    createdAt: daysAgo(1),
    content: '관내 만 65세 이상 어르신을 대상으로 혈압, 혈당 측정 및 치매 조기검진 순회 차량이 마을회관 앞 공터를 찾아옵니다.\n\n신분증을 지참하시고 편안한 복장으로 방문해주세요.',
    category: '보건복지',
    organization: '보건소 방문보건팀',
  },
  {
    id: 104,
    title: '하반기 재활용품 분리배출 요일제 준수 안내',
    imageUrl: 'https://picsum.photos/id/214/600/400',
    createdAt: daysAgo(3),
    content: '쾌적한 골목 환경 유지를 위해 투명 페트병 별도 배출 및 비닐류 요일별 배출 규정을 안내해 드립니다.\n\n- 배출시간: 일·화·목 19:00 ~ 익일 06:00\n깨끗한 우리 동네 만들기에 적극적인 협조 부탁드립니다.',
    category: '환경위생',
    organization: '자원순환과',
  },
];

// Seed Experience Programs (4 IN_PROGRESS, 2 UPCOMING)
export const SEED_SIOT_PROGRAMS: SiotProgram[] = [
  {
    id: 201,
    creatorNickname: '나무결 공방',
    title: '금광동 호두나무 원목 도마 & 버터나이프 원데이 클래스',
    thumbnailUrl: 'https://picsum.photos/id/1070/800/600',
    startTime: '01:00pm',
    endTime: '04:00pm',
    locationName: '금광동 골목 나무공방',
    address: '경기도 성남시 중원구 금광로 42-1 1층',
    townName: '금광동',
    dayType: 'EVERYDAY',
    status: 'IN_PROGRESS',
    bookingType: 'TIME_SLOT',
    startDate: '2026.10.14',
    endDate: '2026.10.31',
    availableSeats: 3,
    maxCapacity: 6,
    description:
      '호두나무 원목의 따뜻한 결을 느끼며 나만의 플레이팅 도마와 버터나이프를 직접 깎고 다듬어보는 체험입니다.\n\n• 사포질부터 천연 호두오일 마감까지 전 과정 실습\n• 초보자도 안전하게 참여할 수 있도록 1:1 밀착 코칭\n• 완성 후 당일 포장해 바로 가져가실 수 있습니다.',
    instructorIntro: '성남 금광동에서 15년째 원목 가구와 소품을 만들고 있는 가구제작기능사 김목수입니다.',
    tags: ['원목도마', '목공방', '금광동체험', '원데이클래스'],
    slots: [
      { date: '2026-10-16', time: '01:00 PM - 04:00 PM', maxPeople: 6, bookedPeople: 3 },
      { date: '2026-10-18', time: '01:00 PM - 04:00 PM', maxPeople: 6, bookedPeople: 4 },
      { date: '2026-10-22', time: '01:00 PM - 04:00 PM', maxPeople: 6, bookedPeople: 2 },
      { date: '2026-10-25', time: '01:00 PM - 04:00 PM', maxPeople: 6, bookedPeople: 1 },
    ],
  },
  {
    id: 202,
    creatorNickname: '베트남 키친 리',
    title: '현지 비법 육수로 끓이는 하노이식 생면 쌀국수 쿠킹클래스',
    thumbnailUrl: 'https://picsum.photos/id/292/800/600',
    startTime: '10:30am',
    endTime: '04:00pm',
    locationName: '상대원 공유주방 2호점',
    address: '경기도 성남시 중원구 희망로 382 2층',
    townName: '상대원동',
    dayType: 'WEEKDAYS',
    status: 'IN_PROGRESS',
    bookingType: 'TIME_SLOT',
    startDate: '2026.10.15',
    endDate: '2026.10.31',
    availableSeats: 4,
    maxCapacity: 8,
    description:
      '베트남 현지 20년 비법 향신료 블렌딩으로 깊고 진한 육수를 우려내는 법부터 생면 조리법, 숯불 분짜 소스 만들기까지 직접 실습합니다.\n\n직접 만든 쌀국수와 분짜를 이웃들과 함께 시식하고 비법 레시피 카드를 받아가세요.',
    instructorIntro: '호치민 1군 로컬 레스토랑에서 10년간 헤드셰프로 일한 이지은 요리연구가입니다.',
    tags: ['원데이클래스', '쌀국수', '쿠킹클래스', '상대원동'],
    slots: [
      { date: '2026-10-16', time: '10:30 AM - 12:30 PM', maxPeople: 4, bookedPeople: 2 },
      { date: '2026-10-16', time: '02:00 PM - 04:00 PM', maxPeople: 4, bookedPeople: 2 },
      { date: '2026-10-18', time: '11:00 AM - 01:00 PM', maxPeople: 4, bookedPeople: 1 },
      { date: '2026-10-22', time: '02:00 PM - 04:00 PM', maxPeople: 4, bookedPeople: 3 },
    ],
  },
  {
    id: 203,
    creatorNickname: '동네 러너',
    title: '황송공원 · 남한산성 자락길 모닝 러닝 & 스트레칭 크루',
    thumbnailUrl: 'https://picsum.photos/id/1058/800/600',
    startTime: '06:30am',
    endTime: '08:00am',
    locationName: '금광동 황송공원 분수대 앞',
    address: '경기도 성남시 중원구 금광동 황송공원 광장',
    townName: '금광동',
    dayType: 'WEEKENDS',
    status: 'IN_PROGRESS',
    bookingType: 'OPEN_DATE',
    startDate: '2026.10.12',
    endDate: '2026.11.15',
    availableSeats: 7,
    maxCapacity: 15,
    description:
      '상쾌한 가을 아침 공기를 마시며 황송공원 산책로 5km를 6분 30초 페이스로 함께 달리는 동네 러닝 체험입니다.\n\n러닝 전후 관절 부상 방지 동적 스트레칭과 러닝 폼 코칭이 포함되며 초보 러너도 부담 없이 참여하실 수 있습니다.',
    instructorIntro: '마라톤 풀코스 12회 완주, 생활스포츠지도사 2급 보유 동네 러너입니다.',
    tags: ['러닝크루', '오운완', '황송공원', '모닝루틴'],
    slots: [],
  },
  {
    id: 204,
    creatorNickname: '초록 도예가',
    title: '은행동 어린이 흙놀이 & 물레 도자기 체험 교실',
    thumbnailUrl: 'https://picsum.photos/id/1062/800/600',
    startTime: '10:30am',
    endTime: '12:00pm',
    locationName: '은행동 마을 어린이 도예터',
    address: '경기도 성남시 중원구 산성대로 410 1층',
    townName: '은행동',
    dayType: 'WEEKENDS',
    status: 'IN_PROGRESS',
    bookingType: 'TIME_SLOT',
    startDate: '2026.10.16',
    endDate: '2026.11.08',
    availableSeats: 5,
    maxCapacity: 8,
    description:
      '물레를 돌리며 오감을 자극하는 친환경 백자토 도자기 빚기 체험입니다.\n아이들이 직접 만든 시리얼 볼과 캐릭터 머그컵을 재벌구이까지 완료해 가마에서 구워드립니다.',
    instructorIntro: '도예과 석사 졸업 및 어린이 미술 심리지도사 자격증 보유.',
    tags: ['어린이체험', '도자기체험', '물레체험', '은행동'],
    slots: [
      { date: '2026-10-16', time: '10:30 AM - 12:00 PM', maxPeople: 4, bookedPeople: 1 },
      { date: '2026-10-18', time: '10:30 AM - 12:00 PM', maxPeople: 4, bookedPeople: 2 },
      { date: '2026-10-25', time: '10:30 AM - 12:00 PM', maxPeople: 4, bookedPeople: 1 },
    ],
  },
  {
    id: 205,
    creatorNickname: '시네마 빌리지',
    title: '단대천 가을밤 골목길 독립영화 야외 상영회',
    thumbnailUrl: 'https://picsum.photos/id/299/800/600',
    startTime: '07:00pm',
    endTime: '09:30pm',
    locationName: '단대동 문화쉼터 루프탑',
    address: '경기도 성남시 수정구 단대동 108-2 루프탑',
    townName: '단대동',
    dayType: 'WEEKENDS',
    status: 'UPCOMING',
    openDateText: 'D-3 오픈예정',
    bookingType: 'OPEN_DATE',
    startDate: '2026.10.19',
    endDate: '2026.10.19',
    availableSeats: 20,
    maxCapacity: 20,
    description:
      '선선한 가을밤 바람과 함께 옥상 대형 스크린에서 동네 독립영화와 고전 명작을 감상합니다. 따뜻한 무알콜 뱅쇼와 고소한 팝콘이 기본 제공됩니다.',
    instructorIntro: '독립영화 프로그래머 & 성남 동네 문화기획자 모임.',
    tags: ['야외상영', '가을낭만', '루프탑영화', '단대동'],
    slots: [],
  },
  {
    id: 206,
    creatorNickname: '식물약국 보타닉',
    title: '우리 집 반려식물 분갈이 & 흙 배합 클리닉 워크숍',
    thumbnailUrl: 'https://picsum.photos/id/106/800/600',
    startTime: '02:00pm',
    endTime: '04:00pm',
    locationName: '금광동 보타닉 식물카페',
    address: '경기도 성남시 중원구 금광동 24-5 1층',
    townName: '금광동',
    dayType: 'WEEKENDS',
    status: 'UPCOMING',
    openDateText: '6일 뒤 오픈',
    bookingType: 'TIME_SLOT',
    startDate: '2026.10.22',
    endDate: '2026.10.25',
    availableSeats: 10,
    maxCapacity: 10,
    description:
      '집에서 잎이 처지거나 시들해진 반려식물을 화분째 가져오시면 통기성 흙 배합부터 뿌리 정리, 분갈이 후 맞춤 영양제 처방까지 꼼꼼히 코칭해드립니다.',
    instructorIntro: '도시농업관리사 및 식물 큐레이터 보타닉 대표.',
    tags: ['홈가드닝', '식물집사', '분갈이', '금광동'],
    slots: [
      { date: '2026-10-22', time: '02:00 PM - 04:00 PM', maxPeople: 5, bookedPeople: 0 },
      { date: '2026-10-25', time: '02:00 PM - 04:00 PM', maxPeople: 5, bookedPeople: 0 },
    ],
  },
];

export const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'R840291',
    programId: 201,
    programTitle: '금광동 호두나무 원목 도마 & 버터나이프 원데이 클래스',
    programThumbnail: 'https://picsum.photos/id/1070/800/600',
    userName: '동네 러너',
    phone: '010-3921-8402',
    count: 2,
    date: '2026-10-18',
    timeSlot: '01:00 PM - 04:00 PM',
    locationName: '금광동 골목 나무공방',
    status: 'CONFIRMED',
    createdAt: new Date(now - 3600 * 1000 * 5).toISOString(),
  },
];

// Helper to format relative time
export function formatRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    if (diffMs < 0) return '방금 전';
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
      return `${Math.max(1, diffMinutes)}분전`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}시간전`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일전`;
  } catch {
    return '최근';
  }
}

// -------------------------------------------------------------
// LOCAL STORAGE DATA LAYER & MOCK API FUNCTIONS
// -------------------------------------------------------------

function getStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// Initialize seed data if not present
export function initMockStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.VILLAGE_FEEDS)) {
    localStorage.setItem(STORAGE_KEYS.VILLAGE_FEEDS, JSON.stringify(SEED_VILLAGE_FEEDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESIDENT_FEEDS)) {
    localStorage.setItem(STORAGE_KEYS.RESIDENT_FEEDS, JSON.stringify(SEED_RESIDENT_FEEDS));
  }
  const existingPrograms = getStored<SiotProgram[] | null>(STORAGE_KEYS.SIOT_PROGRAMS, null);
  if (!existingPrograms || existingPrograms.length === 0 || !existingPrograms[0].townName) {
    localStorage.setItem(STORAGE_KEYS.SIOT_PROGRAMS, JSON.stringify(SEED_SIOT_PROGRAMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(SEED_RESERVATIONS));
  }
}

// --- AUTHENTICATION API ---

// GET /api/v1/auth/me
export function getCurrentUser(): User | null {
  const sessionUserId = localStorage.getItem(STORAGE_KEYS.SESSION_USER_ID);
  if (!sessionUserId) {
    return SEED_USERS[0];
  }
  const user = SEED_USERS.find(u => u.id === Number(sessionUserId));
  if (user) {
    const customNick = localStorage.getItem(STORAGE_KEYS.SESSION_NICKNAME);
    return customNick ? { ...user, nickname: customNick } : user;
  }
  return SEED_USERS[0];
}

// POST /api/v1/auth/login
export function login(username: string, password: string): { success: boolean; user?: User; error?: string } {
  const user = SEED_USERS.find(u => u.username === username.trim());
  if (!user) {
    return { success: false, error: '존재하지 않는 아이디입니다.' };
  }
  if (user.password !== password) {
    return { success: false, error: '비밀번호가 일치하지 않습니다.' };
  }
  localStorage.setItem(STORAGE_KEYS.SESSION_USER_ID, String(user.id));
  localStorage.setItem(STORAGE_KEYS.SESSION_NICKNAME, user.nickname);
  return { success: true, user };
}

// POST /api/v1/auth/logout
export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION_USER_ID);
  localStorage.removeItem(STORAGE_KEYS.SESSION_NICKNAME);
}

// --- VILLAGE FEEDS API ---

// GET /api/v1/villages/feeds
export function getVillageFeeds(): VillageFeed[] {
  initMockStorage();
  const feeds: VillageFeed[] = getStored(STORAGE_KEYS.VILLAGE_FEEDS, SEED_VILLAGE_FEEDS);
  const liked: number[] = getStored(STORAGE_KEYS.LIKED_FEEDS, []);
  const bookmarked: number[] = getStored(STORAGE_KEYS.BOOKMARKED_FEEDS, []);

  return feeds.map(feed => ({
    ...feed,
    isLiked: liked.includes(feed.id),
    isBookmarked: bookmarked.includes(feed.id),
  }));
}

// GET /api/v1/villages/feeds/:id
export function getVillageFeedById(id: number): VillageFeed | null {
  const feeds = getVillageFeeds();
  return feeds.find(f => f.id === id) || null;
}

// POST /api/v1/villages/feeds
export function createVillageFeed(params: {
  title: string;
  content: string;
  imageUrl?: string;
  locationName?: string;
}): VillageFeed {
  const feeds = getVillageFeeds();
  const currentUser = getCurrentUser() || SEED_USERS[0];

  const newFeed: VillageFeed = {
    id: Date.now(),
    userId: currentUser.id,
    user: currentUser,
    title: params.title.trim(),
    summary: params.content.slice(0, 70).trim() + (params.content.length > 70 ? '...' : ''),
    content: params.content,
    imageUrls: params.imageUrl ? [params.imageUrl] : ['https://picsum.photos/id/1050/800/600'],
    viewCount: 1,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
    locationName: params.locationName || currentUser.regionText,
    tags: ['동네이야기', '일상기록'],
    authorEngagementRate: '소통율 100%',
  };

  const updated = [newFeed, ...feeds];
  setStored(STORAGE_KEYS.VILLAGE_FEEDS, updated);
  return newFeed;
}

// POST /api/v1/villages/feeds/:id/like
export function toggleFeedLike(id: number): { isLiked: boolean; count: number } {
  const feeds = getVillageFeeds();
  const liked: number[] = getStored(STORAGE_KEYS.LIKED_FEEDS, []);
  const isAlready = liked.includes(id);

  const newLiked = isAlready ? liked.filter(item => item !== id) : [...liked, id];
  setStored(STORAGE_KEYS.LIKED_FEEDS, newLiked);

  let newCount = 0;
  const updatedFeeds = feeds.map(f => {
    if (f.id === id) {
      newCount = isAlready ? Math.max(0, f.likeCount - 1) : f.likeCount + 1;
      return { ...f, likeCount: newCount };
    }
    return f;
  });
  setStored(STORAGE_KEYS.VILLAGE_FEEDS, updatedFeeds);

  return { isLiked: !isAlready, count: newCount };
}

// POST /api/v1/villages/feeds/:id/bookmark
export function toggleFeedBookmark(id: number): boolean {
  const bookmarked: number[] = getStored(STORAGE_KEYS.BOOKMARKED_FEEDS, []);
  const isAlready = bookmarked.includes(id);
  const newBookmarked = isAlready ? bookmarked.filter(item => item !== id) : [...bookmarked, id];
  setStored(STORAGE_KEYS.BOOKMARKED_FEEDS, newBookmarked);
  return !isAlready;
}

// --- RESIDENT FEEDS API ---

// GET /api/v1/residents/feeds
export function getResidentFeeds(): ResidentFeed[] {
  initMockStorage();
  return getStored(STORAGE_KEYS.RESIDENT_FEEDS, SEED_RESIDENT_FEEDS);
}

// POST /api/v1/residents/feeds
export function createResidentFeed(params: {
  title: string;
  content: string;
  imageUrl?: string;
}): ResidentFeed {
  const feeds = getResidentFeeds();
  const newFeed: ResidentFeed = {
    id: Date.now(),
    title: params.title.trim(),
    content: params.content,
    imageUrl: params.imageUrl || 'https://picsum.photos/id/214/600/400',
    createdAt: new Date().toISOString(),
    category: '주민소식',
    organization: '마을자치회',
  };
  const updated = [newFeed, ...feeds];
  setStored(STORAGE_KEYS.RESIDENT_FEEDS, updated);
  return newFeed;
}

// --- SIOT PROGRAMS API ---

// GET /api/v1/siot/programs
export function getSiotPrograms(): SiotProgram[] {
  initMockStorage();
  return getStored(STORAGE_KEYS.SIOT_PROGRAMS, SEED_SIOT_PROGRAMS);
}

// GET /api/v1/siot/programs/:id
export function getSiotProgramById(id: number): SiotProgram | null {
  const programs = getSiotPrograms();
  return programs.find(p => p.id === id) || null;
}

// POST /api/v1/siot/programs
export function createSiotProgram(data: {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  dayType?: 'EVERYDAY' | 'WEEKDAYS' | 'WEEKENDS';
  is24Hours?: boolean;
  bookingType?: 'TIME_SLOT' | 'OPEN_DATE';
  maxCapacity?: number;
  townName?: string;
  thumbnailUrl: string;
  description: string;
  instructorIntro?: string;
  locationName: string;
  address?: string;
  tags: string[];
}): SiotProgram {
  const programs = getSiotPrograms();
  const currentUser = getCurrentUser();
  const capacity = data.maxCapacity || 8;
  const isOpenDate = data.bookingType === 'OPEN_DATE' || data.is24Hours;

  const newProgram: SiotProgram = {
    id: Date.now(),
    creatorNickname: currentUser ? currentUser.nickname : '동네 러너',
    title: data.title,
    thumbnailUrl: data.thumbnailUrl || 'https://picsum.photos/id/1069/800/600',
    startTime: data.startTime,
    endTime: data.endTime,
    dayType: data.dayType || 'EVERYDAY',
    is24Hours: data.is24Hours || false,
    townName: data.townName || '금광동',
    locationName: data.locationName,
    address: data.address,
    status: 'IN_PROGRESS',
    bookingType: isOpenDate ? 'OPEN_DATE' : 'TIME_SLOT',
    startDate: data.startDate,
    endDate: data.endDate,
    availableSeats: capacity,
    maxCapacity: capacity,
    description: data.description,
    instructorIntro: data.instructorIntro,
    tags: data.tags.length ? data.tags : ['원데이클래스', '동네체험'],
    slots: isOpenDate
      ? []
      : [
          {
            date: data.startDate.replace(/\./g, '-'),
            time: `${data.startTime} ~ ${data.endTime}`,
            maxPeople: capacity,
            bookedPeople: 0,
          },
        ],
  };

  const updated = [newProgram, ...programs];
  setStored(STORAGE_KEYS.SIOT_PROGRAMS, updated);
  return newProgram;
}

// --- RESERVATIONS API ---

// GET /api/v1/siot/reservations
export function getReservations(): Reservation[] {
  initMockStorage();
  return getStored<Reservation[]>(STORAGE_KEYS.RESERVATIONS, SEED_RESERVATIONS);
}

// POST /api/v1/siot/reservations
export function createReservation(params: {
  programId: number;
  userName: string;
  phone: string;
  count: number;
  date: string;
  timeSlot?: string;
}): Reservation {
  const program = getSiotProgramById(params.programId);
  const reservations = getReservations();

  const newReservation: Reservation = {
    id: 'R' + Date.now().toString().slice(-6),
    programId: params.programId,
    programTitle: program ? program.title : '시옷 프로그램',
    programThumbnail: program ? program.thumbnailUrl : '',
    userName: params.userName.trim(),
    phone: params.phone.trim(),
    count: params.count,
    date: params.date,
    timeSlot: params.timeSlot,
    locationName: program ? program.locationName : '온닫이 거점',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  setStored(STORAGE_KEYS.RESERVATIONS, [newReservation, ...reservations]);

  // Deduct available seats
  if (program) {
    const allPrograms = getSiotPrograms();
    const updatedPrograms = allPrograms.map(p => {
      if (p.id === program.id) {
        return {
          ...p,
          availableSeats: Math.max(0, p.availableSeats - params.count),
        };
      }
      return p;
    });
    setStored(STORAGE_KEYS.SIOT_PROGRAMS, updatedPrograms);
  }

  return newReservation;
}

// POST /api/v1/siot/reservations/:id/cancel
export function cancelReservation(id: string): boolean {
  const reservations = getReservations();
  const target = reservations.find(r => r.id === id);
  if (!target) return false;

  const updated = reservations.map(r => (r.id === id ? { ...r, status: 'CANCELLED' as const } : r));
  setStored(STORAGE_KEYS.RESERVATIONS, updated);

  // Restore seats
  const allPrograms = getSiotPrograms();
  const updatedPrograms = allPrograms.map(p => {
    if (p.id === target.programId) {
      return {
        ...p,
        availableSeats: Math.min(p.maxCapacity, p.availableSeats + target.count),
      };
    }
    return p;
  });
  setStored(STORAGE_KEYS.SIOT_PROGRAMS, updatedPrograms);

  return true;
}

// POST /api/v1/siot/reservations/:id/checkin
export function checkInReservation(id: string): boolean {
  const reservations = getReservations();
  const updated = reservations.map(r => (r.id === id ? { ...r, status: 'CHECKED_IN' as const } : r));
  setStored(STORAGE_KEYS.RESERVATIONS, updated);
  return true;
}

// --- ONBOARDING STATUS ---
export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
}

export function setSeenOnboarding(): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
}
