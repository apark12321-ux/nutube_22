import React, { useState, useEffect } from 'react';
import { 
  Clapperboard, 
  Calendar, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ArrowRight, 
  Download, 
  Share2, 
  Play, 
  Layers, 
  Tag, 
  MessageSquare, 
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  Film
} from 'lucide-react';
import { GuidePost } from '../types';
import { ALL_POSTS } from '../data';
import { getPostPath } from '../postSchedule';

export type VideoFormat = 'shorts' | 'longform';
export type ProjectStatus = 'idea' | 'script' | 'audio' | 'editing' | 'packaging' | 'published';

export interface SceneItem {
  id: number;
  timeRange: string;
  screenVisual: string;
  narration: string;
  captionHighlight: string;
  bRollType: string;
}

export interface VideoProject {
  id: string;
  title: string;
  targetFormat: VideoFormat;
  status: ProjectStatus;
  targetDate: string;
  blogSlug?: string;
  hook: string;
  problem: string;
  solution: string;
  cta: string;
  scenes: SceneItem[];
  youtubeTitles: { title: string; ctrType: string; score: number }[];
  selectedTitle: string;
  description: string;
  tags: string[];
  pinnedComment: string;
  thumbnailText: string;
  thumbnailConcept: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'nutube_faceless_creator_projects_v1';

const INITIAL_PROJECTS: VideoProject[] = [
  {
    id: 'proj-1',
    title: '[쇼츠 60초] 스마트폰으로 0원 유튜브 시작하는 초간단 3단계 세팅법',
    targetFormat: 'shorts',
    status: 'editing',
    targetDate: '2026-10-24',
    blogSlug: 'smartphone-one-person-creator-starter-kit',
    hook: '300만 원 카메라 사지 마세요. 주머니 속 스마트폰 하나로 오늘 바로 유튜브 시작하는 법 알려드립니다.',
    problem: '장비병에 걸려 시작도 못 하거나, 복잡한 PC 편집기 때문에 3일 만에 포기하는 분들이 95%입니다.',
    solution: '1단계: 스마트폰 4K 30fps 고정. 2단계: 3만 원대 무선 핀마이크로 음성 분리. 3단계: 다이소 5천 원 거치대와 자연 채광 활용.',
    cta: '지금 바로 기본 카메라 열고 1분 연습해 보세요. 상세 가이드는 프로필/블로그 링크에서 확인하세요!',
    scenes: [
      {
        id: 1,
        timeRange: '00:00 - 00:03',
        screenVisual: '고가 카메라 위에 붉은색 X 표시 그래픽 + 스마트폰 화면 클로즈업',
        narration: '아직도 300만 원짜리 카메라 사려고 유튜브 시작 망설이시나요?',
        captionHighlight: '카메라 사지 마세요!',
        bRollType: '무료 스톡 카메라 & 스마트폰 화면 녹화'
      },
      {
        id: 2,
        timeRange: '00:03 - 00:15',
        screenVisual: '방구석 먼지 쌓인 장비 사진 + 한숨 쉬는 캐릭터/화면 흔들림 연출',
        narration: '장비가 화려할수록 조작하다 지쳐 95%는 한 달도 못 버티고 포기합니다. 중요한 건 장비가 아니라 알맹이입니다.',
        captionHighlight: '95%가 장비병으로 포기',
        bRollType: '스톡 비디오: 책상 위 복잡한 전선'
      },
      {
        id: 3,
        timeRange: '00:15 - 00:45',
        screenVisual: '스마트폰 카메라 설정창 화면 녹화 ➔ 다이소 거치대 세팅 ➔ 핀마이크 착용 실물 클로즈업',
        narration: '딱 3가지만 기억하세요. 첫째, 스마트폰 기본 카메라 1080p 60fps 고정. 둘째, 3만 원짜리 무선 핀마이크로 울림 제거. 셋째, 낮 시간 창가 자연광을 마주 보고 촬영하세요.',
        captionHighlight: '1080p 고정 / 핀마이크 / 창가 자연광',
        bRollType: '스마트폰 화면 녹화 화면 캡처'
      },
      {
        id: 4,
        timeRange: '00:45 - 00:60',
        screenVisual: '너튜브 블로그 화면 스크롤 캡처 + 구독 및 좋아요 모션 그래픽',
        narration: '얼굴 공개 없이 스마트폰 하나로 시작하는 실전 매뉴얼 전체는 댓글의 너튜브 링크에 모두 정리해 두었습니다. 저장해 두고 따라 해보세요!',
        captionHighlight: '댓글 링크에서 매뉴얼 확인!',
        bRollType: '너튜브 사이트 반응형 뷰 스크롤'
      }
    ],
    youtubeTitles: [
      { title: '제가 300만 원짜리 카메라 중고로 팔고 스마트폰으로 바꾼 진짜 이유', ctrType: '경험 반전형', score: 96 },
      { title: '얼굴 안 까고 스마트폰 하나로 유튜브 시작하는 0원 세팅 3단계', ctrType: '직관 혜택형', score: 94 },
      { title: '초보 유튜버 98%가 [시작 장비] 살 때 저지르는 치명적 실수', ctrType: '위험 회피형', score: 92 },
      { title: '스마트폰만으로 첫 영상 1시간 만에 완성하는 실전 공정', ctrType: '시간 단축형', score: 90 },
      { title: '50대도 10분 만에 따라 하는 노페이스 유튜브 스타터 키트', ctrType: '타깃 공감형', score: 88 }
    ],
    selectedTitle: '제가 300만 원짜리 카메라 중고로 팔고 스마트폰으로 바꾼 진짜 이유',
    description: `📌 스마트폰 하나로 시작하는 얼굴 비노출(Faceless) 유튜브 0원 세팅 매뉴얼입니다.\n\n[타임라인 챕터]\n00:00 고가 카메라가 유튜브를 망치는 이유\n00:15 스마트폰 기본 카메라 필수 권장 설정 (1080p 60fps)\n00:32 가성비 핀마이크 & 자연광 셋업\n00:48 캡컷 연동 자막 3분 컷\n\n📖 본 영상의 원문 상세 가이드:\nhttps://nutube.kr/post/smartphone-one-person-creator-starter-kit\n\n#스마트폰유튜브 #얼굴없는유튜브 #노페이스크리에이터 #1인미디어 #너튜브`,
    tags: ['스마트폰유튜브', '노페이스유튜브', '얼굴없는유튜브', '유튜브초보', '스마트폰촬영', '캡컷편집', '유튜브수익화', '1인크리에이터', '유튜브장비'],
    pinnedComment: '💬 여러분은 유튜브 시작할 때 어떤 장비가 제일 고민되시나요? 댓글로 남겨주시면 1:1로 장비 추천해 드립니다! 👇 상세 세팅 글은 상단 고정 링크를 확인하세요.',
    thumbnailText: '카메라 사지 마세요',
    thumbnailConcept: '어두운 배경에 고가 카메라 실루엣 + 빨간 사선 / 오른쪽에 밝게 켜진 스마트폰 화면 강조',
    notes: '목소리 톤은 차분하고 객관적인 톤 유지. 과장된 텐션 지양.',
    createdAt: '2026-10-21',
    updatedAt: '2026-10-21'
  },
  {
    id: 'proj-2',
    title: '[롱폼 6분] 얼굴 노출 없이 목소리와 캡컷 화면 녹화만으로 영상 완성하는 법',
    targetFormat: 'longform',
    status: 'script',
    targetDate: '2026-10-28',
    blogSlug: 'faceless-youtube-capcut-screen-recording-guide',
    hook: '얼굴 한 번 안 비추고 목소리와 화면 녹화만으로 구독자를 모으는 노페이스 영상의 비밀 구조를 공개합니다.',
    problem: '퇴근 후 피곤한 상태에서 얼굴 단장하고 조명 치는 준비 과정에 1시간 넘게 소모되어 결국 지속하지 못합니다.',
    solution: '1단계: OBS 또는 스마트폰 화면 녹화로 실전 화면 캡처. 2단계: 캡컷 자동 텍스트 자막으로 싱크 일치. 3단계: 픽사베이/펙셀스 무료 B-roll 클립으로 시각 피로도 분산.',
    cta: '얼굴 노출 걱정 없이 오늘 밤 10분만 투자해 첫 화면 녹화 클립을 만들어 보세요.',
    scenes: [
      {
        id: 1,
        timeRange: '00:00 - 00:40',
        screenVisual: '화면 녹화 프로그램 실행 화면 + 마이크 파형 애니메이션',
        narration: '직장 다니면서 유튜브 할 때 가장 큰 스트레스는 얼굴 노출과 촬영 준비 시간입니다. 하지만 교육과 정보 전달 영상은 얼굴이 안 나올 때 오히려 정보에 더 집중됩니다.',
        captionHighlight: '얼굴 노출 없이 정보에 집중',
        bRollType: '컴퓨터 화면 녹화'
      },
      {
        id: 2,
        timeRange: '00:40 - 02:30',
        screenVisual: '캡컷 PC/모바일 타임라인 화면 캡처 + 텍스트 추출 시연',
        narration: '첫 번째 핵심 공정은 대본 중심의 화면 녹화입니다. 말하고자 하는 사이트나 자료를 화면에 띄우고 자연스럽게 설명 녹음을 진행합니다.',
        captionHighlight: '대본 중심 화면 녹화 공정',
        bRollType: '화면 캡처 UI'
      },
      {
        id: 3,
        timeRange: '02:30 - 04:30',
        screenVisual: '무료 스톡 비디오 삽입 화면 + 화면 전환 트랜지션 적용',
        narration: '두 번째는 3초마다 화면에 미세한 변화를 주는 B-roll 기법입니다. 정지 화면이 5초 이상 지속되면 시청자는 이탈합니다.',
        captionHighlight: '3초 룰: 미세한 화면 변화',
        bRollType: '스톡 비디오 클립'
      },
      {
        id: 4,
        timeRange: '04:30 - 06:00',
        screenVisual: '너튜브 제작 체크리스트 표 + 구독 안내 화면',
        narration: '오늘 소개한 3가지 공정을 체크리스트로 정리했습니다. 블로그에서 무료로 확인하시고 나만의 노페이스 채널을 시작해 보세요.',
        captionHighlight: '체크리스트 확인하고 오늘 시작!',
        bRollType: '너튜브 블로그 문서 화면'
      }
    ],
    youtubeTitles: [
      { title: '얼굴 노출 0%로 퇴근 후 1시간 만에 영상 뽑아내는 노페이스 유튜브 시스템', ctrType: '시간 절약형', score: 97 },
      { title: '직장인이 얼굴 안 까고 유튜브로 월 파이프라인 만드는 3단계 공식', ctrType: '결과 약속형', score: 93 },
      { title: '화면 녹화와 캡컷만으로 완성하는 노페이스 유튜브 대본 작성법', ctrType: '기술 실전형', score: 91 },
      { title: '얼굴 공개 안 하면 떡상 못 한다고요? 천만에요.', ctrType: '편견 격파형', score: 89 }
    ],
    description: `📌 얼굴 노출 없이 목소리와 화면 캡처, AI 툴만으로 완성하는 유튜브 제작 파이프라인 가이드입니다.\n\n[타임라인 챕터]\n00:00 얼굴 없는 유튜브가 오히려 전환율이 높은 이유\n00:45 준비 시간 0초: 화면 녹화 워크플로\n02:15 3초 룰: 시청 지속 시간을 방어하는 B-roll 연출법\n04:10 캡컷 텍스트 자동 동기화 팁\n05:20 실전 액션 체크리스트\n\n📖 원문 블로그 글:\nhttps://nutube.kr/post/faceless-youtube-capcut-screen-recording-guide\n\n#노페이스유튜브 #얼굴없는유튜브 #캡컷편집 #화면녹화 #1인미디어파이프라인`,
    tags: ['노페이스유튜브', '얼굴없는유튜브', '화면녹화유튜브', '캡컷튜토리얼', '직장인부업', '유튜브대본', '1인미디어'],
    pinnedComment: '📌 영상에서 사용한 노페이스 화면 녹화 & 자막 템플릿 세팅표는 블로그 원문에 정리해 두었습니다. 질문은 댓글 남겨주세요!',
    thumbnailText: '얼굴 노출 0%\n퇴근 후 1시간',
    thumbnailConcept: '마이크와 모니터 화면 녹화 일러스트 + 텍스트에 노란색 형광펜 하이라이트',
    notes: '교육적 신뢰감을 주는 안정적 목소리 톤 유지.',
    createdAt: '2026-10-21',
    updatedAt: '2026-10-21'
  }
];

export const CreatorStudio: React.FC<{
  theme: 'light' | 'dark';
  onNavigateHome: () => void;
  onNavigatePost: (slug: string) => void;
}> = ({ theme, onNavigateHome, onNavigatePost }) => {
  const dark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'scripts' | 'metadata' | 'kanban' | 'library'>('scripts');
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved projects', e);
    }
    return INITIAL_PROJECTS;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [filterFormat, setFilterFormat] = useState<'all' | 'shorts' | 'longform'>('all');

