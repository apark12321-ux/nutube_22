import fs from 'fs';
import path from 'path';

// www.nutube.kr는 nutube.kr로 301 이동하므로 대표 주소는 www 없는 주소다.
const SITE_URL = 'https://nutube.kr';
const ROOT = process.cwd();

// 단계별 글 (src/data/stages/*.json) + 자동 발행 글 (src/data/auto/posts.json)
const STAGES = ['start', 'grow', 'money', 'pro'];
let allPosts = [];
for (const stage of STAGES) {
  allPosts = allPosts.concat(JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'stages', `${stage}.json`), 'utf-8')));
}
const autoPostsPath = path.join(ROOT, 'src', 'data', 'auto', 'posts.json');
if (fs.existsSync(autoPostsPath)) {
  allPosts = allPosts.concat(JSON.parse(fs.readFileSync(autoPostsPath, 'utf-8')));
}

// RSS는 최신 글이 위로 오도록 발행일 역순
allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
const latest = (allPosts[0]?.updatedAt || allPosts[0]?.publishedAt || '2026-10-14').slice(0, 10);

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
    { loc: `${SITE_URL}/`, lastmod: latest, changefreq: 'weekly', priority: '1.0' },
    ...STAGES.map((k) => ({ loc: `${SITE_URL}/category/${k}`, lastmod: latest, changefreq: 'weekly', priority: '0.7' })),
    ...['about', 'contact', 'policy', 'privacy', 'terms'].map((k) => ({ loc: `${SITE_URL}/${k}`, lastmod: '2026-10-14', changefreq: 'monthly', priority: k === 'about' ? '0.6' : '0.3' }))
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
  const latestDate = posts.length > 0 ? new Date(posts[0].publishedAt).toUTCString() : new Date('2026-10-14').toUTCString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n';
  xml += '  <channel>\n';
  xml += '    <title>너튜브 - 50대 박프로의 유튜브 도전기</title>\n';
  xml += `    <link>${SITE_URL}/</link>\n`;
  xml += '    <description>쉰 넘어 유튜브를 시작한 박프로의 왕초보 첫걸음부터 수익 창출, 고수의 영역까지 경험담</description>\n';
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
    xml += `      <author>apark12321@gmail.com (박프로)</author>\n`;
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
fs.writeFileSync(path.join(publicDir, 'ads.txt'), 'google.com, pub-9552509372228899, DIRECT, f08c47fec0942fa0\n', 'utf-8');

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf-8');
fs.writeFileSync(path.join(distDir, 'ads.txt'), 'google.com, pub-9552509372228899, DIRECT, f08c47fec0942fa0\n', 'utf-8');

console.log(`[feeds] Successfully wrote rich sitemap.xml, rss.xml and ads.txt to public/ and dist/ (${allPosts.length} posts)`);
