import React, { useMemo } from 'react';
import { Folder, BookOpen, Tag as TagIcon, Info, Mail } from 'lucide-react';
import { GuidePost } from '../types';
import { CATEGORIES_LIST } from '../data';
import { getPostPath } from '../postSchedule';

interface BlogSidebarProps {
  currentCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  posts: GuidePost[];
  onSelectPost: (post: GuidePost) => void;
  onOpenAbout: () => void;
  onOpenContact?: () => void;
  onSelectTag?: (tag: string) => void;
  theme?: 'light' | 'dark';
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  currentCategory,
  onSelectCategory,
  posts,
  onSelectPost,
  onOpenAbout,
  onOpenContact,
  onSelectTag,
  theme = 'light'
}) => {
  const dark = theme === 'dark';
  const box = `p-5 rounded-xl border transition-colors ${
    dark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800 shadow-2xs'
  }`;
  const heading = `text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`;

  // 처음 온 분께 권하는 순서: 1단계 앞부분 다섯 편
  const startHere = posts.slice(0, 5);

  // 실제 글에 붙은 태그 중 많이 쓰인 것
  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, [posts]);

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-6">
      {/* 1. 글쓴이 */}
      <div className={box}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shrink-0">
            박프로
          </div>
          <div>
            <h3 className={`font-bold text-base tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>박프로</h3>
            <p className="text-xs text-slate-500">50대 유튜버 · 너튜브 운영자</p>
          </div>
        </div>
        <p className={`text-xs mt-3 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          쉰을 넘겨 유튜브를 처음 시작했습니다. 왕초보 시절부터 수익 창출까지 제가 겪은 순서대로, 어려운 말 빼고 적고 있습니다.
        </p>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
          <button
            onClick={onOpenAbout}
            className={`text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
              dark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>박프로 소개</span>
          </button>
          <button
            onClick={onOpenContact}
            className={`text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
              dark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>문의하기</span>
          </button>
        </div>
      </div>

      {/* 2. 단계별로 읽기 */}
      <div className={box}>
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <Folder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className={heading}>단계별로 읽기</h4>
        </div>
        <ul className="space-y-1.5 text-xs">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left py-1.5 px-2 rounded-md flex items-center justify-between cursor-pointer ${
                currentCategory === null
                  ? dark ? 'bg-slate-800 text-blue-300 font-bold' : 'bg-slate-100 text-slate-900 font-bold'
                  : dark ? 'text-slate-300 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>처음부터 전체 보기</span>
              <span className="text-slate-400 font-mono text-[11px]">({posts.length})</span>
            </button>
          </li>
          {CATEGORIES_LIST.map((cat) => {
            const count = posts.filter((p) => p.category === cat.key).length;
            const isSelected = currentCategory === cat.key;
            return (
              <li key={cat.key}>
                <button
                  onClick={() => onSelectCategory(cat.key)}
                  className={`w-full text-left py-1.5 px-2 rounded-md flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? dark ? 'bg-slate-800 text-blue-300 font-bold' : 'bg-blue-50 text-blue-700 font-bold'
                      : dark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. 처음이라면 이 순서로 */}
      <div className={box}>
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <h4 className={heading}>처음이라면 이 순서로</h4>
        </div>
        <ol className="space-y-2.5">
          {startHere.map((post, idx) => (
            <li key={post.slug}>
              <a
                href={getPostPath(post)}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectPost(post);
                }}
                className="group flex items-start gap-2.5 cursor-pointer text-xs"
              >
                <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {idx + 1}
                </span>
                <span className={`line-clamp-2 leading-snug ${dark ? 'text-slate-300 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`}>
                  {post.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* 4. 태그 */}
      {popularTags.length > 0 && (
        <div className={box}>
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <TagIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className={heading}>자주 나오는 주제</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag?.(tag)}
                className={`text-xs px-2.5 py-1 rounded-md cursor-pointer ${
                  dark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
