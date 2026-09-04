import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Menu, X, Sun, Moon, FileText, Info, Tag, ChevronRight, CornerDownLeft, ExternalLink } from 'lucide-react';
import { GuidePost } from '../types';

type Tab = 'guides' | 'about' | 'terms' | 'privacy' | 'guide-detail' | 'search-console';

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

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase().trim() ? (
          <mark key={i} className="bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  theme,
  toggleTheme,
  setCategory,
  searchQuery,
  setSearchQuery,
  posts = [],
  onSelectPost,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dark = theme === 'dark';
  const cleanQuery = searchQuery.trim().toLowerCase();

  // Calculate search suggestions
  const { matchingPosts, matchingTags, totalMatches } = useMemo(() => {
    if (!cleanQuery || posts.length === 0) {
      return { matchingPosts: [], matchingTags: [], totalMatches: 0 };
    }

    // 1. Filter and score matching posts
    const matched = posts.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(cleanQuery);
      const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(cleanQuery));
      const subMatch = p.subtitle?.toLowerCase().includes(cleanQuery) || p.summary?.toLowerCase().includes(cleanQuery);
      return titleMatch || tagMatch || subMatch;
    });

    matched.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aStarts = aTitle.startsWith(cleanQuery);
      const bStarts = bTitle.startsWith(cleanQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    // 2. Extract unique matching tags
    const tagSet = new Set<string>();
    posts.forEach((p) => {
      p.tags?.forEach((t) => {
        if (t.toLowerCase().includes(cleanQuery)) {
          tagSet.add(t);
        }
      });
    });

    return {
      matchingPosts: matched.slice(0, 5),
      matchingTags: Array.from(tagSet).slice(0, 4),
      totalMatches: matched.length,
    };
  }, [cleanQuery, posts]);

  const isDropdownVisible = isSearchFocused && cleanQuery.length > 0;

  // Handle outside click to close suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleNavTab = (tab: Tab) => {
    setTab(tab);
    setIsDrawerOpen(false);
    setIsSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setCategory(null);
    setSearchQuery('');
    setTab('guides');
    setIsDrawerOpen(false);
    setIsSearchFocused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPostItem = (selectedPost: GuidePost) => {
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    setIsDrawerOpen(false);
    if (onSelectPost) {
      onSelectPost(selectedPost);
    } else {
      setTab('guide-detail');
    }
  };

  const handleSelectTag = (tag: string) => {
    setSearchQuery(tag);
    setCategory(null);
    setTab('guides');
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    setIsDrawerOpen(false);
    scrollToPostFeed();
  };

  const handleViewAllResults = () => {
    setCategory(null);
    setTab('guides');
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    setIsDrawerOpen(false);
    scrollToPostFeed();
  };

  const scrollToPostFeed = () => {
    window.setTimeout(() => {
      const target = document.getElementById('blog-posts-feed');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownVisible) return;

    const totalItems = matchingTags.length + matchingPosts.length + (totalMatches > 0 ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === -1 || selectedIndex >= totalItems) {
        handleViewAllResults();
        return;
      }

      // Check what item was highlighted
      if (selectedIndex < matchingTags.length) {
        handleSelectTag(matchingTags[selectedIndex]);
      } else if (selectedIndex < matchingTags.length + matchingPosts.length) {
        const postIdx = selectedIndex - matchingTags.length;
        handleSelectPostItem(matchingPosts[postIdx]);
      } else {
        handleViewAllResults();
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <>
      <header className={dark 
        ? 'sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md text-white' 
        : 'sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md text-slate-900 shadow-2xs'
      }>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 gap-4">
          
          {/* Left: Brand Logo */}
          <button 
            type="button"
            onClick={handleLogoClick} 
            className="flex items-center text-left hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            id="nav-logo-btn"
          >
            <div className="flex flex-col">
              <span className={`font-heading font-bold text-base sm:text-lg tracking-tight leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                크리에이터 가이드
              </span>
              <span className={`text-[11px] font-normal leading-none ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                1인 미디어 운영 실전 노하우
              </span>
            </div>
          </button>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-subheading text-sm font-semibold shrink-0">
            <button
              onClick={handleLogoClick}
              className={`transition-colors py-1 cursor-pointer ${
                currentTab === 'guides' && !searchQuery
                  ? dark ? 'text-white font-bold border-b-2 border-purple-400' : 'text-slate-900 font-bold border-b-2 border-purple-600'
                  : dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체 글
            </button>
            <button
              onClick={() => handleNavTab('about')}
              className={`transition-colors py-1 cursor-pointer ${
                currentTab === 'about'
                  ? dark ? 'text-white font-bold border-b-2 border-purple-400' : 'text-slate-900 font-bold border-b-2 border-purple-600'
                  : dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              소개 (About)
            </button>
          </nav>

          {/* Right: Search Bar with Autocomplete & Theme/Mobile toggles */}
          <div className="flex items-center gap-2 relative">
            
            {/* Desktop Real-time Search Box */}
            <div ref={desktopSearchRef} className="relative hidden sm:block">
              <div className="relative flex items-center">
                <Search className={`absolute left-3 h-4 w-4 pointer-events-none ${
                  isSearchFocused ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
                }`} />
                
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="글 제목, 태그 검색..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                    if (!isSearchFocused) setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleKeyDown}
                  className={`w-48 md:w-64 lg:w-72 rounded-xl border pl-9 pr-8 py-2 text-xs transition-all focus:outline-none focus:ring-2 ${
                    dark
                      ? 'border-slate-700 bg-slate-850 text-white placeholder-slate-400 focus:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-purple-500/20 shadow-2xs'
                  }`}
                />

                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="검색어 지우기"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownVisible && (
                <div className={`absolute right-0 top-full mt-2 w-80 md:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150 ${
                  dark ? 'bg-slate-900/95 border-slate-700/80 backdrop-blur-xl divide-y divide-slate-800 text-slate-200' : 'bg-white/98 border-slate-200/90 backdrop-blur-xl divide-y divide-slate-100 text-slate-800 shadow-xl'
                }`}>
                  
                  {/* Matching Tags Section */}
                  {matchingTags.length > 0 && (
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <Tag className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        <span>추천 태그</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingTags.map((tag, idx) => {
                          const isSelected = selectedIndex === idx;
                          return (
                            <button
                              key={tag}
                              onClick={() => handleSelectTag(tag)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 text-white border-purple-600'
                                  : dark
                                    ? 'bg-slate-800 text-purple-300 border-slate-700 hover:bg-slate-700'
                                    : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
                              }`}
                            >
                              <span>#</span>
                              <HighlightMatch text={tag} query={cleanQuery} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matching Posts Section */}
                  <div className="max-h-72 overflow-y-auto py-1">
                    {matchingPosts.length > 0 ? (
                      <div>
                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          추천 글 ({totalMatches}편)
                        </div>
                        {matchingPosts.map((item, idx) => {
                          const itemIndex = matchingTags.length + idx;
                          const isSelected = selectedIndex === itemIndex;
                          return (
                            <div
                              key={item.slug}
                              onClick={() => handleSelectPostItem(item)}
                              className={`px-3.5 py-2.5 transition-colors cursor-pointer border-b last:border-b-0 border-slate-100/60 dark:border-slate-800/60 ${
                                isSelected
                                  ? dark ? 'bg-purple-950/50 text-white' : 'bg-purple-50 text-purple-950'
                                  : dark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  dark ? 'bg-slate-800 text-purple-300 border border-slate-700' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {item.categoryLabel}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-[13px] font-bold line-clamp-1 leading-snug">
                                <HighlightMatch text={item.title} query={cleanQuery} />
                              </h4>
                              {item.subtitle && (
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-5 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                          '{cleanQuery}'에 일치하는 글을 찾을 수 없습니다.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer Action */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                    <button
                      onClick={handleViewAllResults}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                    >
                      <span>'{searchQuery}' 전체 검색 결과 보기</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Button Toggle */}
            <div className="sm:hidden">
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  dark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title="검색"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                dark ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="테마 전환"
              id="nav-theme-toggle"
            >
              {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Mobile Hamburger Drawer Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`lg:hidden flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                dark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              id="nav-drawer-toggle"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Search Input Bar (Shown when mobile search icon is clicked) */}
        {showMobileSearch && (
          <div ref={mobileSearchRef} className="sm:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="글 제목, 태그 검색..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(-1);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDown}
                autoFocus
                className={`w-full rounded-xl border pl-9 pr-8 py-2 text-xs focus:outline-none ${
                  dark
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-400'
                    : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 p-1 text-slate-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Autocomplete Results */}
            {isDropdownVisible && (
              <div className={`mt-2 rounded-xl border shadow-lg overflow-hidden text-left ${
                dark ? 'bg-slate-900 border-slate-700 divide-y divide-slate-800 text-slate-200' : 'bg-white border-slate-200 divide-y divide-slate-100 text-slate-800'
              }`}>
                {matchingTags.length > 0 && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/50">
                    <div className="flex flex-wrap gap-1">
                      {matchingTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleSelectTag(tag)}
                          className="text-xs px-2 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="max-h-60 overflow-y-auto">
                  {matchingPosts.slice(0, 4).map((item) => (
                    <div
                      key={item.slug}
                      onClick={() => handleSelectPostItem(item)}
                      className="p-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800 active:bg-purple-50 dark:active:bg-slate-800"
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {item.categoryLabel}
                      </span>
                      <h4 className="text-xs font-bold mt-1 line-clamp-1">
                        <HighlightMatch text={item.title} query={cleanQuery} />
                      </h4>
                    </div>
                  ))}
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-950 text-center">
                  <button
                    onClick={handleViewAllResults}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 py-1"
                  >
                    '{searchQuery}' 전체 검색 결과 보기 ({totalMatches}편)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
              <div className="pointer-events-auto w-screen max-w-xs transform transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800">
                <div className="flex h-full flex-col overflow-y-auto py-6 shadow-2xl">
                  {/* Drawer Header */}
                  <div className="px-5 flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
                    <span className="font-heading text-base font-bold tracking-tight">크리에이터 가이드</span>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Drawer Nav Links */}
                  <div className="mt-6 flex-1 px-4 space-y-1.5">
                    <button
                      onClick={handleLogoClick}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>전체 글 보기</span>
                    </button>

                    <button
                      onClick={() => handleNavTab('about')}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>소개 (About)</span>
                    </button>
                  </div>

                  {/* Drawer Footer */}
                  <div className="px-5 border-t pt-4 border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[11px] text-slate-400">© 크리에이터 노트 All rights reserved.</p>
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
