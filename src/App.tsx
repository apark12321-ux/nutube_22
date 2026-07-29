import { useEffect, useMemo, useState } from 'react';
import { Search, Rocket, FileText, Zap, Image, DollarSign, CheckSquare, Sparkles } from 'lucide-react';
import { ALL_POSTS, CATEGORIES_LIST, CATEGORY_SPECS } from './data';
import { GuidePost } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { GuideReader } from './components/GuideReader';
import { ContactForm } from './components/ContactForm';
import { applyPostDateSchedule, getPostPath, postTitleSegment } from './postSchedule';

type Tab = 'guides' | 'about' | 'contact' | 'terms' | 'privacy' | 'guide-detail';

interface RouteState {
  tab: Tab;
  post: GuidePost | null;
  category: string | null;
}

interface PageSection {
  heading: string;
  body?: string[];
  items?: string[];
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

  return { tab: 'guides', post: null, category: null };
};

const pathForTab = (tab: Tab, post?: GuidePost | null) => {
  if (tab === 'guide-detail' && post) return getPostPath(post);
  if (tab === 'about') return '/about';
  if (tab === 'contact') return '/contact';
  if (tab === 'terms') return '/terms';
  if (tab === 'privacy') return '/privacy';
  return '/';
};

const initialRoute = (): RouteState => {
  if (typeof window === 'undefined') return { tab: 'guides', post: null, category: null };
  return resolveRoute(window.location.pathname);
};

