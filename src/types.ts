export type CategoryKey = 
  | 'step1_starter'      // 시작과 세팅
  | 'step2_creator'      // 기획과 첫 제작
  | 'step3_growth'       // 알고리즘과 성장
  | 'step4_master'       // 다중 파이프라인과 자동화
  | 'youtube' 
  | 'blog' 
  | 'digital_biz'
  | 'workflow'
  | 'beginner'
  | 'algorithm'
  | 'senior'
  | 'monetization'
  | 'aitools'
  | 'advanced'
  | 'tiktok'
  | 'instagram';

export type PrimaryCategoryKey = 'step1_starter' | 'step2_creator' | 'step3_growth' | 'step4_master';

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