  // Save to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const updateActiveProject = (updater: (prev: VideoProject) => VideoProject) => {
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        const updated = updater(p);
        return { ...updated, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return p;
    }));
  };

  const handleCreateFromBlogPost = (post: GuidePost) => {
    const newId = `proj-${Date.now()}`;
    const newProject: VideoProject = {
      id: newId,
      title: `[영상 기획] ${post.title}`,
      targetFormat: 'shorts',
      status: 'idea',
      targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      blogSlug: post.slug,
      hook: post.quickAnswer?.summary[0] || `${post.title}에 관한 핵심 3가지를 정리해 드립니다.`,
      problem: '이 문제를 해결하지 못하면 불필요한 비용과 시간이 낭비됩니다.',
      solution: post.quickAnswer?.summary.join(' / ') || post.summary,
      cta: '지금 바로 실천해 보세요! 상세 가이드는 너튜브 블로그에서 확인 가능합니다.',
      scenes: [
        {
          id: 1,
          timeRange: '00:00 - 00:03',
          screenVisual: '핵심 주제 텍스트 강조 + 호기심 유발 그래픽',
          narration: `${post.title}에 대해 아직도 잘못 알고 계신가요?`,
          captionHighlight: '핵심 포인트 공개!',
          bRollType: '화면 캡처 / B-roll 영상'
        },
        {
          id: 2,
          timeRange: '00:03 - 00:15',
          screenVisual: '문제 상황 그래프 또는 체크리스트 화면',
          narration: post.quickAnswer?.summary[0] || '대부분의 초보자가 겪는 가장 흔한 착각입니다.',
          captionHighlight: '가장 흔한 실수',
          bRollType: '스톡 비디오'
        },
        {
          id: 3,
          timeRange: '00:15 - 00:45',
          screenVisual: '핵심 해법 3단계 인포그래픽 표',
          narration: post.quickAnswer?.summary.slice(1).join('. ') || post.summary,
          captionHighlight: '실전 해결 공식',
          bRollType: '자료 화면 & 캡처'
        },
        {
          id: 4,
          timeRange: '00:45 - 00:60',
          screenVisual: '너튜브 블로그 링크 안내 + 저장/구독 아이콘',
          narration: '더 구체적인 실행 체크리스트는 너튜브 사이트에서 무료로 확인하세요.',
          captionHighlight: '댓글 링크에서 확인!',
          bRollType: '너튜브 웹사이트 화면'
        }
      ],
      youtubeTitles: [
        { title: `${post.title} - 아무도 안 알려주는 실전 해법`, ctrType: '비밀 공개형', score: 94 },
        { title: `제가 직접 겪어보고 바꾼 ${post.title} 노하우`, ctrType: '경험 공유형', score: 92 },
        { title: `초보자 90%가 놓치는 [${post.title}] 핵심 3가지`, ctrType: '위험 방지형', score: 90 },
      ],
      selectedTitle: `${post.title} - 아무도 안 알려주는 실전 해법`,
      description: `📌 ${post.title}\n\n${post.summary}\n\n[타임라인 챕터]\n00:00 인트로 & 핵심 요약\n00:15 반드시 알아야 할 문제점\n00:35 실전 3단계 해결책\n00:50 마무리 액션 플랜\n\n📖 원문 블로그 가이드 전문:\nhttps://nutube.kr/post/${post.slug}\n\n#너튜브 #1인미디어 #노페이스유튜브 #${post.categoryLabel.replace(/\s+/g, '')}`,
      tags: ['너튜브', '1인미디어', '유튜브제작', '노페이스유튜브', '크리에이터가이드'],
      pinnedComment: `📌 원문 블로그 글에서 상세 체크리스트와 표를 확인하실 수 있습니다: https://nutube.kr/post/${post.slug}`,
      thumbnailText: post.title.slice(0, 10),
      thumbnailConcept: '주제 관련 직관적 이미지 + 고대비 노란색/흰색 자막 폰트',
      notes: '블로그 글 기반 자동 기획 생성본.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newId);
    setActiveTab('scripts');
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert('최소 1개의 프로젝트는 유지되어야 합니다.');
      return;
    }
    if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
      const next = projects.filter(p => p.id !== id);
      setProjects(next);
      setSelectedProjectId(next[0].id);
    }
  };

  // Status mapping
  const statusLabels: Record<ProjectStatus, { label: string; color: string }> = {
    idea: { label: '아이디어 기획', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    script: { label: '대본 완료', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    audio: { label: '음성/TTS 녹음', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    editing: { label: '캡컷 영상편집', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    packaging: { label: '썸네일/메타데이터', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
    published: { label: '업로드 완료', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' }
  };

  // Calculate stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'published').length;
  const inProgressProjects = totalProjects - completedProjects;

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Header Banner */}
      <div className={`border-b ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-600 text-white flex items-center gap-1">
                  <Film className="w-3.5 h-3.5" />
                  Faceless YouTube Studio
                </span>
                <span className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  너튜브 도메인 내부 전용 관리 허브
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                노페이스 유튜브 크리에이터 스튜디오
              </h1>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                교육·영상 실무 수십 년 노하우 × 생성형 AI 도구 결합: 얼굴 노출 없이 스마트폰과 캡컷으로 완성하는 1인 유튜브 파이프라인 관리 시스템
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onNavigateHome}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                  dark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                블로그 홈으로 복귀
              </button>
              <button
                onClick={() => {
                  const newId = `proj-${Date.now()}`;
                  const newP: VideoProject = {
                    id: newId,
                    title: `새 노페이스 영상 기획 #${projects.length + 1}`,
                    targetFormat: 'shorts',
                    status: 'idea',
                    targetDate: new Date().toISOString().split('T')[0],
                    hook: '시청자의 시선을 3초 만에 사로잡는 강력한 후킹 문장',
                    problem: '이 문제를 방치했을 때 겪게 되는 손해',
                    solution: '1단계 / 2단계 / 3단계 명확한 해결책',
                    cta: '댓글 링크에서 상세 매뉴얼 확인하세요!',
                    scenes: [
                      { id: 1, timeRange: '00:00 - 00:03', screenVisual: '호기심 자극 그래픽', narration: '시작 후킹 대사', captionHighlight: '핵심 키워드', bRollType: '스톡 비디오' }
                    ],
                    youtubeTitles: [{ title: '새 영상 제목 후보', ctrType: '호기심형', score: 90 }],
                    selectedTitle: '새 영상 제목 후보',
                    description: '영상 설명문 및 타임라인',
                    tags: ['유튜브', '1인크리에이터', '노페이스'],
                    pinnedComment: '시청자 소통 질문',
                    thumbnailText: '썸네일 카피',
                    thumbnailConcept: '배경 및 시각 요소',
                    notes: '',
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0]
                  };
                  setProjects([newP, ...projects]);
                  setSelectedProjectId(newId);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                새 영상 프로젝트 기획
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80'}`}>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">총 기획 프로젝트</div>
              <div className="text-xl font-bold mt-0.5 text-indigo-600 dark:text-indigo-400">{totalProjects}편</div>
            </div>
            <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80'}`}>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">제작 진행 중</div>
              <div className="text-xl font-bold mt-0.5 text-amber-600 dark:text-amber-400">{inProgressProjects}편</div>
            </div>
            <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80'}`}>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">업로드 완료</div>
              <div className="text-xl font-bold mt-0.5 text-emerald-600 dark:text-emerald-400">{completedProjects}편</div>
            </div>
            <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200/80'}`}>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">블로그 연동 원문</div>
              <div className="text-xl font-bold mt-0.5 text-blue-600 dark:text-blue-400">{ALL_POSTS.length}편 대기</div>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('scripts')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'scripts'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Clapperboard className="w-4 h-4" />
              시나리오 & 대본 스토리보드
            </button>

            <button
              onClick={() => setActiveTab('metadata')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'metadata'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Tag className="w-4 h-4" />
              유튜브 상세정보 & 썸네일 연구실
            </button>

            <button
              onClick={() => setActiveTab('kanban')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'kanban'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
              제작 파이프라인 & 스케줄 칸반
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'library'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              블로그 원문 연동 보관함
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: SCRIPTS & STORYBOARD STUDIO */}
        {activeTab === 'scripts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Project Selector & Settings */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-4 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    프로젝트 목록 ({projects.length})
                  </h3>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `nutube-faceless-studio-${new Date().toISOString().split('T')[0]}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    title="전체 프로젝트 JSON 백업"
                  >
                    <Download className="w-3 h-3" /> 백업
                  </button>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                        p.id === activeProject.id
                          ? dark
                            ? 'bg-indigo-950/60 border-indigo-700 text-white'
                            : 'bg-indigo-50/70 border-indigo-300 text-indigo-950'
                          : dark
                            ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                          p.targetFormat === 'shorts' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {p.targetFormat === 'shorts' ? 'Shorts 60초' : 'Longform'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusLabels[p.status].color}`}>
                          {statusLabels[p.status].label}
                        </span>
                      </div>
                      <div className="text-xs font-bold line-clamp-2 leading-snug">
                        {p.title}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                        <span>목표일: {p.targetDate}</span>
                        {p.blogSlug && <span className="text-indigo-500 font-semibold">블로그 연동됨</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Format & Target Settings */}
              <div className={`p-4 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
                <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Edit3 className="w-3.5 h-3.5" />
                  기본 설정 편집
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">프로젝트 제목</label>
                    <input
                      type="text"
                      value={activeProject.title}
                      onChange={(e) => updateActiveProject(p => ({ ...p, title: e.target.value }))}
                      className={`w-full p-2 rounded border outline-none font-semibold ${
                        dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-1 font-medium">영상 포맷</label>
                      <select
                        value={activeProject.targetFormat}
                        onChange={(e) => updateActiveProject(p => ({ ...p, targetFormat: e.target.value as VideoFormat }))}
                        className={`w-full p-2 rounded border outline-none ${
                          dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="shorts">쇼츠 (Shorts 60초)</option>
                        <option value="longform">롱폼 (Longform 5~8분)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-1 font-medium">제작 공정 상태</label>
                      <select
                        value={activeProject.status}
                        onChange={(e) => updateActiveProject(p => ({ ...p, status: e.target.value as ProjectStatus }))}
                        className={`w-full p-2 rounded border outline-none ${
                          dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="idea">1. 아이디어 기획</option>
                        <option value="script">2. 대본 완료</option>
                        <option value="audio">3. 음성/TTS 녹음</option>
                        <option value="editing">4. 캡컷 영상편집</option>
                        <option value="packaging">5. 썸네일/메타데이터</option>
                        <option value="published">6. 업로드 완료</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">목표 업로드 일정</label>
                    <input
                      type="date"
                      value={activeProject.targetDate}
                      onChange={(e) => updateActiveProject(p => ({ ...p, targetDate: e.target.value }))}
                      className={`w-full p-2 rounded border outline-none ${
                        dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  {activeProject.blogSlug && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500">연동된 블로그 글</span>
                      <button
                        onClick={() => onNavigatePost(activeProject.blogSlug!)}
                        className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        원문 읽기 <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => handleDeleteProject(activeProject.id)}
                      className="text-rose-600 hover:text-rose-700 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 이 프로젝트 삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Faceless Video Storyboard & Script Workspace */}
            <div className="lg:col-span-8 space-y-6">
              {/* Faceless Director Framework Card */}
              <div className={`p-5 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-indigo-600 text-white">
                      <Clapperboard className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">
                        노페이스(Faceless) 4단계 시나리오 뼈대
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        얼굴을 안 보여주는 대신 3초 후킹과 청각적 명료성, B-roll 화면으로 시청 지속 시간을 방어합니다.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const fullScript = `[${activeProject.title}]\n\n` +
                        `0~3초 후킹: ${activeProject.hook}\n` +
                        `문제 제기: ${activeProject.problem}\n` +
                        `핵심 해법: ${activeProject.solution}\n` +
                        `콜투액션: ${activeProject.cta}\n\n` +
                        `[씬별 세부 나레이션]\n` +
                        activeProject.scenes.map(s => `${s.timeRange} (${s.screenVisual})\n대사: ${s.narration}\n자막강조: ${s.captionHighlight}`).join('\n\n');
                      handleCopy(fullScript, 'full_script');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1 cursor-pointer transition"
                  >
                    {copiedKey === 'full_script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    대본 전체 복사
                  </button>
                </div>

                {/* 4 Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                      1. 0~3초 시선 후킹 (Hook)
                    </label>
                    <textarea
                      rows={2}
                      value={activeProject.hook}
                      onChange={(e) => updateActiveProject(p => ({ ...p, hook: e.target.value }))}
                      placeholder="시청자가 스크롤을 멈추게 만드는 강렬한 의문형/경고형 첫 문장"
                      className={`w-full p-2 rounded border outline-none ${
                        dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                      2. 문제 제기 & 공감 (Problem)
                    </label>
                    <textarea
                      rows={2}
                      value={activeProject.problem}
                      onChange={(e) => updateActiveProject(p => ({ ...p, problem: e.target.value }))}
                      placeholder="초보자가 겪는 현실적 고통과 시간 낭비 요소"
                      className={`w-full p-2 rounded border outline-none ${
                        dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                      3. 핵심 3단계 솔루션 (Solution)
                    </label>
                    <textarea
                      rows={3}
                      value={activeProject.solution}
                      onChange={(e) => updateActiveProject(p => ({ ...p, solution: e.target.value }))}
                      placeholder="1단계 / 2단계 / 3단계 실행 가능한 정량적 해결책"
                      className={`w-full p-2 rounded border outline-none ${
                        dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className={`p-3 rounded-lg border ${dark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                      4. 콜투액션 & 루프 엔딩 (CTA)
                    </label>
                    <textarea
                      rows={3}
                      value={activeProject.cta}
                      onChange={(e) => updateActiveProject(p => ({ ...p, cta: e.target.value }))}
                      placeholder="댓글 링크 방문 유도 또는 쇼츠 1초 재시청 루프 문장"
                      className={`w-full p-2 rounded border outline-none ${
                        dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Storyboard Scene Cards */}
              <div className={`p-5 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      씬별 스토리보드 & 캡컷 연출 가이드 ({activeProject.scenes.length}개 씬)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      화면 연출(B-roll), 읽을 대사(TTS/녹음), 캡컷 자막 강조 포인트를 씬별로 매칭합니다.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const nextSceneId = activeProject.scenes.length + 1;
                      const newScene: SceneItem = {
                        id: nextSceneId,
                        timeRange: '추가 씬',
                        screenVisual: '화면 연출 내용 기재',
                        narration: '음성 나레이션 대사',
                        captionHighlight: '화면 중앙 핵심 자막',
                        bRollType: '화면 녹화 / 스톡 비디오'
                      };
                      updateActiveProject(p => ({ ...p, scenes: [...p.scenes, newScene] }));
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> 씬 추가
                  </button>
                </div>

                <div className="space-y-4">
                  {activeProject.scenes.map((scene, idx) => (
                    <div
                      key={scene.id}
                      className={`p-4 rounded-xl border transition ${
                        dark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={scene.timeRange}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateActiveProject(p => ({
                                ...p,
                                scenes: p.scenes.map(s => s.id === scene.id ? { ...s, timeRange: val } : s)
                              }));
                            }}
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded border outline-none ${
                              dark ? 'bg-slate-900 border-slate-700 text-indigo-300' : 'bg-white border-slate-300 text-indigo-700'
                            }`}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={scene.bRollType}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateActiveProject(p => ({
                                ...p,
                                scenes: p.scenes.map(s => s.id === scene.id ? { ...s, bRollType: val } : s)
                              }));
                            }}
                            placeholder="B-roll 영상 소스 유형"
                            className={`text-[11px] px-2 py-0.5 rounded border outline-none ${
                              dark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-600'
                            }`}
                          />
                          {activeProject.scenes.length > 1 && (
                            <button
                              onClick={() => {
                                updateActiveProject(p => ({
                                  ...p,
                                  scenes: p.scenes.filter(s => s.id !== scene.id)
                                }));
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="이 씬 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Narration */}
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">
                            🎙️ 나레이션 (TTS / 음성 대사)
                          </label>
                          <textarea
                            rows={3}
                            value={scene.narration}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateActiveProject(p => ({
                                ...p,
                                scenes: p.scenes.map(s => s.id === scene.id ? { ...s, narration: val } : s)
                              }));
                            }}
                            className={`w-full p-2 rounded border outline-none ${
                              dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                            <span>글자 수: {scene.narration.replace(/\s+/g, '').length}자</span>
                            <span>예상 음성: 약 {Math.round(scene.narration.replace(/\s+/g, '').length / 5)}초</span>
                          </div>
                        </div>

                        {/* Visual & Caption */}
                        <div className="space-y-2">
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">
                              🎬 화면 연출 (B-roll & 녹화 지침)
                            </label>
                            <input
                              type="text"
                              value={scene.screenVisual}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateActiveProject(p => ({
                                  ...p,
                                  scenes: p.scenes.map(s => s.id === scene.id ? { ...s, screenVisual: val } : s)
                                }));
                              }}
                              className={`w-full p-2 rounded border outline-none ${
                                dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">
                              🔤 캡컷 화면 자막 강조 문구
                            </label>
                            <input
                              type="text"
                              value={scene.captionHighlight}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateActiveProject(p => ({
                                  ...p,
                                  scenes: p.scenes.map(s => s.id === scene.id ? { ...s, captionHighlight: val } : s)
                                }));
                              }}
                              className={`w-full p-2 rounded border outline-none font-bold text-amber-600 dark:text-amber-400 ${
                                dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: YOUTUBE METADATA & THUMBNAIL STUDIO */}
        {activeTab === 'metadata' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                    <Tag className="w-5 h-5 text-indigo-600" />
                    유튜브 알고리즘 최적화 메타데이터 연구실
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    프로젝트: <strong className="text-indigo-600">{activeProject.title}</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    const fullMeta = `[유튜브 업로드용 메타데이터]\n\n` +
                      `1. 최종 선택 제목:\n${activeProject.selectedTitle}\n\n` +
                      `2. 설명문(타임라인 포함):\n${activeProject.description}\n\n` +
                      `3. 검색 태그 (콤마 구분):\n${activeProject.tags.join(', ')}\n\n` +
                      `4. 고정 댓글:\n${activeProject.pinnedComment}\n\n` +
                      `5. 썸네일 카피: ${activeProject.thumbnailText} (${activeProject.thumbnailConcept})`;
                    handleCopy(fullMeta, 'full_meta');
                  }}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === 'full_meta' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  유튜브 스튜디오용 전체 복사
                </button>
              </div>

              {/* 1. High-CTR Titles Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    클릭률(CTR) 극대화 제목 후보군 (A/B 테스트용)
                  </h4>
                  <span className="text-xs text-slate-400">선택한 제목이 메타데이터 기본값으로 적용됩니다</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeProject.youtubeTitles.map((t, idx) => (
                    <div
                      key={idx}
                      onClick={() => updateActiveProject(p => ({ ...p, selectedTitle: t.title }))}
                      className={`p-3.5 rounded-lg border cursor-pointer transition text-left ${
                        activeProject.selectedTitle === t.title
                          ? dark
                            ? 'bg-indigo-950/70 border-indigo-600 text-white ring-1 ring-indigo-500'
                            : 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-400'
                          : dark
                            ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {t.ctrType}
                        </span>
                        <span className="font-mono text-indigo-500 font-bold">CTR 점수: {t.score}점</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold leading-snug">
                        {t.title}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    현재 선택된 유튜브 업로드 최종 제목
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={activeProject.selectedTitle}
                      onChange={(e) => updateActiveProject(p => ({ ...p, selectedTitle: e.target.value }))}
                      className={`w-full p-2.5 rounded-lg border font-bold text-sm outline-none ${
                        dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => handleCopy(activeProject.selectedTitle, 'title_copy')}
                      className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === 'title_copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      복사
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Description & Timestamps */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <FileText className="w-4 h-4 text-blue-500" />
                    영상 설명문 & 타임라인 챕터 (SEO 검색 노출용)
                  </label>
                  <button
                    onClick={() => handleCopy(activeProject.description, 'desc_copy')}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'desc_copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    설명문 복사
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={activeProject.description}
                  onChange={(e) => updateActiveProject(p => ({ ...p, description: e.target.value }))}
                  className={`w-full p-3 rounded-lg border font-mono text-xs leading-relaxed outline-none ${
                    dark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* 3. Tags & Pinned Comment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                {/* SEO Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-purple-500" />
                      유튜브 태그 (쉼표로 구분)
                    </label>
                    <button
                      onClick={() => handleCopy(activeProject.tags.join(', '), 'tags_copy')}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'tags_copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      태그 복사
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeProject.tags.join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      updateActiveProject(p => ({ ...p, tags }));
                    }}
                    className={`w-full p-2.5 rounded-lg border text-xs outline-none ${
                      dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activeProject.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pinned Comment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      시청자 소통용 고정 댓글 (Pinned Comment)
                    </label>
                    <button
                      onClick={() => handleCopy(activeProject.pinnedComment, 'pinned_copy')}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'pinned_copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      댓글 복사
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={activeProject.pinnedComment}
                    onChange={(e) => updateActiveProject(p => ({ ...p, pinnedComment: e.target.value }))}
                    className={`w-full p-2.5 rounded-lg border text-xs outline-none ${
                      dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* 4. Faceless Thumbnail Design Brief */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200 mb-4">
                  <ImageIcon className="w-4 h-4 text-rose-500" />
                  노페이스 썸네일 기획안 (미리캔버스/캔바 작업 가이드)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className={`p-4 rounded-lg border ${dark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-slate-500 font-bold mb-1">
                      메인 텍스트 카피 (5~8자 이내, 가독성 최우선)
                    </label>
                    <input
                      type="text"
                      value={activeProject.thumbnailText}
                      onChange={(e) => updateActiveProject(p => ({ ...p, thumbnailText: e.target.value }))}
                      className={`w-full p-2 rounded border font-black text-sm outline-none text-rose-600 dark:text-rose-400 ${
                        dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
                      }`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      스마트폰 소형 화면에서도 한눈에 읽히는 간결하고 충격적인 핵심 단어 1~2개
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${dark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-slate-500 font-bold mb-1">
                      비주얼 연출 및 배경 요소
                    </label>
                    <input
                      type="text"
                      value={activeProject.thumbnailConcept}
                      onChange={(e) => updateActiveProject(p => ({ ...p, thumbnailConcept: e.target.value }))}
                      className={`w-full p-2 rounded border outline-none ${
                        dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      얼굴 대신: 스마트폰 화면 캡처, 대비되는 화살표, 텍스트 하이라이트 박스
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KANBAN PRODUCTION SCHEDULE */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  유튜브 6단계 제작 공정 칸반 파이프라인
                </h3>
                <p className="text-xs text-slate-500">
                  기획부터 촬영, 캡컷 편집, 업로드까지 원클릭으로 상태를 전환하며 스케줄을 관리합니다.
                </p>
              </div>

              {/* Format Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setFilterFormat('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                    filterFormat === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  전체 ({projects.length})
                </button>
                <button
                  onClick={() => setFilterFormat('shorts')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                    filterFormat === 'shorts' ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  쇼츠 ({projects.filter(p => p.targetFormat === 'shorts').length})
                </button>
                <button
                  onClick={() => setFilterFormat('longform')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                    filterFormat === 'longform' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  롱폼 ({projects.filter(p => p.targetFormat === 'longform').length})
                </button>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
              {(['idea', 'script', 'audio', 'editing', 'packaging', 'published'] as ProjectStatus[]).map((status) => {
                const columnProjects = projects
                  .filter(p => filterFormat === 'all' || p.targetFormat === filterFormat)
                  .filter(p => p.status === status);

                return (
                  <div
                    key={status}
                    className={`p-3 rounded-xl border flex flex-col min-h-[420px] ${
                      dark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-100/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {statusLabels[status].label}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {columnProjects.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {columnProjects.map((p) => (
                        <div
                          key={p.id}
                          className={`p-3 rounded-lg border text-left transition shadow-2xs ${
                            dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                              p.targetFormat === 'shorts' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {p.targetFormat}
                            </span>
                            <span className="text-slate-400 font-mono text-[9px]">{p.targetDate}</span>
                          </div>

                          <h5 className="text-xs font-bold line-clamp-2 leading-tight">
                            {p.title}
                          </h5>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px]">
                            <button
                              onClick={() => {
                                setSelectedProjectId(p.id);
                                setActiveTab('scripts');
                              }}
                              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                            >
                              대본 열기
                            </button>

                            {/* Move Stage Selector */}
                            <select
                              value={p.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as ProjectStatus;
                                setProjects(prev => prev.map(item => item.id === p.id ? { ...item, status: newStatus } : item));
                              }}
                              className={`text-[9px] font-semibold py-0.5 px-1 rounded border outline-none cursor-pointer ${
                                dark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <option value="idea">1. 기획</option>
                              <option value="script">2. 대본</option>
                              <option value="audio">3. 녹음</option>
                              <option value="editing">4. 편집</option>
                              <option value="packaging">5. 패키징</option>
                              <option value="published">6. 완료</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {columnProjects.length === 0 && (
                        <div className="h-24 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                          항목 없음
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: BLOG ARTICLES INTEGRATION LIBRARY */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  너튜브 블로그 아티클 연동 보관함
                </h3>
                <p className="text-xs text-slate-500">
                  블로그에 등록된 고밀도 가이드 원문을 원클릭으로 유튜브 영상 대본 및 메타데이터 프로젝트로 변환합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_POSTS.map((post) => {
                const linkedProject = projects.find(p => p.blogSlug === post.slug);

                return (
                  <div
                    key={post.slug}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                      dark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          Step {post.stepNumber || 'Guide'}
                        </span>
                        {linkedProject ? (
                          <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> 영상 기획됨
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">미기획</span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {post.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => onNavigatePost(post.slug)}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        블로그 원문 보기 <ExternalLink className="w-3 h-3" />
                      </button>

                      {linkedProject ? (
                        <button
                          onClick={() => {
                            setSelectedProjectId(linkedProject.id);
                            setActiveTab('scripts');
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1 cursor-pointer"
                        >
                          대본 편집 <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCreateFromBlogPost(post)}
                          className="px-2.5 py-1 text-xs font-bold rounded bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                        >
                          <Clapperboard className="w-3 h-3" /> 영상으로 기획하기
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
