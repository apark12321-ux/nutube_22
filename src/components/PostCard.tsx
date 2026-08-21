import React from 'react';
import { GuidePost } from '../types';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE } from '../postImages';
import { formatPostDateTime } from '../utils/dateFormatter';

interface PostCardProps {
  post: GuidePost;
  onSelect: (post: GuidePost) => void;
  accentColor: string;
  href: string;
  theme?: 'light' | 'dark';
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, href, theme = 'light' }) => {
  const formattedDateTime = formatPostDateTime(post.publishedAt, post.slug);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect(post);
  };

  const dark = theme === 'dark';

  return (
    <article id={`post-card-${post.slug}`} className="group py-6 first:pt-0 last:pb-0 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <a
        href={href}
        onClick={handleClick}
        className="flex flex-col sm:flex-row gap-5 items-start cursor-pointer group-hover:opacity-95"
      >
        {/* Post Image Container (Clean 4:3 / 16:10 blog thumbnail) */}
        <div className="w-full sm:w-48 md:w-56 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-800/80">
          <img
            src={post.thumbnail?.src || DEFAULT_REMOTE_IMAGE}
            alt={post.thumbnail?.alt || post.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = DEFAULT_REMOTE_IMAGE;
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Post Details (Pure Editorial Blog Layout) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            {/* Meta header: Category */}
            <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
              <span className={`font-bold px-2.5 py-0.5 rounded-md ${
                dark ? 'bg-slate-800 text-purple-300 border border-slate-700' : 'bg-purple-50 text-purple-700 border border-purple-100'
              }`}>
                {post.categoryLabel}
              </span>
            </div>

            {/* Post Title */}
            <h3 className={`font-heading text-lg sm:text-xl font-bold leading-snug tracking-tight transition-colors break-keep mb-2 ${
              dark ? 'text-white group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-700'
            }`}>
              {post.title}
            </h3>

            {/* Summary */}
            <p className={`line-clamp-2 text-sm sm:text-base leading-relaxed break-keep ${
              dark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {(post.summary || post.subtitle || '유튜브 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.').replace(/\*\*/g, '').replace(/`/g, '')}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className={`mt-3.5 pt-2 flex items-center justify-between text-xs ${
            dark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <time>{formattedDateTime}</time>
            </span>
            <span className={`font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1 ${
              dark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              글 읽기 <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </a>
    </article>
  );
};
