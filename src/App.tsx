import { useEffect, useMemo, useState } from 'react';
import { Search, Rocket, FileText, Zap, Image, DollarSign, CheckSquare, Sparkles, BookOpen, Video, Layers, Globe, ArrowUpRight, ExternalLink, Compass, Mail, ChevronRight, Filter } from 'lucide-react';
import { ALL_POSTS, CATEGORIES_LIST, CATEGORY_SPECS } from './data';
import { GuidePost } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { GuideReader } from './components/GuideReader';
import { ContactForm } from './components/ContactForm';
import { SearchConsoleManager } from './components/SearchConsoleManager';
import { applyPostDateSchedule, getPostPath, postTitleSegment } from './postSchedule';

type Tab = 'guides' | 'about' | 'contact' | 'terms' | 'privacy' | 'guide-detail' | 'search-console';

interface RouteState {
  tab: Tab;
  post: GuidePost | null;
  category: string | null;
}

interface PageSection {
  heading: string;
  body?: string[];
  items?: string[];
  table?: { headers: string[]; rows: string[][] };
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

  if (path.startsWith('/post/')) {
    const titleSegment = path.replace('/post/', '');
    const matchedPost = findPostByTitle(titleSegment);
    return matchedPost ? { tab: 'guide-detail', post: matchedPost, category: null } : { tab: 'guides', post: null, category: null };
  }

  if (path.startsWith('/guide/')) {
    const slug = path.replace('/guide/', '');
    const matchedPost = findPostBySlug(slug);
    return matchedPost ? { tab: 'guide-detail', post: matchedPost, category: null } : { tab: 'guides', post: null, category: null };
  }

  if (path.startsWith('/category/')) {
    const categoryKey = decodeURIComponent(path.replace('/category/', ''));
    return { tab: 'guides', post: null, category: isKnownCategory(categoryKey) ? categoryKey : null };
  }

  if (path === '/about') return { tab: 'about', post: null, category: null };
  if (path === '/contact') return { tab: 'contact', post: null, category: null };
  if (path === '/terms') return { tab: 'terms', post: null, category: null };
  if (path === '/privacy') return { tab: 'privacy', post: null, category: null };
  if (path === '/search-console') return { tab: 'search-console', post: null, category: null };

  return { tab: 'guides', post: null, category: null };
};

const pathForTab = (tab: Tab, post?: GuidePost | null) => {
  if (tab === 'guide-detail' && post) return getPostPath(post);
  if (tab === 'about') return '/about';
  if (tab === 'contact') return '/contact';
  if (tab === 'terms') return '/terms';
  if (tab === 'privacy') return '/privacy';
  if (tab === 'search-console') return '/search-console';
  return '/';
};

const initialRoute = (): RouteState => {
  if (typeof window === 'undefined') return { tab: 'guides', post: null, category: null };
  return resolveRoute(window.location.pathname);
};

