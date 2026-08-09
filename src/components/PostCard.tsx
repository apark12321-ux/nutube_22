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
            <h3 className={`line-clamp-2 text-[17px] font-extrabold leading-[1.4] tracking-tight transition-colors ${
              dark 
                ? 'text-white group-hover:text-purple-300' 
                : 'text-slate-900 group-hover:text-[#7C3AED]'
            }`}>
              {post.title}
            </h3>

            {/* Summary */}
            <p className={`mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed font-medium ${
              dark ? 'text-slate-300/90' : 'text-slate-600'
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

            {/* Row 2: Date and Reading state */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
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
