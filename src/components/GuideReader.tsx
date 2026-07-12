import React, { useEffect, useState } from 'react';
import { GuidePost, CategorySpec, PostImage } from '../types';
import { ArrowLeft, Share2, Calendar, User, Clock, Eye, Sparkles, FileText, List, Check, ArrowRight, Lock } from 'lucide-react';
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

// Custom Reader statistics data generator based on post category to match "요즘IT"
const getCategoryReaderStats = (category: string) => {
  switch (category) {
    case 'youtube':
      return {
        badges: ["1~3년차", "숏폼 전문", "조회수+협찬"],
        stats: [
          { rank: 1, label: "초보 & 숏폼 크리에이터", percentage: 54, color: "bg-[#06b6d4]" },
          { rank: 2, label: "직장인 부업러 (N잡러)", percentage: 28, color: "bg-[#f59e0b]" },
          { rank: 3, label: "기업 브랜드 홍보팀", percentage: 18, color: "bg-[#3b82f6]" },
        ]
      };
    case 'instagram':
      return {
        badges: ["6개월 미만", "릴스 바이럴", "팔로워 극대화"],
        stats: [
          { rank: 1, label: "릴스 중심 인플루언서 지망생", percentage: 48, color: "bg-[#ec4899]" },
          { rank: 2, label: "1인 브랜드 대표 (지식창업)", percentage: 35, color: "bg-[#10b981]" },
          { rank: 3, label: "SNS 마케팅 대행사 실무자", percentage: 17, color: "bg-[#8b5cf6]" },
        ]
      };
    case 'tiktok':
      return {
        badges: ["1년차 미만", "글로벌 타겟", "틱톡 CRP 정산"],
        stats: [
          { rank: 1, label: "글로벌 숏폼 큐레이터", percentage: 51, color: "bg-[#14b8a6]" },
          { rank: 2, label: "제휴 마케터 (수익화 자동화)", percentage: 30, color: "bg-[#f59e0b]" },
          { rank: 3, label: "MCN 에이전시 소속 크리에이터", percentage: 19, color: "bg-[#6366f1]" },
        ]
      };
    case 'blog':
      return {
        badges: ["1~2년차", "워드프레스/티스토리", "구글 검색노출"],
        stats: [
          { rank: 1, label: "구글 애드센스 승인 대기자", percentage: 58, color: "bg-[#10b981]" },
          { rank: 2, label: "서치콘솔 검색엔진 최적화 전문가", percentage: 26, color: "bg-[#ec4899]" },
          { rank: 3, label: "전업 블로그 웹마스터", percentage: 16, color: "bg-[#3b82f6]" },
        ]
      };
    case 'digital_biz':
    default:
      return {
        badges: ["시작 단계", "전자책/뉴스레터", "무인 패시브 인컴"],
        stats: [
          { rank: 1, label: "전자책 및 온라인 대본 기획자", percentage: 45, color: "bg-[#f59e0b]" },
          { rank: 2, label: "유료 뉴스레터 정기구독 설계자", percentage: 38, color: "bg-[#8b5cf6]" },
          { rank: 3, label: "1인 지식창업 시스템 빌더", percentage: 17, color: "bg-[#06b6d4]" },
        ]
      };
  }
};

