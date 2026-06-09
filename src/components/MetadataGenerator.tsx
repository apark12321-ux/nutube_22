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

    try {
      const res = await fetch('/api/assistant/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      if (!res.ok) throw new Error('서버 생성 실패');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('분석 데이터를 가져오는 도중 오류가 발생했습니다. 데모 모드로 전환합니다.');
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
