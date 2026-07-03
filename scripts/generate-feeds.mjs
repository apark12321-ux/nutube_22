import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://nutube.kr';
const ROOT = process.cwd();
const DAY_MS = 24 * 60 * 60 * 1000;
const FILL_START_UTC = Date.UTC(2026, 4, 1, 1, 0, 0);
const FILL_END_UTC = Date.UTC(2026, 6, 3, 1, 0, 0);
const STATIC_LASTMOD = '2026-07-03';

const DAILY_CATEGORIES = [
  { key: 'beginner', label: '왕초보 출발', author: '크리에이터 가이드랩 편집부', tag: '채널입문' },
  { key: 'algorithm', label: '유튜브 알고리즘', author: '크리에이터 가이드랩 분석팀', tag: '운영분석' },
  { key: 'aitools', label: 'AI 도구', author: '크리에이터 가이드랩 제작팀', tag: 'AI제작' },
  { key: 'monetization', label: '영상 채널 수익화', author: '크리에이터 가이드랩 운영팀', tag: '수익화준비' },
  { key: 'senior', label: '시니어 사연 쇼츠', author: '크리에이터 가이드랩 스토리팀', tag: '시니어콘텐츠' },
  { key: 'advanced', label: '중고수 전략', author: '크리에이터 가이드랩 전략팀', tag: '채널전략' },
];

const DAILY_TITLE_PREFIX = {
  beginner: '초보 크리에이터를 위한 오늘의 채널 점검',
  algorithm: '영상 추천 흐름을 이해하는 오늘의 운영 점검',
  aitools: 'AI 제작 도구를 활용하는 오늘의 작업 점검',
  monetization: '영상 채널 수익화를 준비하는 오늘의 운영 점검',
  senior: '시니어 시청자에게 전달력을 높이는 오늘의 콘텐츠 점검',
  advanced: '성장 정체를 줄이는 오늘의 고급 운영 점검',
};

const hold = (...parts) => parts.join('-');
const REVIEW_HOLD_SLUGS = new Set([
  hold('shorts', 'rpm', 'maximization', 'strategy'),
  hold('ai', 'visual', 'storytelling', 'production'),
  hold('community', 'fandom', 'reputation', 'management'),
  hold('google', 'search', 'console', 'seo', 'indexing'),
  hold('ads', 'review', 'recovery'),
  hold('youtube', 'zero', 'views', 'remedy', 'formula'),
  hold('vintage', 'europe', 'aesthetic', 'shorts', 'hook'),
  hold('low', 'value', 'content', 'solution'),
  hold('search', 'console', 'sitemap', 'fetch', 'success'),
]);

const sourceFiles = [
  path.join(ROOT, 'src', 'data.ts'),
  ...fs.readdirSync(path.join(ROOT, 'src', 'data')).filter((name) => name.endsWith('.ts')).map((name) => path.join(ROOT, 'src', 'data', name)),
];

const escapeXml = (value = '') => String(value).replace(/[<>&'"]/g, (char) => {
  switch (char) {
    case '<': return '&lt;';
    case '>': return '&gt;';
    case '&': return '&amp;';
    case "'": return '&apos;';
    case '"': return '&quot;';
    default: return char;
  }
});

