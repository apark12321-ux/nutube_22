export type CategoryKey = 
  | 'youtube' 
  | 'blog' 
  | 'digital_biz'
  | 'workflow'
  | 'algorithm'
  | 'beginner'
  | 'senior'
  | 'monetization'
  | 'aitools'
  | 'advanced'
  | 'tiktok'
  | 'instagram';

export type PrimaryCategoryKey = 'youtube' | 'blog' | 'digital_biz' | 'workflow';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CategorySpec {
  key: CategoryKey;
  label: string;
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

export interface GuidePost {
  slug: string;
  title: string;
  subtitle: string;
  category: CategoryKey;
  categoryLabel: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  summary?: string;
  content: string;
  tags?: string[];
  readTime?: string;
  likes?: number;
  authorityUrl?: string;
  authorityLabel?: string;
  thumbnail?: PostImage;
  bodyImages?: [PostImage, PostImage];
  level?: DifficultyLevel;
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
