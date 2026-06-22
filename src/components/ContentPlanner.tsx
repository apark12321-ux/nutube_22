import React from 'react';

interface ContentPlannerProps {
  theme?: 'light' | 'dark';
}

export const ContentPlanner: React.FC<ContentPlannerProps> = ({ theme = 'dark' }) => {
  const card = theme === 'dark' ? 'rounded-2xl border border-sky-950 bg-[#042841]/50 p-5' : 'rounded-2xl border border-sky-100 bg-white p-5 shadow-sm';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center break-keep">
        <h2 className={theme === 'dark' ? 'text-3xl font-extrabold text-white' : 'text-3xl font-extrabold text-slate-900'}>콘텐츠 기획 체크리스트</h2>
        <p className={theme === 'dark' ? 'mt-2 text-sm text-sky-300/70' : 'mt-2 text-sm text-slate-600'}>영상을 올리기 전에 제목, 대상 독자, 썸네일, 설명란을 차례대로 점검하세요.</p>
      </div>
      <section className={card}>
        <h3 className={theme === 'dark' ? 'mb-4 font-bold text-white' : 'mb-4 font-bold text-slate-900'}>발행 전 확인할 항목</h3>
        <ul className={theme === 'dark' ? 'space-y-3 text-sm text-sky-100' : 'space-y-3 text-sm text-slate-700'}>
          <li>1. 이 영상이 누구에게 필요한지 한 문장으로 정리합니다.</li>
          <li>2. 제목 앞부분에 핵심 검색어를 자연스럽게 넣습니다.</li>
          <li>3. 첫 10초 안에 문제와 결론을 보여줍니다.</li>
          <li>4. 설명란에는 요약, 관련 링크, 주의사항을 순서대로 적습니다.</li>
          <li>5. 썸네일 문구는 짧고 화면에서 바로 읽히게 만듭니다.</li>
        </ul>
      </section>
    </div>
  );
};
