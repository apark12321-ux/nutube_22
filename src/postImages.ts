import { CategoryKey, GuidePost, PostImage } from './types';

const categoryMeta: Record<CategoryKey, { label: string; tone: string; colorA: string; colorB: string }> = {
  beginner: { label: 'Channel Starter', tone: '채널 시작 체크리스트', colorA: '#0ea5e9', colorB: '#22c55e' },
  algorithm: { label: 'Studio Analytics', tone: '시청 지표 분석', colorA: '#2563eb', colorB: '#06b6d4' },
  aitools: { label: 'AI Workflow', tone: 'AI 제작 흐름', colorA: '#7c3aed', colorB: '#22d3ee' },
  monetization: { label: 'Creator Checklist', tone: '운영 조건 점검', colorA: '#0891b2', colorB: '#14b8a6' },
  senior: { label: 'Audience Care', tone: '쉬운 설명과 소통', colorA: '#ea580c', colorB: '#eab308' },
  advanced: { label: 'Growth Lab', tone: '데이터 기반 개선', colorA: '#0f766e', colorB: '#3b82f6' },
};

const svg = (category: CategoryKey, variant: number, title: string) => {
  const meta = categoryMeta[category] || categoryMeta.beginner;
  const safeTitle = title.slice(0, 30).replace(/[<>&]/g, '');
  const chart = variant % 3;
  const visual = chart === 0
    ? `<rect x="120" y="250" width="130" height="150" rx="16" fill="white" opacity=".18"/><rect x="280" y="190" width="130" height="210" rx="16" fill="white" opacity=".24"/><rect x="440" y="130" width="130" height="270" rx="16" fill="white" opacity=".3"/>`
    : chart === 1
      ? `<circle cx="260" cy="285" r="90" fill="white" opacity=".18"/><circle cx="430" cy="285" r="120" fill="white" opacity=".26"/><path d="M260 285 L430 285 L430 165" stroke="white" stroke-width="14" opacity=".4" fill="none" stroke-linecap="round"/>`
      : `<rect x="150" y="145" width="520" height="280" rx="28" fill="white" opacity=".16"/><rect x="190" y="190" width="220" height="26" rx="13" fill="white" opacity=".45"/><rect x="190" y="245" width="390" height="22" rx="11" fill="white" opacity=".28"/><rect x="190" y="295" width="330" height="22" rx="11" fill="white" opacity=".24"/>`;

  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${meta.colorA}"/><stop offset="1" stop-color="${meta.colorB}"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#00111f" flood-opacity=".25"/></filter></defs><rect width="1200" height="675" fill="url(#g)"/><circle cx="1020" cy="80" r="210" fill="white" opacity=".12"/><circle cx="80" cy="620" r="260" fill="white" opacity=".09"/><g filter="url(#s)">${visual}</g><rect x="70" y="70" width="1060" height="535" rx="42" fill="none" stroke="white" stroke-opacity=".22" stroke-width="2"/><text x="88" y="130" fill="white" opacity=".8" font-family="Arial, sans-serif" font-size="32" font-weight="700">NuTube Guide</text><text x="88" y="500" fill="white" font-family="Arial, sans-serif" font-size="58" font-weight="900">${meta.label}</text><text x="88" y="555" fill="white" opacity=".88" font-family="Arial, sans-serif" font-size="34" font-weight="700">${meta.tone}</text><text x="88" y="592" fill="white" opacity=".62" font-family="Arial, sans-serif" font-size="22" font-weight="500">${safeTitle}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}`;
};

const seed = (value: string) => {
  let n = 0;
  for (let i = 0; i < value.length; i += 1) n = (n * 31 + value.charCodeAt(i)) >>> 0;
  return n;
};

const makeImage = (post: GuidePost, variant: number, caption: string): PostImage => ({
  src: svg(post.category, variant, post.title),
  alt: `${post.categoryLabel} 주제의 유튜브 채널 운영 참고 이미지`,
  caption,
});

export const addPostImages = (post: GuidePost): GuidePost => {
  const n = seed(post.slug || post.title);
  const thumbnail = makeImage(post, n % 3, '글의 핵심 주제를 한눈에 확인할 수 있는 대표 이미지입니다.');
  const first = makeImage(post, (n + 1) % 3, '업로드 전에는 주제, 시청자, 영상 흐름을 함께 점검하는 것이 좋습니다.');
  const second = makeImage(post, (n + 2) % 3, '적용 후에는 조회수만 보지 말고 클릭률, 시청 지속 시간, 댓글 반응을 함께 기록합니다.');

  return {
    ...post,
    thumbnail: post.thumbnail || thumbnail,
    bodyImages: post.bodyImages || [first, second],
  };
};

export const addImagesToPosts = (posts: GuidePost[]) => posts.map(addPostImages);
