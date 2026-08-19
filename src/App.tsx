import { useEffect, useMemo, useState } from 'react';
import { Search, Rocket, FileText, Zap, Image, DollarSign, CheckSquare, Sparkles, BookOpen, Video, Layers, Globe, ArrowUpRight, ExternalLink, Compass } from 'lucide-react';
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
    title: '소개 | 크리에이터랩 (Creator Lab)',
    updated: '2026년 8월 19일',
    intro: '크리에이터랩(Creator Lab)은 예비 창작자부터 전업 크리에이터, 디지털 마케터를 위한 유튜브, 틱톡, 인스타그램, 구글 애드센스 SEO 및 지식 비즈니스 종합 정보 전문 미디어입니다. 신뢰할 수 있는 플랫폼 실전 가이드라인을 정직하게 안내합니다.',
    sections: [
      {
        heading: '1. 사이트 운영 주체 및 서비스 목적',
        body: [
          '운영 매체: 크리에이터랩 (Creator Lab)',
          '공식 이메일: apark12321@gmail.com',
          '크리에이터랩은 유튜브, 구글 서치콘솔, 국세청 등 공식 플랫폼 발표 가이드라인을 정밀 검증하여 전달합니다.',
          '단순한 알고리즘 카더라 정보를 지양하고, 실제 채널을 성장시키고 안정적인 구글 애드센스 수익화와 지식 자산을 구축할 수 있는 실무 가이드를 제공합니다.'
        ]
      },
      {
        heading: '2. 편집 기준 및 투명성 고지 (E-E-A-T 검증 원칙)',
        body: [
          '본 플랫폼의 모든 포스팅과 정보는 2026년 구글 검색엔진 최적화(SEO) 및 E-E-A-T(경험, 전문성, 권위성, 신뢰성) 원칙에 따라 철저히 작성됩니다.',
          '실제 경험에 기초한 단골 실수와 해결 방법, 단계별 실무 타임라인, 비교 요약 표(Table) 및 자주 묻는 질문(FAQ)을 포함하여 독자 여러분의 안전한 창작 활동을 보장합니다.'
        ]
      },
      {
        heading: '3. 매체 운영 및 고객지원 센터',
        body: [
          '매체명: 크리에이터랩 (Creator Lab)',
          '주요 전문 분야: 비디오 플랫폼 수익화, 소셜 미디어 브랜딩, 구글 애드센스 SEO/AEO/GEO, AI 콘텐츠 자동화, 지식 비즈니스',
          '고객 응답 시간: 평일 09:00 ~ 18:00 (공휴일 제외, 접수 후 영업일 기준 24시간 이내 회신)',
          '공식 문의 주소: apark12321@gmail.com'
        ]
      },
      {
        heading: '4. 핵심 전문 분야',
        items: [
          '유튜브, 틱톡, 인스타그램 채널 추천 알고리즘 및 시청지속률 극대화 기획',
          '구글 애드센스 원스톱 승인 및 검색엔진 상위점유 SEO/AEO 전략',
          'AI 도구를 활용한 대본 작성 및 숏폼 비디오 시각 연출',
          'PDF 전자책, 유료 뉴스레터 및 패시브 인컴 지식창업'
        ]
      },
      {
        heading: '5. 카테고리 계층 구조 및 실전 포스팅 라이브러리',
        body: [
          '크리에이터랩은 검색엔진 수집 로봇의 크롤링 효율성을 높이고 방문자의 탐색 만족도를 극대화하기 위해 명확한 5대 카테고리로 정리되어 있습니다.'
        ],
        table: {
          headers: ['분야', '카테고리명', '핵심 내용', '추천 실전 포스팅 주제'],
          rows: [
            [
              '🎥 비디오 수익화',
              '유튜브 수익화 (youtube)',
              '쇼츠/롱폼 알고리즘, RPM, 시청 세션',
              '1. 유튜브 쇼츠 RPM 300% 폭발 성장 공식 / 2. 첫 10초 시청 이탈 방지 후킹 템플릿 / 3. 알고리즘 타겟 시청자 정복법'
            ],
            [
              '🎥 비디오 수익화',
              '틱톡 수익화 (tiktok)',
              '3초 후킹, CRP 프로그램, 바이럴',
              '1. 틱톡 크리에이터 리워드(CRP) 수익 5배 증대법 / 2. 3초 바이럴 알고리즘 및 트렌드 음악 / 3. 틱톡 숏폼 무인 자동화'
            ],
            [
              '📸 소셜 브랜딩',
              '인스타그램 수익화 (instagram)',
              '릴스 바이럴, 퍼스널 브랜딩, 협찬',
              '1. 인스타그램 릴스 추천 탭 상단 점유 노하우 / 2. 팔로워 1천 명으로 월 200만 원 협찬 유치법 / 3. 고전환율 카드뉴스 기획'
            ],
            [
              '📝 애드센스 & SEO',
              '구글 애드센스 & SEO (blog)',
              '애드센스 승인, 서치콘솔, SEO',
              '1. 구글 애드센스 거절 없는 고품질 글 쓰기 7계명 / 2. 서치콘솔 색인 누락 24시간 내 해결 가이드 / 3. 워드프레스/티스토리 최적화'
            ],
            [
              '💼 지식 비즈니스',
              '지식창업 & 뉴스레터 (digital_biz)',
              'PDF 전자책, 유료 뉴스레터, 무인 판매',
              '1. 경험을 PDF 전자책으로 출판 자동 판매 시스템 / 2. 유료 뉴스레터 오픈율 40% 달성 공식 / 3. 고전환 카피라이팅'
            ]
          ]
        }
      }
    ]
  },
  contact: {
    title: '제휴 및 문의 | 크리에이터랩 (Creator Lab)',
    updated: '2026년 8월 19일',
    intro: '크리에이터랩(Creator Lab) 플랫폼 이용 관련 문의, 보도자료 전달, 광고 및 비즈니스 제휴 제안은 아래 공식 소통 창구를 통해 접수하실 수 있습니다.',
    sections: [
      {
        heading: '1. 공식 소통 창구 및 운영 정보',
        body: [
          '운영 매체: 크리에이터랩 (Creator Lab)',
          '공식 이메일: apark12321@gmail.com',
          '응답 시간: 평일 09:00 ~ 18:00 (공휴일 제외, 접수 후 24시간 이내 답변)'
        ]
      }
    ]
  },
  terms: {
    title: '이용약관 | 크리에이터랩 (Creator Lab)',
    updated: '2026년 8월 19일',
    intro: '본 약관은 크리에이터랩(Creator Lab) 웹사이트가 제공하는 지식 콘텐츠 및 솔루션 이용 조건과 절차를 규정합니다.',
    sections: [
      {
        heading: '제1조 (목적)',
        body: ['본 약관은 크리에이터랩이 제공하는 정보 서비스 이용 조건 및 절차, 이용자와 매체 간 권리와 의무를 규정함을 목적으로 합니다.']
      }
    ]
  },
  privacy: {
    title: '개인정보처리방침 | 크리에이터랩 (Creator Lab)',
    updated: '2026년 8월 19일',
    intro: '크리에이터랩(Creator Lab)은 방문자의 개인정보를 보호하고 관련 법령 및 구글 애드센스 정책을 엄격히 준수합니다.',
    sections: [
      {
        heading: '1. 수집하는 개인정보 항목 및 이용 목적',
        body: [
          '본 웹사이트는 별도의 회원가입 없이 모든 포스팅과 지식 솔루션 가이드를 자유롭게 이용할 수 있는 오픈 미디어 플랫폼입니다.',
          '서비스 개선, 웹사이트 이용 통계 분석 및 보안 유지를 위해 방문 기록(쿠키, IP 주소, 브라우저 종류, 방문 일시)이 자동 생성되어 수집될 수 있습니다.'
        ]
      },
      {
        heading: '2. 구글 애드센스(Google AdSense) 및 제3자 쿠키(Cookie) 고지',
        body: [
          '본 웹사이트는 구글(Google)을 포함한 제3자 광고 공급업체를 통해 사용자 맞춤형 광고를 게재합니다.',
          '구글은 쿠키(Cookie) 기술을 사용하여 방문자의 과거 웹사이트 방문 기록을 기반으로 관련성 높은 맞춤형 광고를 제공합니다.',
          '방문자는 구글 광고 설정 페이지(https://www.google.com/settings/ads)에서 맞춤형 광고 수집을 거부할 수 있습니다.'
        ]
      },
      {
        heading: '3. 개인정보 보호책임자 및 제휴 문의처',
        body: [
          '운영 매체: 크리에이터랩 (Creator Lab)',
          '공식 이메일: apark12321@gmail.com',
          '개인정보 보호 관련 문의사항은 공식 이메일로 접수해 주시면 지체 없이 신속하게 답변해 드립니다.'
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
  const [pageSize, setPageSize] = useState(12);

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

  const selectedCategory = category ? CATEGORIES_LIST.find((item) => item.key === category) : null;

  const scrollToPosts = () => {
    window.setTimeout(() => {
      const target = document.getElementById('related-posts-section');
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
    <div className={dark ? 'min-h-screen bg-[#090314] text-slate-100' : 'min-h-screen bg-[#F8FAFC] text-slate-900'}>
      <Navbar 
        currentTab={tab} 
        setTab={go} 
        theme={theme} 
        toggleTheme={() => setTheme(dark ? 'light' : 'dark')} 
        category={category}
        setCategory={selectCategory}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
      <main>
        {tab === 'guides' && (
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full min-w-0">
            {/* Header Title Block - Crisp Typography */}
            <div className="mb-6 sm:mb-8">
              <h1 className={dark ? 'font-heading text-3xl sm:text-5xl font-black text-white tracking-tight' : 'font-heading text-3xl sm:text-5xl font-black text-slate-900 tracking-tight'}>
                크리에이터랩
              </h1>
              <p className={dark ? 'mt-3 text-base sm:text-lg text-slate-300 font-medium font-subheading' : 'mt-3 text-base sm:text-lg text-slate-600 font-medium font-subheading'}>
                유튜브 알고리즘, 숏폼 수익화, 구글 애드센스 SEO 및 지식자산화 실전 가이드
              </p>
            </div>

            {/* Mobile-optimized Horizontal Category Pill Scroller */}
            <div className="mb-6 sm:mb-8 w-full overflow-hidden">
              <div id="category-scroller" className="flex items-center gap-2.5 overflow-x-auto pb-2.5 scrollbar-none w-full touch-pan-x">
                {[
                  { key: null, label: '전체 콘텐츠' },
                  { key: 'youtube', label: '유튜브' },
                  { key: 'instagram', label: '인스타그램' },
                  { key: 'tiktok', label: '틱톡' },
                  { key: 'blog', label: '구글 애드센스 & SEO' },
                  { key: 'digital_biz', label: '지식창업' },
                ].map((cat) => {
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key === null ? 'all' : cat.key}
                      onClick={() => selectCategory(cat.key)}
                      className={`font-tag shrink-0 rounded-full px-4.5 py-2.5 text-sm sm:text-base font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? dark
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-sm'
                            : 'bg-[#7C3AED] text-white border-purple-600 font-black shadow-sm'
                          : dark
                            ? 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700 hover:text-white'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Info Bar & Mobile Search - Fully Wrap-Safe */}
            <div className={dark 
              ? 'mb-6 flex flex-col gap-3.5 rounded-2xl border border-slate-800 bg-[#0c1424] p-4.5 sm:p-5 sm:flex-row sm:items-center sm:justify-between' 
              : 'mb-6 flex flex-col gap-3.5 rounded-2xl border border-slate-200 bg-white p-4.5 sm:p-5 sm:flex-row sm:items-center sm:justify-between shadow-xs'
            }>
              <div className="flex items-center justify-between sm:justify-start gap-3.5">
                <span className={`font-subheading text-sm sm:text-base font-extrabold ${dark ? 'text-cyan-400' : 'text-[#7C3AED]'}`}>
                  {selectedCategory ? `${selectedCategory.label} (${posts.length}개)` : `전체 가이드 (${posts.length}개)`}
                </span>
                <span className={`font-tag text-xs sm:text-sm font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  페이지 {currentPage} / {totalPages}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="가이드 검색어 입력..." 
                    className={dark 
                      ? 'w-full rounded-xl border border-slate-700 bg-[#080d18] py-2.5 pl-10 pr-3.5 text-sm sm:text-base text-white placeholder-slate-400 outline-none focus:border-cyan-500 font-body' 
                      : 'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 font-body'
                    } 
                  />
                </div>
                <div className="flex items-center justify-end gap-1.5 shrink-0">
                  <span className={`font-tag text-xs sm:text-sm font-bold mr-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>표시:</span>
                  {[12, 24, 36].map((size) => (
                    <button
                      key={size}
                      onClick={() => setPageSize(size)}
                      className={`font-tag px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                        pageSize === size
                          ? dark
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-[#7C3AED] text-white font-black'
                          : dark
                            ? 'border border-slate-800 bg-[#080d18] text-slate-300 hover:text-white'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {size}개
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {paginatedPosts.length > 0 ? (
              <section id="related-posts-section" className="scroll-mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className={`rounded-3xl border p-8 sm:p-10 text-center ${
                dark ? 'border-purple-950/80 bg-[#100722]/90 shadow-2xl' : 'border-slate-200/90 bg-white shadow-sm'
              }`}>
                {/* Visual Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 dark:bg-purple-900/30 text-[#7C3AED] dark:text-purple-400 mb-5 border border-purple-200/50 dark:border-purple-800/40">
                  <Search className="h-8 w-8" />
                </div>

                <h3 className={`font-heading text-xl sm:text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {query ? `'${query}' 검색 결과가 없습니다` : '일치하는 가이드 포스팅이 없습니다'}
                </h3>
                <p className={`mt-2.5 text-sm sm:text-base max-w-lg mx-auto ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {query 
                    ? '원하시는 핵심 노하우를 구글 검색 엔진에서 최적화된 고급 검색 연산자(site: 등)로 즉시 찾아보실 수 있습니다.' 
                    : '선택하신 카테고리에 등록된 포스트가 없거나 검색 조건과 일치하지 않습니다.'}
                </p>

                {/* Highly Refined Google External Search Card */}
                {query.trim() && (() => {
                  const rawQuery = query.trim();
                  const siteQuery = `site:nutube.kr ${rawQuery}`;
                  const deepSearchQuery = `${rawQuery} (유튜브 OR 숏폼 OR 애드센스 OR 릴스 OR 틱톡 OR 수익화)`;
                  const googleSiteUrl = `https://www.google.com/search?q=${encodeURIComponent(siteQuery)}`;
                  const googleDeepUrl = `https://www.google.com/search?q=${encodeURIComponent(deepSearchQuery)}`;

                  return (
                    <div className={`mt-7 max-w-xl mx-auto rounded-2xl border p-5 sm:p-6 text-left ${
                      dark ? 'border-purple-900/50 bg-[#160b2e]/70' : 'border-purple-100 bg-purple-50/50'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className={`h-4 w-4 ${dark ? 'text-cyan-400' : 'text-[#7C3AED]'}`} />
                        <span className={`font-subheading text-xs sm:text-sm font-bold ${dark ? 'text-purple-200' : 'text-purple-900'}`}>
                          정밀 매칭 구글 외부 검색 옵션
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* 1. Precision Site Search */}
                        <a
                          href={googleSiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 cursor-pointer ${
                            dark 
                              ? 'border-purple-800/40 bg-purple-950/40 hover:bg-purple-900/40 text-slate-200' 
                              : 'border-white bg-white shadow-2xs hover:shadow-xs text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs">
                              1
                            </span>
                            <div className="min-w-0">
                              <p className="font-subheading text-xs sm:text-sm font-extrabold truncate">
                                크리에이터랩 사이트 정밀 검색
                              </p>
                              <p className={`font-mono text-[11px] truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {siteQuery}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 shrink-0 text-cyan-400 ml-2" />
                        </a>

                        {/* 2. Topic-Expanded Knowledge Search */}
                        <a
                          href={googleDeepUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 cursor-pointer ${
                            dark 
                              ? 'border-purple-800/40 bg-purple-950/40 hover:bg-purple-900/40 text-slate-200' 
                              : 'border-white bg-white shadow-2xs hover:shadow-xs text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]/20 text-purple-400 font-bold text-xs">
                              2
                            </span>
                            <div className="min-w-0">
                              <p className="font-subheading text-xs sm:text-sm font-extrabold truncate">
                                전체 웹 알고리즘 &amp; 수익화 심층 검색
                              </p>
                              <p className={`font-mono text-[11px] truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {deepSearchQuery}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 shrink-0 text-purple-400 ml-2" />
                        </a>
                      </div>
                    </div>
                  );
                })()}

                {/* Action Buttons */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setQuery('');
                      setCategory(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                  >
                    전체 가이드 다시보기
                  </button>

                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer border ${
                        dark 
                          ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white' 
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      검색어 지우기
                    </button>
                  )}
                </div>
              </div>
            )}

              {/* Pagination controls with mobile wrap */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row border-t border-slate-200/80 dark:border-purple-950/80 pt-6">
                  <div className={`font-tag text-xs sm:text-sm font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    페이지 <span className="font-black text-[#7C3AED] dark:text-purple-400">{currentPage}</span> / {totalPages} (총 <span className="font-bold">{posts.length}</span>개 가이드)
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-full">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className={dark
                        ? 'rounded-lg border border-purple-950 bg-[#120822] px-2.5 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-700'
                        : 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50'
                      }
                      title="첫 페이지"
                    >
                      « 처음
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={dark
                        ? 'rounded-lg border border-purple-950 bg-[#120822] px-3 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-700'
                        : 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50'
                      }
                    >
                      ‹ 이전
                    </button>

                    {/* Numbered page buttons */}
                    {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-slate-400 font-bold">
                            ...
                          </span>
                        );
                      }
                      const isCurrent = p === currentPage;
                      return (
                        <button
                          key={`page-${p}`}
                          onClick={() => handlePageChange(p as number)}
                          className={`min-w-[34px] rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-[#7C3AED] text-white font-black shadow-xs'
                              : dark
                                ? 'border border-purple-950 bg-[#120822] text-slate-300 hover:border-purple-700'
                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={dark
                        ? 'rounded-lg border border-purple-950 bg-[#120822] px-3 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-700'
                        : 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50'
                      }
                    >
                      다음 ›
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className={dark
                        ? 'rounded-lg border border-purple-950 bg-[#120822] px-2.5 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-700'
                        : 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50'
                      }
                      title="마지막 페이지"
                    >
                      끝 »
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}
        {tab === 'guide-detail' && post && <GuideReader post={post} categorySpec={CATEGORY_SPECS[post.category]} onBack={handleBack} theme={theme} />}
        {tab === 'about' && <InfoPage page={PAGE_CONTENT.about} theme={theme} />}
        {tab === 'contact' && <ContactForm theme={theme} />}
        {tab === 'terms' && <InfoPage page={PAGE_CONTENT.terms} theme={theme} />}
        {tab === 'privacy' && <InfoPage page={PAGE_CONTENT.privacy} theme={theme} />}
        {tab === 'search-console' && (
          <div className="mx-auto max-w-6xl px-4 py-10">
            <SearchConsoleManager theme={theme} />
          </div>
        )}
      </main>
      <footer className={dark 
        ? 'border-t border-slate-800 bg-[#060b14] px-4 py-10 text-center text-xs text-slate-400' 
        : 'border-t border-slate-200 bg-[#0d1527] px-4 py-10 text-center text-xs text-slate-300 shadow-sm'
      }>
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 font-impact text-2xl">
              <span className="text-white font-black tracking-tight text-2xl sm:text-3xl">크리에이터랩</span>
            </div>
            <span className="text-xs text-slate-300 font-medium">1인 창작자 &amp; 비디오 채널 성장을 위한 전문 라이브러리</span>
          </div>

          <div className="mb-6 flex flex-wrap justify-center gap-6 font-bold text-sm text-slate-200">
            <button onClick={() => go('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">소개</button>
            <button onClick={() => go('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">문의</button>
            <button onClick={() => go('privacy')} className="hover:text-cyan-400 transition-colors cursor-pointer">개인정보처리방침</button>
            <button onClick={() => go('terms')} className="hover:text-cyan-400 transition-colors cursor-pointer">이용약관</button>
          </div>

          <p className="mt-4 font-medium text-slate-400 text-xs tracking-wide">
            © 크리에이터랩 (Creator Lab) All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function InfoPage({ page, theme }: { page: { title: string; intro: string; updated: string; sections: PageSection[] }; theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className={dark 
        ? 'rounded-2xl border border-purple-950 bg-[#120822] p-7 shadow-xl sm:p-10' 
        : 'rounded-2xl border border-slate-100 bg-white p-7 shadow-xs sm:p-10'
      }>
        <p className="font-tag text-xs sm:text-sm font-bold text-[#7C3AED] dark:text-purple-400">최종 수정일: {page.updated}</p>
        <h1 className={dark ? 'mt-3 font-heading text-2xl sm:text-4xl font-black text-white tracking-tight' : 'mt-3 font-heading text-2xl sm:text-4xl font-black text-slate-900 tracking-tight'}>{page.title}</h1>
        <p className={dark ? 'mt-4 font-body text-base sm:text-lg leading-relaxed text-slate-300' : 'mt-4 font-body text-base sm:text-lg leading-relaxed text-slate-600'}>{page.intro}</p>
        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <section key={section.heading} className={dark ? 'rounded-xl border border-purple-950 bg-[#090314] p-6' : 'rounded-xl border border-slate-50 bg-[#F8FAFC] p-6'}>
              <h2 className={dark ? 'font-heading text-lg sm:text-xl font-extrabold text-white' : 'font-heading text-lg sm:text-xl font-extrabold text-slate-900'}>{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className={dark ? 'mt-3 font-body text-base sm:text-[17px] leading-relaxed text-slate-300' : 'mt-3 font-body text-base sm:text-[17px] leading-relaxed text-slate-600'}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className={dark ? 'mt-3.5 space-y-2 font-body text-base sm:text-[17px] leading-relaxed text-slate-300' : 'mt-3.5 space-y-2 font-body text-base sm:text-[17px] leading-relaxed text-slate-600'}>
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" /> 
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="mt-5 overflow-x-auto rounded-xl border border-purple-200/60 dark:border-purple-900/60 bg-white dark:bg-[#120822]/80">
                  <table className="w-full text-left text-sm sm:text-base border-collapse">
                    <thead className={dark ? 'bg-purple-950/80 text-purple-200 border-b border-purple-900' : 'bg-purple-50 text-slate-800 border-b border-purple-100'}>
                      <tr>
                        {section.table.headers.map((h, idx) => (
                          <th key={idx} className="font-heading px-4 py-3 font-extrabold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={`border-b last:border-0 ${dark ? 'border-purple-950/40 hover:bg-purple-950/30' : 'border-slate-100 hover:bg-slate-50/80'}`}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`font-body px-4 py-3 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
