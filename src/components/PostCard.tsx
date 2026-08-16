import React from 'react';
import { GuidePost } from '../types';
import { ArrowRight, Calendar } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE } from '../postImages';
import { formatPostDateTime } from '../utils/dateFormatter';

interface PostCardProps {
  post: GuidePost;
  onSelect: (post: GuidePost) => void;
  accentColor: string;
  href: string;
  theme?: 'light' | 'dark';
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, href, theme = 'dark' }) => {
  const formattedDateTime = formatPostDateTime(post.publishedAt, post.slug);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect(post);
  };

  const dark = theme === 'dark';

  return (
    <article id={`post-card-${post.slug}`} className="h-full animate-fade-in-up w-full min-w-0">
      <a
        href={href}
        onClick={handleClick}
        className={dark
          ? 'group flex flex-col h-full cursor-pointer overflow-hidden rounded-2xl border border-purple-950/60 bg-[#120822] transition-all hover:-translate-y-1 hover:border-purple-700 hover:bg-[#180b2e] hover:shadow-lg hover:shadow-purple-950/40'
          : 'group flex flex-col h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all hover:-translate-y-1 hover:border-purple-300 hover:shadow-md'
        }
      >
        {/* Post Image Container with safe aspect ratio */}
        <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-purple-950/40 relative w-full shrink-0">
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

        {/* Post Details with High Legibility & Clear Font Types */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Category Tag */}
            <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
              <span 
                className="font-tag rounded-lg px-3 py-1 text-xs sm:text-sm font-black tracking-wide uppercase" 
                style={{ 
                  color: dark ? '#c084fc' : '#7C3AED', 
                  backgroundColor: dark ? 'rgba(124, 58, 237, 0.2)' : '#F3E8FF',
                  border: `1px solid ${dark ? 'rgba(124, 58, 237, 0.4)' : '#E9D5FF'}`
                }}
              >
                {post.categoryLabel}
              </span>
            </div>

            {/* Post Title - Crisp & Bold */}
            <h3 className={`font-heading line-clamp-2 text-xl sm:text-2xl font-black leading-snug tracking-tight transition-colors break-keep ${
              dark 
                ? 'text-white group-hover:text-purple-300' 
                : 'text-slate-900 group-hover:text-[#7C3AED]'
            }`}>
              {post.title}
            </h3>

            {/* Summary - Readable font size (15px/16px) */}
            <p className={`mt-3 line-clamp-2 sm:line-clamp-3 font-body text-sm sm:text-base leading-relaxed font-normal break-keep ${
              dark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {(post.summary || '유튜브 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.').replace(/\*\*/g, '').replace(/`/g, '')}
            </p>
          </div>

          {/* Footer Metadata Row */}
          <div className={`mt-5 pt-3.5 border-t flex flex-col gap-2.5 ${
            dark ? 'border-purple-950/50 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            {/* Date & Action CTA */}
            <div className="flex items-center justify-between font-tag text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-mono font-semibold">
                <Calendar className="h-4 w-4 shrink-0 text-purple-400" />
                <time>{formattedDateTime}</time>
              </span>
              <span className={`font-subheading flex items-center gap-1 text-xs sm:text-sm font-black transition-all group-hover:translate-x-1 ${
                dark ? 'text-purple-400' : 'text-[#7C3AED]'
              }`}>
                가이드 보기 <ArrowRight className="h-4 w-4 shrink-0" />
              </span>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};
