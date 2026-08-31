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

export const getPostPath = (post: Pick<GuidePost, 'title'>) => `/post/${postTitleSegment(post.title)}`;

export const applyPostDateSchedule = (posts: GuidePost[]): GuidePost[] => {
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

