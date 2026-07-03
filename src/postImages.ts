import { GuidePost, PostImage } from './types';

export const DEFAULT_REMOTE_IMAGE = 'https://picsum.photos/seed/creator-guide-lab-default/1200/675';

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const safeSeed = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'creator-guide';

const categoryLabel = (post: GuidePost) => post.categoryLabel || '영상 채널 운영';

const uniqueImageUrl = (post: GuidePost, slot: 'thumb' | 'body-a' | 'body-b') => {
  const baseSeed = safeSeed(`${post.slug}-${slot}`);
  return `https://picsum.photos/seed/cgl-${baseSeed}/1200/675`;
};

const makeThumbnail = (post: GuidePost): PostImage => ({
  src: uniqueImageUrl(post, 'thumb'),
  alt: `${categoryLabel(post)} 주제의 영상 채널 운영 가이드 썸네일 이미지`,
  caption: '글의 핵심 주제를 한눈에 확인할 수 있는 대표 이미지입니다.',
});

const makeBodyImage = (post: GuidePost, slot: 'body-a' | 'body-b', order: number): PostImage => ({
  src: uniqueImageUrl(post, slot),
  alt: `${categoryLabel(post)} 관련 체크리스트를 설명하는 본문 참고 이미지 ${order}`,
  caption: order === 1
    ? '업로드 전에는 주제, 시청자, 영상 흐름을 함께 점검하는 것이 좋습니다.'
    : '적용 후에는 조회수만 보지 말고 클릭률, 시청 지속 시간, 댓글 반응을 함께 기록합니다.',
});

export const addPostImages = (post: GuidePost): GuidePost => {
  const seed = hashString(post.slug || post.title);
  const thumbnail = makeThumbnail({ ...post, slug: `${post.slug}-${seed}` });
  const body1 = makeBodyImage({ ...post, slug: `${post.slug}-${seed + 101}` }, 'body-a', 1);
  const body2 = makeBodyImage({ ...post, slug: `${post.slug}-${seed + 202}` }, 'body-b', 2);

  return {
    ...post,
    thumbnail,
    bodyImages: [body1, body2],
  };
};

export const addImagesToPosts = (posts: GuidePost[]) => posts.map(addPostImages);
