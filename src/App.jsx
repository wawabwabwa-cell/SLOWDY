import { useEffect, useMemo, useState } from "react";

// ============================================================
// SLOWDY v3 · 확장형 MVP
// - 이메일/비밀번호/실명/닉네임 회원가입
// - 기존 펜팔 온보딩 + 매칭 + 편지함
// - Slowdy Plus / Room / Postman / Add-on 결제 탭
// - 현재는 프론트 목업 결제. 실제 결제는 서버/PG 연결 단계에서 연동.
// ============================================================

const SKY_OPTIONS = [
  { id: "clear", emoji: "☀️", label: "맑은 하늘", desc: "햇살이 좋은 하루" },
  { id: "cloudy", emoji: "⛅", label: "구름 낀 하늘", desc: "구름이 천천히 흐르는" },
  { id: "rainy", emoji: "🌧️", label: "비 오는 하늘", desc: "차분히 내리는 비" },
  { id: "sunset", emoji: "🌇", label: "노을 진 하늘", desc: "긴 노을이 머무는" },
  { id: "night", emoji: "🌙", label: "밤하늘", desc: "조용한 별이 보이는" },
  { id: "foggy", emoji: "🌫️", label: "안개 낀 하늘", desc: "은은하게 흐린" },
];

const INTERESTS = [
  { id: "book", label: "책", emoji: "📚" },
  { id: "music", label: "음악", emoji: "🎵" },
  { id: "film", label: "영화", emoji: "🎬" },
  { id: "walk", label: "산책", emoji: "🌿" },
  { id: "travel", label: "여행", emoji: "✈️" },
  { id: "art", label: "예술", emoji: "🎨" },
  { id: "cafe", label: "카페", emoji: "☕" },
  { id: "writing", label: "글쓰기", emoji: "✍️" },
  { id: "photo", label: "사진", emoji: "📷" },
  { id: "exhibition", label: "전시", emoji: "🖼️" },
  { id: "game", label: "게임", emoji: "🎮" },
  { id: "exercise", label: "운동", emoji: "🏃" },
];

const REGIONS = ["서울", "경기", "인천", "강원", "충북", "충남", "대전", "전북", "전남", "광주", "경북", "경남", "대구", "부산", "울산", "제주", "해외"];
const AGE_GROUPS = ["10대", "20대 초", "20대 후", "30대 초", "30대 후", "40대+"];

const COMMON_QUESTIONS = [
  "요즘 나를 가장 자주 멈추게 하는 생각은?",
  "최근에 좋았던 사소한 장면은?",
  "나는 어떤 사람 앞에서 편안해지는가?",
  "나는 어떤 속도의 관계가 편한가?",
  "내가 좋아하는 사람에게 가장 먼저 보여주고 싶은 모습은?",
  "혼자 있는 시간은 나에게 어떤 의미인가?",
];

const ANON_NICKS = [
  "조용한 독서가", "밤의 산책자", "이른 아침의 사람", "긴 노을의 관찰자",
  "구름 수집가", "조용한 카페 손님", "느린 여행자", "오래된 지도의 사람",
];

const MATCH_CARDS = [
  {
    id: "card-1",
    nickname: "긴 노을의 산책자",
    sky: SKY_OPTIONS[3],
    interests: ["book", "walk", "cafe"],
    age: "20대 후",
    region: "서울",
    interestReason: "책 속 인물들이 말하지 못한 마음을 보는 게 좋아요. 글로 표현된 침묵 같은 것들이요.",
    questionAnswer: "오래된 서점에서 종이 냄새 맡으면서 멍하니 서 있을 때. 그 정적이 좋더라고요.",
  },
  {
    id: "card-2",
    nickname: "이른 아침의 기록자",
    sky: SKY_OPTIONS[0],
    interests: ["writing", "photo", "walk"],
    age: "30대 초",
    region: "경기",
    interestReason: "글쓰기는 머릿속이 너무 시끄러울 때 그걸 정리해주는 유일한 방법이에요.",
    questionAnswer: "지하철에서 책 읽는 사람을 봤어요. 요즘 그런 사람이 드물어서 한참 봤어요.",
  },
  {
    id: "card-3",
    nickname: "조용한 카페의 관찰자",
    sky: SKY_OPTIONS[1],
    interests: ["film", "music", "cafe"],
    age: "20대 초",
    region: "부산",
    interestReason: "영화관에서 영화 끝나고 크레딧 올라갈 때의 시간을 좋아해요. 여운이라는 게 그때 생겨요.",
    questionAnswer: "친구가 아무 말 없이 옆에 있어줄 때요. 그게 가장 큰 위로 같아요.",
  },
  {
    id: "card-4",
    nickname: "밤의 작은 사람",
    sky: SKY_OPTIONS[4],
    interests: ["music", "book", "writing"],
    age: "30대 후",
    region: "대전",
    interestReason: "음악은 내가 표현 못하는 감정을 대신 표현해줘서 좋아요. 특히 가사 없는 곡들이요.",
    questionAnswer: "내가 무리하지 않아도 되는 사람. 가만히 있어도 어색하지 않은 사람이요.",
  },
  {
    id: "card-5",
    nickname: "새벽의 필름",
    sky: SKY_OPTIONS[5],
    interests: ["photo", "exhibition", "film"],
    age: "20대 후",
    region: "서울",
    interestReason: "사진은 기억을 정확하게 남기기보다 흐릿하게 오래 남겨주는 느낌이라 좋아요.",
    questionAnswer: "말을 많이 하지 않아도 눈치 보지 않아도 되는 순간이 편해요.",
    plusOnly: true,
  },
  {
    id: "card-6",
    nickname: "느린 음악 편집자",
    sky: SKY_OPTIONS[2],
    interests: ["music", "writing", "cafe"],
    age: "30대 초",
    region: "인천",
    interestReason: "노래 한 곡을 오래 반복해서 들으면 그날의 기분이 조금씩 정리되는 것 같아요.",
    questionAnswer: "내 속도를 기다려주는 사람 앞에서 편안해져요.",
    plusOnly: true,
  },
];

const ROOMS = [
  { id: "book-room", emoji: "📚", title: "책방", question: "한 문장 때문에 오래 남은 책이 있나요?", members: 128 },
  { id: "film-room", emoji: "🎬", title: "영화방", question: "엔딩 크레딧이 올라갈 때 어떤 생각을 하나요?", members: 94 },
  { id: "walk-room", emoji: "🌿", title: "산책방", question: "요즘 가장 자주 걷는 길은 어디인가요?", members: 77 },
  { id: "music-room", emoji: "🎵", title: "음악방", question: "말보다 먼저 떠오르는 노래가 있나요?", members: 141 },
  { id: "writing-room", emoji: "✍️", title: "글쓰기방", question: "최근에 쓰지 못하고 삼킨 말이 있나요?", members: 86 },
];

const PLANS = [
  {
    id: "plus",
    title: "Slowdy Plus",
    price: 5900,
    period: "월 구독",
    badge: "기록 중심",
    desc: "더 많은 사람을 무한히 넘기는 구독이 아니라, 내가 쓴 기록을 더 오래 보관하는 구독.",
    benefits: ["주 2회 추천 카드", "지나간 카드 다시 보기", "편지 임시저장", "월간 하늘 다이어리", "공동 질문·편지 아카이브"],
  },
  {
    id: "room-pass",
    title: "Slowdy Room Pass",
    price: 3900,
    period: "월 커뮤니티",
    badge: "느린 커뮤니티",
    desc: "관심사가 비슷한 사람들과 같은 질문에 천천히 답하는 작은 방.",
    benefits: ["관심사방 무제한 참여", "글·목소리 답변", "월간 모임 신청", "질문 아카이브 열람"],
  },
];

const ADDONS = [
  { id: "sky-pack", title: "오늘의 하늘 카드 팩", price: 1500, emoji: "🌇", desc: "노을, 비, 밤하늘 등 계절별 배경 카드" },
  { id: "question-pack", title: "공동 질문 카드 팩", price: 1900, emoji: "❔", desc: "사랑, 취향, 혼자 있는 시간 등 주제별 질문" },
  { id: "paper-theme", title: "편지지 테마", price: 2000, emoji: "📄", desc: "필름, 책갈피, 겨울, 바다, 새벽 느낌" },
  { id: "pdf-export", title: "내 기록 PDF 내보내기", price: 2900, emoji: "📔", desc: "한 달 동안 쓴 하늘·답변·편지를 작은 다이어리처럼 저장" },
];

const POSTMAN_OPTIONS = [
  { id: "paper", title: "기본 실물 편지 발송", price: 4900, desc: "편지를 인쇄해 봉투에 담아 보냅니다." },
  { id: "premium-paper", title: "프리미엄 편지지 + 봉투", price: 2000, desc: "조금 더 좋은 종이와 봉투 디자인을 선택합니다." },
  { id: "sky-postcard", title: "오늘의 하늘 엽서", price: 1500, desc: "오늘 고른 하늘을 엽서로 함께 보냅니다." },
  { id: "voice-qr", title: "목소리 인사 QR", price: 1000, desc: "짧은 음성 인사를 QR 코드로 넣습니다." },
  { id: "reserve", title: "기념일 예약 발송", price: 1000, desc: "원하는 날짜에 도착하도록 예약합니다." },
];

const getInterest = (id) => INTERESTS.find((item) => item.id === id);
const formatPrice = (price) => `${price.toLocaleString("ko-KR")}원`;


// ============================================================
// SUPABASE REST 연결부
// - Vercel 환경변수 또는 로컬 .env에 아래 값이 있으면 서버 저장/불러오기를 사용합니다.
// - 값이 없으면 기존처럼 localStorage 목업으로 동작합니다.
// ============================================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const SERVER_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function getClientId() {
  const key = "slowdy_client_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function timeLabel(value) {
  if (!value) return "방금 전";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "방금 전";
  return date.toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

