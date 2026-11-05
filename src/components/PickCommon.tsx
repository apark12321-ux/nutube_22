import React, { useEffect, useState } from 'react';
import { SITE_DISPLAY_NAME } from '../brand';

// 픽 시리즈 공통: 첫 접속 인트로 화면 (세션당 1회)
export const IntroSplash: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('nutube-intro-shown')) return;
      sessionStorage.setItem('nutube-intro-shown', '1');
    } catch {
      return;
    }
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1500);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1e3a8a] text-white"
      style={{ animation: 'nutubeIntroFade 1.5s ease forwards' }}
      aria-hidden="true"
    >
      <style>{`@keyframes nutubeIntroFade{0%{opacity:1}75%{opacity:1}100%{opacity:0;visibility:hidden}}`}</style>
      <p className="text-5xl sm:text-6xl font-black tracking-tight">{SITE_DISPLAY_NAME}</p>
      <p className="mt-3 text-sm sm:text-base text-blue-100 tracking-wide">유튜브 운영 도구와 가이드</p>
      <img src="/pyj-mark-white.svg" alt="PYJ 픽스컴퍼니" className="absolute bottom-10 h-24 w-auto opacity-90" />
    </div>
  );
};

// 픽 시리즈 공통 푸터 (모든 픽 사이트 동일 적용)
export const PickFooter: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    className={`border-t py-6 text-sm ${
      dark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
    }`}
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src={dark ? '/pyj-mark-white.svg' : '/pyj-mark-black.svg'} alt="PYJ 픽스컴퍼니" className="h-14 w-auto" />
        <div className="leading-relaxed">
          <p className={`font-bold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>픽 시리즈 · 유튜브 도구 허브</p>
          <p>운영 제니스앤코 · 광고는 정액 광고만 게재합니다.</p>
        </div>
      </div>
      <a href="/tools" className="font-semibold hover:text-blue-600 transition-colors">
        유튜브 도구 전체 보기
      </a>
    </div>
  </div>
);

// SSR(사전 렌더링)용 공통 푸터 HTML
export const renderPickFooterHtml = () => `
  <div class="border-t border-slate-200 bg-slate-50 text-slate-500 py-6 text-sm">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="/pyj-mark-black.svg" alt="PYJ 픽스컴퍼니" class="h-14 w-auto" />
        <div class="leading-relaxed">
          <p class="font-bold text-slate-700">픽 시리즈 · 유튜브 도구 허브</p>
          <p>운영 제니스앤코 · 광고는 정액 광고만 게재합니다.</p>
        </div>
      </div>
      <a href="/tools" class="font-semibold hover:text-blue-600 transition-colors">유튜브 도구 전체 보기</a>
    </div>
  </div>
`;
