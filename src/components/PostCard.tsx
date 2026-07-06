import React from 'react';
import { GuidePost } from '../types';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE } from '../postImages';

interface PostCardProps {
  post: GuidePost;
  onSelect: (post: GuidePost) => void;
  accentColor: string;
  href: string;
  theme?: 'light' | 'dark';
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, accentColor, href, theme = 'dark' }) => {
  const date = new Date(post.publishedAt);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect(post);
  };

  return (
    <article id={`post-card-${post.slug}`}>
      <a
        href={href}
        onClick={handleClick}
        className={theme === 'dark'
          ? 'group block cursor-pointer overflow-hidden rounded-2xl border border-sky-950 bg-[#042841]/50 transition-all hover:-translate-y-1 hover:border-sky-800 hover:bg-[#032e49]/70'
          : 'group block cursor-pointer overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/60'}
      >
        <div className="aspect-[16/9] overflow-hidden bg-slate-900/20">
          <img
            src={post.thumbnail?.src || DEFAULT_REMOTE_IMAGE}
            alt={post.thumbnail?.alt || post.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = DEFAULT_REMOTE_IMAGE;
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: accentColor, border: `1px solid ${accentColor}40` }}>
              {post.categoryLabel}
            </span>
            <span className={theme === 'dark' ? 'text-[11px] text-sky-300/50' : 'text-[11px] text-slate-400'}>
              {post.readTime || '6분 읽기'}
            </span>
          </div>
          <h3 className={theme === 'dark' ? 'line-clamp-3 text-[18px] font-extrabold leading-7 text-white group-hover:text-cyan-300' : 'line-clamp-3 text-[18px] font-extrabold leading-7 text-slate-900 group-hover:text-sky-600'}>
            {post.title}
          </h3>
          <p className={theme === 'dark' ? 'mt-3 line-clamp-3 text-[13px] leading-6 text-sky-300/70' : 'mt-3 line-clamp-3 text-[13px] leading-6 text-slate-500'}>
            {(post.summary || '유튜브 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.').replace(/\*\*/g, '').replace(/`/g, '')}
          </p>
          {post.thumbnail?.caption ? (
            <p className={theme === 'dark' ? 'mt-3 line-clamp-2 text-[11px] leading-5 text-sky-300/45' : 'mt-3 line-clamp-2 text-[11px] leading-5 text-slate-400'}>
              {post.thumbnail.caption}
            </p>
          ) : null}
        </div>

        <div className={theme === 'dark' ? 'mx-5 mb-5 flex items-center justify-between border-t border-sky-950/50 pt-4 text-[11px] text-sky-300/45' : 'mx-5 mb-5 flex items-center justify-between border-t border-sky-100 pt-4 text-[11px] text-slate-400'}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formattedDate}</span>
          </div>
          <span className={theme === 'dark' ? 'flex items-center gap-1 font-semibold text-cyan-400' : 'flex items-center gap-1 font-semibold text-sky-600'}>
            가이드 보기 <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </a>
    </article>
  );
};
