import { GuidePost, PostImage } from './types';

// Robust, high-speed creator-themed curated photos from Unsplash CDN
const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  step1_starter: [
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80', // Smartphone recording & light
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80', // Microphone & audio
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80', // Camera gear
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80', // Creator workspace
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80', // Studio setup
  ],
  step2_creator: [
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80', // Video editing timeline
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80', // Video production monitor
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', // Creative editing setup
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', // Production workflow
    'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80', // Editing workstation
  ],
  step3_algorithm: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', // Analytics dashboard chart
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', // Growth metrics & statistics
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80', // Performance graphs
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80', // Audience content planning
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80', // Tech analytics
  ],
  step4_revenue: [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80', // Revenue & pipeline finance
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80', // Business laptop & coffee
    'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1200&q=80', // Monetization dashboard
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80', // Digital revenue growth
    'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1200&q=80', // Creator workspace notes
  ],
  default: [
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
  ],
};

export const DEFAULT_REMOTE_IMAGE = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80';

// Bulletproof SVG data URI fallback in case external images fail to load
export const FALLBACK_IMAGE_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <circle cx="600" cy="300" r="180" fill="#4338ca" opacity="0.25"/>
  <rect x="520" y="220" width="160" height="110" rx="24" fill="url(#accent)"/>
  <polygon points="585,255 625,275 585,295" fill="#ffffff"/>
  <text x="600" y="410" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="28" font-weight="bold" fill="#f8fafc" text-anchor="middle">민우의 크리에이터 노트</text>
  <text x="600" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">1인 유튜브 실전 가이드 &amp; 데이터 일지</text>
</svg>
`)}`;

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const categoryLabel = (post: GuidePost) => post.categoryLabel || '영상 채널 운영';

const getCuratedImageUrl = (post: GuidePost, slotOffset: number) => {
  const categoryKey = post.category || 'default';
  const pool = CATEGORY_IMAGE_POOLS[categoryKey] || CATEGORY_IMAGE_POOLS.default;
  const seed = hashString(post.slug || post.title) + slotOffset;
  const index = Math.abs(seed) % pool.length;
  return pool[index];
};

const makeThumbnail = (post: GuidePost): PostImage => ({
  src: getCuratedImageUrl(post, 0),
  alt: `${categoryLabel(post)} 주제의 영상 채널 운영 가이드 썸네일 이미지`,
  caption: post.title,
});

const makeBodyImage = (post: GuidePost, order: number): PostImage => ({
  src: getCuratedImageUrl(post, order * 7 + 3),
  alt: `${categoryLabel(post)} 관련 체크리스트를 설명하는 본문 참고 이미지 ${order}`,
  caption: order === 1
    ? '스마트폰 촬영과 컷편집 단계에서는 불필요한 호흡을 먼저 덜어내는 것이 중요합니다.'
    : '업로드 후에는 조회수뿐 아니라 클릭률(CTR)과 평균 시청 지속 시간을 함께 기록합니다.',
});

export const addPostImages = (post: GuidePost): GuidePost => {
  const thumbnail = makeThumbnail(post);
  const body1 = makeBodyImage(post, 1);
  const body2 = makeBodyImage(post, 2);

  return {
    ...post,
    thumbnail,
    bodyImages: [body1, body2],
  };
};

export const addImagesToPosts = (posts: GuidePost[]) => posts.map(addPostImages);

