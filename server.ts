import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gemini API 초기화
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is missing. Falling back to simulated/mock mode.");
}

// Helper to get high quality dynamic simulated metadata
function getSimulatedMetadata(keyword: string, isFallback: boolean = false) {
  const lowercaseKeyword = keyword || "이것";
  return {
    isFallback,
    keyword: keyword,
    titles: [
      {
        title: `제가 매일 올리던 영상을 '${lowercaseKeyword}' 때문에 전부 멈춘 솔직한 이유`,
        ctr: 16.4,
        type: '거울+깨달음형',
        reason: `'${lowercaseKeyword}' 시청자 스스로의 습관을 돌아보게 만들어 거울처럼 자신의 시행착오를 대립시키는 기폭제 역할을 합니다.`
      },
      {
        title: `진짜 '${lowercaseKeyword}' 하나 바꿨는데 14일 만에 조회수 10배 늘어난 실험`,
        ctr: 14.8,
        type: '단기 실험형',
        reason: '기간(14일)과 정량적 성과를 명시하여, 단순 낚시가 아닌 실제 데이터가 포함된 실전 다큐멘터리식 흥미를 끕니다.'
      },
      {
        title: `초보 유튜버 98%가 [${lowercaseKeyword}] 개설 첫 주에 '이 사소한 실수'로 채널을 망칩니다`,
        ctr: 15.2,
        type: '위험 회피형',
        reason: '위험 회피 성향은 인간 본능에 가장 강력하게 작용하여, 무심코 내 채널도 망가지지 않았는지 생존 점검을 강제 유도합니다.'
      },
      {
        title: `[${lowercaseKeyword}] 사연으로 시작 한 달 만에 수익 400만 원 돌파한 통계 공개`,
        ctr: 17.1,
        type: '결과 공개형',
        reason: '누구나 갈망하는 구체적인 수치적 성공 결과를 선제적으로 보여주며, 그 비법을 투명하게 들여다보고 싶어지게 합니다.'
      },
      {
        title: `만약 제가 다시 [${lowercaseKeyword}] 채널을 '구독자 0명'부터 맨땅에 시작한다면?`,
        ctr: 13.9,
        type: '회상 가정형',
        reason: '현재의 100만 유튜버가 가진 완벽한 노하우를 가장 순수하고 유용한 초보 기준에 맞춰 정수를 압축 전달할 것을 보장합니다.'
      },
      {
        title: `${lowercaseKeyword} 분야에서 평생 숨겨두었던 낡은 비밀 하나가 불러온 기적`,
        ctr: 16.2,
        type: '스토리텔링형',
        reason: '드라마적인 미스터리와 따스한 인간미를 한 자리에 녹여, 감성을 자극하고 긴 여운의 댓글을 남길 분위기를 미리 고조시킵니다.'
      },
      {
        title: `알고리즘 추천 피드가 [${lowercaseKeyword}] 좋은 영상을 골라내는 3가지 수학적 비밀 정밀 해부`,
        ctr: 12.5,
        type: '정교한 지식인형',
        reason: '기술적 사실관계와 객관적 분석을 선호하는 고관여 시청자군을 저격하며 채널의 전체적인 E-E-A-T(전문성)를 한 차원 높여줍니다.'
      },
      {
        title: `2026년 하반기 폭발하는 '${lowercaseKeyword}' 트렌드에 지금 올라타야 하는 이유`,
        ctr: 14.2,
        type: '트렌드 편승형',
        reason: '임박한 시장 변화와 새로운 블루오션 트렌드를 짚어 시청자가 도태되거나 기회를 놓칠 것을 막는 긴박한 참여를 유발합니다.'
      }
    ],
    description: `📌 오늘 다룬 [${lowercaseKeyword}] 성장 전략 비밀 요약:
00:00 - 오늘 영상 핵심 예고 및 인트로
01:15 - 조회수 증가의 결정적 요인 분석
03:40 - 2026년 마이크로 니치 알고리즘의 대세 전환과 기회
06:12 - 실제 시니어 채널에 즉시 대입하는 3대 타이틀 비기
08:30 - 세션을 극적으로 연결하는 최종화면 최적화
10:15 - 오늘 요점 요약 및 특별 무료 배포 템플릿 안내

🎁 유튜브 성장 전략 비장의 무기 무료 비서 사이트 링크:
👉 https://ai.studio/build (구독자 누적 노하우 집약지)
#유튜브성장 #유튜브알고리즘 #시니어쇼츠 #유튜브수익화 #[${lowercaseKeyword}]`,
    tags: [lowercaseKeyword, "유튜브성장", "유튜브알고리즘", "시니어사연쇼츠", "썸네일기획", "유튜브대본", "AI영상제작"],
    storyboard: [
      {
        scene: "Scene 1: 첫 3초의 강박적 후킹",
        visual: "카메라 줌인. 심각한 표정의 화자 혹은 고대비의 실물 단독 샷. 하단 자막에 흰색 굵은 폰트 배치 후 흔들리는 모션.",
        audio: `BGM: 긴장감 넘치는 로우 파이 베이스음 단발성 타격. 내레이션: "솔직히 말씀드릴게요. 여러분이 매일 올리던 이 [${lowercaseKeyword}] 영상, 어쩌면 전부 멈추셔야 합니다."`,
        timing: "00:00 - 00:03"
      },
      {
        scene: "Scene 2: 문제 상황의 심리학적 제기",
        visual: "조회수가 뚝 떨어져 정체된 스튜디오 분석 차트가 화면에 크게 흐려지며 지나감. 구체적이고 붉은색 패닉 노선 화살표 표시.",
        audio: `BGM: 미디엄 템포의 차분하며 집중이 잘 되는 신디사이저 저음. 내레이션: "열심히 하루 종일 공들였는데 [${lowercaseKeyword}] 조회수 100회 언더에 머물러 낙심하셨나요? 진짜 범인은 썸네일이 아니라 바로 이것입니다."`,
        timing: "00:03 - 00:15"
      },
      {
        scene: "Scene 3: 마이크로 니치의 과학적 원리 제공",
        visual: "다양한 주제(요리, 요가, 사연 등)가 알록달록한 클러스터 동그라미로 깔끔하게 묶이는 직관적인 그래픽 효과. 화자의 활기찬 손짓 모션.",
        audio: `BGM: 희망차고 깔끔하며 리드미컬한 업비트 음원. 내레이션: "2026년 알고리즘은 큰 카테고리가 아니라 더욱 세밀한 세션 클릭 이력을 기반으로 [${lowercaseKeyword}] 매칭률을 선사합니다. 정직하게 좁힐 수록 노출 확률은 열 배 이상 상승합니다."`,
        timing: "00:15 - 00:45"
      },
      {
        scene: "Scene 4: 즉시 실행 가능한 솔루션 핵심 정리",
        visual: "화면 분할 레이아웃 적용. 1번, 2번, 3번 콤팩트한 텍스트 카드가 하나씩 탑다운으로 슬라이드 인 애니메이션 렌더링.",
        audio: "BGM: 자신감 있고 깔끔한 연주. 내레이션: \"기억하세요. 첫째, 영상 마무리에 반드시 떡밥 질문 던지기. 둘째, 클릭을 부를 썸네일 고대비 비율 지키기. 셋째, 한 카테고리만 한숨에 파기!\"",
        timing: "00:45 - 01:15"
      },
      {
        scene: "Scene 5: 세션 연결을 위한 미끼 마무리 (CTA)",
        visual: "화면 우측 상단에 다음 시리즈 관련 추천 영상 카드 테두리가 번쩍이며 생성됨. 화면이 어두워지며 구독 유도 단추 출현.",
        audio: "BGM: 잔잔하게 잦아드는 깔끔한 여운 엔딩 코드. 내레이션: \"지금 바로 실전에 써볼 수 있도록 완벽히 조향된 템플릿은 우측 상단 카드에 상세히 놓았습니다. 함께 다음 단계로 가보시죠.\"",
        timing: "01:15 - 01:30"
      }
    ],
    thumbnails: [
      {
        graphic: `배경은 감성적이고 약간 어두운 방안 조명, [${lowercaseKeyword}]용 핵심 소품이 놓여 있음. 사방에 밝은 조명 후광 효과 탑재.`,
        titleText: "하루만에 10배 늘림",
        vibe: "호기심을 극도로 유발하는 미스터리 신비주의 톤"
      },
      {
        graphic: "화자가 머리를 감싸쥐고 난감해하는 일상 표정 리얼 컷. 뒤 배경에 붉은색 대형 하락 그래프 삽입.",
        titleText: "유튜브 망했음",
        vibe: "위험 감수 본능을 자극하는 리얼리티 경고 톤"
      },
      {
        graphic: "검은색 플랫 배경 위 노란색 굵은 세리프 텍스트 단독 배치. 주변에 반짝이는 골드 동전 입자 그래픽.",
        titleText: "구독500 수익화",
        vibe: "가독성이 가장 뛰어난 핵심 지식 제안 톤"
      }
    ],
    shortsScript: {
      hook: `유튜브 한창 [${lowercaseKeyword}] 채널 올리시는 분들, 딱 30초만 들어보세요. 이거 모르면 6개월 동안 올린 영상 아예 노출 제로 됩니다.`,
      body: `알고리즘이 올해부터 전적으로 가중치를 높인 건 단 하나, 재시청과 댓글 참여도입니다. [${lowercaseKeyword}] 영상을 아무리 길고 화려하게 다듬어봤자, 시청자가 첫 3초 만에 넘기거나 의견 하나 남기지 않고 나가버리면 알고리즘은 부적격 콘텐츠로 직행 분류합니다. 오늘부터 무조건 영상 마지막 컷에 '시청자가 자기 의견을 한 줄 남길 수밖에 없는 구체적인 질문'을 자막으로 박으세요. 이것 하나로 댓글이 세 배 늘고 노출이 다섯 배 커집니다.`,
      cta: "어떤 질문을 던져야 할지 막막하시다면 아래 NuTube 허브나 고정 댓글에 엄선한 템플릿 7개를 공짜로 담아가세요. 지금 바로 확인해 보세요!"
    }
  };
}

