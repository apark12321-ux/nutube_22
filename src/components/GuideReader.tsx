import React, { useEffect, useState } from 'react';
import { GuidePost, CategorySpec, PostImage } from '../types';
import { ArrowLeft, Share2, Calendar, User, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
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

const renderFormattedText = (text: string): React.ReactNode[] => {
  const parts = text.replace(/\`/g, '`').replace(/\*/g, '*').split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="font-extrabold text-cyan-500">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="rounded bg-slate-950/70 px-1.5 py-0.5 text-[0.85em] text-cyan-300">{part.slice(1, -1)}</code>;
    return <span key={index}>{part}</span>;
  });
};

const ImageFigure = ({ image }: { image?: PostImage }) => {
  const src = image?.src || DEFAULT_REMOTE_IMAGE;
  const alt = image?.alt || '유튜브 채널 운영 참고 이미지';

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm dark:border-sky-950 dark:bg-[#032841]/40">
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
      {image?.caption ? <figcaption className="px-4 py-3 text-[13px] leading-6 text-slate-500 dark:text-sky-100/65">{image.caption}</figcaption> : null}
    </figure>
  );
};

const checklist = [
  '본인 채널의 주제와 시청자층에 맞는지 먼저 확인합니다.',
  '업로드 전 제목, 썸네일, 도입부, 설명란을 함께 점검합니다.',
  '업로드 후 노출수, 클릭률, 평균 시청 지속 시간, 댓글 반응을 기록합니다.',
];

