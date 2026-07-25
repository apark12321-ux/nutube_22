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
            "name": post.author || "Now Creator Lab Editorial",
            "jobTitle": "콘텐츠 전략 컨설턴트",
            "worksFor": {
              "@type": "Organization",
              "name": "Now Creator Lab"
            }
          },
          "publisher": {
            "@type": "Organization",
            "name": "나우크리에이터랩",
            "url": "https://nutube.kr/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
            }
          },
          "image": post.thumbnail?.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          "articleSection": post.categoryLabel,
          "keywords": (post.tags || []).join(", "),
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

    let cleanText = text.replace(/\*\*\s*\*\*/g, ' ');
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
            <strong key={`bold-${i}`} className="font-extrabold text-[#7C3AED] dark:text-purple-400">
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

        {/* Article Title, Author & Stats Header */}
        <header className="mb-8 break-keep">
          {/* Top category label */}
          <p className="text-xs font-bold text-[#7C3AED] dark:text-purple-400 mb-2.5" itemProp="articleSection">
            {post.categoryLabel}
          </p>
          
          {/* Title */}
          <h1 
            itemProp="headline"
            className={`text-[25px] sm:text-[32px] font-black leading-tight tracking-tight mb-4 ${
              dark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          <p 
            itemProp="description"
            className={`text-sm sm:text-[15px] leading-relaxed mb-6 font-medium ${
              dark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {post.subtitle}
          </p>

          {/* Author Details Profile Row */}
          <div className={`flex flex-col gap-3.5 border-t pt-4 border-b pb-4 ${
            dark ? 'border-purple-950/30' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200/40 dark:border-purple-900/40 text-lg">
                🧑‍💻
              </span>
              <div className="flex flex-col">
                <span className={`text-[13px] font-extrabold ${dark ? 'text-white' : 'text-slate-800'}`} itemProp="name">
                  {post.author || '크리에이터랩'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">나우크리에이터랩 수석 컨설턴트</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] font-medium text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>{post.readTime || '6분'} 읽기</span>
              </span>
              <span className="text-slate-200 dark:text-purple-950">|</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <time itemProp="datePublished" dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </span>
            </div>
          </div>
        </header>

        {/* Hero image banner */}
        <ImageFigure image={post.thumbnail} />

        {/* AEO / GEO Direct Quick Answer Card */}
        <section className={`mb-8 rounded-2xl border p-5 sm:p-6 transition-all ${
          dark ? 'border-purple-900/50 bg-gradient-to-br from-[#1b0d38] via-[#13082a] to-[#100624]' : 'border-purple-100 bg-gradient-to-br from-purple-50/60 via-indigo-50/30 to-white shadow-xs'
        }`} id="aeo-quick-answer-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/10">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7C3AED] text-white text-xs font-black shadow-xs">
                ⚡
              </span>
              <h2 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
                AI & 검색엔진 다이렉트 요약 (AEO & GEO Quick Answer)
              </h2>
            </div>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-[#7C3AED] dark:text-purple-300">
              AI 답변 인덱스 우대
            </span>
          </div>

          <div className="grid gap-3.5 text-[13px] leading-relaxed">
            <div className={`p-3 rounded-xl border ${dark ? 'bg-purple-950/30 border-purple-900/30 text-slate-200' : 'bg-white/80 border-purple-100 text-slate-800'}`}>
              <span className="font-extrabold text-[#7C3AED] dark:text-purple-300 mr-2">🎯 핵심 결론:</span>
              <span>{post.summary || `${post.title}의 핵심은 구체적인 타겟 시청자 요구를 충족하고 체류 시간을 극대화하는 정교한 가치 제안에 있습니다.`}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border ${dark ? 'bg-purple-950/20 border-purple-900/20 text-slate-300' : 'bg-white/60 border-slate-100 text-slate-700'}`}>
                <span className="font-bold text-emerald-500 dark:text-emerald-400 mr-1.5">📌 적용 카테고리:</span>
                <span>{post.categoryLabel}</span>
              </div>
              <div className={`p-3 rounded-xl border ${dark ? 'bg-purple-950/20 border-purple-900/20 text-slate-300' : 'bg-white/60 border-slate-100 text-slate-700'}`}>
                <span className="font-bold text-amber-500 dark:text-amber-400 mr-1.5">⏱️ 권장 소요시간:</span>
                <span>실전 적용 15분 이내</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core dynamic summary and table of contents */}
        <section className="mb-8 grid gap-6 md:grid-cols-2" id="guide-overview-section">
          {/* Guide summary block */}
          <div className={`rounded-2xl border p-5 sm:p-6 flex flex-col ${
            dark ? 'border-purple-950 bg-[#110724]' : 'border-slate-100 bg-white shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#7C3AED]" />
              <h2 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>📝 가이드 개요 및 목적</h2>
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
                            const headerOffset = 140;
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
        <article 
          itemProp="articleBody"
          className={`space-y-6 break-keep text-[15px] leading-relaxed sm:text-[16px] sm:leading-8 ${
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

        {/* GEO FAQ Section (Generative Engine Optimization) */}
        <section className="mt-12 pt-8 border-t border-slate-100 dark:border-purple-950/40" id="geo-faq-section">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-black">
              ❓
            </span>
            <h2 className={`text-lg font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              자주 묻는 질문 & AI 답변 (GEO FAQ)
            </h2>
          </div>

          <div className="space-y-3">
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
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`text-xs sm:text-sm font-bold leading-snug ${dark ? 'text-purple-200' : 'text-slate-800'}`}>
                      Q{idx + 1}. {faq.q}
                    </span>
                    <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isOpen ? 'bg-purple-500 text-white' : dark ? 'bg-purple-950 text-purple-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isOpen ? '닫기' : '답변 보기'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className={`px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-[13px] leading-relaxed border-t ${
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
