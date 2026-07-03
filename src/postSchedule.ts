import { addPostImages } from './postImages';
import { CategoryKey, GuidePost } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const FILL_START_UTC = Date.UTC(2026, 4, 1, 1, 0, 0);
const FILL_END_UTC = Date.UTC(2026, 6, 3, 1, 0, 0);

const DAILY_CATEGORIES: Array<{ key: CategoryKey; label: string; author: string; tag: string }> = [
  { key: 'beginner', label: '왕초보 출발', author: '크리에이터 가이드랩 편집부', tag: '채널입문' },
  { key: 'algorithm', label: '유튜브 알고리즘', author: '크리에이터 가이드랩 분석팀', tag: '운영분석' },
  { key: 'aitools', label: 'AI 도구', author: '크리에이터 가이드랩 제작팀', tag: 'AI제작' },
  { key: 'monetization', label: '영상 채널 수익화', author: '크리에이터 가이드랩 운영팀', tag: '수익화준비' },
  { key: 'senior', label: '시니어 사연 쇼츠', author: '크리에이터 가이드랩 스토리팀', tag: '시니어콘텐츠' },
  { key: 'advanced', label: '중고수 전략', author: '크리에이터 가이드랩 전략팀', tag: '채널전략' },
];

const DAILY_TITLE_PREFIX: Record<CategoryKey, string> = {
  beginner: '초보 크리에이터를 위한 오늘의 채널 점검',
  algorithm: '영상 추천 흐름을 이해하는 오늘의 운영 점검',
  aitools: 'AI 제작 도구를 활용하는 오늘의 작업 점검',
  monetization: '영상 채널 수익화를 준비하는 오늘의 운영 점검',
  senior: '시니어 시청자에게 전달력을 높이는 오늘의 콘텐츠 점검',
  advanced: '성장 정체를 줄이는 오늘의 고급 운영 점검',
};

export const REVIEW_HOLD_SLUGS = new Set([
  'shorts-rpm-maximization-strategy',
  'ai-visual-storytelling-production',
  'community-fandom-reputation-management',
  'google-search-console-seo-indexing',
  'adsense-rejection-recovery',
  'youtube-zero-views-remedy-formula',
  'vintage-europe-aesthetic-shorts-hook',
  'adsense-low-value-content-solution',
  'search-console-sitemap-fetch-success',
]);

export const isPublishedPost = (post: GuidePost) => !REVIEW_HOLD_SLUGS.has(post.slug);

export const postTitleSegment = (title: string) =>
  title
    .trim()
    .replace(/%/g, '퍼센트')
    .replace(/[\/#?]+/g, ' ')
    .replace(/[\[\]@!$&'()*+,;=]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const getPostPath = (post: Pick<GuidePost, 'title'>) => `/post/${postTitleSegment(post.title)}`;

const dateKey = (value: string | Date) => new Date(value).toISOString().slice(0, 10);

const formatKoreanDate = (date: Date) => {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${month}월 ${day}일`;
};

const makeDailyPost = (category: typeof DAILY_CATEGORIES[number], date: Date): GuidePost => {
  const key = date.toISOString().slice(0, 10);
  const title = `${DAILY_TITLE_PREFIX[category.key]}: ${formatKoreanDate(date)} 체크리스트`;
  const publishedAt = new Date(date);
  const categoryIndex = DAILY_CATEGORIES.findIndex((item) => item.key === category.key);
  publishedAt.setUTCHours(1 + categoryIndex, 0, 0, 0);
  const updatedAt = new Date(publishedAt.getTime() + 45 * 60 * 1000);

  return {
    slug: `daily-${category.key}-${key}`,
    title,
    subtitle: `${category.label} 카테고리에서 오늘 확인해야 할 핵심 운영 기준을 정리했습니다.`,
    category: category.key,
    categoryLabel: category.label,
    publishedAt: publishedAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    author: category.author,
    summary: `${category.label} 운영자가 오늘 바로 점검할 수 있는 주제 선정, 제목 구성, 시청자 반응 확인, 다음 글감 정리 기준입니다.`,
    tags: [category.tag, '영상채널운영', '콘텐츠기획', '운영체크리스트', '크리에이터가이드'],
    readTime: '5분',
    likes: 0,
    authorityLabel: 'Creator Guide Lab Editorial',
    content: `## ${title}

오늘의 글은 ${category.label} 카테고리에서 하루 운영 흐름을 점검하기 위한 실전 체크리스트입니다. 영상 채널은 한 번에 큰 변화를 만들기보다, 매일 같은 기준으로 점검하고 작은 개선을 누적할 때 안정적으로 성장합니다.

### 1. 오늘의 핵심 점검 기준

- 오늘 다룰 주제가 기존 콘텐츠 흐름과 연결되는지 확인합니다.
- 제목은 시청자가 얻을 수 있는 결과를 먼저 보여주는 방식으로 정리합니다.
- 썸네일은 복잡한 문장보다 핵심 단어와 상황이 바로 보이도록 구성합니다.
- 도입부는 첫 10초 안에 왜 봐야 하는지 설명하도록 점검합니다.

### 2. 업로드 전 확인할 항목

업로드 전에는 영상의 완성도만 보지 말고 시청자가 실제로 이해하기 쉬운지 확인해야 합니다. 설명이 길어지면 핵심 문장을 앞부분으로 옮기고, 반복되는 표현은 과감히 줄이는 편이 좋습니다.

### 3. 업로드 후 기록할 항목

업로드 후에는 조회수 하나만 보지 말고 노출수, 클릭률, 평균 시청 지속 시간, 댓글 반응을 함께 기록합니다. 특히 같은 카테고리의 전날 글과 비교하면 다음 콘텐츠의 개선 방향을 더 쉽게 잡을 수 있습니다.

### 4. 다음 콘텐츠로 연결하는 방법

오늘 글에서 반응이 좋았던 표현, 질문, 사례를 다음 글감으로 남겨두면 카테고리 전체의 흐름이 자연스럽게 이어집니다. 이렇게 기록된 작은 메모가 장기 운영의 가장 안정적인 자료가 됩니다.

### 요약

${formatKoreanDate(date)} ${category.label} 운영의 핵심은 무리한 변화가 아니라 반복 가능한 점검 기준을 유지하는 것입니다. 오늘의 주제, 제목, 썸네일, 도입부, 반응 기록을 함께 확인하면 다음 콘텐츠의 방향을 더 명확하게 잡을 수 있습니다.`,
  };
};

const fillMissingDailyCategoryPosts = (posts: GuidePost[]) => {
  const existing = new Set(posts.map((post) => `${post.category}:${dateKey(post.publishedAt)}`));
  const filled = [...posts];

  for (let time = FILL_START_UTC; time <= FILL_END_UTC; time += DAY_MS) {
    const date = new Date(time);
    const key = date.toISOString().slice(0, 10);

    DAILY_CATEGORIES.forEach((category) => {
      const pair = `${category.key}:${key}`;
      if (!existing.has(pair)) {
        filled.push(makeDailyPost(category, date));
        existing.add(pair);
      }
    });
  }

  return filled;
};

export const applyPostDateSchedule = (posts: GuidePost[]): GuidePost[] => {
  const visiblePosts = fillMissingDailyCategoryPosts([...posts].filter(isPublishedPost));

  return visiblePosts
    .map((post) => addPostImages(post))
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
};
