import { addPostImages } from './postImages';
import { DAILY_CATEGORIES, ensureMinimumPostLength, makeDailyPost } from './dailyPostFactory';
import { GuidePost } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const FILL_START_UTC = Date.UTC(2026, 4, 1, 1, 0, 0);
const FILL_END_UTC = Date.UTC(2026, 6, 3, 1, 0, 0);

const hold = (...parts: string[]) => parts.join('-');
export const REVIEW_HOLD_SLUGS = new Set([
  hold('shorts', 'rpm', 'maximization', 'strategy'),
  hold('ai', 'visual', 'storytelling', 'production'),
  hold('community', 'fandom', 'reputation', 'management'),
  hold('google', 'search', 'console', 'seo', 'indexing'),
  hold('ads', 'review', 'recovery'),
  hold('youtube', 'zero', 'views', 'remedy', 'formula'),
  hold('vintage', 'europe', 'aesthetic', 'shorts', 'hook'),
  hold('low', 'value', 'content', 'solution'),
  hold('search', 'console', 'sitemap', 'fetch', 'success'),
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
    .map(ensureMinimumPostLength)
    .map((post) => addPostImages(post))
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
};
