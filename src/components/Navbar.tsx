import React, { useState } from 'react';
import { Search, Menu, X, Sun, Moon, BookOpen, User, Shield, HelpCircle, FileText } from 'lucide-react';
import { GuidePost } from '../types';
import { CATEGORIES_LIST } from '../data';

type Tab = 'guides' | 'about' | 'terms' | 'privacy' | 'guide-detail';

interface NavbarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  posts?: GuidePost[];
  onSelectPost?: (post: GuidePost) => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const dark = theme === 'dark';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCategory(null);
    setTab('guides');
    setMobileMenuOpen(false);
  };

  const handleNavCategory = (catKey: string | null) => {
    setCategory(catKey);
    setSearchQuery('');
    setLocalSearch('');
    setMobileMenuOpen(false);
  };

  const handleNavTab = (tab: Tab) => {
    setTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`border-b sticky top-0 z-40 transition-colors ${
      dark ? 'bg-slate-900/98 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* 1. Main Navigation Bar (phongnhaexplorer clean style) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Site Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavCategory(null)}
              className="flex items-center text-left group cursor-pointer focus:outline-none"
              aria-label="NuTube 홈으로 이동"
            >
              <img
                src={dark ? "/nutube-brand-dark.svg" : "/nutube-brand-light.svg"}
                alt="NuTube - 너와 나의 1인 미디어 성장 노트"
                className="h-9 sm:h-10 w-auto object-contain shrink-0 group-hover:scale-[1.02] transition-transform"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          {/* Center/Right: Category Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => handleNavCategory(null)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'guides' && category === null
                  ? dark ? 'bg-blue-950 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold'
                  : dark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              홈
            </button>

            {CATEGORIES_LIST.map((cat) => {
              const isSelected = currentTab === 'guides' && category === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleNavCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? dark ? 'bg-blue-950 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold'
                      : dark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.shortLabel || cat.label}
                </button>
              );
            })}

            <button
              onClick={() => handleNavTab('about')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'about'
                  ? dark ? 'bg-blue-950 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold'
                  : dark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              소개
            </button>
          </nav>

          {/* Right Side: Search Form & Theme Switch */}
          <div className="flex items-center gap-2.5">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
              <input
                type="text"
                placeholder="가이드 & 질문 검색..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className={`w-40 md:w-52 text-xs pl-8 pr-3 py-1.5 rounded-lg border transition-colors outline-none focus:ring-1 focus:ring-blue-500 ${
                  dark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                dark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
              aria-label="화면 모드 전환"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg border cursor-pointer ${
                dark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category sub-navigation bar for tablet & mobile */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => handleNavCategory(null)}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'guides' && category === null
                ? dark ? 'bg-blue-950 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold'
                : dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            전체
          </button>
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = currentTab === 'guides' && category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleNavCategory(cat.key)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? dark ? 'bg-blue-950 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold'
                    : dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {cat.shortLabel || cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className={`sm:hidden border-t px-4 py-4 space-y-4 ${
          dark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              placeholder="블로그 내 검색..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={`w-full text-xs pl-8 pr-3 py-2 rounded-lg border outline-none ${
                dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
          </form>

          {/* Mobile Categories */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              카테고리
            </p>
            <button
              onClick={() => handleNavCategory(null)}
              className="w-full text-left py-2 px-2 text-xs font-semibold rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              전체 글 보기
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleNavCategory(cat.key)}
                className="w-full text-left py-2 px-2 text-xs font-medium rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                └ {cat.label}
              </button>
            ))}
          </div>

          {/* Mobile Info Links */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              블로그 정보
            </p>
            <button
              onClick={() => handleNavTab('about')}
              className="w-full text-left py-1.5 px-2 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              블로그 소개 (민우)
            </button>
            <button
              onClick={() => handleNavTab('terms')}
              className="w-full text-left py-1.5 px-2 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              이용약관 & 면책조항
            </button>
            <button
              onClick={() => handleNavTab('privacy')}
              className="w-full text-left py-1.5 px-2 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              개인정보처리방침
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
