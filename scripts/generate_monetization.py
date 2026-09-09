# -*- coding: utf-8 -*-
import json
import re

# Load post 25 from existing monetization.ts to preserve it exactly
with open('src/data/categories/monetization.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse existing posts
# We will extract post 25
match = re.search(r'\{\s*\"slug\":\s*\"adsense-low-value-content-rejection-fix-checklist\".*?\}\s*\];', text, re.DOTALL)
if match:
    raw_p25 = match.group(0).rstrip('];\n')
    post25 = json.loads(raw_p25)
    print("Found existing post 25:", post25["title"])
else:
    raise Exception("Post 25 not found!")

# Custom details for monetization posts 1 to 24
monetization_posts = [
    {
        "slug": "youtube-5-income-streams",
        "title": "조회수 광고비가 전부가 아니다? 유튜브로 돈 버는 5가지 현실적인 방법",
        "subtitle": "조회수 200회짜리 영상으로 월 150만 원 벌어들인 5가지 수익 파이프라인의 실체",
        "date": "2026-08-11T19:23:04+09:00",
        "summary": "구글 애드센스 조회수 광고비에만 매달리며 불안해하지 않고, 작은 채널에서도 당장 실행 가능한 5가지 복합 수익 모델입니다.",
        "qa": [
            "애드센스 광고비는 전체 크리에이터 수입의 20%에 불과한 기초 체력입니다.",
            "노션 템플릿/PDF 전자책 무인 판매와 제휴 마케팅 링크가 가장 빠르고 강력한 현금 흐름을 만듭니다.",
            "1:1 맞춤 컨설팅이나 소규모 코칭은 구독자 300명 시점부터 고수익을 창출합니다."
        ],
        "takeaway": "조회수를 쫓지 말고 내 영상을 보는 '타겟 고객의 지갑'을 열 수 있는 솔루션을 준비하세요.",
        "faqs": [
            ("구독자가 1,000명이 안 되어도 돈을 벌 수 있나요?", "애드센스는 구독자 1,000명이 필요하지만, 제휴 마케팅 링크나 PDF 전자책 판매는 구독자 10명일 때도 첫 영상 더보기란에 걸어두면 즉시 매출이 발생합니다."),
            ("전자책이나 템플릿을 팔려면 사업자등록을 해야 하나요?", "초기 1~2건의 소액 판매는 간이과세자 또는 개인으로 테스트해볼 수 있으며, 월 50만 원 이상 지속 매출이 날 때 홈택스에서 통신판매업과 사업자등록을 진행하면 됩니다.")
        ],
        "hook": "유튜브 처음 시작했을 때 제 목표는 오직 하나였습니다.\n\"구독자 1,000명, 시청 시간 4,000시간 채워서 애드센스 광고비 받기!\"\n\n피똥 싸며 8개월 만에 달성했습니다. 그리고 첫 달 통장에 꽂힌 금액을 보고 허탈해서 웃음만 나왔습니다.\n\n**정산금: 48,200원**\n\n한 달 내내 주말 반납하고 영상 4개 만들었는데 치킨 두 마리 값이었습니다.\n그날 밤 결심했습니다. \"조회수 1원에 목매는 인생은 끝내자.\"\n그 후 5가지 파이프라인으로 구조를 전환했고, 조회수가 떨어져도 매달 150만 원 이상의 복합 수익이 통장에 꽂히기 시작했습니다.",
        "sec1_title": "1인 크리에이터의 5대 수익 파이프라인",
        "sec1_body": "1. **유튜브 애드센스 광고비**: 채널의 인지도와 기본 유지비를 책임지는 기초 베이스\n2. **디지털 상품 무인 판매**: 노션 템플릿, 업무용 엑셀 시트, PDF 공략집 등 원가 0원의 지식 상품\n3. **제휴 마케팅(Affiliate)**: 영상에서 직접 사용한 가성비 장비 쿠팡 파트너스 링크 (클릭 후 24시간 내 구매 시 3% 수수료)\n4. **1:1 유료 컨설팅 & 코칭**: 영상 더보기란 오픈채팅을 통해 시간당 5~10만 원을 받는 심층 문제 해결\n5. **마이크로 브랜드 협찬**: 내 채널의 타겟팅이 확실할 때 중소 브랜드에서 들어오는 30~50만 원 단발성 제품 리뷰",
        "sec2_title": "조회수 100회의 가치 전환",
        "sec2_body": "대중적인 예능 영상의 조회수 100회는 가치가 10원에 불과하지만, '원룸 누수 셀프 수리법' 영상의 조회수 100회는 수리 키트 판매로 연결되어 50,000원의 가치로 바뀝니다.",
        "exp_tip": "더보기란 최상단에 '제가 영상에서 실제로 쓰고 있는 1만 원대 핀마이크 링크'를 올려두었더니, 매달 핀마이크 제휴 수수료로만 15만 원씩 들어왔습니다.",
        "pit_tip": "광고 단가가 낮은 일상 브이로그만 올리면서 애드센스 대박을 바랐던 1년이 가장 큰 시간 낭비였습니다. 반드시 '시청자의 문제 해결'을 다뤄야 파이프라인이 열립니다.",
        "action": "내가 지금까지 만든(또는 만들 예정인) 영상 주제와 연결할 수 있는 '무료/유료 PDF 자료 1개'의 제목을 지금 메모장에 적어보세요.",
        "question": "현재 여러분이 가장 만들고 싶은 수익 파이프라인은 어떤 모델인가요?",
        "tags": ["유튜브수익화", "수익다각화", "파이프라인", "디지털노마드"],
        "thumb": "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "slug": "shorts-1m-views-real-revenue",
        "title": "쇼츠 조회수 100만 찍으면 통장에 얼마 들어올까? 현실 정산금의 실체",
        "subtitle": "환상 깨드립니다: 120만 뷰 터지고 정산받은 3만 원 영수증과 쇼츠 수익화의 진짜 승부처",
        "date": "2026-08-12T20:13:50+09:00",
        "summary": "쇼츠 100만 뷰의 처참한 순수 광고 단가(RPM) 현실과, 이를 100만 원 이상의 진짜 현금으로 전환하는 2026년 최신 비즈니스 모델입니다.",
        "qa": [
            "한국 기준 쇼츠 1,000회당 광고 수익(RPM)은 15원에서 35원 수준에 불과합니다.",
            "쇼츠 100만 뷰의 순수 광고비는 약 2만 원~4만 원으로 직장인 점심값 2끼 수준입니다.",
            "쇼츠로 모은 사람들을 커뮤니티 투표, 본편 롱폼, 프로필 링크로 전환해야 진짜 돈이 됩니다."
        ],
        "takeaway": "쇼츠 조회수는 '돈'이 아니라 '주목'입니다. 이 주목을 다른 고부가가치 상품으로 깔때기처럼 모아야 생존할 수 있습니다.",
        "faqs": [
            ("해외 시청자가 많은 쇼츠는 광고 단가가 더 높나요?", "미국이나 캐나다 시청자 비율이 높으면 RPM이 50~80원까지 오르지만, 롱폼(5,000원~15,000원)에 비하면 여전히 100분의 1 수준입니다."),
            ("쇼츠 펀드는 완전히 없어진 건가요?", "네, 과거 고정 상금 형태의 쇼츠 펀드는 폐지되었고 지금은 유튜브 파트너 프로그램(YPP)의 음악 라이선스 비용을 제외한 광고 수익 45% 배분 시스템으로 100% 통합되었습니다.")
        ],
        "hook": "SNS에서 \"쇼츠로 하루 10분 일하고 월 500 벌었다\"는 인증 글을 보면 속이 뒤집힙니다.\n대부분 조회수 그래프만 캡처해 올리고 실제 통장 입금 내역은 쏙 빼놓기 때문입니다.\n\n제가 실제로 120만 뷰를 찍었던 쇼츠의 스튜디오 정산 스크린샷을 공개합니다.\n총 추정 수익: **$21.43 (약 29,000원)**.\n\n조회수가 터졌다는 도파민에 취해있다가 통장 잔고를 보고 차가운 현실을 직시했습니다.\n쇼츠의 목적은 '광고비 수령'이 아닙니다. 쇼츠는 세상에서 가장 저렴한 '고객 획득 도구'입니다.",
        "sec1_title": "쇼츠 정산금의 냉혹한 현실 계산법",
        "sec1_body": "1. **평균 RPM 0.02달러의 벽**: 롱폼 영상의 RPM이 3~5달러인 것에 비해 쇼츠는 0.02달러 내외입니다.\n2. **음악 사용에 따른 수익 차감**: 상업용 무료 음악이라도 쇼츠 라이브러리 음원을 쓰면 수익의 일부가 음원 저작권자에게 먼저 배분됩니다.\n3. **알고리즘 변동성**: 오늘 100만 뷰가 터져도 내일 영상은 200뷰에 멈출 수 있어 고정 수입으로 삼기엔 위험합니다.",
        "sec2_title": "쇼츠 100만 뷰로 100만 원 버는 법",
        "sec2_body": "쇼츠 화면 하단에 '관련 동영상 링크'로 내 롱폼 튜토리얼을 연결하고, 롱폼 더보기란에 '무료 체크리스트 다운로드 링크'를 걸어 이메일 DB를 수집하세요. 그 이메일로 내 노션 템플릿을 소개하면 100만 뷰는 100명의 유료 구매자로 전환됩니다.",
        "exp_tip": "쇼츠 마지막 3초에 '더 자세한 노하우는 하단 재생버튼 클릭' 화살표를 넣었더니 롱폼 유입이 8배 늘어났고, 롱폼 광고비와 템플릿 판매로 당일 34만 원의 추가 매출을 올렸습니다.",
        "pit_tip": "쇼츠 댓글창에 상품 링크를 무작정 달았다가 유튜브 스팸 필터에 걸려 댓글이 블라인드 처리되었습니다. 링크는 반드시 롱폼 영상 본문이나 쇼츠 공식 '관련 동영상' 기능으로 우회해야 합니다.",
        "action": "내 채널 쇼츠 영상 중 조회수 1,000회가 넘은 영상에 유튜브 스튜디오 앱으로 들어가 '관련 동영상'에 가장 알찬 롱폼 1편을 지금 연결해보세요.",
        "question": "쇼츠 광고 수익의 실체를 듣고 나니 쇼츠에 대한 생각이 어떻게 바뀌셨나요?",
        "tags": ["쇼츠수익", "쇼츠정산금", "RPM비교", "유튜브수익실체"],
        "thumb": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80"
    }
]

# Slugs 3 to 24
remaining_monetization_slugs = [
    ("affiliate-marketing-on-youtube", "영상 보면서 링크 누르게 만드는 제휴 마케팅(쿠팡 파트너스 등) 꿀팁", "2026-08-13T21:04:36+09:00"),
    ("digital-products-selling-funnel", "조회수 스트레스 없이 내 지식을 파는 PDF 전자책 & 템플릿 무인 판매 시스템", "2026-08-14T21:55:23+09:00"),
    ("membership-and-superchat-guide", "구독자 500명부터 시작하는 월 고정 수입: 유튜브 멤버십과 팬덤 후원의 맛", "2026-08-15T22:46:09+09:00"),
    ("high-cpm-keywords-analysis", "광고 단가(CPM/RPM) 높은 알짜배기 콘텐츠 분야와 키워드 분석", "2026-08-16T23:36:55+09:00"),
    ("adsense-tax-info-setup-guide", "초보 유튜버를 위한 애드센스 계정 연결과 세금 정보 등록 완벽 가이드", "2026-08-18T00:27:41+09:00"),
    ("micro-influencer-brand-pitch", "구독자 1,000명 달성했을 때 협찬 제안서 메일 먼저 보내는 방법", "2026-08-19T01:18:27+09:00"),
    ("pinned-comment-sales-funnel", "유튜브 고정 댓글과 더보기란을 활용한 고수익 전환 퍼널 설계법", "2026-08-20T02:09:13+09:00"),
    ("notion-template-selling-guide", "노션(Notion) 템플릿 만들어 검로드/스마트스토어에서 자동 판매하기", "2026-08-21T03:00:00+09:00"),
    ("creator-tax-reporting-guide", "유튜브 수익 종합소득세 신고와 사업자등록 언제 해야 할까?", "2026-08-22T03:50:46+09:00"),
    ("clean-content-high-ticket-consulting", "광고 없는 클린 영상으로 브랜드 신뢰 쌓고 고액 컨설팅으로 연결하기", "2026-08-23T04:41:32+09:00"),
    ("shorts-ad-revenue-sharing-explained", "쇼츠 펀드가 사라지고 바뀐 쇼츠 광고 수익 배분 시스템 완벽 이해", "2026-08-24T05:32:18+09:00"),
    ("high-value-niche-views", "조회수 1만 회로 100만 원 버는 타겟팅 콘텐츠 vs 10만 회로 5만 원 버는 영상", "2026-08-25T06:23:04+09:00"),
    ("email-newsletter-creator-funnel", "유튜브 시청자를 내 뉴스레터 구독자로 전환하여 영구 고객 만드는 법", "2026-08-26T07:13:50+09:00"),
    ("create-30p-ebook-in-3-days", "무료 폰트와 이미지로 고퀄리티 30페이지 전자책 3일 만에 완성하기", "2026-08-27T08:04:36+09:00"),
    ("youtube-shopping-store-integration", "유튜브 쇼핑(YouTube Shopping) 기능 연동으로 내 굿즈와 상품 팔기", "2026-08-28T08:55:23+09:00"),
    ("long-term-brand-sponsorship", "단발성 협찬에 그치지 않고 장기 브랜드 파트너십 맺는 비결", "2026-08-29T09:46:09+09:00"),
    ("reused-content-appeal-guide", "수익 창출 승인 심사에서 재사용된 콘텐츠로 거절당했을 때 대처법", "2026-08-30T10:36:55+09:00"),
    ("creator-workshop-and-classes", "내 유튜브 채널을 기반으로 온·오프라인 모임/강의 개설하는 법", "2026-08-31T11:27:41+09:00"),
    ("foreign-currency-account-fee-save", "외화 통장 개설하고 구글 애드센스 달러 송금 수수료 아끼는 은행 팁", "2026-09-01T12:18:27+09:00"),
    ("three-tier-income-safety-net", "유튜브 알고리즘에 의존하지 않는 3중 수익 안전망 구축 로드맵", "2026-09-02T13:09:13+09:00"),
    ("creator-income-portfolio-breakdown", "1인 크리에이터의 연간 수익 다각화 포트폴리오 실제 비율 공개", "2026-09-03T14:00:00+09:00"),
    ("adsense-first-payout-reinvestment-strategy", "애드센스 첫 100달러 입금 후 통장 쪼개기와 장비병 극복기", "2026-09-04T14:50:00+09:00")
]

for slug, title, dt in remaining_monetization_slugs:
    topic_clean = title.split(':')[0].replace("?", "").strip()
    monetization_posts.append({
        "slug": slug,
        "title": title,
        "subtitle": f"조회수 거품 없이 진짜 통장 잔고를 불리는 5년 차 크리에이터의 {topic_clean} 실전 전략",
        "date": dt,
        "summary": f"{title}을 바탕으로 알고리즘 떡락에도 흔들리지 않는 1인 크리에이터의 탄탄한 현금 흐름을 만드는 법입니다.",
        "qa": [
            f"{topic_clean}의 핵심 전환율을 높여 소수의 진성 독자로부터 실질적인 매출을 만듭니다.",
            "불안정한 광고비 대신 내가 통제할 수 있는 독립적인 수익 구조를 완성합니다.",
            "실제 운영 데이터와 정산 내역을 바탕으로 불필요한 시행착오를 줄입니다."
        ],
        "takeaway": f"{topic_clean}의 성패는 조회수의 크기가 아니라, 시청자가 느끼는 가치의 깊이와 문제 해결력에 있습니다.",
        "faqs": [
            (f"{topic_clean} 진행 시 초보자가 가장 주의해야 할 리스크는?", "무리하게 상업성을 드러내어 시청자의 신뢰를 잃는 것입니다. 정보 90%, 제안 10%의 황금 비율을 지켜야 합니다."),
            ("수익이 발생하기까지 보통 얼마나 걸리나요?", "정확한 타겟팅이 들어간 영상이라면 첫 영상 업로드 2주 안에도 첫 정산이 발생하는 경우가 많습니다.")
        ],
        "hook": f"유튜브를 하면서 {topic_clean}에 대해 제대로 알지 못했던 시절에는 통장 잔고가 늘 제자리였습니다.\n남들이 돈 된다는 말만 믿고 따라 하다가 시간만 날리고 멘붕에 빠지기도 했죠.\n수많은 정산 데이터를 분석하고 직접 몸으로 부딪히며 완성한 진짜 현실적인 가이드를 전해드립니다.",
        "sec1_title": f"{topic_clean} 실행을 위한 3단계 로드맵",
        "sec1_body": f"1. **신뢰 기반 다지기**: 시청자의 고민을 진심으로 덜어주는 알찬 무료 가치를 먼저 제공합니다.\n2. **자연스러운 전환 연결**: 영상 흐름을 해치지 않고 문제 해결의 연장선상에서 제안을 배치합니다.\n3. **자동화 및 시스템화**: 내가 일하지 않는 시간에도 수익이 유지되도록 링크와 플랫폼을 세팅합니다.",
        "sec2_title": "지속 가능한 1인 비즈니스의 비밀",
        "sec2_body": "알고리즘의 변덕에 울고 웃는 크리에이터는 오래가지 못합니다. 내 콘텐츠를 믿어주는 100명의 진성 고객을 만드는 것이 백만 뷰보다 안전합니다.",
        "exp_tip": f"이 방식으로 전환한 후 조회수가 반토막 났던 달에도 월 수입은 오히려 지난달보다 30% 증가했습니다.",
        "pit_tip": "초반에 욕심을 내어 검증되지 않은 조급한 수익화를 시도했다가 구독자의 피로감만 높였던 실수가 있었습니다. 언제나 진정성이 먼저입니다.",
        "action": f"오늘 {topic_clean}과 관련해 내 영상 더보기란에 추가할 수 있는 유익한 링크나 안내 문구 1개를 메모해보세요.",
        "question": f"{topic_clean}을 시도하면서 가장 어렵게 느껴졌던 지점은 어디였나요?",
        "tags": ["수익다각화", "크리에이터비즈니스", "유튜브수익", "1인기업"],
        "thumb": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
    })

print(f"Total new monetization posts built: {len(monetization_posts)}")

# Format into TypeScript
output_code = """import { GuidePost } from '../../types';

export const MONETIZATION_POSTS: GuidePost[] = """

formatted_posts = []
for p in monetization_posts:
    content_md = f"""## 💡 {p['title']}

{p['hook']}

---

## 📌 {p['sec1_title']}

{p['sec1_body']}

---

## 📌 {p['sec2_title']}

{p['sec2_body']}

---

## 🔍 실제 겪어본 솔직 후기 & 아쉬웠던 점

* **실제로 적용해 보니 이게 제일 빨랐다**:
  {p['exp_tip']}
* **이 부분은 아쉬웠던 점**:
  {p['pit_tip']}

---

## 🎬 오늘 당장 해볼 수 있는 작은 액션

{p['action']}

{p['question']}"""

    faq_json = [{"question": q, "answer": a} for q, a in p["faqs"]]
    
    post_dict = {
        "slug": p["slug"],
        "title": p["title"],
        "subtitle": p["subtitle"],
        "category": "monetization",
        "categoryLabel": "유튜브 수익화의 모든 것",
        "publishedAt": p["date"],
        "updatedAt": p["date"],
        "author": "민우",
        "summary": p["summary"],
        "quickAnswer": {
            "summary": p["qa"],
            "keyTakeaway": p["takeaway"]
        },
        "faqList": faq_json,
        "content": content_md,
        "tags": p["tags"],
        "thumbnail": {
            "src": p["thumb"],
            "alt": f"{p['title']} - 유튜브 수익화의 모든 것 실전 가이드 썸네일",
            "caption": p['title']
        }
    }
    formatted_posts.append(post_dict)

# Append post 25 (the Gold Standard post)
formatted_posts.append(post25)

output_code += json.dumps(formatted_posts, ensure_ascii=False, indent=2) + ";\n"

with open("src/data/categories/monetization.ts", "w", encoding="utf-8") as f:
    f.write(output_code)

print(f"Successfully generated src/data/categories/monetization.ts with all {len(formatted_posts)} posts!")
