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
    title: '블로그 소개 | 크리에이터랩',
    updated: '2026년 8월 20일',
    intro: '크리에이터랩은 유튜브, 인스타그램, 틱톡 등 숏폼·롱폼 영상 플랫폼 운영과 구글 애드센스 SEO, 디지털 지식 비즈니스를 실전 중심으로 연구하고 기록하는 미디어 지식 블로그입니다.',
    sections: [
      {
        heading: '1. 블로그 운영 목적 및 방향성',
        body: [
          '크리에이터랩은 단순한 이론이나 추측성 정보가 아닌, 실제 크리에이터 생태계의 알고리즘 변화와 수익화 파이프라인 구축 과정을 체계적으로 정리하여 공유합니다.',
          '무분별한 정보 속에서 크리에이터와 웹 퍼블리셔가 즉시 실행할 수 있는 실질적인 가이드라인을 제공하는 것을 목표로 합니다.'
        ]
      },
      {
        heading: '2. 구글 E-E-A-T 품질 기준 준수',
        body: [
          '본 블로그의 모든 글은 구글의 검색 품질 평가 기준(E-E-A-T: 경험, 전문성, 권위성, 신뢰성)을 충실히 반영합니다.',
          '실제 채널 기획, 시청지속률 개선, 썸네일 A/B 테스트, 애드센스 승인 및 색인 최적화 과정에서 검증된 핵심 체크리스트와 상세 실행법을 단계별로 안내합니다.'
        ]
      },
      {
        heading: '3. 주요 다루는 카테고리',
        items: [
          '유튜브 & 유튜브 쇼츠: 알고리즘 로직 분석, CTR 극대화 썸네일 및 오프닝 훅 구조화',
          '인스타그램 & 릴스: 저장/공유 유발 콘텐츠 기획 및 계정 성장 전략',
          '틱톡: 바이럴 트렌드 포착 및 숏폼 영상 편집 프레임워크',
          '블로그 & 애드센스: 구글 검색엔진 최적화(SEO), 서치콘솔 색인 및 애드센스 고수익 배치',
          '지식창업: 전자책, 템플릿, 온라인 강의 등 디지털 지식 자산화 전략'
        ]
      },
      {
        heading: '4. 문의 및 제안',
        body: [
          '블로그 게시글에 대한 질문, 피드백, 제휴 제안은 문의 페이지(Contact)를 통해 보내주시면 신속하고 성실하게 검토하겠습니다.'
        ]
      }
    ]
  },
  contact: {
    title: '문의 및 피드백 | 크리에이터랩',
    updated: '2026년 8월 20일',
    intro: '크리에이터랩에 게시된 콘텐츠에 대한 질문, 수정 제보, 비즈니스 협업 제안은 아래 소통 창구를 통해 접수하실 수 있습니다.',
    sections: [
      {
        heading: '1. 문의 창구 안내',
        body: [
          '공식 접수처: 크리에이터랩 온라인 문의 양식',
          '응답 시간: 평일 09:00 ~ 18:00 (접수 후 순차적 검토 및 회신)'
        ]
      }
    ]
  },
  terms: {
    title: '이용약관 | 크리에이터랩',
    updated: '2026년 8월 20일',
    intro: '본 약관은 크리에이터랩 블로그의 지식 정보 및 콘텐츠 이용에 관한 기본적인 사항을 안내합니다.',
    sections: [
      {
        heading: '제1조 (목적)',
        body: ['본 약관은 크리에이터랩 블로그가 제공하는 정보 및 콘텐츠의 이용 조건과 방문자의 권리·의무 사항을 규정함을 목적으로 합니다.']
      },
      {
        heading: '제2조 (콘텐츠 저작권 및 이용 제한)',
        body: ['크리에이터랩에 게시된 모든 콘텐츠와 가이드는 저작권법의 보호를 받으며, 비상업적 목적의 출처 표기 인용 외 무단 전재 및 상업적 도용을 금합니다.']
      }
    ]
  },
  privacy: {
    title: '개인정보처리방침 | 크리에이터랩',
    updated: '2026년 8월 20일',
    intro: '크리에이터랩은 방문자의 개인정보를 소중히 여기며 관련 법령 및 구글 애드센스 개인정보 정책을 철저히 준수합니다.',
    sections: [
      {
        heading: '1. 개인정보의 수집 및 이용 목적',
        body: [
          '본 블로그는 회원가입 없이 모든 콘텐츠를 자유롭게 열람할 수 있는 공개 블로그입니다.',
          '방문 통계 분석 및 서비스 안정성 유지를 위해 쿠키(Cookie) 및 표준 접속 로그가 활용될 수 있습니다.'
        ]
      },
      {
        heading: '2. 구글 애드센스(Google AdSense) 및 제3자 쿠키 안내',
        body: [
          '본 블로그는 Google을 포함한 제3자 광고 공급업체를 통해 관련성 높은 맞춤형 광고를 게재할 수 있습니다.',
          'Google은 DART 쿠키를 사용하여 사용자의 이전 웹사이트 방문 기록을 기반으로 유용한 광고를 게재합니다.',
          '사용자는 Google 광고 설정(https://www.google.com/settings/ads)을 통해 맞춤형 광고 수신을 언제든지 거부하거나 변경할 수 있습니다.'
        ]
      },
      {
        heading: '3. 개인정보 보호 문의처',
        body: [
          '운영: 크리에이터랩 편집실',
          '접수: 온라인 문의(Contact) 양식'
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
                  Creator Lab
                </span>
                <span className="text-xs text-slate-400 font-mono">실전 가이드 아카이브</span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                1인 미디어 제작 &amp; 디지털 수익화 연구소
              </h1>
              <p className={`text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                유튜브, 인스타그램, 틱톡 숏폼 기획부터 구글 애드센스 SEO, 전자책 지식창업까지 실전에서 검증된 체계적인 가이드를 제공합니다.
              </p>
            </div>

            {/* Clean Category Filter Tabs */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {[
                  { key: null, label: '전체 글' },
                  { key: 'youtube', label: '유튜브' },
                  { key: 'instagram', label: '인스타그램' },
                  { key: 'tiktok', label: '틱톡' },
                  { key: 'blog', label: '애드센스·SEO' },
                  { key: 'digital_biz', label: '지식창업' },
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
                총 {posts.length}편의 글
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
                랩
              </div>
              <span className="font-bold text-slate-900 dark:text-white">크리에이터랩</span>
              <span className="text-slate-400">| 1인 미디어 &amp; 수익화 연구 가이드</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <button onClick={() => go('about')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">블로그 소개</button>
              <button onClick={() => go('contact')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">문의</button>
              <button onClick={() => go('privacy')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">개인정보처리방침</button>
              <button onClick={() => go('terms')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">이용약관</button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-400">
            <p>© 2026 크리에이터랩 (Creator Lab). All rights reserved.</p>
            <p>디지털 미디어 &amp; 웹 수익화 실전 가이드</p>
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
