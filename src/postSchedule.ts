import { addPostImages } from './postImages';
import { GuidePost } from './types';

export const postTitleSegment = (title: string) =>
  title
    .trim()
    .replace(/%/g, '퍼센트')
    .replace(/[\/#?]+/g, ' ')
    .replace(/[\[\]@!$&'()*+,;=]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// 대표 글 주소는 slug 기반(/post/<slug>)이다. sitemap.xml·RSS와 같은 주소를 써야
// 검색엔진이 받은 주소가 실제 글로 열린다. 예전 제목 기반 주소는 getLegacyPostPath로 남긴다.
export const getPostPath = (post: Pick<GuidePost, 'slug'>) => `/post/${encodeURIComponent(post.slug)}`;

export const getLegacyPostPath = (post: Pick<GuidePost, 'title'>) => `/post/${postTitleSegment(post.title)}`;

// 글 목록에 대표 이미지를 붙이고 정렬한다.
// 예전에는 가장 최근 글이 항상 "오늘" 날짜가 되도록 모든 글의 날짜를 매일 밀어 주었는데,
// 실제 발행일과 다른 날짜가 화면·사이트맵·구조화 데이터에 나가게 되어 제거했다.
// 날짜는 데이터에 적힌 publishedAt / updatedAt 을 그대로 쓴다.
export const applyPostDateSchedule = (posts: GuidePost[]): GuidePost[] => {
  if (!posts || posts.length === 0) return [];

  return posts
    .map((post) => addPostImages(post))
    .sort((a, b) => {
      // Step number first, then publication date
      if (a.stepNumber && b.stepNumber && a.stepNumber !== b.stepNumber) {
        return a.stepNumber - b.stepNumber;
      }
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    });
};
