import React from 'react';
import { GuidePost } from '../types';
import { Calendar, User, Tag } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE, FALLBACK_IMAGE_DATA_URI } from '../postImages';
import { formatPostDateTime } from '../utils/dateFormatter';

interface PostCardProps {
  post: GuidePost;
  onSelect: (post: GuidePost) => void;
  accentColor?: string;
  href: string;
  theme?: 'light' | 'dark';
  index?: number;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onSelect, 
  href, 
  theme = 'light' 
}) => {
  const formattedDateTime = formatPostDateTime(post.publishedAt, post.slug);
  const dark = theme === 'dark';

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect(post);
  };

  const summaryText = (post.summary || post.subtitle || '1인 크리에이터의 실전 경험과 구체적인 해결책을 담은 글입니다.')
    .replace(/\*\*/g, '')
    .replace(/`/g, '');

  return (
    <article 
      id={`post-item-${post.slug}`}
      className={`py-6 border-b transition-colors ${
        dark ? 'border-slate-800/80 hover:bg-slate-900/30' : 'border-slate-200/90 hover:bg-slate-50/60'
      } px-2 sm:px-3 rounded-lg`}
    >
      <a
        href={href}
        onClick={handleClick}
        className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 items-start cursor-pointer group"
      >
        {/* Left: Content Text (Tistory Book Club / Naver Blog Style) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Category tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                dark ? 'bg-slate-800 text-purple-300' : 'bg-slate-100 text-purple-700'
              }`}>
                {post.categoryLabel}
              </span>
            </div>

            {/* Post Title */}
            <h2 className={`text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight mb-2 group-hover:underline underline-offset-4 ${
              dark ? 'text-slate-100 group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-700'
            }`}>
              {post.title}
            </h2>

            {/* Post Summary (2 lines limit) */}
            <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 ${
              dark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {summaryText}
            </p>
          </div>

          {/* Metadata Footer: Author, Date, Comments */}
          <div className={`flex items-center gap-3 sm:gap-4 text-xs ${
            dark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>민우</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <time>{formattedDateTime.split(' ')[0]}</time>
            </span>
          </div>
        </div>

        {/* Right: Thumbnail Image (120x80 or 150x100 clean blog thumbnail) */}
        <div className="w-full sm:w-44 md:w-48 aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/70 dark:border-slate-800">
          <img
            src={post.thumbnail?.src || DEFAULT_REMOTE_IMAGE}
            alt={post.thumbnail?.alt || post.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE_DATA_URI;
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </a>
    </article>
  );
};
