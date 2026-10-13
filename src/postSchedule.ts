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

// 대표 글 주소는 slug 기반(/post/<slug>)이다. sitemap.xml·RSS와 같은 주소를 써야
// 검색엔진이 받은 주소가 실제 글로 열린다. 예전 제목 기반 주소는 getLegacyPostPath로 남긴다.
export const getPostPath = (post: Pick<GuidePost, 'slug'>) => `/post/${encodeURIComponent(post.slug)}`;

export const getLegacyPostPath = (post: Pick<GuidePost, 'title'>) => `/post/${postTitleSegment(post.title)}`;

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
  // Using Korean Standard Time (KST, UTC+9) calendar day calculation so the latest post
  // always matches today's date in Korea
  const getKstDayNumber = (t: number) => Math.floor((t + 9 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000));
  let shiftMs = 0;
  if (maxPublishedTime > 0) {
    const diffDays = getKstDayNumber(now) - getKstDayNumber(maxPublishedTime);
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

