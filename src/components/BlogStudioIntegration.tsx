import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  Check, 
  Copy, 
  Settings, 
  Trash2, 
  Send, 
  RefreshCw, 
  Radio, 
  FileText, 
  Globe, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import { GuidePost } from '../types';

interface BlogStudioIntegrationProps {
  theme: 'light' | 'dark';
  posts: GuidePost[];
  onRefreshPosts: () => void;
}

export const BlogStudioIntegration: React.FC<BlogStudioIntegrationProps> = ({ 
  theme, 
  posts, 
  onRefreshPosts 
}) => {
  const [token, setToken] = useState('blogstudio-secret-99');
  const [newPostToken, setNewPostToken] = useState('blogstudio-secret-99');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingToken, setIsSavingToken] = useState(false);
  
  // Manual Test Form State
  const [testTitle, setTestTitle] = useState('');
  const [testContent, setTestContent] = useState('');
  const [testSubtitle, setTestSubtitle] = useState('');
  const [testCategory, setTestCategory] = useState('algorithm');
  const [testAuthor, setTestAuthor] = useState('BlogStudio AI');
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch current token configuration on load
  useEffect(() => {
    fetch('/api/settings/blogstudio')
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          setToken(data.token);
          setNewPostToken(data.token);
        }
      })
      .catch(err => console.error('Error fetching BlogStudio integration settings:', err));
  }, []);

  const getWebhookUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/api/posts`;
    }
    return 'https://nutube.kr/api/posts';
  };

  const copyToClipboard = (text: string, type: 'webhook' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'webhook') {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleUpdateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingToken(true);
    try {
      const response = await fetch('/api/settings/blogstudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: newPostToken })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setToken(data.token);
        alert('연동 보안 인증 토큰이 성공적으로 변경되었습니다!');
      } else {
        alert(data.error || '토큰 변경 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 응답 오류가 발생했습니다.');
    } finally {
      setIsSavingToken(false);
    }
  };

  const handleManualPostTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || !testContent.trim()) {
      setFormMessage({ type: 'error', text: '제목과 본문 텍스트는 필수 항목입니다.' });
      return;
    }

    setIsLoading(true);
    setFormMessage(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: testTitle,
          content: testContent,
          subtitle: testSubtitle,
          category: testCategory,
          author: testAuthor,
          tags: [testCategory, 'BlogStudio', '실시간자동연동']
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setFormMessage({ 
          type: 'success', 
          text: `🎉 성공! "${testTitle}" 포스팅이 사이트에 실시간으로 발행 및 서빙되었습니다.` 
        });
        setTestTitle('');
        setTestContent('');
        setTestSubtitle('');
        onRefreshPosts(); // Trigger parent database sync
      } else {
        setFormMessage({ type: 'error', text: data.error || '동적 포스팅 연동 중 실패했습니다.' });
      }
    } catch (err: any) {
      setFormMessage({ type: 'error', text: `네트워크 에러: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('이 아티클을 데이터베이스에서 삭제하시겠습니까? (기본으로 수록된 내장 오가닉 공략은 삭제할 수 없습니다)')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('동적 포스트가 실시간 기계 색인 및 DB에서 안전하게 소거되었습니다.');
        onRefreshPosts();
      } else {
        alert(data.error || '삭제 작업에 실패했습니다.');
      }
    } catch (err: any) {
      alert(`삭제 에러가 발생했습니다: ${err.message}`);
    }
  };

  // Only consider dynamic posts (those with BlogStudio authors or not native in pre-seed lists)
  // Let's filter out native static posts, if we want to manage newly added dynamic ones
  // Static posts can have specific author like 'NuTube 수석 기술관' or specific date, or we can just list any published posts where the user can delete the manually posted ones.
  const dynamicPostsArray = posts.filter(p => p.author === 'BlogStudio AI' || p.tags?.includes('BlogStudio') || p.tags?.includes('자동발행'));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 break-keep animate-fade-in" id="blogstudio-panel-root">
      
      {/* 바닥 상단 요약 타이틀 */}
      <div className="mb-8 text-center sm:text-left">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border mb-3 ${
          theme === 'dark'
            ? 'bg-[#00b894]/10 text-[#00b894] border-[#00b894]/20'
            : 'bg-[#e5faf2] text-[#00b894] border-[#c2f3e4]'
        }`}>
          <Radio className="h-3 w-3 animate-pulse" /> 
          <span>블로그스튜디오(BlogStudio.live) 실시간 동적 연동 포털</span>
        </span>
        <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-[#011d33]'
        }`}>
          자동 포스팅 동적 활성화 시스템
        </h2>
        <p className={`mt-2 text-xs sm:text-sm max-w-3xl leading-relaxed ${
          theme === 'dark' ? 'text-sky-300/70' : 'text-slate-500'
        }`}>
          외부 소유 블로그 배포 엔진인 <strong>BlogStudio.live</strong>와의 API 가교를 통해 생성 및 작성된 콘텐츠가 실시간 <strong>NuTube Premium Core Hub</strong>의 포스팅 DB에 자동으로 주입되어 sitemap.xml, rss.xml 및 메인 가이드 목록에 풀다운 반영됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 왼쪽 2열: 연동 규격 및 리스트 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 가이드 배너 */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${
            theme === 'dark' ? 'bg-[#042841]/55 border-sky-950/50' : 'bg-white border-sky-100 shadow-xs'
          }`}>
            <h3 className={`font-display font-extrabold text-sm sm:text-base flex items-center gap-2 mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-[#011d33]'
            }`}>
              <Link2 className="h-4.5 w-4.5 text-cyan-400" />
              <span>BlogStudio 실시간 다이렉트 Webhook 연동 가이드</span>
            </h3>

            <div className={`space-y-4 text-xs sm:text-[13px] leading-relaxed ${theme === 'dark' ? 'text-sky-200/80' : 'text-slate-600'}`}>
              <p>
                BlogStudio 관리 부스에 접속하여 포스팅 자동 발행 Webhook 연동 목록 또는 외부 API 발행 채널에 다음 요점 정보를 그대로 기입하여 즉각적인 동적 발행 센터를 설립하세요.
              </p>

              <div className="space-y-3 mt-4">
                {/* Webhook URL */}
                <div className={`rounded-xl p-3 border ${
                  theme === 'dark' ? 'bg-[#010a12] border-sky-955' : 'bg-sky-50/50 border-sky-100'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[11px] text-cyan-500">요청 WEBHOOK URL (METHOD: POST)</span>
                    <button 
                      onClick={() => copyToClipboard(getWebhookUrl(), 'webhook')}
                      className="text-[11px] text-sky-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {copiedWebhook ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedWebhook ? '복사정상' : '복사'}</span>
                    </button>
                  </div>
                  <code className="text-xs font-mono select-all break-all block text-slate-300">
                    {getWebhookUrl()}
                  </code>
                </div>

                {/* Secret Token */}
                <div className={`rounded-xl p-3 border ${
                  theme === 'dark' ? 'bg-[#010a12] border-sky-955' : 'bg-sky-50/50 border-sky-100'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[11px] text-cyan-500">헤더 인증용 보안 토큰 (Authorization Token)</span>
                    <button 
                      onClick={() => copyToClipboard(token, 'token')}
                      className="text-[11px] text-sky-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {copiedToken ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedToken ? '복사정상' : '복사'}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono select-all text-slate-300 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700">
                      {token}
                    </code>
                    <span className="text-[10px] text-slate-500">(또는 HTTP 요청 시 ?token={token} 파라미터를 뒤에 인입 기재)</span>
                  </div>
                </div>

                {/* HTTP HEADER FORMAT */}
                <div className={`rounded-xl p-4 border font-mono text-[11px] ${
                  theme === 'dark' ? 'bg-[#010912] border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-950 text-slate-400'
                }`}>
                  <p className="text-orange-400 font-bold mb-1">// HTTP HEADER 표준 구조</p>
                  <p>Content-Type: application/json</p>
                  <p className="text-cyan-400">Authorization: Bearer {token}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 실시간 수집 내역 관리 */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${
            theme === 'dark' ? 'bg-[#042841]/55 border-sky-955' : 'bg-white border-sky-100 shadow-xs'
          }`}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className={`font-display font-extrabold text-sm sm:text-base flex items-center gap-2 ${
                theme === 'dark' ? 'text-white' : 'text-[#011d33]'
              }`}>
                <FileText className="h-4.5 w-4.5 text-[#00b894]" />
                <span>BlogStudio 발행 동적 아티클 DB 관리부</span>
              </h3>
              <button 
                onClick={onRefreshPosts}
                className={`p-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-[11px] font-bold cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-705 text-sky-400' : 'bg-sky-50 border-sky-100 hover:bg-sky-100 text-sky-750'
                }`}
                title="실시간 아티클 데이터베이스 새로고침"
              >
                <RefreshCw className="h-3 w-3" />
                <span>새로고침</span>
              </button>
            </div>

            {dynamicPostsArray.length > 0 ? (
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {dynamicPostsArray.map((p) => (
                  <div 
                    key={p.slug}
                    className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition-all duration-200 ${
                      theme === 'dark' ? 'bg-[#011221]/90 border-sky-955 hover:border-sky-800' : 'bg-sky-50/20 border-sky-100 hover:bg-sky-50/50'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded px-1.5 py-0.5 font-bold font-mono">
                          {p.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(p.publishedAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <h4 className={`font-bold text-xs sm:text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {p.title}
                      </h4>
                      <p className={`text-[11px] truncate ${theme === 'dark' ? 'text-sky-305/65' : 'text-slate-500'}`}>
                        {p.subtitle || p.summary}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                        <span>작성자: <strong className="text-cyan-500">{p.author}</strong></span>
                        <span>•</span>
                        <span>분류: {p.slug}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePost(p.slug)}
                      className={`p-2 rounded-lg border cursor-pointer hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-400 transition-colors ${
                        theme === 'dark' ? 'border-sky-900 bg-slate-900 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
                      }`}
                      title="데이터베이스에서 영구 삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-10 text-center rounded-xl border ${
                theme === 'dark' ? 'bg-[#010c17]/60 border-sky-955 text-slate-400' : 'bg-sky-50/20 border-dashed border-sky-100 text-slate-500'
              }`}>
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-500/10 mb-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                </div>
                <p className="font-bold text-xs sm:text-sm">현재 집계된 BlogStudio 동적 포스트가 부재합니다.</p>
                <p className="text-[11px] mt-1 opacity-75 max-w-sm mx-auto leading-relaxed">
                  다이렉트 Webhook 연동을 조율하시거나, 우측의 실시간 시뮬레이션 발송 필드를 채워 NuTube 시스템의 동적 포스팅을 경험해 보세요!
                </p>
              </div>
            )}
          </div>

          {/* API Security Token Editor (보안 키 관리) */}
          <div className={`rounded-2xl border p-5 ${
            theme === 'dark' ? 'bg-[#010912]/80 border-sky-955' : 'bg-white border-sky-100 shadow-xs'
          }`}>
            <h4 className={`font-display font-extrabold text-xs sm:text-sm flex items-center gap-2 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-[#011d33]'
            }`}>
              <Settings className="h-4 w-4 text-cyan-400" />
              <span>BlogStudio 보안 인증 토큰 설정 변경</span>
            </h4>
            <form onSubmit={handleUpdateToken} className="flex gap-2">
              <input 
                type="text" 
                value={newPostToken}
                onChange={(e) => setNewPostToken(e.target.value)}
                placeholder="인증 보안 토큰 입력"
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none transition-all ${
                  theme === 'dark'
                    ? 'border-sky-900 bg-[#021321] text-white focus:border-cyan-500'
                    : 'border-sky-105 bg-sky-50/50 text-slate-850 focus:border-sky-500 focus:bg-white'
                }`}
              />
              <button
                type="submit"
                disabled={isSavingToken || !newPostToken.trim()}
                className="rounded-xl px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
              >
                {isSavingToken ? '변경 중...' : '토큰 변경'}
              </button>
            </form>
          </div>

        </div>

        {/* 오른쪽 1열: 실시간 자가 동적 발송 테스터 */}
        <div className="space-y-8">
          
          <div className={`rounded-3xl border p-5 sm:p-6 ${
            theme === 'dark' ? 'bg-gradient-to-b from-[#031d33] to-[#010a12] border-sky-955' : 'bg-white border-sky-100 shadow-lg'
          }`}>
            <div className="text-center pb-4 mb-4 border-b border-sky-100/10">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-[#00b894] text-white mb-2 shadow`}>
                <Send className="h-4.5 w-4.5" />
              </span>
              <h3 className={`font-display font-extrabold text-base flex justify-center items-center gap-1.5 ${
                theme === 'dark' ? 'text-white' : 'text-[#011d33]'
              }`}>
                <span>자가 동적 포스팅 시뮬레이터</span>
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">블로그스튜디오 전송 동작을 이곳에서 즉시 모의 실험합니다.</p>
            </div>

            {formMessage && (
              <div className={`p-3 rounded-xl border text-[11px] leading-relaxed mb-4 ${
                formMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {formMessage.text}
              </div>
            )}

            <form onSubmit={handleManualPostTest} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-[11px] mb-1 opacity-80">비책 아티클 카테고리</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 focus:outline-none transition-all ${
                    theme === 'dark'
                      ? 'border-sky-905 bg-[#021321]/90 text-white focus:border-cyan-500'
                      : 'border-sky-100 bg-sky-500/5 text-slate-850'
                  }`}
                >
                  <option value="algorithm">유튜브 알고리즘</option>
                  <option value="senior">시니어 사연 쇼츠</option>
                  <option value="aitools">AI 도구</option>
                  <option value="monetization">영상 채널 수익화</option>
                  <option value="beginner">왕초보 출발</option>
                  <option value="advanced">중고수 전략</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[11px] mb-1 opacity-80">아티클 완벽 타이틀</label>
                <input 
                  type="text" 
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="예) 썸네일 노란 딱지 0.2초만에 정밀 우회하는 실전 타이포 기법"
                  className={`w-full rounded-xl border px-3 py-2.5 focus:outline-none transition-all ${
                    theme === 'dark'
                      ? 'border-sky-905 bg-[#021321]/90 text-white focus:border-cyan-500'
                      : 'border-sky-100 bg-sky-500/5 text-slate-850 placeholder-slate-400'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[11px] mb-1 opacity-80">핵심 부제 (Subtitle / Summary)</label>
                <input 
                  type="text" 
                  value={testSubtitle}
                  onChange={(e) => setTestSubtitle(e.target.value)}
                  placeholder="본문의 핵심 전제 조건이나 간단 요약을 서술합니다."
                  className={`w-full rounded-xl border px-3 py-2.5 focus:outline-none transition-all ${
                    theme === 'dark'
                      ? 'border-sky-905 bg-[#021321]/90 text-white focus:border-cyan-500'
                      : 'border-sky-100 bg-sky-500/5 text-slate-850 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-[11px] mb-1 opacity-80">내레이션 및 포스팅 본문 (Markdown/HTML 지원)</label>
                <textarea 
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  rows={6}
                  placeholder="# 대주제&#10;본문에 마크다운이나 일반 텍스트를 기입하면 정밀 가독성 엔진에 의해 멋지게 뷰어 카드로 정향 파싱됩니다.&#10;&#10;- 핵심 팁 1&#10;- 핵심 팁 2"
                  className={`w-full rounded-xl border px-3 py-2.5 font-sans focus:outline-none transition-all ${
                    theme === 'dark'
                      ? 'border-sky-905 bg-[#021321]/90 text-white focus:border-cyan-500'
                      : 'border-sky-100 bg-sky-500/5 text-slate-850 placeholder-slate-400'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[11px] mb-1 opacity-80">작성자 명의</label>
                <input 
                  type="text" 
                  value={testAuthor}
                  onChange={(e) => setTestAuthor(e.target.value)}
                  placeholder="기본값: BlogStudio AI"
                  className={`w-full rounded-xl border px-3 py-2.5 focus:outline-none transition-all ${
                    theme === 'dark'
                      ? 'border-sky-905 bg-[#021321]/90 text-white'
                      : 'border-sky-100 bg-sky-500/5 text-slate-850'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-white font-extrabold text-xs transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>블로그스튜디오 동적 포스팅 모의 전송</span>
              </button>
            </form>
          </div>

          {/* real-time network indicator */}
          <div className={`p-4.5 rounded-2xl border flex items-center gap-3 ${
            theme === 'dark' ? 'bg-[#010912] border-sky-955' : 'bg-slate-50 border-slate-100'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-[11px] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                통합 Webhook API 생태계 가동 중
              </p>
              <p className="text-[10px] text-slate-500">
                SSL 보안 레벨 3단계 인증 완료 • 365일 24시간 실시간 무정전 크롤러 수신 대기 상태
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
