import { CategoryKey, GuidePost } from './types';

export type DailyCategory = {
  key: CategoryKey;
  label: string;
  author: string;
  tag: string;
  audience: string;
  promise: string;
  themes: string[];
  situations: string[];
  formats: string[];
  angles: string[];
  mistakes: string[];
  metrics: string[];
  nextMoves: string[];
};

export const DAILY_CATEGORIES: DailyCategory[] = [
  {
    key: 'beginner',
    label: '왕초보 출발',
    author: '크리에이터랩 편집부',
    tag: '채널입문',
    audience: '처음 채널을 열었거나 첫 열 편의 영상을 준비하는 초보 운영자',
    promise: '복잡한 장비보다 주제, 말투, 업로드 흐름을 안정적으로 잡는 것',
    themes: ['첫 영상 주제 선택', '채널 소개 문장 설계', '첫 10초 도입부 구성', '촬영 전 대본 뼈대 만들기', '초보자가 버려야 할 완벽주의', '업로드 루틴 만들기', '채널명과 설명란 정리', '댓글을 받기 쉬운 질문 설계', '실패한 첫 영상 다시 살리기', '작은 경험을 콘텐츠로 바꾸기'],
    situations: ['무엇을 올려야 할지 몰라 제작을 미루는 상황', '초기 반응이 낮아도 계속 운영할 기준이 필요한 상황', '지인이 보는 것이 부담스러워 공개를 망설이는 상황', '영상은 찍었지만 제목과 설명란에서 막히는 상황', '너무 많은 참고 채널을 보다 방향을 잃은 상황'],
    formats: ['3분 설명형 영상', '짧은 경험담 중심 쇼츠', '질문으로 시작하는 입문형 영상', '실수 공개형 브이로그', '하루 루틴 기록형 콘텐츠'],
    angles: ['시청자가 바로 따라 할 수 있는 단순성', '처음이라서 오히려 공감되는 진정성', '완성도보다 지속성을 우선하는 운영 관점', '작은 문제 하나를 해결해주는 실용성', '부담을 낮추는 단계별 접근'],
    mistakes: ['첫 영상부터 모든 것을 설명하려는 욕심', '채널 소개와 영상 주제가 서로 맞지 않는 문제', '제목이 창작자 관점으로만 쓰이는 문제', '업로드 후 아무 기록도 남기지 않는 습관', '남의 성공 포맷을 그대로 따라 하는 방식'],
    metrics: ['첫 30초 유지율', '댓글 질문 수', '재방문 가능성', '제목 클릭률', '다음 영상 아이디어 개수'],
    nextMoves: ['같은 주제를 더 짧게 다시 설명하기', '댓글에서 나온 단어를 다음 제목에 반영하기', '시리즈 이름을 붙여 연속성을 만들기', '실패 원인을 설명하는 후속 영상을 만들기', '초보자 질문 3개를 묶어 다음 편으로 연결하기'],
  },
  {
    key: 'algorithm',
    label: '유튜브 알고리즘',
    author: '크리에이터랩 분석팀',
    tag: '운영분석',
    audience: '반응 변동 원인을 감으로 판단하지 않고 지표로 이해하려는 채널 운영자',
    promise: '추천 흐름, 클릭률, 시청 지속 시간, 재방문 신호를 함께 보며 다음 기획을 조정하는 것',
    themes: ['클릭률이 낮은 영상의 원인 분석', '시청 지속 시간이 떨어지는 구간 찾기', '추천 흐름이 약해진 영상 복구', '제목 변경 전 확인할 데이터', '썸네일 테스트의 판단 기준', '초반 이탈을 줄이는 구성', '비슷한 영상끼리 비교하는 방법', '롱폼과 쇼츠의 지표 차이', '반응 좋은 영상의 공통점 추출', '업로드 시간보다 중요한 초기 반응 해석'],
    situations: ['노출은 많은데 클릭이 적은 상황', '초반 반응은 빠른데 하루 뒤 멈추는 상황', '구독자는 늘었지만 다음 영상 반응이 약한 상황', '쇼츠 반응은 있는데 롱폼 유입이 없는 상황', '비슷한 제목을 반복해 성과가 떨어지는 상황'],
    formats: ['지표 해설형 영상', '전후 비교형 콘텐츠', '실험 결과 분석 영상', '알고리즘 분석 리포트', '핵심 지표 요약형 콘텐츠'],
    angles: ['지표를 행동 요령으로 번역하는 관점', '알고리즘 신호를 패턴으로 해석하는 관점', '단기 반응보다 장기 추천에 집중하는 관점', '시청자 이탈 지점을 개선점으로 보는 관점', '작은 실험으로 지표를 개선하는 성장 관점'],
    mistakes: ['하나의 지표만 보고 영상을 성급히 판단하는 행동', '이유 분석 없이 무작정 업로드 수만 늘리는 습관', '이탈 구간 분석 없이 다음 영상을 동일하게 기획하는 문제', '제목 변경 시 노출수 변화를 고려하지 않는 오류', '조회수에 흔들려 채널의 중심 일관성을 잃는 방식'],
    metrics: ['노출 클릭률', '평균 시청 지속 시간', '재방문 시청자 수', '초기 30초 유지 비율', '시청자 기여 분석 비율'],
    nextMoves: ['시청 유지율이 급락한 10초 구간 편집 보완하기', '클릭률 낮은 영상의 썸네일 문구 2가지로 테스트하기', '조회수 높은 영상의 주제로 후속 가이드 기획하기', '댓글 질문이 가장 많은 내용만 모아 롱폼으로 제작하기', '유튜브 스튜디오에서 추천 트래픽 소스 분석해보기'],
  },
  {
    key: 'monetization',
    label: '영상 채널 수익화',
    author: '크리에이터랩 운영팀',
    tag: '수익화준비',
    audience: '광고 수익만 기대하지 않고 채널의 운영 구조와 신뢰를 함께 만들려는 운영자',
    promise: '수익 결과를 보장하기보다 시청자 신뢰, 콘텐츠 일관성, 정책 안정성, 전환 동선을 차분히 준비하는 것',
    themes: ['광고 수익 전 단계에서 준비할 신뢰 요소', '협찬 제안을 받기 전 채널 정리', '멤버십보다 먼저 필요한 팬 관계', '상품 소개 영상의 신뢰 문장', '수익화 신청 전 콘텐츠 점검', '설명란과 고정댓글의 역할', '반복 시청이 생기는 정보형 콘텐츠', '구독자보다 중요한 재방문 구조', '정책 리스크 대비 채널 진단', '수익화 전후의 콘텐츠 가이드 변경'],
    situations: ['수익 창출 요건은 넘었는데 아직 승인 대기 중인 상황', '조회수는 높은데 직접적인 광고 단가가 낮은 상황', '협찬이나 광고 문의를 어디서 받는지 모르는 상황', '새 수익 모델 도입 후 구독자가 반발하는 상황', '재정적 안정 없이 콘텐츠 제작에만 투자하는 상황'],
    formats: ['가이드북 다운로드형 링크', '수익 구조 공개형 콘텐츠', '팬 투표 참여형 커뮤니티 글', '광고 대행사 제안 사례 분석', '실전 수익 체크리스트'],
    angles: ['안정적인 운영을 위한 현금 흐름 관점', '구독자와의 신뢰를 유지하는 상생 관점', '수익 다각화를 차근차근 설계하는 관점', '플랫폼 정책 변화에 기민하게 대응하는 관점', '채널 브랜드 가치를 먼저 높이는 성장 관점'],
    mistakes: ['과장되거나 확실하지 않은 수익 보장 표현', '준비되지 않은 상태에서 성급하게 상업 광고 게재', '수익 모델을 설명 없이 일방적으로 도입하는 행동', '하나의 외부 광고에 채널 전체의 톤을 바꾸는 오류', '본문 설명란에 깨진 링크나 잘못된 주소를 방치하는 습관'],
    metrics: ['전환 링크 클릭수', '광고 유입 후 체류시간', '구독 해지율 추이', '스폰서 참여 적극성', '공식 파트너십 가입률'],
    nextMoves: ['설명란에 정확한 문의 메일 주소 고정하기', '첫 수익 도입 시 시청자 대상 영상 올리기', '대표 영상의 정보 기입 상태 재감수하기', '협찬 제안 시 활용할 채널 소개서 초안 작성하기', '과도한 광고 문구를 담백한 표현으로 수정하기'],
  },
  {
    key: 'senior',
    label: '시니어 사연 쇼츠',
    author: '크리에이터랩 제작팀',
    tag: '시니어감성',
    audience: '감성을 움직이고 추억을 부르는 실화 기반 시니어 스토리텔링으로 팬덤을 쌓으려는 크리에이터',
    promise: '자극적 요소 없이 마음을 울리는 나레이션, 사연 구성, 자막 싱크와 시청 연장선을 탄탄히 설계하는 것',
    themes: ['마음을 움직이는 사연 첫 구절', '시니어 독자가 좋아하는 글씨 크기와 자막 위치', '감성을 깨우는 배경음악 선곡 기준', '실화 사연의 프라이버시 각색 수칙', '나레이션 톤앤매너와 발음 속도', '기억에 남는 부모님과 고향 소재 다루기', '댓글 참여를 부르는 따뜻한 안부 인사', '시청 지속을 위한 장면 전환 속도', '채널 정체성을 보여주는 로고 연출', '감동을 주는 마무리 메시지 설계'],
    situations: ['내용은 감동적이나 초반 3초 클릭율이 낮은 상황', '댓글은 따뜻하지만 영상 이탈 속도가 빠른 상황', '사연 고갈로 다음 기획에 어려움을 겪는 상황', 'AI 목소리와 사연 분위기가 겉도는 상황', '자막 가독성이 떨어져 중장년층 시청자가 떠나는 상황'],
    formats: ['감성 나레이션형 쇼츠', '따뜻한 일러스트 기반 숏폼', '추억 소환형 에세이 비디오', '독자 사연 소개형 영상', '한 줄 위로 메시지 카드 콘텐츠'],
    angles: ['중장년층 시청자의 정서적 만족을 돕는 관점', '화려함보다 담백함이 주는 신뢰 관점', '독자와 편안하게 소통하는 커뮤니티 관점', '일상의 소중함을 이끌어내는 스토리 관점', '지나친 과장 없이 마음을 보듬는 치유 관점'],
    mistakes: ['지나치게 자극적이거나 가짜인 사연 남발', '화면이 너무 복잡하고 자막이 빠르게 흐르는 구성', '내용과 어울리지 않는 경쾌한 배경음악', '강압적이거나 가르치려 드는 말투의 나레이션', '무단으로 타인의 사연을 그대로 노출하는 행위'],
    metrics: ['중반 시청 유지율', '안부 댓글 참여 비율', '카카오톡 공유 횟수', '구독 유지율 추이', '나레이션 음성 만족도'],
    nextMoves: ['자막 크기를 15% 키우고 대비 확실히 주기', '가장 편안한 톤의 성우 목소리로 재가공하기', '커뮤니티 탭에 주 1회 안부 질문 게시하기', '인기 사연의 핵심 키워드로 후속작 준비하기', '가장 많은 공감을 얻은 댓글을 다음 영상에 고정하기'],
  },
  {
    key: 'advanced',
    label: '중고수 전략',
    author: '크리에이터랩 전략팀',
    tag: '채널전략',
    audience: '이미 콘텐츠를 올리고 있지만 성장 정체, 포맷 피로, 브랜딩 혼선을 해결하려는 운영자',
    promise: '감이 아니라 구조, 포맷, 시청자층, 반복 가능한 실험 단위로 채널을 다시 설계하는 것',
    themes: ['성장 정체 구간의 원인 분리', '시리즈 포맷 재설계', '채널 브랜딩 문장 정리', '롱폼과 쇼츠의 역할 분리', 'A/B 테스트의 올바른 순서', '썸네일 피로도 줄이기', '재방문자를 위한 콘텐츠 지도', '기존 인기 영상의 확장 전략', '콘텐츠 포트폴리오 재배치', '채널 운영 리듬 복구'],
    situations: ['구독자는 있는데 반응이 정체된 상황', '비슷한 포맷을 오래 써서 반응이 줄어든 상황', '인기 영상은 있지만 다음 주제로 확장하지 못한 상황', '쇼츠와 롱폼의 역할이 겹치는 상황', '브랜드 문장이 모호해 시청자 기억에 남지 않는 상황'],
    formats: ['채널 진단형 롱폼', '비교 분석형 콘텐츠', '운영 실험 리포트', '시리즈 리뉴얼 공지 영상', '전략 메모 공개형 글'],
    angles: ['채널을 영상 묶음이 아니라 제품처럼 보는 관점', '성과를 주제·포맷·패키징으로 나눠 보는 관점', '기존 자산을 재활용하는 관점', '반복 실험을 작게 설계하는 관점', '브랜드 기억을 만드는 언어 전략'],
    mistakes: ['성과가 떨어졌다고 모든 요소를 동시에 바꾸는 문제', '잘된 영상의 이유를 기록하지 않는 습관', '시리즈 이름 없이 콘텐츠가 흩어지는 구조', '시청자층이 다른 주제를 한 채널에 무리하게 섞는 방식', '운영자가 지쳐 지속 불가능한 업로드 계획'],
    metrics: ['재방문 비율', '시리즈별 평균 반응', '썸네일별 클릭률 변화', '구독자 대비 시청 비율', '콘텐츠 묶음별 유지율'],
    nextMoves: ['인기 영상 3개를 묶어 새 시리즈로 만들기', '썸네일 색보다 문구 구조를 먼저 바꾸기', '롱폼은 신뢰, 쇼츠는 발견으로 역할을 나누기', '시리즈별 성과표를 만들어 다음 달 주제를 정하기', '채널 소개 문장을 한 문장으로 압축하기'],
  },
];

