import { CategoryKey, GuidePost, PostImage } from './types';

type ImagePool = {
  thumbnails: PostImage[];
  body: PostImage[];
};

export const DEFAULT_REMOTE_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';

const imagePools: Record<CategoryKey, ImagePool> = {
  beginner: {
    thumbnails: [
      {
        src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        alt: '노트북과 메모장을 활용해 유튜브 채널 기획을 정리하는 작업 환경',
        caption: '채널 시작 단계에서는 주제와 시청자층을 먼저 정리하는 것이 좋습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        alt: '콘텐츠 기획과 업로드 일정을 정리하는 작업 공간',
        caption: '처음에는 지속 가능한 업로드 흐름을 만드는 것이 중요합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        alt: '체크리스트를 보며 유튜브 채널 준비를 점검하는 모습',
        caption: '첫 업로드 전에는 제목, 썸네일, 설명란, 채널 소개를 함께 점검하세요.',
      },
    ],
    body: [
      {
        src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        alt: '유튜브 콘텐츠 기획 노트를 정리하는 장면',
        caption: '처음에는 영상 아이디어보다 채널 방향을 먼저 정리하는 것이 좋습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1494173853739-c21f58b16055?auto=format&fit=crop&w=1200&q=80',
        alt: '업로드 전 체크리스트를 보는 장면',
        caption: '업로드 전에는 영상 구성, 도입부, 설명란을 한 번 더 확인합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80',
        alt: '노트북으로 콘텐츠 전략을 점검하는 모습',
        caption: '채널 초반에는 자주 바꾸기보다 일관성을 유지하는 것이 중요합니다.',
      },
    ],
  },
  algorithm: {
    thumbnails: [
      {
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        alt: '그래프와 지표를 분석하는 대시보드 화면',
        caption: '조회수만 보지 말고 클릭률과 시청 지속 시간을 함께 보는 것이 중요합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        alt: '성과 그래프를 보며 데이터를 분석하는 장면',
        caption: '성과가 좋은 영상은 어떤 구조였는지 기록해두면 다음 기획에 도움이 됩니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
        alt: '분석 화면에서 클릭률과 시청 데이터를 비교하는 모습',
        caption: '추천 노출은 실제 시청 지표를 기반으로 판단해야 합니다.',
      },
    ],
    body: [
      {
        src: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80',
        alt: '분석 리포트를 정리하는 장면',
        caption: '제목만 고치기보다 먼저 이탈 구간과 시청 흐름을 확인하는 것이 좋습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        alt: '성과 지표를 비교 분석하는 협업 장면',
        caption: '좋은 성과의 공통점을 찾는 것이 다음 영상 개선의 출발점입니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80',
        alt: '유튜브 성과 지표를 모니터링하는 작업 환경',
        caption: '같은 형식의 영상끼리 비교해야 원인 분석이 더 정확해집니다.',
      },
    ],
  },
  aitools: {
    thumbnails: [
      {
        src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
        alt: 'AI 도구와 컴퓨터 작업 화면',
        caption: 'AI 도구는 초안을 빠르게 만들 수 있지만 최종 검수는 사람이 해야 합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        alt: '코드와 편집 화면이 보이는 노트북 작업 공간',
        caption: '대본, 자막, 이미지 생성 도구를 연결해 제작 시간을 줄일 수 있습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        alt: 'AI 기반 디지털 작업 환경',
        caption: 'AI 결과물은 채널의 말투와 사례를 반영해 다시 다듬는 것이 중요합니다.',
      },
    ],
    body: [
      {
        src: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
        alt: 'AI가 생성한 초안을 수정하는 작업 장면',
        caption: 'AI가 만든 초안은 그대로 쓰지 말고 실제 운영 경험에 맞게 조정해야 합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1515876305430-f06edab8282a?auto=format&fit=crop&w=1200&q=80',
        alt: '영상 제작 워크플로우를 관리하는 모습',
        caption: '자막, 썸네일, 음성 도구는 연결하되 품질 검수는 직접 해야 합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        alt: '디지털 크리에이티브 작업을 진행하는 장면',
        caption: '저작권과 사용 조건은 반드시 확인한 뒤 활용하는 것이 안전합니다.',
      },
    ],
  },
  monetization: {
    thumbnails: [
      {
        src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
        alt: '수익 구조와 조건을 점검하는 장면',
        caption: '운영 조건은 단순 조회수보다 정책 적합성과 콘텐츠 품질을 함께 봐야 합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
        alt: '운영 지표와 수익 구조를 확인하는 작업 환경',
        caption: '조건 충족 여부와 실제 판단은 같은 의미가 아닐 수 있습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        alt: '디지털 수익 구조를 계획하는 장면',
        caption: '광고 수익 외에도 멤버십, 제휴, 상품 연계 구조를 함께 고민할 수 있습니다.',
      },
    ],
    body: [
      {
        src: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
        alt: '채널 운영 체크리스트를 보는 장면',
        caption: '현재 조건과 정책은 반드시 공식 화면에서 직접 다시 확인하는 것이 좋습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80',
        alt: '노트북으로 채널 운영 상태를 점검하는 모습',
        caption: '비슷한 구성이 반복되면 운영 품질을 다시 점검해야 할 수 있습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
        alt: '수익 구조와 운영 계획을 메모하는 장면',
        caption: '운영은 결과보다 채널 구조와 지속 가능성을 함께 봐야 합니다.',
      },
    ],
  },
  senior: {
    thumbnails: [
      {
        src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        alt: '시니어 시청자를 위한 콘텐츠 기획 회의 장면',
        caption: '시니어 대상 콘텐츠는 쉬운 설명과 신뢰감 있는 구성이 중요합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
        alt: '설명 중심 콘텐츠를 기획하는 모습',
        caption: '큰 자막과 명확한 문장 구조는 시청 만족도를 높이는 데 도움이 됩니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
        alt: '쉬운 설명을 위해 자료를 정리하는 작업 장면',
        caption: '공감형 콘텐츠일수록 과장보다 진정성이 더 중요합니다.',
      },
    ],
    body: [
      {
        src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
        alt: '시니어 시청자용 자료를 검토하는 장면',
        caption: '시니어 대상 영상은 자막 크기와 설명 속도를 꼭 확인하는 것이 좋습니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1516321310764-8d1d9a5d8e91?auto=format&fit=crop&w=1200&q=80',
        alt: '댓글과 시청자 반응을 확인하는 모습',
        caption: '시청자와의 소통은 신뢰 형성에 큰 도움이 됩니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        alt: '정보 전달용 콘텐츠 구성을 점검하는 장면',
        caption: '생활 정보 콘텐츠는 공식 확인 경로를 함께 안내하는 것이 좋습니다.',
      },
    ],
  },
  advanced: {
    thumbnails: [
      {
        src: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
        alt: '고급 데이터 분석과 실험 설계를 진행하는 장면',
        caption: '고급 운영은 감보다 기록과 비교를 통해 개선하는 것이 중요합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
        alt: '실험 결과와 성과 데이터를 정리하는 모습',
        caption: '한 번에 하나의 변수만 바꾸는 것이 원인 분석에 유리합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        alt: '전략 회의와 성과 분석이 함께 이뤄지는 장면',
        caption: '성과가 좋은 패턴을 다음 콘텐츠에 반복 적용하는 과정이 중요합니다.',
      },
    ],
    body: [
      {
        src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        alt: '운영 지표와 전략 실험을 비교하는 장면',
        caption: '실험 전후 성과는 같은 기간과 같은 기준으로 비교해야 합니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        alt: '다음 영상 개선 항목을 기록하는 작업 장면',
        caption: '실험 결과는 다음 영상의 제목, 썸네일, 도입부 개선으로 이어져야 의미가 커집니다.',
      },
      {
        src: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80',
        alt: '채널 전체 흐름을 보며 개선 포인트를 찾는 장면',
        caption: '개별 영상보다 채널 전체 흐름을 보는 것이 더 중요할 때가 많습니다.',
      },
    ],
  },
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const getPool = (category: CategoryKey): ImagePool => imagePools[category] || imagePools.beginner;

const pickImage = (items: PostImage[], index: number): PostImage => {
  if (!items.length) {
    return {
      src: DEFAULT_REMOTE_IMAGE,
      alt: '유튜브 채널 운영 참고 이미지',
      caption: '유튜브 채널 운영에 참고할 수 있는 기본 이미지입니다.',
    };
  }
  return items[index % items.length];
};

export const addPostImages = (post: GuidePost): GuidePost => {
  const seed = hashString(post.slug || post.title);
  const pool = getPool(post.category);

  const thumbnail = pickImage(pool.thumbnails, seed);
  const body1 = pickImage(pool.body, seed + 1);
  const body2 = pickImage(pool.body, seed + 2);

  return {
    ...post,
    thumbnail: post.thumbnail || thumbnail,
    bodyImages: post.bodyImages || [body1, body2],
  };
};

export const addImagesToPosts = (posts: GuidePost[]) => posts.map(addPostImages);
