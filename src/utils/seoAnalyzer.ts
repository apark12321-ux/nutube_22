import { GuidePost } from '../types';
import { getPostPath } from '../postSchedule';

/**
 * Stopwords to filter out generic Korean words and punctuation
 */
const KOREAN_STOPWORDS = new Set([
  '이', '그', '저', '것', '수', '등', '들', '및', '를', '을', '에', '의', '가', '은', '는', '로', '으로',
  '과', '와', '도', '으로', '에서', '에게', '따라', '대해', '대한', '통해', '위해', '하는', '한다', '했다',
  '있는', '있다', '되는', '된다', '하며', '하며', '또한', '하지만', '그리고', '이러한', '모든', '경우',
  '매우', '가장', '더욱', '바로', '직접', '실제', '방법', '활용', '진행', '확인', '가능', '포함', '제공'
]);

/**
 * Clean and normalize text from markdown tags, codeblocks, tables, and special chars
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ') // remove code blocks
    .replace(/`[^`]*`/g, ' ') // remove inline code
    .replace(/#+\s*/g, ' ') // remove headers
    .replace(/!\[.*?\]\(.*?\)/g, ' ') // remove images
    .replace(/\[.*?\]\(.*?\)/g, ' ') // remove links
    .replace(/\|/g, ' ') // remove table delimiters
    .replace(/[-*_\n\r\t]/g, ' ') // remove markdown markers
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ]/g, ' '); // remove punctuation
}

/**
 * Extracts top N most relevant SEO keywords from title, tags, summary, and content
 */
export function extractTopSeoKeywords(post: GuidePost, limit: number = 10): string[] {
  const scores: Map<string, number> = new Map();

  const addScore = (term: string, weight: number) => {
    const clean = term.trim().toLowerCase();
    if (!clean || clean.length < 2 || clean.length > 20) return;
    if (KOREAN_STOPWORDS.has(clean)) return;
    if (/^\d+$/.test(clean)) return; // skip pure numbers

    const current = scores.get(clean) || 0;
    scores.set(clean, current + weight);
  };

  // 1. Tags carry extremely high weight (explicit author-assigned keywords)
  if (Array.isArray(post.tags)) {
    post.tags.forEach((tag) => {
      addScore(tag, 15);
      // If tag is compound, also score sub-words
      const subwords = tag.split(/[\s_,-]+/);
      if (subwords.length > 1) {
        subwords.forEach((sw) => addScore(sw, 8));
      }
    });
  }

  // 2. Title words (High SEO prominence)
  const cleanTitle = cleanMarkdown(post.title || '');
  cleanTitle.split(/\s+/).forEach((word) => {
    addScore(word, 8);
  });

  // 3. Subtitle & Summary words
  const cleanSummary = cleanMarkdown(`${post.subtitle || ''} ${post.summary || ''}`);
  cleanSummary.split(/\s+/).forEach((word) => {
    addScore(word, 4);
  });

  // 4. Category label
  if (post.categoryLabel) {
    addScore(post.categoryLabel, 6);
  }

  // 5. Content body (Frequency-based Term Extraction)
  const cleanContent = cleanMarkdown(post.content || '');
  const contentWords = cleanContent.split(/\s+/);
  
  contentWords.forEach((word) => {
    if (word.length >= 2 && !KOREAN_STOPWORDS.has(word)) {
      addScore(word, 1);
    }
  });

  // Sort keywords by calculated SEO relevance weight
  const sortedKeywords = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword);

  // Return exactly requested number of unique keywords
  const uniqueList = Array.from(new Set(sortedKeywords));
  return uniqueList.slice(0, limit);
}

/**
 * Dynamically updates document metadata in the DOM:
 * - document.title
 * - meta[name="description"]
 * - meta[name="keywords"] (with top 10 dynamic SEO keywords)
 * - Open Graph & Twitter meta tags
 */
