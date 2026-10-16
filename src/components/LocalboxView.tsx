import React, { useState } from 'react';
import { MoreVertical, Grid, List, X, Edit3, Share2, UserCheck, BarChart2, MapPin, Bell, ShieldBan, Bookmark, Archive, FileText, HelpCircle, Settings, LogOut } from 'lucide-react';
import { User, VillageFeed, ResidentFeed, SiotProgram } from '../types';
import { getVillageFeeds, getResidentFeeds, getSiotPrograms, logout } from '../api/mock';

interface LocalboxViewProps {
  user: User;
  onSelectFeed: (feedId: number) => void;
  onSelectSiot: (programId: number) => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
}

type LocalboxTab = '홈' | '주민' | '시옷' | '소개';

export const LocalboxView: React.FC<LocalboxViewProps> = ({
  user,
  onSelectFeed,
  onSelectSiot,
  onLogout,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<LocalboxTab>('홈');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const villageFeeds = getVillageFeeds().filter((f) => f.userId === user.id || true).slice(0, 6);
  const residentFeeds = getResidentFeeds().slice(0, 3);
  const siotPrograms = getSiotPrograms().slice(0, 3);

  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <div className="bg-white min-h-screen pb-[90px] select-none relative">
      {/* Header: Nickname 18px/700 + Right "⋮" */}
      <div className="sticky top-0 z-10 bg-white min-h-[52px] px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-[#1E293B]">{user.nickname}</h1>
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="p-1 hover:bg-[#F3F4F6] rounded-full transition-colors cursor-pointer"
          aria-label="메뉴 열기"
        >
          <MoreVertical size={20} color="#64748B" />
        </button>
      </div>

      {/* Profile Row: Avatar 64px / 콘텐츠 {n} · 팔로워 85 / "편집" button */}
      <div className="p-4 flex items-center gap-4">
        {/* Avatar 64px */}
        <div
          className="w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: '#00A7B4' }}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.nickname} className="w-full h-full object-cover" />
          ) : (
            <span>{user.nickname.charAt(0)}</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="block text-[16px] font-extrabold text-[#1E293B]">
                {user.postCount || 14}
              </span>
              <span className="text-[12px] text-[#64748B]">콘텐츠</span>
            </div>
            <div className="text-center">
              <span className="block text-[16px] font-extrabold text-[#1E293B]">
                {user.followersCount || 85}
              </span>
              <span className="text-[12px] text-[#64748B]">팔로워</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onShowToast('프로필 편집 기능은 데모에서 읽기 전용입니다.')}
          className="px-3.5 py-1.5 rounded-[12px] border border-[#E5E7EB] text-[12px] font-bold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
        >
          편집
        </button>
      </div>

      {/* Region Row & Share Bar */}
      <div className="px-4 pb-3">
        <div className="text-[12px] text-[#64748B] mb-2 flex items-center justify-between">
          <span className="font-semibold text-[#1E293B]">{user.regionText}</span>
          <span className="text-[11px] text-[#94A3B8]">오늘 2</span>
        </div>

        {/* Region Share Bar: height 6px, left->right 40% #00B4C5 / 30% #3B82F6 / 30% #9CA3AF */}
        <div className="w-full h-[6px] rounded-full overflow-hidden flex bg-[#EEEEEE]">
          <div className="h-full bg-[#00B4C5]" style={{ width: '40%' }} />
          <div className="h-full bg-[#3B82F6]" style={{ width: '30%' }} />
          <div className="h-full bg-[#9CA3AF]" style={{ width: '30%' }} />
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#94A3B8] mt-1">
          <span>{user.villageName}</span>
          <span>점유율 40%</span>
        </div>
      </div>

      {/* Tabs & View Toggle */}
      <div className="px-4 border-b border-[#F3F4F6] flex items-center justify-between">
        <div className="flex gap-5">
          {(['홈', '주민', '시옷', '소개'] as LocalboxTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 text-[14px] cursor-pointer font-bold relative transition-colors ${
                  isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'
                }`}
              >
                {tab === '시옷' ? '시옷(예약)' : tab}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111827]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid / List Mode Toggle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded cursor-pointer ${
              viewMode === 'grid' ? 'text-[#111827]' : 'text-[#9CA3AF]'
            }`}
            aria-label="그리드 뷰"
          >
            <Grid size={17} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded cursor-pointer ${
              viewMode === 'list' ? 'text-[#111827]' : 'text-[#9CA3AF]'
            }`}
            aria-label="리스트 뷰"
          >
            <List size={17} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {/* TAB 1: Home (Village Feeds) */}
        {activeTab === '홈' && (
          <div>
            {viewMode === 'grid' ? (
              /* Grid Mode: 2 columns, gap 8px, square thumbnails, badge */
              <div className="grid grid-cols-2 gap-2">
                {villageFeeds.map((feed) => (
                  <div
                    key={feed.id}
                    onClick={() => onSelectFeed(feed.id)}
                    className="aspect-square relative rounded-[10px] overflow-hidden bg-[#F8FAFC] cursor-pointer group"
                  >
                    <img
                      src={feed.imageUrls[0]}
                      alt={feed.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Type badge: 동네이야기 #00B4C5 */}
                    <span
                      className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#00B4C5' }}
                    >
                      동네이야기
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-[12px] font-bold truncate">{feed.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Mode: 72px thumbnail */
              <div className="flex flex-col gap-3">
                {villageFeeds.map((feed) => (
                  <div
                    key={feed.id}
                    onClick={() => onSelectFeed(feed.id)}
                    className="flex gap-3 items-center p-2 rounded-[10px] border border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB]"
                  >
                    <img
                      src={feed.imageUrls[0]}
                      alt={feed.title}
                      className="w-[72px] h-[72px] object-cover rounded-[8px] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full inline-block mb-1"
                        style={{ backgroundColor: '#00B4C5' }}
                      >
                        동네이야기
                      </span>
                      <h4 className="text-[13px] font-bold text-[#1E293B] truncate">{feed.title}</h4>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">{feed.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Resident News */}
        {activeTab === '주민' && (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-2">
                {residentFeeds.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square relative rounded-[10px] overflow-hidden bg-[#F8FAFC] cursor-pointer"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span
                      className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#10B981' }}
                    >
                      주민소식
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-[12px] font-bold truncate">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {residentFeeds.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center p-2 rounded-[10px] border border-[#F3F4F6]"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-[72px] h-[72px] object-cover rounded-[8px] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full inline-block mb-1"
                        style={{ backgroundColor: '#10B981' }}
                      >
                        주민소식
                      </span>
                      <h4 className="text-[13px] font-bold text-[#1E293B] truncate">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Siot */}
        {activeTab === '시옷' && (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-2">
                {siotPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => onSelectSiot(prog.id)}
                    className="aspect-square relative rounded-[10px] overflow-hidden bg-[#F8FAFC] cursor-pointer"
                  >
                    <img src={prog.thumbnailUrl} alt={prog.title} className="w-full h-full object-cover" />
                    <span
                      className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#7C3AED' }}
                    >
                      시옷(예약)
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-[12px] font-bold truncate">{prog.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {siotPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => onSelectSiot(prog.id)}
                    className="flex gap-3 items-center p-2 rounded-[10px] border border-[#F3F4F6] cursor-pointer"
                  >
                    <img
                      src={prog.thumbnailUrl}
                      alt={prog.title}
                      className="w-[72px] h-[72px] object-cover rounded-[8px] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full inline-block mb-1"
                        style={{ backgroundColor: '#7C3AED' }}
                      >
                        시옷(예약)
                      </span>
                      <h4 className="text-[13px] font-bold text-[#1E293B] truncate">{prog.title}</h4>
                      <p className="text-[11px] text-[#7C3AED] font-semibold mt-0.5">
                        잔여 {prog.availableSeats}석
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Intro */}
        {activeTab === '소개' && (
          <div className="p-4 bg-[#F8FAFC] rounded-[14px] border border-[#EEEEEE] text-[13px] text-[#475569] leading-relaxed">
            <h4 className="font-bold text-[#1E293B] mb-2">로컬박스 채널 소개</h4>
            <p>
              안녕하세요, 우리 동네 이야기와 다양한 원데이 클래스, 주민 참여 소식을 함께 기록하고 나누는 공간입니다.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-[12px] text-[#64748B]">
              <div>활동 동네: <span className="font-bold text-[#00B4C5]">{user.villageName}</span></div>
              <div className="mt-1">가입일: 2026.01.15</div>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen Slide Menu ("⋮") */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="w-[300px] h-full bg-white flex flex-col overflow-y-auto p-5 animate-fadeIn">
            {/* Menu Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
              <span className="font-extrabold text-[16px] text-[#1E293B]">메뉴</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Section 1: 내 계정 */}
            <div className="py-4 border-b border-[#F3F4F6]">
              <h5 className="text-[11px] font-bold text-[#94A3B8] mb-2">내 계정</h5>
              <div className="flex flex-col gap-1 text-[13px] text-[#374151]">
                <button
                  type="button"
                  onClick={() => onShowToast('공유 링크가 클립보드에 복사되었습니다.')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EBFBFC] flex items-center justify-center text-sm">🔗</div>
                  <span>공유하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('회원 정보 화면입니다.')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EBFBFC] flex items-center justify-center text-sm">👤</div>
                  <span>회원 정보</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('동네 인사이트 분석 준비 중')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EBFBFC] flex items-center justify-center text-sm">📊</div>
                  <span>인사이트</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('동네 설정')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EBFBFC] flex items-center justify-center text-sm">📍</div>
                  <span>동네 설정</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('주민소식 구독 완료')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EBFBFC] flex items-center justify-center text-sm">🔔</div>
                  <span>주민소식 구독</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('차단된 사용자가 없습니다.')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EBFBFC] flex items-center justify-center text-sm">🚫</div>
                  <span>차단 사용자</span>
                </button>
              </div>
            </div>

            {/* Section 2: 콘텐츠 관리 */}
            <div className="py-4 border-b border-[#F3F4F6]">
              <h5 className="text-[11px] font-bold text-[#94A3B8] mb-2">콘텐츠 관리</h5>
              <div className="flex flex-col gap-1 text-[13px] text-[#374151]">
                <button
                  type="button"
                  onClick={() => onShowToast('북마크한 목록입니다.')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-sm">🔖</div>
                  <span>북마크</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('보관함 목록입니다.')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-sm">📦</div>
                  <span>보관함</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('주민소식 붙이기')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-sm">📌</div>
                  <span>주민소식 붙이기</span>
                </button>
              </div>
            </div>

            {/* Section 3: 서비스 이용 */}
            <div className="py-4 border-b border-[#F3F4F6]">
              <h5 className="text-[11px] font-bold text-[#94A3B8] mb-2">서비스 이용</h5>
              <div className="flex flex-col gap-1 text-[13px] text-[#374151]">
                <button
                  type="button"
                  onClick={() => onShowToast('최신 공지사항이 없습니다.')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-sm">📢</div>
                  <span>공지사항</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('고객센터: 1544-0000')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-sm">💬</div>
                  <span>고객센터</span>
                </button>
              </div>
            </div>

            {/* Section 4: 앱 설정 */}
            <div className="py-4 border-b border-[#F3F4F6]">
              <h5 className="text-[11px] font-bold text-[#94A3B8] mb-2">앱 설정</h5>
              <div className="flex flex-col gap-1 text-[13px] text-[#374151]">
                <button
                  type="button"
                  onClick={() => onShowToast('앱 설정')}
                  className="flex items-center gap-3 py-2 text-left hover:text-[#00B4C5] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-sm">⚙️</div>
                  <span>설정</span>
                </button>
              </div>
            </div>

            {/* Logout Button (Works! Removes session and goes to feed) */}
            <div className="pt-4 pb-6 mt-auto">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#FEE2E2] text-[#EF4444] rounded-[10px] font-bold text-[13px] cursor-pointer hover:bg-red-200 transition-colors"
              >
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
