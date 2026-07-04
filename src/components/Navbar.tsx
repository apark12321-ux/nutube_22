import React from 'react';
import { BookOpen, Moon, Sun, Info, Mail, Clapperboard } from 'lucide-react';
import { SITE_DISPLAY_NAME } from '../brand';

type Tab = 'guides' | 'about' | 'contact' | 'terms' | 'privacy' | 'guide-detail';

interface NavbarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab, theme, toggleTheme }) => {
  const active = 'bg-sky-500/10 text-sky-500 border border-sky-500/20';
  const idle = theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-[#032841]' : 'text-slate-600 hover:text-slate-900 hover:bg-sky-100/60';
  const guideActive = ['guides', 'guide-detail'].includes(currentTab);

  return (
    <header className={theme === 'dark' ? 'sticky top-0 z-50 border-b border-sky-950 bg-[#021321]/85 backdrop-blur-md' : 'sticky top-0 z-50 border-b border-sky-100 bg-white/90 backdrop-blur-md shadow-sm'}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <button onClick={() => setTab('guides')} className="flex items-center gap-2 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 shadow-md shadow-sky-500/20">
            <Clapperboard className="h-5 w-5 text-white" />
          </span>
          <span>
            <span className={theme === 'dark' ? 'block font-display text-base font-extrabold text-white sm:text-lg' : 'block font-display text-base font-extrabold text-slate-900 sm:text-lg'}>{SITE_DISPLAY_NAME}</span>
            <span className="hidden text-[10px] text-slate-400 sm:block">크리에이터 채널 성장 실전 가이드</span>
          </span>
        </button>

        <nav className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => setTab('guides')} className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold sm:text-sm ${guideActive ? active : idle}`}>
            <BookOpen className="h-3.5 w-3.5" />
            <span>가이드</span>
          </button>
          <button onClick={() => setTab('about')} className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold sm:text-sm ${currentTab === 'about' ? active : idle}`}>
            <Info className="h-3.5 w-3.5" />
            <span>소개</span>
          </button>
          <button onClick={() => setTab('contact')} className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold sm:text-sm ${currentTab === 'contact' ? active : idle}`}>
            <Mail className="h-3.5 w-3.5" />
            <span>문의</span>
          </button>
        </nav>

        <button onClick={toggleTheme} className={theme === 'dark' ? 'rounded-xl border border-sky-900 bg-[#032841] p-2 text-amber-400' : 'rounded-xl border border-sky-100 bg-sky-50 p-2 text-sky-700'}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
