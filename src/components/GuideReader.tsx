import React, { useEffect, useState, useMemo } from 'react';
import { GuidePost, CategorySpec, PostImage } from '../types';
import { ArrowLeft, Share2, Calendar, ChevronRight, List, ArrowUp, ChevronDown, Lightbulb, CheckCircle2, HelpCircle, ArrowRight, User, ShieldCheck, Folder } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE, FALLBACK_IMAGE_DATA_URI } from '../postImages';
import { formatPostDateTime } from '../utils/dateFormatter';
import { updateDynamicPostSeoMeta, resetDefaultSeoMeta } from '../utils/seoAnalyzer';
import { BlogComments } from './BlogComments';

interface GuideReaderProps {
  post: GuidePost;
  categorySpec: CategorySpec;
  onBack: () => void;
  theme?: 'light' | 'dark';
  allPosts?: GuidePost[];
  onSelectPost?: (slug: string) => void;
}

interface ContentBlock {
  type: 'h2' | 'h3' | 'list' | 'code' | 'paragraph' | 'divider' | 'table';
  lines: string[];
  lang?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
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

    if (line.startsWith('|') && line.includes('|')) {
      if (currentBlock && currentBlock.type !== 'table') blocks.push(currentBlock);
      if (!currentBlock || currentBlock.type !== 'table') currentBlock = { type: 'table', lines: [] };
      currentBlock.lines.push(line);
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

    if (line.startsWith('### ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({ type: 'h3', lines: [line.replace('### ', '').trim()] });
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({ type: 'h2', lines: [line.replace('## ', '').trim()] });
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      if (currentBlock && currentBlock.type !== 'list') blocks.push(currentBlock);
      if (!currentBlock || currentBlock.type !== 'list') currentBlock = { type: 'list', lines: [] };
      currentBlock.lines.push(line);
      continue;
    }

    if (currentBlock && currentBlock.type === 'paragraph') {
      currentBlock.lines.push(line);
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'paragraph', lines: [line] };
    }
  }

  if (currentBlock) blocks.push(currentBlock);
  return blocks;
};