const MIN_CONTENT_LENGTH_WITHOUT_SPACE = 3000;

const pick = (items: string[], seed: number) => items[Math.abs(seed) % items.length];
const formatKoreanDate = (date: Date) => `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
const dayIndex = (date: Date) => Math.floor((date.getTime() - Date.UTC(2026, 4, 1, 1, 0, 0)) / (24 * 60 * 60 * 1000));
export const contentLengthWithoutSpace = (content: string) => content.replace(/\s/g, '').length;

export const dailyTitle = (category: DailyCategory, date: Date) => {
  const seed = dayIndex(date) + DAILY_CATEGORIES.findIndex((item) => item.key === category.key) * 11;
  const theme = pick(category.themes, seed);
  
  const suffixes = [
    '해결 가이드',
    '핵심 운영 전략',
    '실전 운영 가이드',
    '초보 채널 성장 전략',
    '핵심 분석과 개선 팁',
    '채널 성장 실무 팁'
  ];
  const suffix = suffixes[Math.abs(seed) % suffixes.length];
  
  let title = `${theme} ${suffix}`;
  if (title.length > 40) {
    title = `${theme} 가이드`;
  }
  return title;
};

export const buildDailyContent = (category: DailyCategory, date: Date) => {
  const seed = dayIndex(date) + DAILY_CATEGORIES.findIndex((item) => item.key === category.key) * 17;
  const theme = pick(category.themes, seed);
  const situation = pick(category.situations, seed + 1);
  const format = pick(category.formats, seed + 2);
  const angle = pick(category.angles, seed + 3);
  const mistake = pick(category.mistakes, seed + 4);
  const metric = pick(category.metrics, seed + 5);
  const nextMove = pick(category.nextMoves, seed + 6);
  const subTheme = pick(category.themes, seed + 7);
  const secondSituation = pick(category.situations, seed + 8);
  const secondMetric = pick(category.metrics, seed + 9);
  const secondMove = pick(category.nextMoves, seed + 10);
  const title = dailyTitle(category, date);

  return `## ${title}

