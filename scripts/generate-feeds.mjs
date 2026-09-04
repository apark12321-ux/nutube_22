import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.nutube.kr';
const ROOT = process.cwd();

// Load posts from category files
const categoriesDir = path.join(ROOT, 'src', 'data', 'categories');
const categoryFiles = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.ts'));

let allPosts = [];

for (const file of categoryFiles) {
  const content = fs.readFileSync(path.join(categoriesDir, file), 'utf-8');
  const equalIdx = content.indexOf('= [');
  if (equalIdx !== -1) {
    const jsonStart = equalIdx + 2;
    const jsonEnd = content.lastIndexOf(']') + 1;
    try {
      const posts = JSON.parse(content.substring(jsonStart, jsonEnd));
      allPosts = allPosts.concat(posts);
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }
}

// Sort posts descending by publishedAt
allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

console.log(`Loaded ${allPosts.length} posts for feed generation.`);

function escapeXml(unsafe = '') {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function buildSitemapXml(posts) {
  const staticPages = [
    { loc: `${SITE_URL}/`, lastmod: '2026-08-31', changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/about`, lastmod: '2026-08-31', changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_URL}/terms`, lastmod: '2026-08-31', changefreq: 'monthly', priority: '0.3' },
    { loc: `${SITE_URL}/privacy`, lastmod: '2026-08-31', changefreq: 'monthly', priority: '0.3' }
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(page.loc)}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  for (const post of posts) {
    const postUrl = `${SITE_URL}/post/${encodeURIComponent(post.slug)}`;
    const lastmod = (post.updatedAt || post.publishedAt || '2026-08-31').slice(0, 10);
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(postUrl)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

function buildRssXml(posts) {
  const latestDate = posts.length > 0 ? new Date(posts[0].publishedAt).toUTCString() : new Date().toUTCString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n';
  xml += '  <channel>\n';
  xml += '    <title>NuTube - 1인 크리에이터 유튜브 실전 성장 가이드</title>\n';
  xml += `    <link>${SITE_URL}/</link>\n`;
  xml += '    <description>유튜브 채널 개설부터 스마트폰 촬영, 캡컷 컷편집, 알고리즘 분석, 월 100만 원 다중 파이프라인 구축까지 1인 크리에이터 실전 가이드</description>\n';
  xml += '    <language>ko-KR</language>\n';
  xml += `    <lastBuildDate>${latestDate}</lastBuildDate>\n`;
  xml += `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  // Naver & Google recommend recent 50~100 comprehensive items for optimal RSS parsing
  const feedItems = posts.slice(0, 80);

  for (const post of feedItems) {
    const postUrl = `${SITE_URL}/post/${encodeURIComponent(post.slug)}`;
    const pubDate = new Date(post.publishedAt).toUTCString();
    const summary = post.summary || post.subtitle || '';
    const contentHtml = `
      <p><strong>${escapeXml(post.subtitle || '')}</strong></p>
      <p>${escapeXml(post.summary || '')}</p>
      <div>${escapeXml(post.content || '').replace(/\n/g, '<br/>')}</div>
    `.trim();

    xml += '    <item>\n';
    xml += `      <title><![CDATA[${post.title}]]></title>\n`;
    xml += `      <link>${postUrl}</link>\n`;
    xml += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    xml += `      <author>minwoo@nutube.kr (${escapeXml(post.author || '민우')})</author>\n`;
    xml += `      <category><![CDATA[${post.categoryLabel || post.category || '가이드'}]]></category>\n`;
    xml += `      <description><![CDATA[${summary}]]></description>\n`;
    xml += `      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>\n`;
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>\n';
  return xml;
}

const sitemapXml = buildSitemapXml(allPosts);
const rssXml = buildRssXml(allPosts);

// Write to both public and dist directories
const publicDir = path.join(ROOT, 'public');
const distDir = path.join(ROOT, 'dist');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf-8');

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf-8');

console.log(`[feeds] Successfully wrote rich sitemap.xml and rss.xml to public/ and dist/ (${allPosts.length} posts)`);
