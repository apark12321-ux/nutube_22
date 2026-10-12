import { GuidePost } from '../types';
import { WHY_YOUTUBE_POSTS } from './categories/why_youtube';
import { TRENDS_POSTS } from './categories/trends';
import { AI_CREATOR_POSTS } from './categories/ai_creator';
import { MONETIZATION_POSTS } from './categories/monetization';
import AUTO_POSTS_JSON from './auto/posts.json';

// 콘텐츠 허브에서 자동 발행된 글 (src/data/auto/posts.json)
const AUTO_POSTS = AUTO_POSTS_JSON as GuidePost[];

export const ROADMAP_POSTS: GuidePost[] = [
  ...WHY_YOUTUBE_POSTS,
  ...TRENDS_POSTS,
  ...AI_CREATOR_POSTS,
  ...MONETIZATION_POSTS,
  ...AUTO_POSTS
].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
