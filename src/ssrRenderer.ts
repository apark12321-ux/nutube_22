import { GuidePost, CategorySpec } from './types';
import { CATEGORY_SPECS, CATEGORIES_LIST } from './data';
import { PAGE_CONTENT, StaticPageData, StaticPageKey, STATIC_PAGE_PATHS, STATIC_PAGE_LABELS, CONTACT_EMAIL } from './data/pages';
import { getPostPath, postTitleSegment } from './postSchedule';
import { formatPostDate } from './utils/dateFormatter';

export interface SsrRenderResult {
  statusCode: number;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  jsonLdScripts: string[];
  renderedHtml: string;
  is404: boolean;
}

// Markdown to Semantic HTML converter
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInlineMarkdown(text: string): string {
  if (!text) return '';
  let formatted = escapeHtml(text);

  // Bold
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  
  // Inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-purple-700 rounded border border-slate-200">$1</code>');

  // Links [text](url)
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) =>
    href.startsWith('/')
      ? `<a href="${href}" class="text-blue-600 underline hover:text-blue-800">${label}</a>`
      : `<a href="${href}" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">${label}</a>`);

  return formatted;
}

function parseMarkdownToHtml(content: string): string {
  if (!content) return '';

  const lines = content.split('\n');
  const htmlParts: string[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';

  const flushTable = () => {
    if (!inTable) return;
    let tHtml = '<div class="my-6 overflow-x-auto"><table class="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-lg overflow-hidden">';
    if (tableHeaders.length > 0) {
      tHtml += '<thead class="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200"><tr>';
      tableHeaders.forEach(th => {
        tHtml += `<th class="p-3 text-xs sm:text-sm font-bold text-slate-900">${formatInlineMarkdown(th)}</th>`;
      });
      tHtml += '</tr></thead>';
    }
    if (tableRows.length > 0) {
      tHtml += '<tbody class="divide-y divide-slate-100 bg-white">';
      tableRows.forEach(row => {
        tHtml += '<tr class="hover:bg-slate-50/80 transition-colors">';
        row.forEach(cell => {
          tHtml += `<td class="p-3 text-xs sm:text-sm text-slate-700 leading-relaxed">${formatInlineMarkdown(cell)}</td>`;
        });
        tHtml += '</tr>';
      });
      tHtml += '</tbody>';
    }
    tHtml += '</table></div>';
    htmlParts.push(tHtml);
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  };

  const flushList = () => {
    if (!inList) return;
    htmlParts.push(`</${listType}>`);
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushTable();
      flushList();
      continue;
    }

    // Dividers
    if (line === '---' || line === '***') {
      flushTable();
      flushList();
      htmlParts.push('<hr class="my-8 border-t border-slate-200" />');
      continue;
    }

    // Table Row
    if (line.startsWith('|') && line.includes('|')) {
      flushList();
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check if divider line
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        // Divider row, skip
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // H2 Headings
    if (line.startsWith('## ')) {
      flushList();
      const headingText = line.replace('## ', '').trim();
      const id = `sec-${i}`;
      
      htmlParts.push(`<h2 id="${id}" class="mt-8 mb-4 text-lg sm:text-xl font-black text-slate-900 pb-2 border-b border-slate-100">${formatInlineMarkdown(headingText)}</h2>`);
      continue;
    }

    // H3 Headings
    if (line.startsWith('### ')) {
      flushList();
      const headingText = line.replace('### ', '').trim();
      const id = `subsec-${i}`;
      htmlParts.push(`<h3 id="${id}" class="mt-6 mb-3 text-base sm:text-lg font-bold text-slate-800">${formatInlineMarkdown(headingText)}</h3>`);
      continue;
    }

    // Unordered List
    if (/^[-*]\s+/.test(line)) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
        htmlParts.push('<ul class="my-4 space-y-2 text-xs sm:text-sm text-slate-700 pl-4 list-disc">');
      }
      const itemText = line.replace(/^[-*]\s+/, '').trim();
      htmlParts.push(`<li class="leading-relaxed">${formatInlineMarkdown(itemText)}</li>`);
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line)) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
        htmlParts.push('<ol class="my-4 space-y-2 text-xs sm:text-sm text-slate-700 pl-4 list-decimal">');
      }
      const itemText = line.replace(/^\d+\.\s+/, '').trim();
      htmlParts.push(`<li class="leading-relaxed">${formatInlineMarkdown(itemText)}</li>`);
      continue;
    }

    // Normal Paragraph / Callout Block
    flushList();

    if (false) {
    } else if (line.startsWith('&gt;') || line.startsWith('>')) {
      const quoteText = line.replace(/^[&gt;>]+\s*/, '').trim();
      htmlParts.push(`<blockquote class="my-4 pl-4 py-2 border-l-4 border-purple-600 bg-slate-50 italic text-xs sm:text-sm text-slate-700">${formatInlineMarkdown(quoteText)}</blockquote>`);
    } else {
      htmlParts.push(`<p class="my-3 text-xs sm:text-sm sm:leading-relaxed text-slate-700 font-normal leading-6">${formatInlineMarkdown(line)}</p>`);
    }
  }

  flushTable();
  flushList();

  return htmlParts.join('\n');
}

