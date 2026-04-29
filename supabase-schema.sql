-- FitTrack Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/txxzbhrwkyarfxifbogn/sql

-- ============================================================
-- PROFILES (extended user info)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- WORKOUTS
-- ============================================================
create table if not exists public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  date timestamptz not null,
  duration int not null default 0,
  created_at timestamptz default now()
);

-- EXERCISES per workout
create table if not exists public.workout_exercises (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references public.workouts on delete cascade not null,
  name text not null,
  position int not null default 0
);

-- SETS per exercise
create table if not exists public.workout_sets (
  id uuid default gen_random_uuid() primary key,
  exercise_id uuid references public.workout_exercises on delete cascade not null,
  type text default 'reps' check (type in ('reps', 'duration')),
  reps int not null default 0,
  weight numeric not null default 0,
  duration int not null default 0,
  position int not null default 0
);

-- RLS for workouts
alter table public.workouts enable row level security;
create policy "Users can view own workouts" on public.workouts for select using (auth.uid() = user_id);
create policy "Users can insert own workouts" on public.workouts for insert with check (auth.uid() = user_id);
create policy "Users can delete own workouts" on public.workouts for delete using (auth.uid() = user_id);

-- RLS for workout_exercises
alter table public.workout_exercises enable row level security;
create policy "Users can view own exercises" on public.workout_exercises for select using (
  exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
);
create policy "Users can insert own exercises" on public.workout_exercises for insert with check (
  exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
);
create policy "Users can delete own exercises" on public.workout_exercises for delete using (
  exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
);

-- RLS for workout_sets
alter table public.workout_sets enable row level security;
create policy "Users can view own sets" on public.workout_sets for select using (
  exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = exercise_id and w.user_id = auth.uid()
  )
);
create policy "Users can insert own sets" on public.workout_sets for insert with check (
  exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = exercise_id and w.user_id = auth.uid()
  )
);
create policy "Users can delete own sets" on public.workout_sets for delete using (
  exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = exercise_id and w.user_id = auth.uid()
  )
);

-- ============================================================
-- COMMUNITY PROPOSALS
-- ============================================================
create table if not exists public.proposals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  username text not null,
  name text not null,
  muscle text not null,
  note text,
  youtube_url text,
  file_data_url text,
  file_type text check (file_type in ('image', 'video')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  upvotes int default 0,
  downvotes int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- PROPOSAL VOTES (one per user per proposal)
-- ============================================================
create table if not exists public.proposal_votes (
  id uuid default gen_random_uuid() primary key,
  proposal_id uuid references public.proposals on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  direction text check (direction in ('up', 'down')) not null,
  created_at timestamptz default now(),
  unique(proposal_id, user_id)
);

-- ============================================================
-- REMOVAL REQUESTS
-- ============================================================
create table if not exists public.removal_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  username text not null,
  exercise_slug text not null,
  exercise_name text not null,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  upvotes int default 0,
  downvotes int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- REMOVAL VOTES (one per user per removal request)
-- ============================================================
create table if not exists public.removal_votes (
  id uuid default gen_random_uuid() primary key,
  removal_id uuid references public.removal_requests on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  direction text check (direction in ('up', 'down')) not null,
  created_at timestamptz default now(),
  unique(removal_id, user_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles: anyone can read, only owner can update
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Proposals: anyone can read, authenticated users can insert
alter table public.proposals enable row level security;
create policy "Proposals are viewable by everyone" on public.proposals for select using (true);
create policy "Authenticated users can create proposals" on public.proposals for insert with check (auth.uid() = user_id);
create policy "Users can update own proposals" on public.proposals for update using (auth.uid() = user_id);

-- Proposal votes: anyone can read, authenticated users can vote
alter table public.proposal_votes enable row level security;
create policy "Votes are viewable by everyone" on public.proposal_votes for select using (true);
create policy "Authenticated users can vote" on public.proposal_votes for insert with check (auth.uid() = user_id);
create policy "Users can update own votes" on public.proposal_votes for update using (auth.uid() = user_id);
create policy "Users can delete own votes" on public.proposal_votes for delete using (auth.uid() = user_id);

-- Removal requests: anyone can read, authenticated users can insert
alter table public.removal_requests enable row level security;
create policy "Removal requests viewable by everyone" on public.removal_requests for select using (true);
create policy "Authenticated users can request removal" on public.removal_requests for insert with check (auth.uid() = user_id);

-- Removal votes: anyone can read, authenticated users can vote
alter table public.removal_votes enable row level security;
create policy "Removal votes viewable by everyone" on public.removal_votes for select using (true);
create policy "Authenticated users can vote on removals" on public.removal_votes for insert with check (auth.uid() = user_id);
create policy "Users can update own removal votes" on public.removal_votes for update using (auth.uid() = user_id);
create policy "Users can delete own removal votes" on public.removal_votes for delete using (auth.uid() = user_id);
