import React from 'react';
import { 
  User, 
  Folder, 
  Clock, 
  Trophy, 
  Tag as TagIcon, 
  ChevronRight, 
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';
import { GuidePost, CategorySpec } from '../types';
import { CATEGORIES_LIST } from '../data';
import { formatPostDate } from '../utils/dateFormatter';
import { getPostPath } from '../postSchedule';
import { DEFAULT_REMOTE_IMAGE, FALLBACK_IMAGE_DATA_URI } from '../postImages';

interface BlogSidebarProps {
  currentCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  posts: GuidePost[];
  onSelectPost: (post: GuidePost) => void;
  onOpenAbout: () => void;
  theme?: 'light' | 'dark';
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  currentCategory,
  onSelectCategory,
  posts,
  onSelectPost,
  onOpenAbout,
  theme = 'light'
}) => {
  const dark = theme === 'dark';

  // Recent 5 posts
  const recentPosts = posts.slice(0, 5);

  // Popular posts (simulated by selecting balanced high-value topics from each category)
  const popularPosts = [
    posts.find(p => p.slug === 'monetization-first-dollar') || posts[0],
    posts.find(p => p.slug === 'shorts-100k-views-revenue') || posts[1],
    posts.find(p => p.slug === 'zero-cost-smartphone-setup') || posts[2],
    posts.find(p => p.slug === 'capcut-editing-hacks') || posts[3],
    posts.find(p => p.slug === 'youtube-algorithm-first-10-seconds') || posts[4],
  ].filter(Boolean) as GuidePost[];

  // Popular Tags
  const popularTags = [
    '스마트폰촬영', '유튜브쇼츠', '애드센스승인', '캡컷편집', 
    '조회수급상승', '마이크추천', '전자책수익', '알고리즘', '초보크리에이터'
  ];

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-6">
      {/* 1. Profile Widget (Tistory/Naver Blog Style) */}
      <div className={`p-5 rounded-xl border transition-colors ${
        dark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800 shadow-2xs'
      }`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3.5 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
              alt="운영자 민우"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className={`font-bold text-base tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            민우 <span className="text-xs font-normal text-slate-400">(@minwoo)</span>
          </h3>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-0.5">
            5년 차 1인 크리에이터 & 콘텐츠 엔지니어
          </p>
          <p className={`text-xs mt-2.5 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            300만 원 장비병 실패 후 스마트폰 한 대로 0에서 다시 시작했습니다. 실전 정산금과 시행착오 노하우를 정직하게 기록합니다.
          </p>
          
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-center">
            <button
              onClick={onOpenAbout}
              className={`w-full text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                dark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>블로그 소개 보기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Tree Widget (Tistory Signature) */}
      <div className={`p-5 rounded-xl border transition-colors ${
        dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <Folder className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            카테고리 분류
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left py-1.5 px-2 rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                currentCategory === null
                  ? dark
                    ? 'bg-slate-800 text-purple-300 font-bold'
                    : 'bg-slate-100 text-slate-900 font-bold'
                  : dark
                    ? 'text-slate-300 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>전체 분류 보기</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">({posts.length})</span>
            </button>
          </li>
          {CATEGORIES_LIST.map((cat) => {
            const count = posts.filter(p => p.category === cat.key).length;
            const isSelected = currentCategory === cat.key;
            return (
              <li key={cat.key} className="pl-2">
                <button
                  onClick={() => onSelectCategory(cat.key)}
                  className={`w-full text-left py-1.5 px-2 rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? dark
                        ? 'bg-slate-800 text-purple-300 font-bold'
                        : 'bg-purple-50 text-purple-700 font-bold'
                      : dark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1 truncate">
                    <span className="text-slate-300 dark:text-slate-600">└</span>
                    <span className="truncate">{cat.shortLabel || cat.label}</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 4. Recent Posts Widget */}
      <div className={`p-5 rounded-xl border transition-colors ${
        dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            최근에 올라온 글
          </h4>
        </div>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <a
              key={post.slug}
              href={getPostPath(post)}
              onClick={(e) => {
                e.preventDefault();
                onSelectPost(post);
              }}
              className="group flex items-start gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-800">
                <img
                  src={post.thumbnail?.src || DEFAULT_REMOTE_IMAGE}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE_DATA_URI;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className={`text-xs font-semibold leading-snug line-clamp-2 transition-colors ${
                  dark ? 'text-slate-200 group-hover:text-purple-300' : 'text-slate-800 group-hover:text-purple-600'
                }`}>
                  {post.title}
                </h5>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  {formatPostDate(post.publishedAt)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 5. Popular Posts Widget (phongnhaexplorer '가장 많이 본' style) */}
      <div className={`p-5 rounded-xl border transition-colors ${
        dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h4 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            가장 많이 본 글
          </h4>
        </div>
        <ol className="space-y-2.5">
          {popularPosts.map((post, idx) => (
            <li key={post.slug}>
              <a
                href={getPostPath(post)}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectPost(post);
                }}
                className="group flex items-start gap-2.5 cursor-pointer text-xs"
              >
                <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                  idx < 3 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <span className={`line-clamp-2 leading-snug transition-colors ${
                  dark ? 'text-slate-300 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'
                }`}>
                  {post.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* 6. Tag Cloud Widget */}
      <div className={`p-5 rounded-xl border transition-colors ${
        dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
      }`}>
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <TagIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            태그 (Tags)
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                dark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