${category.label} 콘텐츠는 ${theme}을 중심으로 설계하는 것이 좋습니다. 이 주제는 단순히 오늘 올릴 글감을 채우기 위한 소재가 아니라, ${category.audience}가 실제로 겪는 ${situation}을 해결하는 데 초점을 둡니다. 관심을 끄는 콘텐츠는 자극적인 단어 하나로 만들어지지 않습니다. 시청자가 자기 문제라고 느낄 만한 장면을 먼저 보여주고, 그다음에 운영자가 어떤 기준으로 판단해야 하는지 차분하게 설명할 때 클릭 이후의 체류가 만들어집니다.

### 오늘 이 주제가 관심을 끌 수 있는 이유

${theme}은 표면적으로는 작은 운영 항목처럼 보이지만, 실제로는 채널의 첫인상과 반복 시청을 동시에 좌우합니다. 특히 ${category.label} 영역에서는 ${angle}이 중요합니다. 시청자는 제목에서 기대한 내용이 도입부에서 바로 확인되지 않으면 빠르게 이탈합니다. 반대로 첫 문장, 첫 화면, 첫 사례가 맞물리면 영상 길이가 조금 길어도 끝까지 볼 이유가 생깁니다. 오늘 글에서는 ${format}에 적용할 수 있는 흐름으로 정리하되, 단순 나열 대신 왜 그런 선택이 필요한지를 함께 설명합니다.