// Navigation Bar HTML
function renderHeader(currentTab: string, currentCategory: string | null): string {
  const navLink = (href: string, label: string, active: boolean) =>
    `<a href="${href}" class="px-3 py-2 rounded-lg transition-colors ${active ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900'}">${label}</a>`;
  return `
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="/" class="flex items-center gap-2.5 focus:outline-none" aria-label="너튜브 홈으로 이동">
          <img src="/nutube-brand-light.svg" alt="너튜브 - 50대 박프로의 유튜브 도전기" class="h-8 w-auto object-contain" />
        </a>

        <nav class="hidden md:flex items-center gap-1 text-xs sm:text-sm font-semibold" aria-label="주요 메뉴">
          ${navLink('/', '처음부터 보기', !currentCategory && currentTab === 'guides')}
          ${CATEGORIES_LIST.map((c) => navLink(`/category/${c.key}`, `${c.stepNumber}단계 ${escapeHtml(c.shortLabel || c.label)}`, currentCategory === c.key)).join('')}
          ${navLink('/about', '박프로 소개', currentTab === 'about')}
        </nav>
      </div>
      <nav class="md:hidden flex gap-1 overflow-x-auto px-4 pb-2 text-xs font-semibold" aria-label="단계 메뉴">
        ${CATEGORIES_LIST.map((c) => navLink(`/category/${c.key}`, `${c.stepNumber}단계 ${escapeHtml(c.shortLabel || c.label)}`, currentCategory === c.key)).join('')}
      </nav>
    </header>
  `;
}

