import React from 'react';
import { GuidePost } from '../types';
import { Calendar, User, Tag } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE, FALLBACK_IMAGE_DATA_URI } from '../postImages';
import { formatPostDate } from '../utils/dateFormatter';

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
  const formattedDate = formatPostDate(post.publishedAt);
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
      className={`py-5 border-b transition-colors ${
        dark ? 'border-slate-800/80 hover:bg-slate-900/40' : 'border-slate-100 hover:bg-slate-50/70'
      } px-2 sm:px-4 rounded-lg`}
    >
      <a
        href={href}
        onClick={handleClick}
        className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-5 items-start cursor-pointer group"
      >
        {/* Left: Content Text (phongnhaexplorer Q&A format) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Meta Tags: Category */}
            <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
              <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                dark ? 'bg-slate-800 text-blue-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {post.categoryLabel}
              </span>
            </div>

            {/* Post Title (Question / Guide Header) */}
            <h2 className={`text-base sm:text-lg md:text-xl font-bold leading-snug tracking-tight mb-2 group-hover:underline underline-offset-4 ${
              dark ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
            }`}>
              {post.title}
            </h2>

            {/* Post Summary (Clear Direct Answer Excerpt) */}
            <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 ${
              dark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {summaryText}
            </p>
          </div>

          {/* Metadata Footer: Author & Date */}
          <div className={`flex items-center gap-3 text-xs ${
            dark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>민우 (50대 크리에이터)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <time>{formattedDate}</time>
            </span>
          </div>
        </div>

        {/* Right: Technical Document Badge (Ultra-light Text Layout without <img>) */}
        <div className="hidden sm:flex flex-col items-center justify-center w-28 h-20 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 shrink-0 text-center group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">GUIDE</span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">MANUAL</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">전문 읽기 &rarr;</span>
        </div>
      </a>
    </article>
  );
};
