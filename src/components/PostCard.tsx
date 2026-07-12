import React from 'react';
import { GuidePost } from '../types';
import { ArrowRight, Clock, Eye, Calendar, User, Sparkles } from 'lucide-react';
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

  // Calculate dynamic realistic views and likes for a publication vibe
  const calculatedViews = (post.likes || 15) * 31 + 420;
  const formattedViews = calculatedViews >= 1000 
    ? `${(calculatedViews / 1000).toFixed(1)}K` 
    : `${calculatedViews}`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect(post);
  };

  const dark = theme === 'dark';

  return (
    <article id={`post-card-${post.slug}`} className="h-full">
      <a
        href={href}
        onClick={handleClick}
        className={dark
          ? 'group flex flex-col h-full cursor-pointer overflow-hidden rounded-2xl border border-purple-950/60 bg-[#120822] transition-all hover:-translate-y-1.5 hover:border-purple-800 hover:bg-[#190c30] hover:shadow-lg hover:shadow-purple-950/50'
          : 'group flex flex-col h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all hover:-translate-y-1.5 hover:border-purple-200 hover:shadow-md'
        }
      >
        {/* Post Image with subtle scale animation on hover */}
        <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-purple-950/30 relative">
          <img
            src={post.thumbnail?.src || DEFAULT_REMOTE_IMAGE}
            alt={post.thumbnail?.alt || post.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = DEFAULT_REMOTE_IMAGE;
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* Tag Overlay - Popular or Sparkle */}
          {post.likes && post.likes > 400 && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
              <Sparkles className="h-2.5 w-2.5" />
              <span>인기</span>
            </div>
          )}
        </div>

        {/* Post Metadata & Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category and Read Time */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <span 
                className="rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase" 
                style={{ 
                  color: dark ? '#b881ff' : '#7C3AED', 
                  backgroundColor: dark ? 'rgba(124, 58, 237, 0.15)' : '#F3E8FF',
                  border: `1px solid ${dark ? 'rgba(124, 58, 237, 0.3)' : '#E9D5FF'}`
                }}
              >
                {post.categoryLabel}
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Clock className="h-3 w-3 text-purple-400" />
                {post.readTime || '6분'}
              </span>
            </div>

            {/* Title */}
            <h3 className={`line-clamp-2 text-[16px] font-extrabold leading-snug tracking-tight transition-colors ${
              dark 
                ? 'text-white group-hover:text-purple-400' 
                : 'text-slate-900 group-hover:text-[#7C3AED]'
            }`}>
              {post.title}
            </h3>

            {/* Summary */}
            <p className={`mt-2.5 line-clamp-3 text-[12.5px] leading-relaxed font-medium ${
              dark ? 'text-slate-400/90' : 'text-slate-500'
            }`}>
              {(post.summary || '유튜브 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.').replace(/\*\*/g, '').replace(/`/g, '')}
            </p>
          </div>

          {/* Footer Card Section (Author, date, views) */}
          <div className={`mt-4 pt-3.5 border-t flex flex-col gap-2 ${
            dark ? 'border-purple-950/40 text-slate-400' : 'border-slate-50 text-slate-500'
          }`}>
            {/* Row 1: Author Name */}
            <div className="flex items-center gap-1.5 text-[12px] font-bold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/80 text-[#7C3AED] text-[10px]">
                👤
              </span>
              <span>{post.author || '크리에이터랩'}</span>
            </div>

            {/* Row 2: Date and Views */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formattedViews} 읽음
                </span>
              </div>
              <span className={`flex items-center gap-0.5 font-bold transition-all group-hover:translate-x-1 ${
                dark ? 'text-purple-400' : 'text-[#7C3AED]'
              }`}>
                읽기 <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};