async function supabaseRest(path, options = {}) {
  if (!SERVER_ENABLED) return { data: null, error: "Supabase 환경변수가 없습니다." };
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: text || res.statusText };
    }
    if (res.status === 204) return { data: null, error: null };
    const text = await res.text();
    return { data: text ? JSON.parse(text) : null, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

function mapInboxRow(row) {
  const body = row.content || row.full || row.body || "";
  return {
    id: row.id,
    from: row.nickname || row.sender_nickname || row.from_nickname || "익명의 밤손님",
    preview: `${body.slice(0, 54)}${body.length > 54 ? "..." : ""}`,
    full: body,
    time: timeLabel(row.delivered_at || row.created_at),
    read: Boolean(row.is_read),
    serverRow: true,
  };
}

function mapSentRow(row) {
  const body = row.content || row.full || row.body || "";
  return {
    id: row.id,
    direction: "sent",
    to: row.to_nickname || row.recipient_nickname || row.nickname || "익명의 상대",
    preview: `${body.slice(0, 54)}${body.length > 54 ? "..." : ""}`,
    full: body,
    time: timeLabel(row.created_at),
    serverRow: true,
  };
}

const defaultProfile = {
  realName: "",
  nickname: "",
  age: "",
  region: "",
  sky: null,
  interests: [],
  interestReason: "",
  questionAnswer: "",
  voiceIntro: "",
  completed: false,
};

function normalizeProfile(value) {
  const merged = { ...defaultProfile, ...(value || {}) };
  return {
    ...merged,
    interests: Array.isArray(merged.interests) ? merged.interests : [],
    realName: merged.realName || "",
    nickname: merged.nickname || "",
    age: merged.age || "",
    region: merged.region || "",
    interestReason: merged.interestReason || "",
    questionAnswer: merged.questionAnswer || "",
    voiceIntro: merged.voiceIntro || "",
    completed: Boolean(merged.completed),
  };
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const styles = `
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { width: 100%; min-height: 100%; }
body, button, input, textarea, select { font-synthesis: none; text-rendering: optimizeLegibility; }
:root {
  --font-app: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --font-logo: Georgia, 'Times New Roman', serif;
  --ivory: #F5F0E8;
  --ivory-dark: #EDE5D5;
  --paper: #FAF7F2;
  --paper-warm: #F7F2E8;
  --ink: #2C2418;
  --ink-light: #5C4E3A;
  --ink-muted: #9A8A72;
  --green: #3A5240;
  --green-light: #4D6B57;
  --green-muted: #8FA898;
  --green-soft: #E8EDE9;
  --brown: #7C5C3A;
  --cream-border: #D8CCBA;
  --rose: #9F5A55;
  --shadow: rgba(44,36,24,0.10);
  --shadow-md: rgba(44,36,24,0.16);
}
body {
  background: #1A1410;
  min-height: 100vh;
  font-family: var(--font-app);
}
button, input, textarea, select { font-family: inherit; }
body { word-break: keep-all; }
.app-stage {
  min-height: 100vh;
  background: #1A1410;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 14px;
}
.device-label {
  font-family: var(--font-app);
  color: rgba(245,240,232,0.34);
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
}
.app-shell {
  width: 390px;
  height: 844px;
  background: var(--paper);
  border-radius: 40px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
}
.screen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  inset: 0;
  background: var(--paper);
}
.screen::-webkit-scrollbar, .scroll-area::-webkit-scrollbar { display: none; }
.screen-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.screen-header { padding: 48px 0 16px; flex-shrink: 0; }
.screen-label {
  font-size: 11px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 8px;
}
.screen-title {
  font-family: var(--font-app);
  font-size: 25px;
  line-height: 1.32;
  color: var(--ink);
  font-weight: 800;
  letter-spacing: -0.055em;
}
.screen-subtitle {
  font-size: 13px;
  color: var(--ink-muted);
  line-height: 1.62;
  margin-top: 8px;
}
.scroll-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 22px;
  -webkit-overflow-scrolling: touch;
}
.with-tabbar { padding-bottom: 128px; }
.bottom-btn {
  padding: 14px 0 28px;
  background: linear-gradient(to top, var(--paper) 82%, transparent);
  flex-shrink: 0;
}
.btn-primary, .btn-green, .btn-light, .btn-danger {
  border: 0;
  border-radius: 16px;
  cursor: pointer;
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  padding: 16px 18px;
  transition: transform .16s, background .16s, border-color .16s;
}
.btn-primary { background: var(--ivory); color: var(--ink); }
.btn-green { background: var(--green); color: var(--ivory); }
.btn-green:hover { background: var(--green-light); }
.btn-green:disabled { background: var(--cream-border); color: var(--ink-muted); cursor: not-allowed; }
.btn-light { background: var(--ivory); color: var(--ink); border: 1.5px solid var(--cream-border); }
.btn-danger { background: #F3DEDA; color: #79392F; border: 1px solid rgba(121,57,47,0.12); }
.btn-small {
  border: 0;
  border-radius: 100px;
  padding: 8px 12px;
  background: var(--green-soft);
  color: var(--green);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.input-group { margin-bottom: 16px; }
.input-label {
  display: block;
  font-size: 12px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 7px;
}
.text-input {
  width: 100%;
  border: 1.5px solid var(--cream-border);
  background: var(--ivory);
  border-radius: 13px;
  padding: 14px 15px;
  color: var(--ink);
  outline: none;
  resize: none;
  font-size: 15px;
}
.text-input:focus { border-color: var(--green); }
.text-input::placeholder { color: var(--ink-muted); }
.letter-lines {
  line-height: 31px;
  background-image: repeating-linear-gradient(to bottom, transparent, transparent 30px, rgba(216,204,186,0.44) 30px, rgba(216,204,186,0.44) 31px);
}
.char-counter { text-align: right; font-size: 11px; color: var(--ink-muted); margin-top: 6px; }
.step-indicator { display: flex; gap: 5px; margin-bottom: 14px; }
.step-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--cream-border); }
.step-bar.active { background: var(--green); }
.step-bar.done { background: var(--green-muted); }
.auth-screen {
  height: 100%;
  padding: 56px 28px 38px;
  background: linear-gradient(168deg, #2C2418 0%, #3A2E1E 38%, #4A3826 66%, #3D5240 100%);
  color: var(--ivory);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 24px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.auth-screen.auth-menu-mode {
  overflow: hidden;
  padding-top: 64px;
  padding-bottom: 44px;
  gap: 0;
}
.auth-screen::-webkit-scrollbar { display: none; }
.auth-screen::before, .auth-screen::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.auth-screen::before { width: 380px; height: 380px; top: -160px; right: -130px; background: radial-gradient(circle, rgba(160,120,72,.28), transparent 70%); }
.auth-screen::after { width: 300px; height: 300px; bottom: 70px; left: -120px; background: radial-gradient(circle, rgba(58,82,64,.35), transparent 70%); }
.logo-mark {
  width: 86px; height: 86px;
  border-radius: 24px;
  border: 1.5px solid rgba(245,240,232,.24);
  background: rgba(245,240,232,.08);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-app);
  font-size: 38px;
  font-family: var(--font-logo);
  backdrop-filter: blur(10px);
}
.logo-title {
  font-family: var(--font-logo);
  font-size: 48px;
  letter-spacing: -.7px;
  margin-top: 18px;
}
.logo-sub { font-size: 12.5px; color: rgba(245,240,232,.58); letter-spacing: 3.8px; text-transform: uppercase; margin-top: 9px; }
.auth-panel {
  position: relative;
  z-index: 2;
  background: rgba(245,240,232,.09);
  border: 1px solid rgba(245,240,232,.16);
  border-radius: 28px;
  padding: 20px;
  backdrop-filter: blur(14px);
}
.auth-menu-mode .auth-panel {
  margin-top: 42px;
  padding: 22px;
}
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.auth-tab {
  border: 1px solid rgba(245,240,232,.18);
  border-radius: 14px;
  background: transparent;
  color: rgba(245,240,232,.7);
  padding: 10px;
  cursor: pointer;
}
.auth-tab.active { background: var(--ivory); color: var(--ink); font-weight: 700; }
.auth-panel .text-input {
  background: rgba(245,240,232,.92);
  border-color: rgba(245,240,232,.18);
}
.helper-text { font-size: 12px; color: rgba(245,240,232,.66); line-height: 1.65; margin-top: 10px; }
.auth-hero {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}
.auth-menu-mode .auth-hero {
  margin-top: 6px;
}
.auth-copy {
  position: relative;
  z-index: 2;
  color: rgba(245,240,232,.84);
  font-size: 16.5px;
  line-height: 1.9;
  text-align: center;
  flex-shrink: 0;
  font-weight: 600;
  letter-spacing: -0.035em;
}
.auth-menu-mode .auth-copy {
  margin-top: 54px;
}
.auth-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.auth-menu-card {
  border: 1.5px solid rgba(245,240,232,.22);
  background: rgba(245,240,232,.08);
  color: var(--ivory);
  border-radius: 22px;
  padding: 22px 20px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  transition: background .16s, transform .16s, border-color .16s;
}
.auth-menu-card:hover {
  background: rgba(245,240,232,.13);
  border-color: rgba(245,240,232,.34);
  transform: translateY(-1px);
}
.auth-menu-card.primary {
  background: var(--ivory);
  color: var(--ink);
  border-color: var(--ivory);
}
.auth-menu-main {
  display: block;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.045em;
}
.auth-menu-sub {
  display: block;
  font-size: 13.5px;
  color: rgba(245,240,232,.64);
  line-height: 1.5;
  margin-top: 7px;
}
.auth-menu-card.primary .auth-menu-sub { color: var(--ink-muted); }
.auth-arrow { font-size: 24px; opacity: .75; }
.auth-back {
  border: 0;
  background: transparent;
  color: rgba(245,240,232,.72);
  font-size: 13px;
  font-weight: 600;
  padding: 0 0 14px;
  cursor: pointer;
}
.auth-form-title {
  color: var(--ivory);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.045em;
  margin-bottom: 4px;
}
.auth-form-sub {
  color: rgba(245,240,232,.64);
  font-size: 12.5px;
  line-height: 1.55;
  margin-bottom: 15px;
}
.notice {
  padding: 11px 13px;
  border-radius: 13px;
  font-size: 12.5px;
  line-height: 1.55;
  background: rgba(232,237,233,.95);
  color: var(--green);
  margin-bottom: 12px;
}

.alert {
  padding: 11px 13px;
  border-radius: 13px;
  font-size: 12.5px;
  line-height: 1.55;
  background: #F8E9DF;
  color: #7B452F;
  margin-bottom: 12px;
}
.sky-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sky-card, .card, .match-card, .room-card, .mail-card, .plan-card, .addon-card, .setting-card {
  background: var(--paper-warm);
  border: 1.5px solid var(--cream-border);
  border-radius: 20px;
  padding: 17px;
  box-shadow: 0 4px 16px rgba(44,36,24,.025);
}
.sky-card { text-align: center; cursor: pointer; }
.sky-card.selected, .option-chip.selected, .tag.selected, .check-card.selected, .plan-card.selected {
  border-color: var(--green);
  background: var(--green-soft);
}
.sky-emoji { font-size: 32px; margin-bottom: 8px; }
.sky-label { font-weight: 700; color: var(--ink); font-size: 14px; margin-bottom: 4px; }
.sky-desc { font-size: 11.5px; color: var(--ink-muted); }
.options-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
.option-chip {
  padding: 10px 6px;
  background: var(--paper);
  border: 1.5px solid var(--cream-border);
  border-radius: 11px;
  text-align: center;
  font-size: 13px;
  color: var(--ink-light);
  cursor: pointer;
}
.tags-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 9px 14px;
  border-radius: 100px;
  border: 1.5px solid var(--cream-border);
  background: var(--paper);
  color: var(--ink-light);
  font-size: 13.5px;
  cursor: pointer;
}
.tag.selected { color: var(--ivory); background: var(--green); }
.question-card {
  background: linear-gradient(145deg, var(--green), #2E4035);
  color: var(--ivory);
  border-radius: 22px;
  padding: 25px 22px;
  margin: 5px 0 18px;
  overflow: hidden;
  position: relative;
}
.question-card::before {
  content: '"';
  position: absolute;
  top: -24px; left: 12px;
  font-family: var(--font-app);
  font-size: 130px;
  color: rgba(255,255,255,.07);
}
.question-text { position: relative; z-index: 1; font-family: var(--font-app); font-size: 17px; font-weight: 700; line-height: 1.6; letter-spacing: -0.035em; }
.question-meta { position: relative; z-index: 1; font-size: 11px; color: var(--green-muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 12px; }
.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 10px;
  font-size: 11px;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--cream-border); }
.home-greeting { font-family: var(--font-app); font-size: 21px; line-height: 1.38; color: var(--ink); font-weight: 800; letter-spacing: -0.05em; }
.status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.status-card {
  background: var(--paper-warm);
  border: 1.5px solid var(--cream-border);
  border-radius: 18px;
  padding: 14px;
}
.status-num { font-family: var(--font-app); color: var(--green); font-size: 28px; line-height: 1; }
.status-label { font-size: 12px; color: var(--ink-muted); margin-top: 6px; line-height: 1.45; }
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 100px;
  background: var(--green-soft);
  color: var(--green);
  border: 1px solid rgba(58,82,64,.16);
  font-size: 11.5px;
  font-weight: 700;
}
.badge.brown { background: #EFE3D5; color: var(--brown); border-color: rgba(124,92,58,.18); }
.badge.rose { background: #F3DEDA; color: var(--rose); border-color: rgba(159,90,85,.18); }
.mini-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  background: var(--green-soft);
  color: var(--green);
  border-radius: 100px;
  font-size: 11px;
}
.cards-stack { display: flex; flex-direction: column; gap: 13px; }
.match-card { cursor: pointer; position: relative; }
.match-card.locked { opacity: .64; }
.match-head { display: flex; justify-content: space-between; gap: 10px; align-items: center; margin-bottom: 11px; }
.match-nick { font-family: var(--font-app); font-size: 18px; font-weight: 800; color: var(--ink); margin-bottom: 9px; letter-spacing: -0.045em; }
.match-meta { font-size: 11.5px; color: var(--ink-muted); }
.match-quote {
  margin-top: 12px;
  background: var(--ivory);
  border-left: 3px solid var(--green-muted);
  border-radius: 11px;
  padding: 11px 12px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--ink-light);
  font-style: italic;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: var(--ink-muted);
  font-size: 14px;
  margin-bottom: 16px;
  cursor: pointer;
}
.detail-hero {
  margin: -1px -24px 20px;
  padding: 30px 24px 28px;
  background: linear-gradient(160deg, var(--green), #2E4035);
  color: var(--ivory);
}
.detail-nick { font-family: var(--font-app); font-size: 24px; font-weight: 800; margin: 11px 0 4px; letter-spacing: -0.05em; }
.detail-meta { font-size: 12.5px; color: rgba(245,240,232,.68); }
.detail-text {
  background: var(--ivory);
  border: 1px solid var(--cream-border);
  border-radius: 15px;
  padding: 15px 16px;
  color: var(--ink);
  font-size: 14px;
  line-height: 1.75;
}
.letter-paper {
  background: var(--ivory);
  border: 1px solid var(--cream-border);
  border-radius: 19px;
  padding: 19px 16px;
}
.letter-textarea {
  min-height: 225px;
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  resize: none;
  color: var(--ink);
  font-size: 15px;
  line-height: 31px;
  background-image: repeating-linear-gradient(to bottom, transparent, transparent 30px, rgba(216,204,186,0.44) 30px, rgba(216,204,186,0.44) 31px);
}
.mail-card { cursor: pointer; margin-bottom: 10px; position: relative; }
.mail-card.unread::after {
  content: '';
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  position: absolute;
  top: 16px; right: 16px;
}
.mail-from { font-size: 13.5px; color: var(--ink); font-weight: 700; margin-bottom: 5px; }
.mail-preview { color: var(--ink-muted); font-size: 13px; line-height: 1.5; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mail-time { color: var(--ink-muted); font-size: 11px; margin-top: 8px; }
.mail-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin: 0 0 14px; }
.mail-tab { border: 1.5px solid var(--cream-border); background: var(--paper-warm); color: var(--ink-muted); border-radius: 14px; padding: 11px 6px 10px; cursor: pointer; font-family: var(--font-app); transition: all .18s ease; }
.mail-tab.active { border-color: var(--green); background: var(--green-soft); color: var(--green); box-shadow: 0 6px 16px var(--shadow); }
.mail-tab-label { display: block; font-size: 12.5px; font-weight: 800; letter-spacing: -0.04em; }
.mail-tab-count { display: block; font-size: 11px; margin-top: 3px; opacity: .75; }
.mail-direction { display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border-radius: 999px; background: var(--green-soft); color: var(--green); font-size: 10.5px; font-weight: 700; margin-bottom: 7px; }
.empty-state { text-align: center; padding: 54px 24px; }
.empty-icon { font-size: 44px; opacity: .75; margin-bottom: 14px; }
.empty-title { font-family: var(--font-app); font-weight: 800; color: var(--ink); font-size: 16px; margin-bottom: 8px; letter-spacing: -0.04em; }
.empty-text { color: var(--ink-muted); font-size: 13px; line-height: 1.7; }
.plan-card { margin-bottom: 12px; position: relative; }
.plan-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.plan-title { font-family: var(--font-app); font-size: 18px; color: var(--ink); font-weight: 800; letter-spacing: -0.045em; }
.plan-price { font-family: var(--font-app); color: var(--green); font-size: 28px; line-height: 1; margin-top: 8px; }
.plan-period { color: var(--ink-muted); font-size: 12px; margin-top: 2px; }
.benefit-list { display: flex; flex-direction: column; gap: 7px; margin: 12px 0 14px; }
.benefit { font-size: 12.5px; color: var(--ink-light); line-height: 1.45; }
.addon-card { display: grid; grid-template-columns: 38px 1fr auto; gap: 10px; align-items: center; margin-bottom: 9px; }
.addon-emoji { font-size: 27px; }
.addon-title { font-weight: 700; color: var(--ink); font-size: 14px; }
.addon-desc { color: var(--ink-muted); font-size: 12px; margin-top: 3px; line-height: 1.45; }
.room-card { margin-bottom: 11px; }
.room-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.room-title { font-family: var(--font-app); font-weight: 800; color: var(--ink); font-size: 18px; letter-spacing: -0.045em; }
.room-question { background: var(--ivory); border-left: 3px solid var(--green-muted); border-radius: 12px; padding: 11px 12px; color: var(--ink-light); font-size: 13px; line-height: 1.55; }
.check-card {
  border: 1.5px solid var(--cream-border);
  background: var(--paper-warm);
  border-radius: 16px;
  padding: 13px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 8px;
}
.check-title { font-weight: 700; color: var(--ink); font-size: 14px; }
.check-desc { color: var(--ink-muted); font-size: 12px; line-height: 1.45; margin-top: 4px; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid var(--cream-border); }
.toggle-text { color: var(--ink); font-size: 14px; font-weight: 600; }
.toggle-sub { color: var(--ink-muted); font-size: 12px; line-height: 1.45; margin-top: 3px; }
.toggle {
  width: 44px; height: 24px;
  border-radius: 100px;
  background: var(--cream-border);
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}
.toggle::after {
  content: '';
  width: 18px; height: 18px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px; left: 3px;
  box-shadow: 0 1px 4px rgba(0,0,0,.18);
  transition: transform .17s;
}
.toggle.on { background: var(--green); }
.toggle.on::after { transform: translateX(20px); }

.tabbed-screen {
  overflow: hidden;
}
.tabbed-scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 0 24px calc(128px + env(safe-area-inset-bottom, 0px));
}
.tabbed-scroll::-webkit-scrollbar { display: none; }
.tabbed-scroll .screen-header {
  padding: 48px 0 16px;
}
.tabbed-scroll .scroll-area {
  overflow: visible;
  min-height: auto;
  height: auto;
  padding-bottom: 0;
}
.tabbed-scroll .with-tabbar {
  padding-bottom: 0;
}
.tab-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  height: calc(86px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--cream-border);
  background: rgba(250,247,242,.98);
  backdrop-filter: blur(12px);
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: start;
  padding: 8px 6px calc(13px + env(safe-area-inset-bottom, 0px));
}
.tab-item {
  border: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--ink-muted);
  cursor: pointer;
  border-radius: 13px;
  padding: 7px 2px;
}
.tab-icon { font-size: 18px; opacity: .65; }
.tab-label { font-size: 9.5px; letter-spacing: -.3px; }
.tab-item.active .tab-icon { opacity: 1; }
.tab-item.active .tab-label { color: var(--green); font-weight: 700; }
.success-screen { text-align: center; padding: 74px 28px; }
.success-icon { font-size: 58px; margin-bottom: 18px; }
.success-title { font-family: var(--font-app); font-weight: 800; color: var(--ink); font-size: 21px; margin-bottom: 10px; letter-spacing: -0.045em; }
.success-text { color: var(--ink-muted); font-size: 14px; line-height: 1.75; margin-bottom: 28px; }
.fade-in { animation: fade-in .28s ease both; }
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-height: 760px) {
  .auth-screen.auth-menu-mode { overflow-y: auto; padding-top: 42px; padding-bottom: 34px; }
  .auth-menu-mode .auth-copy { margin-top: 32px; }
  .auth-menu-mode .auth-panel { margin-top: 30px; }
  .logo-mark { width: 76px; height: 76px; font-size: 34px; }
  .logo-title { font-size: 42px; }
  .auth-menu-card { padding: 18px 18px; }
}

@media (max-width: 430px) {
  .app-stage { padding: 0; }
  .app-shell { width: 100vw; height: 100vh; border-radius: 0; }
  .device-label, .device-footnote { display: none; }
  .tabbed-scroll { padding-left: 24px; padding-right: 24px; }
}

`;

function AuthScreen({ onAuth, onGuest }) {
  const [mode, setMode] = useState("menu");
  const [form, setForm] = useState({ email: "", password: "", realName: "", nickname: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const goMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
  };

  const submit = () => {
    setError("");
    setNotice("");
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const users = readStorage("slowdy_users", []);

    if (!email.includes("@") || password.length < 6) {
      setError("이메일 형식과 6자 이상 비밀번호를 확인해주세요.");
      return;
    }

    if (mode === "signup") {
      if (!form.realName.trim() || !form.nickname.trim()) {
        setError("회원가입에는 실명과 닉네임이 모두 필요해요.");
        return;
      }
      if (users.some((user) => user.email === email)) {
        setError("이미 가입된 이메일이에요. 로그인으로 전환해주세요.");
        return;
      }
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        realName: form.realName.trim(),
        nickname: form.nickname.trim(),
        createdAt: new Date().toISOString(),
      };
      saveStorage("slowdy_users", [...users, newUser]);
      setMode("login");
      setForm((prev) => ({ ...prev, email, password: "", realName: "", nickname: "" }));
      setNotice("회원가입이 완료됐어요. 이제 방금 만든 이메일로 로그인해주세요.");
      return;
    }

    const user = users.find((item) => item.email === email && item.password === password);
    if (!user) {
      setError("가입 정보가 없거나 비밀번호가 달라요. 회원가입 후 다시 로그인해주세요.");
      return;
    }
    onAuth(user);
  };

  return (
    <div className="screen">
      <div className={`auth-screen ${mode === "menu" ? "auth-menu-mode" : "auth-form-mode"}`}>
        <div className="auth-hero">
          <div className="logo-mark">S</div>
          <div className="logo-title">Slowdy</div>
          <div className="logo-sub">slow · steady · letters</div>
        </div>

        <div className="auth-copy">
          빠른 채팅보다 느린 편지,<br />더 많은 매칭보다 오래 남는 기록.
        </div>

        {mode === "menu" ? (
          <div className="auth-panel">
            <div className="auth-menu">
              <button className="auth-menu-card primary" onClick={() => goMode("login")}>
                <span>
                  <span className="auth-menu-main">로그인</span>
                  <span className="auth-menu-sub">이미 계정이 있다면 이어서 시작</span>
                </span>
                <span className="auth-arrow">→</span>
              </button>

              <button className="auth-menu-card" onClick={() => goMode("signup")}>
                <span>
                  <span className="auth-menu-main">회원가입</span>
                  <span className="auth-menu-sub">이메일, 실명, 닉네임 등록</span>
                </span>
                <span className="auth-arrow">→</span>
              </button>

              <button className="auth-menu-card" onClick={onGuest}>
                <span>
                  <span className="auth-menu-main">게스트로 시작하기</span>
                  <span className="auth-menu-sub">로그인 없이 먼저 둘러보기</span>
                </span>
                <span className="auth-arrow">→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-panel">
            <button className="auth-back" onClick={() => goMode("menu")}>← 처음으로</button>

            <div className="auth-form-title">{mode === "login" ? "로그인" : "회원가입"}</div>
            <div className="auth-form-sub">
              {mode === "login"
                ? "가입한 이메일과 비밀번호로 Slowdy를 이어서 사용해요."
                : "가입이 끝나면 바로 시작하지 않고 로그인 화면으로 돌아가요."}
            </div>

            {notice && <div className="notice">{notice}</div>}
            {error && <div className="alert">{error}</div>}

            <div className="input-group">
              <label className="input-label" style={{ color: "rgba(245,240,232,.68)" }}>이메일</label>
              <input className="text-input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="slowdy@example.com" />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: "rgba(245,240,232,.68)" }}>비밀번호</label>
              <input className="text-input" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="6자 이상" />
            </div>

            {mode === "signup" && (
              <>
                <div className="input-group">
                  <label className="input-label" style={{ color: "rgba(245,240,232,.68)" }}>실명</label>
                  <input className="text-input" value={form.realName} onChange={(e) => update("realName", e.target.value)} placeholder="본인 확인용. 상대에게 공개되지 않음" />
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ color: "rgba(245,240,232,.68)" }}>닉네임</label>
                  <input className="text-input" value={form.nickname} onChange={(e) => update("nickname", e.target.value)} placeholder="앱 안에서 보이는 이름" />
                </div>
              </>
            )}

            <button className="btn-primary" onClick={submit}>{mode === "login" ? "로그인하기" : "회원가입 완료"}</button>

            {mode === "login" ? (
              <div className="helper-text">
                아직 계정이 없다면 처음 화면에서 회원가입을 먼저 진행해주세요.
              </div>
            ) : (
              <div className="helper-text">
                실명은 본인 확인용이며 상대에게 공개되지 않습니다. 상대에게는 닉네임과 취향만 보여요.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StepBars({ step, total = 6 }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className={`step-bar ${index + 1 < step ? "done" : index + 1 === step ? "active" : ""}`} />
      ))}
    </div>
  );
}

function SkyStep({ profile, setProfile, onNext }) {
  return (
    <StepScreen step={1} label="Step 1 of 6" title={<>오늘의 하늘은<br />어떤가요?</>} subtitle="지금 기분이나 하루의 분위기를 골라주세요. 나중에 월간 다이어리로 쌓일 기록입니다." onNext={onNext} nextDisabled={!profile.sky} nextLabel="다음으로">
      <div className="sky-grid">
        {SKY_OPTIONS.map((sky) => (
          <div key={sky.id} className={`sky-card ${profile.sky?.id === sky.id ? "selected" : ""}`} onClick={() => setProfile({ ...profile, sky })}>
            <div className="sky-emoji">{sky.emoji}</div>
            <div className="sky-label">{sky.label}</div>
            <div className="sky-desc">{sky.desc}</div>
          </div>
        ))}
      </div>
    </StepScreen>
  );
}

function ProfileStep({ authUser, profile, setProfile, onNext }) {
  const generateNick = () => {
    const idx = Math.floor(Math.random() * ANON_NICKS.length);
    setProfile({ ...profile, nickname: ANON_NICKS[idx] });
  };

  return (
    <StepScreen step={2} label="Step 2 of 6" title="나를 소개해요" subtitle="실명은 본인 확인용이고, 상대에게는 닉네임만 보여요." onNext={onNext} nextDisabled={!profile.nickname.trim() || !profile.age || !profile.region} nextLabel="다음으로">
      <div className="input-group">
        <label className="input-label">실명</label>
        <input className="text-input" value={profile.realName || ""} onChange={(e) => setProfile({ ...profile, realName: e.target.value })} placeholder="본인 확인용" />
        <div style={{ fontSize: 11.5, color: "var(--ink-muted)", marginTop: 6 }}>기본값: {authUser.realName || "회원가입 실명"}</div>
      </div>
      <div className="input-group">
        <label className="input-label">닉네임</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="text-input" style={{ flex: 1 }} value={profile.nickname || ""} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} placeholder="닉네임 입력" />
          <button className="btn-small" style={{ width: 54, borderRadius: 13, fontSize: 18 }} onClick={generateNick}>🎲</button>
        </div>
      </div>
      <div className="input-group">
        <label className="input-label">연령대</label>
        <div className="options-grid">
          {AGE_GROUPS.map((age) => (
            <div key={age} className={`option-chip ${profile.age === age ? "selected" : ""}`} onClick={() => setProfile({ ...profile, age })}>{age}</div>
          ))}
        </div>
      </div>
      <div className="input-group">
        <label className="input-label">거주 지역</label>
        <div className="options-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {REGIONS.map((region) => (
            <div key={region} className={`option-chip ${profile.region === region ? "selected" : ""}`} onClick={() => setProfile({ ...profile, region })}>{region}</div>
          ))}
        </div>
      </div>
    </StepScreen>
  );
}