// 헬스체크 API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', usingRealGemini: !!ai });
});

// 1. 유튜브 핵심 메타데이터 원클릭 빌더 (Gemini 구조화 응답 생성)
app.post('/api/assistant/generate', async (req, res) => {
  const { keyword } = req.body;
  
  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: '유효한 키워드를 입력해 주세요.' });
  }

  // Gemini API가 사용 가능하다면 실제 생성진행
  if (ai) {
    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          titles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "클릭을 유발하는 자극적이고 트렌디한 유튜브 영상 제목" },
                ctr: { type: Type.NUMBER, description: "예상 노출 클릭률 (8.0 ~ 18.5 사이의 소수점 값)" },
                type: { 
                  type: Type.STRING, 
                  description: "다음 중 정확히 하나를 선택: '거울+깨달음형', '단기 실험형', '위험 회피형', '결과 공개형', '회상 가정형', '스토리텔링형', '정교한 지식인형', '트렌드 편승형'" 
                },
                reason: { type: Type.STRING, description: "이 제목이 높은 CTR을 기록할 것으로 예상되는 구체적인 행동 심리학적 이유" }
              },
              required: ["title", "ctr", "type", "reason"]
            }
          },
          description: { type: Type.STRING, description: "해시태그와 주요 영상 타임라인, 궁금증 유발 텍스트가 포함된 세련된 설명글" },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "조회수 상승을 유도하는 최적의 오가닉 검색 태그 8~12개"
          },
          storyboard: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scene: { type: Type.STRING, description: "씬 번호 및 개요 (예: 'Scene 1: 충격적 오프닝')" },
                visual: { type: Type.STRING, description: "화면 연출 안 (카메라 모션, 자막 스타일, 인물 행동 등 상세 서술)" },
                audio: { type: Type.STRING, description: "내레이션, 효과음(SFX), 어울리는 배경음악(BGM) 톤" },
                timing: { type: Type.STRING, description: "씬 진행 타임 (예: '00:00 - 00:05')" }
              },
              required: ["scene", "visual", "audio", "timing"]
            },
            description: "강박적인 첫 3초 후킹과 자연스러운 세션 유지를 돕는 5단 구성 영상 스토리보드"
          },
          thumbnails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                graphic: { type: Type.STRING, description: "배경 삽화, 중심 인물 표정, 고대비 색조 등 그래픽 배치 요소 기획" },
                titleText: { type: Type.STRING, description: "썸네일에 얹을 고가독성 한글 텍스트 (모바일용, 5글자 내외)" },
                vibe: { type: Type.STRING, description: "전달하려는 핵심 무드 또는 시각적 특징" }
              },
              required: ["graphic", "titleText", "vibe"]
            },
            description: "클릭을 직접 자극하는 맞춤형 썸네일 핵심 연출 시각 기획안"
          },
          shortsScript: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING, description: "시청자를 완전 포획할 첫 0.5초 ~ 3초 훅 내레이션 구성" },
              body: { type: Type.STRING, description: "핵심 요점을 아주 빠른 호흡으로 전하는 짱짱한 본론 텍스트" },
              cta: { type: Type.STRING, description: "댓글 대량 유도 및 채널 구독을 자극하는 세련된 환기 마무리문" }
            },
            required: ["hook", "body", "cta"],
            description: "알고리즘 가중치가 극도로 높아진 60초 이내 최적화 쇼츠 숏폼 대본 세트"
          }
        },
        required: [
          "keyword",
          "titles",
          "description",
          "tags",
          "storyboard",
          "thumbnails",
          "shortsScript"
        ]
      };

      const prompt = `너는 2026년 최신 트렌드를 완전 정복한 글로벌 유튜브 수석 알고리즘 분석관이자 스타 크리에이터 멘토이다.
사용자가 입력한 대박 영상 기획 키워드인 [ ${keyword} ]를 분석하여, 알고리즘 피드에 완벽하게 큐레이션될 수 있고, 시청자의 클릭 욕구를 극대화하며, 세션 이탈을 제로에 가깝게 방어하는 "유튜브 크리에이티브 올인원 패키지"를 기획하라.

다음 사항들을 극도로 준수해라:
1. 제목 suggestions(titles)는 반드시 기획된 8가지 한글 형식에 정확히 부합하게 한국어 감성으로 만들 것. 예상 CTR 점수도 보수적이면서도 세련되게 계산하라.
2. 쇼츠 스크립트는 60초 완독 가능하도록 호흡이 매우 탄탄해야 하며 리듬감이 좋아야 함. 
3. 스토리보드는 영상 전체 흐름(롱폼 또는 핵심 클립)에 적합한 4~6개의 씬별 구성을 가질 것.
4. 설명란(description)은 타임라인 플로우 및 채널 유익 링크 등을 센스있게 포함할 것.

최종 응답은 반드시 사전에 정의된 JSON 스키마에 부합하는 아름다운 JSON 포맷이어야 한다.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.15 // 정확하고 일관된 정량 포맷을 원하므로 살짝 낮춤
        }
      });

      const responseText = response.text || "{}";
      const resultData = JSON.parse(responseText.trim());
      return res.json(resultData);

    } catch (err: any) {
      console.error("Gemini Generation Error, falling back to simulated metadata:", err);
      return res.json(getSimulatedMetadata(keyword, true));
    }
  }

  // AI API 가 없는 경우, 우아하게 정밀 시뮬레이션된 고품격 데모 반환 (사용자 경험을 최고 수준으로 유지)
  console.log("Simulating metadata generation for:", keyword);
  return res.json(getSimulatedMetadata(keyword, false));
});

// 2. 어드바이저 페르소나 챗봇 API (사용자 질문 응대)
app.post('/api/assistant/chat', async (req, res) => {
  const { message, personaKey, chatHistory } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: '메시지를 입력해 주세요.' });
  }

  const systemInstructions: Record<string, string> = {
    algorithm: "너는 '유튜브 알고리즘 수석 설계 분석관'이다. 정교하고 기술적인 어조를 쓰며, 조회수 상승의 심리학 및 알고리즘 작동 매커니즘을 명쾌하고 과학적 데이터와 함께 설명한다.",
    senior: "너는 '감성 사연 디렉터'이다. 다정하고 부드러우며 마음을 돌보는 따뜻한 말투를 쓴다. 시니어 시청자들의 마음을 따뜻하게 가라앉힐 수 있는 진심어린 스토리텔링และ 정직함에 관한 팁을 건넨다.",
    aitools: "너는 '초고속 AI 테크 리드'이다. 에너지가 넘치고 실용주의적이며 시원시원한 어조이다. 귀찮고 번거로운 제작 단계(대본, 오디오 세팅, 자막, 이미지 소싱)를 15배 빠르게 단축시키는 최신 AI 툴과 프롬프트 비법을 빠르게 점수화하여 알려준다.",
    monetization: "너는 '채널 레버리지 컨설턴트'이다. 객관적이고 사업가 마인드를 지녔다. 조회수 광고에만 집착하는 소모적인 모델을 넘어서 제휴 마케팅, 멤버십 혜택 설계, 협찬 영업 단가 책정 등 다각화된 8대 비즈니스 기둥을 체계적으로 멘토링한다.",
    beginner: "너는 초보들의 최고 지지자 '친절한 길잡이 멘토'이다. 매우 격려를 아끼지 않고 귀여우면서도 따스한 말투이다. 첫 발을 내딛는 초보들의 두려움(장비 고가 병, 완벽주의 강박, 노랑딱지 공포)을 부드럽게 씻겨주고 70% 완성도로도 훌륭함을 입증해준다.",
    advanced: "너는 '매출 극대화 그로스해커'이다. 극도로 통계 지향적이고 날카롭다. 채널 정체기에 마주한 중고수들의 전환과 썸네일 단 한 가지의 변수 통제식 A/B 테스트 데이터 수립과 시청 이탈 세터 관리 방안을 시원하고 솔직하게 지적한다."
  };

  const simulatedResponses: Record<string, string[]> = {
    algorithm: [
      "알고리즘 수석 설계 분석관으로서 지적해 드립니다. 지금 질문하신 현상은 데이터 병목 현상에 가깝습니다. 알고리즘은 절대 감정적으로 감쇄하지 않습니다. 최근 5편 영상의 이탈 그래프와 첫 3초 시청 유지 지수(AVD)를 냉정히 들여다보고, 본인 카테고리가 해당 클러스터에 잘 묶여있는지 오가닉 키워드 조향부터 대폭 수정하셔야 승산이 있습니다. 구체적인 시청자 유입 비중 통계를 알려주시면 더욱 매서운 침술 처방을 드릴 수 있습니다.",
      "추천 노선 가우시안 곡선이 미세하게 재조정되고 있습니다. 최근 7일 내 업로드 이력이 추천 가중치를 유지시켜 주는 강력한 신호등입니다. 조급하게 여러 주제를 뒤섞지 마시고, 조회수가 잘 나왔던 영상의 호흡과 리듬을 철저히 복제하여 2편 이상을 일정한 요일과 시간에 발주하십시오. 그것만 지키셔도 알고리즘은 다시 기회를 엽니다."
    ],
    senior: [
      "디렉터 제인입니다. 사연 채널의 힘은 자극성이 아니라 시청자 한 분 한 분이 남기는 긴 참회의 눈물, 위로의 한 줄에서 나옵니다. 영상 마지막에 '누군가에게 위로가 될 따뜻한 사연이 있다면 댓글로 동참해주세요'라고 나직하게 던지시는 것 잊지 마세요. 시청자분들이 그 속에서 기쁜 정을 붙이고 오랜 단골이자 일등 팬이 되는 기적이 일어납니다.",
      "인생에는 참 많은 사연이 있지요. 타인의 실화를 가져다 쓰실 땐 사연 속에 흐르는 깊은 부모님 간의 감동, 친구 사이의 화해를 본질로 삼고, 그분의 아늑한 신원은 철저하게 숨김 옷을 입혀 재구성해주시는 배려만 하시면 충분히 법적으로도 마음으로도 고요하고 아름다운 채널을 세우실 수 있을 거예요."
    ],
    aitools: [
      "생산성 최고 테크 리드입니다! 대본 짜느라 저녁 내내 끙끙 앓고 계신 건 아닌가요? 그건 인력 낭비입니다! 제가 구성한 기막힌 AI 템플릿 프롬프트를 활용해서 초안은 딱 3초 만에 생성하세요! 그리고 그 아낀 8시간 동안 시청자를 후려갈길 초고대비 썸네일 하나 더 다듬고, 컷 전환 템포 조율하는 게 조회수에 100배 이득입니다! CapCut Pro나 Vrew의 자동 한컴 자막 기능을 일단 활성화하세요!"
    ],
    monetization: [
      "수익화 다각화 로드맵을 그려드리겠습니다. 조회수 수십만을 찍어도 구글 수수료 떼고 나면 월급이 안 되어 흔들리는 크리에이터가 태반입니다. YPP 500명을 다자마자 즉시 채널 멤버십의 비밀 정기 혜택을 개방하시고, 평소 본인이 일상에서 쓰는 진짜 애장품 몇 가지를 스튜디오 쇼핑으로 결속하여 어필리에이트 수수료 수익이라는 튼튼한 안전 기둥을 단계적으로 구축하셔야 장기 생존할 수 있습니다."
    ],
    beginner: [
      "우와~! 첫 출발을 정말정말 진심으로 축하드려요! 처음인데 장비가 구려도 될까, 목소리가 이뻐야 할까 너무 많이 고민하느라 아직도 업로드를 안 하신 건 아니죠? 70% 상태의 귀여운 허술함이 시청자에겐 엄청난 친근감이에요! 첫걸음은 남과 절대 비교하지 않고 편안하게 예약 업로드 한 편 올리곤 친구들과 기쁘게 커피 한잔 마시는 거예요. 제가 늘 옆에서 열심히 격려와 박수를 보내드릴게요. 화이팅!"
    ],
    advanced: [
      "그로스해커의 매서운 분석 들어갑니다. 조회수 정체기에 가장 어리석은 짓은 저성과 영상을 기분 상한다고 홧김에 우르르 지워버리는 겁니다. 데이터를 뒤흔들어 알고리즘 낙인을 엉망으로 만드는 자학 행위에 불과합니다. 차분하게 최근 영상 썸네일들을 '인물 얼굴이 있을 때 vs 없을 때', '글자 수가 많을 때 vs 적을 때'처럼 하나의 단독 변수만을 바꿔 7일간 노출 클릭률(CTR) 변화와 세션 지속 분수를 철저히 검사하세요."
    ]
  };

  const selectedInstruction = systemInstructions[personaKey || 'algorithm'] || systemInstructions.algorithm;

  if (ai) {
    try {
      // 대화 흐름 포맷 변환 (Gemini SDK standard)
      const formattedContents: any[] = [];
      
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.slice(-8).forEach(msg => {
          formattedContents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      
      // 현재 메시지 추가
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction: `${selectedInstruction} 유튜브 가이드라인 및 전문적인 지식을 기반으로 하여 다정하고 명확한 한국어로 성심껏 조언해주어라.`,
          temperature: 0.7
        }
      });

      return res.json({ response: response.text || "죄송합니다. 적절한 조언을 구성하는 데 한계에 부딪혔습니다." });

    } catch (err: any) {
      console.error("Gemini Chat Error, falling back to simulated chat response:", err);
      const choice = simulatedResponses[personaKey || 'algorithm'] || simulatedResponses.algorithm;
      const reply = choice[Math.floor(Math.random() * choice.length)];
      return res.json({ 
        response: `${reply}\n\n(※ 실시간 AI 서버 점검 중으로 상담관 비상 메뉴 모드로 자동 매칭되었습니다.)`
      });
    }
  }

  // AI API 가 없는 경우, 우아하게 설계된 페르소나별 룰 기반 고품격 시뮬레이션 응답 제공
  console.log("Simulating chat response for persona:", personaKey);
  const choice = simulatedResponses[personaKey || 'algorithm'] || simulatedResponses.algorithm;
  const reply = choice[Math.floor(Math.random() * choice.length)];
  return res.json({ response: reply });
});

// Vite 및 프로덕션 정적 서빙 미들웨어 연동
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createDynamicViteServer } = await import('vite');
    const vite = await createDynamicViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // 빌드 출력 디스크 에셋 매칭 서빙
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NuTube Server] Running happily on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode!`);
  });
}

startServer();