### 시청자가 실제로 반응하는 지점

많은 운영자가 ${mistake} 때문에 좋은 소재를 가지고도 반응을 놓칩니다. 예를 들어 같은 정보라도 창작자가 하고 싶은 말부터 시작하면 시청자는 맥락을 찾는 데 시간을 씁니다. 하지만 시청자의 불편, 궁금증, 손해, 기대를 먼저 제시하면 이야기가 달라집니다. ${category.audience}는 대체로 화려한 표현보다 자신의 상황을 정확하게 짚어주는 문장에 더 오래 머뭅니다. 그래서 오늘의 핵심은 정보를 많이 넣는 것이 아니라, 먼저 공감되는 문제를 선명하게 잡고 그 문제를 해결하는 순서를 보여주는 것입니다.

### 제목과 도입부를 잡는 방식

오늘 제목은 ${theme}을 전면에 두되 결과를 과장하지 않는 방향이 안전합니다. 예를 들어 강한 약속형 표현보다 “왜 반응이 떨어지는지 확인하는 방법”처럼 독자가 얻을 판단 기준을 보여주는 편이 좋습니다. 도입부에서는 ${situation}을 한 문장으로 압축합니다. 그다음에는 “이 글에서는 무엇을 바꾸고 무엇을 그대로 둘지 구분해보겠습니다”처럼 글의 범위를 알려야 합니다. 이렇게 하면 독자는 내용이 산만하지 않다고 느끼고, 운영자는 불필요한 설명을 줄일 수 있습니다.

