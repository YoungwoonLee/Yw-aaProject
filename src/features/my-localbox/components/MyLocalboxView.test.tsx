import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyLocalboxView } from './MyLocalboxView';

describe('MyLocalboxView & MyContentDetailView (나의 로컬박스 및 콘텐츠 상세 화면)', () => {
  it('상단 바, 프로필 통계(260 콘텐츠 / 91 팔로워), 동네 비율 범례를 렌더링한다', () => {
    render(<MyLocalboxView />);

    expect(screen.getByText('동네 러너')).toBeTruthy();
    expect(screen.getByText('260')).toBeTruthy();
    expect(screen.getByText('91')).toBeTruthy();
    expect(screen.getByText('경기도 성남시 중원구 금광동')).toBeTruthy();
    expect(screen.getByText('오늘 2')).toBeTruthy();
    expect(screen.getByText('성남시 금광동')).toBeTruthy();
    expect(screen.getByText('성남시 상대원동')).toBeTruthy();
    expect(screen.getByText('성남시 단대동')).toBeTruthy();
  });

  it('홈 · 주민 · 소개 탭 전환과 격자/목록 보기 전환이 동작한다', () => {
    render(<MyLocalboxView />);

    // 목록 보기 전환
    const listBtn = screen.getByLabelText('목록 보기');
    fireEvent.click(listBtn);
    expect(screen.getAllByText('16회').length).toBeGreaterThan(0);

    // 주민 탭 전환 (7일 초과 날짜 월.일 표기 확인)
    const residentTab = screen.getByRole('button', { name: '주민' });
    fireEvent.click(residentTab);
    const residentListBtn = screen.getByLabelText('목록 보기');
    fireEvent.click(residentListBtn);
    expect(screen.getAllByText('10.05').length).toBeGreaterThan(0);

    // 소개 탭 전환 및 더보기/접기 토글 확인
    const introTab = screen.getByRole('button', { name: '소개' });
    fireEvent.click(introTab);
    expect(screen.getByText('#성남')).toBeTruthy();
    expect(screen.getByText('#산책')).toBeTruthy();
    expect(screen.getByText('#기록')).toBeTruthy();

    const moreBtn = screen.getByRole('button', { name: /더보기/ });
    fireEvent.click(moreBtn);
    expect(screen.getByRole('button', { name: /접기/ })).toBeTruthy();
  });

  it('우상단 점 3개(⋮) 버튼을 누르면 전체 메뉴 화면이 열린다', () => {
    render(<MyLocalboxView />);

    const menuBtn = screen.getByLabelText('전체 메뉴 열기');
    fireEvent.click(menuBtn);

    expect(screen.getByText('로컬박스 관리')).toBeTruthy();
    expect(screen.getByText('콘텐츠 관리')).toBeTruthy();
  });

  it('동네소식(VILLAGE_NEWS) 콘텐츠를 누르면 상세 화면이 열리고 노출 동네 비율, 1/7 캐러셀, 위치 줄 및 지도 카드, 작성자 전용 메뉴가 동작한다', () => {
    render(<MyLocalboxView />);

    // 두 번째 동네소식(동영상 포함 7장 슬라이드) 클릭
    const videoPostTitle = screen.getByText(
      '황송공원 산책로 메타세쿼이아 길 바람 소리 영상'
    );
    fireEvent.click(videoPostTitle);

    // 노출 동네 비율 및 1/7 페이지 숫자, 동영상 남은 시간 00:29 확인
    expect(screen.getByText('삼동면 100%')).toBeTruthy();
    expect(screen.getByText('1/7')).toBeTruthy();
    expect(screen.getByText('00:29')).toBeTruthy();

    // 위치 줄 클릭 시 지도 카드 펼침 확인
    const locationBtn = screen.getByText('경남 남해군 삼동면 독일로 92');
    expect(locationBtn).toBeTruthy();
    fireEvent.click(locationBtn);
    expect(screen.getByText('OSM')).toBeTruthy();

    // 작성자 전용 더보기 메뉴 열기
    const authorMenuBtn = screen.getByLabelText('작성자 더보기 메뉴');
    fireEvent.click(authorMenuBtn);
    expect(screen.getByText('대표 콘텐츠로 고정')).toBeTruthy();
    expect(screen.getByText('삭제하기')).toBeTruthy();
  });

  it('주민소식(RESIDENT_NEWS) 콘텐츠 상세 화면은 행사 기간을 표시하고 위치·해시태그가 없으며 뒤로가기 시 탭과 보기 방식이 유지된다', () => {
    render(<MyLocalboxView />);

    // 주민 탭으로 이동 후 목록 보기로 전환
    const residentTab = screen.getByRole('button', { name: '주민' });
    fireEvent.click(residentTab);
    const listBtn = screen.getByLabelText('목록 보기');
    fireEvent.click(listBtn);

    // 첫 번째 주민소식 클릭
    const residentPost = screen.getByText(
      '[공모전] 2026 성남시 우리동네 골목기록 사진·영상 공모전 안내'
    );
    fireEvent.click(residentPost);

    // 작성자 2줄째에 행사 기간 표시 확인
    expect(screen.getByText('2026.10.05(월)~2026.10.20(화)')).toBeTruthy();
    // 위치 줄 없음 확인
    expect(screen.queryByText('경남 남해군 삼동면 독일로 92')).toBeNull();

    // 뒤로가기 클릭 후 주민 탭 + 목록 보기 상태 유지 확인
    const backBtns = screen.getAllByLabelText('뒤로가기');
    fireEvent.click(backBtns[backBtns.length - 1]);
    expect(screen.getAllByText('128회').length).toBeGreaterThan(0);
  });
});
