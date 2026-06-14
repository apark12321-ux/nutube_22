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
const renderFormattedText = (text: string) => {
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
            <strong key={`bold-${idxKey}-${i}`} className="font-extrabold text-amber-300 mx-0.5">
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
            <code key={`code-${idxKey}-${i}`} className="font-mono text-rose-400 bg-slate-950 px-1.5 py-0.5 rounded text-xs mx-0.5 border border-slate-900">
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
          return <hr key={idx} className="my-2.5 border-slate-800/80" />;
        }
        
        // Headings
        if (trimmed.startsWith('## ')) {
          const contentText = trimmed.replace(/^##\s+/, '');
          return (
            <h4 key={idx} className="pt-2 pb-0.5 text-sm sm:text-base font-extrabold text-white tracking-tight border-b border-slate-800">
              {renderInlineStyles(contentText, `h2-${idx}`)}
            </h4>
          );
        }
        
        if (trimmed.startsWith('### ')) {
          const contentText = trimmed.replace(/^###\s+/, '');
          return (
            <h5 key={idx} className="pt-1.5 pb-0.5 text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span className="inline-block h-3 w-0.5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
              {renderInlineStyles(contentText, `h3-${idx}`)}
            </h5>
          );
        }
        
        if (trimmed.startsWith('#### ')) {
          const contentText = trimmed.replace(/^####\s+/, '');
          return (
            <h6 key={idx} className="pt-1.5 pb-0.5 text-xs sm:text-sm font-semibold text-amber-400 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
              {renderInlineStyles(contentText, `h4-${idx}`)}
            </h6>
          );
        }
        
        // List items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const contentText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className="pl-3.5 flex items-start gap-1.5 text-xs sm:text-sm text-slate-300">
              <span className="text-purple-400 select-none">•</span>
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
            <div key={idx} className="pl-3.5 flex items-start gap-1.5 text-xs sm:text-sm text-slate-300">
              <span className="text-amber-400 font-mono font-bold select-none text-[10px] sm:text-xs">{num}.</span>
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
          <div key={idx} className="min-h-[1.125rem] text-slate-200 text-xs sm:text-sm">
            {renderInlineStyles(line, `p-${idx}`)}
          </div>
        );
      })}
    </div>
  );
};

