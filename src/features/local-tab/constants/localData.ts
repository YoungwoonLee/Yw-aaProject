export interface TownInfo {
  dongName: string;
  cityName: string;
  dongCode: string;
  tagline: string;
  weather: {
    temp: string;
    condition: string;
    icon: string;
    message: string;
  };
  stats: {
    newsCount: number;
    localboxCount: number;
    neighborCount: number;
    engagementRate: number;
  };
  shareDongs: {
    dongName: string;
    percentage: number;
    color: string;
  }[];
}

export const POPULAR_TOWNS: TownInfo[] = [
  {
    dongName: '도봉동',
    cityName: '서울 도봉구',
    dongCode: '11320108',
    tagline: '도봉산 맑은 공기와 중랑천 물결이 머무는 정겨운 골목길',
    weather: {
      temp: '21°C',
      condition: '맑음',
      icon: '☀️',
      message: '산책하고 이웃과 이야기 나누기 좋은 맑은 날씨',
    },
    stats: {
      newsCount: 24,
      localboxCount: 16,
      neighborCount: 520,
      engagementRate: 98,
    },
    shareDongs: [
      { dongName: '도봉동', percentage: 70, color: '#14B8B0' },
      { dongName: '방학동', percentage: 30, color: '#3B82F6' },
    ],
  },
  {
    dongName: '방학동',
    cityName: '서울 도봉구',
    dongCode: '11320106',
    tagline: '오래된 느티나무와 도깨비시장의 활기가 넘치는 골목',
    weather: {
      temp: '21°C',
      condition: '맑음',
      icon: '🌤️',
      message: '전통시장 장보기와 가을바람 맞기 좋은 날',
    },
    stats: {
      newsCount: 19,
      localboxCount: 14,
      neighborCount: 460,
      engagementRate: 96,
    },
    shareDongs: [
      { dongName: '방학동', percentage: 80, color: '#14B8B0' },
      { dongName: '도봉동', percentage: 20, color: '#3B82F6' },
    ],
  },
  {
    dongName: '창동',
    cityName: '서울 도봉구',
    dongCode: '11320107',
    tagline: '중랑천변 황금빛 은행나무길과 문화가 살아 숨 쉬는 곳',
    weather: {
      temp: '20°C',
      condition: '구름조금',
      icon: '⛅',
      message: '중랑천 자전거길 라이딩하기 딱 좋은 날',
    },
    stats: {
      newsCount: 22,
      localboxCount: 18,
      neighborCount: 610,
      engagementRate: 99,
    },
    shareDongs: [
      { dongName: '창동', percentage: 85, color: '#14B8B0' },
      { dongName: '쌍문동', percentage: 15, color: '#8B5CF6' },
    ],
  },
  {
    dongName: '쌍문동',
    cityName: '서울 도봉구',
    dongCode: '11320105',
    tagline: '응답하라 정겨운 골목 추억과 따뜻한 이웃 온기 100%',
    weather: {
      temp: '21°C',
      condition: '맑음',
      icon: '☀️',
      message: '우이천 카페거리에서 커피 한잔 어때요?',
    },
    stats: {
      newsCount: 18,
      localboxCount: 12,
      neighborCount: 390,
      engagementRate: 97,
    },
    shareDongs: [
      { dongName: '쌍문동', percentage: 75, color: '#14B8B0' },
      { dongName: '창동', percentage: 25, color: '#3B82F6' },
    ],
  },
  {
    dongName: '삼성동',
    cityName: '서울 강남구',
    dongCode: '11680105',
    tagline: '봉은사의 고즈넉함과 도심 골목 노포의 정취가 공존하는 곳',
    weather: {
      temp: '22°C',
      condition: '맑음',
      icon: '☀️',
      message: '골목 베이커리 빵 굽는 향이 솔솔 나는 오후',
    },
    stats: {
      newsCount: 31,
      localboxCount: 25,
      neighborCount: 840,
      engagementRate: 99,
    },
    shareDongs: [
      { dongName: '삼성동', percentage: 80, color: '#14B8B0' },
      { dongName: '청담동', percentage: 20, color: '#F59E0B' },
    ],
  },
  {
    dongName: '망원동',
    cityName: '서울 마포구',
    dongCode: '11440123',
    tagline: '망원시장과 아기자기한 독립서점, 망리단길의 로컬 매력',
    weather: {
      temp: '22°C',
      condition: '맑음',
      icon: '☀️',
      message: '한강공원 피크닉과 골목 탐방 추천!',
    },
    stats: {
      newsCount: 26,
      localboxCount: 21,
      neighborCount: 710,
      engagementRate: 98,
    },
    shareDongs: [
      { dongName: '망원동', percentage: 70, color: '#14B8B0' },
      { dongName: '연남동', percentage: 30, color: '#EC4899' },
    ],
  },
  {
    dongName: '정자동',
    cityName: '경기 성남시',
    dongCode: '41135103',
    tagline: '탄천변 물소리와 카페거리, 푸르른 가로수길 풍경',
    weather: {
      temp: '19°C',
      condition: '맑음',
      icon: '🌤️',
      message: '선선한 가을 저녁 탄천 산책하기 좋아요',
    },
    stats: {
      newsCount: 17,
      localboxCount: 13,
      neighborCount: 480,
      engagementRate: 95,
    },
    shareDongs: [
      { dongName: '정자동', percentage: 60, color: '#14B8B0' },
      { dongName: '수내동', percentage: 40, color: '#3B82F6' },
    ],
  },
  {
    dongName: '생연1동',
    cityName: '경기 동두천시',
    dongCode: '4125051000',
    tagline: '신천 둑방길과 어수정 골목, 주민 자치활동이 활발한 마을',
    weather: {
      temp: '19°C',
      condition: '맑음',
      icon: '☀️',
      message: '주민자치 프로그램과 동네 나눔이 열리는 날',
    },
    stats: {
      newsCount: 15,
      localboxCount: 10,
      neighborCount: 340,
      engagementRate: 96,
    },
    shareDongs: [
      { dongName: '생연1동', percentage: 85, color: '#14B8B0' },
      { dongName: '생연2동', percentage: 15, color: '#3B82F6' },
    ],
  },
];

