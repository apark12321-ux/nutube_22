import { useState, useMemo, useEffect } from 'react';
import { ALL_POSTS, CATEGORIES_LIST, CATEGORY_SPECS } from './data';
import { GuidePost } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { GuideReader } from './components/GuideReader';
import { MetadataGenerator } from './components/MetadataGenerator';
import { PersonaAdvisor } from './components/PersonaAdvisor';
import { AdSenseDiagnostic } from './components/AdSenseDiagnostic';

import { 
  Search, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Heart, 
  Zap, 
  DollarSign, 
  Compass, 
  Award, 
  SlidersHorizontal, 
  ArrowRight,
  Bookmark
} from 'lucide-react';

export default function App() {
  // --- 여름 특화 주/야간 테마(기기 자동 감지 + 수동 오버라이드) 시스템 ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutube-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // 기본값
  });

  // 시스템 기기 기본 취향 설정 실시간 동조 추적
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDeviceThemeChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('nutube-theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleDeviceThemeChange);
    return () => mediaQuery.removeEventListener('change', handleDeviceThemeChange);
  }, []);

  // 테마 상태에 맞춰 실제 body와 스크롤바 메타 스타일 연동
  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#021321';
      document.body.style.color = '#e0f2fe';
      document.documentElement.style.setProperty('--bg-scroll-track', '#010a12');
      document.documentElement.style.setProperty('--bg-scroll-thumb', '#083354');
      document.documentElement.style.setProperty('--bg-scroll-thumb-hover', '#0c4a7a');
    } else {
      document.body.style.backgroundColor = '#f0f9ff';
      document.body.style.color = '#0f172a';
      document.documentElement.style.setProperty('--bg-scroll-track', '#e0f2fe');
      document.documentElement.style.setProperty('--bg-scroll-thumb', '#bae6fd');
      document.documentElement.style.setProperty('--bg-scroll-thumb-hover', '#7dd3fc');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('nutube-theme', nextTheme);
  };

  // 메인 비쥬얼 탭 컨트롤러: 'guides' | 'builder' | 'advisor' | 'adsense' | 'terms' | 'privacy' | 'guide-detail'
  const [activeTab, setActiveTab] = useState<'guides' | 'builder' | 'advisor' | 'adsense' | 'terms' | 'privacy' | 'guide-detail'>('guides');
  
  // 가이드 상세 선택 조회 정보
  const [selectedPost, setSelectedPost] = useState<GuidePost | null>(null);

  // 검색어 및 카테고리 필터 인디케이터
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- 브라우저 주소창 연동 & 검색엔진 서치 콘솔 색인 자동 연계 엔진 ---
  const syncStateFromUrl = () => {
    const path = window.location.pathname;
    if (path === '/builder') {
      setActiveTab('builder');
      setSelectedPost(null);
    } else if (path === '/advisor') {
      setActiveTab('advisor');
      setSelectedPost(null);
    } else if (path === '/adsense') {
      setActiveTab('adsense');
      setSelectedPost(null);
    } else if (path === '/terms') {
      setActiveTab('terms');
      setSelectedPost(null);
    } else if (path === '/privacy') {
      setActiveTab('privacy');
      setSelectedPost(null);
    } else if (path.startsWith('/guide/')) {
      const slug = path.replace('/guide/', '');
      const post = ALL_POSTS.find(p => p.slug === slug);
      if (post) {
        setActiveTab('guide-detail');
        setSelectedPost(post);
      } else {
        setActiveTab('guides');
        setSelectedPost(null);
      }
    } else if (path.startsWith('/guides/')) {
      const slug = path.replace('/guides/', '');
      const post = ALL_POSTS.find(p => p.slug === slug);
      if (post) {
        setActiveTab('guide-detail');
        setSelectedPost(post);
      } else {
        setActiveTab('guides');
        setSelectedPost(null);
      }
    } else {
      setActiveTab('guides');
      setSelectedPost(null);
    }
  };

  // 1. 컴포넌트 마운트 시 최초 주소 파싱 및 popstate 이벤트 리스너 감지 등록
  useEffect(() => {
    syncStateFromUrl();

    const handlePopState = () => {
      syncStateFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 2. 탭 선택 및 가이드 글 진입 상황을 URL 경로에 실시간 동기화 (pushState)
  useEffect(() => {
    let targetPath = '/';
    let targetTitle = 'NuTube Premium Core Hub';
    let targetDesc = '구독자 0명 시점의 알고리즘 침투 기획부터 100만 고지 달성을 위한 썸네일 A/B 테스트 지표 관리법까지, 고밀도 실물 채널 운영 비기 46편을 무료 배포합니다.';

    if (selectedPost && activeTab === 'guide-detail') {
      targetPath = `/guide/${selectedPost.slug}`;
      targetTitle = `${selectedPost.title} | NuTube Premium Core Hub`;
      targetDesc = selectedPost.summary || selectedPost.subtitle;
    } else if (activeTab === 'terms') {
      targetPath = '/terms';
      targetTitle = '이용약관 | NuTube Premium Core Hub';
      targetDesc = 'NuTube Premium Core Hub 서비스 이용약관 전문 고밀도 안내 페이지입니다.';
    } else if (activeTab === 'privacy') {
      targetPath = '/privacy';
      targetTitle = '개인정보처리방침 | NuTube Premium Core Hub';
      targetDesc = '귀중한 사용자 데이터 수집 한도를 정의하고 임시 쿠키 운용을 보호하기 위한 개인정보방침 내용입니다.';
    } else if (activeTab === 'builder') {
      targetPath = '/builder';
      targetTitle = '원클릭 AI 비칭 부스터 | NuTube Premium Core Hub';
    } else if (activeTab === 'advisor') {
      targetPath = '/advisor';
      targetTitle = 'AI 심층상담관 | NuTube Premium Core Hub';
    } else if (activeTab === 'adsense') {
      targetPath = '/adsense';
      targetTitle = '애드센스 긴급 구급대 | NuTube Premium Core Hub';
    } else {
      targetPath = '/';
      targetTitle = 'NuTube Premium Core Hub - 유튜브 조회수 & 수익 구조 최강 비책 보관소';
    }

    // 현재의 브라우저 주소와 다를 경우에만 pushState 실행하여 무한 루트 및 중복 히스토리 유입 방지
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }

    // 검색 크롤러 봇 및 탭 타이틀을 위해 DOM 메타 동적 업데이트 진행
    document.title = targetTitle;
    
    // HTML 메타 디스크립션 동적 개조
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', targetDesc);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = targetDesc;
      document.head.appendChild(newMeta);
    }

    // OpenGraph 메타 동적 개조 (SNS 공유 미리보기 최적화)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', targetTitle);
    if (ogDesc) ogDesc.setAttribute('content', targetDesc);
  }, [activeTab, selectedPost]);

  // 카테고리별 아이콘 맵 매칭 유틸
  const getCategoryIcon = (key: string, className: string) => {
    switch (key) {
      case 'algorithm': return <TrendingUp className={className} />;
      case 'senior': return <Heart className={className} />;
      case 'aitools': return <Zap className={className} />;
      case 'monetization': return <DollarSign className={className} />;
      case 'beginner': return <Compass className={className} />;
      case 'advanced': return <Award className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  // 포스트 정렬 및 필터링 핵심 최적화
  const filteredPosts = useMemo(() => {
    // 발행일 역순 정렬 (최신 비책이 최상단 노출)
    let list = [...ALL_POSTS].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((p) => 
        p.title.toLowerCase().includes(query) || 
        p.subtitle.toLowerCase().includes(query) || 
        (p.summary || '').toLowerCase().includes(query) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(query))
      );
    }

    return list;
  }, [searchQuery, selectedCategory]);

  // 카테고리별 글 개수 실시간 재연산 취합
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES_LIST.forEach((c) => {
      counts[c.key] = ALL_POSTS.filter((p) => p.category === c.key).length;
    });
    return counts;
  }, []);

  // 특정 탭 이동 유틸
  const handleNavigateTab = (tab: 'guides' | 'builder' | 'advisor' | 'adsense' | 'terms' | 'privacy' | 'guide-detail') => {
    if (tab !== 'guide-detail') {
      setSelectedPost(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${
      theme === 'dark' 
        ? 'bg-[#021321] text-sky-100' 
        : 'bg-[#f0f9ff]/40 text-slate-800'
    }`} id="nutube-applet-root">
      
      {/* 글로벌 상단 브랜드 헤더 네비게이터 */}
      <Navbar currentTab={activeTab} setTab={handleNavigateTab} theme={theme} toggleTheme={toggleTheme} />

      {/* 메인 콘텐트 캔버스 영역 */}
      <main className="flex-grow">
        
        {/* 탭 1: 고밀도 전략 가이드 리스트 */}
        {activeTab === 'guides' && (
          <div id="guides-dashboard-view">
            
            {/* 메인 히어로 배너 */}
            <section className={`border-b relative overflow-hidden transition-all duration-300 py-12 sm:py-20 ${
              theme === 'dark'
                ? 'bg-gradient-to-b from-[#031d33] via-[#021321] to-[#010a12] border-sky-955'
                : 'bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-white border-sky-100'
            }`} id="hero-banner">
              {/* 후광 블러 효과 */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full blur-[120px] pointer-events-none ${
                theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/20'
              }`} />
              
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 break-keep">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border mb-5 ${
                  theme === 'dark'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    : 'bg-sky-500/10 text-sky-600 border-sky-500/20'
                }`}>
                  🌊 2026 다변량 추천 알고리즘 한여름 크랙 특강
                </span>
                <h2 className={`font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-[#011d33]'
                }`}>
                  유튜브 조회수 & 수익 구조<br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-sky-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">최강 무적 비책 보관소</span>
                </h2>
                <p className={`mt-5 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed ${
                  theme === 'dark' ? 'text-sky-300/80' : 'text-slate-605'
                }`}>
                  구독자 0명 시점의 알고리즘 침투 기획부터 100만 고지 달성을 위한 썸네일 A/B 테스트 지표 관리법까지, 고밀도 실물 채널 운영 비기 <strong className={theme === 'dark' ? 'text-cyan-300' : 'text-teal-600'}>46편</strong>을 시원하게 대방출합니다.
                </p>

                {/* AI 빌더 및 애드센스 구급대 유도 버튼 */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleNavigateTab('builder')}
                    className="rounded-xl px-4.5 py-3 bg-gradient-to-r from-[#00b894] to-[#0984e3] hover:from-[#55efc4] hover:to-[#74b9ff] text-white font-extrabold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/10 hover:shadow-sky-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>원클릭 AI 비칭 부스터 사용해보기</span>
                  </button>
                  <button
                    onClick={() => handleNavigateTab('adsense')}
                    className="rounded-xl px-4.5 py-3 bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-400 hover:to-red-550 text-white font-extrabold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    <span>🚨 애드센스 거절 긴급 구급대</span>
                  </button>
                  <button
                    onClick={() => handleNavigateTab('advisor')}
                    className={`rounded-xl px-4.5 py-3 border text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        : 'bg-white border-sky-100 hover:border-sky-300 text-slate-705 shadow-sm'
                    }`}
                  >
                    <span>전문가 1:1 상담 연결</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              
              {/* 카테고리 퀼트 선택 패널 */}
              <section className="mb-12" id="category-scroller">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h3 className={`font-display font-extrabold text-lg sm:text-xl flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-[#011d33]'
                  }`}>
                    <Bookmark className="h-5 w-5 text-sky-500" />
                    <span>분야별 전문 공략집</span>
                  </h3>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`text-xs transition-colors cursor-pointer font-bold ${
                        theme === 'dark' ? 'text-cyan-400 hover:text-white' : 'text-sky-600 hover:text-sky-800'
                      }`}
                    >
                      카테고리 전체보기
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4.5">
                  {CATEGORIES_LIST.map((spec) => {
                    const count = categoryCounts[spec.key] || 0;
                    const isSelected = selectedCategory === spec.key;
                    return (
                      <div
                        key={spec.key}
                        id={`category-filter-btn-${spec.key}`}
                        onClick={() => setSelectedCategory(isSelected ? null : spec.key)}
                        className={`group relative rounded-2xl border p-4 cursor-pointer transition-all duration-300 select-none ${
                          isSelected 
                            ? theme === 'dark'
                              ? 'bg-[#032e49] border-sky-450/80 shadow-lg scale-102 ring-1 ring-sky-500/30' 
                              : 'bg-white border-sky-500 shadow-md scale-102 ring-1 ring-sky-500/50'
                            : theme === 'dark'
                              ? 'bg-[#042841]/50 border-sky-955 hover:bg-[#032e49]/70 hover:border-sky-850'
                              : 'bg-white border-sky-100 hover:bg-sky-50 hover:border-sky-300 shadow-xs'
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${spec.gradient} text-white shadow`}>
                          {getCategoryIcon(spec.key, 'h-5 w-5')}
                        </div>
                        <h4 className={`font-display font-bold text-xs sm:text-sm mt-4 flex items-center justify-between gap-1.5 ${
                          theme === 'dark' ? 'text-white' : 'text-[#011d33]'
                        }`}>
                          <span>{spec.label}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                            theme === 'dark' ? 'bg-[#010912]/80 text-sky-400 group-hover:text-cyan-300' : 'bg-sky-55 text-sky-600 group-hover:bg-sky-100'
                          }`}>
                            {count}
                          </span>
                        </h4>
                        <p className={`mt-1 text-[10px] line-clamp-2 leading-relaxed ${
                          theme === 'dark' ? 'text-sky-300/60' : 'text-slate-500'
                        }`}>
                          {spec.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 검색 창 및 다이렉트 슬라이더 */}
              <section className={`mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-[#042841]/30 border-sky-955'
                  : 'bg-white border-sky-100 shadow-xs'
              }`} id="search-filter-belt">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 h-4 w-4 text-sky-500/80" />
                  <input 
                    type="text" 
                    id="articles-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="공략 가이드 제목, 태그, 기사를 검색해보세요..."
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:outline-none transition-all ${
                      theme === 'dark'
                        ? 'border-sky-950/75 bg-[#021321]/90 text-white placeholder-slate-500 focus:border-cyan-500'
                        : 'border-sky-100 bg-sky-50/50 text-slate-850 placeholder-slate-400 focus:border-sky-500 focus:bg-white'
                    }`}
                  />
                </div>
                
                <div className={`flex items-center gap-2 text-xs font-mono ${
                  theme === 'dark' ? 'text-sky-400/80' : 'text-slate-500'
                }`}>
                  <SlidersHorizontal className="h-4 w-4 text-sky-500" />
                  <span>검색 매칭: <strong className={theme === 'dark' ? 'text-cyan-400' : 'text-sky-600'}>{filteredPosts.length}</strong>건 도출</span>
                </div>
              </section>

              {/* 결과 그리드 목록 */}
              {filteredPosts.length > 0 ? (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-posts-grid">
                  {filteredPosts.map((post) => (
                    <PostCard 
                      key={post.slug} 
                      post={post} 
                      theme={theme}
                      onSelect={() => {
                        setSelectedPost(post);
                        setActiveTab('guide-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </section>
              ) : (
                <div className={`text-center py-16 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#042841]/30 border-sky-955 text-slate-400' : 'bg-white border-sky-100 text-slate-500'
                }`}>
                  <p className="font-bold text-sm">일치하는 비책 리포트가 발견되지 않았습니다.</p>
                  <p className="text-xs mt-1">다른 검색어나 카테고리를 활용해 보세요.</p>
                </div>
              )}

              {/* 바닥 유용 푸시 배너 */}
              <section className={`mt-20 p-6 sm:p-8 rounded-3xl text-center sm:text-left relative overflow-hidden border ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#032e49] via-[#021321] to-[#010a12] border-sky-955'
                  : 'bg-gradient-to-br from-sky-100/50 via-sky-50 to-white border-sky-100 shadow-sm'
              }`} id="dashboard-bottom-cta">
                <div className={`absolute top-1/2 right-12 -translate-y-1/2 h-44 w-44 rounded-full blur-3xl pointer-events-none ${
                  theme === 'dark' ? 'bg-cyan-500/5' : 'bg-cyan-400/10'
                }`} />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 break-keep">
                  <div>
                    <h4 className={`font-display font-extrabold text-lg sm:text-xl ${theme === 'dark' ? 'text-white' : 'text-[#011d33]'}`}>독창적인 자신만의 콘텐츠를 바로 설계해보세요</h4>
                    <p className={`mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-sky-300/60' : 'text-slate-500'}`}>
                      전문 비책을 읽으셨다면, 이제 시그니처 썸네일 분석과 쇼츠 대본 일괄 인출 툴을 구동해 실시간으로 유튜브 알고리즘에 탄탄하게 설계된 첫 기획물을 발주할 차례입니다.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigateTab('builder')}
                    className="sm:shrink-0 rounded-xl px-5 py-3 bg-gradient-to-r from-[#00b894] to-[#0984e3] hover:from-[#55efc4] hover:to-[#74b9ff] text-white font-extrabold text-xs sm:text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>원클릭 AI 비서실 진급</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </section>

            </div>
          </div>
        )}

        {/* 독서 집중 모드 아티클 상세 리더 */}
        {activeTab === 'guide-detail' && selectedPost && (
          <GuideReader 
            post={selectedPost} 
            categorySpec={CATEGORY_SPECS[selectedPost.category]}
            onBack={() => handleNavigateTab('guides')} 
            theme={theme}
          />
        )}

        {/* 탭 2: 원클릭 AI 디렉터 빌더 */}
        {activeTab === 'builder' && (
          <MetadataGenerator theme={theme} />
        )}

        {/* 탭 3: AI 심층상담관 포트 */}
        {activeTab === 'advisor' && (
          <PersonaAdvisor theme={theme} />
        )}

        {/* 탭 4: 애드센스 긴급 승인 구급대 */}
        {activeTab === 'adsense' && (
          <AdSenseDiagnostic theme={theme} />
        )}

        {/* 탭 5: 이용약관 */}
        {activeTab === 'terms' && (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in break-keep" id="terms-view">
            <div className={`rounded-2xl border p-6 sm:p-10 shadow-xl ${
              theme === 'dark' ? 'border-sky-950 bg-[#042841]/50' : 'border-sky-100 bg-white'
            }`}>
              <h2 className={`font-display text-2xl sm:text-3xl font-black tracking-tight mb-6 pb-4 border-b flex items-center gap-2 ${
                theme === 'dark' ? 'text-white border-sky-950/40' : 'text-[#011d33] border-sky-100'
              }`}>
                <span className="inline-block h-6 w-1.5 bg-sky-500 rounded-full" />
                <span>NuTube Premium Core Hub 이용약관</span>
              </h2>
              <div className={`space-y-6 text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-sky-200' : 'text-slate-705'}`}>
                <div className={`border rounded-xl p-4 mb-4 ${
                  theme === 'dark' ? 'bg-[#010912]/80 border-sky-950/45 text-sky-450' : 'bg-sky-50/50 border-sky-100 text-sky-700'
                }`}>
                  <p className="text-xs font-bold leading-relaxed">
                    ※ 본 이용약관은 NuTube Premium Core Hub가 제공하는 유튜브 성장 공략, AI 알고리즘 기획 분석기 및 애드센스 진단 등의 핵심 전략 리포트 서비스 사용 지침을 정의합니다.
                  </p>
                </div>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 1조 (목적)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    본 약관은 크리에이터 성장 파트너 NuTube Premium Core Hub(이하 "서비스")가 제공하는 웹 애플리케이션 및 브라우징 리소스의 합리적인 사용 한계와 회원의 권리 의무 및 책임 사항을 목적으로 합니다.
                  </p>
                </section>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 2조 (서비스의 핵심 구조 및 품질 보증의 제한)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    1. 서비스가 제공하는 유튜브 비책 아티클, AI 기반 대본/썸네일 부스터, 애드센스 긴급 진단 로직은 다변량 통계적 알고리즘 기준 및 크리에이티브 실무 지침서에 의거합니다.<br />
                    2. 인공지능 분석 데이터는 수시로 추천 메커니즘을 100% 실시간으로 반영하지 못할 수 있으며, 개별 채널의 성취 지표(구독자, 조회수, 정식 승인 해결 등)에 정량적 100% 승인이나 흥행 보장을 법적으로 절대 확약하지 않습니다.
                  </p>
                </section>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 3조 (크리에이티브 리소스의 소유권 및 재배포 규정)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    1. 서비스 내에 고밀도로 수록된 46편의 기획 서적 수준 공략본, AI 부스팅 프롬프트 시스템 디자인 전반은 독자 지식재산권으로 전속됩니다.<br />
                    2. 이용자는 가이드 내용을 사전 승낙 없이 무단으로 인쇄 영리용 PDF로 제작 및 배포하거나 상업적 교재로 무단 유상 양도하는 권리 침해 행위를 일절 금지합니다.
                  </p>
                </section>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 4조 (면책 조항)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    회사는 천재지변, 연계 서비스 제공처(YouTube API, Google AdSense 등)의 규칙 폐지 및 변동, 또는 기술적 불능 등 불가피한 오류 시스템에 따른 장애에 책임을 다으나, 일체 파생된 제3자 채널 손실 등에 민형사상 배상 책임을 지지 않습니다.
                  </p>
                </section>
              </div>
              <div className={`mt-10 pt-6 border-t text-center ${theme === 'dark' ? 'border-sky-955' : 'border-sky-100'}`}>
                <button
                  onClick={() => handleNavigateTab('guides')}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-[#032e49] border-sky-950 hover:bg-[#032841] text-white' 
                      : 'bg-sky-50 border-sky-100 hover:bg-sky-100 text-sky-800'
                  }`}
                >
                  비책 홈으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 탭 6: 개인정보처리방침 */}
        {activeTab === 'privacy' && (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in break-keep" id="privacy-view">
            <div className={`rounded-2xl border p-6 sm:p-10 shadow-xl ${
              theme === 'dark' ? 'border-sky-955 bg-[#042841]/50' : 'border-sky-100 bg-white'
            }`}>
              <h2 className={`font-display text-2xl sm:text-3xl font-black tracking-tight mb-6 pb-4 border-b flex items-center gap-2 ${
                theme === 'dark' ? 'text-white border-sky-950/45' : 'text-[#011d33] border-sky-100'
              }`}>
                <span className="inline-block h-6 w-1.5 bg-sky-500 rounded-full" />
                <span>개인정보처리방침 안내 전문</span>
              </h2>
              <div className={`space-y-6 text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-sky-200' : 'text-slate-705'}`}>
                <div className={`border rounded-xl p-4 mb-4 ${
                  theme === 'dark' ? 'bg-[#010912]/80 border-sky-950/45 text-sky-455' : 'bg-sky-50/50 border-sky-100 text-sky-700'
                }`}>
                  <p className="text-xs font-bold leading-relaxed">
                    ※ 본 개인정보처리방침은 NuTube Premium Core Hub 서비스 이용 환경에서 이용자의 디지털 기밀을 강력하게 수호하기 위하여 어떠한 불필요한 추적 정보도 수집 전송하지 않음을 밝혀둡니다.
                  </p>
                </div>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 1조 (수집하는 개인정보 항목 및 임시 보관 수준)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    1. 본 서비스는 귀찮고 유출 위험이 크며 번거로운 회원가입 절차 자체를 설계하지 않았습니다.<br />
                    2. 서비스의 AI 분석기는 이용자가 채널 진단을 위해 직접 손수 기입한 내용(채널 주제, 타겟 등)만을 임시 파라미터로 처리합니다. 그 외 IP 주소나 브라우저 메타 정보 등의 추적을 절대 진행하지 않습니다.
                  </p>
                </section>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 2조 (개인 데이터의 사용 목적 및 연동 범위)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    이용자가 작성한 모든 메타데이터와 질문지 정보는 연동된 구글 생성형 거대 언어 모델(Gemini API) 서비스와의 오직 실시간 컨설팅 일회용 통신에 한해 사용될 뿐이며, 피드백 완수 즉시 시스템 스레드에서 자동 소거됩니다.
                  </p>
                </section>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 3조 (데이터의 영구 처분 및 타 단체 공유 방지)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    1. 본 플랫폼은 클라우드 서버 측에 사용자의 가이드 열람 통계 데이터베이스를 영구 축적하지 않습니다.<br />
                    2. 임시 캐싱 목적의 브라우저 보관 기법(LocalStorage)은 오직 사용자가 창을 닫기 전까지 본인 환경에서만 제어될 뿐이며, 어떠한 광고 그룹이나 제3자 정보망에도 흘려보내지 않음을 명시합니다.
                  </p>
                </section>
                <section className="space-y-2">
                  <h4 className={`font-bold text-base font-display ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>제 4조 (정보주체의 관리 책임자 소통)</h4>
                  <p className={`text-xs sm:text-[13px] pl-3 ${theme === 'dark' ? 'text-sky-300/70' : 'text-slate-550'}`}>
                    이용자는 언제나 브라우저 캐시 데이터를 마음껏 소거함으로써 분석 로그를 완벽 조치할 수 있습니다. 개인정보 문의 사항은 시스템 인프라 책임팀 메일(apark12321@gmail.com)을 통하여 전광석화 같은 피드백이 가능합니다.
                  </p>
                </section>
              </div>
              <div className={`mt-10 pt-6 border-t text-center ${theme === 'dark' ? 'border-sky-955' : 'border-sky-100'}`}>
                <button
                  onClick={() => handleNavigateTab('guides')}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-[#032e49] border-sky-955 hover:bg-[#032841] text-white' 
                      : 'bg-sky-50 border-sky-100 hover:bg-sky-100 text-sky-800'
                  }`}
                >
                  비책 홈으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 심플 세련 푸터 */}
      <footer className={`border-t py-8 text-center text-xs font-mono transition-colors duration-300 ${
        theme === 'dark'
          ? 'border-sky-955 bg-[#010912] text-slate-500'
          : 'border-sky-100 bg-sky-50 text-slate-605'
      }`} id="applet-footer">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NuTube Premium Core Hub. All Rights Reserved.</p>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => handleNavigateTab('terms')}
              className={`transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none font-bold ${
                theme === 'dark' ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-sky-600'
              }`}
              id="footer-btn-terms"
            >
              이용약관
            </button>
            <span className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-sky-950' : 'bg-sky-200'}`} />
            <button 
              onClick={() => handleNavigateTab('privacy')}
              className={`transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none font-bold ${
                theme === 'dark' ? 'text-slate-400 hover:text-rose-450' : 'text-slate-600 hover:text-rose-600'
              }`}
              id="footer-btn-privacy"
            >
              개인정보처리방침
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
