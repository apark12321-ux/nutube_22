import { CategorySpec, GuidePost } from './types';
import { POSTS_GROUP_1 } from './data/posts1';
import { POSTS_GROUP_2 } from './data/posts2';
import { POSTS_GROUP_3_part1 } from './data/posts3_part1';
import { POSTS_GROUP_3_part2 } from './data/posts3_part2';
import { POSTS_GROUP_3_part3 } from './data/posts3_part3';

// 모든 포스트 그룹 병합
// 모든 포스트 그룹 병합 및 신규 프리미엄 애드센스 거절 해제 가이드 추가
const PREMIUM_ADSENSE_GUIDE: GuidePost = {
  slug: 'adsense-rejection-recovery',
  title: '구글 애드센스 승인 거절 긴급 대응: 100% 재승인받는 5가지 처방전과 E-E-A-T 소명법',
  subtitle: '가치 없는 콘텐츠와 중복 계정 탈락 사슬을 정면 돌파하고 광고 수익 채널 활성화하기',
  category: 'monetization',
  categoryLabel: '영상 채널 수익화',
  publishedAt: '2026-06-09T08:00:00Z',
  updatedAt: '2026-06-09T08:30:00Z',
  author: '수익화 수석 컨설턴트 제이슨',
  summary: '구글 가치 없는 콘텐츠 혹은 중복 계정 판독으로 애드센스 신청이 기각되었을 때, 정량적으로 사이트를 긴급 수리하고 심사봇과 수동 검사관을 100% 수긍하게 만드는 비기 소명 전략과 정밀 체크리스트를 공개합니다.',
  tags: ['애드센스승인', '수익화전략', '가치없는콘텐츠', '재승인공략', 'EEAT신호'],
  readTime: '9분',
  likes: 428,
  authorityLabel: 'AdSense Audit Expert',
  content: `## 애드센스 불합격 통지서에 담긴 구글의 진짜 속마음

"귀하의 사이트가 애드센스 가이드라인을 준수하지 않는 것으로 확인되어 가입이 기절되었습니다..." 

매년 수십만 명의 창작자와 블로거, 유튜버가 이 무미건조한 구절을 수신하고 좌절의 고뇌를 맛봅니다. 그러나 낙심할 필요가 없습니다. 애드센스 심사는 주관적인 시험이 아니라 **명확한 기계적 지표와 정량적 규칙을 바탕으로 구동되는 체크리스트형 검정**에 가깝기 때문입니다.

구글 광고 게시 부서가 승인을 기각하는 이유는 오직 하나입니다. **"광고주가 고단가를 지불할 가치가 있는 건강하고 지속가능한 지면(혹은 채널)인가?"**에 대한 오리지널 신호가 충족되지 않았기 때문입니다. 이 세션에서는 가장 빈번히 발생하는 3대 탈락 패턴을 완벽 분쇄하고, 단 1회 만에 통과하는 최강의 보완 전략을 세부 공개합니다.

---

### 제 1비책: '가치 없는 콘텐츠 (Low-Value Content)' 탈락 긴급 구조대

웹사이트나 블로그에서 압도적으로 많이 송출되는 거절 코드입니다. 구글 수집 보트(Core Bot)가 여러분의 웹 주소에 탑재된 글들을 연산했을 때, 정보 가치가 희박하다고 예측하는 경우입니다.

#### 1. 정량적 미달 요소 전격 제거 (글자 수와 글 양)
- **일기장 형식의 500자 단문 글은 자수 감점의 가해자입니다.** 한 편당 최소 한글 **1,200자~1,500자 이상**의 장문을 지향하십시오.
- **포스트 개수의 정돈:** 양보다 깊이지만, 최소 15편 이상의 퀄리티 글이 필요합니다. 카테고리가 5개인데 글은 각각 2개씩만 분포되어 있다면 '미완성 사이트'로 기각됩니다. 카테고리를 1~2개로 대폭 통합하고, 하나의 세부 주제에 글 10편 이상을 촘촘히 쏟아부어 전문성 밀도를 채워주세요.

#### 2. E-E-A-T(경험, 전문성, 권위성, 신뢰성) 신호 삽입
구글 검색 및 서빙 알고리즘이 환호하는 4개 축입니다. 글 서두에 "본 글은 시그널 저널에 수록된 실무 공식을 근거로 분석한 자가 가이드입니다"와 같은 고유의 원점을 밝히는 출처와 서문을 한 개 문장씩 조율해 배치하세요.

---

### 제 2비책: 유튜브 채널 '재사용된 콘텐츠' 경고 정면 돌파

유튜브 파트너 프로그램(YPP)이나 채널 애드센스 고시 단계에서 수많은 나레이션 Shorts 채널을 가로막는 무시무시한 장벽입니다. 타인의 오디오나 대중적인 스탁 영상 소스를 연속해서 붙여넣었을 때 "고유한 부가가치 창작 지분이 적다"는 통고를 받습니다.

#### 1. 기계식 TTS 보이스의 비중 축소
완벽하게 균일하고 감정 없는 무감정 AI 음성은 기계 스크랩 소리망으로 로봇이 직독 판별합니다.
- 꼭 AI 보이스를 활용해야 한다면, 가장 최신식 자연스러운 감정형 음성 합성 모델을 배정하고 속도와 휴지기(Pause)를 0.95x~1.03x 수준으로 변주 설정하십시오.
- 가장 좋은 통과 요령은 15초 이상의 주요 앵커 지점에 **본인의 육성을 직접 숨결 높여 수록하는 것**입니다. 실제 인간의 성대 파형 신호가 소스에 투입되면 재사용 판정에서 95% 이상 프리패스 보장을 보장받습니다.

#### 2. 고강도 2차 편집 레이어 개입
단순 풍경 뷰가 깔리는 것 외에, 화면 중앙에 시선을 분산시키는 Dynamic 자막, 독자들의 뇌리에 꽂히는 빨강/노랑 하이라이트 경계, 화면 확대 줌(Zooming) 요소를 5초 주기로 기입하여 편집자의 명백한 연출 개입 지분을 증거(Proof of Work)로 증명하세요.

---

### 제 3비책: '중복 애드센스' 거미줄 완전히 가려내기

애드센스는 법적으로 전 세계에 "인당 단 한 개의 계정"만을 승인합니다. 오래전 휴대전화 가입, Google Play 결제, 부계정 가입 등에서 중복 설정된 채널 꼬임은 즉시 불합격 요인을 선언합니다.

#### 1. 구형 휴면 계정 강제 정지
기억에서 잊혀진 예전 이메일을 찾아 반드시 구글 애드센스 사이트에 로그인 후 '계정 해지 및 탈퇴'를 완수해야 합니다.
- 만약 과거 폐기된 계정 명의를 도저히 찾을 수 없을 때는 본 계정을 정식 영구 폐쇄한 뒤, **새로운 통신 포트 및 결제 통장 명의자가 될 수 있는 가족 명의로 우회 개통**하는 노선이 가장 상처 없는 우회 해법입니다.

---

### 합격 통계를 앞당기는 실시간 신청서 제출 골든 가이드

수정이 끝난 후 재심사 버튼을 무작정 60초 내에 누르지 마십시오.
1. 수집 봇이 여러분이 갈고닦은 고품격 오리지널 글을 다 긁어간 후 신청해야 합니다. 구글 서치콘솔에 들어가 **[색인 생성 요청]을 마수걸이로 손수 전수 등록**하십시오.
2. 약 3~4일의 간격을 벌린 뒤, 애드센스 재심사 텍스트 소명 영역에 정중하고 정량적으로 개선 사실을 논평하여 서술(위의 자동 생성 툴을 복사해 활용)하시면, 수동 심사역이 기쁜 마음으로 승인 스위치를 가동해 선사할 것입니다.
`
};

