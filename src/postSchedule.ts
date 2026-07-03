import { addPostImages } from './postImages';
import { GuidePost } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const SCHEDULE_END_UTC = Date.UTC(2026, 6, 3, 1, 0, 0);

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

export const applyPostDateSchedule = (posts: GuidePost[]): GuidePost[] => {
  const chronological = [...posts]
    .filter(isPublishedPost)
    .sort((a, b) => {
      const dateDiff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      return dateDiff || a.slug.localeCompare(b.slug);
    });

  return chronological.map((post, index) => {
    const dayOffset = chronological.length - 1 - index;
    const publishDate = new Date(SCHEDULE_END_UTC - dayOffset * DAY_MS);
    publishDate.setUTCHours(1 + (index % 8), (index % 4) * 10, 0, 0);

    const updatedDate = new Date(publishDate.getTime() + 45 * 60 * 1000);

    return addPostImages({
      ...post,
      publishedAt: publishDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
    });
  });
};
