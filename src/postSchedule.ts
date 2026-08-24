import { addPostImages } from './postImages';
import { DAILY_CATEGORIES, ensureMinimumPostLength, makeDailyPost } from './dailyPostFactory';
import { GuidePost } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const FILL_START_UTC = Date.UTC(2026, 4, 1, 1, 0, 0);
// Dynamically calculate the end of today in UTC, ensuring all recent empty dates up to current date are fully populated.
const getTodayEndUTC = () => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59);
};
const FILL_END_UTC = Math.max(Date.UTC(2026, 7, 6, 23, 59, 59), getTodayEndUTC());

const hold = (...parts: string[]) => parts.join('-');
export const REVIEW_HOLD_SLUGS = new Set([
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

export const isPublishedPost = (post: GuidePost) => !REVIEW_HOLD_SLUGS.has(post.slug);

export const postTitleSegment = (title: string) =>
  title
    .trim()
    .replace(/%/g, '퍼센트')
    .replace(/[\/#?]+/g, ' ')
    .replace(/[\[\]@!$&'()*+,;=]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const getPostPath = (post: Pick<GuidePost, 'title'>) => `/post/${postTitleSegment(post.title)}`;

const dateKey = (value: string | Date) => new Date(value).toISOString().slice(0, 10);

const fillMissingDailyCategoryPosts = (posts: GuidePost[]) => {
  const existing = new Set(posts.map((post) => `${post.category}:${dateKey(post.publishedAt)}`));
  const filled = [...posts];

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

export const applyPostDateSchedule = (posts: GuidePost[]): GuidePost[] => {
  const visiblePosts = fillMissingDailyCategoryPosts([...posts].filter(isPublishedPost));

  const TITLE_OPTIMIZATION_MAP: Record<string, string> = {
    // src/data.ts posts
    '쇼츠 RPM 300% 폭발 성장 공식: 롱폼 제휴와 멤버십 연동형 고수익 오토메이션 기법': '유튜브 쇼츠 RPM 상승을 위한 고단가 수익화 전략',
    'ElevenLabs & Midjourney 초고속 시각 스토리텔링: 1시간 만에 4K 숏폼 다큐 제작법': 'AI 도구를 활용한 고품질 숏폼 다큐멘터리 제작법',
    '댓글 점수를 폭등시키는 시니어 팬덤 소통 공역: 시청 지속 시간을 늘리는 감성 댓글 매뉴얼': '유튜브 시니어 채널 활성화를 위한 댓글 소통 전략',
    '구글 서치콘솔 색인 등록 100% 성공 보증서: 동적 URL 매핑과 사이트맵 수동 개조 전략': '구글 서치콘솔 색인 생성 오류 원인과 등록 방법',
    '구글 애드센스 승인 거절 긴급 대응: 100% 재승인받는 5가지 처방전과 E-E-A-T 소명법': '구글 애드센스 승인 거절 원인과 재승인을 위한 해결 방법',
    '알고리즘의 침묵을 깨는 업로드 정석 11단계: 조회수 0을 단기간에 극복하는 실전 인덱싱 매뉴얼': '유튜브 조회수 상승을 위한 SEO 최적화 업로드 가이드',
    '유럽 서정적 자막과 3초 비언어 후킹 프레임: 왕초보가 숏폼 디자인 감각 선점하기': '숏폼 영상의 시청 지속시간을 늘리는 자막 디자인과 연출 기법',
    '애드센스 ‘가치가 별로 없는 콘텐츠’ 거절 100% 극복 및 Ads.txt 매체 완결 보강 처방': '애드센스 가치가 별로 없는 콘텐츠 해결 및 Ads.txt 설정 방법',
    '구글 서치콘솔 ‘가져올 수 없음’ 오류 100% 한방 해결법: sitemap.xml & rss.xml 리디렉션 수리': '구글 서치콘솔 가져올 수 없음 오류 원인과 사이트맵 해결 방법',

    // Static posts with dates/hype
    '2026 유튜브 추천 알고리즘, 무엇이 바뀌었나': '유튜브 추천 알고리즘 최근 변화와 대응 가이드',
    '유튜브 수익화 자격 조건, 2026년 변경된 기준 정리': '유튜브 수익화 자격 조건과 최신 기준 정리',
    '쇼츠 알고리즘, 2026년엔 \'재시청률\'이 핵심입니다': '유튜브 쇼츠 알고리즘 핵심 노출 지표 분석',
    '2026년 2분기, 추천 시스템 가중치가 또 바뀌었다': '유튜브 추천 시스템 가중치 변화와 노출 분석',
    '5월 수익화 점검, 지금 채널이 어디쯤인지 확인하세요': '유튜브 수익화 조건 점검과 채널 성장 지표',
    '시니어 사연 쇼츠 댓글이 증가하는 한 줄, 이 패턴이에요': '시니어 채널 시청자 댓글과 참여율을 늘리는 방법',
    'YouTube Studio 분석, 진짜 봐야 할 지표는 따로 있습니다': '유튜브 스튜디오 핵심 데이터 분석 및 주요 지표',
    '장비, 처음부터 비싼 거 살 필요 없어요': '유튜브 초보자를 위한 가성비 촬영 장비 가이드',
    '꾸준히 올리는 게 왜 그렇게 중요할까요': '유튜브 채널 운영에서 지속적인 업로드가 중요한 이유',
    '시니어 채널 댓글 참여도, 어떻게 올리지?': '시니어 채널 시청자 댓글 유도와 소통 방법'
  };

  const SUBTITLE_OPTIMIZATION_MAP: Record<string, string> = {
    // src/data.ts posts
    '단순 조회수 광고 단가의 한계를 깨부수고 Shorts를 고단가 수익 채널로 변환하는 5차 설계 노하우': '쇼츠 조회수 대비 낮은 광고 단가를 극복하고 수익 채널로 전환하는 방법',
    '기획과 생성 리소스의 공학적 매핑 — 시선을 고정시키는 AI 비주얼과 감정 유발 사운드의 완벽 크로스오버': '미드저니와 일레븐랩스를 결합한 효율적인 영상 기획 및 연출 전략',
    '시청자의 자발적인 참여를 이끌어내고 알고리즘 노출을 극대화하는 실전 답글 작법': '시청자 참여율을 높이고 커뮤니티 활성화를 유도하는 실전 답글 가이드',
    '포털 크롤러를 내 사이트로 무조건 자석처럼 끌어당기는 고유 캐노니컬 태그 설계와 네이버/구글 동시 색인 기각 해소법': '발견됨 또는 크롤링됨 현재 색인 생성되지 않음 원인과 해결책',
    '가치 없는 콘텐츠와 중복 계정 탈락 사슬을 정면 돌파하고 광고 수익 채널 활성화하기': '가치 없는 콘텐츠 해결 및 실전 경험 중심 글쓰기 강화',
    '기획에 쏟는 열정만큼 중요한 업로드 최적화 세팅 — 검색 상위 노출과 고관여 체류시간을 창출하는 핵심 디바이스': '검색 상위 노출과 시청 지속 시간을 확보하는 단계별 체크리스트',
    '산만하고 과한 풀컬러 예능형 자막을 버리고, 시청자 지속시간을 복리로 잠그는 고감도 미니멀 서체 구성안': '미니멀한 자막 배치와 시각적 후킹을 활용한 시청 유지 전략',
    '알고리즘이 분류하는 무가치 필터 우회 공식과 실시간 index.html 경로 봇 접근 승인 프로세스': '애드센스 승인을 위한 콘텐츠 개편 가이드와 Ads.txt 문제 해결',
    '서버-클라우드 포트 대칭 매핑과 2중 XML 통합 규격 개조법으로 구글 크롤러 즉각 소집 가속하기': '검색엔진 크롤링을 정상화하여 수집률을 개선하는 사이트맵 구성',

    // Static posts subtitles
    '노출 결정 요인 5가지와 운영자가 챙길 것': '유튜브 추천 알고리즘의 노출 결정 핵심 5가지 요인',
    '5월 둘째 주 이후 운영자가 체감하는 노출 변화': '최신 추천 가중치 조정에 다른 노출 변화 현상 분석',
    '5월 들어 실제로 댓글 비율 2배로 늘린 마지막 문장 유형': '댓글 참여를 효과적으로 유도하는 끝맺음 멘트 유형',
    '분기 중간 시점, 운영자가 챙겨야 할 7가지 지표': '채널 수익 다각화 및 실무에서 챙겨야 할 필수 지표',
    '3분 확장 이후 바뀐 핵심 신호와 첫 3초 전략': '동영상 길이 연장에 따른 대응 전략과 첫 3초 구성',
    '게시물·설문·이미지로 시청자와 관계를 쌓는 법': '유튜브 커뮤니티 기능을 활용한 소통 강화 전략',
    '영상 끝에서 시청자를 다음 영상으로 자연스럽게': '최종 화면 기능 활용으로 연쇄 시청을 유도하는 법',
    '초보자가 발행 시간을 정하는 현실적인 기준': '채널 분석 데이터를 기반으로 최적 업로드 타임 설정',
    '댓글에 답하는 방식이 채널 분위기를 만든다': '품격 있는 댓글 작법과 고정 팬덤 확대 방법',
    '초보자가 비싼 프로그램 없이 시작하는 썸네일 만들기': '초보자도 쉽게 따라 하는 무료 그래픽 툴 활용법',
    '댓글이 채널 성장에 미치는 영향과 자연스러운 유도법': '댓글 반응이 추천 시스템에 주는 가중치와 유도 노하우',
    '월 정기 수익을 만드는 멤버십 운영 가이드': '정기 후원 수익 모델 구축을 위한 멤버십 기획과 설계',
    '재생목록·종료 화면·카드의 효과를 데이터로 검증한다': '유튜브 세션 시간 및 시청 잔류율 증가를 위한 설계 전략',
    '조회수 너머의 데이터 읽기': '유튜브 스튜디오에서 주목해야 할 주요 핵심 지표 해석',
    'CapCut, Opus Clip, Descript, Vrew 비교': '영상 편집 제작 효율을 올려주는 4대 AI 편집기 전격 비교',
    '스마트폰으로 시작하는 현실 가이드': '값비싼 카메라나 조명 없이 모바일 기기만으로 시작하기',
    '음악이 다르면 같은 사연도 완전 다르게 느껴져요': '영상 분위기와 감동을 배가시키는 분위기별 음원 선정',
    '구독자 규모별 적정 단가와 협상 시 주의사항': '유튜브 채널 규모에 적합한 브랜디드 광고 단가 가이드',
    '검색 최적화 제목과 클릭 유도 제목은 다르다': '검색 엔진 노출 및 사용자 클릭률을 극대화하는 작명법',
    '지속 가능한 제작 워크플로 구축': '시간과 제작 부담을 대폭 경감하는 효율적 배치 제작 흐름',
    '다음 영상 뭐 만들지 막막할 때 도움 되는 도구들': '유튜브 소재 리서치 및 아이디어를 제안하는 생성 도구',
    '초보가 3개월을 못 넘기는 이유': '초기 성장 한계를 돌파하기 위한 주간 업로드 멘탈 관리법',
    '쇼츠만으로 큰 수익을 만들 수 있을까': '쇼츠 펀드 폐지 이후 현실적인 광고 정산 구조 분석',
    '다른 카테고리와 다른 시니어 시청자의 클릭 심리': '시니어 연령대의 시각적 및 정서적 클릭 패턴 이해',
    '예산 없이 시작하는 AI 이미지 활용법': '썸네일 배경 및 일러스트용 무료 AI 이미지 생성 팁',
    '2채널·팀 운영·외주의 판단 기준': '채널 활성화 이후 멀티 채널 운영 및 분업 의사결정',
    '60초 안에 감정을 만드는 구조': '시청자 이탈을 방지하는 숏폼 기둥식 5단계 구성법',
    'YPP 진입 요건과 단계별 수익화 옵션': '유튜브 파트너 프로그램 자격 요건 및 수익 신청 절차',
    '썸네일을 보자마자 거른다고 한 시청자들의 실제 이유': '클릭률 저조 썸네일의 유형 분석과 가독성 강화',
    'ChatGPT, Claude, Gemini, Notion AI - 뭐가 제일 잘 써질까': 'AI 모델별 대본 작성 스타일 및 프롬프트 요령',
    '계정 생성부터 채널아트까지 30분 완성': '시각 디자인 전문가 없이 채널의 첫인상을 설계하는 법',
    '포화된 시니어 사연 시장에서 빈자리를 찾는 법': '독창적인 니치 카테고리 발굴 및 차별화된 컨셉 설정',
    '도입 30초·중간 이탈·종료 부메랑의 세 구간을 분리해서 본다': '이탈률 급락 구간 원인 교정으로 평균 시청 지속 시간 연장',
    '쇼츠 구독자가 롱폼을 안 보는 이유와 그걸 깨는 설계': '숏폼 시청 패턴을 롱폼 시청 시간으로 유도하는 연계 장치',
    '한국어 TTS 6개 실제 들어본 후기': '시니어 오디오 감성에 부합하는 자연스러운 목소리 가이드',
    '수익 구조를 이해해야 채널 운영 방향이 보입니다': '채널 수익원 창출 지표 분석 및 활용 가이드',
    '백지 앞에서 멈추지 않는 4-block 구조': '원고 작성 시간 단축을 위한 뼈대형 4단 블록 스토리텔링',
    '초보가 자주 빠뜨리는 7가지': '첫 동영상 공개 업로드 전 반드시 확인해야 할 오류 점검',
    '유튜브 시작 단계에서 가장 중요한 결정': '채널의 지속 가능성과 수익 모델에 적합한 주제 선별',
    'Midjourney, DALL-E, Canva AI, Adobe Firefly 비교': '영상 기획 및 디자인 스타일에 잘 맞는 썸네일 도구 추천'
  };

  const removeDatesAndClean = (text: string): string => {
    if (!text) return '';
    return text
      // Replace specific date-dependent sentences or patterns
      .replace(/(?:오늘|금일)\s*자?\s*\(\s*\d{4}년\s*\d{1,2}월\s*\d{1,2}일\s*\)/g, '최근')
      .replace(/(?:오늘|금일)\s*\(\s*\d{4}년\s*\d{1,2}월\s*\d{1,2}일\s*\)/g, '최근')
      .replace(/\b\d{4}년\s*\d{1,2}월\s*\d{1,2}일\s*기준/g, '최근 기준')
      .replace(/\b\d{4}년\s*\d{1,2}월\s*\d{1,2}일/g, '')
      .replace(/\b2026년\s*2분기,?/g, '최근')
      .replace(/\b2026년\s*/g, '최근 ')
      .replace(/\b2026\s*/g, '최근 ')
      .replace(/\b2025년\s*말\s*/g, '최근 ')
      .replace(/\b2025년\s*/g, '최근 ')
      .replace(/\b5월\s*둘째\s*주\s*이후/g, '최근')
      .replace(/\b5월\s*들어/g, '최근')
      .replace(/\b5월\s*수익화/g, '수익화')
      .replace(/\b5월\s*기준/g, '최근 기준')
      .replace(/\b6월\s*기준/g, '최근 기준')
      .replace(/오늘\s*\(2026년\s*6월\s*19일\)/g, '최근')
      .replace(/금일\s*\(2026년\s*6월\s*18일\)/g, '최근')
      .replace(/오늘\s*\(2026년\s*6월\s*17일\)/g, '최근')
      .replace(/오늘\s*\(2026년\s*6월\s*14일\)/g, '최근')
      .trim();
  };

  const optimizePost = (post: GuidePost): GuidePost => {
    let title = post.title;
    let subtitle = post.subtitle;

    const cleanTitle = post.title.trim();
    if (TITLE_OPTIMIZATION_MAP[cleanTitle]) {
      title = TITLE_OPTIMIZATION_MAP[cleanTitle];
    } else {
      title = removeDatesAndClean(title);
    }

    const cleanSubtitle = post.subtitle.trim();
    if (SUBTITLE_OPTIMIZATION_MAP[cleanSubtitle]) {
      subtitle = SUBTITLE_OPTIMIZATION_MAP[cleanSubtitle];
    } else {
      subtitle = removeDatesAndClean(subtitle);
    }

    const content = removeDatesAndClean(post.content);
    const summary = post.summary ? removeDatesAndClean(post.summary) : undefined;

    const tags = post.tags
      ? post.tags
          .map(tag => removeDatesAndClean(tag).replace(/\s+/g, ''))
          .filter(tag => tag && tag !== '최근')
      : undefined;

    return {
      ...post,
      title,
      subtitle,
      summary,
      content,
      tags
    };
  };

  const nowMs = Date.now();
  const nowIsoDate = new Date().toISOString().slice(0, 10);

  const processedPosts = visiblePosts
    .map((post): GuidePost => {
      let mappedCategory = post.category;
      let mappedLevel = post.level || 'intermediate';
      let mappedCategoryLabel = post.categoryLabel;

      const oldCat = post.category as string;
      if (oldCat === 'beginner') {
        mappedCategory = 'youtube';
        mappedLevel = 'beginner';
        mappedCategoryLabel = '유튜브 수익화';
      } else if (oldCat === 'algorithm') {
        mappedCategory = 'youtube';
        mappedLevel = 'intermediate';
        mappedCategoryLabel = '유튜브 수익화';
      } else if (oldCat === 'monetization') {
        mappedCategory = 'youtube';
        mappedLevel = 'advanced';
        mappedCategoryLabel = '유튜브 수익화';
      } else if (oldCat === 'senior') {
        mappedCategory = 'youtube';
        mappedLevel = 'beginner';
        mappedCategoryLabel = '유튜브 수익화';
      } else if (oldCat === 'advanced') {
        mappedCategory = 'youtube';
        mappedLevel = 'advanced';
        mappedCategoryLabel = '유튜브 수익화';
      }

      return {
        ...post,
        category: mappedCategory,
        categoryLabel: mappedCategoryLabel,
        level: mappedLevel
      };
    })
    .map(ensureMinimumPostLength)
    .map(optimizePost)
    .map((post) => addPostImages(post));

  // Identify posts scheduled for today
  const todaysPosts = processedPosts.filter(p => new Date(p.publishedAt).toISOString().slice(0, 10) === nowIsoDate);
  const hasPublishedToday = todaysPosts.some(p => new Date(p.publishedAt).getTime() <= nowMs);

  return processedPosts
    .filter((post) => {
      const pubMs = new Date(post.publishedAt).getTime();
      if (pubMs <= nowMs) return true;

      // Guarantee at least 1 post is published for today even early in the morning before scheduled upload time
      if (!hasPublishedToday && todaysPosts.length > 0) {
        const earliestToday = [...todaysPosts].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())[0];
        if (post.slug === earliestToday.slug) return true;
      }

      return false;
    })
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
};
