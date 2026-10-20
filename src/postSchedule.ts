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

// 대표 글 주소는 slug 기반(/post/<slug>)이다.
export const getPostPath = (post: Pick<GuidePost, 'slug'>) => `/post/${encodeURIComponent(post.slug)}`;

export const getLegacyPostPath = (post: Pick<GuidePost, 'title'>) => `/post/${postTitleSegment(post.title)}`;

/**
 * 구글 애드센스 심사 최적화: 자동 예약 발행(Scheduled Publishing) 검증 로직
 * 현재 서버/클라이언트 시각 >= post.publishedAt 조건만 만족하는 글만 노출
 */
export const isPostPublished = (post: GuidePost, now: Date = new Date()): boolean => {
  if (!post || !post.publishedAt) return true;
  const pubTime = new Date(post.publishedAt).getTime();
  if (isNaN(pubTime)) return true;
  return pubTime <= now.getTime();
};

/**
 * 발행 완료된 글만 필터링하고 최신 발행순으로 정렬 (사이트맵, 목록, RSS 전용)
 */
export const getPublishedPosts = (posts: GuidePost[], now: Date = new Date()): GuidePost[] => {
  if (!posts || posts.length === 0) return [];
  return posts
    .filter((p) => isPostPublished(p, now))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

// 기존 함수 호환성 유지 (예약 발행 필터링 및 최신순 정렬)
export const applyPostDateSchedule = (posts: GuidePost[]): GuidePost[] => {
  if (!posts || posts.length === 0) return [];
  return getPublishedPosts(posts);
};

