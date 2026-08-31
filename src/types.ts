export type CategoryKey = 
  | 'why_youtube'        // 왜 유튜브인가 & 시작법
  | 'trends'             // 요즘 유튜브 트렌드
  | 'ai_creator'         // AI 활용법과 주의점
  | 'monetization';      // 유튜브 수익화의 모든 것

export type PrimaryCategoryKey = CategoryKey;

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CategorySpec {
  key: CategoryKey;
  stepNumber?: number;
  label: string;
  shortLabel?: string;
  levelBadge?: string;
  icon: string;
  gradient: string;
  description: string;
  count: number;
  persona: string;
  accentColor: string;
}

export interface PostImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface QuickAnswer {
  summary: string[];
  keyTakeaway: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GuidePost {
  slug: string;
  title: string;
  subtitle: string;
  category: CategoryKey;
  categoryLabel: string;
  stepNumber?: number;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  summary?: string;
  quickAnswer?: QuickAnswer;
  faqList?: FaqItem[];
  content: string;
  tags?: string[];
  authorityUrl?: string;
  authorityLabel?: string;
  thumbnail?: PostImage;
  bodyImages?: [PostImage, PostImage];
  level?: DifficultyLevel;
  nextPostSlug?: string;
  prevPostSlug?: string;
}

export interface TitleSuggestion {
  title: string;
  ctr: number;
  type: '거울+깨달음형' | '단기 실험형' | '위험 회피형' | '결과 공개형' | '회상 가정형' | '스토리텔링형' | '정교한 지식인형' | '트렌드 편승형';
  reason: string;
}

export interface DescriptionSuggestion {
  persona: string;
  text: string;
}

export interface StoryboardScene {
  scene: string;
  visual: string;
  audio: string;
  timing: string;
}

export interface ThumbnailConcept {
  graphic: string;
  titleText: string;
  vibe: string;
}

export interface ShortsScript {
  hook: string;
  body: string;
  cta: string;
}

export interface MetadataResult {
  keyword: string;
  titles: TitleSuggestion[];
  description: string;
  tags: string[];
  storyboard: StoryboardScene[];
  thumbnails: ThumbnailConcept[];
  shortsScript: ShortsScript;
  isFallback?: boolean;
  fallbackReason?: string;
}