function InterestStep({ profile, setProfile, onNext }) {
  const toggle = (id) => {
    const exists = (profile.interests || []).includes(id);
    const interests = exists ? (profile.interests || []).filter((item) => item !== id) : [...(profile.interests || []), id];
    setProfile({ ...profile, interests });
  };

  return (
    <StepScreen step={3} label="Step 3 of 6" title="무엇을 좋아해요?" subtitle="관심사가 비슷한 사람, 그리고 관심사가 비슷한 방을 추천하는 기준이에요." onNext={onNext} nextDisabled={(profile.interests || []).length < 2} nextLabel={(profile.interests || []).length < 2 ? `${2 - profile.interests.length}개 더 선택` : "다음으로"}>
      <div className="tags-grid">
        {INTERESTS.map((interest) => (
          <div key={interest.id} className={`tag ${profile.interests.includes(interest.id) ? "selected" : ""}`} onClick={() => toggle(interest.id)}>
            <span>{interest.emoji}</span><span>{interest.label}</span>
          </div>
        ))}
      </div>
    </StepScreen>
  );
}

function ReasonStep({ profile, setProfile, onNext }) {
  const selected = (profile.interests || []).map((id) => getInterest(id)?.label).filter(Boolean).join(", ");

  return (
    <StepScreen step={4} label="Step 4 of 6" title={<>왜 그것들을<br />좋아하나요?</>} subtitle="단순 취향보다 이유가 대화의 시작점이 됩니다." onNext={onNext} nextDisabled={(profile.interestReason || "").trim().length < 10} nextLabel="다음으로">
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="screen-label" style={{ marginBottom: 5 }}>내가 고른 관심사</div>
        <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.55 }}>{selected}</div>
      </div>
      <div className="input-group">
        <label className="input-label">관심사를 좋아하는 이유</label>
        <textarea className="text-input letter-lines" rows={6} maxLength={220} value={profile.interestReason || ""} onChange={(e) => setProfile({ ...profile, interestReason: e.target.value })} placeholder="예) 영화관에서 영화 끝나고 크레딧이 올라가는 시간을 좋아해요." />
        <div className="char-counter">{(profile.interestReason || "").length}/220</div>
      </div>
    </StepScreen>
  );
}