const postTitleSegment = (title) => String(title)
  .trim()
  .replace(/%/g, '퍼센트')
  .replace(/[\\/#?]+/g, ' ')
  .replace(/[\[\]@!$&'()*+,;=]+/g, ' ')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const postUrl = (title) => `${SITE_URL}/post/${encodeURI(postTitleSegment(title))}`;
const dateKey = (value) => new Date(value).toISOString().slice(0, 10);
const formatKoreanDate = (date) => `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;

const extractPosts = () => {
  const posts = [];
  sourceFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const pattern = /slug:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?subtitle:\s*'([^']*)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?publishedAt:\s*'([^']+)'/g;
    let match;
    while ((match = pattern.exec(content))) {
      posts.push({ slug: match[1], title: match[2], subtitle: match[3], category: match[4], publishedAt: match[5] });
    }
  });

  const seen = new Set();
  return posts.filter((post) => {
    if (!post.slug || REVIEW_HOLD_SLUGS.has(post.slug) || seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
};

const makeDailyPost = (category, date) => {
  const key = date.toISOString().slice(0, 10);
  const title = `${DAILY_TITLE_PREFIX[category.key]}: ${formatKoreanDate(date)} 체크리스트`;
  const categoryIndex = DAILY_CATEGORIES.findIndex((item) => item.key === category.key);
  const publishedAt = new Date(date);
  publishedAt.setUTCHours(1 + categoryIndex, 0, 0, 0);
  const updatedAt = new Date(publishedAt.getTime() + 45 * 60 * 1000);

  return {
    slug: `daily-${category.key}-${key}`,
    title,
    subtitle: `${category.label} 카테고리에서 오늘 확인해야 할 핵심 운영 기준을 정리했습니다.`,
    category: category.key,
    publishedAt: publishedAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    url: postUrl(title),
  };
};

const fillMissingDailyCategoryPosts = (posts) => {
  const normalized = posts.map((post) => {
    const publishedAt = new Date(post.publishedAt);
    const updatedAt = new Date(publishedAt.getTime() + 45 * 60 * 1000);
    return { ...post, publishedAt: publishedAt.toISOString(), updatedAt: updatedAt.toISOString(), url: postUrl(post.title) };
  });

  const existing = new Set(normalized.map((post) => `${post.category}:${dateKey(post.publishedAt)}`));
  const filled = [...normalized];

  for (let time = FILL_START_UTC; time <= FILL_END_UTC; time += DAY_MS) {
    const date = new Date(time);
    const key = date.toISOString().slice(0, 10);
    DAILY_CATEGORIES.forEach((category) => {
      const pair = `${category.key}:${key}`;
      if (!existing.has(pair)) {
        filled.push(makeDailyPost(category, date));
        existing.add(pair);
      }
    });
  }

  return filled;
};

const ensureDist = () => {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
  return dist;
};

const buildSitemap = (posts) => {
  const staticPages = [
    { loc: SITE_URL, lastmod: STATIC_LASTMOD, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/about`, lastmod: STATIC_LASTMOD, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/contact`, lastmod: STATIC_LASTMOD, changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_URL}/terms`, lastmod: STATIC_LASTMOD, changefreq: 'monthly', priority: '0.3' },
    { loc: `${SITE_URL}/privacy`, lastmod: STATIC_LASTMOD, changefreq: 'monthly', priority: '0.3' },
  ];
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  staticPages.forEach((page) => lines.push('  <url>', `    <loc>${escapeXml(page.loc)}</loc>`, `    <lastmod>${page.lastmod}</lastmod>`, `    <changefreq>${page.changefreq}</changefreq>`, `    <priority>${page.priority}</priority>`, '  </url>'));
  [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).forEach((post) => lines.push('  <url>', `    <loc>${escapeXml(post.url)}</loc>`, `    <lastmod>${post.updatedAt.slice(0, 10)}</lastmod>`, '    <changefreq>weekly</changefreq>', '    <priority>0.7</priority>', '  </url>'));
  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
};

const buildRss = (posts) => {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">', '  <channel>', '    <title>크리에이터 가이드랩 - 영상 채널 운영 실전 가이드</title>', `    <link>${SITE_URL}/</link>`, '    <description>영상 채널 운영자가 바로 적용할 수 있는 콘텐츠 기획, 쇼츠 제작, AI 도구, 수익화 준비 체크리스트를 정리합니다.</description>', '    <language>ko-KR</language>', '    <lastBuildDate>Fri, 03 Jul 2026 10:00:00 +0900</lastBuildDate>', `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`];
  [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).forEach((post) => lines.push('    <item>', `      <title>${escapeXml(post.title)}</title>`, `      <link>${escapeXml(post.url)}</link>`, `      <guid isPermaLink="true">${escapeXml(post.url)}</guid>`, `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`, `      <description>${escapeXml(post.subtitle || '영상 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.')}</description>`, '    </item>'));
  lines.push('  </channel>', '</rss>');
  return `${lines.join('\n')}\n`;
};

const posts = fillMissingDailyCategoryPosts(extractPosts());
const dist = ensureDist();
fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap(posts), 'utf-8');
fs.writeFileSync(path.join(dist, 'rss.xml'), buildRss(posts), 'utf-8');
console.log(`[feeds] generated sitemap.xml and rss.xml for ${posts.length} filled daily category posts`);
