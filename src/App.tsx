import { useState, useMemo, useEffect } from 'react';
import { ALL_POSTS, CATEGORIES_LIST, CATEGORY_SPECS } from './data';
import { GuidePost } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { GuideReader } from './components/GuideReader';
import { MetadataGenerator } from './components/MetadataGenerator';
import { PersonaAdvisor } from './components/PersonaAdvisor';
import { AdSenseDiagnostic } from './components/AdSenseDiagnostic';
import { FooterModals } from './components/FooterModals';

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
  // 메인 비쥬얼 탭 컨트롤러: 'guides' | 'builder' | 'advisor' | 'adsense'
  const [activeTab, setActiveTab] = useState<'guides' | 'builder' | 'advisor' | 'adsense'>('guides');
  
  // 푸터 이용약관 및 개인정보처리방침 모달 상태 관리자
  const [footerModalType, setFooterModalType] = useState<'terms' | 'privacy' | null>(null);
  
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
    } else if (path.startsWith('/guide/')) {
      const slug = path.replace('/guide/', '');
      const post = ALL_POSTS.find(p => p.slug === slug);
      if (post) {
        setActiveTab('guides');
        setSelectedPost(post);
      } else {
        setActiveTab('guides');
        setSelectedPost(null);
      }
    } else if (path.startsWith('/guides/')) {
      const slug = path.replace('/guides/', '');
      const post = ALL_POSTS.find(p => p.slug === slug);
      if (post) {
        setActiveTab('guides');
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

    if (selectedPost) {
      targetPath = `/guide/${selectedPost.slug}`;
      targetTitle = `${selectedPost.title} | NuTube Premium Core Hub`;
      targetDesc = selectedPost.summary || selectedPost.subtitle;
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
  const handleNavigateTab = (tab: 'guides' | 'builder' | 'advisor' | 'adsense') => {
    setSelectedPost(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="nutube-applet-root">
      
      {/* 글로벌 상단 브랜드 헤더 네비게이터 */}
      <Navbar currentTab={activeTab} setTab={handleNavigateTab} />

      {/* 메인 콘텐트 캔버스 영역 */}
      <main className="flex-grow">
        
        {/* 탭 1: 고밀도 전략 가이드 리스트 */}
        {activeTab === 'guides' && (
          <>
            {selectedPost ? (
              // 독서 집중 모드 아티클 상세 리더
              <GuideReader 
                post={selectedPost} 
                categorySpec={CATEGORY_SPECS[selectedPost.category]}
                onBack={() => setSelectedPost(null)} 
              />
            ) : (
              // 대시보드 메인
              <div id="guides-dashboard-view">
                
                {/* 메인 히어로 배너 */}
                <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 py-12 sm:py-20 relative overflow-hidden" id="hero-banner">
                  {/* 후광 블러 효과 */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />
                  
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/20 mb-5 animate-pulse">
                      ⚡ 2026 다변량 추천 알고리즘 전격 해부
                    </span>
                    <h2 className="font-display text-3xl sm:text-6xl font-black tracking-tight text-white leading-none">
                      유튜브 조회수 & 수익 구조<br className="hidden sm:inline" />
                      <span className="bg-gradient-to-r from-red-400 via-amber-400 to-rose-500 bg-clip-text text-transparent">최강 무적 비책 보관소</span>
                    </h2>
                    <p className="mt-5 text-slate-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
                      구독자 0명 시점의 알고리즘 침투 기획부터 100만 고지 달성을 위한 썸네일 A/B 테스트 지표 관리법까지, 고밀도 실물 채널 운영 비기 <strong className="text-white">46편</strong>을 아낌없이 배포합니다.
                    </p>

                    {/* AI 빌더 및 애드센스 구급대 유도 버튼 */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => handleNavigateTab('builder')}
                        className="rounded-xl px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 flex items-center gap-2"
                      >
                        <Sparkles className="h-4.5 w-4.5" />
                        <span>원클릭 AI 비칭 부스터 사용해보기</span>
                      </button>
                      <button
                        onClick={() => handleNavigateTab('adsense')}
                        className="rounded-xl px-5 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-red-500/20 flex items-center gap-2"
                      >
                        <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                        <span>🚨 애드센스 거절 긴급 구급대</span>
                      </button>
                      <button
                        onClick={() => handleNavigateTab('advisor')}
                        className="rounded-xl px-5 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
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
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                        <Bookmark className="h-5 w-5 text-red-500" />
                        <span>분야별 전문 공략집</span>
                      </h3>
                      {selectedCategory && (
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="text-xs text-red-400 hover:text-white transition-colors"
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
                                ? 'bg-slate-900 border-slate-700 shadow-xl scale-102 ring-1 ring-slate-800' 
                                : 'bg-slate-900/40 border-slate-900 hover:bg-slate-900 hover:border-slate-800'
                            }`}
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${spec.gradient} text-white shadow`}>
                              {getCategoryIcon(spec.key, 'h-5 w-5')}
                            </div>
                            <h4 className="font-display font-bold text-xs sm:text-sm text-white mt-4 flex items-center justify-between gap-1.5">
                              <span>{spec.label}</span>
                              <span className="text-[10px] font-mono bg-slate-950/60 px-1.5 py-0.5 rounded text-slate-400 group-hover:text-red-400 transition-colors">
                                {count}
                              </span>
                            </h4>
                            <p className="mt-1 text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                              {spec.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* 검색 창 및 다이렉트 슬라이더 */}
                  <section className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-900" id="search-filter-belt">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input 
                        type="text" 
                        id="articles-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="공략 가이드 제목, 태그, 기사를 검색해보세요..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition-all"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                      <span>검색 매칭: <strong className="text-white font-bold">{filteredPosts.length}</strong>건 도출</span>
                    </div>
                  </section>

                  {/* 결과 그리드 목록 */}
                  {filteredPosts.length > 0 ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-posts-grid">
                      {filteredPosts.map((post) => (
                        <PostCard 
                          key={post.slug} 
                          post={post} 
                          onSelect={setSelectedPost} 
                          accentColor={CATEGORY_SPECS[post.category]?.accentColor || '#ef4444'}
                        />
                      ))}
                    </section>
                  ) : (
                    <div className="text-center py-24 rounded-2xl border border-slate-900 bg-slate-900/10" id="dashboard-no-posts-state">
                      <Bookmark className="mx-auto h-12 w-12 text-slate-600" />
                      <h4 className="font-display font-bold text-lg text-white mt-4">검색하신 비책을 찾을 수 없습니다</h4>
                      <p className="mt-1 text-xs text-slate-400">다른 키워드나 태그로 검색하시거나 카테고리 필터를 초기화해 보세요.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory(null);
                        }}
                        className="mt-6 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
                      >
                        검색 초기화
                      </button>
                    </div>
                  )}

                  {/* 바닥 유용 푸시 배너 */}
                  <section className="mt-20 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800 text-center sm:text-left relative overflow-hidden" id="dashboard-bottom-cta">
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 h-44 w-44 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                      <div>
                        <h4 className="font-display font-extrabold text-lg sm:text-xl text-white">독창적인 자신만의 콘텐츠를 바로 설계해보세요</h4>
                        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                          전문 비책을 읽으셨다면, 이제 시그니처 썸네일 분석과 쇼츠 대본 일괄 인출 툴을 구동해 실시간으로 유튜브 알고리즘에 탄탄하게 설계된 첫 기획물을 발주할 차례입니다.
                        </p>
                      </div>
                      <button
                        onClick={() => handleNavigateTab('builder')}
                        className="sm:shrink-0 rounded-xl px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                      >
                        <span>원클릭 AI 비서실 진급</span>
                        <ArrowRight className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </section>

                </div>
              </div>
            )}
          </>
        )}

        {/* 탭 2: 원클릭 AI 디렉터 빌더 */}
        {activeTab === 'builder' && (
          <MetadataGenerator />
        )}

        {/* 탭 3: AI 심층상담관 포트 */}
        {activeTab === 'advisor' && (
          <PersonaAdvisor />
        )}

        {/* 탭 4: 애드센스 긴급 승인 구급대 */}
        {activeTab === 'adsense' && (
          <AdSenseDiagnostic />
        )}

      </main>

      {/* 심플 세련 푸터 */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 font-mono" id="applet-footer">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NuTube Premium Core Hub. All Rights Reserved.</p>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setFooterModalType('terms')}
              className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
              id="footer-btn-terms"
            >
              이용약관
            </button>
            <span className="h-4 w-[1px] bg-slate-900" />
            <button 
              onClick={() => setFooterModalType('privacy')}
              className="hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
              id="footer-btn-privacy"
            >
              개인정보처리방침
            </button>
          </div>
        </div>
      </footer>

      {/* 푸터 전문 모달 오버레이 */}
      <FooterModals type={footerModalType} onClose={() => setFooterModalType(null)} />

    </div>
  );
}