const PAGE_CONTENT: Record<'about' | 'contact' | 'privacy' | 'terms', { title: string; intro: string; updated: string; sections: PageSection[] }> = {
  about: {
    title: '블로그 소개',
    updated: '2026년 8월 24일',
    intro: '안녕하세요. 혼자 유튜브와 블로그를 운영하며 겪은 실패와 성공, 실제 정산 수치와 테스트 데이터를 솔직하게 기록하는 1인 크리에이터의 일지입니다.',
    sections: [
      {
        heading: '1. 이 블로그를 시작한 이유',
        body: [
          '처음 유튜브 쇼츠를 올리고 블로그에 글을 쓸 때, 인터넷에는 온통 "월 1,000만 원 보장" 같은 과장된 강의나 알맹이 없는 이론뿐이었습니다.',
          '직접 부딪혀보며 쇼츠 100만 뷰를 찍어도 왜 15만 원밖에 안 들어오는지, 애드센스는 왜 3번이나 거절당했는지, 그리고 어떻게 극복했는지를 있는 그대로의 팩트와 수치로 기록하고 공유하고자 이 공간을 만들었습니다.'
        ]
      },
      {
        heading: '2. 주로 다루는 4가지 주제',
        items: [
          '유튜브·쇼츠 기록: 시청 지속률 훅 설계, 썸네일 A/B 테스트, 쇼츠-롱폼 연계 수익화',
          '블로그·애드센스 일지: 3번 거절 딛고 7일 만에 승인받은 글쓰기, 구글 서치콘솔 색인 해결',
          '지식창업·부수입: PDF 전자책 크몽 100만 원 판매기, 노션 템플릿, 자동 발송 판매 노하우',
          '도구 & 장비 리뷰: 캡컷, 미드저니, 일레븐랩스, 마이크 등 내 돈 쓰고 검증한 실전 도구'
        ]
      },
      {
        heading: '3. 소통 및 피드백',
        body: [
          '글 내용에 대한 질문이나 겪고 계신 크리에이터 고민이 있다면 문의 페이지를 통해 언제든 편하게 남겨주세요. 아는 선에서 정성껏 답변드리겠습니다.'
        ]
      }
    ]
  },
  contact: {
    title: '문의 및 제휴',
    updated: '2026년 8월 24일',
    intro: '블로그에 기록된 내용에 대해 궁금한 점이 있거나 협업, 제안 사항이 있으시다면 언제든 편하게 남겨주세요.',
    sections: [
      {
        heading: '문의 안내',
        body: [
          '접수: 온라인 문의 양식',
          '확인 후 남겨주신 이메일로 24~48시간 이내에 직접 회신드립니다.'
        ]
      }
    ]
  },
  terms: {
    title: '이용안내',
    updated: '2026년 8월 24일',
    intro: '블로그를 찾아주셔서 감사합니다. 콘텐츠 열람 및 인용에 관한 간단한 안내입니다.',
    sections: [
      {
        heading: '콘텐츠 이용 및 인용',
        body: [
          '본 블로그의 모든 글은 직접 경험하고 테스트한 데이터를 바탕으로 작성되었습니다.',
          '비상업적인 목적의 출처 표기 인용(링크 포함)은 언제든 환영하며, 무단 복제 및 상업적 재판매는 자제 부탁드립니다.'
        ]
      }
    ]
  },
  privacy: {
    title: '개인정보처리방침',
    updated: '2026년 8월 24일',
    intro: '방문자의 개인정보 보호 및 브라우저 쿠키 관련 안내입니다.',
    sections: [
      {
        heading: '1. 개인정보 및 쿠키 안내',
        body: [
          '본 블로그는 회원가입 없이 누구나 자유롭게 모든 글을 읽으실 수 있습니다.',
          '원활한 접속 환경 제공과 방문 통계 확인을 위한 최소한의 접속 로그 및 쿠키가 활용될 수 있습니다.'
        ]
      },
      {
        heading: '2. 제3자 쿠키 및 광고 안내',
        body: [
          '구글 등 제3자 제공업체는 쿠키를 사용하여 사용자의 웹사이트 방문 기록을 바탕으로 관련 광고를 게재할 수 있습니다.',
          '맞춤형 광고 설정 변경은 구글 광고 설정(https://www.google.com/settings/ads)에서 직접 관리하실 수 있습니다.'
        ]
      }
    ]
  }
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
  const [pageSize, setPageSize] = useState(10); // Clean blog page size

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

  const posts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return [...POSTS]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .filter((item) => !category || item.category === category)
      .filter((item) => !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || (item.summary || '').toLowerCase().includes(q));
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, currentPage, pageSize]);

  const scrollToPosts = () => {
    window.setTimeout(() => {
      const target = document.getElementById('blog-posts-feed');
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
    if (next !== 'guide-detail') setCategory(null);
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

  const openPost = (item: GuidePost) => {
    navigate('guide-detail', item);
  };

  const dark = theme === 'dark';

  return (
    <div className={dark ? 'min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans' : 'min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col font-sans'}>
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

      <main className="flex-1">
        {tab === 'guides' && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
            
            {/* Editorial Introduction Banner */}
            <div className={`mb-8 p-6 rounded-2xl border transition-all ${
              dark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200/80 bg-white shadow-2xs'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Creator Note
                </span>
                <span className="text-xs text-slate-400 font-mono">1인 크리에이터 실전 일지</span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                직접 부딪히며 배운 1인 미디어 &amp; 수익화 실전 기록
              </h1>
              <p className={`text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                유튜브 쇼츠 100만 뷰의 실체부터 애드센스 3번 거절 극복기, 전자책 자동 판매까지 직접 겪은 팩트와 수치만 솔직하게 기록합니다.
              </p>
            </div>

            {/* Clean Category Filter Tabs */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {[
                  { key: null, label: '전체 글' },
                  { key: 'youtube', label: '유튜브·쇼츠 기록' },
                  { key: 'blog', label: '블로그·애드센스 일지' },
                  { key: 'digital_biz', label: '지식창업·부수입' },
                  { key: 'workflow', label: '도구 & 장비 리뷰' },
                ].map((cat) => {
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key === null ? 'all' : cat.key}
                      onClick={() => selectCategory(cat.key)}
                      className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? dark
                            ? 'bg-slate-800 text-purple-300 font-bold border border-slate-700'
                            : 'bg-slate-900 text-white font-bold'
                          : dark
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Total count */}
              <span className="text-xs text-slate-400 font-mono">
                총 {posts.length}편의 기록
              </span>
            </div>

            {/* Main Blog Post List Feed */}
            {paginatedPosts.length > 0 ? (
              <section id="blog-posts-feed" className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {paginatedPosts.map((item) => (
                  <PostCard 
                    key={item.slug} 
                    post={item} 
                    href={getPostPath(item)} 
                    theme={theme} 
                    accentColor={CATEGORY_SPECS[item.category]?.accentColor || '#38bdf8'} 
                    onSelect={openPost} 
                  />
                ))}
              </section>
            ) : (
              /* No search results state */
              <div className={`rounded-2xl border p-8 text-center my-8 ${
                dark ? 'border-slate-800 bg-slate-900/40 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <Search className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                <h3 className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {query ? `'${query}'에 대한 글을 찾지 못했습니다.` : '등록된 글이 없습니다.'}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  다른 키워드로 검색하시거나 전체 글 목록을 확인해 보세요.
                </p>

                {query.trim() && (() => {
                  const rawQuery = query.trim();
                  const siteQuery = `site:nutube.kr ${rawQuery}`;
                  const googleSiteUrl = `https://www.google.com/search?q=${encodeURIComponent(siteQuery)}`;

                  return (
                    <div className="max-w-md mx-auto mb-6 p-4 rounded-xl border border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-left">
                      <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                        구글 외부 검색 도움말
                      </p>
                      <p className="text-xs text-slate-500 mb-3">
                        구글 검색 엔진에서 블로그 전체 색인 문서를 검색합니다.
                      </p>
                      <a
                        href={googleSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:underline"
                      >
                        <span>'{siteQuery}' 구글에서 검색</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })()}

                <button
                  onClick={() => {
                    setQuery('');
                    setCategory(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90"
                >
                  전체 글 보기
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {currentPage} / {totalPages} 페이지
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    이전
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                    if (p === '...') {
                      return <span key={`ell-${idx}`} className="px-2 text-xs text-slate-400">...</span>;
                    }
                    const isCurrent = p === currentPage;
                    return (
                      <button
                        key={`page-${p}`}
                        onClick={() => handlePageChange(p as number)}
                        className={`min-w-[32px] h-8 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-900 text-white dark:bg-purple-600 dark:text-white'
                            : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {tab === 'guide-detail' && post && (
          <GuideReader post={post} categorySpec={CATEGORY_SPECS[post.category]} onBack={handleBack} theme={theme} />
        )}
        
        {tab === 'about' && <InfoPage page={PAGE_CONTENT.about} theme={theme} />}
        {tab === 'contact' && <ContactForm theme={theme} />}
        {tab === 'terms' && <InfoPage page={PAGE_CONTENT.terms} theme={theme} />}
        {tab === 'privacy' && <InfoPage page={PAGE_CONTENT.privacy} theme={theme} />}
        {tab === 'search-console' && (
          <div className="mx-auto max-w-4xl px-4 py-10">
            <SearchConsoleManager theme={theme} />
          </div>
        )}
      </main>

      {/* Clean Editorial Blog Footer */}
      <footer className={`mt-auto border-t py-10 text-xs transition-colors ${
        dark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
                기록
              </div>
              <span className="font-bold text-slate-900 dark:text-white">크리에이터 노트</span>
              <span className="text-slate-400">| 1인 미디어 &amp; 수익화 실전 일지</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <button onClick={() => go('about')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">블로그 소개</button>
              <button onClick={() => go('contact')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">문의</button>
              <button onClick={() => go('privacy')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">개인정보처리방침</button>
              <button onClick={() => go('terms')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">이용약관</button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-400">
            <p>© 2026 크리에이터 노트 (Creator Note). All rights reserved.</p>
            <p>1인 크리에이터의 실전 경험과 팩트 중심 기록</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoPage({ page, theme }: { page: { title: string; intro: string; updated: string; sections: PageSection[] }; theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <article className={`rounded-2xl border p-6 sm:p-8 ${
        dark ? 'border-slate-800 bg-slate-900/60 text-slate-200' : 'border-slate-200 bg-white text-slate-800 shadow-2xs'
      }`}>
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">최종 수정일: {page.updated}</p>
        <h1 className={`mt-2 font-heading text-2xl sm:text-3xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{page.title}</h1>
        <p className={`mt-4 text-sm sm:text-base leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{page.intro}</p>
        
        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <section key={section.heading} className={`p-5 rounded-xl border ${
              dark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50/70'
            }`}>
              <h2 className={`font-heading text-base sm:text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className={`mt-2.5 text-sm sm:text-base leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className={`mt-3 space-y-1.5 text-sm sm:text-base ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2 items-start">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" /> 
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
