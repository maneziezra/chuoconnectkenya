-- ============================================================================
-- Chuo Connect Kenya — Phase 2: student lead capture + university partner CRM
-- ============================================================================
-- HOW TO RUN: Supabase Dashboard > SQL Editor > paste this whole file > Run.
-- Idempotent: safe to re-run. Nothing here drops data.
--
-- WHY THIS EXISTS: neither `university_leads` nor `university_admins` existed in
-- the live project when this was written (PostgREST returned PGRST205), so lead
-- capture and the partner portal's real login could not work.
--
-- PRIVACY MODEL (these rows contain students' phone numbers):
--   * Anyone (anon or signed-in) may INSERT a lead, but only the whitelisted
--     columns below, and only with consent = true. They can never read leads back.
--   * Only a signed-in user linked to a university in `university_admins` may
--     SELECT that university's leads, and may UPDATE only the `status` column.
--   * The anon key is public, so protection lives here in RLS, not in the UI.
--
-- NOTE: no foreign key on "universityId" on purpose. The app mixes Supabase rows
-- with bundled static university data, so a lead for a university that is not
-- yet in the `universities` table must still be accepted.
-- ============================================================================

-- 1. Who may see which university's leads ------------------------------------
create table if not exists public.university_admins (
  user_id        uuid not null references auth.users(id) on delete cascade,
  "universityId" text not null check (char_length("universityId") between 1 and 64),
  created_at     timestamptz not null default now(),
  primary key (user_id, "universityId")
);

alter table public.university_admins enable row level security;

drop policy if exists "Admins can read own university links" on public.university_admins;
create policy "Admins can read own university links"
  on public.university_admins for select to authenticated
  using (user_id = auth.uid());

-- Link a partner account to a university (run manually, as the platform owner):
--   insert into public.university_admins (user_id, "universityId")
--   values ('<auth.users id of the partner>', 'uon');

-- 2. Leads --------------------------------------------------------------------
create table if not exists public.university_leads (
  id                   uuid primary key default gen_random_uuid(),
  "universityId"       text not null check (char_length("universityId") between 1 and 64),
  student_name         text not null check (char_length(student_name) between 2 and 80),
  -- Normalised by the API to E.164 for Kenyan mobiles: +2547XXXXXXXX / +2541XXXXXXXX
  phone                text not null check (phone ~ '^\+254[17][0-9]{8}$'),
  email                text check (email is null or char_length(email) <= 254),
  -- Self-reported by the student via the calculator; not verified by KNEC/KUCCPS.
  cluster_points       numeric(5,2) check (cluster_points is null or (cluster_points >= 0 and cluster_points <= 48)),
  mean_grade           text check (mean_grade is null or mean_grade in
                         ('A','A-','B+','B','B-','C+','C','C-','D+','D','D-','E')),
  target_course        text check (target_course is null or char_length(target_course) <= 160),
  financing_preference text not null default 'undecided'
                         check (financing_preference in ('hef_loan','self_sponsored','scholarship','undecided')),
  hef_band             smallint check (hef_band is null or hef_band between 1 and 5),
  source               text not null default 'university_page'
                         check (source in ('university_page','course_page','calculator')),
  consent              boolean not null check (consent = true),
  status               text not null default 'New'
                         check (status in ('New','Contacted','Applied','Enrolled','Not interested')),
  "createdAt"          timestamptz not null default now()
);

create index if not exists university_leads_uni_created_idx
  on public.university_leads ("universityId", "createdAt" desc);

-- 3. Row Level Security -------------------------------------------------------
alter table public.university_leads enable row level security;

drop policy if exists "Anyone can submit a lead" on public.university_leads;
create policy "Anyone can submit a lead"
  on public.university_leads for insert to anon, authenticated
  with check (consent = true and status = 'New');

drop policy if exists "Partners read own university leads" on public.university_leads;
create policy "Partners read own university leads"
  on public.university_leads for select to authenticated
  using (exists (
    select 1 from public.university_admins a
    where a.user_id = auth.uid() and a."universityId" = university_leads."universityId"
  ));

drop policy if exists "Partners update own university leads" on public.university_leads;
create policy "Partners update own university leads"
  on public.university_leads for update to authenticated
  using (exists (
    select 1 from public.university_admins a
    where a.user_id = auth.uid() and a."universityId" = university_leads."universityId"
  ))
  with check (exists (
    select 1 from public.university_admins a
    where a.user_id = auth.uid() and a."universityId" = university_leads."universityId"
  ));

-- 4. Column-level privileges (defence in depth on top of RLS) -----------------
revoke all on public.university_leads from anon, authenticated;

-- Submitters may set only these columns (not id, status or createdAt).
grant insert ("universityId", student_name, phone, email, cluster_points, mean_grade,
              target_course, financing_preference, hef_band, source, consent)
  on public.university_leads to anon, authenticated;

-- Partners (RLS-filtered to their own university) may read, and may change status only.
grant select on public.university_leads to authenticated;
grant update (status) on public.university_leads to authenticated;

-- 5. AUDIT: if the table pre-existed with looser policies, they are OR-ed with the
-- ones above. List every policy on it and delete any permissive ones:
--   select policyname, cmd, roles, qual from pg_policies
--   where schemaname = 'public' and tablename = 'university_leads';
