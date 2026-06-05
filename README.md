# Slowdy v3 Guest Complete

Slowdy 확장형 MVP입니다.

포함 기능:
- 이메일/비밀번호/실명/닉네임 회원가입 목업
- 로그인 목업
- 게스트로 시작하기
- 오늘의 하늘 기록
- 관심사/공동질문 온보딩
- 매칭 카드
- 편지함/답장
- Slowdy Plus 결제 탭 목업
- Slowdy Room
- Slowdy Postman
- Add-on 상품
- Supabase 연결용 schema.sql 초안

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 터미널에 표시되는 주소를 열면 됩니다.
보통 `http://localhost:5173` 입니다.

## 주의

현재 버전은 프론트엔드 목업입니다. 결제 버튼은 실제 결제가 아니라 앱 내부 상태만 변경합니다.
서버 연결 단계에서 Supabase Auth, DB, 실제 PG 결제 검증을 붙이면 됩니다.


## 2026-06-05 UI 수정
- 첫 화면을 로그인 / 회원가입 / 게스트로 시작하기 3개 블록 메뉴로 분리
- 회원가입 완료 후 바로 앱 진입하지 않고 로그인 화면으로 이동
- 첫 화면 메뉴 블록 위치를 조금 아래로 조정
- 중앙 문구와 메뉴 카드 폰트 크기 및 간격 확대


## Supabase 서버 연결

이 버전은 `.env` 또는 Vercel 환경변수에 아래 값이 있으면 Supabase REST API로 편지함을 불러옵니다.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Supabase SQL Editor에서 `supabase/mailbox_server_patch.sql`을 먼저 실행하세요.

서버 연결 후 편지함 구조:

- 받은 편지: `letters_public` 전체 목록
- 읽지 않음: `letters_public` 중 `is_read = false`
- 보낸 편지: `sent_letters` 중 현재 브라우저의 `sender_client_id`와 일치하는 항목

현재는 팀 베타 테스트용 정책이라 공개 조회/삽입을 허용합니다. 실제 서비스 전에는 `auth.uid()` 또는 `recipient_client_id` 기준 RLS로 좁혀야 합니다.
