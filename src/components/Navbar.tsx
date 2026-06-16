import React from 'react';
import { Youtube, Sparkles, BookOpen, MessageSquare, Compass, Award, Sun, Moon, Globe } from 'lucide-react';

interface NavbarProps {
  currentTab: 'guides' | 'builder' | 'advisor' | 'adsense' | 'terms' | 'privacy' | 'guide-detail';
  setTab: (tab: 'guides' | 'builder' | 'advisor' | 'adsense' | 'terms' | 'privacy' | 'guide-detail') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab, theme, toggleTheme }) => {
  const isGuidesTabActive = currentTab === 'guides' || currentTab === 'guide-detail' || currentTab === 'terms' || currentTab === 'privacy';
  
  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
      theme === 'dark' 
        ? 'border-sky-955 bg-[#021321]/80 text-[#e0f2fe]' 
        : 'border-sky-100/80 bg-white/80 text-slate-850 shadow-sm'
    }`}>
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* 로고 영역 */}
        <div 
          onClick={() => setTab('guides')} 
          className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-90"
          id="logo-container"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 options to-sky-600 shadow-md shadow-sky-500/20">
            <Youtube className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <h1 className={`font-display text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-1 ${
              theme === 'dark' ? 'text-white' : 'text-[#011d33]'
            }`}>
              NuTube <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-500 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono">2026</span>
            </h1>
            <p className="text-[9px] text-slate-400 hidden sm:block">유튜브 알고리즘 & 수익화 최고 비서</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <nav className="flex items-center gap-1 sm:gap-2.5" id="main-nav">
          <button
            id="nav-btn-guides"
            onClick={() => setTab('guides')}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isGuidesTabActive
                ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-[#032841]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100/40'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">비책 가이드</span>
            <span className="inline sm:hidden">가이드</span>
          </button>

          <button
            id="nav-btn-builder"
            onClick={() => setTab('builder')}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'builder'
                ? 'bg-[#00b894]/10 text-[#00b894] border border-[#00b894]/20'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-[#032841]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100/40'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">원클릭 AI 빌더</span>
            <span className="inline sm:hidden">AI 빌더</span>
          </button>

          <button
            id="nav-btn-advisor"
            onClick={() => setTab('advisor')}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'advisor'
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-[#032841]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100/40'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI 컨설턴트</span>
            <span className="inline sm:hidden">상담실</span>
          </button>


        </nav>

        {/* 오른쪽 간이 지표 및 여름 테마 자동 전환 단추 */}
        <div className="flex items-center gap-2.5 text-xs font-mono">
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#032841] border-[#084875] text-amber-400 hover:bg-[#05385b]'
                : 'bg-[#e0f2fe] border-[#bae6fd] text-amber-500 hover:bg-[#bae6fd]'
            }`}
            title={theme === 'dark' ? '주간 시원한 해변 모드로 변환' : '야간 심해 블루 모드로 변환'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-sky-700" />}
          </button>

          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
              theme === 'dark' ? 'bg-[#032841] border-[#084875] text-slate-400' : 'bg-white border-sky-100 text-[#0984e3] shadow-xs'
            }`}>
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>Q2 알고점 탑재</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
              theme === 'dark' ? 'bg-[#032841] border-[#084875] text-slate-400' : 'bg-white border-sky-100 text-[#00b894] shadow-xs'
            }`}>
              <Award className="h-3.5 w-3.5 text-[#00b894] animate-pulse" />
              <span>Premium E-E-A-T</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
