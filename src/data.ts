import { CategorySpec, GuidePost } from './types';
import { ROADMAP_POSTS } from './data/roadmapPosts';

// High-Value Authentic Creator Guides (20 In-depth Engaging Guides)
export const ALL_POSTS: GuidePost[] = ROADMAP_POSTS;

export const CATEGORY_SPECS: Record<string, CategorySpec> = {
  why_youtube: {
    key: 'why_youtube',
    stepNumber: 1,
    label: '왜 유튜브인가 & 가벼운 시작',
    shortLabel: '시작의 이유',
    levelBadge: '1편',
    icon: 'Sparkles',
    gradient: 'from-amber-500 to-orange-500',
    description: '얼굴 없이 스마트폰 하나로 시작하는 법, 틈새 주제 찾기 등 누구나 부담 없이 첫발을 떼는 이야기',
    count: ALL_POSTS.filter((p) => p.category === 'why_youtube').length,
    persona: '"비싼 장비 없이 스마트폰 하나로 가볍게 시작하기"',
    accentColor: '#f59e0b'
  },
  trends: {
    key: 'trends',
    stepNumber: 2,
    label: '요즘 뜨는 유튜브 트렌드',
    shortLabel: '최신 트렌드',
    levelBadge: '2편',
    icon: 'TrendingUp',
    gradient: 'from-blue-500 to-indigo-600',
    description: '쇼츠+롱폼 결합 공식, 날것의 일상 트렌드, 10초 훅과 시청 지속 시간을 끌어올리는 재미있는 노하우',
    count: ALL_POSTS.filter((p) => p.category === 'trends').length,
    persona: '"알고리즘과 시청자가 좋아하는 요즘 콘텐츠 트렌드"',
    accentColor: '#3b82f6'
  },
  ai_creator: {
    key: 'ai_creator',
    stepNumber: 3,
    label: 'AI 활용법과 주의할 점',
    shortLabel: 'AI 크리에이터',
    levelBadge: '3편',
    icon: 'PlayCircle',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'AI만 쓰면 왜 망하는지, 챗GPT 대본 프롬프트와 캡컷 자동화로 편집 시간 80% 아끼는 실전 꿀팁',
    count: ALL_POSTS.filter((p) => p.category === 'ai_creator').length,
    persona: '"AI를 똑똑한 비서로 부리며 사람 냄새 더하기"',
    accentColor: '#10b981'
  },
  monetization: {
    key: 'monetization',
    stepNumber: 4,
    label: '유튜브 수익화의 모든 것',
    shortLabel: '수익화 파이프라인',
    levelBadge: '4편',
    icon: 'BadgePercent',
    gradient: 'from-purple-500 to-violet-600',
    description: '조회수 광고비의 진실부터 쇼츠 100만 뷰 정산금, 멤버십 후원, 제휴 마케팅, PDF 전자책 판매까지',
    count: ALL_POSTS.filter((p) => p.category === 'monetization').length,
    persona: '"조회수 걱정 없이 안정적인 수입 만드는 다각화 전략"',
    accentColor: '#8b5cf6'
  }
};

export const CATEGORIES_LIST: CategorySpec[] = [
  CATEGORY_SPECS.why_youtube,
  CATEGORY_SPECS.trends,
  CATEGORY_SPECS.ai_creator,
  CATEGORY_SPECS.monetization
];
