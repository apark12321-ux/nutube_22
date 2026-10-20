import { CategorySpec, GuidePost } from './types';
import { ROADMAP_POSTS } from './data/roadmapPosts';

// High-Value Authentic Creator Guides (Continuous 1-day 2-posts from June 1st to August 31st)
export const ALL_POSTS: GuidePost[] = ROADMAP_POSTS;

export const PRIMARY_CATEGORY_KEY = 'creator-guide';

export const CATEGORY_SPECS: Record<string, CategorySpec> = {
  'creator-guide': {
    key: 'creator-guide',
    label: '스마트폰 1인 크리에이터 실전 가이드',
    shortLabel: '스마트폰 크리에이터',
    icon: 'Sparkles',
    gradient: 'from-blue-600 to-indigo-600',
    description: '고가 장비 없이 스마트폰 한 대로 0에서 시작해 애드센스와 유튜브 복합 파이프라인을 완성하는 고밀도 실전 매뉴얼',
    count: ALL_POSTS.length,
    persona: '"스마트폰 1대로 구축하는 1인 크리에이터 실전 파이프라인"',
    accentColor: '#2563eb'
  },
  why_youtube: {
    key: 'why_youtube',
    label: '스마트폰 1인 크리에이터 실전 가이드',
    shortLabel: '스마트폰 크리에이터',
    icon: 'Sparkles',
    gradient: 'from-blue-600 to-indigo-600',
    description: '고가 장비 없이 스마트폰 한 대로 0에서 시작해 애드센스와 유튜브 복합 파이프라인을 완성하는 고밀도 실전 매뉴얼',
    count: ALL_POSTS.length,
    persona: '"스마트폰 1대로 구축하는 1인 크리에이터 실전 파이프라인"',
    accentColor: '#2563eb'
  },
  trends: {
    key: 'trends',
    label: '스마트폰 1인 크리에이터 실전 가이드',
    shortLabel: '스마트폰 크리에이터',
    icon: 'Sparkles',
    gradient: 'from-blue-600 to-indigo-600',
    description: '고가 장비 없이 스마트폰 한 대로 0에서 시작해 애드센스와 유튜브 복합 파이프라인을 완성하는 고밀도 실전 매뉴얼',
    count: ALL_POSTS.length,
    persona: '"스마트폰 1대로 구축하는 1인 크리에이터 실전 파이프라인"',
    accentColor: '#2563eb'
  },
  ai_creator: {
    key: 'ai_creator',
    label: '스마트폰 1인 크리에이터 실전 가이드',
    shortLabel: '스마트폰 크리에이터',
    icon: 'Sparkles',
    gradient: 'from-blue-600 to-indigo-600',
    description: '고가 장비 없이 스마트폰 한 대로 0에서 시작해 애드센스와 유튜브 복합 파이프라인을 완성하는 고밀도 실전 매뉴얼',
    count: ALL_POSTS.length,
    persona: '"스마트폰 1대로 구축하는 1인 크리에이터 실전 파이프라인"',
    accentColor: '#2563eb'
  },
  monetization: {
    key: 'monetization',
    label: '스마트폰 1인 크리에이터 실전 가이드',
    shortLabel: '스마트폰 크리에이터',
    icon: 'Sparkles',
    gradient: 'from-blue-600 to-indigo-600',
    description: '고가 장비 없이 스마트폰 한 대로 0에서 시작해 애드센스와 유튜브 복합 파이프라인을 완성하는 고밀도 실전 매뉴얼',
    count: ALL_POSTS.length,
    persona: '"스마트폰 1대로 구축하는 1인 크리에이터 실전 파이프라인"',
    accentColor: '#2563eb'
  }
};

export const CATEGORIES_LIST: CategorySpec[] = [
  CATEGORY_SPECS['creator-guide']
];

