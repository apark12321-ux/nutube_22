import React from 'react';
import { GuidePost } from '../types';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: GuidePost;
  onSelect: (post: GuidePost) => void;
  accentColor: string;
  theme?: 'light' | 'dark';
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, accentColor, theme = 'dark' }) => {
  const date = new Date(post.publishedAt);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <article
      onClick={() => onSelect(post)}
      className={theme === 'dark'
        ? 'group flex cursor-pointer flex-col justify-between rounded-2xl border border-sky-950 bg-[#042841]/50 p-5 transition-all hover:-translate-y-1 hover:border-sky-800 hover:bg-[#032e49]/70'
        : 'group flex cursor-pointer flex-col justify-between rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/60'}
      id={`post-card-${post.slug}`}
    >
      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: accentColor, border: `1px solid ${accentColor}40` }}>
            {post.categoryLabel}
          </span>
          <span className={theme === 'dark' ? 'text-[11px] text-sky-300/50' : 'text-[11px] text-slate-400'}>
            {post.readTime || '3분 읽기'}
          </span>
        </div>
        <h3 className={theme === 'dark' ? 'line-clamp-2 text-base font-semibold text-white group-hover:text-cyan-300' : 'line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-sky-600'}>
          {post.title}
        </h3>
        <p className={theme === 'dark' ? 'mt-2 line-clamp-2 text-xs leading-relaxed text-sky-300/60' : 'mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500'}>
          {post.summary || '유튜브 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.'}
        </p>
      </div>
      <div className={theme === 'dark' ? 'mt-5 flex items-center justify-between border-t border-sky-950/50 pt-4 text-[11px] text-sky-300/45' : 'mt-5 flex items-center justify-between border-t border-sky-100 pt-4 text-[11px] text-slate-400'}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formattedDate}</span>
        </div>
        <span className={theme === 'dark' ? 'flex items-center gap-1 font-semibold text-cyan-400' : 'flex items-center gap-1 font-semibold text-sky-600'}>
          가이드 보기 <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </article>
  );
};
