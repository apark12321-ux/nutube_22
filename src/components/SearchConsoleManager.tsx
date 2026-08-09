import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, CheckCircle2, Globe, ExternalLink, ShieldCheck, Zap, AlertCircle, Copy, Check } from 'lucide-react';

interface IndexingLog {
  id: string;
  slug: string;
  title: string;
  publishedUrl: string;
  publishedAt: string;
  indexedAt: string;
  status: string;
  statusDetail: string;
  sitemapUrl: string;
}

interface SearchConsoleStatus {
  success: boolean;
  autoIndexingActive: boolean;
  sitemapUrl: string;
  rssUrl: string;
  totalPostsCount: number;
  indexedLogsCount: number;
  recentLogs: IndexingLog[];
  lastIndexedAt: string;
}

interface SearchConsoleManagerProps {
  theme?: 'light' | 'dark';
}

export const SearchConsoleManager: React.FC<SearchConsoleManagerProps> = ({ theme = 'light' }) => {
  const dark = theme === 'dark';
  const [status, setStatus] = useState<SearchConsoleStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reindexing, setReindexing] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/search-console/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch search console status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleReindexAll = async () => {
    try {
      setReindexing(true);
      setMessage(null);
      const res = await fetch('/api/search-console/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reindexAll: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        await fetchStatus();
      } else {
        setMessage({ type: 'error', text: data.error || '재색인 요청 중 오류가 발생했습니다.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: '서버와의 통신 오류가 발생했습니다.' });
    } finally {
      setReindexing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div id="search-console-manager" className={dark ? 'rounded-2xl border border-purple-950 bg-[#0c051a] p-6 text-white shadow-xl' : 'rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm'}>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-slate-100 dark:border-purple-950">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">구글 서치 콘솔 자동 색인 등록 시스템</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-extrabold text-emerald-500 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                실시간 가동 중
              </span>
            </div>
            <p className={dark ? 'text-xs text-slate-400 mt-0.5' : 'text-xs text-slate-500 mt-0.5'}>
              새 포스팅 발행 시 구글 서치 콘솔(Sitemap & Indexing Engine)에 즉시 자동 등록되어 검색 피드 노출을 극대화합니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleReindexAll}
          disabled={reindexing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-purple-500/20 hover:bg-purple-700 disabled:opacity-50 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${reindexing ? 'animate-spin' : ''}`} />
          <span>전체 포스팅 즉시 구글 재색인 요청</span>
        </button>
      </div>

      {message && (
        <div className={`mt-4 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2 ${
          message.type === 'success' 
            ? dark ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : dark ? 'bg-rose-950/40 text-rose-300 border border-rose-800' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats Summary Row */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={dark ? 'rounded-xl border border-purple-950 bg-[#140a2b] p-4' : 'rounded-xl border border-slate-100 bg-slate-50 p-4'}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>자동 색인 상태</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-500">100% 연동됨</span>
            <span className="text-[11px] text-slate-400">발행 즉시 핑 송신</span>
          </div>
        </div>

        <div className={dark ? 'rounded-xl border border-purple-950 bg-[#140a2b] p-4' : 'rounded-xl border border-slate-100 bg-slate-50 p-4'}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>총 수집 대상 포스트</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-[#7C3AED] dark:text-purple-400">{status?.totalPostsCount || 0}개</span>
            <span className="text-[11px] text-slate-400">Dynamic + Static</span>
          </div>
        </div>

        <div className={dark ? 'rounded-xl border border-purple-950 bg-[#140a2b] p-4' : 'rounded-xl border border-slate-100 bg-slate-50 p-4'}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>최근 색인 등록 로그</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-indigo-500 dark:text-indigo-400">{status?.indexedLogsCount || 0}건</span>
            <span className="text-[11px] text-slate-400">실시간 누적 기록</span>
          </div>
        </div>
      </div>

      {/* Crawl URLs Copy Links */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-purple-400">구글 크롤러 제출 전용 엔드포인트</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Sitemap XML */}
          <div className={dark ? 'flex items-center justify-between rounded-xl border border-purple-950 bg-[#120822] p-3' : 'flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3'}>
            <div className="min-w-0 flex-1 mr-2">
              <p className="text-[11px] font-bold text-slate-400">Sitemap XML (사이트맵)</p>
              <p className="text-xs font-mono font-bold truncate text-[#7C3AED] dark:text-purple-300">{status?.sitemapUrl || 'https://nutube.kr/sitemap.xml'}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleCopy(status?.sitemapUrl || 'https://nutube.kr/sitemap.xml')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${copiedUrl === status?.sitemapUrl ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : dark ? 'border-purple-900 hover:bg-purple-900/40 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                title="복사"
              >
                {copiedUrl === status?.sitemapUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <a
                href={status?.sitemapUrl || '/sitemap.xml'}
                target="_blank"
                rel="noreferrer"
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${dark ? 'border-purple-900 hover:bg-purple-900/40 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                title="열기"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* RSS XML */}
          <div className={dark ? 'flex items-center justify-between rounded-xl border border-purple-950 bg-[#120822] p-3' : 'flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3'}>
            <div className="min-w-0 flex-1 mr-2">
              <p className="text-[11px] font-bold text-slate-400">RSS 2.0 Feed (피드)</p>
              <p className="text-xs font-mono font-bold truncate text-[#7C3AED] dark:text-purple-300">{status?.rssUrl || 'https://nutube.kr/rss.xml'}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleCopy(status?.rssUrl || 'https://nutube.kr/rss.xml')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${copiedUrl === status?.rssUrl ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : dark ? 'border-purple-900 hover:bg-purple-900/40 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                title="복사"
              >
                {copiedUrl === status?.rssUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <a
                href={status?.rssUrl || '/rss.xml'}
                target="_blank"
                rel="noreferrer"
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${dark ? 'border-purple-900 hover:bg-purple-900/40 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                title="열기"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Indexing History Audit Log List */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-purple-400">최근 구글 서치 콘솔 자동 등록 내역</h3>
          <button
            onClick={fetchStatus}
            className="text-[11px] font-bold text-[#7C3AED] hover:underline cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {status?.recentLogs && status.recentLogs.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-purple-950">
            <table className="w-full text-left text-xs">
              <thead className={dark ? 'bg-[#150a2e] text-slate-400 font-bold border-b border-purple-950' : 'bg-slate-50 text-slate-600 font-bold border-b border-slate-200'}>
                <tr>
                  <th className="py-2.5 px-3">등록 일시</th>
                  <th className="py-2.5 px-3">포스팅 제목</th>
                  <th className="py-2.5 px-3">색인 결과</th>
                  <th className="py-2.5 px-3 text-right">등록 URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-purple-950">
                {status.recentLogs.map((log) => (
                  <tr key={log.id} className={dark ? 'hover:bg-purple-950/30 transition-colors' : 'hover:bg-slate-50 transition-colors'}>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(log.indexedAt).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-bold max-w-xs truncate">
                      {log.title}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        색인 핑 완료
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                      <a href={log.publishedUrl} target="_blank" rel="noreferrer" className="text-[#7C3AED] dark:text-purple-300 hover:underline inline-flex items-center gap-1">
                        링크 <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={dark ? 'rounded-xl border border-purple-950 bg-[#120822] p-8 text-center text-xs text-slate-400' : 'rounded-xl border border-slate-100 bg-slate-50 p-8 text-center text-xs text-slate-500'}>
            등록된 자동 색인 로그가 아직 없습니다. 포스팅이 새로 발행되면 이곳에 실시간 내역이 기록됩니다.
          </div>
        )}
      </div>
    </div>
  );
};
