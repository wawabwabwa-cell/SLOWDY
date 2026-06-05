-- Slowdy v3 Supabase schema draft
-- 실제 서버 연결 단계에서 Supabase SQL Editor에 넣고, RLS 정책을 팀 요구사항에 맞게 조정하세요.

create extension if not exists "pgcrypto";

-- 공개 프로필: 상대에게 보여도 되는 정보만 저장
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  nickname text not null,
  age_group text,
  region text,
  sky_id text,
  sky_label text,
  interest_reason text,
  question_answer text,
  voice_intro_url text,
  is_onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 민감/내부용 사용자 정보: 실명은 절대 매칭 카드에 노출하지 않음
create table if not exists public.user_private_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  real_name text not null,
  birth_year int,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.profile_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  interest_id text not null,
  created_at timestamptz default now(),
  unique(user_id, interest_id)
);

create table if not exists public.sky_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  sky_id text not null,
  sky_label text not null,
  note text,
  logged_at date default current_date,
  created_at timestamptz default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete set null,
  receiver_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  status text default 'scheduled' check (status in ('draft', 'scheduled', 'delivered', 'read')),
  deliver_at timestamptz default (now() + interval '1 day'),
  read_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan_id text not null check (plan_id in ('plus', 'room-pass')),
  status text default 'active' check (status in ('active', 'cancelled', 'expired')),
  started_at timestamptz default now(),
  expires_at timestamptz
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null check (type in ('subscription', 'addon', 'postman')),
  title text not null,
  amount_krw int not null,
  payment_provider text,
  payment_key text,
  status text default 'paid' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz default now()
);

create table if not exists public.rooms (
  id text primary key,
  title text not null,
  emoji text,
  weekly_question text not null,
  created_at timestamptz default now()
);

create table if not exists public.room_posts (
  id uuid primary key default gen_random_uuid(),
  room_id text references public.rooms(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  voice_url text,
  created_at timestamptz default now()
);

create table if not exists public.postman_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  letter_id uuid references public.letters(id) on delete set null,
  options jsonb not null default '[]'::jsonb,
  receive_method text not null,
  encrypted_address text,
  amount_krw int not null,
  status text default 'ordered' check (status in ('ordered', 'printing', 'shipping', 'delivered', 'cancelled')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_private_profiles enable row level security;
alter table public.profile_interests enable row level security;
alter table public.sky_logs enable row level security;
alter table public.letters enable row level security;
alter table public.subscriptions enable row level security;
alter table public.purchases enable row level security;
alter table public.room_posts enable row level security;
alter table public.postman_orders enable row level security;

-- 기본 RLS 예시: 본인 데이터만 직접 수정/조회
create policy "profiles_select_all_safe" on public.profiles for select using (true);
create policy "profiles_upsert_own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "private_profile_own_only" on public.user_private_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "interests_own_write" on public.profile_interests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sky_logs_own_only" on public.sky_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "letters_sender_or_receiver" on public.letters for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "letters_sender_insert" on public.letters for insert with check (auth.uid() = sender_id);
create policy "letters_receiver_update_read" on public.letters for update using (auth.uid() = receiver_id or auth.uid() = sender_id);

create policy "subscriptions_own_only" on public.subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "purchases_own_only" on public.purchases for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "room_posts_select_all" on public.room_posts for select using (true);
create policy "room_posts_own_insert" on public.room_posts for insert with check (auth.uid() = user_id);
create policy "postman_orders_own_only" on public.postman_orders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.rooms (id, title, emoji, weekly_question) values
  ('book-room', '책방', '📚', '한 문장 때문에 오래 남은 책이 있나요?'),
  ('film-room', '영화방', '🎬', '엔딩 크레딧이 올라갈 때 어떤 생각을 하나요?'),
  ('walk-room', '산책방', '🌿', '요즘 가장 자주 걷는 길은 어디인가요?'),
  ('music-room', '음악방', '🎵', '말보다 먼저 떠오르는 노래가 있나요?'),
  ('writing-room', '글쓰기방', '✍️', '최근에 쓰지 못하고 삼킨 말이 있나요?')
on conflict (id) do nothing;
