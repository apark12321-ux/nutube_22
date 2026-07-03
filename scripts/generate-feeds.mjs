import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://nutube.kr';
const ROOT = process.cwd();
const DAY_MS = 24 * 60 * 60 * 1000;
const TWO_DAY_MS = DAY_MS * 2;
const SCHEDULE_END_UTC = Date.UTC(2026, 6, 3, 1, 0, 0);
const STATIC_LASTMOD = '2026-07-03';

const CATEGORY_ORDER = ['beginner', 'algorithm', 'aitools', 'monetization', 'senior', 'advanced'];
const CATEGORY_OFFSETS = { beginner: 0, algorithm: 1, aitools: 0, monetization: 1, senior: 0, advanced: 1 };

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
const categoryRank = (key) => {
  const index = CATEGORY_ORDER.indexOf(key);
  return index === -1 ? CATEGORY_ORDER.length : index;
};

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

const applySchedule = (posts) => {
  const grouped = new Map();
  posts.forEach((post) => {
    const group = grouped.get(post.category) || [];
    group.push(post);
    grouped.set(post.category, group);
  });

  const scheduled = [];
  Array.from(grouped.entries()).sort(([a], [b]) => categoryRank(a) - categoryRank(b)).forEach(([categoryKey, items]) => {
    const sorted = [...items].sort((a, b) => {
      const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      return diff || a.slug.localeCompare(b.slug);
    });
    const rank = categoryRank(categoryKey);
    const offsetDays = CATEGORY_OFFSETS[categoryKey] ?? rank % 2;
    sorted.forEach((post, index) => {
      const fromLatest = sorted.length - 1 - index;
      const publishDate = new Date(SCHEDULE_END_UTC - offsetDays * DAY_MS - fromLatest * TWO_DAY_MS);
      publishDate.setUTCHours(1 + ((rank + index) % 8), (index % 4) * 10, 0, 0);
      const updatedDate = new Date(publishDate.getTime() + 45 * 60 * 1000);
      scheduled.push({ ...post, publishedAt: publishDate.toISOString(), updatedAt: updatedDate.toISOString(), url: postUrl(post.title) });
    });
  });
  return scheduled;
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
  staticPages.forEach((page) => {
    lines.push('  <url>', `    <loc>${escapeXml(page.loc)}</loc>`, `    <lastmod>${page.lastmod}</lastmod>`, `    <changefreq>${page.changefreq}</changefreq>`, `    <priority>${page.priority}</priority>`, '  </url>');
  });
  [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).forEach((post) => {
    lines.push('  <url>', `    <loc>${escapeXml(post.url)}</loc>`, `    <lastmod>${post.updatedAt.slice(0, 10)}</lastmod>`, '    <changefreq>weekly</changefreq>', '    <priority>0.7</priority>', '  </url>');
  });
  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
};

const buildRss = (posts) => {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">', '  <channel>', '    <title>크리에이터 가이드랩 - 영상 채널 운영 실전 가이드</title>', `    <link>${SITE_URL}/</link>`, '    <description>영상 채널 운영자가 바로 적용할 수 있는 콘텐츠 기획, 쇼츠 제작, AI 도구, 수익화 준비 체크리스트를 정리합니다.</description>', '    <language>ko-KR</language>', '    <lastBuildDate>Fri, 03 Jul 2026 10:00:00 +0900</lastBuildDate>', `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`];
  [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).forEach((post) => {
    lines.push('    <item>', `      <title>${escapeXml(post.title)}</title>`, `      <link>${escapeXml(post.url)}</link>`, `      <guid isPermaLink="true">${escapeXml(post.url)}</guid>`, `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`, `      <description>${escapeXml(post.subtitle || '영상 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.')}</description>`, '    </item>');
  });
  lines.push('  </channel>', '</rss>');
  return `${lines.join('\n')}\n`;
};

const posts = applySchedule(extractPosts());
const dist = ensureDist();
fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap(posts), 'utf-8');
fs.writeFileSync(path.join(dist, 'rss.xml'), buildRss(posts), 'utf-8');
console.log(`[feeds] generated sitemap.xml and rss.xml for ${posts.length} category-scheduled posts`);
