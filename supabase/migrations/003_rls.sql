-- Activer RLS sur toutes les tables
alter table public.users           enable row level security;
alter table public.trips           enable row level security;
alter table public.stages          enable row level security;
alter table public.journal_entries enable row level security;
alter table public.photos          enable row level security;
alter table public.expenses        enable row level security;

-- users
create policy "users: lecture propre profil"
  on public.users for select using (auth.uid() = id);

create policy "users: modification propre profil"
  on public.users for update using (auth.uid() = id);

-- trips
create policy "trips: lecture"
  on public.trips for select using (auth.uid() = user_id or is_public = true);

create policy "trips: création"
  on public.trips for insert with check (auth.uid() = user_id);

create policy "trips: modification"
  on public.trips for update using (auth.uid() = user_id);

create policy "trips: suppression"
  on public.trips for delete using (auth.uid() = user_id);

-- Helper: est-ce que l'utilisateur possède le trip associé à un stage ?
create or replace function owns_trip_of_stage(stage_uuid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.stages s
    join public.trips t on t.id = s.trip_id
    where s.id = stage_uuid and t.user_id = auth.uid()
  );
$$;

-- stages
create policy "stages: lecture"
  on public.stages for select
  using (
    owns_trip_of_stage(id) or
    exists (select 1 from public.trips t where t.id = trip_id and t.is_public = true)
  );

create policy "stages: création"
  on public.stages for insert
  with check (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()));

create policy "stages: modification"
  on public.stages for update using (owns_trip_of_stage(id));

create policy "stages: suppression"
  on public.stages for delete using (owns_trip_of_stage(id));

-- Helper: est-ce que l'utilisateur possède le trip associé à une entrée de journal ?
create or replace function owns_trip_of_entry(entry_uuid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.journal_entries je
    join public.stages s on s.id = je.stage_id
    join public.trips t  on t.id = s.trip_id
    where je.id = entry_uuid and t.user_id = auth.uid()
  );
$$;

-- journal_entries
create policy "journal_entries: lecture"
  on public.journal_entries for select using (owns_trip_of_entry(id));

create policy "journal_entries: création"
  on public.journal_entries for insert
  with check (
    exists (
      select 1 from public.stages s
      join public.trips t on t.id = s.trip_id
      where s.id = stage_id and t.user_id = auth.uid()
    )
  );

create policy "journal_entries: modification"
  on public.journal_entries for update using (owns_trip_of_entry(id));

create policy "journal_entries: suppression"
  on public.journal_entries for delete using (owns_trip_of_entry(id));

-- expenses
create policy "expenses: lecture"
  on public.expenses for select
  using (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()));

create policy "expenses: création"
  on public.expenses for insert
  with check (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()));

create policy "expenses: modification"
  on public.expenses for update
  using (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()));

create policy "expenses: suppression"
  on public.expenses for delete
  using (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()));