const ImageFigure: React.FC<{ image?: PostImage }> = ({ image }) => {
  if (!image || !image.src) return null;
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xs">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image.src}
          alt={image.alt || '가이드 이미지'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE_DATA_URI;
          }}
          className="h-full w-full object-cover"
        />
      </div>
      {image.caption && (
        <figcaption className="border-t border-slate-200/60 dark:border-slate-800 px-4 py-2.5 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
};

export const GuideReader: React.FC<GuideReaderProps> = ({ post, onBack, theme = 'light', allPosts = [], onSelectPost }) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const dark = theme === 'dark';

  const blocks = useMemo(() => parseContentToBlocks(post.content), [post.content]);

  // Find category posts for Tistory "카테고리의 다른 글" Box
  const categoryPosts = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];
    const sameCat = allPosts.filter(p => p.category === post.category);
    const currentIndex = sameCat.findIndex(p => p.slug === post.slug);
    if (currentIndex === -1) return sameCat.slice(0, 5);
    
    // Pick 5 posts around the current post
    const start = Math.max(0, currentIndex - 2);
    return sameCat.slice(start, start + 5);
  }, [allPosts, post.category, post.slug]);

  // Previous & Next Posts
  const prevPost = useMemo(() => {
    if (post.prevPostSlug && allPosts.length > 0) {
      return allPosts.find((p) => p.slug === post.prevPostSlug);
    }
    const idx = allPosts.findIndex((p) => p.slug === post.slug);
    return idx > 0 ? allPosts[idx - 1] : undefined;
  }, [post, allPosts]);

  const nextPost = useMemo(() => {
    if (post.nextPostSlug && allPosts.length > 0) {
      return allPosts.find((p) => p.slug === post.nextPostSlug);
    }
    const idx = allPosts.findIndex((p) => p.slug === post.slug);
    return idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : undefined;
  }, [post, allPosts]);

  // Extract H2 and H3 headings for the Table of Contents
  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [];
    blocks.forEach((block, index) => {
      if (block.type === 'h2' || block.type === 'h3') {
        const headingText = block.lines[0]?.replace(/\*\*/g, '').trim();
        if (headingText) {
          items.push({
            id: `heading-${index}`,
            text: headingText,
            level: block.type === 'h2' ? 2 : 3,
          });
        }
      }
    });
    return items;
  }, [blocks]);

  // Related questions for benchmarked phongnhaexplorer style
  const relatedQuestions = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];
    const sameCat = allPosts.filter(p => p.slug !== post.slug && p.category === post.category);
    if (sameCat.length >= 4) return sameCat.slice(0, 4);
    const others = allPosts.filter(p => p.slug !== post.slug && p.category !== post.category);
    return [...sameCat, ...others].slice(0, 4);
  }, [allPosts, post]);

  const readingMinutes = Math.max(3, Math.round(post.content.length / 500));

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight > 0) {
        setScrollPercent((el.scrollTop / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsMobileTocOpen(false);
  }, [post.slug]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScrollSpy = () => {
      const headingEls = tocItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingEls.length === 0) return;

      const scrollY = window.scrollY;
      const offset = 130;

      let current = headingEls[0].id;
      for (let i = 0; i < headingEls.length; i++) {
        const elTop = headingEls[i].getBoundingClientRect().top + window.scrollY;
        if (scrollY >= elTop - offset) {
          current = headingEls[i].id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [tocItems]);

  const scrollToHeading = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      setIsMobileTocOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic JSON-LD Structured Data & Meta tags
  useEffect(() => {
    const scriptId = 'jsonld-guide-post';
    let existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const postUrl = `https://nutube.kr/post/${post.slug}`;
    const formattedPublishedDate = new Date(post.publishedAt).toISOString();
    const formattedModifiedDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : formattedPublishedDate;

    const topKeywords = updateDynamicPostSeoMeta(post);
    const keywordsString = topKeywords ? topKeywords.join(', ') : (post.tags || []).join(', ');

    const graphElements: any[] = [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        "headline": post.title,
        "alternativeHeadline": post.subtitle,
        "description": post.summary || post.title,
        "inLanguage": "ko-KR",
        "mainEntityOfPage": postUrl,
        "datePublished": formattedPublishedDate,
        "dateModified": formattedModifiedDate,
        "author": {
          "@type": "Person",
          "name": post.author || "민우",
          "url": "https://nutube.kr/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "크리에이터 노트",
          "url": "https://nutube.kr/"
        },
        "image": post.thumbnail?.src || DEFAULT_REMOTE_IMAGE,
        "articleSection": post.categoryLabel,
        "keywords": keywordsString
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "홈",
            "item": "https://nutube.kr/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": post.categoryLabel,
            "item": `https://nutube.kr/?category=${post.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": postUrl
          }
        ]
      }
    ];

    if (post.faqList && post.faqList.length > 0) {
      graphElements.push({
        "@type": "FAQPage",
        "@id": `${postUrl}#faq`,
        "mainEntity": post.faqList.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": graphElements
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) scriptToRemove.remove();
      resetDefaultSeoMeta();
    };
  }, [post]);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 1800);
    } catch (err) {
      console.error('link copy failed', err);
    }
  };

  let paragraphCount = 0;

  const renderFormattedText = (text: string): React.ReactNode[] => {
    if (!text) return [];

    let cleanText = text.replace(/\*\*\s*\*\*/g, '');
    cleanText = cleanText.replace(/\*\*'([^']+)'\*\*/g, "'$1'");
    cleanText = cleanText.replace(/\*\*"([^"]+)"\*\*/g, '"$1"');
    cleanText = cleanText.replace(/\\`/g, '`').replace(/\\\*/g, '*');

    const doubleStarCount = (cleanText.match(/\*\*/g) || []).length;
    if (doubleStarCount % 2 !== 0) {
      cleanText = cleanText + '**';
    }

    const parts: React.ReactNode[] = [];
    let i = 0;
    let currentText = '';

    while (i < cleanText.length) {
      if (cleanText.substring(i, i + 2) === '**') {
        if (currentText) {
          parts.push(<span key={`txt-${i}`}>{currentText}</span>);
          currentText = '';
        }
        i += 2;
        let boldContent = '';
        while (i < cleanText.length && cleanText.substring(i, i + 2) !== '**') {
          boldContent += cleanText[i];
          i += 1;
        }
        if (i < cleanText.length) {
          i += 2;
        }
        const trimmedBold = boldContent.trim();
        if (trimmedBold) {
          parts.push(
            <strong key={`b-${i}`} className={`font-bold ${dark ? 'text-white' : 'text-slate-900 font-extrabold'}`}>
              {trimmedBold}
            </strong>
          );
        } else {
          parts.push(<span key={`sp-${i}`}> </span>);
        }
      } else if (cleanText[i] === '`') {
        if (currentText) {
          parts.push(<span key={`txt-${i}`}>{currentText}</span>);
          currentText = '';
        }
        i += 1;
        let codeContent = '';
        while (i < cleanText.length && cleanText[i] !== '`') {
          codeContent += cleanText[i];
          i += 1;
        }
        if (cleanText[i] === '`') {
          i += 1;
        }

        const trimmedCode = codeContent.trim();
        if (trimmedCode) {
          parts.push(
            <code key={`code-${i}`} className="rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 text-[0.9em] font-mono text-purple-700 dark:text-purple-300">
              {trimmedCode}
            </code>
          );
        }
      } else {
        currentText += cleanText[i];
        i += 1;
      }
    }

    if (currentText) {
      parts.push(<span key="txt-end">{currentText}</span>);
    }

    return parts;
  };

  const formattedDateTime = formatPostDateTime(post.publishedAt, post.slug);

  return (
    <div className="relative pb-24" id={`guide-reader-${post.slug}`} itemScope itemType="https://schema.org/BlogPosting">
      {/* Scroll indicator bar */}
      <div className="fixed left-0 top-16 z-50 h-1 bg-purple-600 transition-all duration-100" style={{ width: `${scrollPercent}%` }} />
      
      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 flex justify-center gap-8 lg:gap-10 xl:gap-12">
        
        {/* Article Main Column (Tistory / Naver Classic Article Layout) */}
        <div className="w-full max-w-3xl min-w-0">
          
          {/* 1. Breadcrumbs (Tistory Style) */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button onClick={onBack} className="hover:underline cursor-pointer">
              홈
            </button>
            <span>&gt;</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {post.categoryLabel}
            </span>
          </nav>

          {/* 2. Article Header */}
          <header className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            {/* Category tag */}
            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded mb-3 ${
              dark ? 'bg-blue-950 text-blue-300 border border-blue-900' : 'bg-blue-50 text-blue-700 border border-blue-100'
            }`}>
              {post.categoryLabel}
            </span>

            {/* Title (H1) */}
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight leading-snug break-keep ${
              dark ? 'text-white' : 'text-slate-900'
            }`} itemProp="headline">
              {post.title}
            </h1>

            {/* Subtitle / Key Hook */}
            {post.subtitle && (
              <p className={`mt-3 text-sm sm:text-base leading-relaxed break-keep font-medium ${
                dark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {post.subtitle}
              </p>
            )}

            {/* Metadata Bar (phongnhaexplorer style) */}
            <div className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 flex-wrap text-xs ${
              dark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>민우 (운영자)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={new Date(post.publishedAt).toISOString()}>{formattedDateTime}</time>
                </span>
                <span>•</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  {readingMinutes}분 읽기
                </span>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className={`p-1.5 rounded-md border flex items-center gap-1 cursor-pointer transition-colors text-xs ${
                  dark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                title="글 링크 복사"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>공유</span>
              </button>
            </div>
          </header>

          {/* Share Toast */}
          {shareToast && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-fade-in">
              글 링크가 클립보드에 복사되었습니다.
            </div>
          )}

          {/* Best Answer Box (phongnhaexplorer signature #best-answer) */}
          <div 
            id="best-answer" 
            className={`my-6 p-4 sm:p-5 rounded-xl border transition-colors ${
              dark ? 'bg-blue-950/30 border-blue-900/80 text-slate-200' : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-blue-700 dark:text-blue-300 mb-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>핵심 답변 & 바로 알기</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed font-medium">
              <strong className="text-blue-900 dark:text-blue-100">
                {post.title.split('?')[0] || post.title}:
              </strong>{' '}
              {post.quickAnswer?.keyTakeaway || post.subtitle || post.summary || '1인 미디어 제작과 채널 성장을 위한 실전 핵심 노하우를 명확히 짚어드립니다.'}
            </p>
            {post.quickAnswer?.summary && post.quickAnswer.summary.length > 0 && (
              <ul className="mt-3 pt-3 border-t border-blue-200/60 dark:border-blue-900/60 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {post.quickAnswer.summary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Related Questions Box (phongnhaexplorer signature .question-more) */}
          {relatedQuestions.length > 0 && (
            <div className={`question-more mb-7 p-4 sm:p-5 rounded-xl border transition-colors ${
              dark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200/90'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 mb-2.5">
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>이런 질문도 있으신가요? (관련 추천 가이드)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {relatedQuestions.map((q) => (
                  <li key={q.slug} className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <button
                      onClick={() => {
                        if (onSelectPost) onSelectPost(q.slug);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`text-left hover:underline cursor-pointer ${
                        dark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-700 hover:text-blue-600'
                      }`}
                    >
                      {q.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Table of Contents Box (Tistory TOC Plugin Style) */}
          {tocItems.length > 0 && (
            <div className={`mb-8 p-4 sm:p-5 rounded-xl border transition-colors ${
              dark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div 
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              >
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
                    목차 (Table of Contents)
                  </span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  [{isMobileTocOpen ? '접기' : '펼치기'}]
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileTocOpen ? 'rotate-180' : ''}`} />
                </span>
              </div>

              {isMobileTocOpen && (
                <ol className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                  {tocItems.map((item, idx) => (
                    <li key={item.id} className={item.level === 3 ? 'pl-4 text-slate-500' : 'font-medium'}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => scrollToHeading(item.id, e)}
                        className={`hover:underline cursor-pointer ${
                          dark ? 'text-slate-300 hover:text-purple-300' : 'text-slate-700 hover:text-purple-700'
                        }`}
                      >
                        {idx + 1}. {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* 5. Main Content Area */}
          <div id="guide-markdown-body" className="space-y-6 leading-relaxed font-sans text-base sm:text-lg" itemProp="articleBody">
            {blocks.map((block, index) => {
              if (block.type === 'h2') {
                const headingText = block.lines[0]?.replace(/\*\*/g, '').trim();
                return (
                  <div key={index} id={`heading-${index}`} className="pt-6 pb-2 scroll-mt-24">
                    <h2 className={`text-xl sm:text-2xl font-bold tracking-tight border-l-4 pl-3.5 transition-colors ${
                      dark ? 'border-purple-500 text-white' : 'border-slate-900 text-slate-900'
                    }`}>
                      {headingText}
                    </h2>
                  </div>
                );
              }

              if (block.type === 'h3') {
                const headingText = block.lines[0]?.replace(/\*\*/g, '').trim();
                return (
                  <div key={index} id={`heading-${index}`} className="pt-4 pb-1 scroll-mt-24">
                    <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${
                      dark ? 'text-slate-100' : 'text-slate-800'
                    }`}>
                      {headingText}
                    </h3>
                  </div>
                );
              }

              if (block.type === 'divider') {
                return (
                  <hr key={index} className="my-8 border-t border-slate-200 dark:border-slate-800" />
                );
              }

              if (block.type === 'list') {
                return (
                  <ul key={index} className="my-4 space-y-2 pl-2">
                    {block.lines.map((item, idx) => {
                      const cleanItem = item.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
                      return (
                        <li key={idx} className="flex gap-2.5 items-start text-sm sm:text-base leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600 dark:bg-purple-400" />
                          <span className={dark ? 'text-slate-300' : 'text-slate-700'}>
                            {renderFormattedText(cleanItem)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              if (block.type === 'table') {
                const tableRows = block.lines.map(row => 
                  row.split('|').map(cell => cell.trim()).filter((_, i, arr) => i !== 0 && i !== arr.length - 1)
                ).filter(row => row.length > 0);

                if (tableRows.length < 2) return null;
                const headers = tableRows[0];
                const dataRows = tableRows.slice(2);

                return (
                  <div key={index} className="my-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className={`border-b ${dark ? 'bg-slate-800/80 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                        <tr>
                          {headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-4 py-2.5 font-bold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {dataRows.map((row, rIdx) => (
                          <tr key={rIdx} className={dark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`px-4 py-2.5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                                {renderFormattedText(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (block.type === 'code') {
                return (
                  <div key={index} className="my-6 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-200">
                    <pre className="overflow-x-auto">{block.lines.join('\n')}</pre>
                  </div>
                );
              }

              // Paragraphs
              const paragraphText = block.lines.join(' ');
              paragraphCount += 1;

              // Check if it's a Callout / Tip box (E-E-A-T Real Experience note)
              const isTipBox = paragraphText.includes('실제 겪어본') || 
                               paragraphText.includes('솔직 후기') || 
                               paragraphText.includes('아쉬웠던 점') || 
                               paragraphText.includes('실패담') || 
                               paragraphText.includes('민우의');

              if (isTipBox) {
                return (
                  <div key={index} className={`my-6 p-4 sm:p-5 rounded-xl border-l-4 transition-colors ${
                    dark 
                      ? 'bg-purple-950/20 border-purple-500 text-purple-200' 
                      : 'bg-amber-50/70 border-amber-500 text-amber-950'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-xs sm:text-sm">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>민우의 실전 코멘트 (E-E-A-T 시행착오 노트)</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {renderFormattedText(paragraphText)}
                    </p>
                  </div>
                );
              }

              return (
                <p key={index} className={`leading-relaxed text-sm sm:text-base mb-4 break-keep ${
                  dark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {renderFormattedText(paragraphText)}
                </p>
              );
            })}
          </div>

          {/* 5. Tags (Tistory Style) */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">태그:</span>
              {post.tags.map((tag) => (
                <span key={tag} className={`px-2.5 py-1 rounded-md transition-colors ${
                  dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 8. Copyright & Author Card (Tistory Signature) */}
          <div className={`mt-8 p-5 rounded-xl border text-xs leading-relaxed ${
            dark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2 mb-2 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>저작권 및 저작자표시 (CCL)</span>
            </div>
            <p>
              본 콘텐츠는 <strong className="text-slate-800 dark:text-slate-200">크리에이터 노트 (운영자: 민우)</strong>에 저작권이 있습니다. 비영리적 목적의 출처 표기 인용은 자유로우나, 사전 동의 없는 무단 전문 복제 및 상업적 무단 배포는 엄격히 금지됩니다.
            </p>
          </div>

          {/* 9. '카테고리의 다른 글' Box (Tistory Signature Widget) */}
          {categoryPosts.length > 0 && (
            <div className={`mt-8 p-5 rounded-xl border ${
              dark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <Folder className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
                  '{post.categoryLabel}' 카테고리의 다른 글
                </h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {categoryPosts.map((catPost) => {
                  const isCurrent = catPost.slug === post.slug;
                  return (
                    <li key={catPost.slug} className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          if (!isCurrent && onSelectPost) {
                            onSelectPost(catPost.slug);
                          }
                        }}
                        disabled={isCurrent}
                        className={`text-left truncate transition-colors cursor-pointer ${
                          isCurrent
                            ? 'font-bold text-purple-600 dark:text-purple-400 underline underline-offset-4 cursor-default'
                            : dark
                              ? 'text-slate-300 hover:text-white'
                              : 'text-slate-700 hover:text-purple-700'
                        }`}
                      >
                        <span className="mr-1.5 opacity-60">•</span>
                        {catPost.title} {isCurrent && <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">(현재글)</span>}
                      </button>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {formatPostDateTime(catPost.publishedAt, catPost.slug).split(' ')[0]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* 10. Previous / Next Post Navigation (Tistory Style) */}
          <nav className="mt-8 border-t border-b border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
            {prevPost && (
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-slate-400 font-semibold shrink-0">이전글</span>
                <button
                  onClick={() => onSelectPost ? onSelectPost(prevPost.slug) : onBack()}
                  className={`truncate text-left font-medium hover:underline cursor-pointer ${
                    dark ? 'text-slate-300 hover:text-purple-300' : 'text-slate-700 hover:text-purple-700'
                  }`}
                >
                  {prevPost.title}
                </button>
              </div>
            )}
            {nextPost && (
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-slate-400 font-semibold shrink-0">다음글</span>
                <button
                  onClick={() => onSelectPost ? onSelectPost(nextPost.slug) : onBack()}
                  className={`truncate text-left font-medium hover:underline cursor-pointer ${
                    dark ? 'text-slate-300 hover:text-purple-300' : 'text-slate-700 hover:text-purple-700'
                  }`}
                >
                  {nextPost.title}
                </button>
              </div>
            )}
          </nav>

          {/* 11. Comments Section (Tistory / Naver Style Interactive Comments) */}
          <BlogComments postSlug={post.slug} theme={theme} />

          {/* 12. Bottom Back to List Button */}
          <div className="mt-10 text-center">
            <button 
              onClick={onBack} 
              className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                dark 
                  ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700' 
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>글 목록으로 돌아가기</span>
            </button>
          </div>

        </div>

        {/* Desktop Sticky Table of Contents (TOC) Sidebar */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-6 scrollbar-thin">
              <div className={`p-4 rounded-xl border ${
                dark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      dark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      본문 목차
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {tocItems.length}개
                  </span>
                </div>

                <nav className="space-y-1 text-xs">
                  {tocItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToHeading(item.id, e)}
                        className={`block rounded-md transition-all leading-snug cursor-pointer ${
                          item.level === 3 ? 'pl-5 py-1 text-[11.5px]' : 'pl-2.5 py-1.5 font-medium'
                        } ${
                          isActive
                            ? dark
                              ? 'bg-purple-950/50 text-purple-300 font-bold border-l-2 border-purple-400'
                              : 'bg-purple-50 text-purple-700 font-bold border-l-2 border-purple-600 shadow-2xs'
                            : dark
                              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        {item.level === 3 && <span className="opacity-50 mr-1.5">•</span>}
                        {item.text}
                      </a>
                    );
                  })}
                </nav>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <button
                    onClick={scrollToTop}
                    className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>맨 위로</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>공유하기</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
};
