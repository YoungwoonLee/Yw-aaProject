import { HangjungdongItem } from '../../../types/resident';

export const FILTER_OPTIONS = {
  interests: [
    '전체',
    '생활지원',
    '취업·창업',
    '주거·부동산',
    '교통·건설',
    '교육·자기개발',
    '보건·의료·건강',
    '재난·안전',
    '보호·돌봄',
    '금융·조세·법률',
    '임신·출산·육아',
    '농림·수산·축산·동물',
    '환경·에너지',
    '문화·관광',
    '기타',
  ],
  ageGroups: [
    '전체',
    '영유아',
    '청소년',
    '대학생·청년',
    '중장년',
    '어르신',
    '기타',
  ],
  targetGroups: [
    '전체',
    '장애인',
    '의사상자·보훈',
    '다문화·새터민',
    '한부모가정',
    '다자녀가정',
    '저소득·생계위기',
    '1인가구',
    '기타',
  ],
} as const;

export const DEFAULT_HDONGS: HangjungdongItem[] = [
  { name: '생연1동', code: '4125051000' },
  { name: '생연2동', code: '4125052000' },
  { name: '중앙동', code: '4125053000' },
  { name: '보산동', code: '4125054000' },
  { name: '불현동', code: '4125055000' },
  { name: '소요동', code: '4125056000' },
  { name: '상패동', code: '4125057000' },
];
