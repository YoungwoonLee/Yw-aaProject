import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { login } from '../api/mock';

interface LoginViewProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onShowToast: (msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onBack,
  onLoginSuccess,
  onShowToast,
}) => {
  const [username, setUsername] = useState('test01');
  const [password, setPassword] = useState('1234');
  const [autoLogin, setAutoLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('아이디를 입력해주세요.');
      return;
    }
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    const res = login(username, password);
    if (res.success) {
      onShowToast(`${res.user?.nickname}님, 환영합니다!`);
      onLoginSuccess();
    } else {
      setErrorMessage(res.error || '로그인에 실패했습니다.');
    }
  };

  const handleSocialClick = (provider: string) => {
    onShowToast('데모에서는 지원하지 않습니다.');
  };

  return (
    <div className="bg-white min-h-screen pb-10 select-none flex flex-col">
      {/* Header: 뒤로가기 + 중앙 로고 (30x30 mint circle + "온닫이") */}
      <div className="sticky top-0 z-10 bg-white min-h-[52px] px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:bg-[#F3F4F6] rounded-full cursor-pointer"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.2} />
        </button>

        <div className="flex items-center gap-1.5 pr-6">
          <div
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-extrabold text-[15px]"
            style={{ backgroundColor: '#00B4C5' }}
          >
            온
          </div>
          <span className="font-extrabold text-[17px] text-[#1E293B]">온닫이</span>
        </div>

        <div className="w-5" />
      </div>

      {/* Main Container: padding 32px 16px, gap 24px */}
      <div className="px-4 py-8 flex flex-col gap-6 flex-1 max-w-[400px] mx-auto w-full">
        {/* Intro text */}
        <div>
          <h2 className="text-[22px] font-extrabold text-[#111827] leading-snug whitespace-pre-line">
            오늘도 다양한 <span style={{ color: '#00B4C5' }}>동네이야기</span>들이{'\n'}기다리고 있어요!
          </h2>
          <p className="text-[13px] text-[#64748B] mt-2">
            이웃과 함께 나누는 우리 마을 아카이브
          </p>
        </div>

        {/* Demo Hint Banner */}
        <div className="p-3 bg-[#EBFBFC] rounded-[10px] border border-[#00B4C5]/30 text-[12px] text-[#00A7B4]">
          <span className="font-bold">💡 데모 계정:</span> 아이디 <span className="font-mono font-bold text-[#0F172A]">test01</span> / 비밀번호 <span className="font-mono font-bold text-[#0F172A]">1234</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage('');
              }}
              placeholder="아이디"
              className="w-full text-[14px] outline-none transition-colors focus:border-[#00B4C5]"
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #E5E7EB',
              }}
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              placeholder="비밀번호"
              className="w-full text-[14px] outline-none transition-colors focus:border-[#00B4C5]"
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #E5E7EB',
              }}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-[12px] font-semibold text-[#EF4444] px-1">
              {errorMessage}
            </div>
          )}

          {/* Auto Login Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="autoLogin"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
              className="w-4 h-4 accent-[#00B4C5] rounded cursor-pointer"
            />
            <label
              htmlFor="autoLogin"
              className="text-[13px] text-[#475569] cursor-pointer"
            >
              자동 로그인
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-[12px] text-white font-extrabold text-[15px] cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.99] mt-2 shadow-sm"
            style={{ backgroundColor: '#00B4C5' }}
          >
            로그인
          </button>
        </form>

        {/* Links Row: 아이디 찾기 | 비밀번호 찾기 | 회원가입 */}
        <div className="flex items-center justify-center gap-3 text-[13px] text-[#6B7280]">
          <button
            type="button"
            onClick={() => onShowToast('아이디 찾기')}
            className="hover:text-[#111827] cursor-pointer"
          >
            아이디 찾기
          </button>
          <span className="w-[1px] h-[12px] bg-[#B3B3B3]" />
          <button
            type="button"
            onClick={() => onShowToast('비밀번호 찾기')}
            className="hover:text-[#111827] cursor-pointer"
          >
            비밀번호 찾기
          </button>
          <span className="w-[1px] h-[12px] bg-[#B3B3B3]" />
          <button
            type="button"
            onClick={() => onShowToast('회원가입은 데모 계정을 이용해주세요.')}
            className="hover:text-[#111827] cursor-pointer font-bold text-[#00B4C5]"
          >
            회원가입
          </button>
        </div>

        {/* Social Login Section */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#EEEEEE]" />
            <span className="text-[12px] text-[#9CA3AF]">소셜 아이디로 간편 로그인</span>
            <div className="flex-1 h-[1px] bg-[#EEEEEE]" />
          </div>

          {/* Social Circle Buttons: KAKAO(#FEE500), NAVER(Green), GOOGLE, APPLE */}
          <div className="flex items-center gap-3.5">
            {/* KAKAO */}
            <button
              type="button"
              onClick={() => handleSocialClick('kakao')}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs hover:opacity-90"
              style={{ backgroundColor: '#FEE500', color: '#181600' }}
              aria-label="카카오 로그인"
            >
              💬
            </button>

            {/* NAVER */}
            <button
              type="button"
              onClick={() => handleSocialClick('naver')}
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs text-white hover:opacity-90"
              style={{ backgroundColor: '#03C75A' }}
              aria-label="네이버 로그인"
            >
              N
            </button>

            {/* GOOGLE */}
            <button
              type="button"
              onClick={() => handleSocialClick('google')}
              className="w-11 h-11 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs hover:bg-[#F9FAFB]"
              aria-label="구글 로그인"
            >
              G
            </button>

            {/* APPLE */}
            <button
              type="button"
              onClick={() => handleSocialClick('apple')}
              className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs hover:opacity-90"
              aria-label="애플 로그인"
            >
              
            </button>
          </div>

          <p className="text-[11px] text-[#94A3B8] text-center leading-relaxed">
            담당자의 소셜로그인 계정으로 로그인 시,{'\n'}자동으로 온닫이 계정을 찾을 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
};