export interface LocalCategory {
  id: string;
  label: string;
  icon: string;
}

export const LOCAL_CATEGORIES: LocalCategory[] = [
  { id: 'ALL', label: '전체', icon: '🌟' },
  { id: 'STORY', label: '골목·일상', icon: '🏘️' },
  { id: 'STORE', label: '동네가게·맛집', icon: '🥐' },
  { id: 'MEETING', label: '모임·클래스', icon: '🎨' },
  { id: 'NATURE', label: '풍경·산책', icon: '🍁' },
  { id: 'NEWS', label: '동네소식', icon: '📢' },
];

export interface LocalboxCreatorItem {
  id: number;
  name: string;
  category: '로컬미디어' | '단골가게' | '주민크리에이터';
  categoryColor: string;
  avatarUrl: string | null;
  dongName: string;
  followersCount: number;
  engagementRate: string;
  tagline: string;
  isFollowing?: boolean;
}

export const MOCK_LOCALBOX_CREATORS: LocalboxCreatorItem[] = [
  {
    id: 1,
    name: '도봉산 자락 지킴이',
    category: '로컬미디어',
    categoryColor: '#14B8B0',
    avatarUrl: 'https://picsum.photos/id/64/100/100',
    dongName: '도봉동',
    followersCount: 128,
    engagementRate: '소통율 100%',
    tagline: '30년 토박이가 전하는 도봉산 자락 진짜 골목 이야기',
  },
  {
    id: 2,
    name: '창동 산책러',
    category: '주민크리에이터',
    categoryColor: '#10B981',
    avatarUrl: 'https://picsum.photos/id/1027/100/100',
    dongName: '창동',
    followersCount: 84,
    engagementRate: '소통율 96%',
    tagline: '매일 아침 중랑천과 초안산 산책로 풍경을 기록해요',
  },
  {
    id: 3,
    name: '사거리 로컬 베이커리',
    category: '단골가게',
    categoryColor: '#F59E0B',
    avatarUrl: 'https://picsum.photos/id/338/100/100',
    dongName: '도봉동',
    followersCount: 210,
    engagementRate: '소통율 98%',
    tagline: '우리 동네 갓 구운 천연발효 빵과 고소한 버터 향기',
  },
  {
    id: 4,
    name: '골목 이야기꾼',
    category: '주민크리에이터',
    categoryColor: '#8B5CF6',
    avatarUrl: null,
    dongName: '방학동',
    followersCount: 62,
    engagementRate: '소통율 94%',
    tagline: '사라져가는 간판과 정겨운 이웃들의 작은 사연',
  },
  {
    id: 5,
    name: '도봉 공방 숲',
    category: '단골가게',
    categoryColor: '#EC4899',
    avatarUrl: 'https://picsum.photos/id/225/100/100',
    dongName: '쌍문동',
    followersCount: 95,
    engagementRate: '소통율 97%',
    tagline: '나무 냄새 가득한 원데이 목공방 & 이웃 취미 모임',
  },
];
