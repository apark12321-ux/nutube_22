import { addPostImages } from './postImages';
import { GuidePost } from './types';

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
  if (!posts || posts.length === 0) return [];

  // Find the latest published date among all posts
  let maxPublishedTime = 0;
  for (const post of posts) {
    const t = new Date(post.publishedAt).getTime();
    if (!isNaN(t) && t > maxPublishedTime) {
      maxPublishedTime = t;
    }
  }

  const now = Date.now();
  // If the calendar date has advanced beyond the latest post,
  // automatically roll recent post dates forward so the latest post always reflects today
  let shiftMs = 0;
  if (maxPublishedTime > 0 && now > maxPublishedTime) {
    const diffDays = Math.floor((now - maxPublishedTime) / (24 * 60 * 60 * 1000));
    if (diffDays > 0) {
      shiftMs = diffDays * 24 * 60 * 60 * 1000;
    }
  }

  return posts
    .map((post) => {
      const withImages = addPostImages(post);
      if (shiftMs === 0) return withImages;

      const origTime = new Date(post.publishedAt).getTime();
      if (isNaN(origTime)) return withImages;

      const newPublishedAt = new Date(origTime + shiftMs).toISOString();
      const newUpdatedAt = post.updatedAt
        ? new Date(new Date(post.updatedAt).getTime() + shiftMs).toISOString()
        : newPublishedAt;

      return {
        ...withImages,
        publishedAt: newPublishedAt,
        updatedAt: newUpdatedAt
      };
    })
    .sort((a, b) => {
      // Step number first, then publication date
      if (a.stepNumber && b.stepNumber && a.stepNumber !== b.stepNumber) {
        return a.stepNumber - b.stepNumber;
      }
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    });
};

