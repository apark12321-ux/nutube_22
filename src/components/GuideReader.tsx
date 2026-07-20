import React, { useEffect, useState } from 'react';
import { GuidePost, CategorySpec, PostImage } from '../types';
import { ArrowLeft, Share2, Calendar, Clock, FileText, List } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE } from '../postImages';

interface GuideReaderProps {
  post: GuidePost;
  categorySpec: CategorySpec;
  onBack: () => void;
  theme?: 'light' | 'dark';
}

interface ContentBlock {
  type: 'h2' | 'h3' | 'list' | 'code' | 'paragraph' | 'divider';
  lines: string[];
  lang?: string;
}

const parseContentToBlocks = (content: string): ContentBlock[] => {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let currentBlock: ContentBlock | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      continue;
    }

    if (line === '---' || line === '***') {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({ type: 'divider', lines: [line] });
      continue;
    }

    if (line.startsWith('```')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      const lang = line.replace('```', '').trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: 'code', lines: codeLines, lang });
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({ type: 'h2', lines: [line.replace(/^#+\s*/, '')] });
      continue;
    }

    if (line.startsWith('### ') || line.startsWith('#### ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({ type: 'h3', lines: [line.replace(/^#+\s*/, '')] });
      continue;
    }

    const isListItem = line.startsWith('- ') || line.startsWith('* ') || /^\d+\s*\.\s+/.test(line);
    if (isListItem) {
      if (currentBlock && currentBlock.type !== 'list') blocks.push(currentBlock);
      if (!currentBlock || currentBlock.type !== 'list') currentBlock = { type: 'list', lines: [] };
      currentBlock.lines.push(line.replace(/^[-*]\s+/, '').replace(/^\d+\s*\.\s+/, ''));
      continue;
    }

    if (currentBlock?.type === 'paragraph') {
      currentBlock.lines.push(rawLine);
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'paragraph', lines: [rawLine] };
    }
  }

  if (currentBlock) blocks.push(currentBlock);
  return blocks;
};

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const ImageFigure = ({ image }: { image?: PostImage }) => {
  const src = image?.src || DEFAULT_REMOTE_IMAGE;
  const alt = image?.alt || '유튜브 채널 운영 참고 이미지';

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-purple-950/40 dark:bg-[#140b2a]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = DEFAULT_REMOTE_IMAGE;
        }}
        className="aspect-[16/9] w-full object-cover"
      />
      {image?.caption ? <figcaption className="px-5 py-3.5 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-purple-950/30">{image.caption}</figcaption> : null}
    </figure>
  );
};

