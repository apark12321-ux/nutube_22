import { GuidePost } from './types';
import { renderSsrPage } from './ssrRenderer';

// 서버(server.ts)와 빌드 시 사전 렌더링(scripts/prerender.mts)이 함께 쓰는 SEO 주입 함수.
// index.html 템플릿에 글별 제목·설명·대표 주소·구조화 데이터와 본문 HTML을 채워 넣는다.
export function injectSsrAndSeoMetadata(
  html: string,
  reqUrl: string,
  host: string,
  protocol: string,
  allPosts: GuidePost[],
  googleSiteVerification?: string
): { html: string; statusCode: number; is404: boolean } {
  const ssr = renderSsrPage(reqUrl, host, protocol, allPosts);
  let result = html;

  if (ssr.is404) {
    // 404 Response: Remove Google AdSense scripts completely to comply with:
    // "게시자 콘텐츠가 없거나 가치가 낮은 화면(알림, 경고, 오류 화면 등)에 광고를 게재할 수 없습니다."
    result = result.replace(/<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>/gi, '');
    result = result.replace(/<meta[^>]*name=["']google-adsense-platform-account["'][^>]*\/?>/gi, '');
    
    // 404 화면에서는 googlebot 등 개별 봇용 index 지시문도 함께 제거한다 (robots noindex 와 충돌 방지).
    result = result.replace(/\s*<meta\s+name=["'](?:googlebot|google-inspection-tool|bingbot)["'][^>]*\/?>/gi, '');

    // Set noindex, nofollow for 404 pages
    if (result.includes('<meta name="robots"')) {
      result = result.replace(/<meta\s+name=["']robots["'][^>]*\/?>/i, '<meta name="robots" content="noindex, nofollow" />');
    } else {
      result = result.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
    }
  } else {
    // Robots tag for full crawlability
    const robotsTag = '<meta name="robots" content="all, index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />';
    if (result.includes('<meta name="robots"')) {
      result = result.replace(/<meta\s+name=["']robots["'][^>]*\/?>/i, robotsTag);
    }
  }

  // Replace Title
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${ssr.title}</title>`);
  
  // Replace Description
  result = result.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="description" content="${ssr.description.replace(/"/g, '&quot;')}" />`);

  // Replace Canonical Link
  result = result.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, `<link rel="canonical" href="${ssr.canonicalUrl}" />`);

  // Inject or update google-site-verification
  const verificationTag = `<meta name="google-site-verification" content="${googleSiteVerification}" />`;
  if (!googleSiteVerification) {
    // 값이 없으면 템플릿의 기존 태그를 그대로 둔다.
  } else if (result.includes('google-site-verification')) {
    result = result.replace(/<meta\s+name=["']google-site-verification["']\s+content=["'][^"']*["']\s*\/?>/i, verificationTag);
  } else {
    result = result.replace('</head>', `  ${verificationTag}\n  </head>`);
  }

  // Replace OpenGraph & Twitter tags
  result = result.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:title" content="${ssr.title.replace(/"/g, '&quot;')}" />`);
  result = result.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:description" content="${ssr.description.replace(/"/g, '&quot;')}" />`);
  result = result.replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:url" content="${ssr.canonicalUrl}" />`);
  result = result.replace(/<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:image" content="${ssr.ogImage}" />`);

  // Inject Schema.org JSON-LD scripts
  if (ssr.jsonLdScripts && ssr.jsonLdScripts.length > 0) {
    const scriptsHtml = ssr.jsonLdScripts.map(script => `  <script type="application/ld+json">${script}</script>`).join('\n');
    result = result.replace('</head>', () => `${scriptsHtml}\n  </head>`);
  }

  // CRITICAL: Pre-render semantic publisher HTML into <div id="root"></div>
  // Ensures Google AdSense crawlers (Mediapartners-Google) and Googlebot immediately find rich publisher text!
  // 본문에 '$' 문자가 있어도 치환 패턴으로 해석되지 않도록 함수형 치환을 쓴다.
  result = result.replace('<div id="root"></div>', () => `<div id="root">${ssr.renderedHtml}</div>`);

  return {
    html: result,
    statusCode: ssr.statusCode,
    is404: ssr.is404
  };
}
