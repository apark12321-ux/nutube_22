import { CategoryKey, GuidePost } from '../types';
import START_POSTS from './stages/start.json';
import GROW_POSTS from './stages/grow.json';
import MONEY_POSTS from './stages/money.json';
import PRO_POSTS from './stages/pro.json';
import AUTO_POSTS_JSON from './auto/posts.json';

export const STAGE_ORDER: CategoryKey[] = ['start', 'grow', 'money', 'pro'];

const STAGE_LABELS: Record<CategoryKey, string> = {
  start: '왕초보 첫걸음',
  grow: '채널 키우기',
  money: '수익 내기',
  pro: '고수의 영역'
};

// 예전 카테고리 키로 들어온 글(자동 발행 등)을 새 4단계에 맞춘다.
const LEGACY_CATEGORY: Record<string, CategoryKey> = {
  why_youtube: 'start',
  trends: 'grow',
  ai_creator: 'pro',
  monetization: 'money'
};

const normalize = (post: GuidePost): GuidePost => {
  const raw = String(post.category);
  const category: CategoryKey = (STAGE_ORDER as string[]).includes(raw) ? (raw as CategoryKey) : LEGACY_CATEGORY[raw] || 'grow';
  return {
    ...post,
    category,
    categoryLabel: STAGE_LABELS[category],
    stepNumber: STAGE_ORDER.indexOf(category) + 1,
    author: '박프로'
  };
};

// 자동 발행 글 (src/data/auto/posts.json). 작성 규칙은 AGENTS.md 참고.
const AUTO_POSTS = (AUTO_POSTS_JSON as unknown as GuidePost[]).map(normalize);

// 1단계 → 4단계, 단계 안에서는 order 순서. 이것이 사이트 전체의 기본 읽기 순서다.
export const ROADMAP_POSTS: GuidePost[] = [
  ...(START_POSTS as GuidePost[]),
  ...(GROW_POSTS as GuidePost[]),
  ...(MONEY_POSTS as GuidePost[]),
  ...(PRO_POSTS as GuidePost[]),
  ...AUTO_POSTS
]
  .map(normalize)
  .sort((a, b) => {
    const sa = STAGE_ORDER.indexOf(a.category);
    const sb = STAGE_ORDER.indexOf(b.category);
    if (sa !== sb) return sa - sb;
    const oa = a.order ?? 999;
    const ob = b.order ?? 999;
    if (oa !== ob) return oa - ob;
    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  });
