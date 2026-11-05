import React from 'react';
import { ArrowRight, Scissors, FileText, BarChart3, Clapperboard, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { TOOLS, TOOL_STATUS_LABEL, ToolDef, getToolPath, TOOLS_PATH } from '../data/tools';
import { GuidePost } from '../types';
import { getPostPath } from '../postSchedule';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shorts: Scissors,
  script: FileText,
  channel: BarChart3,
  produce: Clapperboard,
};

type Theme = 'light' | 'dark';

const statusClass = (status: ToolDef['status'], dark: boolean) => {
  if (status === 'live') return dark ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-50 text-emerald-700';
  if (status === 'beta') return dark ? 'bg-amber-950 text-amber-300' : 'bg-amber-50 text-amber-700';
  return dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600';
};

export const ToolCtaButton: React.FC<{ tool: ToolDef; size?: 'sm' | 'lg'; onContact: () => void }> = ({ tool, size = 'sm', onContact }) => {
  const base = size === 'lg' ? 'px-5 py-2.5 text-sm' : 'px-3 py-1.5 text-xs';
  if (tool.url) {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold text-white hover:opacity-90 transition-opacity ${base}`}
        style={{ backgroundColor: tool.accent }}
      >
        {tool.name} 이용하기 <ArrowRight className="w-3.5 h-3.5" />
      </a>
    );
  }
  return (
    <button
      onClick={onContact}
      className={`inline-flex items-center gap-1.5 rounded-lg font-bold border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200 transition-colors cursor-pointer ${base}`}
    >
      출시 알림 신청 <ArrowRight className="w-3.5 h-3.5" />
    </button>
  );
};

// 홈 상단 도구 띠
export const ToolsStrip: React.FC<{ theme: Theme; onOpenTool: (tool: ToolDef) => void; onOpenTools: () => void }> = ({ theme, onOpenTool, onOpenTools }) => {
  const dark = theme === 'dark';
  return (
    <section className={`p-5 rounded-xl border mb-6 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className={`text-base sm:text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>유튜브 도구</h2>
          <p className={`text-xs mt-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>제작·분석·자동화 도구를 한곳에 모았습니다.</p>
        </div>
        <button onClick={onOpenTools} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap">
          전체 보기
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TOOLS.map((tool) => {
          const Icon = ICONS[tool.key];
          return (
            <a
              key={tool.key}
              href={getToolPath(tool)}
              onClick={(e) => { e.preventDefault(); onOpenTool(tool); }}
              className={`group p-4 rounded-lg border transition-colors ${dark ? 'border-slate-800 hover:border-slate-600 bg-slate-950/40' : 'border-slate-200 hover:border-blue-400 bg-slate-50/60'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: tool.accent }}>
                  <Icon className="w-4.5 h-4.5" />
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(tool.status, dark)}`}>{TOOL_STATUS_LABEL[tool.status]}</span>
              </div>
              <p className={`text-sm font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{tool.name}</p>
              <p className={`text-[11px] mt-1 leading-snug ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{tool.tagline}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
};

// /tools 도구 안내 페이지
export const ToolsIndex: React.FC<{ theme: Theme; onOpenTool: (tool: ToolDef) => void; onContact: () => void }> = ({ theme, onOpenTool, onContact }) => {
  const dark = theme === 'dark';
  return (
    <div className="space-y-6">
      <header className={`p-6 sm:p-8 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>유튜브 도구</h1>
        <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          영상 제작·기획·분석·자동 발행에 필요한 도구를 한곳에 모았습니다. 각 도구는 별도 주소에서 제공되며, 이 페이지에서 용도와 진행 절차를 확인한 뒤 이용할 수 있습니다.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {TOOLS.map((tool) => {
          const Icon = ICONS[tool.key];
          return (
            <article key={tool.key} className={`p-5 sm:p-6 rounded-xl border flex flex-col ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: tool.accent }}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{tool.name}</h2>
                    <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{tool.form}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${statusClass(tool.status, dark)}`}>{TOOL_STATUS_LABEL[tool.status]}</span>
              </div>
              <p className={`mt-4 text-sm leading-relaxed flex-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{tool.description}</p>
              <dl className={`mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                <dt className="font-bold">대상</dt><dd>{tool.audience}</dd>
                <dt className="font-bold">형태</dt><dd>{tool.form}</dd>
              </dl>
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                <ToolCtaButton tool={tool} onContact={onContact} />
                <a
                  href={getToolPath(tool)}
                  onClick={(e) => { e.preventDefault(); onOpenTool(tool); }}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  상세 안내
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

// /tools/:key 도구 상세 페이지
export const ToolDetail: React.FC<{
  tool: ToolDef;
  theme: Theme;
  posts: GuidePost[];
  onBack: () => void;
  onSelectPost: (post: GuidePost) => void;
  onContact: () => void;
}> = ({ tool, theme, posts, onBack, onSelectPost, onContact }) => {
  const dark = theme === 'dark';
  const Icon = ICONS[tool.key];
  const related = tool.relatedSlugs.map((s) => posts.find((p) => p.slug === s)).filter(Boolean) as GuidePost[];

  return (
    <div className="space-y-6">
      <a href={TOOLS_PATH} onClick={(e) => { e.preventDefault(); onBack(); }} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600">
        <ChevronLeft className="w-4 h-4" /> 유튜브 도구 전체
      </a>

      <header className={`p-6 sm:p-8 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: tool.accent }}>
            <Icon className="w-7 h-7" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{tool.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(tool.status, dark)}`}>{TOOL_STATUS_LABEL[tool.status]}</span>
            </div>
            <p className={`text-sm mt-1 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{tool.tagline}</p>
          </div>
        </div>
        <p className={`mt-5 text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{tool.description}</p>
        <dl className={`mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          <dt className="font-bold">대상</dt><dd>{tool.audience}</dd>
          <dt className="font-bold">제공 형태</dt><dd>{tool.form}</dd>
        </dl>
        <div className="mt-6">
          <ToolCtaButton tool={tool} size="lg" onContact={onContact} />
        </div>
      </header>

      <section className={`p-6 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
        <h2 className={`text-base font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>진행 절차</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {tool.steps.map((step, i) => (
            <li key={step.title} className={`p-4 rounded-lg border ${dark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/70'}`}>
              <span className="text-[11px] font-black" style={{ color: tool.accent }}>{String(i + 1).padStart(2, '0')}</span>
              <p className={`text-sm font-bold mt-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{step.title}</p>
              <p className={`text-xs mt-1 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`p-6 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
        <h2 className={`text-base font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>주요 기능</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {tool.features.map((f) => (
            <li key={f} className={`flex items-start gap-2 text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: tool.accent }} /> {f}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className={`p-6 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <h2 className={`text-base font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>함께 읽을 가이드</h2>
          <ul className="space-y-2">
            {related.map((p) => (
              <li key={p.slug}>
                <a
                  href={getPostPath(p)}
                  onClick={(e) => { e.preventDefault(); onSelectPost(p); }}
                  className={`block p-3 rounded-lg border text-sm font-semibold transition-colors ${dark ? 'border-slate-800 text-slate-200 hover:border-slate-600' : 'border-slate-200 text-slate-800 hover:border-blue-400'}`}
                >
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
