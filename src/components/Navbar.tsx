import React from 'react';
import { Youtube, Sparkles, BookOpen, MessageSquare, Compass, Award } from 'lucide-react';

interface NavbarProps {
  currentTab: 'guides' | 'builder' | 'advisor' | 'adsense';
  setTab: (tab: 'guides' | 'builder' | 'advisor' | 'adsense') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 로고 영역 */}
        <div 
          onClick={() => setTab('guides')} 
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          id="logo-container"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20">
            <Youtube className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl flex items-center gap-1">
              NuTube <span className="text-xs font-semibold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 font-mono">2026</span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">유튜브 알고리즘 & 수익화 최고 비서</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <nav className="flex items-center gap-1 sm:gap-2.5" id="main-nav">
          <button
            id="nav-btn-guides"
            onClick={() => setTab('guides')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'guides'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">비책 가이드</span>
            <span className="inline sm:hidden font-bold">가이드</span>
          </button>

          <button
            id="nav-btn-builder"
            onClick={() => setTab('builder')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'builder'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">원클릭 AI 빌더</span>
            <span className="inline sm:hidden font-bold">AI 빌더</span>
          </button>

          <button
            id="nav-btn-advisor"
            onClick={() => setTab('advisor')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'advisor'
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI 컨설턴트</span>
            <span className="inline sm:hidden font-bold">상담실</span>
          </button>

          <button
            id="nav-btn-adsense"
            onClick={() => setTab('adsense')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all relative ${
              currentTab === 'adsense'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow'
                : 'bg-rose-505/5 text-rose-400/90 hover:text-white hover:bg-rose-500/10 border border-rose-500/10'
            }`}
          >
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="hidden sm:inline">애드센스 재승인</span>
            <span className="inline sm:hidden">SOS</span>
          </button>
        </nav>


        {/* 오른쪽 간이 지표 */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <Compass className="h-3.5 w-3.5 text-blue-400" />
            <span>Q2 알고리즘 수립 완료</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <Award className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Premium E-E-A-T</span>
          </div>
        </div>

      </div>
    </header>
  );
};
