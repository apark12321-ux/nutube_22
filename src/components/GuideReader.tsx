import React, { useEffect, useState } from 'react';
import { GuidePost, CategorySpec, PostImage } from '../types';
import { ArrowLeft, Share2, Calendar, FileText, List, Tag } from 'lucide-react';
import { DEFAULT_REMOTE_IMAGE } from '../postImages';
import { formatPostDateTime } from '../utils/dateFormatter';
import { updateDynamicPostSeoMeta, resetDefaultSeoMeta, extractTopSeoKeywords } from '../utils/seoAnalyzer';

interface GuideReaderProps {
  post: GuidePost;
  categorySpec: CategorySpec;
  onBack: () => void;
  theme?: 'light' | 'dark';
}

interface ContentBlock {
  type: 'h2' | 'h3' | 'list' | 'code' | 'paragraph' | 'divider' | 'table';
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  // Dynamic JSON-LD Structured Data Injection for AEO, GEO & Search Engines
  useEffect(() => {
    const scriptId = 'jsonld-guide-post';
    let existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const postUrl = `https://nutube.kr/post/${post.slug}`;
    const formattedPublishedDate = new Date(post.publishedAt).toISOString();
    const formattedModifiedDate = post.updatedAt ? new Date(post.updatedAt).toISOString() : formattedPublishedDate;

    // Build FAQ Q&A entity pairs for GEO
    const faqEntities = [
      {
        question: `'${post.title}'의 가장 중요한 핵심 요점은 무엇인가요?`,
        answer: post.summary || `${post.title}의 핵심은 구체적인 타겟 시청자의 문제 해결과 알고리즘 체류시간을 높이는 정교한 구조화 기획에 있습니다.`
      },
      {
        question: `이 가이드를 실제로 적용할 때 가장 유의해야 할 점은 무엇인가요?`,
        answer: `단순한 자극적인 낚시성 제목이나 썸네일 대신, 도입부 10초 이내에 시청자에게 명확한 보상을 약속하고 일관된 테마로 연속 시청을 유도하는 것입니다.`
      },
      {
        question: `나우크리에이터랩의 실전 적용 가이드라인은 어디서 확인할 수 있나요?`,
        answer: `나우크리에이터랩(nutube.kr)의 ${post.categoryLabel} 섹션에서 주제별 체크리스트와 심화 템플릿을 상시 무료로 확인할 수 있습니다.`
      }
    ];

    // Dynamically extract top 10 SEO keywords and update index.html meta tags in DOM
    const topKeywords = updateDynamicPostSeoMeta(post);
    const keywordsString = topKeywords ? topKeywords.join(', ') : (post.tags || []).join(', ');

    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
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
            "name": post.author || "안주영",
            "jobTitle": "1인 크리에이터 & 콘텐츠 디렉터"
          },
          "publisher": {
            "@type": "Organization",
            "name": "크리에이터랩",
            "url": "https://nutube.kr/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
            }
          },
          "image": post.thumbnail?.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          "articleSection": post.categoryLabel,
          "keywords": keywordsString,
          "speakable": {
            "@type": "SpeakableSpecification",
            "xpath": [
              "/html/head/title",
              "//header//h1",
              "//section[@id='guide-overview-section']"
            ]
          }
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
        },
        {
          "@type": "FAQPage",
          "@id": `${postUrl}#faq`,
          "mainEntity": faqEntities.map((f) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        }
      ]
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

  const blocks = parseContentToBlocks(post.content);
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
          i++;
        }
        if (cleanText.substring(i, i + 2) === '**') {
          i += 2;
        }

        const trimmedBold = boldContent.trim();
        if (trimmedBold) {
          parts.push(
            <strong key={`bold-${i}`} className="font-extrabold text-[#7C3AED] dark:text-purple-300 bg-purple-500/10 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-md">
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
        i++;
        let codeContent = '';
        while (i < cleanText.length && cleanText[i] !== '`') {
          codeContent += cleanText[i];
          i++;
        }
        if (cleanText[i] === '`') {
          i++;
        }

        const trimmedCode = codeContent.trim();
        if (trimmedCode) {
          parts.push(
            <code key={`code-${i}`} className="rounded bg-slate-100 dark:bg-purple-950/80 border border-slate-200/50 dark:border-purple-900/30 px-1.5 py-0.5 text-[0.85em] text-[#7C3AED] dark:text-purple-300 font-mono">
              {trimmedCode}
            </code>
          );
        }
      } else {
        currentText += cleanText[i];
        i++;
      }
    }

    if (currentText) {
      parts.push(<span key="txt-end">{currentText}</span>);
    }

    return parts;
  };

  // Generate dynamic GEO FAQ items
  const geoFaqs = [
    {
      q: `'${post.title}' 가이드를 실전에 즉시 적용하는 최선의 방법은 무엇인가요?`,
      a: `오늘 다룬 핵심 개념을 기획 시트에 한 줄 슬로건으로 고정하고, 업로드 전 체크리스트(인트로 10초, 자막 대비, 연관 동영상 카드 배치)를 하나씩 점검하며 발행하세요.`
    },
    {
      q: `${post.categoryLabel} 분야에서 알고리즘과 수혜를 동시에 잡기 위한 추천 패턴은?`,
      a: `단순 조회수에 연연하지 않고 시청자 세션 체류 시간을 길게 유지하는 연쇄 콘텐츠 링크(재생목록, 쇼츠-롱폼 연동, 고정댓글)를 탄탄히 구축하는 것이 검증된 정석입니다.`
    },
    {
      q: `구글/네이버 검색 및 AI 답변 엔진(AEO)에 더 빠르게 노출되려면?`,
      a: `게시글 내 계층화된 목차(H2, H3), 세맨틱 마크업, 그리고 질문-답변 구조의 FAQ 엔티티를 명확히 작성하여 검색 로봇과 AI 생성 엔진이 쉽게 파싱하도록 돕습니다.`
    }
  ];

  return (
    <div 
      className="relative pb-24" 
      id={`guide-reader-${post.slug}`}
      itemScope 
      itemType="https://schema.org/BlogPosting"
    >
      {/* Scroll indicator bar */}
      <div className="fixed left-0 top-16 z-50 h-1 bg-gradient-to-r from-purple-500 via-[#7C3AED] to-indigo-600 transition-all duration-100" style={{ width: `${scrollPercent}%` }} />
      
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* Detail Header Navigation */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <button 
            onClick={onBack} 
            className={`font-subheading group flex items-center gap-2 text-sm sm:text-base font-bold transition-colors cursor-pointer ${
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

        {/* Article Title, Author & Stats Header */}
        <header className="mb-8 break-keep">
          {/* Top category label */}
          <div className="mb-3.5">
            <span 
              className="font-tag inline-block rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-black tracking-wide uppercase"
              style={{ 
                color: dark ? '#c084fc' : '#7C3AED', 
                backgroundColor: dark ? 'rgba(124, 58, 237, 0.2)' : '#F3E8FF',
                border: `1px solid ${dark ? 'rgba(124, 58, 237, 0.4)' : '#E9D5FF'}`
              }}
              itemProp="articleSection"
            >
              {post.categoryLabel}
            </span>
          </div>
          
          {/* Title */}
          <h1 
            itemProp="headline"
            className={`font-heading text-3xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-tight tracking-tight mb-5 ${
              dark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          <p 
            itemProp="description"
            className={`font-subheading text-base sm:text-xl leading-relaxed mb-6 font-medium ${
              dark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {post.subtitle}
          </p>

          {/* Post Published Date and Time Row */}
          <div className={`flex items-center justify-between border-t pt-4 border-b pb-4 ${
            dark ? 'border-purple-950/40' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-2 font-tag text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-400">
              <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
              <span>발행일시:</span>
              <time itemProp="datePublished" dateTime={post.publishedAt} className="font-mono text-slate-600 dark:text-slate-300 font-bold">
                {formatPostDateTime(post.publishedAt, post.slug)}
              </time>
            </div>
            <span className="font-tag rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-[#7C3AED] dark:text-purple-300">
              실전 가이드
            </span>
          </div>
        </header>

        {/* Hero image banner */}
        <ImageFigure image={post.thumbnail} />

        {/* 핵심 요약 Card */}
        <section className={`mb-10 rounded-2xl border p-6 sm:p-8 transition-all ${
          dark ? 'border-purple-900/50 bg-gradient-to-br from-[#1b0d38] via-[#13082a] to-[#100624]' : 'border-purple-100 bg-gradient-to-br from-purple-50/60 via-indigo-50/30 to-white shadow-xs'
        }`} id="aeo-quick-answer-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/10 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C3AED] text-white text-base font-black shadow-xs shrink-0">
                ⚡
              </span>
              <h2 className={`font-heading text-lg sm:text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
                실전 핵심 요약
              </h2>
            </div>
            <span className="font-tag rounded-full bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 text-xs sm:text-sm font-bold text-[#7C3AED] dark:text-purple-300">
              핵심 포인트
            </span>
          </div>

          <div className="grid gap-4 text-base sm:text-lg leading-relaxed">
            <div className={`p-4 sm:p-5 rounded-xl border ${dark ? 'bg-purple-950/40 border-purple-900/40 text-slate-200' : 'bg-white/90 border-purple-100 text-slate-800'}`}>
              <span className="font-extrabold text-[#7C3AED] dark:text-purple-300 mr-2 block sm:inline mb-1 sm:mb-0">🎯 핵심 결론:</span>
              <span className="font-body">{renderFormattedText(post.summary || `${post.title}의 핵심은 구체적인 타겟 시청자 요구를 충족하고 체류 시간을 극대화하는 정교한 가치 제안에 있습니다.`)}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className={`p-4 rounded-xl border ${dark ? 'bg-purple-950/20 border-purple-900/20 text-slate-300' : 'bg-white/70 border-slate-100 text-slate-700'}`}>
                <span className="font-bold text-emerald-500 dark:text-emerald-400 mr-1.5 font-tag">📌 적용 카테고리:</span>
                <span className="font-semibold font-tag">{post.categoryLabel}</span>
              </div>
              <div className={`p-4 rounded-xl border ${dark ? 'bg-purple-950/20 border-purple-900/20 text-slate-300' : 'bg-white/70 border-slate-100 text-slate-700'}`}>
                <span className="font-bold text-amber-500 dark:text-amber-400 mr-1.5 font-tag">⏱️ 권장 소요시간:</span>
                <span className="font-semibold font-tag">실전 적용 15분 이내</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core dynamic summary and table of contents */}
        <section className="mb-10 grid gap-6 md:grid-cols-2" id="guide-overview-section">
          {/* Guide summary block */}
          <div className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between ${
            dark ? 'border-purple-950 bg-[#110724]' : 'border-slate-100 bg-white shadow-xs'
          }`}>
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <FileText className="h-6 w-6 text-[#7C3AED] shrink-0" />
                <h2 className={`font-heading text-lg sm:text-xl font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>📝 가이드 개요 및 목적</h2>
              </div>
              <p className={`font-body text-base sm:text-[17px] leading-relaxed font-normal ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                {renderFormattedText(post.summary || `${post.title}에 대한 핵심 요약 내용입니다. 아래 본문에서 구체적인 실행 계획을 상세하게 다룹니다.`)}
              </p>
            </div>
          </div>

          {/* Guide Table of Contents */}
          <div className={`rounded-2xl border p-6 sm:p-7 flex flex-col ${
            dark ? 'border-purple-950 bg-[#110724]' : 'border-slate-100 bg-white shadow-xs'
          }`}>
            <div className="flex items-center gap-2.5 mb-4">
              <List className="h-6 w-6 text-[#7C3AED] shrink-0" />
              <h2 className={`font-heading text-lg sm:text-xl font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>📋 가이드 목차</h2>
            </div>
            <ul className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
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
                            const headerOffset = 100;
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.scrollY - headerOffset;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`text-left text-sm sm:text-base transition-colors hover:underline hover:cursor-pointer flex items-center gap-2.5 ${
                          isH3
                            ? `${dark ? 'text-slate-400 hover:text-purple-400' : 'text-slate-500 hover:text-[#7C3AED]'} font-normal py-0.5`
                            : `${dark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-800 hover:text-[#7C3AED]'} font-bold py-1 mt-0.5`
                        }`}
                      >
                        <span className={`inline-block rounded-full bg-purple-400 shrink-0 ${isH3 ? 'h-1.5 w-1.5' : 'h-2 w-2'}`} />
                        <span className="truncate font-subheading">{block.lines[0]}</span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </section>

        {/* Article Body Content with Rich Hierarchy */}
        <article 
          itemProp="articleBody"
          className={`space-y-7 break-keep text-lg sm:text-xl leading-[1.9] sm:leading-[2.0] ${
            dark ? 'text-slate-100' : 'text-slate-900'
          }`} 
          id="guide-markdown-body"
        >
          {blocks.map((block, index) => {
            if (block.type === 'h2') {
              return (
                <h2 
                  key={index} 
                  id={`heading-${index}`} 
                  className={`font-heading border-b pb-3.5 pt-10 text-2xl sm:text-3xl font-black tracking-tight leading-snug ${
                    dark ? 'border-purple-950/60 text-white' : 'border-slate-200 text-slate-900'
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
                  className={`font-heading flex items-center gap-3 pt-8 text-xl sm:text-2xl font-extrabold ${
                    dark ? 'text-purple-300' : 'text-[#7C3AED]'
                  }`}
                >
                  <span className="inline-block h-5 w-2 rounded-full bg-[#7C3AED] dark:bg-purple-400 shrink-0" />
                  {renderFormattedText(block.lines[0])}
                </h3>
              );
            }
            if (block.type === 'divider') {
              return <hr key={index} className={dark ? 'my-10 border-purple-950/40' : 'my-10 border-slate-200'} />;
            }
            if (block.type === 'list') {
              return (
                <ul 
                  key={index} 
                  className={`space-y-3.5 rounded-2xl border p-6 sm:p-8 pl-8 sm:pl-10 font-body text-base sm:text-lg leading-[1.9] font-normal my-8 ${
                    dark 
                      ? 'border-purple-950/50 bg-[#120822]/60 text-slate-200' 
                      : 'border-purple-100/80 bg-purple-50/30 text-slate-700'
                  }`}
                >
                  {block.lines.map((line, i) => <li key={i} className="list-disc pl-1">{renderFormattedText(line)}</li>)}
                </ul>
              );
            }
            if (block.type === 'table') {
              const rawRows = block.lines.map(line =>
                line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
              );
              const header = rawRows[0] || [];
              const bodyRows = rawRows.slice(1).filter(row => !row.every(c => /^:?-+:?$/.test(c.replace(/\s+/g, ''))));

              return (
                <div key={index} className="my-10 overflow-x-auto rounded-2xl border border-purple-200/80 dark:border-purple-900/60 shadow-xs bg-white dark:bg-[#120822]/80 p-1 w-full max-w-full touch-pan-x">
                  <table className="w-full text-left text-sm sm:text-base border-collapse min-w-full">
                    {header.length > 0 && (
                      <thead className={dark ? 'bg-purple-950/90 text-purple-200 border-b border-purple-900' : 'bg-purple-50 text-slate-800 border-b border-purple-100'}>
                        <tr>
                          {header.map((col, cIdx) => (
                            <th key={cIdx} className="font-heading px-4 sm:px-5 py-3.5 font-extrabold whitespace-nowrap">
                              {renderFormattedText(col)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {bodyRows.map((row, rIdx) => (
                        <tr key={rIdx} className={`border-b last:border-0 ${dark ? 'border-purple-950/40 hover:bg-purple-950/30' : 'border-slate-100 hover:bg-slate-50/80'}`}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`font-body px-4 sm:px-5 py-3.5 font-medium ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
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
                <pre key={index} className="overflow-x-auto rounded-xl border border-purple-950 bg-slate-950 p-4 sm:p-6 text-sm sm:text-base font-code leading-relaxed text-purple-300 shadow-sm my-8 max-w-full touch-pan-x">
                  <code>{block.lines.join('\n')}</code>
                </pre>
              );
            }
            paragraphCount += 1;
            return (
              <React.Fragment key={index}>
                <p className="font-body font-normal text-lg sm:text-xl leading-[1.95] sm:leading-[2.0] tracking-[-0.015em] mb-7">
                  {renderFormattedText(block.lines.join('\n'))}
                </p>
                {paragraphCount === 2 ? <ImageFigure image={post.bodyImages?.[0]} /> : null}
                {paragraphCount === 5 ? <ImageFigure image={post.bodyImages?.[1]} /> : null}
              </React.Fragment>
            );
          })}
        </article>

        {/* GEO FAQ Section (Generative Engine Optimization) */}
        <section className="mt-14 pt-10 border-t border-slate-100 dark:border-purple-950/40" id="geo-faq-section">
          <div className="flex items-center gap-3 mb-7">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white text-base font-black shrink-0">
              ❓
            </span>
            <h2 className={`font-heading text-xl sm:text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
              자주 묻는 질문 & AI 답변 (GEO FAQ)
            </h2>
          </div>

          <div className="space-y-3.5">
            {geoFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    dark ? 'border-purple-950/60 bg-[#140b2a]/70' : 'border-slate-100 bg-white shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`font-subheading text-base sm:text-lg font-bold leading-snug ${dark ? 'text-purple-200' : 'text-slate-800'}`}>
                      Q{idx + 1}. {faq.q}
                    </span>
                    <span className={`font-tag shrink-0 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full ${
                      isOpen ? 'bg-purple-500 text-white' : dark ? 'bg-purple-950 text-purple-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isOpen ? '닫기' : '답변 보기'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className={`font-body px-4 sm:px-6 pb-6 pt-2 text-base sm:text-[17px] leading-relaxed border-t ${
                      dark ? 'border-purple-950/40 text-slate-300 bg-[#110724]/50' : 'border-slate-50 text-slate-600 bg-purple-50/20'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic SEO Keywords & Tag Badges */}
        <div className={`mt-12 space-y-4 border-t pt-8 ${
          dark ? 'border-purple-950/30' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <Tag className={`h-4 w-4 ${dark ? 'text-purple-400' : 'text-[#7C3AED]'}`} />
            <span className={`font-subheading text-xs sm:text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
              본문 실시간 추출 SEO 메타 키워드 (Top 10)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {extractTopSeoKeywords(post, 10).map((kw, kwIdx) => (
              <span 
                key={kw} 
                className={`font-tag inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold ${
                  dark 
                    ? 'bg-purple-950/40 text-purple-200 border border-purple-800/40 hover:border-purple-600/60' 
                    : 'border border-purple-100 bg-purple-50/70 text-[#7C3AED] hover:bg-purple-100/80'
                }`}
              >
                <span className="text-[10px] opacity-60 font-mono">#{kwIdx + 1}</span>
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Button */}
        <div className="mt-14 text-center">
          <button 
            onClick={onBack} 
            className={`font-subheading inline-flex rounded-full border px-8 py-3.5 text-sm sm:text-base font-extrabold transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs ${
              dark 
                ? 'border-purple-950 bg-[#140b2a] text-slate-300 hover:bg-[#1f113f] hover:text-white' 
                : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            ← 전체 가이드 목록으로 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
};