export const GuideReader: React.FC<GuideReaderProps> = ({ post, categorySpec, onBack, theme = 'dark' }) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  
  // Interactive Login state for the "어떤 독자들이 봤을까요?" statistics card
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  const handleMockLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsLoggedIn(true);
    }, 1000);
  };

  const blocks = parseContentToBlocks(post.content);
  let paragraphCount = 0;

  // Retrieve reader stats tailored to current category
  const statsInfo = getCategoryReaderStats(post.category || 'youtube');

  // Compute mock metrics based on post popularity
  const calculatedViews = (post.likes || 15) * 31 + 420;
  const formattedViews = calculatedViews >= 1000 
    ? `${(calculatedViews / 1000).toFixed(1)}K` 
    : `${calculatedViews}`;

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
              <span className="text-slate-200 dark:text-purple-950">|</span>
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold text-[10px]">
                <Sparkles className="h-3 w-3 shrink-0" />
                <span>인기</span>
              </span>
              <span className="text-slate-200 dark:text-purple-950">|</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{formattedViews} 조회</span>
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

        {/* 🌟 REPLICATED COMPONENT: '어떤 독자들이 봤을까요?' Statistics Widget */}
        <section className={`mb-10 rounded-2xl border p-6 relative overflow-hidden ${
          dark ? 'border-purple-950/70 bg-[#120822]' : 'border-slate-100 bg-white shadow-xs'
        }`}>
          {/* Header row of card */}
          <div className="flex flex-col gap-2.5 mb-5 border-b pb-4 border-dashed border-slate-100 dark:border-purple-950/30">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold tracking-wider uppercase ${dark ? 'text-purple-400' : 'text-[#7C3AED]'}`}>
                독자 분석 리포트
              </span>
              {isLoggedIn && (
                <span className="inline-flex items-center gap-1 rounded bg-green-500/10 text-green-500 dark:text-green-400 px-2 py-0.5 text-[10px] font-black">
                  <Check className="h-3 w-3" />
                  <span>실시간 수집 완료</span>
                </span>
              )}
            </div>

            {/* Simulated interactive badges like screenshot */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold mt-1">
              <span className={`px-2.5 py-1 rounded-md border ${
                dark ? 'bg-purple-950/30 border-purple-900 text-purple-300' : 'bg-purple-50 border-purple-100 text-[#7C3AED]'
              }`}>
                연차 정보
              </span>
              <span className="text-slate-400 font-normal">,</span>
              <span className={`px-2.5 py-1 rounded-md border ${
                dark ? 'bg-purple-950/30 border-purple-900 text-purple-300' : 'bg-purple-50 border-purple-100 text-[#7C3AED]'
              }`}>
                운영 채널
              </span>
              <span className="text-slate-400 font-normal">,</span>
              <span className={`px-2.5 py-1 rounded-md border ${
                dark ? 'bg-purple-950/30 border-purple-900 text-purple-300' : 'bg-purple-50 border-purple-100 text-[#7C3AED]'
              }`}>
                수익 목적
              </span>
              <span className={`text-slate-800 dark:text-white font-extrabold text-[13.5px] ml-1`}>
                의 독자들이 봤을까요?
              </span>
            </div>
          </div>

          {/* Statistics Chart & Details */}
          <div className={`space-y-4 ${!isLoggedIn ? 'blur-xs select-none pointer-events-none' : ''}`}>
            {/* Secondary dynamic info labels based on specific post */}
            <div className="flex flex-wrap gap-2 mb-3">
              {statsInfo.badges.map((badge, i) => (
                <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  dark ? 'bg-slate-900 text-slate-400 border border-purple-950' : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}>
                  #{badge}
                </span>
              ))}
            </div>

            {/* List of dynamic stats bars */}
            <div className="space-y-3.5">
              {statsInfo.stats.map((stat) => (
                <div key={stat.rank} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="text-purple-500 dark:text-purple-400 font-black">{stat.rank}위</span>
                      <span>{stat.label}</span>
                    </span>
                    <span>{stat.percentage}%</span>
                  </div>
                  {/* Bar wrapper */}
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                    dark ? 'bg-purple-950/40' : 'bg-slate-50'
                  }`}>
                    {/* Animated color bar */}
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${stat.color}`} 
                      style={{ width: isLoggedIn ? `${stat.percentage}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right italic pt-2">
              * 누적 조회 유저 12,450여 명의 비식별 계정 가입 데이터를 기반으로 산출된 보고서입니다.
            </p>
          </div>

          {/* Secure Login Overlay if user is NOT logged in */}
          {!isLoggedIn && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs transition-all duration-300">
              <div className={`w-full max-w-[280px] p-5 rounded-2xl border text-center shadow-lg transform transition-all ${
                dark ? 'bg-[#180a30] border-purple-900/60' : 'bg-white border-slate-100'
              }`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-[#7C3AED] mx-auto mb-3">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <h3 className={`text-xs font-extrabold mb-1 ${dark ? 'text-white' : 'text-slate-950'}`}>
                  독자 비율 분석이 궁금하신가요?
                </h3>
                <p className="text-[10.5px] text-slate-400 mb-4 leading-normal">
                  요즘크리에이터랩에 로그인하시면 실제 가입 회원들의 디테일한 백분율을 확인해 보실 수 있습니다.
                </p>
                <button
                  onClick={handleMockLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-purple-400 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-purple-500/10 flex items-center justify-center gap-1"
                >
                  {isLoggingIn ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>분석 데이터 호출 중...</span>
                    </>
                  ) : (
                    <span>1초 안심 로그인하고 보기</span>
                  )}
                </button>
              </div>
            </div>
          )}
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