const mistakes = [
  '조회수 하나만 보고 영상의 성과를 판단하는 것',
  '검증되지 않은 팁을 모든 영상에 한꺼번에 적용하는 것',
  '시청자에게 필요한 정보보다 운영자의 기대 효과를 먼저 강조하는 것',
];

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

  return (
    <div className="relative pb-24" id={`guide-reader-${post.slug}`}>
      <div className="fixed left-0 top-16 z-50 h-1 bg-gradient-to-r from-sky-400 via-teal-400 to-cyan-500 transition-all duration-100" style={{ width: `${scrollPercent}%` }} />
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button onClick={onBack} className={`group flex items-center gap-2 text-sm font-bold transition-colors ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-sky-700'}`}>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>가이드 목록으로 가기</span>
          </button>
          <div className="relative">
            {shareToast && <div className={`absolute -bottom-10 right-0 z-20 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold shadow-md ${dark ? 'border border-cyan-500/20 bg-[#032e49] text-cyan-400' : 'border border-sky-200 bg-sky-50 text-sky-600'}`}>링크가 복사되었습니다</div>}
            <button onClick={handleShare} className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${dark ? 'border-sky-950 bg-[#032841]/50 text-slate-300 hover:bg-[#032e49] hover:text-white' : 'border-sky-100 bg-white text-slate-500 hover:bg-sky-50 hover:text-sky-600'}`} title="링크 복사">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <header className="mb-8 break-keep">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full px-3 py-1 text-xs font-extrabold" style={{ color: categorySpec.accentColor, backgroundColor: `${categorySpec.accentColor}15`, border: `1px solid ${categorySpec.accentColor}30` }}>{post.categoryLabel}</span>
            <span className={dark ? 'text-xs font-semibold text-sky-300/50' : 'text-xs font-semibold text-slate-400'}>{post.readTime || '6분 읽기'}</span>
          </div>
          <h1 className={`text-3xl font-black leading-tight tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-[#011d33]'}`}>{post.title}</h1>
          <p className={`mt-4 text-base font-semibold leading-8 sm:text-xl ${dark ? 'text-sky-200/85' : 'text-slate-600'}`}>{post.subtitle}</p>
          <div className={`mt-6 flex flex-wrap items-center gap-4 border-t pt-4 text-sm ${dark ? 'border-sky-950/50 text-slate-400' : 'border-sky-100 text-slate-500'}`}>
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author || 'NuTube 편집부'}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt)}</span>
          </div>
        </header>

        <ImageFigure image={post.thumbnail} />

        <section className={`mb-8 rounded-2xl border p-5 sm:p-6 ${dark ? 'border-sky-950 bg-[#032841]/50' : 'border-sky-100 bg-white shadow-sm'}`}>
          <div className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />
            <div>
              <h2 className={dark ? 'text-lg font-extrabold text-white' : 'text-lg font-extrabold text-slate-900'}>이 가이드의 활용 방법</h2>
              <p className={dark ? 'mt-2 text-sm leading-7 text-sky-100/80' : 'mt-2 text-sm leading-7 text-slate-700'}>아래 내용은 채널 운영자가 업로드 전후에 점검할 항목을 정리한 자료입니다. 실제 적용 전에는 본인 채널의 주제, 시청자층, YouTube 스튜디오 데이터를 함께 확인하세요.</p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className={`rounded-2xl border p-5 ${dark ? 'border-emerald-900/50 bg-emerald-950/20' : 'border-emerald-100 bg-emerald-50/60'}`}>
            <h2 className={`flex items-center gap-2 text-base font-extrabold ${dark ? 'text-emerald-200' : 'text-emerald-800'}`}><CheckCircle2 className="h-5 w-5" />먼저 확인할 것</h2>
            <ul className={`mt-3 space-y-2 text-sm leading-7 ${dark ? 'text-emerald-50/85' : 'text-emerald-950'}`}>{checklist.map((item) => <li key={item}>- {item}</li>)}</ul>
          </div>
          <div className={`rounded-2xl border p-5 ${dark ? 'border-amber-900/50 bg-amber-950/20' : 'border-amber-100 bg-amber-50/70'}`}>
            <h2 className={`flex items-center gap-2 text-base font-extrabold ${dark ? 'text-amber-200' : 'text-amber-800'}`}><AlertTriangle className="h-5 w-5" />피해야 할 실수</h2>
            <ul className={`mt-3 space-y-2 text-sm leading-7 ${dark ? 'text-amber-50/85' : 'text-amber-950'}`}>{mistakes.map((item) => <li key={item}>- {item}</li>)}</ul>
          </div>
        </section>

        <article className={`space-y-6 break-keep text-[16px] leading-8 sm:text-[17px] sm:leading-9 ${dark ? 'text-sky-100/90' : 'text-slate-800'}`} id="guide-markdown-body">
          {blocks.map((block, index) => {
            if (block.type === 'h2') return <h2 key={index} className={`border-b pb-2 pt-6 text-2xl font-black tracking-tight ${dark ? 'border-sky-950/50 text-white' : 'border-sky-100 text-[#011d33]'}`}>{renderFormattedText(block.lines[0])}</h2>;
            if (block.type === 'h3') return <h3 key={index} className={`flex items-center gap-2 pt-4 text-xl font-extrabold ${dark ? 'text-sky-100' : 'text-slate-900'}`}><span className="inline-block h-4 w-1 rounded-full bg-sky-500" />{renderFormattedText(block.lines[0])}</h3>;
            if (block.type === 'divider') return <hr key={index} className={dark ? 'my-8 border-sky-950/50' : 'my-8 border-sky-100'} />;
            if (block.type === 'list') return <ul key={index} className={`space-y-2.5 rounded-xl border p-5 pl-7 text-[15px] leading-8 ${dark ? 'border-sky-950/40 bg-[#032841]/30 text-sky-100/90' : 'border-sky-100 bg-sky-50/40 text-slate-700'}`}>{block.lines.map((line, i) => <li key={i} className="list-disc">{renderFormattedText(line)}</li>)}</ul>;
            if (block.type === 'code') return <pre key={index} className="overflow-x-auto rounded-xl border border-sky-950 bg-slate-950 p-4 text-sm leading-7 text-cyan-200"><code>{block.lines.join('\n')}</code></pre>;
            paragraphCount += 1;
            return <React.Fragment key={index}><p>{renderFormattedText(block.lines.join('\n'))}</p>{paragraphCount === 2 ? <ImageFigure image={post.bodyImages?.[0]} /> : null}{paragraphCount === 5 ? <ImageFigure image={post.bodyImages?.[1]} /> : null}</React.Fragment>;
          })}
        </article>

        <div className={`mt-8 flex flex-wrap gap-2 border-t pt-6 ${dark ? 'border-sky-950/50' : 'border-sky-100/70'}`}>{(post.tags || []).map((tag) => <span key={tag} className={`rounded-lg px-2.5 py-1 text-[12px] font-bold ${dark ? 'bg-[#032e49] text-sky-300' : 'border border-sky-100 bg-sky-50 text-sky-600'}`}>#{tag}</span>)}</div>
        <div className="mt-12 text-center"><button onClick={onBack} className={`inline-flex rounded-xl border px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${dark ? 'border-sky-950 bg-[#032841]/50 text-slate-300 hover:bg-[#032e49] hover:text-white' : 'border-sky-100 bg-white text-slate-700 shadow-sm hover:bg-sky-50 hover:text-sky-700'}`}>가이드 목록으로 돌아가기</button></div>
      </div>
    </div>
  );
};
