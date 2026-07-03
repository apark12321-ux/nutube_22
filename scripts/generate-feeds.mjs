import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://nutube.kr';
const ROOT = process.cwd();
const DAY_MS = 24 * 60 * 60 * 1000;
const FILL_START_UTC = Date.UTC(2026, 4, 1, 1, 0, 0);
const FILL_END_UTC = Date.UTC(2026, 6, 3, 1, 0, 0);
const STATIC_LASTMOD = '2026-07-03';

const DAILY_CATEGORIES = [
  { key: 'beginner', label: '왕초보 출발', themes: ['첫 영상 주제 선택', '채널 소개 문장 설계', '첫 10초 도입부 구성', '촬영 전 대본 뼈대 만들기', '초보자가 버려야 할 완벽주의'], angles: ['바로 따라 할 수 있는 단순성', '공감되는 진정성', '지속 가능한 운영 기준'] },
  { key: 'algorithm', label: '유튜브 알고리즘', themes: ['클릭률이 낮은 영상의 원인 분석', '시청 지속 시간이 떨어지는 구간 찾기', '추천 흐름이 약해진 영상 복구', '제목 변경 전 확인할 데이터', '썸네일 테스트의 판단 기준'], angles: ['지표를 행동으로 번역하는 관점', '흐름을 보는 분석 기준', '시리즈 단위 판단법'] },
  { key: 'aitools', label: 'AI 도구', themes: ['AI 대본 초안을 사람 말투로 바꾸기', 'AI 음성 사용 전 감정선 점검', '자막 자동화 후 검수 기준', '썸네일 문구를 AI로 줄이는 방법', '자료 조사 프롬프트 설계'], angles: ['검수 체계 중심 운영', '속도와 신뢰성을 함께 잡는 방식', '운영자 경험을 보강하는 방법'] },
  { key: 'monetization', label: '영상 채널 수익화', themes: ['수익화 전 단계에서 준비할 신뢰 요소', '협찬 제안을 받기 전 채널 정리', '멤버십보다 먼저 필요한 팬 관계', '상품 소개 영상의 신뢰 문장', '설명란과 고정댓글의 역할'], angles: ['신뢰를 먼저 만드는 관점', '장기 재방문을 보는 관점', '정책 안정성을 지키는 방식'] },
  { key: 'senior', label: '시니어 사연 쇼츠', themes: ['시니어 시청자가 끝까지 보는 도입부', '사연 영상의 감정선 조절', '큰 자막과 쉬운 문장 구성', '댓글 공감을 부르는 질문', '생활 정보와 사연의 결합'], angles: ['따뜻하지만 과장하지 않는 관점', '시청자 경험을 존중하는 문장', '모바일 가독성을 먼저 보는 방식'] },
  { key: 'advanced', label: '중고수 전략', themes: ['성장 정체 구간의 원인 분리', '시리즈 포맷 재설계', '채널 브랜딩 문장 정리', '롱폼과 쇼츠의 역할 분리', 'A/B 테스트의 올바른 순서'], angles: ['채널을 제품처럼 보는 관점', '성과를 구조별로 나누는 방식', '기존 자산을 재활용하는 전략'] },
];

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
const pick = (items, seed) => items[Math.abs(seed) % items.length];
const dayIndex = (date) => Math.floor((date.getTime() - FILL_START_UTC) / DAY_MS);
const dailyTitle = (category, date) => {
  const categoryIndex = DAILY_CATEGORIES.findIndex((item) => item.key === category.key);
  const seed = dayIndex(date) + categoryIndex * 11;
  return `${formatKoreanDate(date)} ${category.label}: ${pick(category.themes, seed)}로 ${pick(category.angles, seed + 3)} 만들기`;
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

const makeDailyPost = (category, date) => {
  const key = date.toISOString().slice(0, 10);
  const title = dailyTitle(category, date);
  const categoryIndex = DAILY_CATEGORIES.findIndex((item) => item.key === category.key);
  const publishedAt = new Date(date);
  publishedAt.setUTCHours(1 + categoryIndex, 0, 0, 0);
  const updatedAt = new Date(publishedAt.getTime() + 45 * 60 * 1000);

  return {
    slug: `daily-${category.key}-${key}`,
    title,
    subtitle: `${category.label} 카테고리에서 ${formatKoreanDate(date)}에 다루기 좋은 실전형 운영 주제를 깊이 있게 정리했습니다.`,
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
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">', '  <channel>', '    <title>크리에이터 가이드랩 - 영상 채널 운영 실전 가이드</title>', `    <link>${SITE_URL}/</link>`, '    <description>영상 채널 운영자가 바로 적용할 수 있는 콘텐츠 기획, 쇼츠 제작, AI 도구, 수익화 준비 전략을 정리합니다.</description>', '    <language>ko-KR</language>', '    <lastBuildDate>Fri, 03 Jul 2026 10:00:00 +0900</lastBuildDate>', `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`];
  [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).forEach((post) => lines.push('    <item>', `      <title>${escapeXml(post.title)}</title>`, `      <link>${escapeXml(post.url)}</link>`, `      <guid isPermaLink="true">${escapeXml(post.url)}</guid>`, `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`, `      <description>${escapeXml(post.subtitle || '영상 채널 운영자가 바로 확인할 수 있는 실전 가이드입니다.')}</description>`, '    </item>'));
  lines.push('  </channel>', '</rss>');
  return `${lines.join('\n')}\n`;
};

const posts = fillMissingDailyCategoryPosts(extractPosts());
const dist = ensureDist();
fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap(posts), 'utf-8');
fs.writeFileSync(path.join(dist, 'rss.xml'), buildRss(posts), 'utf-8');
console.log(`[feeds] generated sitemap.xml and rss.xml for ${posts.length} varied daily category posts`);