function QuestionStep({ profile, setProfile, onNext }) {
  const question = COMMON_QUESTIONS[new Date().getDate() % COMMON_QUESTIONS.length];
  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });

  return (
    <StepScreen step={5} label="Step 5 of 6 · 오늘의 공동 질문" title="짧게 답해주세요" subtitle="모든 사용자가 같은 질문에 답해요. 매칭카드와 Slowdy Room의 핵심 소재입니다." onNext={onNext} nextDisabled={(profile.questionAnswer || "").trim().length < 10} nextLabel="다음으로">
      <div className="question-card">
        <div className="question-text">{question}</div>
        <div className="question-meta">{today} · 오늘의 공동 질문</div>
      </div>
      <div className="input-group">
        <label className="input-label">나의 답변</label>
        <textarea className="text-input letter-lines" rows={6} maxLength={320} value={profile.questionAnswer || ""} onChange={(e) => setProfile({ ...profile, questionAnswer: e.target.value })} placeholder="떠오르는 대로 자유롭게 적어보세요..." />
        <div className="char-counter">{(profile.questionAnswer || "").length}/320</div>
      </div>
    </StepScreen>
  );
}

function VoiceStep({ profile, setProfile, onNext }) {
  return (
    <StepScreen step={6} label="Step 6 of 6 · 목소리 인사" title={<>목소리 인사를<br />남길까요?</>} subtitle="실제 녹음 기능은 서버/스토리지 연결 후 붙이고, 지금은 문구로 목업을 잡아둡니다." onNext={onNext} nextLabel="온보딩 완료">
      <div className="card" style={{ textAlign: "center", padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎙️</div>
        <div className="screen-title" style={{ fontSize: 20 }}>짧은 목소리 인사</div>
        <div className="screen-subtitle">Plus에서는 여러 버전을 저장하고, Postman에서는 QR 코드로 실물 편지에 넣을 수 있어요.</div>
      </div>
      <div className="input-group">
        <label className="input-label">목소리 인사 메모</label>
        <textarea className="text-input" rows={4} maxLength={150} value={profile.voiceIntro || ""} onChange={(e) => setProfile({ ...profile, voiceIntro: e.target.value })} placeholder="예) 안녕하세요. 저는 산책하면서 음악 듣는 걸 좋아해요." />
        <div className="char-counter">{(profile.voiceIntro || "").length}/150</div>
      </div>
    </StepScreen>
  );
}

function StepScreen({ step, label, title, subtitle, children, onNext, nextDisabled = false, nextLabel }) {
  return (
    <div className="screen">
      <div className="screen-content">
        <div className="screen-header">
          <StepBars step={step} />
          <div className="screen-label">{label}</div>
          <div className="screen-title">{title}</div>
          <div className="screen-subtitle">{subtitle}</div>
        </div>
        <div className="scroll-area fade-in">{children}</div>
        <div className="bottom-btn">
          <button className="btn-green" disabled={nextDisabled} onClick={onNext}>{nextLabel}</button>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ profile, subscription, letters, purchases, onNav }) {
  const plus = subscription.plus;
  const unread = letters.filter((letter) => !letter.read).length;
  const todayQuestion = COMMON_QUESTIONS[new Date().getDate() % COMMON_QUESTIONS.length];

  return (
    <ScreenShell active="home" onNav={onNav}>
      <div className="screen-header">
        <div className="badge">{plus ? "🌿 Plus 이용 중" : "무료 이용 중"}</div>
        <div className="home-greeting" style={{ marginTop: 12 }}>{profile.nickname}님,<br />오늘도 천천히 이어가요.</div>
        <div className="screen-subtitle">실명은 공개되지 않고, 상대에게는 닉네임과 취향 중심으로만 보여요.</div>
      </div>

      <div className="scroll-area with-tabbar fade-in">
        <div className="status-grid">
          <div className="status-card"><div className="status-num">{letters.length}</div><div className="status-label">받은 편지</div></div>
          <div className="status-card"><div className="status-num">{unread}</div><div className="status-label">새 편지</div></div>
          <div className="status-card"><div className="status-num">{plus ? 2 : 1}</div><div className="status-label">이번 주 카드 추천 횟수</div></div>
          <div className="status-card"><div className="status-num">{purchases.length}</div><div className="status-label">구매/주문 기록</div></div>
        </div>

        <div className="section-label">오늘의 하늘</div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 36 }}>{profile.sky?.emoji || "☁️"}</div>
          <div>
            <div style={{ color: "var(--ink)", fontWeight: 700 }}>{profile.sky?.label || "아직 기록 없음"}</div>
            <div style={{ color: "var(--ink-muted)", fontSize: 12.5, lineHeight: 1.5, marginTop: 3 }}>{profile.sky?.desc || "온보딩에서 오늘의 하늘을 골라주세요."}</div>
          </div>
        </div>

        <div className="section-label">오늘의 공동 질문</div>
        <div className="question-card" style={{ marginTop: 0 }}>
          <div className="question-text">{todayQuestion}</div>
          <div className="question-meta">Slowdy common question</div>
        </div>

        <div className="btn-row">
          <button className="btn-light" onClick={() => onNav("today")}>매칭 카드 보기</button>
          <button className="btn-light" onClick={() => onNav("pay")}>Plus 보기</button>
        </div>
      </div>
    </ScreenShell>
  );
}