// Sidebar HTML
function renderSidebar(allPosts: GuidePost[], currentCategory: string | null): string {
  const popularPosts = allPosts.slice(0, 5);

  return `
    <aside class="w-full lg:w-80 shrink-0 space-y-6">
      <!-- 1. Profile Widget -->
      <div class="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
            박프로
          </div>
          <div>
            <span class="text-sm font-bold text-slate-900">박프로</span>
            <p class="text-xs text-slate-500">50대 유튜버 · 너튜브 운영자</p>
          </div>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          쉰을 넘겨 유튜브를 처음 시작했습니다. 왕초보 시절부터 수익 창출까지 제가 겪은 순서대로, 어려운 말 빼고 적고 있습니다.
        </p>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <a href="/about" class="text-blue-600 font-bold hover:underline">박프로 소개 &rarr;</a>
          <a href="/contact" class="text-slate-500 hover:underline">문의하기</a>
        </div>
      </div>

      <!-- 2. Categories Widget -->
      <div class="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b border-slate-100">
          단계별로 읽기
        </h3>
        <ul class="space-y-1 text-xs">
          ${CATEGORIES_LIST.map(cat => {
            const count = allPosts.filter(p => p.category === cat.key).length;
            const isSelected = currentCategory === cat.key;
            return `
              <li>
                <a href="/category/${cat.key}" class="flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}">
                  <span>${escapeHtml(cat.label)}</span>
                  <span class="text-[11px] font-mono font-bold text-slate-400">(${count})</span>
                </a>
              </li>
            `;
          }).join('')}
        </ul>
      </div>

      <!-- 3. Popular Posts Widget -->
      <div class="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b border-slate-100">
          처음이라면 이 순서로
        </h3>
        <div class="space-y-3">
          ${popularPosts.map((post, idx) => `
            <a href="${getPostPath(post)}" class="block group">
              <div class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded bg-slate-100 text-slate-600 text-xs font-bold font-mono flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  ${idx + 1}
                </span>
                <div class="min-w-0">
                  <h4 class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    ${escapeHtml(post.title)}
                  </h4>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </aside>
  `;
}

// Footer HTML
function renderFooter(): string {
  const keys: StaticPageKey[] = ['about', 'contact', 'policy', 'privacy', 'terms'];
  return `
    <footer class="mt-auto border-t border-slate-200 bg-white text-slate-500 py-10 text-xs">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <a href="/" class="block mb-1.5 focus:outline-none" aria-label="너튜브 홈으로 이동">
              <img src="/nutube-brand-light.svg" alt="너튜브" class="h-8 w-auto object-contain" />
            </a>
            <p class="text-[11px] text-slate-400">50대 박프로의 유튜브 도전기 · 왕초보부터 수익 창출, 고수의 영역까지</p>
          </div>
          <nav class="flex flex-wrap items-center justify-center gap-4 text-xs font-medium" aria-label="사이트 안내">
            ${keys.map((k) => `<a href="${STATIC_PAGE_PATHS[k]}" class="hover:text-blue-600 transition-colors">${STATIC_PAGE_LABELS[k]}</a>`).join('')}
          </nav>
        </div>
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-400">
          <p>© 2026 너튜브 · 운영 박프로</p>
          <p>문의 ${CONTACT_EMAIL}</p>
        </div>
      </div>
    </footer>
  `;
}

// 글 목록 한 줄
function renderPostRow(post: GuidePost): string {
  return `
    <article class="p-5 hover:bg-slate-50/80 transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span class="font-bold text-blue-600">${post.stepNumber}단계 ${escapeHtml(post.categoryLabel)}${post.order ? ` · ${post.order}편` : ''}</span>
          </div>
          <h2 class="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
            <a href="${getPostPath(post)}">${escapeHtml(post.title)}</a>
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            ${escapeHtml(post.summary || post.subtitle || '')}
          </p>
        </div>
        ${post.thumbnail && post.thumbnail.src ? `
          <a href="${getPostPath(post)}" class="w-full sm:w-36 h-24 rounded-lg overflow-hidden shrink-0 block bg-slate-100" tabindex="-1" aria-hidden="true">
            <img src="${post.thumbnail.src}" alt="" class="w-full h-full object-cover" loading="lazy" />
          </a>
        ` : ''}
      </div>
    </article>
  `;
}

// Main SSR Renderer Entry Point
export function renderSsrPage(
  reqUrl: string,
  host: string,
  protocol: string,
  allPosts: GuidePost[]
): SsrRenderResult {
  const baseUrl = `${protocol}://${host}`;
  const cleanPath = reqUrl.split('?')[0].replace(/\/+$/, '') || '/';

  // 1. Check for Static Pages (About, Terms, Privacy)
  const staticKey = (Object.keys(STATIC_PAGE_PATHS) as StaticPageKey[]).find((k) => STATIC_PAGE_PATHS[k] === cleanPath);
  if (staticKey) {
    const tabKey = staticKey;
    const pageData = PAGE_CONTENT[tabKey];
    const canonicalUrl = `${baseUrl}${cleanPath}`;
    const title = `${pageData.title} | 너튜브`;
    const description = pageData.intro.slice(0, 160);

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageData.title,
      description: description,
      url: canonicalUrl,
      publisher: {
        '@type': 'Organization',
        name: '너튜브',
        url: baseUrl
      }
    });

    const bodyContent = `
      <div class="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans">
        ${renderHeader(tabKey, null)}
        <main class="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            <article class="flex-1 min-w-0 w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs">
              <span class="text-xs font-semibold text-blue-600">최종 수정일: ${escapeHtml(pageData.updated)}</span>
              <h1 class="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">${escapeHtml(pageData.title)}</h1>
              <p class="mt-3 text-sm text-slate-600 leading-relaxed">${escapeHtml(pageData.intro)}</p>

              <div class="mt-8 space-y-6">
                ${pageData.sections.map(sec => `
                  <section class="p-5 rounded-lg border border-slate-100 bg-slate-50/70">
                    <h2 class="text-base font-bold text-slate-900 mb-3">${escapeHtml(sec.heading)}</h2>
                    ${sec.body ? sec.body.map(p => `<p class="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2">${escapeHtml(p)}</p>`).join('') : ''}
                    ${sec.items ? `<ul class="space-y-1.5 text-xs sm:text-sm text-slate-700 pl-4 list-disc">${sec.items.map(it => `<li>${escapeHtml(it)}</li>`).join('')}</ul>` : ''}
                  </section>
                `).join('')}
              </div>
            </article>
            ${renderSidebar(allPosts, null)}
          </div>
        </main>
        ${renderFooter()}
      </div>
    `;

    return {
      statusCode: 200,
      title,
      description,
      canonicalUrl,
      ogImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      jsonLdScripts: [jsonLd],
      renderedHtml: bodyContent,
      is404: false
    };
  }

  // 2. Check for Category Pages
  if (cleanPath.startsWith('/category/')) {
    const catKey = decodeURIComponent(cleanPath.replace('/category/', ''));
    const spec = CATEGORY_SPECS[catKey];

    if (!spec) {
      return render404Page(baseUrl, cleanPath, allPosts);
    }

    const filteredPosts = allPosts.filter(p => p.category === catKey);
    const canonicalUrl = `${baseUrl}/category/${catKey}`;
    const title = `${spec.label} (${filteredPosts.length}편) | 너튜브`;
    const description = spec.description.slice(0, 160);

    const bodyContent = `
      <div class="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans">
        ${renderHeader('guides', catKey)}
        <main class="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            <div class="flex-1 min-w-0 w-full">
              <!-- Category Header -->
              <div class="p-6 rounded-xl border border-slate-200 bg-white mb-6 shadow-2xs">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2.5 py-1 text-xs font-bold rounded bg-blue-100 text-blue-700">${spec.stepNumber}단계</span>
                  <h1 class="text-xl sm:text-2xl font-black text-slate-900">${escapeHtml(spec.label)}</h1>
                  <span class="text-xs font-mono font-bold text-blue-600">(${filteredPosts.length}편)</span>
                </div>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${escapeHtml(spec.description)}</p>
              </div>

              <!-- Post List Feed -->
              <div class="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-2xs overflow-hidden">
                ${filteredPosts.map((post) => renderPostRow(post)).join('')}
              </div>
            </div>
            ${renderSidebar(allPosts, catKey)}
          </div>
        </main>
        ${renderFooter()}
      </div>
    `;

    return {
      statusCode: 200,
      title,
      description,
      canonicalUrl,
      ogImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      jsonLdScripts: [],
      renderedHtml: bodyContent,
      is404: false
    };
  }

  // 3. Check for Post Detail Pages (/post/... or legacy /guide/...)
  if (cleanPath.startsWith('/post/') || cleanPath.startsWith('/guide/')) {
    let matchedPost: GuidePost | null = null;

    if (cleanPath.startsWith('/post/')) {
      const segment = cleanPath.replace('/post/', '');
      const decodedSegment = decodeURIComponent(segment);
      matchedPost = allPosts.find(p => p.slug === decodedSegment) || allPosts.find(p => 
        postTitleSegment(p.title) === decodedSegment || 
        p.title === decodedSegment || 
        p.title === decodedSegment.replace(/-/g, ' ')
      ) || null;
    } else if (cleanPath.startsWith('/guide/')) {
      const slug = cleanPath.replace('/guide/', '');
      const decodedSlug = decodeURIComponent(slug);
      matchedPost = allPosts.find(p => p.slug === decodedSlug) || null;
    }

    if (!matchedPost) {
      return render404Page(baseUrl, cleanPath, allPosts);
    }

    const post = matchedPost;
    const postUrl = `${baseUrl}${getPostPath(post)}`;
    const title = `${post.title} | 너튜브`;
    const description = (post.summary || post.subtitle || post.title).slice(0, 160);
    const ogImage = post.thumbnail?.src || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80';

    const publishedIso = new Date(post.publishedAt || '2026-06-18T12:00:00Z').toISOString();
    const updatedIso = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedIso;

    // Schema.org BlogPosting
    const blogPostingLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl
      },
      headline: post.title,
      alternativeHeadline: post.subtitle,
      description: description,
      image: [ogImage],
      datePublished: publishedIso,
      dateModified: updatedIso,
      inLanguage: 'ko-KR',
      author: {
        '@type': 'Person',
        name: '박프로',
        url: `${baseUrl}/about`
      },
      publisher: {
        '@type': 'Organization',
        name: '너튜브',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/nutube-brand-light.svg`
        }
      },
      articleSection: post.categoryLabel,
      keywords: (post.tags || []).join(', ')
    };

    // Schema.org BreadcrumbList
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: baseUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: post.categoryLabel,
          item: `${baseUrl}/category/${post.category}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: postUrl
        }
      ]
    };

    const jsonLdScripts = [JSON.stringify(blogPostingLd), JSON.stringify(breadcrumbLd)];

    // Schema.org FAQPage if FAQs exist
    if (post.faqList && post.faqList.length > 0) {
      const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqList.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };
      jsonLdScripts.push(JSON.stringify(faqLd));
    }

    const parsedContentHtml = parseMarkdownToHtml(post.content);

    // Related posts in same category
    const idx = allPosts.findIndex((p) => p.slug === post.slug);
    const prevPost = idx > 0 ? allPosts[idx - 1] : null;
    const nextPost = idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : null;
    const relatedPosts = allPosts
      .filter((p) => p.category === post.category && p.slug !== post.slug && p.slug !== prevPost?.slug && p.slug !== nextPost?.slug)
      .slice(0, 3);

    const bodyContent = `
      <div class="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans">
        ${renderHeader('guides', post.category)}
        <main class="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            
            <!-- Primary Article Body (Publisher Content) -->
            <article role="main" class="flex-1 min-w-0 w-full rounded-xl border border-slate-200 bg-white p-6 sm:p-10 shadow-2xs">
              
              <!-- Breadcrumb -->
              <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs text-slate-400 mb-4 flex-wrap">
                <a href="/" class="hover:text-blue-600">홈</a>
                <span>&gt;</span>
                <a href="/category/${post.category}" class="text-blue-600 font-bold hover:underline">${escapeHtml(post.categoryLabel)}</a>
                <span>&gt;</span>
                <span class="text-slate-600 truncate max-w-xs">${escapeHtml(post.title)}</span>
              </nav>

              <!-- Category Badge -->
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mb-3">
                <span>${escapeHtml(post.categoryLabel)}</span>
              </div>

              <!-- Main Heading H1 -->
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                ${escapeHtml(post.title)}
              </h1>

              <!-- Subtitle -->
              ${post.subtitle ? `
                <p class="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  ${escapeHtml(post.subtitle)}
                </p>
              ` : ''}

              <!-- Author & Date -->
              <div class="mt-6 pt-4 pb-6 border-y border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">박프로</div>
                  <div>
                    <a href="/about" class="font-bold text-slate-900 hover:underline">박프로</a>
                    <div class="text-[11px] text-slate-400">50대 유튜버 · 너튜브 운영자</div>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span>발행 ${formatPostDate(post.publishedAt)}</span>
                  ${post.updatedAt && post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10) ? `<span>수정 ${formatPostDate(post.updatedAt)}</span>` : ''}
                </div>
              </div>

              ${post.quickAnswer && post.quickAnswer.summary?.length ? `
                <section class="mt-6 p-5 rounded-xl border border-amber-200 bg-amber-50/60" aria-label="이 글 요약">
                  <h2 class="text-sm font-black text-amber-900 mb-2">먼저 이것만 기억하세요</h2>
                  <ul class="space-y-1.5 text-xs sm:text-sm text-slate-800 pl-4 list-disc">
                    ${post.quickAnswer.summary.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
                  </ul>
                </section>
              ` : ''}

              <!-- Featured Image -->
              ${post.thumbnail && post.thumbnail.src ? `
                <figure class="my-8 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src="${post.thumbnail.src}" alt="${escapeHtml(post.thumbnail.alt || post.title)}" class="w-full aspect-16/10 object-cover" />
                  ${post.thumbnail.caption ? `<figcaption class="p-2.5 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-100">${escapeHtml(post.thumbnail.caption)}</figcaption>` : ''}
                </figure>
              ` : ''}

              <!-- Article Content -->
              <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed my-6">
                ${parsedContentHtml}
              </div>

              <!-- FAQ Section (if available) -->
              ${post.faqList && post.faqList.length > 0 ? `
                <section class="mt-10 pt-8 border-t border-slate-200">
                  <h3 class="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <span class="w-2 h-5 bg-blue-600 rounded-xs"></span>
                    자주 묻는 질문
                  </h3>
                  <div class="space-y-4">
                    ${post.faqList.map(faq => `
                      <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                        <h4 class="text-sm font-bold text-slate-900 flex items-start gap-2">
                          <span class="text-blue-600 font-extrabold shrink-0">Q.</span>
                          <span>${escapeHtml(faq.question)}</span>
                        </h4>
                        <p class="mt-2 text-xs sm:text-sm text-slate-700 pl-5 leading-relaxed">
                          ${escapeHtml(faq.answer)}
                        </p>
                      </div>
                    `).join('')}
                  </div>
                </section>
              ` : ''}

              ${post.authorityUrl ? `
                <p class="mt-8 text-xs text-slate-500">
                  참고한 공식 안내: <a href="${escapeHtml(post.authorityUrl)}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${escapeHtml(post.authorityLabel || post.authorityUrl)}</a>
                  · 규정은 바뀔 수 있으니 최신 내용은 공식 안내에서 확인하세요.
                </p>
              ` : ''}

              <!-- Prev / Next in the roadmap -->
              <nav class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="이전 글, 다음 글">
                ${prevPost ? `
                  <a href="${getPostPath(prevPost)}" class="p-4 rounded-lg border border-slate-200 hover:border-blue-400 block">
                    <span class="text-[11px] text-slate-400">&larr; 이전 글 · ${prevPost.stepNumber}단계</span>
                    <span class="block text-xs font-bold text-slate-800 mt-1 leading-snug">${escapeHtml(prevPost.title)}</span>
                  </a>` : '<span></span>'}
                ${nextPost ? `
                  <a href="${getPostPath(nextPost)}" class="p-4 rounded-lg border border-slate-200 hover:border-blue-400 block sm:text-right">
                    <span class="text-[11px] text-slate-400">다음 글 · ${nextPost.stepNumber}단계 &rarr;</span>
                    <span class="block text-xs font-bold text-slate-800 mt-1 leading-snug">${escapeHtml(nextPost.title)}</span>
                  </a>` : ''}
              </nav>

              <!-- Author box -->
              <div class="mt-10 p-6 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs shrink-0">박프로</div>
                <div class="flex-1 text-center sm:text-left">
                  <span class="font-black text-slate-900 text-sm">글쓴이 박프로</span>
                  <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    쉰을 넘겨 유튜브를 왕초보로 시작해 수익 창출까지 해 본 50대입니다. 제가 겪은 순서대로, 쉬운 말로 적습니다. 틀린 내용이나 궁금한 점은 <a href="/contact" class="text-blue-600 underline">문의하기</a>로 알려 주세요.
                  </p>
                </div>
              </div>

              ${relatedPosts.length > 0 ? `
                <div class="mt-10 pt-8 border-t border-slate-200">
                  <h3 class="text-base font-bold text-slate-900 mb-4">${escapeHtml(post.categoryLabel)} 단계의 다른 글</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    ${relatedPosts.map((rel) => `
                      <a href="${getPostPath(rel)}" class="p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-400 block group">
                        <span class="text-[11px] text-slate-400">${rel.stepNumber}단계 · ${rel.order ?? ''}편</span>
                        <h4 class="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 mt-1 leading-snug">${escapeHtml(rel.title)}</h4>
                      </a>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

            </article>

            <!-- Sidebar -->
            ${renderSidebar(allPosts, post.category)}

          </div>
        </main>
        ${renderFooter()}
      </div>
    `;

    return {
      statusCode: 200,
      title,
      description,
      canonicalUrl: postUrl,
      ogImage,
      jsonLdScripts,
      renderedHtml: bodyContent,
      is404: false
    };
  }

  // 4. Home Page (/)
  if (cleanPath === '/' || cleanPath === '') {
    const canonicalUrl = `${baseUrl}/`;
    const title = '너튜브 | 50대 박프로의 유튜브 도전기';
    const description = '쉰 넘어 유튜브를 시작한 박프로가 왕초보 첫걸음부터 채널 키우기, 수익 창출, 고수의 영역까지 겪은 순서대로 쉬운 말로 정리한 블로그입니다.';

    const bodyContent = `
      <div class="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans">
        ${renderHeader('guides', null)}
        <main class="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            <div class="flex-1 min-w-0 w-full">
              <div class="p-6 sm:p-8 rounded-xl border border-slate-200 bg-white mb-6 shadow-2xs">
                <span class="px-2.5 py-1 text-xs font-bold rounded bg-blue-100 text-blue-700">50대 박프로의 유튜브 도전기</span>
                <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight leading-snug">
                  쉰 넘어 시작한 유튜브,<br class="hidden sm:block" /> 왕초보부터 수익 창출까지 걸어온 순서
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  영상 편집은 해 본 적도 없던 50대가 스마트폰 하나로 유튜브를 시작했습니다. 채널 만들기부터 첫 영상, 구독자 모으기, 수익 창출 신청과 정산, 세금, 그리고 오래 가는 채널 운영까지 제가 겪은 순서대로 쉬운 말로 적었습니다.
                  처음이시라면 1단계 첫 글부터 차례로 읽어 보세요.
                </p>
                ${allPosts[0] ? `<a href="${getPostPath(allPosts[0])}" class="inline-block mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700">1단계 첫 글부터 읽기 &rarr;</a>` : ''}
              </div>

              ${CATEGORIES_LIST.map((c) => {
                const stagePosts = allPosts.filter((p) => p.category === c.key);
                return `
                  <section class="mb-8" aria-labelledby="stage-${c.key}">
                    <div class="flex items-end justify-between gap-3 mb-3">
                      <div>
                        <h2 id="stage-${c.key}" class="text-lg sm:text-xl font-black text-slate-900">${escapeHtml(c.label)}</h2>
                        <p class="text-xs text-slate-500 mt-1 leading-relaxed">${escapeHtml(c.description)}</p>
                      </div>
                      <a href="/category/${c.key}" class="text-xs font-bold text-blue-600 hover:underline shrink-0">${stagePosts.length}편 모두 보기</a>
                    </div>
                    <ol class="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-2xs overflow-hidden">
                      ${stagePosts.map((post) => `
                        <li class="px-5 py-3.5 hover:bg-slate-50/80">
                          <a href="${getPostPath(post)}" class="flex items-start gap-3 group">
                            <span class="w-6 h-6 rounded bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white">${post.order ?? ''}</span>
                            <span class="min-w-0">
                              <span class="block text-sm font-bold text-slate-900 group-hover:text-blue-600 leading-snug">${escapeHtml(post.title)}</span>
                              <span class="block text-xs text-slate-500 mt-0.5 line-clamp-1">${escapeHtml(post.subtitle || '')}</span>
                            </span>
                          </a>
                        </li>
                      `).join('')}
                    </ol>
                  </section>
                `;
              }).join('')}
            </div>
            ${renderSidebar(allPosts, null)}
          </div>
        </main>
        ${renderFooter()}
      </div>
    `;

    return {
      statusCode: 200,
      title,
      description,
      canonicalUrl,
      ogImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      jsonLdScripts: [],
      renderedHtml: bodyContent,
      is404: false
    };
  }

  // Fallback to 404
  return render404Page(baseUrl, cleanPath, allPosts);
}

// 404 Error Page Handler (Zero Ads, Noindex, Strict 404 Status)
function render404Page(baseUrl: string, cleanPath: string, allPosts: GuidePost[]): SsrRenderResult {
  const bodyContent = `
    <div class="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans">
      ${renderHeader('guides', null)}
      <main class="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
        <div class="p-8 sm:p-12 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-xl mx-auto mb-4">
            404
          </div>
          <h1 class="text-2xl font-black text-slate-900 mb-2">요청하신 페이지를 찾을 수 없습니다</h1>
          <p class="text-xs sm:text-sm text-slate-600 mb-6">
            존재하지 않거나 주소가 변경된 페이지입니다.<br/>
            아래 단계별 목록에서 원하는 글을 찾아보세요.
          </p>

          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <a href="/" class="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              너튜브 홈으로 이동
            </a>
            ${CATEGORIES_LIST.map((c) => `<a href="/category/${c.key}" class="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">${escapeHtml(c.label)}</a>`).join('')}
          </div>

          <div class="pt-6 border-t border-slate-100 text-xs text-slate-400">
            찾으시는 내용이 없으면 <a href="/contact" class="text-blue-600 underline">문의하기</a>로 알려 주세요.
          </div>
        </div>
      </main>
      ${renderFooter()}
    </div>
  `;

  return {
    statusCode: 404,
    title: '페이지를 찾을 수 없습니다 (404) | 너튜브',
    description: '요청하신 페이지를 찾을 수 없습니다. 너튜브 홈 또는 카테고리 목록을 확인해 주세요.',
    canonicalUrl: `${baseUrl}/404`,
    ogImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    jsonLdScripts: [],
    renderedHtml: bodyContent,
    is404: true
  };
}
