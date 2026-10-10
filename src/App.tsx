import { useEffect, useMemo, useState } from 'react';
import { Search, Folder, Calendar, User, ExternalLink, ArrowRight, Info, ShieldCheck, FileText } from 'lucide-react';
import { ALL_POSTS, CATEGORIES_LIST, CATEGORY_SPECS } from './data';
import { PAGE_CONTENT, PageSection } from './data/pages';
import { GuidePost } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { GuideReader } from './components/GuideReader';
import { BlogSidebar } from './components/BlogSidebar';
import { applyPostDateSchedule, getPostPath, postTitleSegment } from './postSchedule';
import { updatePageSeoMeta, resetDefaultSeoMeta } from './utils/seoAnalyzer';

type Tab = 'guides' | 'about' | 'terms' | 'privacy' | 'guide-detail' | 'not-found';

interface RouteState {
  tab: Tab;
  post: GuidePost | null;
  category: string | null;
}

const POSTS = applyPostDateSchedule(ALL_POSTS);

const normalizePath = (pathname: string) => {
  const clean = pathname.replace(/\/+$/, '');
  return clean || '/';
};

const isKnownCategory = (value: string | null) => {
  if (!value) return false;
  return CATEGORIES_LIST.some((item) => item.key === value);
};

const findPostBySlug = (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  return POSTS.find((item) => item.slug === decodedSlug) || null;
};

const findPostByTitle = (titleSegment: string) => {
  const decodedSegment = decodeURIComponent(titleSegment);
  const titleFromLegacySpaceUrl = decodedSegment.replace(/-/g, ' ');

  return (
    POSTS.find((item) => postTitleSegment(item.title) === decodedSegment) ||
    POSTS.find((item) => item.title === decodedSegment) ||
    POSTS.find((item) => item.title === titleFromLegacySpaceUrl) ||
    null
  );
};

const resolveRoute = (pathname: string): RouteState => {
  const path = normalizePath(pathname);

  if (path === '/' || path === '') {
    return { tab: 'guides', post: null, category: null };
  }

  if (path.startsWith('/post/')) {
    const titleSegment = path.replace('/post/', '');
    const matchedPost = findPostByTitle(titleSegment);
    return matchedPost ? { tab: 'guide-detail', post: matchedPost, category: null } : { tab: 'not-found', post: null, category: null };
  }

  if (path.startsWith('/guide/')) {
    const slug = path.replace('/guide/', '');
    const matchedPost = findPostBySlug(slug);
    return matchedPost ? { tab: 'guide-detail', post: matchedPost, category: null } : { tab: 'not-found', post: null, category: null };
  }

  if (path.startsWith('/category/')) {
    const categoryKey = decodeURIComponent(path.replace('/category/', ''));
    if (isKnownCategory(categoryKey)) {
      return { tab: 'guides', post: null, category: categoryKey };
    }
    return { tab: 'not-found', post: null, category: null };
  }

  if (path === '/about') return { tab: 'about', post: null, category: null };
  if (path === '/terms') return { tab: 'terms', post: null, category: null };
  if (path === '/privacy') return { tab: 'privacy', post: null, category: null };

  return { tab: 'not-found', post: null, category: null };
};

const pathForTab = (tab: Tab, post?: GuidePost | null) => {
  if (tab === 'guide-detail' && post) return getPostPath(post);
  if (tab === 'about') return '/about';
  if (tab === 'terms') return '/terms';
  if (tab === 'privacy') return '/privacy';
  if (tab === 'not-found') return '/404';
  return '/';
};

const initialRoute = (): RouteState => {
  if (typeof window === 'undefined') return { tab: 'guides', post: null, category: null };
  return resolveRoute(window.location.pathname);
};

const getPageNumbers = (current: number, total: number): (number | string)[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
};