function TodayScreen({ profile, subscription, sentIds, onSelectCard, onNav }) {
  const cards = subscription.plus ? MATCH_CARDS : MATCH_CARDS.filter((card) => !card.plusOnly);
  const lockedCount = MATCH_CARDS.length - cards.length;

  return (
    <ScreenShell active="today" onNav={onNav}>
      <div className="screen-header">
        <div className="badge">✦ 이번 주의 인연 {cards.length}명</div>
        <div className="screen-title" style={{ marginTop: 12 }}>누구에게 편지를<br />보낼까요?</div>
        <div className="screen-subtitle">기본은 주 1회 4명 추천, Plus는 기록 보관과 함께 추천 기회가 주 2회로 늘어납니다.</div>
      </div>

      <div className="scroll-area with-tabbar fade-in">
        <div className="cards-stack">
          {cards.map((card) => (
            <MatchCard key={card.id} card={card} sent={sentIds.includes(card.id)} onClick={() => onSelectCard(card)} />
          ))}
          {!subscription.plus && lockedCount > 0 && (
            <div className="match-card locked" onClick={() => onNav("pay")}>
              <div className="badge brown">Plus 전용 카드 {lockedCount}명</div>
              <div className="match-nick" style={{ marginTop: 12 }}>지나간 카드와 추가 추천을 열어보세요</div>
              <div className="match-quote">“더 많이 넘기는 권한보다, 놓친 인연과 나의 기록을 다시 볼 수 있게 설계했습니다.”</div>
            </div>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}

function MatchCard({ card, sent, onClick }) {
  return (
    <div className="match-card" onClick={onClick}>
      <div className="match-head">
        <div className="badge"><span>{card.sky.emoji}</span>{card.sky.label}</div>
        <div className="match-meta">{card.age} · {card.region}</div>
      </div>
      <div className="match-nick">{card.nickname}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {card.interests.map((id) => {
          const item = getInterest(id);
          return <span className="mini-tag" key={id}>{item?.emoji} {item?.label}</span>;
        })}
      </div>
      <div className="match-quote">“{card.interestReason}”</div>
      {sent && <div className="badge" style={{ marginTop: 12 }}>✉ 편지 보냄</div>}
    </div>
  );
}

function CardDetailScreen({ card, subscription, onBack, onWrite, onPay, sent }) {
  const question = COMMON_QUESTIONS[0];

  return (
    <div className="screen">
      <div className="screen-content">
        <div className="screen-header" style={{ paddingBottom: 0 }}>
          <button className="back-btn" onClick={onBack}>← 카드 목록으로</button>
        </div>
        <div className="scroll-area">
          <div className="detail-hero fade-in">
            <div className="badge" style={{ background: "rgba(245,240,232,.16)", color: "var(--ivory)", borderColor: "rgba(245,240,232,.16)" }}>{card.sky.emoji} 오늘의 하늘 · {card.sky.label}</div>
            <div className="detail-nick">{card.nickname}</div>
            <div className="detail-meta">{card.age} · {card.region}</div>
          </div>

          <div className="section-label">관심사</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {card.interests.map((id) => {
              const item = getInterest(id);
              return <span className="mini-tag" key={id} style={{ padding: "6px 12px", fontSize: 13 }}>{item?.emoji} {item?.label}</span>;
            })}
          </div>

          <div className="section-label">좋아하는 이유</div>
          <div className="detail-text">“{card.interestReason}”</div>

          <div className="section-label">오늘의 공동 질문</div>
          <div className="detail-text"><strong>Q. {question}</strong><br /><br />“{card.questionAnswer}”</div>

          {!subscription.plus && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="badge brown">Plus 미리보기</div>
              <div style={{ color: "var(--ink)", fontWeight: 700, marginTop: 10 }}>지나간 카드 보관, 편지 임시저장, 월간 다이어리 기능은 Plus에서 열립니다.</div>
              <button className="btn-light" style={{ marginTop: 12 }} onClick={onPay}>결제 탭 보기</button>
            </div>
          )}
        </div>
        <div className="bottom-btn">
          {sent ? <button className="btn-light" disabled>이미 편지를 보냈어요</button> : <button className="btn-green" onClick={onWrite}>✉️ 편지 쓰기</button>}
        </div>
      </div>
    </div>
  );
}

function WriteLetterScreen({ recipient, subscription, onBack, onSend }) {
  const [content, setContent] = useState("");
  const [saveDraft, setSaveDraft] = useState(false);
  const [postman, setPostman] = useState(false);

  const canDraft = subscription.plus;

  return (
    <div className="screen">
      <div className="screen-content">
        <div className="screen-header" style={{ paddingBottom: 12 }}>
          <button className="back-btn" onClick={onBack}>← 뒤로</button>
          <div className="screen-label">편지 쓰기</div>
          <div className="screen-title">{recipient.nickname}에게</div>
          <div className="screen-subtitle">편지는 바로 도착하지 않고 하루 정도의 느린 도착감을 유지합니다.</div>
        </div>
        <div className="scroll-area fade-in">
          <div className="letter-paper">
            <textarea className="letter-textarea" value={content} onChange={(e) => setContent(e.target.value)} maxLength={1200} placeholder="안녕하세요,&#10;&#10;오늘 당신의 답변을 읽고 문득 생각난 게 있어서 편지를 씁니다." />
          </div>
          <div className="char-counter">{content.length}/1200</div>

          <div className="section-label">발송 옵션</div>
          <div className="check-card" onClick={() => canDraft && setSaveDraft(!saveDraft)}>
            <div>
              <div className="check-title">편지 임시저장</div>
              <div className="check-desc">Plus 기능. 아직 보내기 전 문장을 보관합니다.</div>
            </div>
            <span className="badge brown">{canDraft ? (saveDraft ? "선택됨" : "선택") : "Plus"}</span>
          </div>
          <div className={`check-card ${postman ? "selected" : ""}`} onClick={() => setPostman(!postman)}>
            <div>
              <div className="check-title">Slowdy Postman 연결</div>
              <div className="check-desc">온라인 편지를 실제 종이 편지로 주문할 수 있게 넘깁니다.</div>
            </div>
            <span className="badge">{postman ? "선택됨" : "선택"}</span>
          </div>
        </div>
        <div className="bottom-btn">
          <button className="btn-green" disabled={content.trim().length < 10} onClick={() => onSend({ content, saveDraft, postman })}>{postman ? "편지 보내고 Postman 주문하기" : "편지 보내기"}</button>
        </div>
      </div>
    </div>
  );
}

function MailboxScreen({ letters, sentLetters, onRead, onReadSent, onNav }) {
  const [activeTab, setActiveTab] = useState("inbox");
  const unreadLetters = letters.filter((letter) => !letter.read);
  const currentLetters = activeTab === "sent" ? sentLetters : activeTab === "unread" ? unreadLetters : letters;

  const tabInfo = {
    inbox: { title: "아직 받은 편지가 없어요", text: "오늘의 카드에서 먼저 편지를 보내보세요." },
    sent: { title: "보낸 편지가 없어요", text: "누군가의 카드에 천천히 답장을 남겨보세요." },
    unread: { title: "읽지 않은 편지가 없어요", text: "새 편지가 도착하면 이곳에 따로 모아둘게요." },
  };

  const renderLetter = (letter) => {
    const isSent = activeTab === "sent";
    return (
      <div
        key={letter.id}
        className={`mail-card ${!isSent && !letter.read ? "unread" : ""}`}
        onClick={() => isSent ? onReadSent(letter) : onRead(letter)}
      >
        <div className="mail-direction">{isSent ? "보낸 편지" : letter.read ? "받은 편지" : "읽지 않음"}</div>
        <div className="mail-from">{isSent ? `${letter.to}에게` : `${letter.from}에게서`}</div>
        <div className="mail-preview">{letter.preview}</div>
        <div className="mail-time">{letter.time}</div>
      </div>
    );
  };

  return (
    <ScreenShell active="mailbox" onNav={onNav}>
      <div className="screen-header">
        <div className="screen-label">Mailbox</div>
        <div className="screen-title">느리게 도착한<br />편지함</div>
        <div className="screen-subtitle">받은 편지, 보낸 편지, 아직 읽지 않은 편지를 나눠서 볼 수 있어요.</div>
      </div>
      <div className="scroll-area with-tabbar fade-in">
        <div className="mail-tabs">
          <button className={`mail-tab ${activeTab === "inbox" ? "active" : ""}`} onClick={() => setActiveTab("inbox")}>
            <span className="mail-tab-label">받은 편지</span>
            <span className="mail-tab-count">{letters.length}</span>
          </button>
          <button className={`mail-tab ${activeTab === "sent" ? "active" : ""}`} onClick={() => setActiveTab("sent")}>
            <span className="mail-tab-label">보낸 편지</span>
            <span className="mail-tab-count">{sentLetters.length}</span>
          </button>
          <button className={`mail-tab ${activeTab === "unread" ? "active" : ""}`} onClick={() => setActiveTab("unread")}>
            <span className="mail-tab-label">읽지 않음</span>
            <span className="mail-tab-count">{unreadLetters.length}</span>
          </button>
        </div>
        {currentLetters.length === 0 ? (
          <EmptyState icon="📭" title={tabInfo[activeTab].title} text={tabInfo[activeTab].text} />
        ) : currentLetters.map(renderLetter)}
      </div>
    </ScreenShell>
  );
}

function ReadLetterScreen({ letter, onBack, onReply }) {
  const isSent = letter?.direction === "sent";
  const displayName = isSent ? letter?.to : letter?.from;

  return (
    <div className="screen" style={{ background: "var(--ivory-dark)" }}>
      <div className="screen-content">
        <div className="screen-header" style={{ paddingBottom: 12 }}>
          <button className="back-btn" onClick={onBack}>← 편지함으로</button>
          <div className="screen-label">{isSent ? "보낸 편지" : "받은 편지"}</div>
          <div className="screen-title">{displayName || "누군가"}{isSent ? "에게" : "에게서"}</div>
        </div>
        <div className="scroll-area fade-in">
          <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 6px 24px var(--shadow-md)" }}>
            <div style={{ background: "var(--ivory)", borderBottom: "1px solid var(--cream-border)", padding: 20 }}>
              <div style={{ fontFamily: "var(--font-app)", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>{isSent ? `${letter?.to}에게 보냄` : letter?.from}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-muted)", marginTop: 4 }}>{letter?.time}</div>
            </div>
            <div style={{ background: "var(--ivory)", padding: 22, minHeight: 320, color: "var(--ink)", lineHeight: 1.95, fontSize: 15, whiteSpace: "pre-wrap", fontWeight: 300 }}>{letter?.full}</div>
          </div>
        </div>
        {!isSent && (
          <div className="bottom-btn">
            <button className="btn-green" onClick={onReply}>답장 쓰기</button>
          </div>
        )}
      </div>
    </div>
  );
}

function RoomScreen({ subscription, roomUses, onJoin, onNav }) {
  const canJoinMore = subscription.plus || subscription.roomPass || roomUses < 1;

  return (
    <ScreenShell active="rooms" onNav={onNav}>
      <div className="screen-header">
        <div className="badge brown">Slowdy Room</div>
        <div className="screen-title" style={{ marginTop: 12 }}>관심사가 닮은<br />작은 방</div>
        <div className="screen-subtitle">긴 채팅방이 아니라 같은 질문에 천천히 답하는 커뮤니티입니다. 무료 유저는 월 1회 참여로 제한됩니다.</div>
      </div>
      <div className="scroll-area with-tabbar fade-in">
        {!canJoinMore && (
          <div className="alert">이번 달 무료 참여 1회를 사용했어요. Room Pass 또는 Plus를 구매하면 계속 참여할 수 있어요.</div>
        )}
        {ROOMS.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-head">
              <div>
                <div className="room-title">{room.emoji} {room.title}</div>
                <div style={{ color: "var(--ink-muted)", fontSize: 12, marginTop: 3 }}>{room.members}명이 천천히 참여 중</div>
              </div>
              <span className="badge">주간 질문</span>
            </div>
            <div className="room-question">Q. {room.question}</div>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn-light" onClick={() => onJoin(room, false)}>둘러보기</button>
              <button className="btn-green" disabled={!canJoinMore} onClick={() => onJoin(room, true)}>참여하기</button>
            </div>
          </div>
        ))}
        <button className="btn-light" onClick={() => onNav("pay")}>Room Pass 결제 보러가기</button>
      </div>
    </ScreenShell>
  );
}

function PostmanScreen({ pendingPostman, onPurchase, onNav }) {
  const [selected, setSelected] = useState(["paper"]);
  const [method, setMethod] = useState("slowdy-private");
  const total = POSTMAN_OPTIONS.filter((option) => selected.includes(option.id)).reduce((sum, option) => sum + option.price, 0);

  const toggle = (id) => {
    if (id === "paper") return;
    setSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  return (
    <ScreenShell active="postman" onNav={onNav}>
      <div className="screen-header">
        <div className="badge rose">Slowdy Postman</div>
        <div className="screen-title" style={{ marginTop: 12 }}>온라인 편지를<br />실제 편지로</div>
        <div className="screen-subtitle">주소는 상대에게 직접 공개하지 않고 Slowdy가 중간에서 처리하는 구조를 전제로 설계합니다.</div>
      </div>
      <div className="scroll-area with-tabbar fade-in">
        {pendingPostman ? (
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="badge">방금 쓴 편지 연결됨</div>
            <div style={{ color: "var(--ink)", fontWeight: 700, marginTop: 10 }}>받는 사람: {pendingPostman.recipient}</div>
            <div style={{ color: "var(--ink-muted)", fontSize: 12.5, lineHeight: 1.6, marginTop: 5 }}>편지 내용을 종이 편지 주문에 연결할 준비가 되었어요.</div>
          </div>
        ) : (
          <div className="alert">편지를 먼저 쓰면 여기에서 실물 편지 주문으로 이어집니다. 지금은 샘플 주문도 가능합니다.</div>
        )}

        <div className="section-label">수령 방식</div>
        {[{ id: "slowdy-private", title: "주소 비공개 발송", desc: "주소는 Slowdy만 보관하고 상대에게 노출하지 않음" }, { id: "pickup", title: "제휴 카페/편의점 픽업", desc: "위치 공개 부담을 줄이는 픽업 방식" }, { id: "po-box", title: "사서함 방식", desc: "추후 우체국/제휴 사서함 연결" }].map((item) => (
          <div key={item.id} className={`check-card ${method === item.id ? "selected" : ""}`} onClick={() => setMethod(item.id)}>
            <div><div className="check-title">{item.title}</div><div className="check-desc">{item.desc}</div></div>
            <span className="badge">{method === item.id ? "선택됨" : "선택"}</span>
          </div>
        ))}

        <div className="section-label">편지 옵션</div>
        {POSTMAN_OPTIONS.map((option) => (
          <div key={option.id} className={`check-card ${selected.includes(option.id) ? "selected" : ""}`} onClick={() => toggle(option.id)}>
            <div>
              <div className="check-title">{option.title}</div>
              <div className="check-desc">{option.desc}</div>
            </div>
            <span className="badge brown">{formatPrice(option.price)}</span>
          </div>
        ))}

        <div className="card" style={{ marginTop: 12 }}>
          <div className="plan-top">
            <div>
              <div className="screen-label">예상 결제 금액</div>
              <div className="plan-price">{formatPrice(total)}</div>
            </div>
            <span className="badge rose">Postman</span>
          </div>
          <button className="btn-green" onClick={() => onPurchase({ type: "postman", title: "Slowdy Postman 주문", price: total, options: selected, method })}>실물 편지 주문하기</button>
        </div>
      </div>
    </ScreenShell>
  );
}

function PaymentScreen({ subscription, purchases, onBuyPlan, onBuyAddon, onNav }) {
  return (
    <ScreenShell active="pay" onNav={onNav}>
      <div className="screen-header">
        <div className="badge">결제 탭</div>
        <div className="screen-title" style={{ marginTop: 12 }}>Slowdy의 유료 서비스</div>
        <div className="screen-subtitle">매칭 자체를 과하게 팔기보다, 기록·커뮤니티·실물 편지·작은 표현 기능에 결제를 붙인 구조입니다.</div>
      </div>

      <div className="scroll-area with-tabbar fade-in">
        <div className="section-label">구독 / 커뮤니티</div>
        {PLANS.map((plan) => {
          const active = plan.id === "plus" ? subscription.plus : subscription.roomPass;
          return (
            <div key={plan.id} className={`plan-card ${active ? "selected" : ""}`}>
              <div className="plan-top">
                <div>
                  <span className="badge brown">{plan.badge}</span>
                  <div className="plan-title" style={{ marginTop: 9 }}>{plan.title}</div>
                  <div className="plan-price">{formatPrice(plan.price)}</div>
                  <div className="plan-period">{plan.period}</div>
                </div>
                {active && <span className="badge">이용 중</span>}
              </div>
              <div style={{ color: "var(--ink-muted)", fontSize: 12.7, lineHeight: 1.6 }}>{plan.desc}</div>
              <div className="benefit-list">
                {plan.benefits.map((benefit) => <div className="benefit" key={benefit}>✓ {benefit}</div>)}
              </div>
              <button className={active ? "btn-light" : "btn-green"} onClick={() => onBuyPlan(plan)}>{active ? "이미 활성화됨" : `${plan.title} 결제하기`}</button>
            </div>
          );
        })}

        <div className="section-label">작은 Add-on</div>
        {ADDONS.map((addon) => (
          <div key={addon.id} className="addon-card">
            <div className="addon-emoji">{addon.emoji}</div>
            <div>
              <div className="addon-title">{addon.title}</div>
              <div className="addon-desc">{addon.desc}</div>
            </div>
            <button className="btn-small" onClick={() => onBuyAddon(addon)}>{formatPrice(addon.price)}</button>
          </div>
        ))}

        <div className="section-label">Postman</div>
        <div className="card">
          <div className="badge rose">핵심 차별점</div>
          <div className="plan-title" style={{ marginTop: 10 }}>실물 편지 발송</div>
          <div className="screen-subtitle">온라인 편지를 편지지·봉투·하늘 엽서와 함께 실제로 보내는 기능입니다.</div>
          <button className="btn-light" style={{ marginTop: 12 }} onClick={() => onNav("postman")}>Postman 주문 탭으로</button>
        </div>

        <div className="section-label">구매 기록</div>
        {purchases.length === 0 ? <EmptyState icon="🧾" title="구매 기록이 없어요" text="테스트 결제를 누르면 여기에 기록이 쌓입니다." /> : purchases.map((purchase) => (
          <div key={purchase.id} className="mail-card">
            <div className="mail-from">{purchase.title}</div>
            <div className="mail-preview">{formatPrice(purchase.price)} · {purchase.type}</div>
            <div className="mail-time">{new Date(purchase.createdAt).toLocaleString("ko-KR")}</div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

function SettingsScreen({ authUser, profile, subscription, onLogout, onResetOnboarding, onNav }) {
  const [notif, setNotif] = useState(true);
  const [slow, setSlow] = useState(true);
  const [privacy, setPrivacy] = useState(true);

  return (
    <ScreenShell active="settings" onNav={onNav}>
      <div className="screen-header">
        <div className="screen-label">Settings</div>
        <div className="screen-title">내 정보와<br />서비스 설정</div>
        <div className="screen-subtitle">실명은 서비스 내부 본인 확인용으로만 쓰고, 앱 안에서는 닉네임 중심으로 운영합니다.</div>
      </div>
      <div className="scroll-area with-tabbar fade-in">
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, var(--green), #2E4035)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 27 }}>🌿</div>
            <div>
              <div style={{ fontFamily: "var(--font-app)", fontWeight: 700, color: "var(--ink)", fontSize: 18 }}>{profile.nickname}</div>
              <div style={{ color: "var(--ink-muted)", fontSize: 12.5, marginTop: 3 }}>{authUser.isGuest ? "게스트 모드 · 서버 저장 없음" : authUser.email}</div>
              <div style={{ color: "var(--ink-muted)", fontSize: 12.5, marginTop: 2 }}>실명: {authUser.isGuest ? "미등록" : (profile.realName || authUser.realName)}</div>
            </div>
          </div>
        </div>

        <div className="section-label">멤버십</div>
        <div className="card">
          <div className="toggle-row" style={{ paddingTop: 0 }}>
            <div><div className="toggle-text">Slowdy Plus</div><div className="toggle-sub">{subscription.plus ? "활성화됨" : "무료 이용 중"}</div></div>
            <span className="badge">{subscription.plus ? "Plus" : "Free"}</span>
          </div>
          <div className="toggle-row">
            <div><div className="toggle-text">Slowdy Room Pass</div><div className="toggle-sub">{subscription.roomPass ? "활성화됨" : "월 1회 무료 참여"}</div></div>
            <span className="badge brown">{subscription.roomPass ? "Pass" : "Free"}</span>
          </div>
          <button className="btn-light" style={{ marginTop: 14 }} onClick={() => onNav("pay")}>결제 탭으로 이동</button>
        </div>

        <div className="section-label">앱 설정</div>
        <div className="card">
          <ToggleRow title="새 편지 알림" desc="편지가 도착했을 때만 조용히 알려줘요" value={notif} onClick={() => setNotif(!notif)} />
          <ToggleRow title="느린 소통 모드" desc="하루 최대 3통으로 제한해요" value={slow} onClick={() => setSlow(!slow)} />
          <ToggleRow title="실명 비공개" desc="상대에게는 닉네임만 보여줘요" value={privacy} onClick={() => setPrivacy(!privacy)} />
        </div>

        <div className="section-label">관리</div>
        <div className="btn-row">
          <button className="btn-light" onClick={onResetOnboarding}>온보딩 다시하기</button>
          <button className="btn-danger" onClick={onLogout}>로그아웃</button>
        </div>
      </div>
    </ScreenShell>
  );
}

function ToggleRow({ title, desc, value, onClick }) {
  return (
    <div className="toggle-row">
      <div><div className="toggle-text">{title}</div><div className="toggle-sub">{desc}</div></div>
      <div className={`toggle ${value ? "on" : ""}`} onClick={onClick} />
    </div>
  );
}

function SuccessScreen({ title, text, button, onNext }) {
  return (
    <div className="screen">
      <div className="screen-content" style={{ justifyContent: "center" }}>
        <div className="success-screen fade-in">
          <div className="success-icon">📮</div>
          <div className="success-title">{title}</div>
          <div className="success-text">{text}</div>
          <button className="btn-green" onClick={onNext}>{button}</button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-text">{text}</div>
    </div>
  );
}

function ScreenShell({ active, onNav, children }) {
  return (
    <div className="screen tabbed-screen">
      <div className="tabbed-scroll">{children}</div>
      <TabBar active={active} onNav={onNav} />
    </div>
  );
}

function TabBar({ active, onNav }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "홈" },
    { id: "mailbox", icon: "✉️", label: "편지함" },
    { id: "today", icon: "✦", label: "오늘" },
    { id: "rooms", icon: "🏡", label: "룸" },
    { id: "pay", icon: "💳", label: "결제" },
    { id: "settings", icon: "⚙️", label: "설정" },
  ];

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button key={tab.id} className={`tab-item ${active === tab.id ? "active" : ""}`} onClick={() => onNav(tab.id)}>
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [authUser, setAuthUser] = useState(() => readStorage("slowdy_auth_user", null));
  const [profile, setProfile] = useState(() => normalizeProfile(readStorage("slowdy_profile", defaultProfile)));
  const [onboardingStep, setOnboardingStep] = useState(() => normalizeProfile(readStorage("slowdy_profile", defaultProfile)).completed ? 0 : 1);
  const [screen, setScreen] = useState("home");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [sentIds, setSentIds] = useState(() => readStorage("slowdy_sent_ids", []));
  const [pendingPostman, setPendingPostman] = useState(null);
  const [roomUses, setRoomUses] = useState(() => readStorage("slowdy_room_uses", 0));
  const [subscription, setSubscription] = useState(() => readStorage("slowdy_subscription", { plus: false, roomPass: false }));
  const [purchases, setPurchases] = useState(() => readStorage("slowdy_purchases", []));
  const [letters, setLetters] = useState(() => readStorage("slowdy_letters", [
    {
      id: "letter-welcome",
      from: "Slowdy 팀",
      preview: "Slowdy에 온 걸 환영해요. 이곳은 빠른 답장을 강요하지 않아요.",
      full: "안녕하세요.\n\nSlowdy에 온 걸 환영해요.\n\n이곳은 빠른 답장을 강요하지 않고, 더 많은 사람을 넘기는 데 집중하지 않습니다. 오늘의 하늘과 관심사, 그리고 공동 질문에 적은 답변을 통해 천천히 이어지는 공간이에요.\n\n첫 편지는 오늘의 카드에서 시작해보세요.",
      time: "방금 전",
      read: false,
    },
  ]));
  const [sentLetters, setSentLetters] = useState(() => readStorage("slowdy_sent_letters", []));

  const hydratedProfile = useMemo(() => {
    if (!authUser) return profile;
    return {
      ...profile,
      realName: profile.realName || authUser.realName || "",
      nickname: profile.nickname || authUser.nickname || "",
    };
  }, [profile, authUser]);

  useEffect(() => saveStorage("slowdy_auth_user", authUser), [authUser]);
  useEffect(() => saveStorage("slowdy_profile", profile), [profile]);
  useEffect(() => saveStorage("slowdy_letters", letters), [letters]);
  useEffect(() => saveStorage("slowdy_sent_letters", sentLetters), [sentLetters]);
  useEffect(() => saveStorage("slowdy_sent_ids", sentIds), [sentIds]);
  useEffect(() => saveStorage("slowdy_subscription", subscription), [subscription]);
  useEffect(() => saveStorage("slowdy_purchases", purchases), [purchases]);
  useEffect(() => saveStorage("slowdy_room_uses", roomUses), [roomUses]);


  // 서버 연결 후: Supabase의 letters_public / sent_letters를 편지함 탭에 반영
  useEffect(() => {
    if (!authUser || !SERVER_ENABLED) return;

    let cancelled = false;
    const clientId = getClientId();

    async function loadServerMailbox() {
      const inboxResult = await supabaseRest("letters_public?select=*&order=created_at.desc");
      const sentResult = await supabaseRest(`sent_letters?select=*&sender_client_id=eq.${encodeURIComponent(clientId)}&order=created_at.desc`);

      if (!cancelled && !inboxResult.error && Array.isArray(inboxResult.data)) {
        setLetters(inboxResult.data.map(mapInboxRow));
      }
      if (!cancelled && !sentResult.error && Array.isArray(sentResult.data)) {
        setSentLetters(sentResult.data.map(mapSentRow));
      }
    }

    loadServerMailbox();
    const timer = setInterval(loadServerMailbox, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [authUser]);

  const addPurchase = (purchase) => {
    const item = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...purchase };
    setPurchases((prev) => [item, ...prev]);
    return item;
  };

  const handleAuth = (user) => {
    setAuthUser(user);
    setProfile((prev) => ({ ...prev, realName: prev.realName || user.realName, nickname: prev.nickname || user.nickname }));
    setOnboardingStep(profile.completed ? 0 : 1);
  };

  const handleGuest = () => {
    const guestNickname = `게스트-${Math.floor(Math.random() * 9000) + 1000}`;
    const guestUser = {
      id: crypto.randomUUID(),
      email: "guest@slowdy.local",
      password: "",
      realName: "",
      nickname: guestNickname,
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    setAuthUser(guestUser);
    setProfile((prev) => ({ ...prev, realName: "", nickname: prev.nickname || guestNickname }));
    setOnboardingStep(profile.completed ? 0 : 1);
  };

  const completeOnboarding = () => {
    setProfile((prev) => ({ ...prev, completed: true, realName: prev.realName || authUser.realName, nickname: prev.nickname || authUser.nickname }));
    setOnboardingStep(0);
    setScreen("home");
  };

  const buyPlan = (plan) => {
    if (plan.id === "plus" && subscription.plus) return;
    if (plan.id === "room-pass" && subscription.roomPass) return;
    addPurchase({ type: "subscription", title: plan.title, price: plan.price });
    setSubscription((prev) => ({ ...prev, plus: plan.id === "plus" ? true : prev.plus, roomPass: plan.id === "room-pass" ? true : prev.roomPass }));
  };

  const buyAddon = (addon) => {
    addPurchase({ type: "addon", title: addon.title, price: addon.price });
  };

  const sendLetter = ({ content, postman }) => {
    if (!selectedCard) return;
    setSentIds((prev) => prev.includes(selectedCard.id) ? prev : [...prev, selectedCard.id]);
    const sentLetter = {
      id: crypto.randomUUID(),
      direction: "sent",
      to: selectedCard.nickname,
      preview: `${content.slice(0, 54)}${content.length > 54 ? "..." : ""}`,
      full: content,
      time: "방금 전",
      postman,
    };
    setSentLetters((prev) => [sentLetter, ...prev]);

    // 서버 연결 후: 보낸 편지/받은 편지 테이블에 저장
    if (SERVER_ENABLED) {
      const clientId = getClientId();
      const myNickname = hydratedProfile.nickname || authUser.nickname || "익명의 밤손님";
      supabaseRest("sent_letters", {
        method: "POST",
        body: JSON.stringify({
          sender_client_id: clientId,
          from_nickname: myNickname,
          to_nickname: selectedCard.nickname,
          nickname: selectedCard.nickname,
          content,
        }),
      });
      supabaseRest("letters_public", {
        method: "POST",
        body: JSON.stringify({
          nickname: myNickname,
          sender_nickname: myNickname,
          sender_client_id: clientId,
          recipient_nickname: selectedCard.nickname,
          content,
          question_prompt: COMMON_QUESTIONS[0],
          is_read: false,
          delivered_at: new Date().toISOString(),
        }),
      });
    }
    const autoReply = {
      id: crypto.randomUUID(),
      from: selectedCard.nickname,
      preview: "편지를 잘 받았어요. 천천히 답장을 적어봤어요...",
      full: `안녕하세요.\n\n보내주신 편지를 천천히 읽었어요.\n\n\"${content.slice(0, 80)}${content.length > 80 ? "..." : ""}\"\n\n그 문장이 오래 남아서 저도 답장을 쓰고 싶어졌습니다. Slowdy에서는 빠르게 대답하지 않아도 괜찮다는 점이 좋네요.`,
      time: "내일 도착 예정",
      read: false,
    };
    setLetters((prev) => [autoReply, ...prev]);
    if (postman) {
      setPendingPostman({ recipient: selectedCard.nickname, content });
      setScreen("success-postman");
    } else {
      setScreen("success-letter");
    }
  };

  const readLetter = (letter) => {
    setLetters((prev) => prev.map((item) => item.id === letter.id ? { ...item, read: true } : item));
    if (SERVER_ENABLED && letter.serverRow) {
      supabaseRest(`letters_public?id=eq.${encodeURIComponent(letter.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: true }),
      });
    }
    setSelectedLetter({ ...letter, read: true, direction: "inbox" });
    setScreen("read-letter");
  };

  const readSentLetter = (letter) => {
    setSelectedLetter({ ...letter, direction: "sent" });
    setScreen("read-letter");
  };

  const joinRoom = (room, actuallyJoin) => {
    if (!actuallyJoin) return;
    if (!subscription.plus && !subscription.roomPass && roomUses >= 1) {
      setScreen("pay");
      return;
    }
    if (!subscription.plus && !subscription.roomPass) setRoomUses((prev) => prev + 1);
    const letter = {
      id: crypto.randomUUID(),
      from: `${room.title} 운영자`,
      preview: `${room.title}의 이번 주 질문에 참여했어요.`,
      full: `Slowdy ${room.title}에 오신 걸 환영해요.\n\n이번 주 질문은 다음과 같아요.\n\nQ. ${room.question}\n\n이 방에서는 빠른 채팅보다 짧은 글, 목소리 답변, 편지 답장을 중심으로 천천히 소통합니다.`,
      time: "방금 전",
      read: false,
    };
    setLetters((prev) => [letter, ...prev]);
    setScreen("mailbox");
  };

  const orderPostman = (purchase) => {
    addPurchase({ ...purchase, price: purchase.price });
    setPendingPostman(null);
    setScreen("success-order");
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem("slowdy_auth_user");
  };

  const resetOnboarding = () => {
    setProfile((prev) => ({ ...prev, completed: false }));
    setOnboardingStep(1);
  };

  const nav = (id) => {
    setSelectedCard(null);
    setScreen(id);
  };

  const render = () => {
    if (!authUser) return <AuthScreen onAuth={handleAuth} onGuest={handleGuest} />;

    if (onboardingStep > 0) {
      const p = hydratedProfile;
      if (onboardingStep === 1) return <SkyStep profile={p} setProfile={setProfile} onNext={() => setOnboardingStep(2)} />;
      if (onboardingStep === 2) return <ProfileStep authUser={authUser} profile={p} setProfile={setProfile} onNext={() => setOnboardingStep(3)} />;
      if (onboardingStep === 3) return <InterestStep profile={p} setProfile={setProfile} onNext={() => setOnboardingStep(4)} />;
      if (onboardingStep === 4) return <ReasonStep profile={p} setProfile={setProfile} onNext={() => setOnboardingStep(5)} />;
      if (onboardingStep === 5) return <QuestionStep profile={p} setProfile={setProfile} onNext={() => setOnboardingStep(6)} />;
      return <VoiceStep profile={p} setProfile={setProfile} onNext={completeOnboarding} />;
    }

    if (screen === "card-detail" && selectedCard) {
      return <CardDetailScreen card={selectedCard} subscription={subscription} sent={sentIds.includes(selectedCard.id)} onBack={() => setScreen("today")} onWrite={() => setScreen("write-letter")} onPay={() => setScreen("pay")} />;
    }
    if (screen === "write-letter" && selectedCard) {
      return <WriteLetterScreen recipient={selectedCard} subscription={subscription} onBack={() => setScreen("card-detail")} onSend={sendLetter} />;
    }
    if (screen === "read-letter" && selectedLetter) {
      return <ReadLetterScreen letter={selectedLetter} onBack={() => setScreen("mailbox")} onReply={() => { setSelectedCard({ id: `reply-${selectedLetter.id}`, nickname: selectedLetter.from, sky: SKY_OPTIONS[4], interests: [], age: "", region: "", interestReason: "", questionAnswer: "" }); setScreen("write-letter"); }} />;
    }
    if (screen === "success-letter") {
      return <SuccessScreen title="편지가 떠났어요" text="하루 정도의 느린 도착감을 두고 상대에게 전달됩니다. 빠르지 않아도 괜찮아요." button="편지함으로" onNext={() => setScreen("mailbox")} />;
    }
    if (screen === "success-postman") {
      return <SuccessScreen title="편지가 떠났어요" text="이 편지는 Postman 주문으로도 이어갈 수 있어요. 온라인 문장을 실제 편지로 남겨보세요." button="Postman 주문하기" onNext={() => setScreen("postman")} />;
    }
    if (screen === "success-order") {
      return <SuccessScreen title="주문이 저장됐어요" text="현재는 목업 주문입니다. 서버 연결 단계에서 결제 승인, 배송 상태, 주소 암호화 테이블을 연결하면 됩니다." button="결제 탭으로" onNext={() => setScreen("pay")} />;
    }

    switch (screen) {
      case "mailbox":
        return <MailboxScreen letters={letters} sentLetters={sentLetters} onRead={readLetter} onReadSent={readSentLetter} onNav={nav} />;
      case "today":
        return <TodayScreen profile={hydratedProfile} subscription={subscription} sentIds={sentIds} onSelectCard={(card) => { setSelectedCard(card); setScreen("card-detail"); }} onNav={nav} />;
      case "rooms":
        return <RoomScreen subscription={subscription} roomUses={roomUses} onJoin={joinRoom} onNav={nav} />;
      case "postman":
        return <PostmanScreen pendingPostman={pendingPostman} onPurchase={orderPostman} onNav={nav} />;
      case "pay":
        return <PaymentScreen subscription={subscription} purchases={purchases} onBuyPlan={buyPlan} onBuyAddon={buyAddon} onNav={nav} />;
      case "settings":
        return <SettingsScreen authUser={authUser} profile={hydratedProfile} subscription={subscription} onLogout={logout} onResetOnboarding={resetOnboarding} onNav={nav} />;
      case "home":
      default:
        return <HomeScreen profile={hydratedProfile} subscription={subscription} letters={letters} purchases={purchases} onNav={nav} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-stage">
        <div className="device-label">Slowdy · Expanded MVP v3</div>
        <div className="app-shell">{render()}</div>
        <div className="device-footnote" style={{ color: "rgba(245,240,232,.22)", fontSize: 11, letterSpacing: 1, textAlign: "center", lineHeight: 1.8 }}>
          390 × 844 · Auth + Plus + Room + Postman + Payment
        </div>
      </div>
    </>
  );
}