### 본문에서 반드시 풀어야 할 사례

본문에는 추상적인 조언보다 장면이 있어야 합니다. ${secondSituation}을 예로 들면, 운영자는 보통 원인을 하나로 단정하려고 합니다. 그러나 실제로는 주제 선택, 제목, 썸네일, 도입부, 업로드 후 반응 기록이 함께 영향을 줍니다. 따라서 오늘 글에서는 하나의 실패 원인을 고르는 방식보다, 어떤 순서로 확인하면 시행착오를 줄일 수 있는지 보여주는 구성이 더 적합합니다. 이 방식은 독자가 자신의 채널에 바로 대입하기 쉽고, 다음 포스팅으로 이어질 여지도 큽니다.

### 제작 흐름으로 바꾸는 방법

${format}으로 제작한다면 첫 단계는 소재를 넓히는 것이 아니라 범위를 줄이는 것입니다. ${subTheme}까지 한 번에 넣으면 글이 풍성해 보일 수는 있지만 메시지가 흐려질 수 있습니다. 하나의 영상이나 글에서는 한 가지 판단 기준만 분명히 남기는 편이 좋습니다. 첫 문단은 문제 제기, 중간은 원인 분리, 후반은 적용 순서, 마지막은 다음 행동으로 구성합니다. 이때 ${metric}을 기록할 수 있도록 문장 안에 관찰 기준을 넣어두면 다음 콘텐츠를 만들 때 훨씬 편해집니다. 콘텐츠는 업로드하고 끝나는 결과물이 아니라 다음 판단을 위한 자료가 되어야 합니다.

### 운영자가 피해야 할 표현과 구성

오늘 주제에서 가장 조심해야 할 부분은 ${mistake}입니다. 이런 구성은 짧은 순간에는 강해 보일 수 있지만, 반복되면 채널의 신뢰를 떨어뜨릴 수 있습니다. 특히 ${category.label} 콘텐츠는 한 번의 클릭보다 다시 찾아올 이유가 더 중요합니다. 그래서 강한 표현을 쓰더라도 근거, 사례, 한계, 적용 조건을 함께 제시해야 합니다. 시청자는 과장된 약속보다 “내 상황에서는 어디까지 적용할 수 있는가”를 알고 싶어합니다.

### 성과를 확인하는 기준

