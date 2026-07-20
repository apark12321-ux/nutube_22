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
    title: '나우크리에이터랩 소개',
    updated: '2026년 7월 19일',
    intro: '나우크리에이터랩은 유튜브 채널 운영자가 채널 개설부터 안정적인 수익화 조건 도달까지 겪게 되는 다양한 고민과 실무 단계를 돕기 위해 개설된 가이드 사이트입니다.',
    sections: [
      {
        heading: '사이트 운영 목적',
        body: [
          '유튜브 운영자는 영상 하나를 올리기 전에도 주제 선정, 제목 구성, 썸네일 방향, 업로드 설정, 댓글 관리, 수익화 조건 등 여러 결정을 해야 합니다. 나우크리에이터랩은 이 과정에서 초보자가 놓치기 쉬운 항목을 쉽게 확인할 수 있도록 실전형 체크리스트와 설명을 제공합니다.',
          '단순한 트렌드 요약이나 자극적인 성공담보다, 실제 운영자가 오늘 바로 점검할 수 있는 기준을 정리하는 것을 우선합니다.'
        ]
      },
      {
        heading: '편집 기준',
        body: [
          '나우크리에이터랩의 글은 방문자가 읽고 바로 실행할 수 있도록 결론, 조건, 절차, 주의사항, 확인 방법을 중심으로 구성합니다. 확정되지 않은 수익 보장 표현이나 과도한 클릭 유도 표현은 사용하지 않으며, 정책과 관련된 내용은 최신 공식 안내 확인을 함께 권장합니다.',
          '콘텐츠는 운영 경험과 공개된 공식 자료를 바탕으로 작성하되, 각 채널의 주제·타깃·제작 방식에 따라 결과가 달라질 수 있음을 전제로 합니다.'
        ]
      },
      {
        heading: '이 사이트가 지향하는 독자',
        items: [
          '유튜브 채널을 처음 시작하려는 개인 창작자',
          '쇼츠와 롱폼을 함께 운영하려는 초보 운영자',
          'AI 도구를 활용해 제작 시간을 줄이고 싶은 크리에이터',
          '채널 수익화 전 점검 항목을 정리하려는 운영자',
          '콘텐츠 품질과 정책 안전 지침을 일치시키고자 하는 기획자'
        ]
      }
    ]
  },
  contact: {
    title: '제휴 제안 & 문의',
    updated: '2026년 7월 19일',
    intro: '채널 맞춤 컨설팅, 비즈니스 제휴, 또는 사이트 제휴 문의를 남겨주시면 정성껏 검토 후 메일로 답변드리겠습니다.',
    sections: []
  },
  privacy: {
    title: '개인정보처리방침',
    updated: '2026년 7월 19일',
    intro: '나우크리에이터랩은 방문자의 개인정보를 소중하게 생각하며, 개인정보보호법 등 관련 법령을 준수합니다. 본 방침을 통해 수집된 정보가 어떻게 보호되고 관리되는지 알려드립니다.',
    sections: [
      {
        heading: '수집하는 개인정보 항목 및 목적',
        body: [
          '나우크리에이터랩은 별도의 회원가입 없이 누구나 자유롭게 이용할 수 있는 정보 제공용 웹사이트입니다.',
          '다만, 이용자가 "제휴 제안 및 문의" 양식을 통해 자발적으로 문의를 전송하는 경우, 원활한 답변 수집 및 회신을 위해 다음 정보를 수집할 수 있습니다:',
          '수집 항목: 이름(또는 닉네임), 이메일 주소, 문의 제목 및 내용'
        ]
      },
      {
        heading: '개인정보의 보유 및 이용 기간',
        body: [
          '원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 문의 접수 시 수집된 정보는 검토 및 답변 처리가 완료된 시점부터 지체 없이 삭제 또는 식별 불가능한 형태로 조치합니다.'
        ]
      },
      {
        heading: '쿠키 및 광고 서비스 안내',
        body: [
          '나우크리에이터랩은 사이트의 품질 개선, 안정적인 서비스 제공, 방문 통계 확인 및 광고 게재를 위해 쿠키(Cookie)를 활용할 수 있습니다. 이용자는 브라우저 옵션 설정을 통해 쿠키의 저장을 거부하거나 삭제할 수 있습니다.',
          'Google AdSense 등 제3자 광고 서비스가 적용되는 경우, 광고 제공자는 사용자의 관심사에 맞는 광고 제공과 부정 클릭 방지를 위해 쿠키를 사용할 수 있습니다.'
        ]
      },
      {
        heading: '제3자 제공 및 처리위탁',
        body: [
          '나우크리에이터랩은 사용자의 개인정보를 사전 동의 없이 외부에 판매하거나 임의로 제공하지 않습니다. 다만 법령에 따른 요청이 있거나 사이트 운영에 필요한 인프라, 분석, 광고 서비스 과정에서 필요한 범위 내에서 제3자 서비스가 사용될 수 있습니다.'
        ]
      },
      {
        heading: '이용자의 권리',
        items: [
          '본인이 제공한 개인정보의 열람 요청',
          '잘못된 정보의 정정 요청',
          '문의 정보 삭제 요청',
          '개인정보 처리에 대한 문의 및 이의 제기'
        ]
      },
      {
        heading: '개인정보 문의',
        body: ['개인정보 관련 문의는 apark12321@gmail.com 으로 보내주시면 확인 후 답변드리겠습니다.']
      }
    ]
  },
  terms: {
    title: '이용약관',
    updated: '2026년 6월 23일',
    intro: '본 약관은 나우크리에이터랩 사이트 이용과 콘텐츠 활용에 관한 기본 기준을 안내합니다. 사이트를 이용하는 경우 본 약관에 동의한 것으로 봅니다.',
    sections: [
      {
        heading: '서비스의 성격',
        body: [
          '나우크리에이터랩은 유튜브 채널 운영에 필요한 참고 정보를 제공하는 정보형 사이트입니다. 제공되는 내용은 일반적인 참고 자료이며, YouTube, Google, AdSense 등 플랫폼의 공식 입장이나 최종 판단을 대체하지 않습니다.'
        ]
      },
      {
        heading: '이용자의 책임',
        body: [
          '이용자는 나우크리에이터랩의 정보를 참고하여 본인 채널과 상황에 맞게 판단해야 합니다. 정책, 수익화 조건, 광고 관련 기준은 수시로 바뀔 수 있으므로 중요한 결정 전에는 반드시 공식 문서와 본인 계정 화면을 함께 확인해야 합니다.'
        ]
      },
      {
        heading: '콘텐츠 저작권',
        body: [
          '나우크리에이터랩에 게시된 글, 구성, 이미지, 편집 요소의 저작권은 사이트 운영자 또는 해당 권리자에게 있습니다. 개인 학습과 참고 목적의 이용은 가능하지만, 무단 복제, 대량 수집, 재배포, 상업적 재가공은 허용하지 않습니다.'
        ]
      },
      {
        heading: '외부 링크',
        body: [
          '나우크리에이터랩은 공식 자료 확인을 돕기 위해 외부 링크를 제공할 수 있습니다. 외부 사이트의 내용, 개인정보 처리, 서비스 제공 방식은 해당 사이트의 정책에 따르며 나우크리에이터랩이 통제하지 않습니다.'
        ]
      },
      {
        heading: '금지 행위',
        items: [
          '사이트 또는 서버에 과도한 부하를 주는 자동화 접근',
          '콘텐츠 무단 수집, 복제, 재배포',
          '문의 채널을 통한 스팸, 악성 링크, 허위 정보 전송',
          '타인의 권리나 사이트 운영을 방해하는 행위'
        ]
      },
      {
        heading: '면책 조항',
        body: [
          '나우크리에이터랩은 정보의 정확성을 높이기 위해 노력하지만, 모든 정보의 완전성이나 최신성을 보장하지는 않습니다. 사용자가 사이트 정보를 활용해 내린 결정과 그 결과에 대한 책임은 사용자 본인에게 있습니다.',
          '광고 수익, 채널 성장, 승인 여부 등은 플랫폼 정책, 콘텐츠 품질, 시청자 반응, 운영 방식에 따라 달라지므로 특정 결과를 보장하지 않습니다.'
        ]
      },
      {
        heading: '약관 변경',
        body: [
          '사이트 운영 상황이나 관련 정책 변화에 따라 본 약관은 수정될 수 있습니다. 변경된 내용은 본 페이지에 반영하며, 표시된 최종 수정일을 기준으로 효력이 발생합니다.'
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
