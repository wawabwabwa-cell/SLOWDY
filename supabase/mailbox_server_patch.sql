-- Slowdy mailbox server patch
-- Supabase SQL Editor에서 실행하세요.
-- 목적: 받은 편지 / 보낸 편지 / 읽지 않음 탭을 서버 DB와 연결하기 위한 최소 테이블 구조입니다.

create extension if not exists "pgcrypto";

create table if not exists public.letters_public (
  id uuid primary key default gen_random_uuid(),
  nickname text not null default '익명의 밤손님',
  sender_nickname text,
  recipient_nickname text,
  content text not null,
  question_prompt text,
  is_read boolean not null default false,
  delivered_at timestamptz default now(),
  created_at timestamptz default now(),
  sender_id text,
  sender_client_id text,
  recipient_client_id text
);

create table if not exists public.sent_letters (
  id uuid primary key default gen_random_uuid(),
  sender_client_id text,
  from_nickname text,
  to_nickname text,
  nickname text,
  content text not null,
  created_at timestamptz default now()
);

-- 이미 테이블이 있는 경우 부족한 컬럼만 추가
alter table public.letters_public add column if not exists sender_nickname text;
alter table public.letters_public add column if not exists recipient_nickname text;
alter table public.letters_public add column if not exists recipient_client_id text;
alter table public.sent_letters add column if not exists sender_client_id text;
alter table public.sent_letters add column if not exists from_nickname text;
alter table public.sent_letters add column if not exists to_nickname text;
alter table public.sent_letters add column if not exists nickname text;
alter table public.sent_letters add column if not exists content text;
alter table public.sent_letters add column if not exists created_at timestamptz default now();

alter table public.letters_public enable row level security;
alter table public.sent_letters enable row level security;

-- 베타 테스트용 공개 정책입니다.
-- 실제 서비스에서는 recipient_client_id 또는 auth.uid() 기준으로 본인 편지만 보이게 좁혀야 합니다.
drop policy if exists "beta letters select" on public.letters_public;
drop policy if exists "beta letters insert" on public.letters_public;
drop policy if exists "beta letters update read" on public.letters_public;
drop policy if exists "beta sent select" on public.sent_letters;
drop policy if exists "beta sent insert" on public.sent_letters;

create policy "beta letters select" on public.letters_public
  for select to anon, authenticated using (true);

create policy "beta letters insert" on public.letters_public
  for insert to anon, authenticated with check (true);

create policy "beta letters update read" on public.letters_public
  for update to anon, authenticated using (true) with check (true);

create policy "beta sent select" on public.sent_letters
  for select to anon, authenticated using (true);

create policy "beta sent insert" on public.sent_letters
  for insert to anon, authenticated with check (true);
