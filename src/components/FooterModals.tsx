import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, FileText, Check } from 'lucide-react';

interface FooterModalsProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export function FooterModals({ type, onClose }: FooterModalsProps) {
  const isTerms = type === 'terms';

  return (
    <AnimatePresence>
      {type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
            id={`footer-modal-${type}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                {isTerms ? (
                  <FileText className="h-5 w-5 text-amber-500" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                )}
                <h3 className="font-display font-black text-sm sm:text-base text-white tracking-tight">
                  {isTerms ? 'NuTube Premium Core Hub 이용약관' : '개인정보처리방침 안내'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm text-slate-300 space-y-5 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-slate-800">
              {isTerms ? (
                <>
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 mb-2">
                    <p className="text-[11px] sm:text-xs text-amber-400 font-medium">
                      ※ 본 이용약관은 NuTube Premium Core Hub가 제공하는 유튜브 성장 공략, AI 알고리즘 기획 분석기 및 애드센스 진단 등의 핵심 전략 리포트 서비스 사용 지침을 정의합니다.
                    </p>
                  </div>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      제 1조 (목적)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      본 약관은 영리한 크리에이터 성장 파트너 NuTube Premium Core Hub(이하 "회사" 혹은 "서비스")가 제공하는 웹 애플리케이션 및 브라우징 리소스의 합리적인 사용 한계와 회원(이하 "이용자")의 권리 의무 및 책임 사항을 목적으로 합니다.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      제 2조 (서비스의 핵심 구조 및 품질 보증의 제한)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      1. 서비스가 제공하는 유튜브 비책 아티클, AI 기반 대본/썸네일 부스터, 애드센스 긴급 진단 로직은 다변량 통계적 알고리즘 기준 및 크리에이티브 실무 지침서에 의거합니다.<br />
                      2. 인공지능 분석 데이터는 수시로 개정되는 유튜브 추천 메커니즘을 100% 실시간으로 선반영하지 못할 수 있으며, 이로 인한 개별 채널의 성취 지표(구독자, 조회수, 구글 애드센스 정식 거절 해결 등)에 정량적 100% 승인이나 흥행 보장을 법적으로 절대 확약하지 않습니다.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      제 3조 (크리에이티브 리소스의 소유권 및 재배포 규정)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      1. 서비스 내에 고밀도로 수록된 46편의 기획 서적 수준 공략본, AI 부스팅 프롬프트 쉐이퍼 시스템 디자인 전반은 독자 지식재산권으로 전속됩니다.<br />
                      2. 이용자는 가이드 내용을 회사의 본 사전 승낙 없이 무단으로 인쇄 영리용 PDF로 제작 및 2차 배포하거나 상업적 온라인 강의 교재로 무단 유상 양도하는 등의 권리 침해 행위를 일절 금지합니다.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      제 4조 (면책 조항)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      회사는 천재지변, 연계 서비스 제공처(YouTube API, Google AdSense 등)의 갑작스러운 운용 규칙 폐지 및 변동, 또는 기술적 불능 등 불가피한 오류 시스템 전환에 따른 장애에 성실한 유지 관리 책임을 다하나, 일체 파생된 제3자 채널 손실 등에 민형사상 배상 책임을 지지 않습니다.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-2">
                    <p className="text-[11px] sm:text-xs text-red-400 font-medium">
                      ※ 본 개인정보처리방침은 NuTube Premium Core Hub 서비스 이용 환경에서 이용자의 디지털 기밀을 강력하게 수호하기 위하여 어떠한 불필요한 추적 정보도 수집 전송하지 않음을 밝혀둡니다.
                    </p>
                  </div>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      제 1조 (수집하는 개인정보 항목 및 임시 보관 수준)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      1. 본 서비스는 귀찮고 유출 위험이 크며 번거로운 회원가입 절차 자체를 설계하지 않았습니다.<br />
                      2. 서비스의 AI 분석기(MetadataGenerator, PersonaAdvisor, AdSenseDiagnostic)는 이용자가 채널 진단을 위해 직접 손수 에디터에 기입한 내용(채널 주제, 타겟 등)만을 임시 파라미터로 처리합니다. 그 외 IP 주소나 브라우저 메타 정보 등의 비자발적 추적을 절대 강행하지 않습니다.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      제 2조 (개인 데이터의 사용 목적 및 연동 범위)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      이용자가 작성한 모든 메타데이터와 질문지 정보는 연동된 구글 생성형 거대 언어 모델(Gemini API) 서비스와의 오직 실시간 컨텍스트 컨설팅 일회용 통신에 한해 사용될 뿐이며, 기획 결과물과 페르소나 피드백 로직 완수 즉시 시스템 스레드에서 자동 소거됩니다.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      제 3조 (데이터의 영구 처분 및 타 단체 공유 방지)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      1. 본 플랫폼은 클라우드 서버 측에 사용자의 가이드 열람 통계 데이터베이스를 영구 축적하지 않습니다.<br />
                      2. 임시 캐싱 목적의 브라우저 보관 기법(LocalStorage)은 오직 사용자가 창을 닫기 전까지 본인 환경에서만 제어될 뿐이며, 어떠한 파트너 광고 그룹이나 제3자 정보 브로커 네트워크에도 상업용 추적 코드로 흘려보내지 않음을 다짐합니다.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 font-display">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      제 4조 (정보주체의 보증권 및 관리 책임자 소통)
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-[13px] pl-3">
                      이용자는 언제나 브라우저의 캐시 데이터를 마음껏 소거함으로써 분석 로그를 완벽 조치할 수 있습니다. 개인정보 문의 사항은 시스템 인프라 최강 책임팀 메일(apark12321@gmail.com)을 통하여 전광석화 같은 상호작용 피드백이 가능합니다.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer select-none"
              >
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>동의 및 닫기</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
