// 유튜브 도구(픽 시리즈) 정의. 도구 주소·상태는 이 파일에서만 관리한다.
export type ToolStatus = 'live' | 'beta' | 'soon';

export interface ToolStep {
  title: string;
  desc: string;
}

export interface ToolDef {
  key: string;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  form: string;
  url: string | null;
  status: ToolStatus;
  accent: string;
  steps: ToolStep[];
  features: string[];
  relatedSlugs: string[];
}

export const TOOL_STATUS_LABEL: Record<ToolStatus, string> = {
  live: '운영 중',
  beta: '시험 운영',
  soon: '준비 중',
};

export const TOOLS: ToolDef[] = [
  {
    key: 'shorts',
    name: '쇼츠픽',
    tagline: '롱폼 영상에서 핵심 구간을 추출해 쇼츠로 완성',
    description:
      '긴 영상 한 편을 넣으면 핵심 키워드 구간을 찾아 세로 쇼츠로 잘라내고, 제목·자막·초반 후킹·섬네일까지 갖춘 완성본을 만듭니다. 유튜브 쇼츠와 인스타그램 릴스에 그대로 올릴 수 있습니다.',
    audience: '롱폼 강의·방송 영상을 보유한 채널 운영자',
    form: '윈도우 PC 프로그램 · 안드로이드 앱',
    url: null,
    status: 'soon',
    accent: '#2563eb',
    steps: [
      { title: '영상 등록', desc: '롱폼 영상 파일 또는 유튜브 주소를 등록합니다.' },
      { title: '구간 선별', desc: '핵심 키워드 기준으로 쇼츠 후보 구간을 자동 선별합니다.' },
      { title: '완성본 출력', desc: '제목·자막·후킹·섬네일이 적용된 쇼츠 영상을 내려받습니다.' },
    ],
    features: ['키워드 기준 구간 자동 선별', '쇼츠 안전 영역을 피한 제목·자막 배치', '초반 3~5초 후킹 자동 삽입', '속도 조절·섬네일 생성'],
    relatedSlugs: ['shorts-getting-started', 'shorts-and-long-videos-together', 'first-30-seconds'],
  },
  {
    key: 'script',
    name: '대본픽',
    tagline: '주제 발굴부터 대본·자막·컷 이미지까지 한 번에 생성',
    description:
      '채널 분야와 제목 몇 가지만 넣으면 조회 가능성이 높은 주제를 찾고, 대본·자막·컷 이미지를 순서대로 산출합니다. 산출물을 편집 프로그램에 넣어 바로 영상을 합성할 수 있습니다.',
    audience: '기획·대본 작성에 시간이 많이 드는 운영자',
    form: '웹 서비스',
    url: null,
    status: 'soon',
    accent: '#7c3aed',
    steps: [
      { title: '분야 입력', desc: '채널 분야와 참고 제목을 입력합니다.' },
      { title: '주제·대본 생성', desc: '주제 후보와 구조화된 대본을 생성합니다.' },
      { title: '자막·컷 이미지 출력', desc: '자막 파일과 장면별 컷 이미지를 묶어 내려받습니다.' },
    ],
    features: ['주제 후보 자동 발굴', '도입·전개·마무리 구조 대본', '자막 파일(SRT) 출력', '장면별 컷 이미지 생성'],
    relatedSlugs: ['find-my-first-topic', 'storytelling-structure', 'content-idea-notebook'],
  },
  {
    key: 'channel',
    name: '채널픽',
    tagline: '유튜브·인스타그램·틱톡 성과를 한 화면에서 비교 분석',
    description:
      '같은 숏폼을 여러 플랫폼에 올렸을 때 플랫폼별 조회·유지율·반응을 한 화면에서 비교하고, 다음 제작 방향을 제시합니다.',
    audience: '숏폼을 여러 플랫폼에 동시 배포하는 운영자',
    form: '웹 서비스',
    url: null,
    status: 'soon',
    accent: '#0891b2',
    steps: [
      { title: '채널 연결', desc: '분석할 채널 주소를 등록합니다.' },
      { title: '성과 수집', desc: '플랫폼별 조회·유지율·반응 지표를 수집합니다.' },
      { title: '비교 분석', desc: '영상별·플랫폼별 비교표와 제작 방향 제안을 확인합니다.' },
    ],
    features: ['플랫폼별 성과 비교표', '영상별 유지율 분석', '상위 성과 영상 공통점 추출', '다음 제작 주제 제안'],
    relatedSlugs: ['analytics-two-numbers', 'audience-retention-graph', 'when-views-stop'],
  },
  {
    key: 'produce',
    name: '제작픽',
    tagline: '해외반응·배경영상 유형 영상을 대본부터 업로드까지 자동 제작',
    description:
      '제목과 몇 가지 조건만 넣으면 10분 이상 대본, 장면별 CG, 자막, 음성을 생성해 영상으로 합성하고 유튜브 예약 업로드까지 처리합니다. 수익 창출 기준을 지키는 범위에서 하루 1편 자동 발행을 원칙으로 합니다.',
    audience: '얼굴 노출 없이 채널을 운영하려는 운영자',
    form: '윈도우 PC 프로그램',
    url: null,
    status: 'soon',
    accent: '#dc2626',
    steps: [
      { title: '조건 입력', desc: '제목·분야·배경 영상·음성 조건을 입력합니다.' },
      { title: '자동 제작', desc: '대본·CG·자막·음성을 생성해 영상으로 합성합니다.' },
      { title: '예약 업로드', desc: '검토 후 유튜브에 예약 업로드합니다.' },
    ],
    features: ['10분 이상 장편 대본 자동 생성', '장면별 CG·자막 자동 삽입', '내 목소리 또는 합성 음성 선택', '유튜브 예약 업로드'],
    relatedSlugs: ['camera-shyness-tips', 'how-ad-revenue-works', 'upload-schedule-routine'],
  },
];

export const TOOL_BY_KEY: Record<string, ToolDef> = Object.fromEntries(TOOLS.map((t) => [t.key, t]));

export const TOOLS_PATH = '/tools';
export const getToolPath = (tool: ToolDef) => `${TOOLS_PATH}/${tool.key}`;
