import { GuidePost } from '../types';
import { WHY_YOUTUBE_POSTS } from './categories/why_youtube';
import { TRENDS_POSTS } from './categories/trends';
import { AI_CREATOR_POSTS } from './categories/ai_creator';
import { MONETIZATION_POSTS } from './categories/monetization';

export const ROADMAP_POSTS: GuidePost[] = [
  ...WHY_YOUTUBE_POSTS,
  ...TRENDS_POSTS,
  ...AI_CREATOR_POSTS,
  ...MONETIZATION_POSTS
].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
