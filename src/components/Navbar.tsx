import React, { useState } from 'react';
import { Search, Menu, X, Sun, Moon, FileText, Info, Mail } from 'lucide-react';

type Tab = 'guides' | 'about' | 'contact' | 'terms' | 'privacy' | 'guide-detail' | 'search-console';

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
  setCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const dark = theme === 'dark';

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
        ? 'sticky top-0 z-50 border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md text-white' 
        : 'sticky top-0 z-50 border-b border-slate-200 bg-[#0d1527] text-white shadow-sm'
      }>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Left: Brand Logo */}
          <button 
            type="button"
            onClick={handleLogoClick} 
            className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            id="nav-logo-btn"
          >
            <div className="flex items-center gap-1.5 font-impact text-xl sm:text-2xl tracking-tight leading-none">
              <span className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded font-black text-xs sm:text-sm border border-cyan-400/20">NOW</span>
              <span className="text-white font-black text-lg sm:text-2xl">크리에이터랩</span>
            </div>
          </button>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 font-subheading text-base font-bold">
            <button
              onClick={handleLogoClick}
              className={`transition-colors py-1 cursor-pointer ${
                currentTab === 'guides'
                  ? 'text-cyan-400 font-black border-b-2 border-cyan-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              가이드
            </button>
            <button
              onClick={() => handleNavTab('about')}
              className={`transition-colors py-1 cursor-pointer ${
                currentTab === 'about'
                  ? 'text-cyan-400 font-black border-b-2 border-cyan-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              소개
            </button>
            <button
              onClick={() => handleNavTab('contact')}
              className={`transition-colors py-1 cursor-pointer ${
                currentTab === 'contact'
                  ? 'text-cyan-400 font-black border-b-2 border-cyan-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              문의
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Inline Search Toggle */}
            <div className="relative flex items-center">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="가이드 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mr-1.5 w-28 sm:w-48 rounded-xl border border-cyan-500/40 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  autoFocus
                />
              )}
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-800 text-slate-200 cursor-pointer"
                title="검색"
                id="nav-search-toggle"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-800 text-amber-400 cursor-pointer"
              title="테마 전환"
              id="nav-theme-toggle"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-slate-200" />}
            </button>

            {/* Mobile Hamburger Drawer Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-800 text-slate-200 cursor-pointer"
              id="nav-drawer-toggle"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Hamburger Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
              onClick={() => setIsDrawerOpen(false)} 
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-xs transform transition-transform duration-300 ease-in-out bg-[#0c1527] text-white border-l border-slate-800">
                <div className="flex h-full flex-col overflow-y-auto py-6 shadow-2xl">
                  {/* Drawer Header */}
                  <div className="px-5 flex items-center justify-between border-b pb-4 border-slate-800">
                    <div className="flex items-center gap-1.5 font-impact text-lg">
                      <span className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded font-black">NOW</span>
                      <span className="text-white font-black">크리에이터랩</span>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-2 rounded-lg transition-colors hover:bg-slate-800 text-slate-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Drawer Nav Links */}
                  <div className="mt-6 flex-1 px-5 space-y-2">
                    <button
                      onClick={handleLogoClick}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-left hover:bg-slate-800 text-slate-200"
                    >
                      <FileText className="h-4 w-4 text-cyan-400" />
                      <span>가이드</span>
                    </button>

                    <button
                      onClick={() => handleNavTab('about')}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-left hover:bg-slate-800 text-slate-200"
                    >
                      <Info className="h-4 w-4 text-cyan-400" />
                      <span>소개</span>
                    </button>

                    <button
                      onClick={() => handleNavTab('contact')}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-left hover:bg-slate-800 text-slate-200"
                    >
                      <Mail className="h-4 w-4 text-cyan-400" />
                      <span>문의</span>
                    </button>
                  </div>

                  {/* Drawer Footer */}
                  <div className="px-5 border-t pt-4 border-slate-800 text-center">
                    <p className="text-[11px] text-slate-400">© 나우크리에이터랩 All rights reserved.</p>
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

