import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ALL_POSTS, CATEGORIES_LIST, CATEGORY_SPECS } from './data';
import { GuidePost } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { GuideReader } from './components/GuideReader';
import { ContentPlanner } from './components/ContentPlanner';
import { PersonaAdvisor } from './components/PersonaAdvisor';
import { applyPostDateSchedule, getPostPath, postTitleSegment } from './postSchedule';

type Tab = 'guides' | 'builder' | 'advisor' | 'adsense' | 'terms' | 'privacy' | 'guide-detail';

interface RouteState {
  tab: Tab;
  post: GuidePost | null;
}

const POSTS = applyPostDateSchedule(ALL_POSTS);

const normalizePath = (pathname: string) => {
  const clean = pathname.replace(/\/+$/, '');
  return clean || '/';
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
    return matchedPost ? { tab: 'guide-detail', post: matchedPost } : { tab: 'guides', post: null };
  }

  if (path.startsWith('/guide/')) {
    const slug = path.replace('/guide/', '');
    const matchedPost = findPostBySlug(slug);
    return matchedPost ? { tab: 'guide-detail', post: matchedPost } : { tab: 'guides', post: null };
  }

  if (path === '/builder') return { tab: 'builder', post: null };
  if (path === '/advisor') return { tab: 'advisor', post: null };
  if (path === '/terms') return { tab: 'terms', post: null };
  if (path === '/privacy') return { tab: 'privacy', post: null };

  return { tab: 'guides', post: null };
};

const pathForTab = (tab: Tab, post?: GuidePost | null) => {
  if (tab === 'guide-detail' && post) return getPostPath(post);
  if (tab === 'builder') return '/builder';
  if (tab === 'advisor') return '/advisor';
  if (tab === 'terms') return '/terms';
  if (tab === 'privacy') return '/privacy';
  return '/';
};

const initialRoute = (): RouteState => {
  if (typeof window === 'undefined') return { tab: 'guides', post: null };
  return resolveRoute(window.location.pathname);
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [tab, setTab] = useState<Tab>(() => initialRoute().tab);
  const [post, setPost] = useState<GuidePost | null>(() => initialRoute().post);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const next = resolveRoute(window.location.pathname);
      setPost(next.post);
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

  const navigate = (next: Tab, selectedPost: GuidePost | null = null) => {
    const nextPath = pathForTab(next, selectedPost);
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({ tab: next, title: selectedPost?.title || null }, '', nextPath);
    }
    setPost(next === 'guide-detail' ? selectedPost : null);
    setTab(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <section className={dark ? 'border-b border-sky-950 bg-[#031d33] py-14' : 'border-b border-sky-100 bg-white py-14'}>
              <div className="mx-auto max-w-5xl px-4 text-center break-keep">
                <p className="text-xs font-bold text-cyan-400">유튜브 채널 운영 가이드</p>
                <h1 className={dark ? 'mt-4 text-3xl font-black text-white sm:text-5xl' : 'mt-4 text-3xl font-black text-slate-900 sm:text-5xl'}>필요한 정보를 쉽게 확인하고 바로 적용하세요</h1>
                <p className={dark ? 'mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-sky-300/75' : 'mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600'}>채널 시작, 콘텐츠 기획, 쇼츠 운영, 썸네일 점검, 수익화 준비에 필요한 정보를 체크리스트 중심으로 정리합니다.</p>
                <div className="mt-7 flex justify-center gap-3">
                  <button onClick={() => go('builder')} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-white">기획 체크리스트</button>
                  <button onClick={() => go('advisor')} className={dark ? 'rounded-xl border border-sky-900 px-5 py-3 text-sm font-bold text-sky-100' : 'rounded-xl border border-sky-100 bg-white px-5 py-3 text-sm font-bold text-slate-700'}>질문 정리</button>
                </div>
              </div>
            </section>
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                {CATEGORIES_LIST.map((item) => (
                  <button key={item.key} onClick={() => setCategory(category === item.key ? null : item.key)} className={category === item.key ? 'rounded-2xl border border-cyan-400 bg-cyan-500/10 p-4 text-left' : dark ? 'rounded-2xl border border-sky-950 bg-[#042841]/50 p-4 text-left' : 'rounded-2xl border border-sky-100 bg-white p-4 text-left shadow-sm'}>
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className={dark ? 'mt-1 text-xs text-sky-300/60' : 'mt-1 text-xs text-slate-500'}>{item.description}</div>
                  </button>
                ))}
              </section>
              <div className={dark ? 'mb-8 rounded-2xl border border-sky-950 bg-[#042841]/40 p-4' : 'mb-8 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm'}>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="가이드 검색" className={dark ? 'w-full rounded-xl border border-sky-950 bg-[#021321] py-2.5 pl-10 pr-4 text-sm text-white outline-none' : 'w-full rounded-xl border border-sky-100 bg-sky-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none'} />
                </div>
              </div>
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((item) => <PostCard key={item.slug} post={item} href={getPostPath(item)} theme={theme} accentColor={CATEGORY_SPECS[item.category]?.accentColor || '#38bdf8'} onSelect={openPost} />)}
              </section>
            </div>
          </>
        )}
        {tab === 'guide-detail' && post && <GuideReader post={post} categorySpec={CATEGORY_SPECS[post.category]} onBack={() => go('guides')} theme={theme} />}
        {tab === 'builder' && <ContentPlanner theme={theme} />}
        {tab === 'advisor' && <PersonaAdvisor theme={theme} />}
        {tab === 'terms' && <Info title="이용약관" text="NuTube는 유튜브 채널 운영 정보를 제공하는 가이드 사이트입니다. 제공 정보는 참고용이며 최신 정책은 공식 안내를 함께 확인해야 합니다." theme={theme} />}
        {tab === 'privacy' && <Info title="개인정보처리방침" text="NuTube는 별도 회원가입 없이 정보를 제공합니다. 문의 과정에서 전달된 정보는 답변 목적 외로 사용하지 않습니다." theme={theme} />}
      </main>
      <footer className={dark ? 'border-t border-sky-950 px-4 py-8 text-center text-xs text-sky-300/50' : 'border-t border-sky-100 bg-white px-4 py-8 text-center text-xs text-slate-500'}>© NuTube</footer>
    </div>
  );
}

function Info({ title, text, theme }: { title: string; text: string; theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';
  return <div className="mx-auto max-w-4xl px-4 py-12"><div className={dark ? 'rounded-2xl border border-sky-950 bg-[#042841]/50 p-8' : 'rounded-2xl border border-sky-100 bg-white p-8 shadow-sm'}><h1 className={dark ? 'text-2xl font-extrabold text-white' : 'text-2xl font-extrabold text-slate-900'}>{title}</h1><p className={dark ? 'mt-4 text-sm leading-relaxed text-sky-200' : 'mt-4 text-sm leading-relaxed text-slate-700'}>{text}</p></div></div>;
}