const PAGE_CONTENT: Record<'about' | 'contact' | 'privacy' | 'terms', { title: string; intro: string; updated: string; sections: PageSection[] }> = {
  about: {
    title: '나우크리에이터랩 (Now Creator Lab) 소개',
    updated: '2026년 7월 28일',
    intro: '나우크리에이터랩(Now Creator Lab)은 유튜브, 인스타그램, 틱톡, 블로그 크리에이터 및 디지털 창작자가 콘텐츠 기획부터 안정적인 수익화 조건 도달까지 겪게 되는 핵심 실무 기준과 검증된 가이드를 제공하는 전문 매체입니다.',
    sections: [
      {
        heading: '1. 사이트 설립 및 운영 목적',
        body: [
          '디지털 크리에이터 시장이 대중화됨에 따라 단순 자극적 성공담이나 불확실한 낚시성 정보가 범람하고 있습니다. 나우크리에이터랩은 크리에이터가 영상 하나를 기획·제작할 때 필요한 실전 체크리스트와 알고리즘 구조적 원리를 투명하고 객관적으로 제공하는 것을 목표로 합니다.',
          '본 사이트는 초보 창작자부터 전업 크리에이터까지 언제든 들러 신뢰할 수 있는 가이드라인을 바로 확인할 수 있는 실전 보관소로 운영됩니다.'
        ]
      },
      {
        heading: '2. 편집 기준 및 투명성 (EEAT 지침)',
        body: [
          '나우크리에이터랩의 모든 글은 구글/유튜브 공식 지원센터 가이드라인 및 최신 알고리즘 정책 변화를 바탕으로 자체 검증하여 작성합니다.',
          '과장되거나 확정되지 않은 수익 보장 표현을 일절 사용하지 않으며, 특정 플랫폼 정책 변경 시 관련 본문 내용도 주기적으로 업데이트합니다.'
        ]
      },
      {
        heading: '3. 매체 운영 및 문의 정보',
        body: [
          '매체명: 나우크리에이터랩 (Now Creator Lab)',
          '주요 전문 분야: 유튜브 알고리즘, 쇼츠 기획, 구글 애드센스 SEO/AEO/GEO, 지식창업 수익화',
          '공식 문의 이메일: apark12321@gmail.com',
          '사이트 주소: https://nutube.kr'
        ]
      },
      {
        heading: '4. 대상 독자층',
        items: [
          '유튜브 채널을 처음 개설하려는 1인 창작자',
          '쇼츠와 롱폼 채널의 알고리즘 노출 및 체류 시간을 높이고 싶은 크리에이터',
          '구글 애드센스 승인 및 블로그 SEO/GEO 최적화 노하우를 찾는 운영자',
          'AI 도구(미드저니, 일레븐랩스 등)를 결합해 고품질 콘텐츠를 제작하려는 기획자'
        ]
      }
    ]
  },
  contact: {
    title: '제휴 제안 & 공식 문의',
    updated: '2026년 7월 28일',
    intro: '콘텐츠 제보, 비즈니스 제휴, 기술 문의 및 오탈자 제보는 접수 양식을 통해 남겨주시면 정성껏 검토 후 24시간 이내 회신드립니다.',
    sections: []
  },
  privacy: {
    title: '개인정보처리방침 (Privacy Policy)',
    updated: '2026년 7월 28일',
    intro: '나우크리에이터랩(Now Creator Lab)은 방문자의 개인정보 보호를 매우 중요하게 생각하며, 개인정보보호법 및 구글 애드센스 광고 정책 등 관련 규정을 철저히 준수합니다. 본 방침을 통해 수집되는 개인정보와 쿠키 활용 범위를 명확히 고지합니다.',
    sections: [
      {
        heading: '1. 수집하는 개인정보 항목 및 수집 방법',
        body: [
          '나우크리에이터랩은 별도의 회원가입이나 로그인 없이 모든 가이드와 정보를 자유롭게 열람할 수 있는 오픈 정보 사이트입니다.',
          '이용자가 "제휴 제안 & 문의하기" 양식을 통해 자발적으로 문의를 보낼 때 회신 처리를 위해 다음 정보가 수집됩니다:',
          '수집 항목: 성명(또는 닉네임), 이메일 주소, 문의 제목 및 본문 내용'
        ]
      },
      {
        heading: '2. 구글 애드센스(Google AdSense) 및 쿠키(Cookie) 이용 고지',
        body: [
          '나우크리에이터랩은 품질 개선 및 사용자 맞춤형 광고 제공을 위해 쿠키(Cookie)를 활용할 수 있습니다.',
          '구글(Google)을 포함한 제3자 광고 제공업체는 사용자의 본 사이트 및 다른 웹사이트 방문 기록을 바탕으로 관련성 높은 광고를 게재하기 위해 쿠키(DART 쿠키 등)를 사용합니다.',
          '이용자는 구글 광고 설정 페이지(https://adssettings.google.com)를 방문하여 맞춤형 광고 수집 및 이용을 비활성화할 수 있습니다.',
          '웹 브라우저 상단 설정 메뉴(옵션 > 개인정보 보호)에서 쿠키 저장을 거부하거나 기존 쿠키를 원클릭으로 삭제할 수 있습니다.'
        ]
      },
      {
        heading: '3. 개인정보의 보유, 이용 기간 및 파기 절차',
        body: [
          '수집된 문의 내역은 답변 완료 및 관련 상담 처리가 끝난 후 지체 없이 완전히 파기하거나 식별 불가능한 형태로 안전하게 처리합니다.'
        ]
      },
      {
        heading: '4. 제3자 제공 및 처리위탁 금지',
        body: [
          '원칙적으로 사용자의 개인정보를 외부에 매매, 양도, 제공하지 않습니다. 법령에 따른 공식 수사 기관의 요청이 있거나 서비스 운영에 필수적인 최소 인프라 범위 외에는 외부 유출이 차단됩니다.'
        ]
      },
      {
        heading: '5. 개인정보 보호책임자 및 문의처',
        body: [
          '개인정보 관리 및 방침 관련 문의는 공식 이메일(apark12321@gmail.com)로 접수해 주시면 지체 없이 안내해 드립니다.'
        ]
      }
    ]
  },
  terms: {
    title: '이용약관 (Terms of Service)',
    updated: '2026년 7월 28일',
    intro: '본 약관은 나우크리에이터랩 사이트 이용과 콘텐츠 활용에 관한 기본 규칙 및 제반 사항을 규정합니다. 사이트를 이용함과 동시에 본 약관에 동의한 것으로 간주됩니다.',
    sections: [
      {
        heading: '1. 서비스 목적 및 정보의 성격',
        body: [
          '나우크리에이터랩은 크리에이터 성장 및 수익화를 돕는 참고 정보를 제공합니다. 본 사이트의 가이드는 교육 및 연구 목적으로 제공되는 일반 지침이며, YouTube, Google, Meta 등 공식 기업의 최종 판결을 대신하지 않습니다.'
        ]
      },
      {
        heading: '2. 이용자의 책임 및 판단',
        body: [
          '플랫폼 정책과 알고리즘 기준은 상시 변동되므로 중요한 비즈니스적 결정 전에는 반드시 각 플랫폼의 공식 도움말 문서 및 본인 계정 관리창을 최종 재확인해야 합니다.'
        ]
      },
      {
        heading: '3. 지식재산권 및 저작권 보호',
        body: [
          '나우크리에이터랩에 수록된 모든 글, 이미지, 디자인 요소 및 템플릿의 저작권은 사이트 운영자에게 있습니다. 개인 학습 목적의 참조는 자유로우나, 크롤러를 통한 무단 대량 수집(Scraping), 자동화 재배포, 상업적 재가공은 법적으로 금지됩니다.'
        ]
      },
      {
        heading: '4. 외부 링크 및 면책 조항',
        body: [
          '공식 자료 확인을 돕기 위해 외부 링크가 포함될 수 있으며, 외부 사이트의 개인정보 방침 및 서비스 내용은 해당 웹사이트 정책을 따릅니다.',
          '정보의 정확성과 최신성을 높이기 위해 최선을 다하나, 사용자가 사이트 정보를 바탕으로 내린 실행 결과나 특정 수익화 성과에 대해서는 법적 보증책임을 지지 않습니다.'
        ]
      }
    ]
  }
};


