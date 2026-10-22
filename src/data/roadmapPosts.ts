import { GuidePost } from '../types';
import { CREATOR_GUIDE_POSTS } from './categories/creator_guide';
import AUTO_POSTS_JSON from './auto/posts.json';

// 콘텐츠 허브에서 자동 발행된 글 (src/data/auto/posts.json)
const AUTO_POSTS = AUTO_POSTS_JSON as GuidePost[];

export const ROADMAP_POSTS: GuidePost[] = [
  ...CREATOR_GUIDE_POSTS,
  ...AUTO_POSTS
].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