export const PersonaAdvisor: React.FC = () => {
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
      const simulatedResponses: Record<string, string[]> = {
        algorithm: [
          "알고리즘 분석관의 긴급 피드백: 현재 트래픽이 높은 경우, 노출 클릭률(CTR)과 평균 시청 지속 시간(AVD)의 꼬리 부분을 세부 통제하여 알고리즘 점수를 방어하십시오. 채널 분석 탭의 유입 비중 통계를 한 번 더 전면 추적해 보시는 것을 추천해 드립니다.",
          "알고리즘 분석관 의견: 시청 이력이 아직 충분치 않은 초기 채널의 경우, 유사한 대형 채널의 썸네일과 하단 소스 태그들의 조향 흐름을 모사하는 기마론적 전략이 가장 높은 효율의 시드 점수를 획득하게 해 줍니다."
        ],
        senior: [
          "디렉터 제인의 마음 조언: 타인의 인생 지혜를 채널에 빌릴 때, 극적인 전개를 위해 자극적 요소를 과장하기보다 사연 하나하나에 깃든 위로와 교훈의 한 자락을 정성스레 다독이는 것이 시청자들의 눈시울과 오랜 단골 화력을 끌어내는 정석입니다."
        ],
        aitools: [
          "테크 리드의 꿀팁: 영상 초안 작성을 위해 매일 시간을 소모하는 번거로움을 멈추세요! AI 텍스트 생성 가이드나 CapCut 등 자동 편집 프리셋을 이용해 제작 시간을 1/15로 축소하고, 마크업 피드 분석에 더욱 많은 시간을 배팅하시는 게 전체 성장에 배로 유리합니다."
        ],
        monetization: [
          "수익화 제언: 단순히 노출형 AdSense 수익에만 연명해서는 채널 안정성이 심하게 흔들립니다. YPP 통과 시 즉각 제휴 마케팅 링크나 이커머스 쇼핑 연결 등을 다각도로 결속하여 안전한 8개 파이프라인 기둥을 세우는 것을 최우선으로 기획하십시오."
        ],
        beginner: [
          "따스한 멘토 응원: 처음부터 완벽하려는 완벽주의에 갇겨 예약 업로드조차 망설이고 계신가요? 70% 완성도로도 시작하는 그 용기 자체가 독자에게는 가장 깊은 친근함으로 교감하게 된답니다. 힘차게 첫 영상 예약 단추를 눌러보세요!"
        ],
        advanced: [
          "그로스해커 냉밀 검토: 조회수가 정체될 때 홧김에 안 나온 지난 영상을 과지우는 등의 행위는 검색 히스토리 낙인을 가혹하게 꼬아 버립니다. 썸네일 글자 한 장식의 일인 통제 변수 A/B 테스트 지표를 7일 동안 정교하게 기록하여 개선하십시오."
        ]
      };

      const choice = simulatedResponses[selectedPersona] || simulatedResponses.algorithm;
      const fallbackReply = choice[Math.floor(Math.random() * choice.length)] + "\n\n(※ 실시간 AI 서버 점검 중으로 상담관 비상 메뉴 모드로 임시 매칭되었습니다.)";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-14rem)] min-h-[500px]">
        
        {/* 전문가 선택 패널 (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1" id="advisor-selector-panel">
          <div>
            <h3 className="font-display font-black text-xl text-white">NuTube 전문 멘토 6선</h3>
            <p className="text-xs text-slate-400 mt-1">상담을 원하는 유튜브 성장 도우미를 클릭하시면, 1:1 디렉팅 포트가 실시간 매칭됩니다.</p>
          </div>

          <div className="flex flex-row lg:flex-col gap-2.5 pb-2 overflow-x-auto lg:overflow-x-visible">
            {CATEGORIES_LIST.map((spec) => {
              const isActive = selectedPersona === spec.key;
              return (
                <div
                  key={spec.key}
                  id={`advisor-card-${spec.key}`}
                  onClick={() => setSelectedPersona(spec.key)}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 shrink-0 lg:shrink select-none ${
                    isActive 
                      ? 'bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40 translate-x-1' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-800'
                  }`}
                  style={{ width: '240px', minWidth: '240px', lgWidth: 'auto', lgMinWidth: '100%' }}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${spec.gradient} shadow text-white`}>
                    {getPersonaIcon(spec.key, 'h-5 w-5')}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-xs font-bold text-white block truncate">{spec.label} 전담</span>
                      <span className="flex items-center gap-1 text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                        <Circle className="h-1.5 w-1.5 fill-emerald-500" />
                        <span>대기중</span>
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-relaxed">{spec.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1:1 라이브 채팅 창 (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl shadow-slate-950/70" id="advisor-chat-window">
          
          {/* 채팅방 상단 바 */}
          <div className="border-b border-slate-800 bg-slate-900/60 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${currentPersonaSpec.gradient} text-white`}>
                {getPersonaIcon(selectedPersona, 'h-5.5 w-5.5')}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{currentPersonaSpec.label} 1:1 밀착 어드바이저</span>
                </h4>
                <p className="text-[10px] text-emerald-400/95 font-mono">
                  ● LIVE-CHAT CONNECTED (GEMINI 3.5 FLASH)
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
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
                        ? 'bg-slate-900 text-slate-200 border border-slate-850 rounded-tl-none font-sans' 
                        : 'bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-tr-none font-semibold'
                    }`}>
                      {renderFormattedText(msg.text)}
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
                  <div className="rounded-xl p-3.5 bg-slate-900 text-slate-400 border border-slate-850 rounded-tl-none text-xs flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span>상담관이 전문 진단 처방을 구성하는 중...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* 간이 고민 질문 추천 바 */}
          <div className="px-5 py-3 border-t border-slate-900 bg-slate-900/20 text-xs">
            <p className="text-[10px] font-bold text-slate-500 mb-2 font-mono uppercase tracking-wider">추천 실무 컨설팅 질문:</p>
            <div className="flex flex-wrap gap-2 lg:max-h-24 lg:overflow-y-auto">
              {getQuickQuestions(selectedPersona).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 text-left rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-[10px] sm:text-xs text-ellipsis overflow-hidden"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* 입력 필드 영역 */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/40">
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
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 py-3 px-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-all"
                required
              />
              <button
                type="submit"
                id="chat-send-btn"
                disabled={loading || !inputMessage.trim()}
                className="rounded-xl px-5 py-3 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-500/10"
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