export default function App() {
  const route = initialRoute();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [tab, setTab] = useState<Tab>(route.tab);
  const [post, setPost] = useState<GuidePost | null>(route.post);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(route.category);

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

  const selectedCategory = category ? CATEGORIES_LIST.find((item) => item.key === category) : null;

  const scrollToPosts = () => {
    window.setTimeout(() => {
      const target = document.getElementById('related-posts-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
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
          <>
            <section className={dark 
              ? 'border-b border-purple-950 bg-gradient-to-b from-[#13062b] to-[#090314] py-14' 
              : 'border-b border-slate-100 bg-white py-14'
            }>
              <div className="mx-auto max-w-6xl px-4 break-keep">
                <div className="text-center">
                  <div className={dark 
                    ? 'inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-black text-purple-400 border border-purple-500/20 shadow-sm' 
                    : 'inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-[#7C3AED] border border-purple-100'
                  }>
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>2026 실전 유튜브 성장 로드맵 & 가이드</span>
                  </div>
                  <h1 className={dark 
                    ? 'mt-4 text-[26px] sm:text-4xl font-black text-white tracking-tight leading-tight' 
                    : 'mt-4 text-[26px] sm:text-4xl font-black text-slate-900 tracking-tight leading-tight'
                  }>
                    성공하는 1인 크리에이터를 위한<br />
                    <span className="bg-gradient-to-r from-[#7C3AED] to-indigo-500 bg-clip-text text-transparent">단계별 실무 가이드 및 핵심 노하우</span>
                  </h1>
                  <p className={dark 
                    ? 'mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-300' 
                    : 'mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-600'
                  }>
                    첫 3초 시선을 사로잡는 쇼츠 기획 공식부터 고수익 광고 단가(RPM) 최적화, 클릭률(CTR)을 견인하는 썸네일 노하우까지! 누구나 단계별 체크리스트를 따라 읽고 오늘 바로 실전에 적용해 보세요.
                  </p>
                </div>

                {/* Interactive 5-Step Checklist Roadmap in Purple Styling */}
                <div className="mt-10">
                  <p className={dark ? 'text-center text-[10.5px] font-bold text-purple-400 mb-4' : 'text-center text-[10.5px] font-bold text-slate-500 mb-4'}>
                    👇 각 로드맵 단계를 클릭하여 관련 실전 가이드를 검색해 보세요
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                      {
                        step: '1단계',
                        title: '채널 시작',
                        icon: Rocket,
                        color: 'from-orange-500 to-amber-500',
                        desc: '브랜드 채널 세팅 및 핵심 타겟팅 기초',
                        search: '개설',
                      },
                      {
                        step: '2단계',
                        title: '콘텐츠 기획',
                        icon: FileText,
                        color: 'from-purple-500 to-indigo-500',
                        desc: '알고리즘 피드 노출을 늘리는 시각 기획 공식',
                        search: '기획',
                      },
                      {
                        step: '3단계',
                        title: '쇼츠 운영',
                        icon: Zap,
                        color: 'from-rose-500 to-pink-500',
                        desc: '첫 3초 후크 장치와 빠른 프레임 전환 연출',
                        search: '쇼츠',
                      },
                      {
                        step: '4단계',
                        title: '썸네일 점검',
                        icon: Image,
                        color: 'from-blue-500 to-indigo-600',
                        desc: '클릭률 극대화를 위한 레이아웃 자가 진단',
                        search: '썸네일',
                      },
                      {
                        step: '5단계',
                        title: '수익화 준비',
                        icon: DollarSign,
                        color: 'from-emerald-500 to-teal-500',
                        desc: '애드센스 휴면 및 정밀 승인 프로세스',
                        search: '수익',
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isFiltering = query === item.search;
                      return (
                        <button
                          key={item.title}
                          onClick={() => {
                            setQuery(item.search);
                            scrollToPosts();
                          }}
                          className={dark 
                            ? `group relative rounded-2xl border ${isFiltering ? 'border-purple-500 bg-purple-950/20' : 'border-purple-950 bg-[#140b2a]'} p-5 text-left transition duration-300 hover:border-purple-700 hover:-translate-y-1 hover:shadow-lg`
                            : `group relative rounded-2xl border ${isFiltering ? 'border-purple-400 bg-purple-50/45' : 'border-slate-100 bg-white'} p-5 text-left shadow-xs transition duration-300 hover:border-purple-200 hover:-translate-y-1 hover:shadow-sm`
                          }
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={dark ? 'text-[9px] font-black tracking-widest text-purple-400 uppercase' : 'text-[9px] font-black tracking-widest text-slate-400 uppercase'}>
                              {item.step}
                            </span>
                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-white shadow-xs`}>
                              <Icon className="h-4 w-4" />
                            </span>
                          </div>
                          <h3 className={dark ? 'text-[13px] font-extrabold text-white group-hover:text-purple-400 transition-colors' : 'text-[13px] font-extrabold text-slate-900 group-hover:text-[#7C3AED] transition-colors'}>
                            {item.title}
                          </h3>
                          <p className={dark ? 'mt-2 text-[11px] leading-relaxed text-slate-400' : 'mt-2 text-[11px] leading-relaxed text-slate-500'}>
                            {item.desc}
                          </p>
                          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#7C3AED] dark:text-purple-400">
                            <CheckSquare className="h-3 w-3" />
                            <span>체크리스트 보기</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Category-aware Post Filter Header Block */}
              <div className={dark 
                ? 'mb-8 rounded-2xl border border-purple-950/50 bg-[#120822] p-5' 
                : 'mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs'
              }>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider uppercase text-[#7C3AED] dark:text-purple-400">포스팅 리스트</p>
                    <h2 className={dark ? 'mt-1 text-lg font-black text-white' : 'mt-1 text-lg font-black text-slate-900'}>
                      {selectedCategory ? `${selectedCategory.label} 가이드` : '전체 가이드'}
                    </h2>
                    <p className={dark ? 'mt-1 text-xs text-sky-300/60' : 'mt-1 text-xs text-slate-500'}>
                      {selectedCategory ? `${posts.length}개의 관련 글을 확인할 수 있습니다.` : `${posts.length}개의 전체 글을 확인할 수 있습니다.`}
                    </p>
                  </div>
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="가이드 검색" className={dark ? 'w-full rounded-xl border border-sky-950 bg-[#021321] py-2.5 pl-10 pr-4 text-sm text-white outline-none' : 'w-full rounded-xl border border-sky-100 bg-sky-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none'} />
                  </div>
                </div>
              </div>

              <section id="related-posts-section" className="scroll-mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((item) => <PostCard key={item.slug} post={item} href={getPostPath(item)} theme={theme} accentColor={CATEGORY_SPECS[item.category]?.accentColor || '#38bdf8'} onSelect={openPost} />)}
              </section>
            </div>
          </>
        )}
        {tab === 'guide-detail' && post && <GuideReader post={post} categorySpec={CATEGORY_SPECS[post.category]} onBack={handleBack} theme={theme} />}
        {tab === 'about' && <InfoPage page={PAGE_CONTENT.about} theme={theme} />}
        {tab === 'contact' && <ContactForm theme={theme} />}
        {tab === 'terms' && <InfoPage page={PAGE_CONTENT.terms} theme={theme} />}
        {tab === 'privacy' && <InfoPage page={PAGE_CONTENT.privacy} theme={theme} />}
      </main>
      <footer className={dark 
        ? 'border-t border-purple-950 bg-[#0c051a] px-4 py-8 text-center text-xs text-slate-400' 
        : 'border-t border-slate-100 bg-white px-4 py-8 text-center text-xs text-slate-500 shadow-sm'
      }>
        <div className="mb-4 flex flex-wrap justify-center gap-5 font-bold">
          <button onClick={() => go('about')} className="hover:text-[#7C3AED] transition-colors cursor-pointer">소개</button>
          <button onClick={() => go('contact')} className="hover:text-[#7C3AED] transition-colors cursor-pointer">제휴 제안 & 문의</button>
          <button onClick={() => go('privacy')} className="hover:text-[#7C3AED] transition-colors cursor-pointer">개인정보처리방침</button>
          <button onClick={() => go('terms')} className="hover:text-[#7C3AED] transition-colors cursor-pointer">이용약관</button>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto">
          본 사이트는 유튜브 채널 성장 전략을 다루는 가이드이며, 플랫폼 공식 제휴사가 아닌 독립 기획 정보소입니다.
        </p>
        <p className="mt-2 font-semibold text-slate-400 dark:text-slate-500">
          © 나우크리에이터랩 All rights reserved.
        </p>
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
        <p className="text-xs font-bold text-[#7C3AED] dark:text-purple-400">최종 수정일: {page.updated}</p>
        <h1 className={dark ? 'mt-3 text-2xl sm:text-3xl font-black text-white' : 'mt-3 text-2xl sm:text-3xl font-black text-slate-900'}>{page.title}</h1>
        <p className={dark ? 'mt-4 text-xs sm:text-sm leading-relaxed text-slate-300' : 'mt-4 text-xs sm:text-sm leading-relaxed text-slate-600'}>{page.intro}</p>
        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <section key={section.heading} className={dark ? 'rounded-xl border border-purple-950 bg-[#090314] p-5' : 'rounded-xl border border-slate-50 bg-[#F8FAFC] p-5'}>
              <h2 className={dark ? 'text-sm font-extrabold text-white' : 'text-sm font-extrabold text-slate-900'}>{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className={dark ? 'mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-300' : 'mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600'}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className={dark ? 'mt-3 space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-300' : 'mt-3 space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-600'}>
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" /> 
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