export const GuideReader: React.FC<GuideReaderProps> = ({ post, categorySpec, onBack, theme = 'dark' }) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [shareToast, setShareToast] = useState(false);

  const dark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [post.slug]);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 1800);
    } catch (err) {
      console.error('link copy failed', err);
    }
  };

  const blocks = parseContentToBlocks(post.content);
  let paragraphCount = 0;

  const renderFormattedText = (text: string): React.ReactNode[] => {
    const parts = text.replace(/\`/g, '`').replace(/\*/g, '*').split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="font-extrabold text-[#7C3AED] dark:text-purple-400">{part.slice(2, -2)}</strong>;
      if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="rounded bg-slate-100 dark:bg-purple-950/80 border border-slate-200/50 dark:border-purple-900/30 px-1.5 py-0.5 text-[0.85em] text-[#7C3AED] dark:text-purple-300 font-mono">{part.slice(1, -1)}</code>;
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="relative pb-24" id={`guide-reader-${post.slug}`}>
      {/* Scroll indicator bar */}
      <div className="fixed left-0 top-16 z-50 h-1 bg-gradient-to-r from-purple-500 via-[#7C3AED] to-indigo-600 transition-all duration-100" style={{ width: `${scrollPercent}%` }} />
      
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* Detail Header Navigation */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <button 
            onClick={onBack} 
            className={`group flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer ${
              dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#7C3AED]'
            }`}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>가이드 목록으로 가기</span>
          </button>
          
          <div className="relative">
            {shareToast && (
              <div className={`absolute -bottom-10 right-0 z-20 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold shadow-md ${
                dark ? 'border border-purple-500/20 bg-[#1e0f3d] text-purple-300' : 'border border-purple-100 bg-purple-50 text-[#7C3AED]'
              }`}>
                링크가 복사되었습니다
              </div>
            )}
            <button 
              onClick={handleShare} 
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                dark 
                  ? 'border-purple-950/60 bg-[#140b2a]/60 text-slate-300 hover:bg-[#1f113f] hover:text-white' 
                  : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#7C3AED] shadow-sm'
              }`} 
              title="링크 복사"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Article Title, Author & Stats Header matching '요즘IT' */}
        <header className="mb-8 break-keep">
          {/* Top category label */}
          <p className="text-xs font-bold text-[#7C3AED] dark:text-purple-400 mb-2.5">
            {post.categoryLabel}
          </p>
          
          {/* Title */}
          <h1 className={`text-[25px] sm:text-[32px] font-black leading-tight tracking-tight mb-4 ${
            dark ? 'text-white' : 'text-slate-900'
          }`}>
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className={`text-sm sm:text-[15px] leading-relaxed mb-6 font-medium ${
            dark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {post.subtitle}
          </p>

          {/* Author Details Profile Row */}
          <div className={`flex flex-col gap-3.5 border-t pt-4 border-b pb-4 ${
            dark ? 'border-purple-950/30' : 'border-slate-100'
          }`}>
            {/* Row 1: Profile image and author name */}
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200/40 dark:border-purple-900/40 text-lg">
                🧑‍💻
              </span>
              <div className="flex flex-col">
                <span className={`text-[13px] font-extrabold ${dark ? 'text-white' : 'text-slate-800'}`}>
                  {post.author || '크리에이터랩'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">크리에이터랩 전문 집필진</span>
              </div>
            </div>

            {/* Row 2: Reading Time, relative dates and view metrics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] font-medium text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>{post.readTime || '6분'} 읽기</span>
              </span>
              <span className="text-slate-200 dark:text-purple-950">|</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(post.publishedAt)}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Hero image banner */}
        <ImageFigure image={post.thumbnail} />

        {/* Core dynamic summary and table of contents */}
        <section className="mb-8 grid gap-6 md:grid-cols-2" id="guide-overview-section">
          {/* Guide summary block */}
          <div className={`rounded-2xl border p-5 sm:p-6 flex flex-col ${
            dark ? 'border-purple-950 bg-[#110724]' : 'border-slate-100 bg-white shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#7C3AED]" />
              <h2 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>📝 가이드 핵심 요약</h2>
            </div>
            <p className={`text-[13px] leading-relaxed font-medium ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              {renderFormattedText(post.summary || `${post.title}에 대한 핵심 요약 내용입니다. 아래 본문에서 구체적인 실행 계획을 상세하게 다룹니다.`)}
            </p>
          </div>

          {/* Guide Table of Contents */}
          <div className={`rounded-2xl border p-5 sm:p-6 flex flex-col ${
            dark ? 'border-purple-950 bg-[#110724]' : 'border-slate-100 bg-white shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <List className="h-5 w-5 text-[#7C3AED]" />
              <h2 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>📋 가이드 목차</h2>
            </div>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {blocks
                .map((block, idx) => ({ block, idx }))
                .filter(({ block }) => {
                  if (block.type !== 'h2' && block.type !== 'h3') return false;
                  const headingText = block.lines[0] || '';
                  const cleanText = headingText.trim().toLowerCase();
                  const cleanTitle = post.title.trim().toLowerCase();
                  if (cleanText === cleanTitle || cleanText.includes(cleanTitle) || cleanTitle.includes(cleanText)) {
                    return false;
                  }
                  return true;
                })
                .map(({ block, idx }) => {
                  const isH3 = block.type === 'h3';
                  return (
                    <li key={idx} className={isH3 ? 'pl-4' : ''}>
                      <button
                        onClick={() => {
                          const element = document.getElementById(`heading-${idx}`);
                          if (element) {
                            const headerOffset = 140; // accounted for subnav + nav height
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.scrollY - headerOffset;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`text-left text-xs transition-colors hover:underline hover:cursor-pointer flex items-center gap-1.5 ${
                          isH3
                            ? `${dark ? 'text-slate-400 hover:text-purple-400' : 'text-slate-500 hover:text-[#7C3AED]'} font-normal py-0.5`
                            : `${dark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-800 hover:text-[#7C3AED]'} font-bold py-1 mt-1`
                        }`}
                      >
                        <span className={`inline-block rounded-full bg-purple-400 shrink-0 ${isH3 ? 'h-1 w-1' : 'h-1.5 w-1.5'}`} />
                        <span className="truncate">{block.lines[0]}</span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </section>



        {/* Article Body Content */}
        <article className={`space-y-6 break-keep text-[15px] leading-relaxed sm:text-[16px] sm:leading-8 ${
          dark ? 'text-slate-200' : 'text-slate-800'
        }`} id="guide-markdown-body">
          {blocks.map((block, index) => {
            if (block.type === 'h2') {
              return (
                <h2 
                  key={index} 
                  id={`heading-${index}`} 
                  className={`border-b pb-2 pt-6 text-xl sm:text-2xl font-black tracking-tight ${
                    dark ? 'border-purple-950/40 text-white' : 'border-slate-100 text-[#011d33]'
                  }`}
                >
                  {renderFormattedText(block.lines[0])}
                </h2>
              );
            }
            if (block.type === 'h3') {
              return (
                <h3 
                  key={index} 
                  id={`heading-${index}`} 
                  className={`flex items-center gap-2 pt-4 text-[17px] sm:text-lg font-extrabold ${
                    dark ? 'text-purple-300' : 'text-[#7C3AED]'
                  }`}
                >
                  <span className="inline-block h-4 w-1 rounded-full bg-purple-500" />
                  {renderFormattedText(block.lines[0])}
                </h3>
              );
            }
            if (block.type === 'divider') {
              return <hr key={index} className={dark ? 'my-8 border-purple-950/30' : 'my-8 border-slate-100'} />;
            }
            if (block.type === 'list') {
              return (
                <ul 
                  key={index} 
                  className={`space-y-2 rounded-xl border p-5 pl-7 text-[13.5px] sm:text-sm leading-relaxed ${
                    dark 
                      ? 'border-purple-950/40 bg-[#120822]/40 text-slate-300' 
                      : 'border-slate-100 bg-purple-50/20 text-slate-600'
                  }`}
                >
                  {block.lines.map((line, i) => <li key={i} className="list-disc">{renderFormattedText(line)}</li>)}
                </ul>
              );
            }
            if (block.type === 'code') {
              return (
                <pre key={index} className="overflow-x-auto rounded-xl border border-purple-950 bg-slate-950 p-4 text-xs font-mono leading-relaxed text-purple-300 shadow-sm">
                  <code>{block.lines.join('\n')}</code>
                </pre>
              );
            }
            paragraphCount += 1;
            return (
              <React.Fragment key={index}>
                <p className="font-medium text-[14.5px] sm:text-[15.5px] leading-relaxed">
                  {renderFormattedText(block.lines.join('\n'))}
                </p>
                {paragraphCount === 2 ? <ImageFigure image={post.bodyImages?.[0]} /> : null}
                {paragraphCount === 5 ? <ImageFigure image={post.bodyImages?.[1]} /> : null}
              </React.Fragment>
            );
          })}
        </article>

        {/* Tag Badges */}
        <div className={`mt-10 flex flex-wrap gap-2 border-t pt-6 ${
          dark ? 'border-purple-950/30' : 'border-slate-100'
        }`}>
          {(post.tags || []).map((tag) => (
            <span 
              key={tag} 
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                dark 
                  ? 'bg-purple-950/30 text-purple-300 border border-purple-900/30' 
                  : 'border border-slate-100 bg-slate-50 text-slate-500'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Back navigation button */}
        <div className="mt-12 text-center">
          <button 
            onClick={onBack} 
            className={`inline-flex rounded-full border px-6 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs ${
              dark 
                ? 'border-purple-950 bg-[#140b2a] text-slate-300 hover:bg-[#1f113f] hover:text-white' 
                : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            가이드 목록으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
};
