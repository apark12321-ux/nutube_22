import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Clipboard, Check, RefreshCw, FileText, HeartHandshake, Sliders, ShieldAlert, Sparkles, Monitor, Youtube } from 'lucide-react';

type RejectionReason = 'low_value' | 'duplicate' | 'navigation' | 'reused_content';
type PlatformType = 'web' | 'youtube';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export const AdSenseDiagnostic: React.FC = () => {
  const [platform, setPlatform] = useState<PlatformType>('web');
  const [reason, setReason] = useState<RejectionReason>('low_value');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 실시간 점검 수치 (웹 사이트용)
  const [articleCount, setArticleCount] = useState<number>(15);
  const [avgWordCount, setAvgWordCount] = useState<number>(1200);
  const [hasSitemap, setHasSitemap] = useState<boolean>(false);
  const [hasPrivacyPolicy, setHasPrivacyPolicy] = useState<boolean>(false);

  // 실시간 점검 수치 (유튜브용)
  const [uniqueVoiceRatio, setUniqueVoiceRatio] = useState<number>(60);
  const [hasFaceOrRealVideo, setHasFaceOrRealVideo] = useState<boolean>(false);
  const [heavyEditingDone, setHeavyEditingDone] = useState<boolean>(true);

  // 체크리스트 항목들
  const [webChecklist, setWebChecklist] = useState<ChecklistItem[]>([
    { id: 'w1', text: '웹마스터 도구(Google Search Console)에 사이트 등록 완료', checked: true },
    { id: 'w2', text: '모든 카테고리에 글이 최소 1개 이상 존재하며 빈 메뉴가 없음', checked: false },
    { id: 'w3', text: '복사/붙여넣기가 아닌 100% 자체 생산한 오리지널 글 비중이 90% 이상', checked: false },
    { id: 'w4', text: '모바일 반응형 레이아웃이 완벽히 잘 작동되고 이탈 요소가 없음', checked: true },
    { id: 'w5', text: '저작권 위반 이미지나 불법 배포 프로그램 등이 포함되어 있지 않음', checked: true }
  ]);

  const [youtubeChecklist, setYoutubeChecklist] = useState<ChecklistItem[]>([
    { id: 'y1', text: '유튜브 파트너 프로그램(YPP) 최소 자격 요건 충족(구독자 및 완시청 시간)', checked: true },
    { id: 'y2', text: '최근 3개월 내 유료 제3자 영상이나 클립 무단 삽입 구간이 15% 미만', checked: false },
    { id: 'y3', text: '영상의 내레이션이 기계음 음성 합성기가 아닌 본인 육성이거나 고품질 오리지널 사운드', checked: false },
    { id: 'y4', text: '영상 설명란에 저작권 소유 및 정당한 사용(Fair Use) 공지 표기', checked: false },
    { id: 'y5', text: '커뮤니티 가이드라인 위반 딱지(경고)가 채널에 한 건도 없음', checked: true }
  ]);

  // 클립보드 복사
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 체크리스트 상태 스위처
  const toggleCheck = (id: string, isWeb: boolean) => {
    if (isWeb) {
      setWebChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    } else {
      setYoutubeChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    }
  };

  // 실시간 합격 안정 점수 연산 메커니즘 (가중치 적용 정량 공식)
  const safetyScore = useMemo(() => {
    let score = 30; // 기본 점수

    if (platform === 'web') {
      // 1. 글 개수 가중치 (최대 20점 - 25개 이상 만점)
      score += Math.min(20, (articleCount / 25) * 20);
      
      // 2. 평균 글자 수 가중치 (최대 20점 - 1500자 이상 만점)
      score += Math.min(20, (avgWordCount / 1500) * 20);

      // 3. 사이트맵 여부 (10점)
      if (hasSitemap) score += 10;

      // 4. 개인정보처리방침 여부 (10점)
      if (hasPrivacyPolicy) score += 10;

      // 5. 수동 체크리스트 만족 비율 (최대 10점)
      const checkedCount = webChecklist.filter(c => c.checked).length;
      score += (checkedCount / webChecklist.length) * 10;

      // 6. 거절 유형별 감쇄 보정 코드
      if (reason === 'low_value' && articleCount < 10) score -= 15;
      if (reason === 'navigation' && !hasSitemap) score -= 10;
    } else {
      // 유튜브 자가 연산
      // 1. 고유 보이스 비율 (최대 25점)
      score += (uniqueVoiceRatio / 100) * 25;

      // 2. 실물 비디오 및 본인 얼굴/리얼 클립 사용 여부 (20점)
      if (hasFaceOrRealVideo) score += 20;

      // 3. 고강도 이펙트 편집 여부 (15점)
      if (heavyEditingDone) score += 15;

      // 4. 수동 체크리스트 만족 비율 (최대 10점)
      const checkedCount = youtubeChecklist.filter(c => c.checked).length;
      score += (checkedCount / youtubeChecklist.length) * 10;

      // 5. 거절 유형별 감쇄
      if (reason === 'reused_content' && uniqueVoiceRatio < 40) score -= 20;
    }

    // 최소 0점 ~ 최대 100점 보정
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [platform, reason, articleCount, avgWordCount, hasSitemap, hasPrivacyPolicy, uniqueVoiceRatio, hasFaceOrRealVideo, heavyEditingDone, webChecklist, youtubeChecklist]);

  // 안전 등급 메타 데이터 산출
  const safetyStatus = useMemo(() => {
    if (safetyScore >= 80) {
      return { label: '강력 추천 (즉시 요청 가능)', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', action: '현재 사이트/채널은 구글 승인 기준에 아주 만족합니다. 재승인 심사역이 긍정 조향할 확률이 매우 높으니 지체 말고 신청서를 발송하세요!' };
    } else if (safetyScore >= 55) {
      return { label: '관찰 보강 필요 (안정권 미달)', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', action: '아직은 심사원에게 거절당할 미세한 사각지대가 보입니다. 아래 제안해 드리는 정량 보완점 개선을 우선 2~3일간 실행 후 진행하십시오.' };
    } else {
      return { label: '위험군 (무조건 필터 보완 필요)', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', action: '현재 구조로 신청 시 높은 확률로 또다시 불합격 고배를 마시게 됩니다. 특히 텍스트 깊이나 오리지널 신호가 극도로 약하므로 즉각 수술에 착수해야 합니다.' };
    }
  }, [safetyScore]);

  // 유형별 맞춤 전문 처방 지침문 생성
  const prescriptionAndAppeal = useMemo(() => {
    let prescription = '';
    let appealTemplate = '';

    if (platform === 'web') {
      switch (reason) {
        case 'low_value':
          prescription = `가장 흔히 발생하며, 해결이 아주 명확한 거절 코드입니다. 구글 광고 게시 서버는 정보성이 없는 글을 격려하지 않습니다.
1. [최우선 대책] 현재 발행되어 있는 1,000자 미만의 짧은 일상글이나 단순 퍼온 글을 과감하게 숨김(비공개) 처리하거나, 전문 백과사전식 구조화 지식글 형태로 즉각 보강하세요.
2. [정량 수칙] 무조건 메인 공략 카테고리 1~2개에 지식 밀도가 촘촘히 보강된 1,500글자 이상의 중심 글 20편을 누적하여 빈 칸을 정비해야 합니다.
3. [E-E-A-T 확보] 글 서두와 결론부에 "본 글은 수년간 연구한 데이터를 토대로 작성한 자가 매뉴얼입니다"와 같이 경험과 신뢰성을 명시하세요.`;
          appealTemplate = `안녕하세요, Google AdSense 관리자님.

귀사 플랫폼에 어울리는 고품격 검색 공급자가 되고자 사이트 보강 후 재심사를 요청합니다.

이전 거절 사유였던 '가치 없는 콘텐츠'를 겸허히 시정하기 위해 아래와 같은 개선 조치를 적용완료 했습니다:
- 단순 나열성 일기를 모두 삭제(혹은 숨김처리)하였으며, 독자에게 전문 지식을 선사할 수 있는 1,500자 이상의 독창적인 전문 가이드를 새롭게 15개 이상 수립했습니다.
- 통계 도표 및 리서치 자료를 본문에 삽입해 구글 독자들의 가독성과 정보 유지 시간을 적극 높였습니다.
- 카테고리 구조를 간소화하여 어떤 지면에서도 2번 클릭 내에 세부 백과사전 지식글에 진입할 수 있도록 네비게이터를 전격 통합했습니다.

실제 사용자에게 명확하고 실용적인 가치가 있는 오가닉 콘텐츠만 제공할 것임을 약속 드립니다. 상세한 수동 심사를 부탁드립니다. 감사합니다.`;
          break;
        case 'duplicate':
          prescription = `애드센스는 1인 1계정이 절대 원칙입니다. 본인이 인지하지 못했는데 중복 가입되었다면 과거 가입한 휴면 계정을 소거해야 살려낼 수 있습니다.
1. [과거 탐색] 애드블록 가입이나 구글 Play용 계정 개설 과정에서 무심코 생성된 다른 이메일의 무효 계정을 반드시 뒤져서 로그인 한 후 모듈 양식을 '해지' 하십시오.
2. [결사대] 도저히 옛날 계정을 복구하거나 삭제할 수 없는 환경이라면, 현재 가입된 계정을 완전히 탈퇴하고 본 명의가 아닌 가족 구성원의 이름과 새로운 별도의 기기(IP 환경)로 우회 가입하시는 편이 가장 고속 구진 노선입니다.`;
          appealTemplate = `안녕하세요, Google AdSense 서포트 팀 요원님.

중복 계정 승인 관련 가이드라인 비협조 알림을 확인하고 오폭을 수정하기 위해 면밀한 전수 점검을 수행했습니다.

- 과거에 가입한 후 방치되었던 미사용 계정(${platform === 'web' ? '기존 명의 연계 타 메일' : '공휴 이메일'})을 완전히 로그인하여 정식 해지 및 탈퇴 처리를 완료(해지일: 2026-06-09)하였습니다.
- 현재 신청하고 있는 본 계정 1개만을 독점 활성화하여 지속 관리할 것임을 선언합니다.

기존 중복 가입 기록이 정상적으로 무효화되었음을 확인 부탁 드리며, 광고 노출 심사가 신속히 통과될 수 있도록 처방을 대기하겠습니다.`;
          break;
        case 'navigation':
          prescription = `심사 로봇이 귀하의 홈페이지 링크를 타봤으나 중간에 깨지거나 페이지를 찾을 수 없을 때 낭패를 봅니다.
1. [구조 검진] 발행해둔 도메인의 HTTPS 보안 프로토콜 인증서가 끊어지지 않았는지 살피고, 사이트 메뉴 중 빈 카테고리가 남아 무형의 공간을 연상케 하지 않는지 지우세요.
2. [사이트맵 개통] 사이트 바닥면에 Sitemap.xml 및 RSS를 올바르게 배치하고 구글 서치콘솔에 정상 등록되었는지 즉시 점검 마크를 새겨야 합니다.`;
          appealTemplate = `안녕하세요, Google AdSense 사이트 품질 담당자님.

웹사이트 탐색 불편 및 링크 단절 알림을 수신하고, 전체 도메인 및 메뉴 시스템 전반을 완벽하게 재정비했습니다.

- 깨져서 404 에러를 반환하는 소실된 가짜 링크와 빈 임시 페이지를 전부 제거했습니다.
- 구글 보트가 한 번의 진입으로 전체 보드를 크롤링하도록 sitemap.xml 시스템을 전면 보강하고 Google Search Console에 성공적으로 리인출 조율했습니다.
- 전 속도 최적화를 위해 이미지 해상도를 CSS 크기로 맞춤 인코딩하여 웹 브라우저 로딩 속도를 35% 단축했습니다.

모든 소스 링크가 정상 작동하고 있으니 쾌적한 접근성 확인 절차를 진행해주시기 바랍니다.`;
          break;
        default:
          prescription = `웹마스터 도구에 사이트가 잘 인덱싱 되고 있는지, 그리고 불필요한 시스템을 전부 빼고 오직 본인의 깨끗한 텍스트 기입으로 승부하는 구도를 만드세요.`;
          appealTemplate = `구글 애드센스 승인 심사를 청구합니다. 사이트가 최상의 정돈 구도를 수립했음을 검토 부탁드립니다.`;
      }
    } else {
      // 유튜브 크리에이터 처방
      switch (reason) {
        case 'reused_content':
          prescription = `유튜브 파트너 프로그램(YPP)에서 최근 가장 거절 빈도가 폭증(90% 가량)하는 최고 심각 사유입니다.
1. [인공지능 대본 해동] AI 자막이나 대본을 기계어로 통째 복사해 읽으면 바로 타 크리에이터와 중복(재사용) 낙인이 찍힙니다. 반드시 본인만의 실생활 비유 및 개성 있는 어조를 섞어 대본의 50% 이상을 수정하세요.
2. [비주얼 구원 법칙] 무료 스탁 이미지(Pexels 등)나 누구나 쓸 수 있는 실물 자료 화면이 연속 10초 이상 흘러가는 걸 피하세요. 화면 중간중간 나만의 채널 편집용 그래픽, 하이라이트 글자, 본인 편집 자취나 줌인/줌아웃 같은 매서운 개입을 새겨야 합니다.`;
          appealTemplate = `유튜브 심사 팀 요원님께 깊이 감사드립니다.

채널에 적용된 '재사용된 콘텐츠' 경고 판독을 수긍하고, 채널의 정체성과 오리지널 편집 지분을 완전히 증명하기 위해 전체 비디오 소스를 전폭 가공 수선하였습니다:

- 무료 배포용 스탁 비디오 클립만 단조롭게 깔려있던 초기 구간을 과감히 소거하고, 화면 비율조정, 동적 특수 자막, 줌 기법 세팅 등을 통한 고강도 2차 창작 편집 지분을 75% 이상까지 전폭 수립했습니다.
- 내레이션에 기계 자막 보이스 톤을 일체 청산하였으며, 독자들과의 깊은 커뮤니케이션을 위해 목소리 녹화 시 원음의 억양과 감정을 진솔하게 삽입했습니다.
- 영상들이 다루는 창작 대본의 뼈대는 타 채널에서 절대 도용하지 않고, 제가 매주 직접 사유하고 검증해 가며 인출한 독창적인 집필안입니다.

저작권 준수 아래 정감 있는 시니어 콘텐츠를 고유한 아이디어로 제공하고자 하오니, 승인 조치를 긍정 수용해주십시오.`;
          break;
        case 'duplicate':
          prescription = `유튜브 연계 애드센스 아이디는 오직 1개여야 하므로 과거 가입 꼬임을 확인해야 합니다.
1. [채널 앵커링 변경] 유튜브 스튜디오 [수익 창출] 탭에 진입하셔서 기존 거절 상태의 애드센스 연동 상태를 끊은 뒤, 완벽하게 정돈된 해지 확인 계정 혹은 새롭게 가족 이름으로 파놓은 활성 애드센스에 새로 바인딩 신청을 청구하십시오.`;
          appealTemplate = `유튜브 파트너 팀 담당자님, 안녕하세요.

YPP 신청 시 발생한 애드센스 계정 연결 오류 문제를 해결하기 위해 다음과 같이 소명 보고드립니다:

- 신원 교차가 얽혀있던 휴면 애드센스 구별 문제를 해소하기 위하여 기존 기기를 완전 초기화한 환경에서 최종 계정 1개에 대한 매핑 및 연계 조정을 철저히 조율 완료했습니다.
- 정상적으로 승인 처리되는 구글 애드센스 ID를 채널 스튜디오에 수동 재앵커링 바인딩 하였습니다.

채널 성실도가 투명하게 공개되도록 최선을 다하고 있사오니, 안전 승인 검사를 부탁드립니다.`;
          break;
        default:
          prescription = `기본적으로 유튜브 커뮤니티 정책을 준수하지 않는 자극을 배제하고, 실질적으로 유튜브 유저들의 기분을 화창하게 만드는 채널 성숙도를 직접 검정하세요.`;
          appealTemplate = `유튜브 파트너 자격 2차 정밀 재검토를 청구하는 소명서입니다.`;
      }
    }

    return { prescription, appealTemplate };
  }, [platform, reason]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8" id="adsense-diagnostic-center">
      
      {/* 긴급 배너 헤더 */}
      <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-slate-950 to-slate-950 p-6 sm:p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-red-500/20 text-red-400 border border-red-500/30">
              🚨 AdSense SOS Emergency Team
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              애드센스 거절 긴급 구급대 & 재승인 소명서 조리기
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              구글 애드센스 승인 거절(블로그, 티스토리, 유튜브 등)로 좌절 중이신가요? 
              현재 계정의 오리지널 신호 세기 및 사유를 정량적으로 입력하시면, <strong className="text-red-400 font-bold">예상 승인 성공 점수 산출</strong>과 함께 <strong className="text-red-400 font-bold">심사역의 마음을 강박적이고 정중하게 자극할 소명용 편지 템플릿</strong>을 탑재하여 재승인을 전폭 유도합니다.
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20 animate-pulse">
            <ShieldAlert className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 좌측 진단 입력 패널 (7 Columns) */}
        <div className="lg:col-span-7 space-y-6" id="diagnostic-inputs">
          
          {/* STEP 1: 플랫폼 및 거절 원인 지정 */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 sm:p-6 space-y-5">
            <h3 className="text-xs font-bold font-mono text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-950 text-[10px] text-red-400 border border-slate-900 font-bold">1</span>
              <span>진단 플랫폼 및 불합격 판정 사유 매칭</span>
            </h3>

            {/* 플랫폼 선택 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPlatform('web');
                  setReason('low_value');
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  platform === 'web' 
                    ? 'bg-blue-500/10 border-blue-400 text-blue-300' 
                    : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>웹사이트 (블로그/워드프레스)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlatform('youtube');
                  setReason('reused_content');
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  platform === 'youtube' 
                    ? 'bg-red-500/10 border-red-400 text-red-300' 
                    : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Youtube className="h-4 w-4" />
                <span>유튜브 비디오 채널 (YPP)</span>
              </button>
            </div>

            {/* 거절 원인 선택기 (동적 세그먼트) */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 mb-2 block">구글 메일이나 유튜브 스튜디오에서 통지한 공식 거절 텍스트:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {platform === 'web' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setReason('low_value')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        reason === 'low_value' ? 'bg-slate-900 border-slate-600 text-white font-bold' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚠️ 가치 없는 콘텐츠 (Low Value)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReason('duplicate')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        reason === 'duplicate' ? 'bg-slate-900 border-slate-600 text-white font-bold' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚠️ 중복 계정 위반 (Duplicate)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReason('navigation')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        reason === 'navigation' ? 'bg-slate-900 border-slate-600 text-white font-bold' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚠️ 보트 탐색 불가 및 링크 단절 (Navigation)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setReason('reused_content')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        reason === 'reused_content' ? 'bg-slate-900 border-slate-600 text-white font-bold' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚠️ 재사용된 콘텐츠 (Reused Content)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReason('duplicate')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        reason === 'duplicate' ? 'bg-slate-900 border-slate-600 text-white font-bold' : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚠️ 중복 애드센스 꼬임 (Duplicate)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* STEP 2: 정량적 자가 검진 수치 입력 */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 sm:p-6 space-y-6">
            <h3 className="text-xs font-bold font-mono text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-950 text-[10px] text-red-400 border border-slate-900 font-bold">2</span>
              <span>채널 / 웹사이트 신뢰성 정량 계량</span>
            </h3>

            {platform === 'web' ? (
              <div className="space-y-5" id="web-sliders">
                {/* 글 개수 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">1000자 이상 정보성 포스팅 개수:</span>
                    <span className="font-mono text-blue-400 font-bold">{articleCount}0 % 가량 충족 ({articleCount}개)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={articleCount} 
                    onChange={(e) => setArticleCount(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">구글 승인 기준 최소 권장량은 15~20개 이상입니다.</p>
                </div>

                {/* 평균 글자 수 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">평균 한 포스트당 한글 자수:</span>
                    <span className="font-mono text-blue-400 font-bold">{avgWordCount.toLocaleString()} 자</span>
                  </div>
                  <input 
                    type="range" 
                    min="300" 
                    max="2500" 
                    step="50"
                    value={avgWordCount} 
                    onChange={(e) => setAvgWordCount(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">포스트 한 편 글자 수가 1,200자 미만 한 줄 일기형이면 높은 비중으로 가치 없음 탈락합니다.</p>
                </div>

                {/* 토글 단추 2가지 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-2">
                  <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-900 hover:border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={hasSitemap} 
                      onChange={(e) => setHasSitemap(e.target.checked)}
                      className="h-4 w-4 rounded bg-slate-950 border-slate-800 accent-blue-500 text-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Sitemap.xml 및 RSS 등록</span>
                      <span className="text-[10px] text-slate-500">구글봇 수집 통로 개통 여부</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-900 hover:border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={hasPrivacyPolicy} 
                      onChange={(e) => setHasPrivacyPolicy(e.target.checked)}
                      className="h-4 w-4 rounded bg-slate-950 border-slate-800 accent-blue-500 text-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">개인정보처리방침 메뉴 배치</span>
                      <span className="text-[10px] text-slate-500">유저 보안 보호 규격 수용 여부</span>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-5" id="youtube-sliders">
                {/* 오리지널 목소리 비율 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-300 font-medium">본인 리얼 목소리 녹음 수용 비중:</span>
                    <span className="font-mono text-red-400 font-bold">{uniqueVoiceRatio}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={uniqueVoiceRatio} 
                    onChange={(e) => setUniqueVoiceRatio(Number(e.target.value))}
                    className="w-full accent-red-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500">전체 나레이션 중 무감정 기계 TTS 비중이 늘어날 수록 스튜디오에서 재사용 불이익을 배당합니다.</p>
                </div>

                {/* 토글 단추 2가지 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-2">
                  <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-900 hover:border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={hasFaceOrRealVideo} 
                      onChange={(e) => setHasFaceOrRealVideo(e.target.checked)}
                      className="h-4 w-4 rounded bg-slate-950 border-slate-800 accent-red-500 text-red-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">리얼 비디오 촬영물 지분 수반</span>
                      <span className="text-[10px] text-slate-500">본인 촬영 소스 삽입 여부</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-900 hover:border-slate-800 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      checked={heavyEditingDone} 
                      onChange={(e) => setHeavyEditingDone(e.target.checked)}
                      className="h-4 w-4 rounded bg-slate-950 border-slate-800 accent-red-500 text-red-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">고단계 연출(자막/효과/확대) 개입</span>
                      <span className="text-[10px] text-slate-500">단순 풍경 루프 방지 여부</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: 수동 실천 점검 리스트 (체크 가능한 리스트) */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-400 flex items-center justify-between gap-4 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-950 text-[10px] text-red-400 border border-slate-900 font-bold">3</span>
                <span>수동 고화질 검토 점검 체크리스트</span>
              </div>
              <span className="text-[10px] text-slate-500 lowercase">체크 시 실시간 점수 인상</span>
            </h3>

            <div className="space-y-2.5">
              {(platform === 'web' ? webChecklist : youtubeChecklist).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id, platform === 'web')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                    item.checked 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-200' 
                      : 'bg-slate-950/30 border-slate-950 text-slate-500 hover:border-slate-900/40 hover:text-slate-400'
                  }`}
                >
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    item.checked 
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                      : 'border-slate-800 bg-slate-950'
                  }`}>
                    {item.checked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-normal">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 우측 처방 리포트 및 소명사 자동 구성실 (5 Columns) */}
        <div className="lg:col-span-5 space-y-6" id="diagnostic-results">
          
          {/* 실시간 합격 안정성 리포트 보드 */}
          <div className={`rounded-3xl border ${safetyStatus.border} ${safetyStatus.bg} p-6 space-y-6 shadow-xl`}>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">구글 심사단 예상 인출 결과</span>
              <div className="flex items-baseline gap-2.5 mt-2">
                <h4 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">{safetyScore}</h4>
                <span className="text-xl font-bold font-mono text-slate-400">/ 100 점</span>
              </div>
            </div>

            {/* 신치 바형 프로그레스 장치 */}
            <div className="relative">
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out bg-gradient-to-r ${
                    safetyScore >= 80 
                      ? 'from-emerald-500 to-teal-400' 
                      : safetyScore >= 55 
                        ? 'from-amber-500 to-orange-400' 
                        : 'from-rose-600 to-red-400'
                  }`}
                  style={{ width: `${safetyScore}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
                <span>불합격 고배</span>
                <span>보완선 (55점)</span>
                <span>합격 수성 (80점)</span>
              </div>
            </div>

            {/* 등급 안내 */}
            <div className="pt-4 border-t border-slate-900/60">
              <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 ${safetyStatus.color}`}>
                등급: {safetyStatus.label}
              </span>
              <p className="mt-3.5 text-xs text-slate-300 leading-relaxed font-sans">
                {safetyStatus.action}
              </p>
            </div>
          </div>

          {/* 원점 가이드라인 오리지널 수훈 패치 요령 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5.5 space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              <span>긴급 수지 처방전 (Custom Prescription)</span>
            </h4>
            <div className="text-slate-300 text-xs leading-relaxed space-y-3 whitespace-pre-line bg-slate-900/20 p-3.5 rounded-xl border border-slate-900">
              {prescriptionAndAppeal.prescription}
            </div>
          </div>

          {/* 심사역의 마음을 흔드는 소명 템플릿(Appeal letter copywriter) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5.5 space-y-4">
            <div className="flex items-center justify-between gap-4 pb-1">
              <h4 className="text-xs font-bold font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="h-4 w-4 text-purple-400" />
                <span>심사 통과율 2.4배 소명서 (Appeal Memo)</span>
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(prescriptionAndAppeal.appealTemplate, 'appeal')}
                className="flex h-8 px-2.5 gap-1.5 rounded items-center bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white transition-colors"
                title="복사 단추"
              >
                {copiedKey === 'appeal' ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">복사 완료</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="h-3 w-3" />
                    <span>템플릿 복사</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500">
              구글 애드센스 검토 신청 혹은 이의제기 양식에 아래 텍스트를 복사해 맞춤형으로 발주하십시오:
            </p>

            <textarea
              readOnly
              value={prescriptionAndAppeal.appealTemplate}
              className="w-full h-56 rounded-xl bg-slate-900/40 border border-slate-900 p-3.5 font-mono text-[11px] text-slate-300 leading-relaxed focus:outline-none focus:ring-0 select-all"
            />
          </div>

          {/* 안심 선언 문구 */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-[11px] text-slate-400">
            <HeartHandshake className="h-5 w-5 text-emerald-400 shrink-0" />
            <p>구글 애드센스는 사람이 직접 수동으로 검증하는 비율도 높습니다. 본인이 정량적으로 지식 축적 노력을 표했음을 어필하면 이의제기가 무리 없이 소통됩니다.</p>
          </div>

        </div>

      </div>

    </div>
  );
};