업로드 후에는 ${metric}을 중심으로 확인합니다. 숫자가 좋지 않더라도 바로 실패로 단정하지 말고, 같은 카테고리의 전날 콘텐츠와 비교해보는 것이 좋습니다. ${secondMetric}도 함께 보면 더 정확합니다. 예를 들어 클릭은 높지만 유지율이 낮다면 제목과 본문 기대가 어긋났을 수 있습니다. 반대로 클릭은 낮지만 끝까지 본 비율이 높다면 패키징 문제일 가능성이 큽니다. 이런 식으로 지표를 행동으로 번역해야 다음 수정이 의미를 가집니다.

### 다음 콘텐츠로 확장하는 법

오늘 글에서 다음으로 이어질 행동은 ${nextMove}입니다. 여기서 중요한 것은 완전히 새로운 주제로 넘어가는 것이 아니라, 오늘 반응이 있었던 단어와 장면을 다음 콘텐츠에 남겨두는 것입니다. ${secondMove}도 좋은 후속 전략이 될 수 있습니다. 시리즈가 강해지는 순간은 매일 다른 말을 할 때가 아니라, 같은 문제를 조금씩 다른 각도에서 설명해 독자가 “이 채널은 내 고민을 계속 따라오고 있다”고 느낄 때입니다.

### 실제 적용 예시

운영자가 ${theme}을 오늘의 주제로 잡았다면, 첫 화면에는 결과보다 상황을 놓는 편이 좋습니다. “왜 내 영상은 초반에 멈출까”, “왜 같은 주제인데 남의 영상만 클릭될까”, “왜 댓글은 많은데 다음 영상으로 이어지지 않을까”처럼 시청자의 언어로 시작합니다. 그다음 본문에서는 ${angle}을 기준으로 원인을 나누고, 마지막에는 ${metric}을 확인하라고 안내합니다. 이 흐름은 단순한 조언보다 실제 제작 순서에 가깝기 때문에 독자가 저장하거나 다시 볼 가능성이 높습니다.

### 오늘의 결론

${category.label} 포스팅의 핵심은 ${theme}을 통해 ${category.promise}입니다. 오늘은 많은 항목을 한꺼번에 고치려 하기보다, ${situation}에서 출발해 ${metric}으로 결과를 확인하고 ${nextMove}로 다음 콘텐츠를 연결하는 것이 좋습니다. 이렇게 쌓인 글은 날짜만 채운 글이 아니라 카테고리 안에서 서로 연결되는 운영 기록이 됩니다. 결국 좋은 콘텐츠 운영은 한 번의 강한 제목보다, 매일 같은 기준으로 시청자의 문제를 발견하고 해결하는 누적 과정에 가깝습니다.`;
};

export const buildDailySummary = (category: DailyCategory, date: Date) => {
  const seed = dayIndex(date) + DAILY_CATEGORIES.findIndex((item) => item.key === category.key) * 17;
  const theme = pick(category.themes, seed);
  const situation = pick(category.situations, seed + 1).replace(/ 상황$/g, '');
  const angle = pick(category.angles, seed + 3);
  const nextMove = pick(category.nextMoves, seed + 6);

  return `${category.label} 운영자를 위해 마련된 맞춤형 성장 가이드입니다. 이번 글에서는 **'${theme}'** 주제를 다루며, **'${situation}'**의 고충을 해결할 수 있는 **'${angle}'** 관점의 실무 해법을 전해드립니다. 여기에 구체적인 핵심 지표 분석과 발행 후 즉각 이행할 수 있는 **'${nextMove}'** 액션 전략까지 모두 담았습니다.`;
};

export const buildDeepDiveContent = (category: DailyCategory, date: Date) => {
  const seed = dayIndex(date) + DAILY_CATEGORIES.findIndex((item) => item.key === category.key) * 17 + 23; // shift seed offset to ensure unique content
  const theme = pick(category.themes, seed);
  const situation = pick(category.situations, seed + 1).replace(/ 상황$/g, '');
  const format = pick(category.formats, seed + 2);
  const angle = pick(category.angles, seed + 3);
  const mistake = pick(category.mistakes, seed + 4);
  const metric = pick(category.metrics, seed + 5);
  const nextMove = pick(category.nextMoves, seed + 6);

  return `### 💡 실전 적용을 위한 심화 가이드라인

오늘의 주제인 **${theme}**을 실제 운영에 완벽히 이식하기 위해서는 단순 이론 분석을 넘어 정량적 체계와 행동 수칙이 필수적입니다. 특히 ${category.audience}를 위해 자칫 간과하기 쉬운 디테일들을 한 단계 깊게 점검합니다.

