import React, { useState, useEffect } from 'react';
import { GuidePost, CategorySpec } from '../types';
import { ArrowLeft, Share2, Heart, ExternalLink, Calendar, User, UserCheck, Flame } from 'lucide-react';

interface GuideReaderProps {
  post: GuidePost;
  categorySpec: CategorySpec;
  onBack: () => void;
}

interface ContentBlock {
  type: 'h2' | 'h3' | 'h4' | 'list' | 'code' | 'paragraph' | 'divider';
  lines: string[];
  lang?: string;
}

const parseContentToBlocks = (content: string): ContentBlock[] => {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let currentBlock: ContentBlock | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();
    
    // 1. Divider/Horizontal Rule
    if (trimmedLine === '---' || trimmedLine === '***') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      blocks.push({ type: 'divider', lines: [trimmedLine] });
      continue;
    }
    
    // 2. Code Block
    if (trimmedLine.startsWith('```')) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      const lang = trimmedLine.replace('```', '').trim();
      const codeLines: string[] = [];
      i++; // skip start tag line
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lines: codeLines, lang });
      continue;
    }
    
    // If we have an empty line
    if (trimmedLine === '') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }
    
    // 3. Headings
    if (trimmedLine.startsWith('## ')) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      blocks.push({ type: 'h2', lines: [trimmedLine] });
      currentBlock = null;
      continue;
    }
    if (trimmedLine.startsWith('### ')) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      blocks.push({ type: 'h3', lines: [trimmedLine] });
      currentBlock = null;
      continue;
    }
    if (trimmedLine.startsWith('#### ')) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      blocks.push({ type: 'h4', lines: [trimmedLine] });
      currentBlock = null;
      continue;
    }
    
    // 4. List Items
    const isListItem = trimmedLine.startsWith('- ') || 
                       trimmedLine.startsWith('* ') || 
                       /^\d+\.\s+/.test(trimmedLine);
                       
    if (isListItem) {
      if (currentBlock && currentBlock.type !== 'list') {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      if (!currentBlock) {
        currentBlock = { type: 'list', lines: [] };
      }
      currentBlock.lines.push(trimmedLine);
      continue;
    }
    
    // 5. Normal Paragraph lines
    if (currentBlock && currentBlock.type === 'paragraph') {
      currentBlock.lines.push(rawLine);
    } else {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = { type: 'paragraph', lines: [rawLine] };
    }
  }
  
  if (currentBlock) {
    blocks.push(currentBlock);
  }
  
  return blocks;
};

