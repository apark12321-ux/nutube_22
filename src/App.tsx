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
    title: '운영자 소개 & 블로그 철학',
    updated: '2026년 8월 30일',
    intro: '안녕하세요, 1인 미디어와 콘텐츠 엔지니어링을 전달하는 운영자 민우입니다. 300만 원짜리 장비 욕심으로 시작했다가 쓰라린 실패를 맛본 뒤, 스마트폰 한 대로 0에서부터 다시 쌓아 올린 실전 크리에이터의 이야기입니다.',
    sections: [
      {
        heading: '1. 장비 욕심으로 300만 원 날리고 얻은 교훈',
        body: [
          '처음 유튜브를 시작했을 때 "장비가 좋아야 구독자가 는다"는 생각에 미러리스 카메라와 무거운 삼각대, 80만 원짜리 조명부터 질렀습니다. 결과는 어땠을까요? 세팅하는 데 지쳐서 한 달에 영상 2개 올리기도 벅찼고, 조회수는 두 자릿수에 머물렀습니다.',
          '방에 쌓인 장비를 중고로 처분하고, 주머니 속 스마트폰과 5천 원짜리 다이소 거치대 하나로 다시 시작했습니다. 그때 깨달았습니다. 시청자가 원하는 건 4K 화질이 아니라, "3초 안에 내 문제를 해결해 주는 알맹이"라는 사실을요.'
        ]
      },
      {
        heading: '2. 왜 이 공유 공간을 만들었는가',
        body: [
          '유튜브와 블로그를 키우는 과정에서 인터넷에 넘쳐나는 "하루 10분으로 월 천만 원" 같은 허황된 강의와 자극적인 어그로에 지쳤습니다.',
          '쇼츠 100만 뷰를 찍었을 때 실제로 통장에 들어온 정산금의 실체, 스마트폰 하나로 시작하는 0원 세팅, 캡컷으로 편집 시간 80% 줄이는 꿀팁, 전자책과 제휴로 월 100만 원 파이프라인을 만드는 법 등 제가 직접 겪으며 터득한 알짜배기 노하우를 누구나 알기 쉽게 전해드리기 위해 이 공간을 만들었습니다.'
        ]
      },
      {
        heading: '3. 크리에이터 노트의 3대 운영 원칙',
        items: [
          '직접 겪어보지 않은 뜬구름 잡는 이론이나 복붙성 정보는 절대 쓰지 않습니다.',
          '모든 가이드에는 실제 적용해 보고 겪었던 실패 사례와 아쉬웠던 점(주관적 평가)을 함께 남깁니다.',
          '독자 여러분이 글을 다 읽고 "그래서 오늘 당장 뭘 해야 하지?"라는 물음표가 남지 않도록 구체적인 실행 행동(Action Item)을 제시합니다.'
        ]
      },
      {
        heading: '4. 크리에이터 고민 & 소통',
        body: [
          '혼자 채널을 운영하거나 블로그를 쓰다 보면 막막하고 외로울 때가 많습니다. 글 내용에 대해 궁금한 점이나 나누고 싶은 고민이 있다면 언제든 [문의] 페이지를 통해 편하게 남겨주세요. 제가 아는 선에서 진솔하게 답해드리겠습니다.'
        ]
      }
    ]
  },
  contact: {
    title: '문의 및 피드백',
    updated: '2026년 8월 30일',
    intro: '크리에이터 노트에 담긴 가이드 내용에 대한 피드백, 제휴 제안, 혹은 유튜브/블로그 운영 중 겪는 고민이 있으시다면 언제든 편하게 남겨주세요.',
    sections: [
      {
        heading: '1. 온라인 문의 안내',
        body: [
          '블로그 내 [온라인 문의 양식]을 통해 성함, 이메일 주소, 문의 내용을 남겨주시면 작성자(민우)가 직접 확인합니다.',
          '영업일 기준 24~48시간 이내에 기재해 주신 회신 이메일로 답변을 보내드립니다.'
        ]
      },
      {
        heading: '2. 문의 가능 분야',
        items: [
          '유튜브 채널 기획, 스마트폰 촬영 및 캡컷 컷편집 관련 질문',
          '구글 애드센스 승인 및 블로그 글쓰기 피드백',
          '전자책/디지털 상품 기획 및 1인 크리에이터 협업 제휴'
        ]
      }
    ]
  },
  terms: {
    title: '이용약관 및 면책조항 (Terms of Service & Disclaimer)',
    updated: '2026년 8월 30일',
    intro: '크리에이터 노트(Creator Note)를 방문해 주셔서 감사합니다. 본 사이트의 콘텐츠 열람, 저작권, 그리고 정보 이용에 관한 규정 및 면책조항입니다.',
    sections: [
      {
        heading: '1. 저작권 및 콘텐츠 인용 규정',
        body: [
          '본 블로그에 게시된 모든 텍스트, 데이터 차트, 이미지 캡션 및 실전 노하우는 작성자가 직접 연구하고 경험한 창작물입니다.',
          '비상업적인 목적의 출처 표기 인용(본문 링크 포함)은 자유롭게 허용되나, 사전 동의 없는 무단 전문 복제, 상업적 재판매, 크롤링을 통한 2차 가공은 엄격히 금지됩니다.'
        ]
      },
      {
        heading: '2. 수익 및 성과 관련 면책조항 (Disclaimer)',
        body: [
          '본 블로그에서 다루는 유튜브 조회수, 시청 지속 시간, 클릭률(CTR), 구글 애드센스 정산금 및 부수입 데이터는 작성자 본인의 실제 경험에 기반한 참고용 사례입니다.',
          '개별 채널의 카테고리, 시청자층, 운영 시기 및 알고리즘 변동에 따라 실제 성과는 달라질 수 있으며, 본 사이트의 내용은 특정 금액이나 수익의 확정적인 결과를 보장하지 않습니다.'
        ]
      },
      {
        heading: '3. 외부 링크 및 제3자 서비스에 관한 고지',
        body: [
          '본 블로그에는 독자의 편의를 위해 유튜브 스튜디오, 구글 서치콘솔 등 외부 공식 서비스 링크가 포함될 수 있습니다. 외부 사이트의 정책 및 운영에 대해서는 해당 사이트의 약관이 적용됩니다.'
        ]
      }
    ]
  },
  privacy: {
    title: '개인정보처리방침 (Privacy Policy)',
    updated: '2026년 8월 30일',
    intro: '크리에이터 노트(이하 "블로그")는 정보통신망 이용촉진 및 정보보호 등에 관한 법률 및 구글 애드센스(Google AdSense) 프로그램 정책을 준수하며, 방문자의 개인정보와 브라우징 권리를 최우선으로 보호합니다.',
    sections: [
      {
        heading: '1. 수집하는 개인정보 항목 및 수집 방법',
        body: [
          '본 블로그는 별도의 회원가입 없이 누구나 모든 글과 자료를 열람할 수 있습니다.',
          '방문자가 [문의하기] 양식을 통해 자발적으로 문의를 접수하는 경우에 한해 성함, 이메일 주소, 문의 내용이 수집되며, 이는 오직 문의에 대한 회신 목적으로만 사용된 후 파기됩니다.'
        ]
      },
      {
        heading: '2. 쿠키(Cookie) 및 구글 애드센스(Google AdSense) 광고 게재 고지',
        body: [
          '본 블로그는 구글(Google LLC)을 포함한 제3자 광고 사업자가 제공하는 광고 서비스(Google AdSense)를 이용합니다.',
          '구글 및 제3자 제공업체는 쿠키(DART 쿠키 등)를 사용하여 사용자의 본 사이트 및 다른 웹사이트 방문 내역을 바탕으로 관심사 기반의 맞춤형 광고를 게재할 수 있습니다.',
          '사용자는 원치 않을 경우 광고 설정(https://www.google.com/settings/ads) 페이지를 방문하여 구글의 개인 맞춤 광고 설정을 직접 해제(Opt-out)하거나 관리하실 수 있습니다.',
          '또한 www.aboutads.info 사이트를 방문하여 제3자 공급업체의 맞춤형 광고용 쿠키 사용을 선택적으로 비활성화할 수 있습니다.'
        ]
      },
      {
        heading: '3. 웹사이트 트래픽 분석 (Google Analytics)',
        body: [
          '본 블로그는 사이트 개선 및 독자 선호도 분석을 위해 구글 애널리틱스(Google Analytics) 등의 웹로그 분석 도구를 활용할 수 있습니다. 이는 익명화된 통계 정보(방문 페이지, 체류 시간, 유입 경로 등)만을 수집하며 개인을 식별하지 않습니다.'
        ]
      },
      {
        heading: '4. 개인정보 보호 책임자 및 문의처',
        body: [
          '개인정보 및 본 방침에 관한 문의사항이 있으실 경우 블로그 하단의 [문의] 페이지를 통해 접수해 주시면 성실히 처리해 드리겠습니다.'
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
            
            {/* Editorial Introduction Banner - 4-Step Roadmap */}
            <div className={`mb-8 p-6 sm:p-8 rounded-3xl border transition-all ${
              dark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200/80 bg-white shadow-xs'
            }`}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  민우의 크리에이터 가이드
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">1인 크리에이터의 쉽고 유익한 실전 이야기</span>
              </div>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>
                스마트폰 하나로 가볍게 시작하는 1인 크리에이터 실전 가이드
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                왜 지금 유튜브를 해야 하는지부터 얼굴 없이 시작하는 법, 요즘 알고리즘 트렌드, 똑똑한 AI 활용법, 그리고 현실적인 수익화 파이프라인까지 누구나 쉽고 재미있게 읽을 수 있도록 핵심만 알차게 담았습니다.
              </p>
            </div>

            {/* Clean Category Filter Tabs */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {[
                  { key: null, label: '전체 글' },
                  ...CATEGORIES_LIST.map((c) => ({ key: c.key, label: c.label }))
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
                총 {posts.length}개의 가이드
              </span>
            </div>

            {/* Main Blog Post List Feed */}
            {paginatedPosts.length > 0 ? (
              <section id="blog-posts-feed" className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {paginatedPosts.map((item, idx) => (
                  <PostCard 
                    key={item.slug} 
                    post={item} 
                    href={getPostPath(item)} 
                    theme={theme} 
                    accentColor={CATEGORY_SPECS[item.category]?.accentColor || '#38bdf8'} 
                    onSelect={openPost} 
                    index={idx}
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
              <span className="font-bold text-slate-900 dark:text-white">크리에이터 가이드</span>
              <span className="text-slate-400">| 1인 미디어 운영 실전 노하우</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <button onClick={() => go('about')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">블로그 소개</button>
              <button onClick={() => go('contact')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">문의</button>
              <button onClick={() => go('privacy')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">개인정보처리방침</button>
              <button onClick={() => go('terms')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">이용약관</button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-400">
            <p>© 2026 크리에이터 가이드 (Creator Guide). All rights reserved.</p>
            <p>1인 크리에이터의 쉽고 유익한 유튜브 실전 이야기</p>
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
