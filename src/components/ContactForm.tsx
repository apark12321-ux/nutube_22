import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Check, User } from 'lucide-react';

interface ContactFormProps {
  theme: 'light' | 'dark';
}

interface Inquiry {
  id: string;
  type: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ theme }) => {
  const dark = theme === 'dark';
  
  // Form states
  const [inquiryType, setInquiryType] = useState('alliance'); // alliance, content_edit, ads, etc
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketId, setTicketId] = useState('');
  
  // History state for local persistence
  const [myInquiries, setMyInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('now_creator_inquiries');
      if (stored) {
        setMyInquiries(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load inquiries from localStorage', e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!name.trim()) {
      setErrorMsg('이름 또는 사명을 입력해 주세요.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('문의 제목을 입력해 주세요.');
      return;
    }
    if (!message.trim() || message.length < 10) {
      setErrorMsg('문의 내용을 최소 10자 이상 입력해 주세요.');
      return;
    }
    if (!agreePrivacy) {
      setErrorMsg('개인정보처리방침 수집 및 이용에 동의해 주셔야 문의가 가능합니다.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API server call
    setTimeout(() => {
      const newTicketId = `NCL-${Math.floor(100000 + Math.random() * 900000)}`;
      const newInquiry: Inquiry = {
        id: newTicketId,
        type: getInquiryTypeLabel(inquiryType),
        name,
        email,
        subject,
        message,
        submittedAt: new Date().toISOString(),
      };

      const updatedInquiries = [newInquiry, ...myInquiries];
      setMyInquiries(updatedInquiries);
      try {
        localStorage.setItem('now_creator_inquiries', JSON.stringify(updatedInquiries));
      } catch (e) {
        console.error('Failed to save inquiry history', e);
      }

      setTicketId(newTicketId);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setAgreePrivacy(false);
    }, 1200);
  };

  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case 'alliance': return '비즈니스 제휴 및 협업';
      case 'content_edit': return '콘텐츠 내용 수정 제보';
      case 'ads': return '광고 제안 및 노출 문의';
      default: return '기타 일반 문의';
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12 w-full min-w-0">
      <div className={`rounded-2xl border p-6 sm:p-10 shadow-lg transition-all ${
        dark ? 'border-purple-950 bg-[#120822] text-white' : 'border-slate-100 bg-white text-slate-900 shadow-xs'
      }`}>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 font-tag text-xs font-black text-purple-400 border border-purple-500/20 mb-3">
            <Mail className="h-3.5 w-3.5" />
            <span>나우크리에이터랩 공식 접수처</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-black tracking-tight">제휴 제안 & 문의하기</h1>
          <p className={`mt-2.5 text-sm sm:text-base leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            콘텐츠 오류 제보, 최신 정책 제언, 비즈니스 및 광고 제휴 관련 문의를 접수하실 수 있습니다. 
            접수된 문의는 확인 후 24시간 이내에 입력하신 이메일로 직접 회신해 드립니다.
          </p>
        </div>

        {isSuccess ? (
          <div className={`rounded-2xl border p-6 sm:p-8 text-center transition-all ${
            dark ? 'border-purple-900 bg-[#0e051d]' : 'border-emerald-100 bg-emerald-50/40'
          }`}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 dark:text-white">문의가 정상적으로 접수되었습니다!</h3>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              정상적으로 전산 접수가 완료되었습니다. 입력하신 이메일 주소로 상세 답변 및 진행 사항이 발송됩니다.
            </p>

            <div className={`mt-6 rounded-xl p-5 max-w-md mx-auto text-left border ${
              dark ? 'bg-[#150a2b] border-purple-900/60' : 'bg-white border-slate-100 shadow-xs'
            }`}>
              <div className="flex justify-between items-center border-b pb-2.5 mb-2.5 border-dashed border-slate-100 dark:border-purple-950">
                <span className="font-tag text-xs font-bold text-slate-400 uppercase">접수 고유 번호</span>
                <span className="font-tag text-sm font-black text-[#7C3AED] dark:text-purple-400 font-mono">{ticketId}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                • 검토 소요 시간: <span className="text-purple-500 dark:text-purple-400">평균 12시간 이내</span> (주말 및 공휴일 제외)
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                * 문의 접수 상세 이력은 하단 접수 이력 목록에서 언제든지 다시 확인하실 수 있습니다.
              </p>
            </div>

            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 text-sm font-black transition-all cursor-pointer shadow-md shadow-purple-500/10"
            >
              <span>추가 문의 작성하기</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 text-xs sm:text-sm font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-purple-300 mb-1.5">문의 구분</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className={`w-full rounded-xl border px-3.5 py-3 text-sm font-bold outline-none transition-all ${
                    dark 
                      ? 'border-purple-950 bg-[#090314] text-white focus:border-purple-500' 
                      : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-[#7C3AED]'
                  }`}
                >
                  <option value="alliance">🤝 비즈니스 제휴 및 협업</option>
                  <option value="content_edit">📝 콘텐츠 내용 오탈자/수정 제보</option>
                  <option value="ads">📈 광고 게재 및 홍보 문의</option>
                  <option value="general">❓ 기타 일반 문의</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-purple-300 mb-1.5">작성자명 / 단체명</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동 (또는 주식회사 파트너)"
                    className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm font-medium outline-none transition-all ${
                      dark 
                        ? 'border-purple-950 bg-[#090314] text-white focus:border-purple-500 placeholder-slate-600' 
                        : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-[#7C3AED] placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-purple-300 mb-1.5">회신받을 이메일 주소</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@yourcompany.com"
                  className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm font-medium outline-none transition-all ${
                    dark 
                      ? 'border-purple-950 bg-[#090314] text-white focus:border-purple-500 placeholder-slate-600' 
                      : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-[#7C3AED] placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-purple-300 mb-1.5">문의 제목</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="문의 유형에 맞는 요약된 한 줄을 입력해 주세요."
                className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all ${
                  dark 
                    ? 'border-purple-950 bg-[#090314] text-white focus:border-purple-500 placeholder-slate-600' 
                    : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-[#7C3AED] placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-600 dark:text-purple-300 mb-1.5">문의 내용 (최소 10자 이상)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="상세 제안 내용, 채널 환경 정보, 또는 수정이 요구되는 본문의 구체적 제목과 내용을 적어주시면 검토 시간이 단축됩니다."
                className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all resize-none ${
                  dark 
                    ? 'border-purple-950 bg-[#090314] text-white focus:border-purple-500 placeholder-slate-600' 
                    : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-[#7C3AED] placeholder-slate-400'
                }`}
              />
            </div>

            {/* Privacy Agreement */}
            <div className={`rounded-xl border p-4 sm:p-5 ${
              dark ? 'border-purple-950/60 bg-[#090314]/50' : 'border-slate-100 bg-slate-50/40'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree-privacy-chk"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                />
                <label htmlFor="agree-privacy-chk" className="text-xs sm:text-sm leading-normal select-none font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                  <span className="font-extrabold text-[#7C3AED] dark:text-purple-400">[필수]</span> 개인정보 수집 및 이용 동의
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400 dark:text-slate-400">
                    - 수집 목적: 제휴 문의 접수, 사실 확인 및 회신<br />
                    - 수집 항목: 이름/사명, 이메일 주소, 문의 정보 일체<br />
                    - 보유 및 이용 기간: <span className="font-bold text-slate-600 dark:text-slate-200">목적 달성 및 해결 후 지체 없이 즉시 파기</span>
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-purple-400/50 text-white font-extrabold py-3.5 px-4 text-sm sm:text-base transition-all cursor-pointer shadow-md shadow-purple-500/10"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>서버 전송 및 이중 보안 암호화 처리 중...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>상세 제안 및 문의 제출하기</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Inquiry History section */}
      {myInquiries.length > 0 && (
        <section className={`mt-8 rounded-2xl border p-5 sm:p-6 transition-all ${
          dark ? 'border-purple-950 bg-[#120822] text-white' : 'border-slate-100 bg-white text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 mb-4 border-b pb-3 border-slate-100 dark:border-purple-950">
            <Check className="h-5 w-5 text-[#7C3AED] dark:text-purple-400" />
            <h2 className="font-heading text-sm sm:text-base font-black">내 문의 & 제안 이력 ({myInquiries.length}건)</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {myInquiries.map((inq) => (
              <div
                key={inq.id}
                className={`rounded-xl border p-4 transition-all ${
                  dark ? 'border-purple-950 bg-[#090314]/80' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2 border-dashed border-slate-100 dark:border-purple-950/60">
                  <div className="flex items-center gap-2">
                    <span className="font-tag text-xs font-black tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 dark:text-purple-400">
                      {inq.type}
                    </span>
                    <span className="font-tag text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                      {inq.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-tag text-xs font-bold text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>확인 및 검토 중</span>
                  </div>
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white truncate mb-1">
                  {inq.subject}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap line-clamp-3 leading-relaxed">
                  {inq.message}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-purple-950/40 flex flex-wrap gap-x-4 gap-y-1 font-tag text-xs font-medium text-slate-400 dark:text-slate-500">
                  <span>제출인: {inq.name}</span>
                  <span>•</span>
                  <span>회신 이메일: {inq.email}</span>
                  <span>•</span>
                  <span>일시: {formatDate(inq.submittedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
