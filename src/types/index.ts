export interface User {
  id: number;
  username: string;
  password?: string;
  nickname: string;
  villageName: string; // e.g. '등승읍 93% 갈말읍 7%'
  regionText: string;  // e.g. '삼성동'
  avatarUrl?: string;
  followersCount?: number;
  postCount?: number;
}

export interface VillageFeed {
  id: number;
  userId: number;
  user: User;
  title: string;
  summary: string;
  content: string;
  imageUrls: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string; // ISO string
  locationName: string;
  tags: string[];
  authorEngagementRate: string; // e.g. '소통율 100%'
  isVideo?: boolean;
  videoDuration?: string;
}

export interface ResidentFeed {
  id: number;
  title: string;
  imageUrl: string;
  createdAt: string;
  content: string;
  category?: string;
  organization?: string;
}

export interface SiotSlot {
  date: string;
  time: string;
  maxPeople: number;
  bookedPeople: number;
}

export interface SiotProgram {
  id: number;
  creatorNickname: string;
  title: string;
  thumbnailUrl: string;
  startTime: string; // e.g. '07:30am'
  endTime: string;   // e.g. '9:30pm'
  locationName: string;
  address?: string;
  status: 'IN_PROGRESS' | 'UPCOMING';
  openDateText?: string; // e.g. 'D-3', '6일 뒤 오픈'
  bookingType: 'TIME_SLOT' | 'OPEN_DATE';
  dayType?: 'EVERYDAY' | 'WEEKDAYS' | 'WEEKENDS';
  is24Hours?: boolean;
  townName?: string;
  startDate: string;
  endDate: string;
  availableSeats: number;
  maxCapacity: number;
  description: string;
  instructorIntro?: string;
  tags: string[];
  slots?: SiotSlot[];
}

export interface Reservation {
  id: string;
  programId: number;
  programTitle: string;
  programThumbnail: string;
  userName: string;
  phone: string;
  count: number;
  date: string;
  timeSlot?: string;
  locationName: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
  createdAt: string;
}

export type TabType = '홈' | '금광동' | '삼성동' | '주민' | '연결' | '체험' | '시옷' | '마이';

export type ScreenType =
  | 'feed'
  | 'resident'
  | 'siot'
  | 'ready'
  | 'localbox'
  | 'my_info'
  | 'login'
  | 'feed_detail'
  | 'resident_detail'
  | 'siot_detail'
  | 'siot_create'
  | 'my_reservations';

