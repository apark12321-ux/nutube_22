import React, { useState } from 'react';
import { Search, Menu, X, Sun, Moon, HelpCircle, FileText, Info, Mail, Sparkles } from 'lucide-react';
import { SITE_DISPLAY_NAME } from '../brand';

type Tab = 'guides' | 'about' | 'contact' | 'terms' | 'privacy' | 'guide-detail';

interface NavbarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  theme,
  toggleTheme,
  category,
  setCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const dark = theme === 'dark';

  const categories = [
    { key: null, label: '콘텐츠' },
    { key: 'youtube', label: '유튜브 수익화' },
    { key: 'instagram', label: '인스타그램 수익화' },
    { key: 'tiktok', label: '틱톡 수익화' },
    { key: 'blog', label: '블로그 & 애드센스' },
    { key: 'digital_biz', label: '지식창업 & 뉴스레터' },
  ];

  const handleCategoryClick = (catKey: string | null) => {
    setCategory(catKey);
    setIsDrawerOpen(false);
  };

  const handleNavTab = (tab: Tab) => {
    setTab(tab);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setCategory(null);
    setTab('guides');
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={dark 
        ? 'sticky top-0 z-50 border-b border-[#2d1b4e] bg-[#0c051a]/95 backdrop-blur-md text-white' 
        : 'sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md text-slate-900 shadow-sm'
      }>
        {/* Top Navbar Row */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo styled like '요즘IT' */}
          <button 
            type="button"
            onClick={handleLogoClick} 
            className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer"
            id="nav-logo-btn"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/20 text-white font-black text-lg">
              N
            </span>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-extrabold text-[#7C3AED] text-[18px] tracking-tight">나우</span>
                <span className={dark ? 'font-extrabold text-white text-[18px] tracking-tight' : 'font-extrabold text-slate-900 text-[18px] tracking-tight'}>크리에이터랩</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium leading-none tracking-tight">IT 기반 유튜브 성장 가이드</span>
            </div>
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Inline Search Bar on wide screens or toggleable on mobile */}
            <div className="relative flex items-center">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="가이드 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={dark
                    ? 'mr-2 w-40 sm:w-60 rounded-full border border-purple-900 bg-[#160b2d] px-4 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500'
                    : 'mr-2 w-40 sm:w-60 rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500'
                  }
                  autoFocus
                />
              )}
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-purple-950/40 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                title="검색 토글"
                id="nav-search-toggle"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* "제휴 및 문의" pill button */}
            <button
              onClick={() => handleNavTab('contact')}
              className={`hidden sm:inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                dark 
                  ? 'border-purple-900 text-purple-300 hover:bg-purple-950/30' 
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm'
              }`}
              id="nav-ad-btn"
            >
              <span>제휴 및 문의</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                dark ? 'hover:bg-purple-950/40 text-amber-400' : 'hover:bg-slate-100 text-[#7C3AED]'
              }`}
              title="테마 전환"
              id="nav-theme-toggle"
            >
              {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Hamburger Menu Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                dark ? 'hover:bg-purple-950/40 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
              id="nav-drawer-toggle"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs row: Sticky Category Bar */}
        <div className={`border-t ${dark ? 'border-[#2d1b4e]/60 bg-[#0e071e]' : 'border-slate-100 bg-white'}`}>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-11 items-center overflow-x-auto scrollbar-none gap-6 sm:gap-8 px-2">
              {categories.map((cat) => {
                const isSelected = currentTab === 'guides' && category === cat.key;
                return (
                  <button
                    key={cat.key === null ? 'all' : cat.key}
                    onClick={() => handleCategoryClick(cat.key)}
                    className={`relative h-full shrink-0 flex items-center text-[13.5px] font-bold transition-all px-0.5 cursor-pointer ${
                      isSelected
                        ? dark
                          ? 'text-purple-400 font-extrabold'
                          : 'text-[#7C3AED] font-extrabold'
                        : dark
                          ? 'text-slate-400 hover:text-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {/* Active Bottom Line */}
                    {isSelected && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-[#7C3AED]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-over Hamburger Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity" 
              onClick={() => setIsDrawerOpen(false)} 
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className={`pointer-events-auto w-screen max-w-xs transform transition-transform duration-300 ease-in-out ${
                dark ? 'bg-[#0c051a] text-white border-l border-purple-900' : 'bg-white text-slate-900'
              }`}>
                <div className="flex h-full flex-col overflow-y-auto py-6 shadow-2xl">
                  {/* Drawer Header */}
                  <div className="px-5 flex items-center justify-between border-b pb-4 border-slate-100 dark:border-purple-950">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-xs">
                        N
                      </span>
                      <span className="font-extrabold text-[#7C3AED] text-sm">나우크리에이터랩</span>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-purple-950 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Drawer Nav Links */}
                  <div className="mt-6 flex-1 px-5 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-purple-400">메뉴 목록</p>
                    <nav className="space-y-1.5">
                      <button
                        onClick={() => handleNavTab('guides')}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                          currentTab === 'guides' 
                            ? 'bg-purple-500/10 text-[#7C3AED]' 
                            : dark ? 'hover:bg-purple-950/30 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span>가이드 및 콘텐츠</span>
                      </button>

                      <button
                        onClick={() => handleNavTab('about')}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                          currentTab === 'about' 
                            ? 'bg-purple-500/10 text-[#7C3AED]' 
                            : dark ? 'hover:bg-purple-950/30 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Info className="h-4 w-4 shrink-0" />
                        <span>크리에이터랩 소개</span>
                      </button>

                      <button
                        onClick={() => handleNavTab('contact')}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                          currentTab === 'contact' 
                            ? 'bg-purple-500/10 text-[#7C3AED]' 
                            : dark ? 'hover:bg-purple-950/30 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        <span>제휴 제안 & 문의</span>
                      </button>
                    </nav>

                    <div className="border-t pt-4 border-slate-100 dark:border-purple-950 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-purple-400">법적 고지</p>
                      <button 
                        type="button"
                        onClick={() => handleNavTab('terms')}
                        className={`w-full block text-left text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors ${
                          currentTab === 'terms'
                            ? 'bg-purple-500/10 text-[#7C3AED] font-bold'
                            : dark 
                              ? 'text-slate-400 hover:text-white hover:bg-purple-950/20' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        이용약관
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleNavTab('privacy')}
                        className={`w-full block text-left text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors ${
                          currentTab === 'privacy'
                            ? 'bg-purple-500/10 text-[#7C3AED] font-bold'
                            : dark 
                              ? 'text-slate-400 hover:text-white hover:bg-purple-950/20' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        개인정보처리방침
                      </button>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="px-5 border-t pt-4 border-slate-100 dark:border-purple-950 text-center">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">© 나우크리에이터랩 All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