export function updateDynamicPostSeoMeta(post: GuidePost) {
  if (typeof document === 'undefined') return;

  const keywords = extractTopSeoKeywords(post, 10);
  const keywordsString = keywords.join(', ');

  // 1. Update Title
  const pageTitle = `${post.title} | 너튜브`;
  document.title = pageTitle;

  // 2. Helper to set/update meta tag
  const setMetaTag = (attrName: string, attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const description = post.summary || post.subtitle || post.title;

  // 3. Meta Keywords & Description
  setMetaTag('name', 'keywords', keywordsString);
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'author', post.author || '너튜브 (NuTube)');

  // 4. Canonical & Open Graph
  const postPath = getPostPath(post);
  const canonicalUrl = `https://nutube.kr${postPath}`;
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  setMetaTag('property', 'og:title', post.title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  if (post.thumbnail?.src) {
    setMetaTag('property', 'og:image', post.thumbnail.src);
  }

  // 5. Twitter Card
  setMetaTag('name', 'twitter:title', post.title);
  setMetaTag('name', 'twitter:description', description);
  if (post.thumbnail?.src) {
    setMetaTag('name', 'twitter:image', post.thumbnail.src);
  }

  return keywords;
}

/**
 * Updates document metadata for static policy & about pages
 */
export function updatePageSeoMeta(tab: 'about' | 'terms' | 'privacy') {
  if (typeof document === 'undefined') return;

  const setMetaTag = (attrName: string, attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  let title = '너튜브 (NuTube) | 너와 나의 1인 미디어 성장 노트';
  let description = '너(Nu)와 나의 1인 미디어 성장 노트. 스마트폰 한 대로 시작하는 유튜브 채널 운영, 쇼츠 제작, 애드센스 승인과 실전 수익화 가이드입니다.';
  let pageUrl = `https://nutube.kr/${tab}`;

  if (tab === 'about') {
    title = '운영자 소개 & 블로그 철학 | 너튜브';
    description = '1인 미디어와 애드센스 실전 노하우를 기록하는 너튜브(NuTube) 운영자 민우의 소개와 운영 철학 및 3대 원칙(E-E-A-T)입니다.';
  } else if (tab === 'terms') {
    title = '이용약관 및 면책조항 | 너튜브';
    description = '너튜브(NuTube)의 서비스 이용약관, 콘텐츠 저작권 보호 규정, 수익 면책조항 및 제휴 마케팅 투명성 고지입니다.';
  } else if (tab === 'privacy') {
    title = '개인정보처리방침 (Privacy Policy) | 너튜브';
    description = '너튜브(NuTube)의 개인정보처리방침, 구글 애드센스(Google AdSense) 쿠키 및 맞춤형 광고 거부 안내, 개인정보 보호 정책입니다.';
  }

  document.title = title;

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', pageUrl);

  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', pageUrl);
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
}

/**
 * Resets document metadata back to default homepage SEO values
 */
export function resetDefaultSeoMeta() {
  if (typeof document === 'undefined') return;

  document.title = '너튜브 (NuTube) | 너와 나의 1인 미디어 성장 노트';

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canonicalEl) {
    canonicalEl.setAttribute('href', 'https://nutube.kr/');
  }

  const setMetaTag = (attrName: string, attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  setMetaTag('name', 'keywords', '너튜브, NuTube, 너와 나의 유튜브, 유튜브 쇼츠 수익, 애드센스 승인, 구글 검색 노출, 블로그 글쓰기, 1인 크리에이터, 부수입, 전자책 판매');
  setMetaTag('name', 'description', '너(Nu)와 나의 1인 미디어 성장 노트. 스마트폰 한 대로 시작하는 유튜브 채널 운영, 쇼츠 제작, 구글 애드센스 승인과 실전 수익화 노하우를 솔직하게 기록합니다.');
  setMetaTag('property', 'og:title', '너튜브 (NuTube) | 너와 나의 1인 미디어 성장 노트');
  setMetaTag('property', 'og:description', '너(Nu)와 나의 1인 미디어 성장 노트. 스마트폰 한 대로 시작하는 유튜브 채널 운영과 실전 수익화 가이드');
  setMetaTag('property', 'og:url', 'https://nutube.kr/');
  setMetaTag('name', 'twitter:title', '너튜브 (NuTube) | 너와 나의 1인 미디어 성장 노트');
  setMetaTag('name', 'twitter:description', '너(Nu)와 나의 1인 미디어 성장 노트. 유튜브 쇼츠, 구글 애드센스, 블로그 운영 실전 노하우');
}
