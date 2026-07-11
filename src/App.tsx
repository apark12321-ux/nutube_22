import { useEffect, useMemo, useState } from 'react';
import { Search, Rocket, FileText, Zap, Image, DollarSign, CheckSquare, Sparkles } from 'lucide-react';
import { ALL_POSTS, CATEGORIES_LIST, CATEGORY_SPECS } from './data';
import { GuidePost } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { GuideReader } from './components/GuideReader';
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
    title: 'NuTube 소개',
    updated: '2026년 6월 23일',
    intro: 'NuTube는 유튜브 채널 운영자가 채널 개설부터 영상 기획, 쇼츠 운영, 댓글 관리, 수익화 준비까지 단계별로 점검할 수 있도록 돕는 독립 정보 가이드 사이트입니다.',
    sections: [
      {
        heading: '사이트 운영 목적',
        body: [
          '유튜브 운영자는 영상 하나를 올리기 전에도 주제 선정, 제목 구성, 썸네일 방향, 업로드 설정, 댓글 관리, 수익화 조건 등 여러 결정을 해야 합니다. NuTube는 이 과정에서 초보자가 놓치기 쉬운 항목을 쉽게 확인할 수 있도록 실전형 체크리스트와 설명을 제공합니다.',
          '단순한 트렌드 요약이나 자극적인 성공담보다, 실제 운영자가 오늘 바로 점검할 수 있는 기준을 정리하는 것을 우선합니다.'
        ]
      },
      {
        heading: '주요 콘텐츠 범위',
        items: [
          '유튜브 추천 알고리즘과 시청 지속 시간 이해',
          '왕초보 채널 개설 및 첫 업로드 준비',
          '쇼츠 콘텐츠 기획, 스토리텔링, 댓글 소통 방법',
          'AI 도구를 활용한 대본·음성·자막 제작 흐름',
          '광고 수익, 멤버십, 협찬 등 수익화 준비 체크리스트',
          '정책 변경 시 확인해야 할 공식 출처와 주의사항'
        ]
      },
      {
        heading: '편집 기준',
        body: [
          'NuTube의 글은 방문자가 읽고 바로 실행할 수 있도록 결론, 조건, 절차, 주의사항, 확인 방법을 중심으로 구성합니다. 확정되지 않은 수익 보장 표현이나 과도한 클릭 유도 표현은 사용하지 않으며, 정책과 관련된 내용은 최신 공식 안내 확인을 함께 권장합니다.',
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
          '콘텐츠 품질과 정책 안정성을 함께 챙기려는 미디어 운영자'
        ]
      }
    ]
  },
  contact: {
    title: '문의 및 오류 제보',
    updated: '2026년 6월 23일',
    intro: 'NuTube는 사이트 이용 중 발견한 오류, 최신 정책 반영 요청, 콘텐츠 수정 제안, 기타 문의를 이메일로 받고 있습니다.',
    sections: [
      {
        heading: '문의 이메일',
        body: ['이메일: apark12321@gmail.com']
      },
      {
        heading: '문의 가능한 내용',
        items: [
          '본문 오탈자, 깨진 링크, 잘못된 날짜나 수치 제보',
          'YouTube 또는 Google 정책 변경에 따른 내용 수정 요청',
          '특정 가이드 주제에 대한 추가 설명 요청',
          '사이트 접근 오류, 모바일 표시 오류, 검색 관련 문제 제보',
          '콘텐츠 인용, 협업, 제휴 관련 일반 문의'
        ]
      },
      {
        heading: '문의 시 적어주시면 좋은 정보',
        items: [
          '문제가 발생한 페이지 주소',
          '오류가 보이는 화면 또는 상황 설명',
          '사용 기기와 브라우저 종류',
          '수정이 필요하다고 생각하는 문장 또는 근거 자료',
          '답변을 받을 이메일 주소'
        ]
      },
      {
        heading: '답변 및 처리 기준',
        body: [
          '모든 문의에 즉시 답변드리기는 어렵지만, 사이트 품질과 정확성에 영향을 주는 제보는 우선적으로 확인합니다. 단순 홍보성 제안, 무관한 광고 요청, 자동 발송 메시지는 답변하지 않을 수 있습니다.',
          '정책·수익화·광고 관련 문의는 각 플랫폼의 최종 판단이 우선하므로, NuTube의 답변은 참고용 안내로 제공됩니다.'
        ]
      }
    ]
  },
  privacy: {
    title: '개인정보처리방침',
    updated: '2026년 6월 23일',
    intro: 'NuTube는 별도 회원가입 없이 정보를 제공하는 사이트이며, 불필요한 개인정보 수집을 최소화합니다. 문의 과정에서 전달되는 정보는 답변과 사이트 개선 목적에 한해 사용합니다.',
    sections: [
      {
        heading: '수집하는 개인정보 항목',
        items: [
          '문의 시 제공한 이메일 주소',
          '문의 내용에 포함된 이름 또는 연락처 등 사용자가 직접 입력한 정보',
          '사이트 오류 확인을 위해 사용자가 전달한 접속 환경 정보',
          '서비스 품질 개선을 위한 비식별 접속 통계 정보'
        ]
      },
      {
        heading: '개인정보 이용 목적',
        items: [
          '문의 답변 및 오류 확인',
          '잘못된 콘텐츠 수정 및 최신 정보 반영',
          '사이트 이용 안정성 점검',
          '스팸·오남용 문의 차단 및 관리'
        ]
      },
      {
        heading: '보관 및 파기',
        body: [
          '문의 내용은 답변과 후속 확인이 완료된 뒤 필요한 기간 동안만 보관하며, 더 이상 필요하지 않은 정보는 삭제합니다. 법령상 보관이 필요한 경우에는 해당 기간 동안 별도로 보관할 수 있습니다.',
          '사용자가 삭제를 요청하는 경우, 확인 가능한 범위 내에서 지체 없이 삭제 또는 비식별 조치를 진행합니다.'
        ]
      },
      {
        heading: '쿠키 및 광고 관련 안내',
        body: [
          'NuTube는 사이트 품질 개선, 보안, 광고 게재 또는 접속 통계 확인을 위해 쿠키와 유사 기술이 사용될 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.',
          'Google AdSense 등 제3자 광고 서비스가 적용되는 경우, 광고 제공자는 사용자의 관심사에 맞는 광고 제공과 부정 클릭 방지를 위해 쿠키를 사용할 수 있습니다.'
        ]
      },
      {
        heading: '제3자 제공 및 처리위탁',
        body: [
          'NuTube는 사용자의 개인정보를 사전 동의 없이 외부에 판매하거나 임의로 제공하지 않습니다. 다만 법령에 따른 요청이 있거나 사이트 운영에 필요한 인프라, 분석, 광고 서비스 과정에서 필요한 범위 내에서 제3자 서비스가 사용될 수 있습니다.'
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
    intro: '본 약관은 NuTube 사이트 이용과 콘텐츠 활용에 관한 기본 기준을 안내합니다. 사이트를 이용하는 경우 본 약관에 동의한 것으로 봅니다.',
    sections: [
      {
        heading: '서비스의 성격',
        body: [
          'NuTube는 유튜브 채널 운영에 필요한 참고 정보를 제공하는 정보형 사이트입니다. 제공되는 내용은 일반적인 참고 자료이며, YouTube, Google, AdSense 등 플랫폼의 공식 입장이나 최종 판단을 대체하지 않습니다.'
        ]
      },
      {
        heading: '이용자의 책임',
        body: [
          '이용자는 NuTube의 정보를 참고하여 본인 채널과 상황에 맞게 판단해야 합니다. 정책, 수익화 조건, 광고 관련 기준은 수시로 바뀔 수 있으므로 중요한 결정 전에는 반드시 공식 문서와 본인 계정 화면을 함께 확인해야 합니다.'
        ]
      },
      {
        heading: '콘텐츠 저작권',
        body: [
          'NuTube에 게시된 글, 구성, 이미지, 편집 요소의 저작권은 사이트 운영자 또는 해당 권리자에게 있습니다. 개인 학습과 참고 목적의 이용은 가능하지만, 무단 복제, 대량 수집, 재배포, 상업적 재가공은 허용하지 않습니다.'
        ]
      },
      {
        heading: '외부 링크',
        body: [
          'NuTube는 공식 자료 확인을 돕기 위해 외부 링크를 제공할 수 있습니다. 외부 사이트의 내용, 개인정보 처리, 서비스 제공 방식은 해당 사이트의 정책에 따르며 NuTube가 통제하지 않습니다.'
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
          'NuTube는 정보의 정확성을 높이기 위해 노력하지만, 모든 정보의 완전성이나 최신성을 보장하지는 않습니다. 사용자가 사이트 정보를 활용해 내린 결정과 그 결과에 대한 책임은 사용자 본인에게 있습니다.',
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
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

  const selectCategory = (key: string) => {
    const nextCategory = category === key ? null : key;
    const nextPath = nextCategory ? `/category/${nextCategory}` : '/';

    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({ tab: 'guides', category: nextCategory }, '', nextPath);
    }

    setPost(null);
    setTab('guides');
    setQuery('');
    setCategory(nextCategory);
    scrollToPosts();
  };

  const go = (next: Tab) => navigate(next);

  const openPost = (item: GuidePost) => {
    navigate('guide-detail', item);
  };

  const dark = theme === 'dark';

  return (
    <div className={dark ? 'min-h-screen bg-[#021321] text-sky-100' : 'min-h-screen bg-sky-50 text-slate-800'}>
      <Navbar currentTab={tab} setTab={go} theme={theme} toggleTheme={() => setTheme(dark ? 'light' : 'dark')} />
      <main>
        {tab === 'guides' && (
          <>
            <section className={dark ? 'border-b border-sky-950 bg-gradient-to-b from-[#031d33] to-[#02182b] py-16' : 'border-b border-sky-100 bg-gradient-to-b from-white to-sky-50/50 py-16'}>
              <div className="mx-auto max-w-6xl px-4 break-keep">
                <div className="text-center">
                  <div className={dark ? 'inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-950/20' : 'inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-600 border border-cyan-100'}>
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>2026 실전 유튜브 성장 로드맵 & 가이드</span>
                  </div>
                  <h1 className={dark ? 'mt-4 text-3xl font-black text-white sm:text-5xl tracking-tight leading-tight' : 'mt-4 text-3xl font-black text-slate-900 sm:text-5xl tracking-tight leading-tight'}>
                    성공하는 유튜브 채널을 위한<br />
                    <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">단계별 실무 체크리스트</span>
                  </h1>
                  <p className={dark ? 'mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-sky-200/85' : 'mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-slate-600'}>
                    시청자의 첫 3초를 사로잡는 쇼츠 후킹 공식부터 클릭률을 폭발시키는 썸네일 자가 점검, 그리고 구글 애드센스 다중 계정 심사 통과법까지! 초보 크리에이터가 마주하는 모든 핵심 성공 지표를 실무자 시선에서 완벽하게 체크리스트 중심으로 정리해 드립니다.
                  </p>
                </div>

                {/* Interactive 5-Step Checklist Roadmap */}
                <div className="mt-12">
                  <p className={dark ? 'text-center text-xs font-bold text-sky-400/80 mb-4' : 'text-center text-xs font-bold text-slate-500 mb-4'}>
                    👇 각 로드맵 단계를 클릭하여 관련 실전 가이드를 즉시 확인해 보세요
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                      {
                        step: '1단계',
                        title: '채널 시작',
                        icon: Rocket,
                        color: 'from-orange-500 to-amber-500',
                        desc: '브랜드 채널 설정, 기본 레이아웃 세팅 및 알고리즘 타겟팅 기초',
                        search: '개설',
                      },
                      {
                        step: '2단계',
                        title: '콘텐츠 기획',
                        icon: FileText,
                        color: 'from-cyan-500 to-blue-500',
                        desc: '알고리즘 피드 노출 및 시청 세션을 늘리는 정보 밀도 기획 공식',
                        search: '기획',
                      },
                      {
                        step: '3단계',
                        title: '쇼츠 운영',
                        icon: Zap,
                        color: 'from-rose-500 to-red-500',
                        desc: '첫 3초 후크 장치, 빠른 프레임 전환과 사운드 타이밍 연출',
                        search: '쇼츠',
                      },
                      {
                        step: '4단계',
                        title: '썸네일 점검',
                        icon: Image,
                        color: 'from-purple-500 to-pink-500',
                        desc: '텍스트 비율, 시선 흐름, 클릭률(CTR) 극대화 자가 진단 가이드',
                        search: '썸네일',
                      },
                      {
                        step: '5단계',
                        title: '수익화 준비',
                        icon: DollarSign,
                        color: 'from-emerald-500 to-teal-500',
                        desc: '애드센스 다중 휴면 계정 방지 정책 및 정밀 심사 승인 프로세스',
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
                            ? `group relative rounded-2xl border ${isFiltering ? 'border-cyan-400 bg-cyan-950/20' : 'border-sky-950 bg-[#042841]/35'} p-5 text-left transition duration-300 hover:border-sky-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/10`
                            : `group relative rounded-2xl border ${isFiltering ? 'border-cyan-400 bg-cyan-50/50' : 'border-sky-100 bg-white'} p-5 text-left shadow-sm transition duration-300 hover:border-sky-300 hover:-translate-y-1 hover:shadow-md`
                          }
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={dark ? 'text-[10px] font-black tracking-widest text-sky-400/70 uppercase' : 'text-[10px] font-black tracking-widest text-slate-400 uppercase'}>
                              {item.step}
                            </span>
                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-white shadow-sm shadow-black/10`}>
                              <Icon className="h-4 w-4" />
                            </span>
                          </div>
                          <h3 className={dark ? 'text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors' : 'text-sm font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors'}>
                            {item.title}
                          </h3>
                          <p className={dark ? 'mt-2 text-xs leading-5 text-sky-300/60' : 'mt-2 text-xs leading-5 text-slate-500'}>
                            {item.desc}
                          </p>
                          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-cyan-400">
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
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6" aria-label="가이드 카테고리">
                {CATEGORIES_LIST.map((item) => {
                  const active = category === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectCategory(item.key)}
                      className={active
                        ? 'rounded-2xl border border-cyan-400 bg-cyan-500/10 p-4 text-left shadow-lg shadow-cyan-950/20 ring-2 ring-cyan-400/30 transition active:scale-[0.98]'
                        : dark
                          ? 'rounded-2xl border border-sky-950 bg-[#042841]/50 p-4 text-left transition hover:border-sky-700 active:scale-[0.98]'
                          : 'rounded-2xl border border-sky-100 bg-white p-4 text-left shadow-sm transition hover:border-sky-300 active:scale-[0.98]'}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-bold">{item.label}</div>
                        <span className={active ? 'rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-black text-slate-950' : dark ? 'text-[10px] font-bold text-sky-300/45' : 'text-[10px] font-bold text-slate-400'}>
                          보기
                        </span>
                      </div>
                      <div className={dark ? 'mt-1 text-xs leading-5 text-sky-300/60' : 'mt-1 text-xs leading-5 text-slate-500'}>{item.description}</div>
                    </button>
                  );
                })}
              </section>

              <div className={dark ? 'mb-8 rounded-2xl border border-sky-950 bg-[#042841]/40 p-4' : 'mb-8 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm'}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold text-cyan-400">관련 포스팅</p>
                    <h2 className={dark ? 'mt-1 text-xl font-black text-white' : 'mt-1 text-xl font-black text-slate-900'}>
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
        {tab === 'guide-detail' && post && <GuideReader post={post} categorySpec={CATEGORY_SPECS[post.category]} onBack={() => go('guides')} theme={theme} />}
        {tab === 'about' && <InfoPage page={PAGE_CONTENT.about} theme={theme} />}
        {tab === 'contact' && <InfoPage page={PAGE_CONTENT.contact} theme={theme} />}
        {tab === 'terms' && <InfoPage page={PAGE_CONTENT.terms} theme={theme} />}
        {tab === 'privacy' && <InfoPage page={PAGE_CONTENT.privacy} theme={theme} />}
      </main>
      <footer className={dark ? 'border-t border-sky-950 px-4 py-8 text-center text-xs text-sky-300/50' : 'border-t border-sky-100 bg-white px-4 py-8 text-center text-xs text-slate-500'}>
        <div className="mb-3 flex flex-wrap justify-center gap-4">
          <button onClick={() => go('about')}>소개</button>
          <button onClick={() => go('contact')}>문의</button>
          <button onClick={() => go('privacy')}>개인정보처리방침</button>
          <button onClick={() => go('terms')}>이용약관</button>
        </div>
        © NuTube
      </footer>
    </div>
  );
}

function InfoPage({ page, theme }: { page: { title: string; intro: string; updated: string; sections: PageSection[] }; theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <article className={dark ? 'rounded-3xl border border-sky-950 bg-[#042841]/50 p-7 shadow-xl shadow-sky-950/20 sm:p-10' : 'rounded-3xl border border-sky-100 bg-white p-7 shadow-sm sm:p-10'}>
        <p className="text-xs font-bold text-cyan-400">최종 수정일: {page.updated}</p>
        <h1 className={dark ? 'mt-3 text-3xl font-black text-white' : 'mt-3 text-3xl font-black text-slate-900'}>{page.title}</h1>
        <p className={dark ? 'mt-5 text-base leading-8 text-sky-100/85' : 'mt-5 text-base leading-8 text-slate-700'}>{page.intro}</p>
        <div className="mt-9 space-y-7">
          {page.sections.map((section) => (
            <section key={section.heading} className={dark ? 'rounded-2xl border border-sky-950/70 bg-[#021321]/45 p-5' : 'rounded-2xl border border-sky-100 bg-sky-50/60 p-5'}>
              <h2 className={dark ? 'text-lg font-extrabold text-white' : 'text-lg font-extrabold text-slate-900'}>{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className={dark ? 'mt-3 text-sm leading-7 text-sky-100/80' : 'mt-3 text-sm leading-7 text-slate-700'}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className={dark ? 'mt-4 space-y-2 text-sm leading-7 text-sky-100/80' : 'mt-4 space-y-2 text-sm leading-7 text-slate-700'}>
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> <span>{item}</span></li>
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
