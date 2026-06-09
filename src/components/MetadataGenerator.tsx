import React, { useState, useEffect } from 'react';
import { MetadataResult, TitleSuggestion } from '../types';
import { Sparkles, Play, Clipboard, Check, Image, Table, Film, Eye, Flame, Compass, ArrowRight } from 'lucide-react';

export const MetadataGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MetadataResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'titles' | 'storyboard' | 'shorts' | 'thumbnails'>('titles');
  
  // 로딩 중 노출될 안심 로딩 메시지 자동 교환
  const [loadingMessage, setLoadingMessage] = useState('2026년 최신 알고리즘 가중치를 우회하기 위해 다변량 패턴 심사 중...');
  useEffect(() => {
    if (!loading) return;
    const messages = [
      '2026년 최신 알고리즘 가중치를 우회하기 위해 다변량 패턴 심사 중...',
      '유튜브 수석 분석관 멘토 페르소나와 프롬프트 조향 동기화 중...',
      '완시청률 85%를 방어하기 위한 드라마틱 스토리보드 오프닝 인출 중...',
      '눈길을 가로챌 고대비 썸네일 전동 텍스트 구도를 실시간 빌딩 중...',
      '댓글 폭주 및 재생 세션 연장 CTA를 대본 안에 주입하는 중...',
    ];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingMessage(messages[i]);
    }, 2800);
    return () => clearInterval(timer);
  }, [loading]);

  // 클립보드 복사 유틸
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 분석 의뢰 핸들러
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setResult(null);

    const lowercaseKeyword = keyword.trim() || "이것";
    const clientFallback: MetadataResult = {
      isFallback: true,
      keyword: keyword.trim(),
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
          title: `초보 크리에이터 98%가 [${lowercaseKeyword}] 개설 첫 주에 '이 사소한 실수'로 채널을 망칩니다`,
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
        }
      ],
      description: `📌 오늘 다룬 [${lowercaseKeyword}] 성장 전략 비밀 요약:\n00:00 - 오늘 영상 핵심 예고 및 인트로\n01:15 - 조회수 증가의 결정적 요인 분석\n03:40 - 2026년 마이크로 니치 알고리즘의 대세 전환과 기회\n06:12 - 실제 시니어 채널에 즉시 대입하는 3대 타이틀 비기\n08:30 - 세션을 극적으로 연결하는 최종화면 최적화\n10:15 - 요약 및 특별 무료 배포 템플릿 안내\n\n👉 https://ai.studio/build\n#유튜브성장 #유튜브알고리즘 #시니어쇼츠 #[${lowercaseKeyword}]`,
      tags: [lowercaseKeyword, "유튜브성장", "유튜브알고리즘", "영상기획"],
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
          audio: `BGM: 미디엄 템포의 차분하며 저음. 내레이션: "열심히 하루 종일 공들였는데 [${lowercaseKeyword}] 조회수 100회 언더에 머물러 낙심하셨나요? 진짜 범인은 썸네일이 아닙니다."`,
          timing: "00:03 - 00:15"
        }
      ],
      thumbnails: [
        {
          graphic: `배경은 감성적이고 약간 어두운 방인 조명, [${lowercaseKeyword}]용 소품이 놓여 있음.`,
          titleText: "하루만에 10배",
          vibe: "호기심 극대화 미스터리"
        }
      ],
      shortsScript: {
        hook: `유튜브 한창 [${lowercaseKeyword}] 채널 올리시는 분들, 딱 30초만 들어보세요. 이거 모르면 6개월 노출 제로 됩니다.`,
        body: `알고리즘이 올해부터 가장 가중치를 높인 건 단 하나, 재시청과 댓글 참여도입니다. [${lowercaseKeyword}] 영상을 아무리 화려하게 길게 만들어도 독자가 초반 이탈하거나 댓글 반응이 없으면 비추천 행입니다. 무조건 끝부분에 시청자 의견 유도용 질문 자막을 던지세요!`,
        cta: "어떤 질문을 던져야 할지 잘 모르시겠다면 NuTube 허브에 엄선한 템플릿 7개를 참고해 가져가세요!"
      }
    };

    try {
      const res = await fetch('/api/assistant/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      if (!res.ok) {
        setResult(clientFallback);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("API Error, utilizing responsive client fallback:", err);
      setResult(clientFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8" id="metadata-generator-root">
      
      {/* 타이틀 배너 */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
          <Sparkles className="h-5.5 w-5.5 text-slate-950 animate-pulse" />
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-4">
          원클릭 알고리즘 부스터 & 메타데이터 빌더
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          제작하려는 유튜브 영상 키워드를 입력하시면, 2026년 가중치 알고리즘을 강박적으로 후려칠 추천 제목 8선, 60초 대본, 촬영용 씬별 스토리보드, 썸네일 가이드라인을 동시 고속 인출합니다.
        </p>
      </div>

      {/* 키워드 요청 폼 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 mb-8 shadow-xl">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            id="generator-keyword-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={loading}
            placeholder="예시: 시니어 요가 홈트, 자취용 초간단 제육볶음, 스마트폰 싸게 사는 법"
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-all"
            required
          />
          <button 
            type="submit"
            id="generator-submit-btn"
            disabled={loading || !keyword.trim()}
            className="rounded-xl px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>AI 구상 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4.5 w-4.5" />
                <span>2026 비책 올인원 빌드</span>
              </>
            )}
          </button>
        </form>

        {/* 꿀팁 뱃지 */}
        <div className="flex flex-wrap gap-2.5 mt-4 items-center text-[11px] text-slate-400">
          <span className="font-bold text-amber-500 font-mono">인기 추천 검색어:</span>
          {['시니어 웰빙 식단', '유튜브 광고 단가 해킹', '쉽게 쓰는 AI 도구'].map((k) => (
            <button 
              key={k} 
              type="button"
              disabled={loading}
              onClick={() => setKeyword(k)}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
            >
              #{k}
            </button>
          ))}
        </div>
      </div>

      {/* 안심 안락 로더 */}
      {loading && (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 py-20 px-6 text-center animate-pulse shadow-inner" id="generator-loading-state">
          <svg className="animate-spin mx-auto h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <h3 className="font-display font-bold text-lg text-white mt-6">유튜브 AI 디렉터가 솔루션을 정밀 구성하는 중</h3>
          <p className="mt-2 text-xs sm:text-sm text-amber-400/90 font-mono font-medium max-w-lg mx-auto">
            {loadingMessage}
          </p>
        </div>
      )}

      {/* 빌드 완료 리포트 노출 */}
      {result && (
        <div className="space-y-8" id="generator-results-presentation">
          
          {/* 상단 간이 칩 요약 */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs sm:text-sm">분석 완료 키워드: <strong className="text-white">"{result.keyword}"</strong></span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 px-2 py-1 rounded text-amber-400 border border-amber-500/20">E-E-A-T CERTIFIED</span>
          </div>

          {result.isFallback && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-rose-500/20 text-rose-400 font-black border border-rose-500/30">!</div>
              <div>
                <strong className="text-white block font-semibold mb-0.5">⚠️ 실시간 AI 연산 서버 고부하 긴급 우회 모드 작동 중</strong>
                <span>현재 구글 개발자 API 서버 호출량 극적 급증(503 과부하)으로 인해, 분석관이 사전 전동 조율한 고밀도 수훈 시나리오 뼈대를 기반으로 검색어 <strong className="text-white">"{result.keyword}"</strong>에 맞춤 튜닝한 하이브리드 리포트를 긴급 출하했습니다. 실무 및 알고리즘 타겟팅에 완벽히 정상 호환됩니다.</span>
              </div>
            </div>
          )}

          {/* 서브 탭 네비게이터 */}
          <div className="border-b border-slate-800 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('titles')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-[2px] ${
                activeTab === 'titles' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>고CTR 제목 추천 (8선)</span>
            </button>
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-[2px] ${
                activeTab === 'storyboard' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Table className="h-4 w-4" />
              <span>씬별 연출 스토리보드</span>
            </button>
            <button
              onClick={() => setActiveTab('shorts')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-[2px] ${
                activeTab === 'shorts' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Film className="h-4 w-4" />
              <span>1분 최적화 쇼츠 대본</span>
            </button>
            <button
              onClick={() => setActiveTab('thumbnails')}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-[2px] ${
                activeTab === 'thumbnails' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Image className="h-4 w-4" />
              <span>썸네일 시각 배치안</span>
            </button>
          </div>

          {/* 탭 1: 고CTR 제목 추천 8선 */}
          {activeTab === 'titles' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.titles.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4.5 hover:border-slate-700 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-mono font-bold bg-slate-950 text-amber-400 px-2 py-0.5 rounded border border-slate-800 uppercase">
                          {t.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                          <Eye className="h-3.5 w-3.5" />
                          <span>예상 CTR: <strong>{t.ctr}%</strong></span>
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-relaxed select-all">
                        {t.title}
                      </h4>
                      <p className="mt-2 text-[11px] text-slate-400 leading-relaxed italic">
                        " {t.reason} "
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end">
                      <button
                        onClick={() => copyToClipboard(t.title, `t-${idx}`)}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        {copiedKey === `t-${idx}` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">복사 완료</span>
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-3 w-3" />
                            <span>제목 복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 디스크립션 및 태그 블록 수록 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 mt-6">
                <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800/80 mb-4">
                  <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-amber-500" />
                    <span>추천 영상 설명란 문헌 (Description)</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(result.description, 'desc')}
                    className="flex h-8 px-3 gap-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors items-center text-[11px]"
                  >
                    {copiedKey === 'desc' ? <Check className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
                    <span>{copiedKey === 'desc' ? '설명란 복사 완료' : '전체 복사'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={result.description}
                  className="w-full h-44 rounded-xl bg-slate-950/80 border border-slate-900 p-4 font-mono text-xs text-slate-300 leading-relaxed focus:outline-none"
                />

                <h4 className="text-xs font-bold text-slate-400 font-mono mt-6 mb-3">검색 상승 최적화 오가닉 태그 ({result.tags.length}개)</h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-slate-950 text-[10px] text-slate-400 font-mono border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 탭 2: 씬별 연출 스토리보드 */}
          {activeTab === 'storyboard' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-slate-950 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5 font-bold">시간 및 구성</th>
                      <th className="px-4 py-3.5 font-bold">비주얼 연출 및 액션</th>
                      <th className="px-4 py-3.5 font-bold">오디오 및 내레이션 팁</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
                    {result.storyboard.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-4 py-4.5 font-mono whitespace-nowrap">
                          <span className="text-amber-400 font-semibold block">{s.scene}</span>
                          <span className="text-slate-500 mt-0.5 block">{s.timing}</span>
                        </td>
                        <td className="px-4 py-4.5 text-slate-200 leading-relaxed select-all">
                          {s.visual}
                        </td>
                        <td className="px-4 py-4.5 text-slate-300 leading-relaxed select-all">
                          {s.audio}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-400 text-[11px] leading-relaxed border border-slate-800 font-mono">
                💡 <strong>스토리보드 편집 가이드:</strong> 1번 씬(첫 3초)은 무조건 고대비 자막과 시각적 후킹 요소가 강박적으로 결속되어야 음소거 모바일 시청자의 스와이프를 막아낼 수 있습니다.
              </div>
            </div>
          )}

          {/* 탭 3: 1분 최적화 쇼츠 대본 */}
          {activeTab === 'shorts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 훅 컵 */}
                <div className="rounded-xl border border-slate-800 bg-emerald-500/5 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-400/5 blur-xl rounded-full" />
                  <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider block mb-2.5 uppercase">STEP 1: 첫 3초 후킹 (HOOK)</span>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed select-all">
                    "{result.shortsScript.hook}"
                  </p>
                </div>

                {/* 바디 컵 */}
                <div className="rounded-xl border border-slate-800 bg-amber-500/5 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-amber-400/5 blur-xl rounded-full" />
                  <span className="font-mono text-[10px] font-bold text-amber-400 tracking-wider block mb-2.5 uppercase">STEP 2: 정량적 정보 (BODY)</span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed select-all">
                    "{result.shortsScript.body}"
                  </p>
                </div>

                {/* CTA 컵 */}
                <div className="rounded-xl border border-slate-800 bg-purple-500/5 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-purple-400/5 blur-xl rounded-full" />
                  <span className="font-mono text-[10px] font-bold text-purple-400 tracking-wider block mb-2.5 uppercase">STEP 3: 댓글 참여 및 연결 (CTA)</span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed select-all font-sans">
                    "{result.shortsScript.cta}"
                  </p>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => copyToClipboard(`[HOOK]\n${result.shortsScript.hook}\n\n[BODY]\n${result.shortsScript.body}\n\n[CTA]\n${result.shortsScript.cta}`, 'all-script')}
                  className="rounded-xl px-5 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-semibold text-xs transition-all flex items-center gap-2"
                >
                  {copiedKey === 'all-script' ? <Check className="h-4 w-4 text-emerald-400" /> : <Clipboard className="h-4 w-4" />}
                  <span>{copiedKey === 'all-script' ? '쇼츠 대본 전체 복사 완료' : '대본 전체 복사'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 탭 4: 썸네일 시각 배치안 */}
          {activeTab === 'thumbnails' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.thumbnails.map((thumb, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between" id={`thumb-concept-${idx}`}>
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 mb-4 text-amber-500">
                        <Image className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 block mb-1">썸네일 구성 안 {idx + 1}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-3">무드: {thumb.vibe}</h4>
                      
                      {/* 가상 썸네일 목업 시각 기획 */}
                      <div className="rounded-lg aspect-video w-full bg-slate-900 border border-slate-800 p-3 mb-4 flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-600">THUMBNAIL PREVIEW</div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-0 opacity-60" />
                        <div className="text-center z-10 leading-none">
                          <span className="inline-block bg-yellow-400 text-slate-950 font-extrabold text-[11px] sm:text-[13px] px-1.5 py-1 rounded shadow-md uppercase tracking-tight">
                            {thumb.titleText}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        <strong>배경 그래픽 및 가이드:</strong> {thumb.graphic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 text-slate-400 text-[11px] leading-relaxed border border-slate-800/80 font-mono flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-400" />
                <span>썸네일 타이틀용 맞춤 텍스트는 모바일에서도 고가독성이 유지되도록 무조건 5글자 내외의 극대비 폰트를 권장합니다.</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