export default function App() {
  const route = initialRoute();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [tab, setTab] = useState<Tab>(route.tab);
  const [post, setPost] = useState<GuidePost | null>(route.post);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(route.category);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Standard blog page size

  useEffect(() => {
    setPage(1);
  }, [query, category, pageSize]);

  useEffect(() => {
    const handlePopState = () => {
      const next = resolveRoute(window.location.pathname);
      setPost(next.post);
      setCategory(next.category);
      setTab(next.tab);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (tab === 'about' || tab === 'terms' || tab === 'privacy') {
      updatePageSeoMeta(tab);
    } else if (tab === 'not-found') {
      if (typeof document !== 'undefined') {
        document.title = '페이지를 찾을 수 없습니다 (404) | 너튜브';
      }
    } else if (tab === 'guides' && !post) {
      resetDefaultSeoMeta();
    }
  }, [tab, post]);

  const posts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return [...POSTS]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .filter((item) => !category || item.category === category)
      .filter((item) => !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || (item.summary || '').toLowerCase().includes(q) || (item.tags || []).some(t => t.toLowerCase().includes(q)));
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, currentPage, pageSize]);

  const scrollToPosts = () => {
    window.setTimeout(() => {
      const target = document.getElementById('blog-main-content');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handlePageChange = (newPage: number) => {
    const target = Math.max(1, Math.min(newPage, totalPages));
    setPage(target);
    scrollToPosts();
  };

  const navigate = (next: Tab, selectedPost: GuidePost | null = null) => {
    const nextPath = pathForTab(next, selectedPost);
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({ tab: next, title: selectedPost?.title || null }, '', nextPath);
    }
    setPost(next === 'guide-detail' ? selectedPost : null);
    setTab(next);
    if (next !== 'guide-detail' && next !== 'guides') setCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (key: string | null) => {
    const nextCategory = key;
    const nextPath = nextCategory ? `/category/${nextCategory}` : '/';

    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({ tab: 'guides', category: nextCategory }, '', nextPath);
    }

    setPost(null);
    setTab('guides');
    setQuery('');
    setCategory(nextCategory);
    setPage(1);

    if (key === null) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToPosts();
    }
  };

  const go = (next: Tab) => navigate(next);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.state) {
      window.history.back();
    } else {
      selectCategory(null);
    }
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
    setCategory(null);
    setPage(1);
    if (tab !== 'guides') {
      go('guides');
    }
    scrollToPosts();
  };

  const openPost = (item: GuidePost) => {
    navigate('guide-detail', item);
  };

  const dark = theme === 'dark';

  const currentCategorySpec = category ? CATEGORY_SPECS[category] : null;

  return (
    <div className={dark ? 'min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans' : 'min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans'}>
      {/* 1. Header (Navbar) */}
      <Navbar 
        currentTab={tab} 
        setTab={go} 
        theme={theme} 
        toggleTheme={() => setTheme(dark ? 'light' : 'dark')} 
        category={category}
        setCategory={selectCategory}
        searchQuery={query}
        setSearchQuery={setQuery}
        posts={POSTS}
        onSelectPost={openPost}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1">
        {/* Post Detail View (Article Reader) */}
        {tab === 'guide-detail' && post && (
          <GuideReader 
            post={post} 
            categorySpec={CATEGORY_SPECS[post.category]} 
            onBack={handleBack} 
            theme={theme} 
            allPosts={POSTS}
            onSelectPost={(slug) => {
              const targetPost = POSTS.find((p) => p.slug === slug);
              if (targetPost) openPost(targetPost);
            }}
          />
        )}

        {/* Blog Post List View (Classic Tistory 2-Column Skin: Main Feed + Sidebar) */}
        {tab === 'guides' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
              
              {/* Left Column: Post Feed */}
              <div id="blog-main-content" className="flex-1 min-w-0 w-full">
                
                {/* Category Header Bar (phongnhaexplorer clean style) */}
                <div className={`p-5 rounded-xl border mb-6 transition-colors ${
                  dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h1 className={`text-base sm:text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                        {category ? currentCategorySpec?.label : '전체 질문과 가이드'}
                      </h1>
                      <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                        ({posts.length})
                      </span>
                    </div>

                    {category && (
                      <button
                        onClick={() => selectCategory(null)}
                        className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline cursor-pointer"
                      >
                        전체 질문·가이드 보기
                      </button>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {category 
                      ? currentCategorySpec?.description 
                      : '스마트폰 하나로 가볍게 시작해 월 100만 원 수익 파이프라인을 구축하는 실전 크리에이터 가이드와 질문 답변입니다.'}
                  </p>
                </div>

                {/* Post List */}
                {paginatedPosts.length > 0 ? (
                  <div className={`rounded-xl border divide-y overflow-hidden transition-colors ${
                    dark ? 'bg-slate-900/60 border-slate-800 divide-slate-800/80' : 'bg-white border-slate-200 divide-slate-100 shadow-2xs'
                  }`}>
                    {paginatedPosts.map((item, idx) => (
                      <PostCard 
                        key={item.slug} 
                        post={item} 
                        href={getPostPath(item)} 
                        theme={theme} 
                        onSelect={openPost} 
                        index={idx}
                      />
                    ))}
                  </div>
                ) : (
                  /* No search results state */
                  <div className={`rounded-xl border p-8 text-center my-6 ${
                    dark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
                  }`}>
                    <Search className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                    <h3 className={`text-base font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>
                      {query ? `'${query}'에 대한 글을 찾지 못했습니다.` : '등록된 글이 없습니다.'}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      다른 키워드로 검색하시거나 카테고리 전체 글을 확인해 보세요.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('');
                        selectCategory(null);
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 cursor-pointer"
                    >
                      전체 글 목록으로
                    </button>
                  </div>
                )}

                {/* Pagination (Classic Tistory Pagination) */}
                {totalPages > 1 && (
                  <div className="mt-8 pt-4 flex items-center justify-between flex-wrap gap-3">
                    <span className="text-xs text-slate-500 font-mono">
                      {currentPage} / {totalPages} 페이지
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors cursor-pointer ${
                          currentPage === 1 
                            ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800' 
                            : dark 
                              ? 'border-slate-700 hover:bg-slate-800 text-slate-200' 
                              : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        이전
                      </button>

                      {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                        if (p === '...') {
                          return <span key={`ell-${idx}`} className="px-1.5 text-xs text-slate-400">...</span>;
                        }
                        const isCurrent = p === currentPage;
                        return (
                          <button
                            key={`page-${p}`}
                            onClick={() => handlePageChange(p as number)}
                            className={`min-w-[30px] h-7 text-xs font-bold rounded transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-slate-900 text-white dark:bg-purple-600 dark:text-white'
                                : dark 
                                  ? 'border border-slate-800 hover:bg-slate-800 text-slate-300' 
                                  : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors cursor-pointer ${
                          currentPage === totalPages 
                            ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800' 
                            : dark 
                              ? 'border-slate-700 hover:bg-slate-800 text-slate-200' 
                              : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Tistory Blog Sidebar */}
              <BlogSidebar 
                currentCategory={category}
                onSelectCategory={selectCategory}
                posts={POSTS}
                onSelectPost={openPost}
                onOpenAbout={() => go('about')}
                onSelectTag={handleSelectTag}
                theme={theme}
              />

            </div>
          </div>
        )}

        {/* Policy / About Pages (Rendered within 2-column layout for consistent Tistory look) */}
        {(tab === 'about' || tab === 'terms' || tab === 'privacy') && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
              <div className="flex-1 min-w-0 w-full">
                <InfoPage page={PAGE_CONTENT[tab]} theme={theme} />
              </div>
              <BlogSidebar 
                currentCategory={category}
                onSelectCategory={selectCategory}
                posts={POSTS}
                onSelectPost={openPost}
                onOpenAbout={() => go('about')}
                onSelectTag={handleSelectTag}
                theme={theme}
              />
            </div>
          </div>
        )}

        {/* 404 Not Found Screen (Strict AdSense compliance: zero ads on error screens) */}
        {tab === 'not-found' && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className={`p-8 sm:p-12 rounded-2xl border transition-colors ${
              dark ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-slate-200 bg-white text-slate-800 shadow-2xs'
            }`}>
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold flex items-center justify-center text-xl mx-auto mb-4">
                404
              </div>
              <h1 className={`text-2xl font-black mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                요청하신 페이지를 찾을 수 없습니다
              </h1>
              <p className={`text-xs sm:text-sm mb-6 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                존재하지 않거나 주소가 변경된 페이지입니다.<br />
                아래 주요 카테고리나 최신 가이드 목록에서 원하는 정보를 확인해 보세요.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <button
                  onClick={() => selectCategory(null)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  너튜브 홈으로 이동
                </button>
                <button
                  onClick={() => selectCategory('why_youtube')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    dark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  시작의 이유
                </button>
                <button
                  onClick={() => selectCategory('monetization')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    dark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  수익화 파이프라인
                </button>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                문의 사항이 있으시면 <button onClick={() => go('about')} className="text-blue-600 underline cursor-pointer">운영자 소개</button> 또는 <span className="font-mono">minwoo@nutube.kr</span> 로 연락해 주세요.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer (Classic Tistory / Naver Style) */}
      <footer className={`mt-auto border-t py-10 text-xs transition-colors ${
        dark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/70 dark:border-slate-800/80">
            <div>
              <button
                onClick={() => selectCategory(null)}
                className="block text-left cursor-pointer focus:outline-none mb-1.5"
                aria-label="NuTube 홈으로 이동"
              >
                <img
                  src={dark ? "/nutube-brand-dark.svg" : "/nutube-brand-light.svg"}
                  alt="NuTube - 너와 나의 1인 미디어 성장 노트"
                  className="h-8 w-auto object-contain shrink-0"
                  referrerPolicy="no-referrer"
                />
              </button>
              <p className="text-[11px] text-slate-400">
                너와 나의 1인 미디어 성장 노트 | 스마트폰 하나로 시작하는 유튜브 &amp; 애드센스 실전 가이드
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <button onClick={() => go('about')} className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer">
                블로그 소개
              </button>
              <button onClick={() => go('privacy')} className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer">
                개인정보처리방침
              </button>
              <button onClick={() => go('terms')} className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer">
                이용약관
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-400">
            <p>© 2026 너튜브 (NuTube). All rights reserved.</p>
            <p>너(Nu)와 나를 잇는 1인 미디어 실전 가이드</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoPage({ page, theme }: { page: { title: string; intro: string; updated: string; sections: PageSection[] }; theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';
  return (
    <article className={`rounded-xl border p-6 sm:p-8 transition-colors ${
      dark ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-slate-200 bg-white text-slate-800 shadow-2xs'
    }`}>
      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
        최종 수정일: {page.updated}
      </span>
      <h1 className={`mt-2 font-heading text-xl sm:text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
        {page.title}
      </h1>
      <p className={`mt-3 text-xs sm:text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
        {page.intro}
      </p>
      
      <div className="mt-6 space-y-5">
        {page.sections.map((section) => (
          <section key={section.heading} className={`p-4 sm:p-5 rounded-lg border ${
            dark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50/70'
          }`}>
            <h2 className={`font-heading text-sm sm:text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
              {section.heading}
            </h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph} className={`mt-2 text-xs sm:text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className={`mt-2.5 space-y-1 text-xs sm:text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" /> 
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
