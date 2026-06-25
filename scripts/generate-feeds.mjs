import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://nutube.kr';
const ROOT = process.cwd();
const DAY_MS = 24 * 60 * 60 * 1000;
const SCHEDULE_END_UTC = Date.UTC(2026, 5, 26, 1, 0, 0);
const STATIC_LASTMOD = '2026-06-26';

const REVIEW_HOLD_SLUGS = new Set([
  'shorts-rpm-maximization-strategy',
  'ai-visual-storytelling-production',
  'community-fandom-reputation-management',
  'google-search-console-seo-indexing',
  'adsense-rejection-recovery',
  'youtube-zero-views-remedy-formula',
  'vintage-europe-aesthetic-shorts-hook',
  'adsense-low-value-content-solution',
  'search-console-sitemap-fetch-success',
]);

const sourceFiles = [
  path.join(ROOT, 'src', 'data.ts'),
  ...fs.readdirSync(path.join(ROOT, 'src', 'data'))
    .filter((name) => name.endsWith('.ts'))
    .map((name) => path.join(ROOT, 'src', 'data', name)),
];

const escapeXml = (value = '') =>
  String(value).replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return char;
    }
  });

const postTitleSegment = (title) =>
  String(title)
    .trim()
    .replace(/%/g, '퍼센트')
    .replace(/[\\/#?]+/g, ' ')
    .replace(/[\[\]@!$&'()*+,;=]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const postUrl = (title) => `${SITE_URL}/post/${encodeURI(postTitleSegment(title))}`;

const extractPosts = () => {
  const posts = [];

  sourceFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const pattern = /slug:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?subtitle:\s*'([^']*)'[\s\S]*?publishedAt:\s*'([^']+)'/g;

    let match;
    while ((match = pattern.exec(content))) {
      posts.push({
        slug: match[1],
        title: match[2],
        subtitle: match[3],
        publishedAt: match[4],
      });
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
  const chronological = [...posts].sort((a, b) => {
    const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    return diff || a.slug.localeCompare(b.slug);
  });

  return chronological.map((post, index) => {
    const dayOffset = chronological.length - 1 - index;
    const publishDate = new Date(SCHEDULE_END_UTC - dayOffset * DAY_MS);
    publishDate.setUTCHours(1 + (index % 8), (index % 4) * 10, 0, 0);

    const updatedDate = new Date(publishDate.getTime() + 45 * 60 * 1000);

    return {
      ...post,
      publishedAt: publishDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      url: postUrl(post.title),
    };
  });
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
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(page.loc)}</loc>`);
    lines.push(`    <lastmod>${page.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${page.changefreq}</changefreq>`);
    lines.push(`    <priority>${page.priority}</priority>`);
    lines.push('  </url>');
  });

  [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).forEach((post) => {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(post.url)}</loc>`);
    lines.push(`    <lastmod>${post.updatedAt.slice(0, 10)}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push('    <priority>0.7</priority>');
    lines.push('  </url>');
  });

  lines.push('</urlset>');
  return `${lines.join('\n')}\n`;
};

const buildRss = (posts) => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>NuTube - 유튜브 채널 운영 실전 가이드</title>',
    `    <link>${SITE_URL}/</link>`,
    '    <description>유튜브 채널 운영자가 바로 적용할 수 있는 알고리즘, 수익화, AI 도구, 쇼츠 제작 전략을 정리합니다.</description>',
    '    <language>ko-KR</language>',
    '    <lastBuildDate>Fri, 26 Jun 2026 10:00:00 +0900</lastBuildDate>',
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
  ];

  [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).forEach((post) => {
    lines.push('    <item>');
    lines.push(`      <title>${escapeXml(post.title)}</title>`);
    lines.push(`      <link>${escapeXml(post.url)}</link>`);
    lines.push(`      <guid isPermaLink="true">${escapeXml(post.url)}</guid>`);
    lines.push(`      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`);
    lines.push(`      <description>${escapeXml(post.subtitle || '유튜브 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.')}</description>`);
    lines.push('    </item>');
  });

  lines.push('  </channel>');
  lines.push('</rss>');
  return `${lines.join('\n')}\n`;
};

const posts = applySchedule(extractPosts());
const dist = ensureDist();

fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap(posts), 'utf-8');
fs.writeFileSync(path.join(dist, 'rss.xml'), buildRss(posts), 'utf-8');

console.log(`[feeds] generated sitemap.xml and rss.xml for ${posts.length} scheduled posts`);
