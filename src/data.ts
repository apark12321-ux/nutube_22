import { CategorySpec, GuidePost } from './types';
import { ROADMAP_POSTS } from './data/roadmapPosts';

// 50대 박프로가 유튜브를 왕초보로 시작해 수익 창출, 고수의 영역까지 걸어온 순서대로 정리한 글 모음
export const ALL_POSTS: GuidePost[] = ROADMAP_POSTS;

const count = (key: string) => ALL_POSTS.filter((p) => p.category === key).length;

export const CATEGORY_SPECS: Record<string, CategorySpec> = {
  start: {
    key: 'start',
    stepNumber: 1,
    label: '1단계 · 왕초보 첫걸음',
    shortLabel: '왕초보 첫걸음',
    levelBadge: '1단계',
    icon: 'Sparkles',
    gradient: 'from-amber-500 to-orange-500',
    description: '주제 정하기, 채널 만들기, 스마트폰 촬영과 첫 편집, 첫 업로드까지. 아무것도 모르던 50대가 첫 영상을 올리기까지의 순서입니다.',
    count: count('start'),
    persona: '"이 나이에 유튜브? 일단 스마트폰 하나로 시작해 봅니다"',
    accentColor: '#f59e0b'
  },
  grow: {
    key: 'grow',
    stepNumber: 2,
    label: '2단계 · 채널 키우기',
    shortLabel: '채널 키우기',
    levelBadge: '2단계',
    icon: 'TrendingUp',
    gradient: 'from-blue-500 to-indigo-600',
    description: '첫 구독자 모으기, 검색되는 제목, 첫 30초, 쇼츠, 분석 화면 읽는 법. 영상을 올린 뒤 채널을 키워 간 과정입니다.',
    count: count('grow'),
    persona: '"한 명이라도 끝까지 보게 만드는 법을 배웁니다"',
    accentColor: '#3b82f6'
  },
  money: {
    key: 'money',
    stepNumber: 3,
    label: '3단계 · 수익 내기',
    shortLabel: '수익 내기',
    levelBadge: '3단계',
    icon: 'BadgePercent',
    gradient: 'from-emerald-500 to-teal-600',
    description: '수익 창출 조건과 신청, 애드센스 연결, 첫 정산, 미국·한국 세금, 멤버십과 협찬 표시까지. 수익이 생기기까지 알아야 할 것들입니다.',
    count: count('money'),
    persona: '"조건을 채우고, 신청하고, 정산받기까지 차근차근"',
    accentColor: '#10b981'
  },
  pro: {
    key: 'pro',
    stepNumber: 4,
    label: '4단계 · 고수의 영역',
    shortLabel: '고수의 영역',
    levelBadge: '4단계',
    icon: 'PlayCircle',
    gradient: 'from-purple-500 to-violet-600',
    description: '한 주제 깊게 파기, 기획 노트, 이야기 구조, 시청 지속 그래프, AI 도구, 라이브, 저작권과 채널 보안. 한 걸음 더 나아간 운영 이야기입니다.',
    count: count('pro'),
    persona: '"오래 가는 채널은 기본기와 습관에서 나옵니다"',
    accentColor: '#8b5cf6'
  }
};

export const CATEGORIES_LIST: CategorySpec[] = [
  CATEGORY_SPECS.start,
  CATEGORY_SPECS.grow,
  CATEGORY_SPECS.money,
  CATEGORY_SPECS.pro
];
