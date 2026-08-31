import React, { useEffect, useState, useMemo } from 'react';
import { GuidePost, CategorySpec, PostImage } from '../types';
import { ArrowLeft, Share2, Calendar, ChevronRight, List, ArrowUp, ChevronDown, Lightbulb, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE, FALLBACK_IMAGE_DATA_URI } from '../postImages';
import { formatPostDateTime } from '../utils/dateFormatter';
import { updateDynamicPostSeoMeta, resetDefaultSeoMeta } from '../utils/seoAnalyzer';

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
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xs">
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

  // Find Previous and Next Posts in the roadmap
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

  // ScrollSpy to highlight active heading in TOC
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScrollSpy = () => {
      const headingEls = tocItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingEls.length === 0) return;

      const scrollY = window.scrollY;
      const offset = 130; // 130px offset for top header bar and visual threshold

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

  return (
    <div className="relative pb-24" id={`guide-reader-${post.slug}`} itemScope itemType="https://schema.org/BlogPosting">
      {/* Scroll indicator bar */}
      <div className="fixed left-0 top-16 z-50 h-1 bg-purple-600 transition-all duration-100" style={{ width: `${scrollPercent}%` }} />
      
      {/* Main Container with 2-column layout on large screens */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 flex justify-center gap-8 lg:gap-10 xl:gap-12">
        
        {/* Article Main Column */}
        <div className="w-full max-w-3xl min-w-0">
          
          {/* Navigation & Breadcrumbs */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <button 
              onClick={onBack} 
              className={`group flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>목록으로 돌아가기</span>
            </button>
            
            <div className="relative">
              {shareToast && (
                <div className="absolute -bottom-10 right-0 z-20 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold shadow-md border border-purple-200 bg-purple-50 text-purple-700 dark:bg-slate-800 dark:text-purple-300 dark:border-slate-700">
                  링크가 복사되었습니다
                </div>
              )}
              <button 
                onClick={handleShare} 
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  dark 
                    ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`} 
                title="글 공유하기"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-8 break-keep">
            <div className="mb-3">
              <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase ${
                dark ? 'bg-slate-800 text-purple-300 border border-slate-700' : 'bg-purple-50 text-purple-700 border border-purple-100'
              }`}>
                {post.categoryLabel}
              </span>
            </div>
            
            <h1 itemProp="headline" className={`font-heading text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight mb-4 ${
              dark ? 'text-white' : 'text-slate-900'
            }`}>
              {post.title}
            </h1>

            {post.subtitle && (
              <p itemProp="description" className={`text-base sm:text-lg leading-relaxed mb-5 font-normal ${
                dark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {post.subtitle}
              </p>
            )}

            {/* Published Info Row */}
            <div className={`flex flex-wrap items-center justify-between gap-3 py-3 border-y text-xs sm:text-sm ${
              dark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center gap-2 font-mono">
                <Calendar className="w-4 h-4 text-slate-400" />
                <time itemProp="datePublished" dateTime={post.publishedAt}>
                  {formatPostDateTime(post.publishedAt, post.slug)}
                </time>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                크리에이터 실전 가이드
              </span>
            </div>
          </header>

          {/* Hero image */}
          <ImageFigure image={post.thumbnail} />

          {/* AEO / GEO Direct Answer Box (Quick Key Takeaways) */}
          {post.quickAnswer && (
            <div className={`my-8 p-5 sm:p-6 rounded-2xl border ${
              dark 
                ? 'border-purple-500/30 bg-purple-950/20 shadow-lg shadow-purple-950/30' 
                : 'border-purple-200 bg-purple-50/70 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-purple-600 text-white">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className={`text-sm sm:text-base font-extrabold tracking-tight ${dark ? 'text-purple-200' : 'text-purple-900'}`}>
                  바쁜 크리에이터를 위한 30초 핵심 정답 (AEO 요약)
                </h3>
              </div>

              <ul className="space-y-2 mb-4">
                {post.quickAnswer.summary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${dark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={dark ? 'text-slate-200' : 'text-slate-800'}>{point}</span>
                  </li>
                ))}
              </ul>

              <div className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                dark 
                  ? 'border-purple-500/40 bg-purple-900/40 text-purple-200' 
                  : 'border-purple-300 bg-white text-purple-900 shadow-2xs'
              }`}>
                <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-600 text-white">
                  핵심 결론
                </span>
                <span>{post.quickAnswer.keyTakeaway}</span>
              </div>
            </div>
          )}

          {/* Mobile / Tablet Collapsible Quick TOC (Visible on < lg screens) */}
          {tocItems.length > 0 && (
            <div className="my-6 lg:hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 transition-all">
              <button
                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                className="flex w-full items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>글 목차 바로가기 ({tocItems.length}개 항목)</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileTocOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileTocOpen && (
                <nav className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-1 text-xs">
                  {tocItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToHeading(item.id, e)}
                        className={`block rounded-lg transition-colors py-1.5 ${
                          item.level === 3 ? 'pl-5 text-[11.5px]' : 'pl-2 font-medium'
                        } ${
                          isActive
                            ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-purple-950/40'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {item.level === 3 && <span className="opacity-50 mr-1.5">•</span>}
                        {item.text}
                      </a>
                    );
                  })}
                </nav>
              )}
            </div>
          )}

          {/* Article Body */}
          <article 
            itemProp="articleBody"
            className={`space-y-6 break-keep text-base sm:text-[17px] leading-[1.9] font-normal ${
              dark ? 'text-slate-200' : 'text-slate-800'
            }`} 
            id="guide-markdown-body"
          >
            {blocks.map((block, index) => {
              if (block.type === 'h2') {
                return (
                  <h2 
                    key={index} 
                    id={`heading-${index}`} 
                    className={`scroll-mt-24 font-heading text-xl sm:text-2xl font-bold leading-snug tracking-tight pt-8 pb-2 border-b mt-8 ${
                      dark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'
                    }`}
                  >
                    {block.lines[0]}
                  </h2>
                );
              }
              if (block.type === 'h3') {
                return (
                  <h3 
                    key={index} 
                    id={`heading-${index}`} 
                    className={`scroll-mt-24 font-heading text-lg sm:text-xl font-bold leading-snug pt-4 mt-4 ${
                      dark ? 'text-purple-200' : 'text-purple-950'
                    }`}
                  >
                    {block.lines[0]}
                  </h3>
                );
              }
              if (block.type === 'divider') {
                return (
                  <hr key={index} className={`my-8 border-t ${dark ? 'border-slate-800' : 'border-slate-200'}`} />
                );
              }
              if (block.type === 'list') {
                return (
                  <ul key={index} className="my-4 space-y-2 pl-5 list-disc">
                    {block.lines.map((li, lIdx) => (
                      <li key={lIdx} className="leading-relaxed">
                        {renderFormattedText(li.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === 'table') {
                const tableRows = block.lines.map((r) => r.split('|').map((c) => c.trim()).filter(Boolean));
                if (tableRows.length === 0) return null;
                const headers = tableRows[0];
                const dataRows = tableRows.slice(2);

                return (
                  <div key={index} className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          {headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3">
                              {renderFormattedText(h)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {dataRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3">
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
                  <pre key={index} className="my-6 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs sm:text-sm text-slate-100">
                    <code>{block.lines.join('\n')}</code>
                  </pre>
                );
              }

              paragraphCount += 1;
              return (
                <React.Fragment key={index}>
                  <p className="mb-6 leading-[1.9]">
                    {renderFormattedText(block.lines.join('\n'))}
                  </p>
                  {paragraphCount === 2 ? <ImageFigure image={post.bodyImages?.[0]} /> : null}
                  {paragraphCount === 5 ? <ImageFigure image={post.bodyImages?.[1]} /> : null}
                </React.Fragment>
              );
            })}
          </article>

          {/* GEO / AEO FAQ Accordion Section */}
          {post.faqList && post.faqList.length > 0 && (
            <section className={`mt-10 p-6 sm:p-7 rounded-2xl border ${
              dark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/70'
            }`} itemScope itemType="https://schema.org/FAQPage">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 rounded-lg bg-purple-600 text-white">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className={`font-heading text-lg sm:text-xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
                  자주 묻는 질문 (FAQ)
                </h3>
              </div>

              <div className="space-y-3">
                {post.faqList.map((faq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div 
                      key={fIdx} 
                      className={`rounded-xl border transition-all ${
                        dark 
                          ? isOpen ? 'border-purple-500/50 bg-slate-900' : 'border-slate-800 bg-slate-900/40'
                          : isOpen ? 'border-purple-200 bg-white shadow-xs' : 'border-slate-200/80 bg-white/60'
                      }`}
                      itemScope 
                      itemProp="mainEntity" 
                      itemType="https://schema.org/Question"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left font-bold text-sm sm:text-base cursor-pointer"
                      >
                        <span itemProp="name" className={dark ? 'text-slate-100' : 'text-slate-900'}>
                          Q. {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-purple-600' : 'text-slate-400'}`} />
                      </button>

                      {isOpen && (
                        <div 
                          className="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800"
                          itemScope 
                          itemProp="acceptedAnswer" 
                          itemType="https://schema.org/Answer"
                        >
                          <p itemProp="text" className={dark ? 'text-slate-300' : 'text-slate-700'}>
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Step-by-Step Roadmap Navigation (Previous / Next Guide) */}
          {(prevPost || nextPost) && (
            <nav aria-label="단계별 로드맵 이동" className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <button
                  onClick={() => onSelectPost ? onSelectPost(prevPost.slug) : onBack()}
                  className={`p-4 sm:p-5 rounded-2xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                    dark 
                      ? 'border-slate-800 bg-slate-900/60 hover:border-purple-500/50 hover:bg-slate-900' 
                      : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>이전 가이드</span>
                  </div>
                  <h4 className={`text-sm sm:text-base font-bold line-clamp-2 leading-snug ${
                    dark ? 'text-white group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-700'
                  }`}>
                    {prevPost.title}
                  </h4>
                </button>
              ) : <div />}

              {nextPost ? (
                <button
                  onClick={() => onSelectPost ? onSelectPost(nextPost.slug) : onBack()}
                  className={`p-4 sm:p-5 rounded-2xl border text-right flex flex-col justify-between transition-all group cursor-pointer ${
                    dark 
                      ? 'border-slate-800 bg-slate-900/60 hover:border-purple-500/50 hover:bg-slate-900' 
                      : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
                    <span>다음 단계 가이드</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <h4 className={`text-sm sm:text-base font-bold line-clamp-2 leading-snug ${
                    dark ? 'text-white group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-700'
                  }`}>
                    {nextPost.title}
                  </h4>
                </button>
              ) : null}
            </nav>
          )}

          {/* Author & Creator Note Card (E-E-A-T Persona) */}
          <div className={`mt-10 p-5 sm:p-6 rounded-2xl border ${
            dark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200/90 bg-slate-50/80'
          }`}>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                민우
              </div>
              <div>
                <h4 className={`text-sm font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                  <span>작성자: 민우 (1인 크리에이터)</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    실전 5년차
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  고가 장비로 300만 원 날린 뒤, 스마트폰 1대로 다시 세운 월 100만 원 복합 파이프라인
                </p>
              </div>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed mt-2.5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              이 글은 뻔한 교과서식 이론이 아니라, 제가 직접 채널과 블로그를 운영하며 겪었던 시행착오와 실패 경험을 바탕으로 썼습니다. 여러분의 시간과 돈을 아끼는 데 조금이라도 보탬이 되었으면 합니다. 궁금한 점은 언제든 문의 페이지에 남겨주세요!
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className={`text-xs px-2.5 py-1 rounded-md ${
                  dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="mt-12 text-center">
            <button 
              onClick={onBack} 
              className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all cursor-pointer ${
                dark 
                  ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700' 
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>전체 글 목록으로 가기</span>
            </button>
          </div>

        </div>

        {/* Desktop Sticky Table of Contents (TOC) Sidebar (Visible on >= lg screens) */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-6 scrollbar-thin">
              <div className={`p-4 rounded-2xl border ${
                dark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      dark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      목차 (TOC)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {tocItems.length}개 항목
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
                        className={`block rounded-lg transition-all leading-snug cursor-pointer ${
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

                {/* Quick actions in TOC */}
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