export const GuideReader: React.FC<GuideReaderProps> = ({ post, categorySpec, onBack }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || Math.floor(Math.random() * 45) + 12);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [copiedCodeBlockId, setCopiedCodeBlockId] = useState<number | null>(null);

  // 스크롤 프로그레스 바 계산
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setScrollPercent(scrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 상단으로 부드러운 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [post.slug]);

  // 좋아요 핸들러
  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  // 링크 클립보드 복사
  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
    } catch (err) {
      console.error("Failed to copy link via clipboard", err);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // 텍스트 내의 **볼드** 및 `백틱 인라인코드`를 완벽 포맷팅하는 수동 에디토리얼 파서
  const renderFormattedText = (text: string): React.ReactNode[] => {
    if (!text) return [];
    
    // 이스케이프 문자 및 역슬래시 정리 정돈
    let cleanText = text.replace(/\\`/g, '`').replace(/\\\*/g, '*');
    
    const parts: React.ReactNode[] = [];
    let currentWord = '';
    let i = 0;
    
    while (i < cleanText.length) {
      // 1. 볼드 감지 (** )
      if (cleanText.substring(i, i + 2) === '**') {
        if (currentWord) {
          parts.push(<span key={`txt-${i}`}>{currentWord}</span>);
          currentWord = '';
        }
        i += 2;
        let boldText = '';
        while (i < cleanText.length && cleanText.substring(i, i + 2) !== '**') {
          boldText += cleanText[i];
          i++;
        }
        if (boldText) {
          parts.push(<strong key={`bold-${i}`} className="font-extrabold text-amber-400 mx-0.5">{boldText}</strong>);
        }
        if (cleanText.substring(i, i + 2) === '**') {
          i += 2;
        }
      } 
      // 2. 인라인 백틱 감지 ( ` )
      else if (cleanText[i] === '`') {
        if (currentWord) {
          parts.push(<span key={`txt-${i}`}>{currentWord}</span>);
          currentWord = '';
        }
        i++;
        let codeText = '';
        while (i < cleanText.length && cleanText[i] !== '`') {
          codeText += cleanText[i];
          i++;
        }
        if (codeText) {
          parts.push(<code key={`code-${i}`} className="font-mono text-rose-400 bg-slate-950/80 px-1.5 py-0.5 rounded text-xs mx-0.5 border border-slate-800">{codeText}</code>);
        }
        if (cleanText[i] === '`') {
          i++;
        }
      } 
      // 3. 일반 글자
      else {
        currentWord += cleanText[i];
        i++;
      }
    }
    
    if (currentWord) {
      parts.push(<span key={`txt-end`}>{currentWord}</span>);
    }
    
    return parts;
  };

  return (
    <div className="relative pb-24" id={`guide-reader-${post.slug}`}>
      
      {/* 고 대비 상단 진행 인디케이터 바 */}
      <div 
        className="fixed top-16 left-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-rose-600 transition-all duration-100 z-50"
        style={{ width: `${scrollPercent}%` }}
      />

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* 뒤로가기 / 상단 미니 바 */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button 
            id="reader-back-btn"
            onClick={onBack}
            className="group flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>비책 목록으로 가기</span>
          </button>

          <div className="flex items-center gap-2 relative">
            {shareToast && (
              <div className="absolute -bottom-10 right-0 z-20 bg-slate-900 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-500/20 whitespace-nowrap shadow-lg animate-fade-in-down">
                링크 복사 완료! 🔗
              </div>
            )}
            <button 
              id="reader-share-btn"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="링크 복사"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button 
              id="reader-like-btn"
              onClick={handleLike}
              className={`flex h-9 px-3 gap-1.5 items-center justify-center rounded-xl border transition-all duration-300 ${
                liked 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 scale-105' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="좋아요"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500' : ''}`} />
              <span className="text-xs font-semibold font-mono">{likesCount}</span>
            </button>
          </div>
        </div>

        {/* 아티클 헤더 */}
        <header className="mb-10 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start items-center gap-3.5 mb-4">
            <span 
              className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide font-mono uppercase bg-slate-900"
              style={{ color: categorySpec.accentColor, border: `1px solid ${categorySpec.accentColor}30` }}
            >
              {post.categoryLabel}
            </span>
            <div className="h-4 w-[1px] bg-slate-800" />
            <span className="text-xs font-mono text-slate-500">
              {post.readTime || '3분 완성 밀도'}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h2>
          <p className="mt-3 text-sm sm:text-lg text-slate-400 font-medium">
            {post.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-4 border-t border-slate-900 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="text-slate-300 font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>E-E-A-T 검증 완료</span>
            </div>
          </div>
        </header>

        {/* 2026년 수석 크리에이티브 시그니처 페르소나 코멘트 (강박적이고 유려한 E-E-A-T 연출) */}
        <section className="mb-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-6" id="persona-comment-box">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-red-400 font-mono tracking-wider uppercase">NuTube 2026 수석 멘토단</span>
                <span className="text-[11px] bg-slate-800 px-1.5 py-0.5 rounded text-white font-semibold">CO-PILOT COMMENT</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm italic text-slate-300 font-medium leading-relaxed">
                {categorySpec.persona}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>이 아티클의 전략을 AI 어시스턴트에게 던져 즉석 채널 진단을 받으실 수 있습니다.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 아티클 상세 내용 (가독성 높은 에디토리얼 마크다운 스타일 수동 가공 렌더러) */}
        <article className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-6" id="guide-markdown-body">
          {parseContentToBlocks(post.content).map((block, index) => {
            switch (block.type) {
              case 'h2': {
                const text = block.lines[0].replace(/^##\s+/, '');
                return (
                  <h3 key={index} id={`heading-h2-${index}`} className="pt-6 pb-2 text-xl sm:text-2xl font-bold tracking-tight text-white border-b border-slate-900 font-display">
                    {renderFormattedText(text)}
                  </h3>
                );
              }
              case 'h3': {
                const text = block.lines[0].replace(/^###\s+/, '');
                return (
                  <h4 key={index} id={`heading-h3-${index}`} className="pt-4 pb-1 text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="inline-block h-4 w-1 bg-red-500 rounded-full" />
                    {renderFormattedText(text)}
                  </h4>
                );
              }
              case 'h4': {
                const text = block.lines[0].replace(/^####\s+/, '');
                return (
                  <h5 key={index} id={`heading-h4-${index}`} className="pt-3 pb-1 text-sm sm:text-base font-bold text-amber-500 flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                    {renderFormattedText(text)}
                  </h5>
                );
              }
              case 'divider': {
                return (
                  <hr key={index} id={`divider-${index}`} className="my-8 border-slate-900/80" />
                );
              }
              case 'list': {
                return (
                  <ul key={index} id={`list-block-${index}`} className="space-y-2.5 pl-5 list-disc text-slate-300 bg-slate-900/10 p-4 rounded-xl border border-slate-800/45">
                    {block.lines.map((line, i) => {
                      const cleanItem = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
                      return (
                        <li key={i} className="text-xs sm:text-sm">
                          {renderFormattedText(cleanItem)}
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              case 'code': {
                const codeContent = block.lines.join('\n');
                return (
                  <div key={index} id={`code-block-${index}`} className="relative group my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs text-rose-300/90 shadow-lg">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/70 text-[10px] text-slate-500 border-b border-slate-800">
                      <span className="font-semibold uppercase tracking-wider">{block.lang || 'code'}</span>
                      <button
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(codeContent);
                            setCopiedCodeBlockId(index);
                            setTimeout(() => setCopiedCodeBlockId(null), 2000);
                          } catch (err) {
                            console.error("Code copy failed", err);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[10px] border border-slate-700/65 cursor-pointer min-w-[75px] text-center"
                      >
                        {copiedCodeBlockId === index ? '복사 완료! ✅' : '코드 복사'}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed select-text select-all">
                      <code>{codeContent}</code>
                    </pre>
                  </div>
                );
              }
              case 'paragraph': {
                const paragraphText = block.lines.join('\n');
                return (
                  <p key={index} className="text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
                    {renderFormattedText(paragraphText)}
                  </p>
                );
              }
              default:
                return null;
            }
          })}
        </article>

        {/* E-E-A-T 검증 공식 레퍼런스 출처 링크 카드 */}
        {post.authorityUrl && (
          <section className="mt-12 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5" id="eeat-authority-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <span>E-E-A-T 신뢰성 공식 레퍼런스</span>
                </h4>
                <p className="mt-1 text-xs text-slate-300">
                  해당 비책 가이드는 신뢰할 수 있는 구글 공인 가이드라인과 실물 데이터를 원본으로 검증 수치화했습니다.
                </p>
              </div>
              <a 
                href={post.authorityUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-white transition-all hover:bg-slate-700"
              >
                <span>{post.authorityLabel || '공식 가이드 전문'}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>
        )}

        {/* 가이드 하단 태그 클라우드 */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-wrap gap-2">
          {(post.tags || []).map((tag, i) => (
            <span 
              key={i} 
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="mt-12 text-center">
          <button 
            id="reader-back-btn-bottom"
            onClick={onBack}
            className="inline-flex px-6 py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 text-xs font-semibold hover:text-white transition-all hover:-translate-y-0.5"
          >
            이전 비책 목록으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
};
