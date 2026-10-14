// 빌드 시 사전 렌더링.
// Vercel은 dist/ 를 정적 파일로만 서빙하므로(server.ts는 실행되지 않음) 글마다
// 본문·제목·대표 주소가 들어간 HTML 파일을 미리 만들어 둔다. 이렇게 해야 검색엔진과
// 애드센스 심사 봇이 자바스크립트 실행 없이도 글 내용을 읽을 수 있다.
import fs from 'fs';
import path from 'path';
import { ALL_POSTS, CATEGORIES_LIST } from '../src/data';
import { applyPostDateSchedule, getPostPath, getLegacyPostPath } from '../src/postSchedule';
import { injectSsrAndSeoMetadata } from '../src/seoInject';
import { STATIC_PAGE_PATHS } from '../src/data/pages';

const HOST = 'nutube.kr';
const PROTOCOL = 'https';
const DIST = path.join(process.cwd(), 'dist');

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
if (!template.includes('<div id="root"></div>')) {
  throw new Error('[prerender] dist/index.html 에 <div id="root"></div> 가 없습니다. 템플릿이 바뀌었는지 확인하세요.');
}

const posts = applyPostDateSchedule(ALL_POSTS);
const render = (route: string) => injectSsrAndSeoMetadata(template, route, HOST, PROTOCOL, posts);

const writeRoute = (route: string, html: string) => {
  const dir = path.join(DIST, decodeURIComponent(route));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
};

let written = 0;
const routes = [
  ...Object.values(STATIC_PAGE_PATHS),
  ...CATEGORIES_LIST.map((c) => `/category/${c.key}`),
  ...posts.map((p) => getPostPath(p)),
];

for (const route of routes) {
  const { html, is404 } = render(route);
  if (is404) throw new Error(`[prerender] ${route} 가 404로 렌더링되었습니다.`);
  writeRoute(route, html);
  written++;
}

// 예전 제목 기반 주소(/post/<제목>)는 대표 주소(slug)로 넘겨 준다.
const escapeAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
let legacy = 0;
for (const post of posts) {
  const legacyPath = getLegacyPostPath(post);
  const target = `${PROTOCOL}://${HOST}${getPostPath(post)}`;
  const relTarget = getPostPath(post);
  if (legacyPath === getPostPath(post)) continue;
  writeRoute(
    legacyPath,
    `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${escapeAttr(post.title)}</title>` +
      `<link rel="canonical" href="${escapeAttr(target)}"><meta name="robots" content="noindex, follow">` +
      `<meta http-equiv="refresh" content="0; url=${escapeAttr(relTarget)}"></head>` +
      `<body><a href="${escapeAttr(relTarget)}">${escapeAttr(post.title)}</a></body></html>\n`
  );
  legacy++;
}

// 없는 주소는 진짜 404 응답으로 내보낸다 (Vercel이 dist/404.html 을 404 상태로 서빙).
fs.writeFileSync(path.join(DIST, '404.html'), render('/__not-found__').html, 'utf-8');

// 홈은 마지막에 덮어쓴다 (위에서 템플릿으로 쓰기 때문).
fs.writeFileSync(path.join(DIST, 'index.html'), render('/').html, 'utf-8');

console.log(`[prerender] ${written + 1}개 페이지 생성 (글 ${posts.length}개), 예전 주소 안내 ${legacy}개, 404.html`);
