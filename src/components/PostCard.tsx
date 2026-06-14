import React from 'react';
import { GuidePost } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: GuidePost;
  onSelect: (post: GuidePost) => void;
  accentColor: string;
  theme?: 'light' | 'dark';
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, accentColor, theme = 'dark' }) => {
  // 날짜 단순 가이드 포맷터
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <article 
      onClick={() => onSelect(post)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer break-keep select-none ${
        theme === 'dark'
          ? 'border-sky-950 bg-[#042841]/50 hover:bg-[#032e49]/70 hover:border-sky-850 hover:shadow-xl hover:shadow-cyan-950/20'
          : 'border-sky-100 bg-white hover:bg-sky-50/60 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/45 shadow-xs'
      }`}
      id={`post-card-${post.slug}`}
    >
      {/* 둥근 무드 그라데이션 장치 */}
      <div 
        className="absolute -right-12 -top-12 h-24 w-24 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      <div>
        {/* 상단 카테고리 및 태그 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span 
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider font-mono uppercase"
            style={{ 
              backgroundColor: theme === 'dark' ? `${accentColor}15` : `${accentColor}10`, 
              color: accentColor, 
              border: `1px solid ${accentColor}30` 
            }}
          >
            {post.categoryLabel}
          </span>
          <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-sky-300/40' : 'text-slate-400'}`}>
            {post.readTime || '3분 완성'}
          </span>
        </div>

        {/* 타이틀 및 요약 */}
        <h3 className={`font-display font-semibold text-base sm:text-lg line-clamp-2 transition-colors duration-200 ${
          theme === 'dark'
            ? 'text-white group-hover:text-cyan-300'
            : 'text-[#011d33] group-hover:text-sky-600'
        }`}>
          {post.title}
        </h3>
        <p className={`mt-2 text-xs line-clamp-2 leading-relaxed ${
          theme === 'dark' ? 'text-sky-300/60' : 'text-slate-500'
        }`}>
          {post.summary || '유튜브의 보이지 않는 역학과 알고리즘 상위 노출에 관한 공략 비책입니다.'}
        </p>
      </div>

      {/* 하단 메타 데이터 */}
      <div className={`mt-5 pt-4 border-t flex items-center justify-between text-[11px] ${
        theme === 'dark' ? 'border-sky-950/40' : 'border-sky-100/50'
      }`}>
        <div className={`flex items-center gap-3 ${theme === 'dark' ? 'text-sky-300/40' : 'text-slate-400'}`}>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <div className={`flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform duration-200 ${
          theme === 'dark' ? 'text-cyan-400' : 'text-sky-600'
        }`}>
          <span>비책 열기</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </article>
  );
};
