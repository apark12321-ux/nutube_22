import React, { useState, useRef, useEffect } from 'react';
import { CategorySpec } from '../types';
import { CATEGORIES_LIST } from '../data';
import { Send, MessageSquare, User, TrendingUp, Heart, Zap, DollarSign, Compass, Award, Circle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// 텍스트 내의 **볼드**, `백틱`, # 헤더, 리스트 및 \n 개행 마크다운 처리를 완벽하게 수행하는 프리미엄 에디토리얼 파서
const renderFormattedText = (text: string, theme: 'light' | 'dark' = 'dark') => {
  if (!text) return null;
  const cleanLines = text.split('\n');
  
  // 인라인 볼드 및 코드 백틱 파싱 도우미
  const renderInlineStyles = (txt: string, idxKey: string): React.ReactNode => {
    let cleanText = txt.replace(/\\`/g, '`').replace(/\\\*/g, '*');
    const parts: React.ReactNode[] = [];
    let currentWord = '';
    let i = 0;
    
    while (i < cleanText.length) {
      if (cleanText.substring(i, i + 2) === '**') {
        if (currentWord) {
          parts.push(<span key={`txt-${idxKey}-${i}`}>{currentWord}</span>);
          currentWord = '';
        }
        i += 2;
        let boldText = '';
        while (i < cleanText.length && cleanText.substring(i, i + 2) !== '**') {
          boldText += cleanText[i];
          i++;
        }
        if (boldText) {
          parts.push(
            <strong key={`bold-${idxKey}-${i}`} className={`font-extrabold mx-0.5 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
              {boldText}
            </strong>
          );
        }
        if (cleanText.substring(i, i + 2) === '**') {
          i += 2;
        }
      } else if (cleanText[i] === '`') {
        if (currentWord) {
          parts.push(<span key={`txt-${idxKey}-${i}`}>{currentWord}</span>);
          currentWord = '';
        }
        i++;
        let codeText = '';
        while (i < cleanText.length && cleanText[i] !== '`') {
          codeText += cleanText[i];
          i++;
        }
        if (codeText) {
          parts.push(
            <code key={`code-${idxKey}-${i}`} className={`font-mono px-1.5 py-0.5 rounded text-xs mx-0.5 border ${
              theme === 'dark' 
                ? 'text-rose-450 bg-slate-950 border-slate-900' 
                : 'text-rose-600 bg-sky-50 border-sky-100'
            }`}>
              {codeText}
            </code>
          );
        }
        if (cleanText[i] === '`') {
          i++;
        }
      } else {
        currentWord += cleanText[i];
        i++;
      }
    }
    
    if (currentWord) {
      parts.push(<span key={`txt-end-${idxKey}`}>{currentWord}</span>);
    }
    
    return <>{parts}</>;
  };
  
  return (
    <div className="space-y-2">
      {cleanLines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Horizontal divider
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className={`my-2.5 ${theme === 'dark' ? 'border-slate-800/80' : 'border-sky-100'}`} />;
        }
        
        // Headings
        if (trimmed.startsWith('## ')) {
          const contentText = trimmed.replace(/^##\s+/, '');
          return (
            <h4 key={idx} className={`pt-2 pb-0.5 text-sm sm:text-base font-extrabold tracking-tight border-b ${
              theme === 'dark' ? 'text-white border-slate-800' : 'text-[#011d33] border-sky-100'
            }`}>
              {renderInlineStyles(contentText, `h2-${idx}`)}
            </h4>
          );
        }
        
        if (trimmed.startsWith('### ')) {
          const contentText = trimmed.replace(/^###\s+/, '');
          return (
            <h5 key={idx} className={`pt-1.5 pb-0.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <span className="inline-block h-3 w-0.5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
              {renderInlineStyles(contentText, `h3-${idx}`)}
            </h5>
          );
        }
        
        if (trimmed.startsWith('#### ')) {
          const contentText = trimmed.replace(/^####\s+/, '');
          return (
            <h6 key={idx} className={`pt-1.5 pb-0.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${theme === 'dark' ? 'bg-amber-400' : 'bg-amber-600'}`} />
              {renderInlineStyles(contentText, `h4-${idx}`)}
            </h6>
          );
        }
        
        // List items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const contentText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className={`pl-3.5 flex items-start gap-1.5 text-xs sm:text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-705'
            }`}>
              <span className="text-purple-500 select-none">•</span>
              <span>{renderInlineStyles(contentText, `li-${idx}`)}</span>
            </div>
          );
        }
        
        // Numbered list items
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const contentText = numMatch[2];
          return (
            <div key={idx} className={`pl-3.5 flex items-start gap-1.5 text-xs sm:text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-705'
            }`}>
              <span className="text-amber-500 font-mono font-bold select-none text-[10px] sm:text-xs">{num}.</span>
              <span>{renderInlineStyles(contentText, `num-${idx}`)}</span>
            </div>
          );
        }
        
        // Empty lines
        if (trimmed === '') {
          return <div key={idx} className="h-1.5" />;
        }
        
        // Standard paragraph
        return (
          <div key={idx} className={`min-h-[1.125rem] text-xs sm:text-sm ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {renderInlineStyles(line, `p-${idx}`)}
          </div>
        );
      })}
    </div>
  );
};

interface PersonaAdvisorProps {
  theme?: 'light' | 'dark';
}

export const PersonaAdvisor: React.FC<PersonaAdvisorProps> = ({ theme = 'dark' }) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('algorithm');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({
    algorithm: [
      {
        id: 'init-alg',
        role: 'assistant',
        text: '반갑습니다. 유튜브 추천 피드와 매칭 최적화를 담당하는 수석 알고리즘 분석관입니다. 귀하의 채널에서 목격되는 시청 지속 시간 저하와 검색 유입 노출 정체 원인을 구체적인 정량적 수치와 함께 상담해 드립니다.',
        timestamp: new Date()
      }
    ],
    senior: [
      {
        id: 'init-sen',
        role: 'assistant',
        text: '안녕하세요. 따스한 인생 사연과 시니어스토리를 기획하는 제인 디렉터입니다. 자극을 이기는 인간적인 진심과 깊은 울림의 대본, 시청자들의 마음을 굳게 잡는 소통 노하우를 차분히 대화해보아요.',
        timestamp: new Date()
      }
    ],
    aitools: [
      {
        id: 'init-ai',
        role: 'assistant',
        text: '안녕하세요! 대본부터 나레이션 자막까지 초고속 생산성을 추구하는 AI 테크 리드입니다. 시간 낭비는 이제 그만! 15배 완독 속도를 자랑하는 최신 비디오 프로세싱 꿀 도구를 콕 짚어서 안내할게요!',
        timestamp: new Date()
      }
    ],
    monetization: [
      {
        id: 'init-mon',
        role: 'assistant',
        text: '반갑습니다. 크리에이터의 든든한 다각화 비즈니스 구조를 조향하는 수익화 컨설턴트입니다. 영양가 없는 단순 조회수 광고만을 넘어, 구독자 500명 수준에서도 월급급 연계 매출을 뽑아낼 8단계 전략을 상담합니다.',
        timestamp: new Date()
      }
    ],
    beginner: [
      {
        id: 'init-beg',
        role: 'assistant',
        text: '와~! 드디어 만나게 되었네요! 첫 채널 개설부터 부끄러운 첫 목소리가 담긴 업로드까지 편하게 가이드를 도와줄 친절한 멘토입니다. 두려움은 저 멀리 날려버리고 가볍게 시작해요! 질문은 아주 사소해도 괜찮아요~!',
        timestamp: new Date()
      }
    ],
    advanced: [
      {
        id: 'init-adv',
        role: 'assistant',
        text: '성장의 임계점 벽에 봉착했군요. 매출 극대화 그로스해커입니다. 감정 낭비 접고, 썸네일 단 하나의 고밀도 변수 통제 검사와 잔존 시청 유지율 분수 관리 등 하드코어 데이터 기둥을 매섭게 짚어드립니다.',
        timestamp: new Date()
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // 현재 활성화된 페르소나 메타 정보
  const currentPersonaSpec = CATEGORIES_LIST.find((c) => c.key === selectedPersona) || CATEGORIES_LIST[0];

  // 챗 스크롤 오토 하단 이동
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, selectedPersona, loading]);

  // 페르소나별 아이콘 맵
  const getPersonaIcon = (key: string, className: string) => {
    switch (key) {
      case 'algorithm': return <TrendingUp className={className} />;
      case 'senior': return <Heart className={className} />;
      case 'aitools': return <Zap className={className} />;
      case 'monetization': return <DollarSign className={className} />;
      case 'beginner': return <Compass className={className} />;
      case 'advanced': return <Award className={className} />;
      default: return <MessageSquare className={className} />;
    }
  };

  // 페르소나별 빠른 추천 오토 질문
  const getQuickQuestions = (key: string) => {
    switch (key) {
      case 'algorithm': return [
        '구독자가 적은데 추천 피드 노출을 유발하려면?',
        '최근 5편 영상 조회수 정체 현상 원인과 해법',
      ];
      case 'senior': return [
        '시니어 사연으로 눈물샘과 고정댓글 반응 끌어내기',
        '유튜브 쇼츠에서 저작권 걱정 없는 사연 제작',
      ];
      case 'aitools': return [
        '비디오 대본 초안 무조건 5초 만에 잘 짜는 법',
        'CapCut과 AI 무료 보이스 툴 연동 팁',
      ];
      case 'monetization': return [
        '구독자 300명으로 첫 부수입 정기 파이프라인 개방하기',
        '협찬 광고 단가 제안 메일 현명하게 쓰는 꿀팁',
      ];
      case 'beginner': return [
        '남들의 화려한 장비와 얼굴 노출 병 부수기',
        '채널 첫 주 업로드 시 피해야 할 사소한 헛짓거리',
      ];
      case 'advanced': return [
        '썸네일 노출 클릭률(CTR) 15% 이상 뽑아내는 기하학 공식',
        '시청자 무단 이탈율 그래프에서 반등 구간 만들기',
      ];
      default: return [];
    }
  };

  // 전송 핸들러
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date()
    };

    // 로컬 히스토리 즉시 기록
    const currentHistory = chatHistory[selectedPersona] || [];
    const updatedHistory = [...currentHistory, userMsg];
    setChatHistory(prev => ({
      ...prev,
      [selectedPersona]: updatedHistory
    }));
    setInputMessage('');
    setLoading(true);

    try {
      // 서버 Gemini API 프록시 호출
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.text,
          personaKey: selectedPersona,
          chatHistory: updatedHistory.map((m) => ({
            role: m.role,
            text: m.text
          }))
        }),
      });

      if (!res.ok) throw new Error('채팅 실패');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.response || '조언 구성 도중 실패했습니다. 다시 시도해주십시오.',
        timestamp: new Date()
      };

      setChatHistory(prev => ({
        ...prev,
        [selectedPersona]: [...prev[selectedPersona], assistantMsg]
      }));

    } catch (err) {
      console.error("Chat client-side error fallback:", err);
      
      const getSmartFallbackResponse = (personaKey: string, queryStr: string): string => {
        const msg = queryStr.toLowerCase();
        
        if (personaKey === 'algorithm') {
          if (msg.includes('추천 피드') || msg.includes('구독자')) {
            return `## 📊 알고리즘 분석관의 추천 피드 노출 비책

구독자가 0명 또는 극소수인 상태에서 추천 알고리즘의 선택을 받기 위해서는 다음 3단계 **노출 유발 구조**를 충족해야 합니다:

1. **시드 타겟팅 고정**: 유튜브 시스템이 초기에 귀하의 영상을 누구에게 보여줄지 판단하는 기준은 '유사 채널 시청층'입니다. 검색창에 카테고리 1위 채널들을 입력하시고, 그 채널들의 최근 조회수 폭발 영상과 **해시태그 및 설명란 구성**을 75% 유사하게 설계하여 메타데이터 단서를 제공하십시오.
2. **첫 30초 잔존율 45% 돌파**: 추천 피드 확장 여부는 첫 시드 시청자들의 30초 유지 지표가 결정합니다. 인트로는 3초 내에 핵심 결론을 예고하고, 고대비 비주얼을 교체하여 넘김 본능을 강제로 억제시키십시오.
3. **오가닉 댓글 트리거**: 영상 마지막에 "예스 혹은 노"로 명확히 나뉘는 투표 질문을 배치하십시오. 댓글이 활성화되는 순간, 알고리즘은 이를 '활성 콘텐츠'로 규정하여 추천 볼륨을 넓혀갑니다.`;
          }
          if (msg.includes('정체') || msg.includes('조회수')) {
            return `## 🔍 최근 5편 조회수 정체 원인 정밀 진단

채널이 침체기에 접어들었을 때 악순환을 끊기 위한 **데이터 복구 가이드**입니다:

- **1단계: 이탈 곡선 골짜기 추적**
  유튜브 스튜디오 내부 '시청 지속 시간 분석'에 들어가셔서 각 영상의 **급격한 낙하 지점(골짜기)**을 확인하십시오. 지루한 정적 화면, 불필요한 사설, 맥이 끊기는 아웃트로가 배치된 구간이 있다면 즉시 다음 영상 편집본에서 해당 패턴을 덜어내야 합니다.
- **2단계: 노출 클릭률(CTR) 심폐소생**
  조회수는 나오지 않는데 노출수만 확보되는 상황이라면 썸네일과 제목 디자인의 부조화가 원인입니다. 글자 수를 5자 이내로 파격적으로 떼어내고, 고대비 노란색/흰색 배열을 사용하여 시각적 파괴력을 30% 보강하십시오.
- **3단계: 낙인 이력 분쇄**
  저성과 영상을 홧김에 우르르 지우는 행위는 채널 인덱싱을 망가뜨립니다. 지우지 마시고, 썸네일과 제목만 단독 변수로 바꾼 뒤 48시간 동안 지표 추세를 모니터링하십시오.`;
          }
          return `## 📊 수석 알고리즘 분석관의 트래픽 조언

유튜브 추천 피드 및 피드 메커니즘을 뚫어내는 기본 솔루션입니다:

- **채널 중심점 정렬**: 알고리즘은 하나의 채널에서 다양한 카테고리를 수시로 횡단하는 무질서함을 극대로 기피합니다. 하나의 타겟 대상을 뾰족하게 도려내서 한 우물만 3달간 뚝심 있게 업로드하시는 게 검색 매칭을 뚫어내는 정석입니다.
- **AVD와 CTR의 조화**: 조회수가 한 계단 점핑하기 위해서는 평균 지속시간 60%와 CTR 8% 대가 황금비로 맞물려야 합니다. 영상을 올린 당일 클릭은 유도했으나 지속 시간이 최하위라면 즉각 썸네일 제목 낚시 수위를 순화하십시오.`;
        }
        
        if (personaKey === 'senior') {
          if (msg.includes('눈물샘') || msg.includes('고정댓글')) {
            return `## 🌸 디렉터 제인의 감성 소통 처방전

시니어 사연 콘텐츠에서 폭발적인 공감과 눈물샘, 그리고 수백 개의 댓글 릴레이를 이끌어내는 핵심 비결은 **'자기 투사(Self-Projection)'** 기법입니다:

1. **내 삶과 겹치는 첫마디**: "한평생 자식만 보고 살다가, 문득 거울 속 늙어버린 내 얼굴을 보며 눈물 흘려보신 적 있으신가요?"처럼 시청자의 현실적 외로움을 전면으로 관통하는 질문으로 오프닝을 시작하세요.
2. **정적과 감성의 빈틈 채우기**: 내레이션 중간중간에 잔잔하고 애절한 로우파이 가야금이나 피아노 BGM을 깔고, 1.5초 정도의 의도적인 여운 침묵(Pause)을 배치하십시오. 이 여백에 깊은 몰입과 눈물이 스며듭니다.
3. **고정댓글을 통한 소통 광장 마련**: 영상 업로드 즉시 고정댓글로 "살아오시며 가장 미안했던 분의 이름을 댓글로 속삭여주세요. 함께 위로의 마음을 가라앉혀 보아요."라고 따스하게 제안하십시오. 시청자분들이 서로를 다독이는 아름다운 소통 일등 팬덤이 즉각 형성됩니다.`;
          }
          if (msg.includes('저작권') || msg.includes('사연')) {
            return `## 📜 저작권 걱정 없는 사연 제작 로드맵

사연 채널 운영 시 법적인 제재나 노랑딱지를 완벽하게 회피하고 순수 창작권을 방어하는 실용 수칙입니다:

- **1단계: 완전한 각색 및 가명화 공정**
  인터넷 커뮤니티나 제보된 원문의 줄거리를 그대로 읽는 것은 저작권 침해 및 중복 콘텐츠 판정의 주원인입니다. 핵심 뼈대(갈등, 화해)만 취하고, 등장인물의 이름, 나이, 직업, 구체적 장소, 에피소드 정황을 85% 이상 완전히 새로운 문체로 각색하여 재창조하십시오.
- **2단계: 상업용 리소스 완전성 확보**
  배경에 사용되는 감성 삽화나 비디오 클립은 반드시 Pixabay, Pexels, 혹은 Midjourney 등으로 직접 제작한 저작권 프리 소스만을 활용하십시오. 음원은 유튜브 오디오 라이브러리 공식 출처를 필히 등록해 사용하세요.
- **3단계: AI 기계음 중화**
  나레이션 녹음 시 비록 AI 보이스를 쓰더라도 효과음 설계, 오디오 컴프레셔 조율 등의 수작업 디렉팅 요소를 다량 주입해야 기계적 판정을 확실하게 방어할 수 있습니다.`;
          }
          return `## 🌸 제인 디렉터의 마음 위로 상담소

따뜻하고 보람 있는 감성 채널을 세우기 위한 핵심 조언입니다:

- **목소리의 아늑함 유지**: 성우나 나레이션 보이스를 기용하실 때 소리의 음역대를 지나치게 높거나 빠른 속도로 달리지 않도록 통제해 가라앉히는 차분함이 절대적 가치입니다.
- **공감적 댓글에 대한 하트 보상**: 댓글이 등록되는 즉시 하트 리액션과 함께 다정하게 조율된 대화를 이어가면, 알고리즘은 이 커뮤니티 정합 점수를 대단히 높게 대우해 전체 인덱스를 폭발적으로 추천합니다.`;
        }
        
        if (personaKey === 'aitools') {
          if (msg.includes('대본') || msg.includes('초안') || msg.includes('5초')) {
            return `## ⚡ 15배 빠른 비디오 대본 초안 생성 프롬프트

대본 작성을 위해 흰 화면을 응시하며 끙끙대던 시간은 이제 안녕입니다. 5초 만에 완벽한 후킹 구조의 대본을 뽑아내는 **테크 리드의 특급 프롬프트 비기**입니다:

\`\`\`markdown
[역할]: 50만 대형 채널의 수석 유튜브 쇼츠 작가
[작업]: {입력한 주제}에 대한 60초 분량의 대본 작성
[구조 규칙]:
1. 0~3초: 상식을 뒤집는 한 문장 충격 후킹 ("정말 믿기 힘든 사실 하나 알려드릴까요?")
2. 3~15초: 공감 유발 및 위기 고조 ("하루 종일 공들였는데 조회수 0회인 진짜 이유...")
3. 15~45초: 바로 적용 가능한 극적인 2가지 실전 팁 제시 (간결하고 명쾌하게)
4. 45~60초: 즉각적인 오토 댓글 작성을 유도하는 질문형 마커 및 무료 비책 제공 CTA 언급
\`\`\`

이 구조화 지시를 복사해 사용하시고, 텍스트 반환 즉시 어휘 교정 및 나만의 생생한 에피소드 한 줄만 결속해 주시면 하루에 쇼츠 대본을 15개 이상 양산할 수 있습니다.`;
          }
          if (msg.includes('capcut') || msg.includes('보이스') || msg.includes('연동')) {
            return `## 🎬 CapCut & AI 보이스 연동 생산성 극대화 가이드

무료 도구의 유기적 결합만으로 영화 제작 등급의 깔끔한 콘텐츠를 고속 양산하는 실전 매뉴얼입니다:

1. **AI 보이스 고품질 인출**: ElevenLabs, 클로바더빙, 혹은 온에어스튜디오 등을 이용해 나레이션 음성 파일(.mp3)을 출력하십시오. 이때 문장 간 간격을 0.5초 정도로 타이트하게 설정해 텐션을 극대화해야 합니다.
2. **CapCut 오디오 싱크 및 자동 자막**: CapCut 데스크톱 버전을 기동하시고, 출력한 AI 음성을 가져옵니다. 상단 메인 메뉴의 [Text] -> [Auto Captions] 기능을 단 한 번만 실행하면, 음성 언어를 정밀 탐지하여 완벽한 한국어 자막 싱크가 실시간 완료됩니다.
3. **비주얼 리듬감 매칭**: 나레이션 데시벨 파형의 튀는 구간(강조점)과 배경 음악의 킥 베이스 포인트를 일치시켜서 자막 컷 전환을 진행하십시오. 시청자는 이 시각적-청각적 싱크에 압도되어 이탈을 멈추게 됩니다.`;
          }
          return `## ⚡ 초고속 AI 테크 리드의 15배 생산성 처방

당신의 제작 공정을 완전히 단축하고 시간 소모 강박을 부서는 AI 테크 활용법입니다:

- **무료 자동 리소스 풀 활용**: Pexels, Pixabay, Canva 및 미드저니의 생성 에셋을 연동하여 1초 이내 고대비 배경 컷을 실시간 셋업하십시오.
- **배속 음성 최적화**: 숏폼 영상 제작 시 한 글자 한 문장 간의 사운드 빈틈을 CapCut 편집선에서 완전히 단타 절개(Cut)하여 청각적 집중력을 극대화하십시오.`;
        }
        
        if (personaKey === 'monetization') {
          if (msg.includes('300명') || msg.includes('부수입') || msg.includes('파이프라인')) {
            return `## 💸 구독자 300명으로 월급급 정기 파이프라인 개방 비책

조회수가 수십만 회 나와야만 먹고사는 단순 조회수 광고(AdSense) 의존도를 타파하고 소액 구독자 충성 고객을 기폭하는 **8단계 수익 다각화 구조**입니다:

- **1단계: 고관여 타겟팅 제휴 마케팅 (쿠팡 파트너스 포함)**
  단순 일상 사연이 아닌, "오늘 언급된 시니어를 위한 무릎 보호대" 혹은 "제가 직접 써보고 눈 피로를 완전히 없앤 LED 안경"과 같이 영상 주제에 극적으로 엮인 실제 구매 링크를 댓글 고정 영역에 제휴 마케팅 링크로 배치하십시오. 구매액의 3~8%가 수수료로 매일 즉각 적립됩니다.
- **2단계: 채널 멤버십 마이크로 혜택 결속**
  구독자 500명 달성 시 즉시 활성화되는 유튜브 팬 멤버십 기능을 노려야 합니다. 월 1,900원 수준의 최저 진입 장벽을 세우고, "사연 텍스트 무보정 파일 공유", "구독자 채널 1:1 진단서 배포" 등 한 번 세팅하면 시간 소모가 거의 없는 마이크로 혜택을 결속하여 충성 단골 매출을 구조화하십시오.
- **3단계: 전자책 및 맞춤형 템플릿 세일즈**
  나만의 공략집을 PDF 15페이지짜리 소책자로 압축해 크몽 또는 아임웹 독립몰에 장착 후 유튜브 본문 링크로 연결하십시오. 단 한 권 판매로 조회수 수만 회 값의 마진이 남습니다.`;
          }
          if (msg.includes('협찬') || msg.includes('제안 메일')) {
            return `## 📧 광고주 파트를 사로잡는 고마진 제안 메일 공식

구독자 수가 적더라도 확실한 구매 전환율(Conversion)을 입증하여 브랜드 광고주들의 지갑을 강제로 개봉시키는 **실전에 즉각 도용 가능한 카피라이팅 템플릿**입니다:

\`\`\`text
제목: [제안] 귀사 {브랜드명}의 {제품명}을 2026 타깃 맞춤 시청층에 극적으로 각인시켜 드립니다.

안녕하세요, {귀사 담당자님 / 대표님},
구독자 수 대비 실 시청자 고관여 82%를 돌파 중인 {내채널명}의 크리에이터 {본명}입니다.

저희 채널 시청층은 귀사 {제품명}에 즉각 반응할 수밖에 없는 분들로 90% 구성되어 있으며, 최근 올린 영상 정보는 타 채널 대비 평균 2배인 7분 40초의 초고밀도 시청 잔류 수치를 기록하고 있습니다.

단순 성의 없는 PPL이 아닌, 귀사 브랜드가 갖춘 철학을 영상 오프닝 씬에 깊은 에피소드로 녹여내 '댓글창 구매 전환 링크'로 즉각 연결시키려 합니다.

이번 주 수요일 전까지 회신해 주시면 타사 중복 진행을 보류하고 특별 런칭 패키지로 성심껏 메타 데이터를 연출해 내겠습니다. 제안 제휴서 1부를 첨부합니다. 감사합니다.
\`\`\`

이 형식을 기본 골조로 취하신 뒤 발송하십시오. 브랜드 마케팅 부서는 이런 데이터 기반의 과감한 제안을 목 타게 기다리고 있습니다.`;
          }
          return `## 💸 채널 수익 조율 컨설턴트 멘토링

광고 단가가 유독 높고 지속적으로 돈이 솟구치는 가치 있는 채널을 설계하는 방안입니다:

- **타겟 시청자 연령층 설계**: 얇은 10대 시청층보다, 실제 지갑을 열고 구매를 결제할 수 있는 고관여 30대~50지 지향층 주제가 애드센스 단가에서도 3배 이상 막대한 보너스 리워드를 지급받게 해 줍니다.
- **정기 제휴선 미리 개방**: YPP 통과만을 세월아 네월아 기다리기보다, 미리 나만의 제품 제휴 링크나 관련 보조 전자 도서 가이드 판촉을 믹스 매치해 두십시오.`;
        }
        
        if (personaKey === 'beginner') {
          if (msg.includes('장비') || msg.includes('얼굴 노출')) {
            return `## 📸 장비 부담과 얼굴 노출 공포를 부수기 위한 팩트 체크

첫 채널 개설을 고질적으로 망가뜨리는 완벽주의 강박증을 무참히 파괴해 드립니다. **초보 딱지를 고속 도려내는 3대 진실**:

1. **얼굴 없는 채널(Faceless Channel)의 폭발적 증가**: 대다수 2026년 대박 채널들은 화려한 얼굴 공개가 아니라, 화면을 전환해 주는 적절한 감성 삽화 라이브러리와 텍스트 자막, 그리고 귀가 가려운 깔끔한 나레이션 조율로만 수만 달러의 매출을 인출하고 있습니다. 카메라 공포증을 억지로 견디지 마시고 얼굴 없는 콘셉트로 당당히 시동하십시오.
2. **100만 원짜리 비싼 마이크는 낭비**: 유튜브 시청자의 87%는 무선 이어폰이나 저가 스마트폰 스피커로 오디오를 직접 수신합니다. 수 수십만 원 가량의 스튜디오 등급 콘덴서 마이크 대신, 지금 가지고 계신 스마트폰 내장 녹음기 앱을 켜고 입에 가까이 대어 숨소리를 죽여 차분하게 녹음하시는 것만으로 이미 충분합니다.
3. **핵심은 리듬과 유용성**: 4K UHD 화질의 호화 카메라 무빙보다, 단 15초라도 시청자가 "이건 내 이야기 같은데?"라며 삶의 유용성이나 정서적 안식처를 수혜받을 수 있는 기획력의 기둥이 조회수의 99%를 강제 견인합니다. 가볍게 시작하십시오!`;
          }
          if (msg.includes('첫 주') || msg.includes('헛짓거리')) {
            return `## 🚫 채널 개설 첫 주에 초보들이 목숨 걸고 피해야 할 3대 헛짓거리

기념비적인 첫 영상 업로드 단계에서 대다수 98%의 신규 크리에이터가 무심코 저지르고 마는 **성장 자폭 행위 체크리스트**입니다:

- **헛짓거리 1: 주변 지인에게 "구독 눌러줘" 카톡 갈기기**
  귀하의 지인들은 귀하의 사연/주제 카테고리에 전혀 관심이 없는 체리피커입니다. 이들이 착한 마음에 구독을 선뜻 늘리더라도 업로드된 영상을 첫 3초 만에 넘겨버리거나 전혀 시청하지 않는 행동을 유발시킵니다. 알고리즘은 이를 보고 "어라, 구독자조차 외면하는 것을 보니 쓰레기 콘텐츠군"으로 오독하여 채널의 노출 추천 생명력을 초장에 완전히 도살해버립니다. 순수하게 우주의 알고리즘 노출만을 노리세요.
- **헛짓거리 2: 홧김에 비공개 전환 및 지우기**
  올린 지 3시간 동안 조회수가 0회인 것에 실망해 영상을 숨기거나 삭제하여 재업로드하는 우를 범하지 마세요. 구글 서치봇은 이를 '조회수 조작성 스팸 이력'으로 매섭게 낙인찍어 추천 랭크를 무참하게 깎아내립니다. 최소 5일간 차분히 두고 알고리즘 기계가 인덱싱하도록 칭찬을 아끼고 두십시오.
- **헛짓거리 3: 매일 1편씩 무자비하게 물량 공세하기**
  주 1~2편이라도 클릭하고 싶게 기획된 정밀 썸네일과 탄탄한 후킹 대본을 지니는 것이, 대충 공장에서 찍어낸 스팸성 1일 1영상 10편보다 백 배 권위 있습니다. 양보다 밀도에 베팅하십시오.`;
          }
          return `## 🌸 따뜻한 초보 구원 멘토의 정겨운 손잡기

처음에 꼭 드리고 싶은 다정한 응원의 말입니다:

- **완벽함은 악마의 속삭임**: 100% 완전한 기획이란 우주에 존재할 수 없습니다. 70%의 다소 투박하고 귀여운 날것 그대로의 활기와 참신함을 지녀도 대다수 인간적인 댓글들이 붙으며 자연스레 성장 전선이 맞대어집니다.
- **초기 노출 정체의 의연한 인내**: 업로드 초기엔 48시간 이상 아무런 피드 움직임이 없는 게 시스템 특성상 지극히 과학적이고 당연한 상식입니다. 낙담하지 마시고 다음 기획안 썸네일 대비에 차분하게 힘을 가꾸세요.`;
        }
        
        if (personaKey === 'advanced') {
          if (msg.includes('클릭률') || msg.includes('ctr') || msg.includes('공식')) {
            return `## 📐 노출 클릭률(CTR) 15% 이상 뽑아내는 시각 기하학 공식

썸네일 클릭 확률을 과학적 계산 등급으로 설계하여 시청자의 무의식적인 터치를 포획해내는 **그로스해킹 썸네일 조향 매뉴얼**입니다:

1. **3분할 중심 소품 고정**: 인간의 좌우 안구 운동 특성상, 시선을 가장 빠르게 포획하는 구간은 좌측 33% 영역과 정중앙입니다. 여기에 귀하가 제안할 깜짝 소품이나 표정이 풍부한 대표 인물 컷을 과장되게 볼드 배치하십시오.
2. **한 줄 텍스트 5자 이내 도려내기**: "조회수 늘리는 공식 대공개"처럼 지루하고 긴 설명을 버리세요. "이거 망했음", "하루 만에 10배"처럼 폰트 크기를 화면 높이의 25% 가량으로 가혹하게 키워 노랑/하양 고대비 컬러로 3~5글자 단극을 후리십시오.
3. **우측 미디어 워터마크 회피**: 유튜브가 강제로 적용하는 긴 비디오 플레이 러닝타임 자막이 항상 썸네일 우측 하단을 물리적으로 지워버립니다. 이 25% 하단 우측 궤적에는 글자나 핵심 삽화를 어떠한 경우라도 절대 배치하지 말고 완전히 비워두시는 게 유실 없는 클릭률을 통제해줍니다.`;
          }
          if (msg.includes('이탈율') || msg.includes('반등') || msg.includes('지속')) {
            return `## 📈 시청자 무단 이탈 방지 및 반등 구간 설계 전술

영상 초반 30초 이후 물 밀듯이 빠져나가는 체류 시간 이탈률을 강제로 억여매고 오히려 리텐션 곡선이 솟구쳐 오르게 만드는 **지속율 조향 비공개 비기**입니다:

- **1단계: 15초 단위의 시각적 전환 (Visual Shift)**
  한 구도의 정적인 풍경을 계속 이어가면 뇌는 이를 광고판으로 오독하여 탈출 본능을 점화합니다. 12~15초마다 강제 카메라 줌인/줌아웃, 보조 인물 삽화 크롭 인, 화면 전체에 타이포그래피 슬라이드 단타를 가해 시청자의 시각적 각성 상태를 30% 높여주어야 합니다.
- **2단계: '인지적 갭(Cognitive Gap)' 지속적 파종**
  영상 2분 지점에 "그런데 이보다 10배 더 강력한 비밀 하나가 4분 후에 밝혀집니다"라며 미리 호기심 떡밥을 파종하여 보상 심리를 억누른 채 스킵 제동을 강제 조작하십시오.
- **3단계: 가청 영역 컴프레션 보강**
  나레이션 음성의 파동이 가늘어지며 볼륨이 가라앉을 때 시청자의 이탈이 가장 빈번합니다. 레벨 라우드니스를 -14 LUKs 표준으로 확실하게 마스터 컴프레셔 가동을 마쳐 무음 빈틈을 없애십시오.`;
          }
          return `## 📈 매출 극대화 그로스해커의 실시간 데이터 지적

- **A/B 변수 고정 통제**: 한 번에 제목과 썸네일을 다 바꾸면 어떤 변수가 효과를 부른 지 파악이 어렵습니다. 썸네일 이미지 파일만 홀로 수정하고 24시간 동안 유입률 변화 추이를 대조 분석하는 것이 참된 데이터 분석의 자질입니다.
- **아웃트로의 정격 떡밥 장착**: 마지막 인사를 정량적으로 "오늘 시청해주셔서 감사합니다"라고 끝낸 순간 이탈 그래프는 낭떠러지를 칩니다. 인사를 건네기 전에 다음 시크릿 영상을 반드시 자연스럽게 이어 노출 시그널을 연계하십시오.`;
        }
        
        return "죄송합니다. 적절한 조언을 구성하는 중 네트워크 오류가 발생하였으나, AI 상담을 위한 기본 비책 가이드 장벽은 정상 동작 중입니다.";
      };

      const fallbackReply = getSmartFallbackResponse(selectedPersona, userMsg.text) + "\n\n(※ 실시간 AI 서버 점검 중으로 상담관 비상 메뉴 모드로 임시 매칭되었습니다.)";

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: fallbackReply,
        timestamp: new Date()
      };

      setChatHistory(prev => ({
        ...prev,
        [selectedPersona]: [...prev[selectedPersona], assistantMsg]
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" id="persona-advisor-root">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-14rem)] lg:min-h-[580px]">
        
        {/* 전문가 선택 패널 (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:overflow-y-auto pr-1" id="advisor-selector-panel">
          <div>
            <h3 className={`font-display font-black text-xl ${theme === 'dark' ? 'text-white' : 'text-[#011d33]'}`}>
              NuTube 전문 멘토 6선
            </h3>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>
              상담을 원하는 유튜브 성장 도우미를 클릭하시면, 1:1 디렉팅 포트가 실시간 매칭됩니다.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-2.5 pb-2 overflow-x-auto lg:overflow-x-visible">
            {CATEGORIES_LIST.map((spec) => {
              const isActive = selectedPersona === spec.key;
              return (
                <div
                  key={spec.key}
                  id={`advisor-card-${spec.key}`}
                  onClick={() => setSelectedPersona(spec.key)}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 w-[240px] min-w-[240px] lg:w-auto lg:min-w-0 select-none ${
                    isActive 
                      ? theme === 'dark'
                        ? 'bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40 translate-x-1 ring-1 ring-sky-500/20 text-white' 
                        : 'bg-white border-sky-400 shadow-md shadow-sky-100/60 translate-x-1 ring-1 ring-sky-500/20 text-slate-800'
                      : theme === 'dark'
                        ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-800 text-slate-300'
                        : 'bg-sky-50/50 border-sky-100/80 hover:bg-sky-100/50 hover:border-sky-200 text-slate-650'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${spec.gradient} shadow text-white`}>
                    {getPersonaIcon(spec.key, 'h-5 w-5')}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className={`text-xs font-bold block truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {spec.label} 전담
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                        <Circle className="h-1.5 w-1.5 fill-emerald-500" />
                        <span>대기중</span>
                      </span>
                    </div>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {spec.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1:1 라이브 채팅 창 (8 Columns) */}
        <div className={`lg:col-span-8 flex flex-col rounded-2xl border overflow-hidden shadow-2xl h-[540px] sm:h-[620px] lg:h-full ${
          theme === 'dark' 
            ? 'border-slate-800 bg-slate-950/80 shadow-slate-950/70' 
            : 'border-sky-100 bg-white shadow-sky-100/40'
        }`} id="advisor-chat-window">
          
          {/* 채팅방 상단 바 */}
          <div className={`border-b px-5 py-4 flex items-center justify-between gap-4 ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-sky-100 bg-sky-50/50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${currentPersonaSpec.gradient} text-white`}>
                {getPersonaIcon(selectedPersona, 'h-5.5 w-5.5')}
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-850'}`}>
                  <span>{currentPersonaSpec.label} 1:1 밀착 어드바이저</span>
                </h4>
                <p className="text-[10px] text-emerald-405 font-mono">
                  ● LIVE-CHAT CONNECTED (GEMINI 3.5 FLASH)
                </p>
              </div>
            </div>
            <div className={`text-[11px] font-mono hidden sm:block ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              비책 정보 완벽 무장
            </div>
          </div>

          {/* 채팅 내용 렌더링 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" id="chat-messages-container">
            {(chatHistory[selectedPersona] || []).map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isAssistant ? '' : 'ml-auto flex-row-reverse'}`}
                >
                  {isAssistant && (
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${currentPersonaSpec.gradient} text-white text-xs`}>
                      {getPersonaIcon(selectedPersona, 'h-4.5 w-4.5')}
                    </div>
                  )}

                  <div>
                    <div className={`rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isAssistant 
                        ? theme === 'dark'
                          ? 'bg-slate-900 text-slate-200 border border-slate-850 rounded-tl-none font-sans' 
                          : 'bg-sky-50 text-slate-800 border border-sky-100 rounded-tl-none font-sans'
                        : 'bg-gradient-to-br from-rose-500 to-red-650 text-white rounded-tr-none font-bold'
                    }`}>
                      {renderFormattedText(msg.text, theme === 'light' ? 'light' : 'dark')}
                    </div>
                    <span className="text-[9px] text-slate-500 font-sans tracking-tight mt-1.5 block" style={{ textAlign: isAssistant ? 'left' : 'right' }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 로딩 표시기 */}
            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${currentPersonaSpec.gradient} text-white animate-spin text-xs`}>
                  {getPersonaIcon(selectedPersona, 'h-4 w-4')}
                </div>
                <div>
                  <div className={`rounded-xl p-3.5 border rounded-tl-none text-xs flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-slate-400 border-slate-850'
                      : 'bg-sky-50 text-slate-600 border-sky-100/80'
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span>상담관이 전문 진단 처방을 구성하는 중...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* 간이 고민 질문 추천 바 */}
          <div className={`px-5 py-3 border-t text-xs ${
            theme === 'dark' 
              ? 'border-slate-900 bg-slate-900/20' 
              : 'border-sky-100 bg-sky-50/20'
          }`}>
            <p className={`text-[10px] font-bold mb-2 font-mono uppercase tracking-wider ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-450'
            }`}>추천 실무 컨설팅 질문:</p>
            <div className="flex flex-wrap gap-2 lg:max-h-24 lg:overflow-y-auto">
              {getQuickQuestions(selectedPersona).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSendMessage(q)}
                  className={`px-2.5 py-1 text-left rounded-lg border transition-colors text-[10px] sm:text-xs text-ellipsis overflow-hidden cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                      : 'bg-sky-50/80 border-sky-150 text-sky-800 hover:bg-sky-100/80 hover:text-sky-900 hover:border-sky-300'
                  }`}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* 입력 필드 영역 */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-sky-100 bg-sky-50/50'
          }`}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex gap-2"
            >
              <input 
                type="text" 
                id="chat-user-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                placeholder={`${currentPersonaSpec.label} 멘토에게 실무 고민을 털어놓으세요...`}
                className={`flex-1 rounded-xl border py-3 px-4 text-xs sm:text-sm focus:outline-none transition-all ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:border-purple-500'
                    : 'border-sky-200 bg-white text-slate-805 placeholder-slate-400 focus:border-sky-500'
                }`}
                required
              />
              <button
                type="submit"
                id="chat-send-btn"
                disabled={loading || !inputMessage.trim()}
                className="rounded-xl px-5 py-3 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-505 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-500/10 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