export const ALL_POSTS: GuidePost[] = [
  PREMIUM_ADSENSE_GUIDE,
  ...POSTS_GROUP_1,
  ...POSTS_GROUP_2,
  ...POSTS_GROUP_3_part1,
  ...POSTS_GROUP_3_part2,
  ...POSTS_GROUP_3_part3
];


// 카테고리 정의 및 메타데이터
export const CATEGORY_SPECS: Record<string, CategorySpec> = {
  algorithm: {
    key: 'algorithm',
    label: '유튜브 알고리즘',
    icon: 'TrendingUp',
    gradient: 'from-blue-500 to-indigo-600',
    description: '유튜브가 추천하고 피드를 구성하는 작동 양식을 정확히 이해합니다.',
    count: ALL_POSTS.filter((p) => p.category === 'algorithm').length,
    persona: '알고리즘 수석 설계 분석관: "조회수를 얻어내는 알고리즘의 보이지 않는 역학은 완벽히 수학적으로 해킹 가능합니다."',
    accentColor: '#3b82f6'
  },
  senior: {
    key: 'senior',
    label: '시니어 사연 쇼츠',
    icon: 'Heart',
    gradient: 'from-pink-500 to-rose-600',
    description: '감성을 움직이고 추억을 부르는 실화 기반 시니어 스토리텔링 방법입니다.',
    count: ALL_POSTS.filter((p) => p.category === 'senior').length,
    persona: '감성 사연 디렉터: "시니어 분들을 움직이는 따뜻한 감동과 인간미 넘치는 목소리에 성장의 본질이 있습니다."',
    accentColor: '#f43f5e'
  },
  aitools: {
    key: 'aitools',
    label: 'AI 도구',
    icon: 'Zap',
    gradient: 'from-amber-500 to-orange-600',
    description: '대본, 음성 생성, 자막 등 제작 시간을 압도적으로 아껴주는 유공 기술입니다.',
    count: ALL_POSTS.filter((p) => p.category === 'aitools').length,
    persona: '초고속 AI 테크 리드: "사람을 대체하는 것이 아닙니다. 15배 생산성을 올려 더 많은 시도를 가능케 하는 무적의 열쇠입니다."',
    accentColor: '#f59e0b'
  },
  monetization: {
    key: 'monetization',
    label: '영상 채널 수익화',
    icon: 'DollarSign',
    gradient: 'from-emerald-500 to-teal-600',
    description: '광고 수익, 제휴 쇼핑, 멤버십 등 월급급 부수입을 단계적으로 설계합니다.',
    count: ALL_POSTS.filter((p) => p.category === 'monetization').length,
    persona: '채널 레버리지 컨설턴트: "광고 수익에만 목매는 것은 가장 위험합니다. 8대 수익 기동을 단계적으로 빌드하십시오."',
    accentColor: '#10b981'
  },
  beginner: {
    key: 'beginner',
    label: '왕초보 출발',
    icon: 'Compass',
    gradient: 'from-violet-500 to-purple-600',
    description: '채널 개설부터 첫 업로드, 실수 대처법까지 부담을 내려놓고 시작하는 입문 코스.',
    count: ALL_POSTS.filter((p) => p.category === 'beginner').length,
    persona: '친절한 길잡이 멘토: "처음에는 70% 완성도로 일단 올리는 게 핵심입니다. 남과 비교하지 말고 시작의 기쁨을 가지세요."',
    accentColor: '#8b5cf6'
  },
  advanced: {
    key: 'advanced',
    label: '중고수 전략',
    icon: 'Award',
    gradient: 'from-cyan-500 to-sky-600',
    description: '채널 성숙기에서 썸네일 A/B 테스트와 이탈 최소화를 이루는 고품격 도약법.',
    count: ALL_POSTS.filter((p) => p.category === 'advanced').length,
    persona: '매출 극대화 그로스해커: "성장의 벽에 부딪혔을 때, 감이 아니라 데이터로 의사결정하여 세션 지속시간을 미세하게 늘리면 전성기가 다시 옵니다."',
    accentColor: '#06b6d4'
  }
};

export const CATEGORIES_LIST: CategorySpec[] = Object.values(CATEGORY_SPECS);