---

### 1단계: 발행 전 완벽 점검 목록
- **독자의 고충 맞춤형 설계**: 현재 준비 중인 도입부와 제목이 **${situation}** 상황을 해결할 수 있는 직관적인 해결책을 암시하는지 체크하세요.
- **포맷형 레이아웃 구성**: 이번 주제를 **${format}** 형태로 기획할 때, 독자가 초반 10초 이내에 시청(또는 스크롤)을 지속할 명확한 근거와 시각적 혜택이 있어야 합니다.
- **치명적 실수 방지**: 가장 빈번히 일어나는 오류인 **${mistake}**의 요소를 사전에 걸러냈는지 본문을 직접 꼼꼼히 낭독하며 감수하세요.

---

### 2단계: 핵심 행동 지침 및 문장 설계
- **훅 문구 재설계**: 독자의 뇌리에 메시지를 꽂아 넣기 위해, **${angle}** 시각에 기반한 단 한 문장의 명확한 해결 원칙을 던지며 이야기를 시작합니다.
- **중반 이탈 지점 제어**: 장황한 서술은 무조건 스킵을 부릅니다. 문장을 두 문장 이하로 쪼개고, 줄 바꿈과 수치(Data)를 섞어 모바일 가독성을 한계까지 높여주세요.
- **정교한 흐름 유도**: 본문의 핵심 제안 이후, 마지막 단추로 **${nextMove}** 전략을 행동 촉구(CTA)로 녹여내어 독자가 채널 내에서 지속적인 성장 여정을 이어가도록 만드세요.

---

### 3단계: 성과 수치 분석 및 피드백 순환
- **최우선 관측 지표**: 업로드 후 겉보기 조회수만 바라보지 말고, **${metric}** 지표를 최우선 지침서로 설정하세요. 이 변수를 기록하고 수정하는 과정에서 핵심 독자층이 고정됩니다.
- **지표 부진 시 대처법**: 원인을 쪼개 확인해야 합니다. 만약 노출 클릭이 부진하다면 본문 수정이 아닌 패키징 및 제목 구조 미세조정부터 시작하며 순차적으로 테스트를 갱신하세요.

---

### 심화 핵심 메모 요약
성장의 비밀은 자극성에 있지 않고, 매일 반복되는 미세한 품질 검수와 올바른 지표 관리에 숨어있습니다. 오늘 제안 드린 **${theme}** 심화 체크리스트를 지금 바로 기획 시트에 기록하여 창작 과정을 한 차원 업그레이드해 보세요.`;
};

export const makeDailyPost = (category: DailyCategory, date: Date): GuidePost => {
  const key = date.toISOString().slice(0, 10);
  const title = dailyTitle(category, date);
  const publishedAt = new Date(date);
  const categoryIndex = DAILY_CATEGORIES.findIndex((item) => item.key === category.key);
  publishedAt.setUTCHours(1 + categoryIndex, 0, 0, 0);
  const updatedAt = new Date(publishedAt.getTime() + 45 * 60 * 1000);

  return {
    slug: `daily-${category.key}-${key}`,
    title,
    subtitle: `${category.label} 카테고리에서 깊이 있게 다루기 좋은 실전형 운영 주제를 선별하여 정리했습니다.`,
    category: category.key,
    categoryLabel: category.label,
    publishedAt: publishedAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    author: category.author,
    summary: buildDailySummary(category, date),
    tags: [category.tag, '영상채널운영', '콘텐츠기획', '운영전략', '크리에이터가이드'],
    readTime: '12분',
    likes: 0,
    authorityLabel: 'Creator Guide Lab Editorial',
    content: buildDailyContent(category, date),
  };
};

export const ensureMinimumPostLength = (post: GuidePost) => {
  if (post.content.includes('## 💡 심화 보강 해설') || post.content.includes('## 심화 보강 해설')) return post;
  if (contentLengthWithoutSpace(post.content) >= MIN_CONTENT_LENGTH_WITHOUT_SPACE) return post;
  const category = DAILY_CATEGORIES.find((item) => item.key === post.category) || DAILY_CATEGORIES[0];
  const deepDive = buildDeepDiveContent(category, new Date(post.publishedAt));
  return { ...post, content: `${post.content}\n\n---\n\n## 💡 심화 보강 해설\n\n${deepDive}` };
};
