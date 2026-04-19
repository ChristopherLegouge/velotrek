-- Profils utilisateur (étend auth.users de Supabase)
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  bike_type   text check (bike_type in ('road','mountain','gravel','touring','ebike')),
  level       text check (level in ('beginner','intermediate','expert')),
  preferences jsonb default '{}'::jsonb,
  created_at  timestamptz default now()
);

-- Voyages
create table public.trips (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'draft' check (status in ('draft','active','completed')),
  is_public   boolean not null default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Étapes d'un voyage
create table public.stages (
  id          uuid primary key default uuid_generate_v4(),
  trip_id     uuid not null references public.trips(id) on delete cascade,
  "order"     integer not null,
  title       text not null,
  distance_km numeric(8,2),
  elevation_m integer,
  gpx_data    text,
  location    geometry(Point, 4326),
  created_at  timestamptz default now()
);

-- Entrées de journal de voyage
create table public.journal_entries (
  id           uuid primary key default uuid_generate_v4(),
  stage_id     uuid not null references public.stages(id) on delete cascade,
  content_rich text,
  difficulty   integer check (difficulty between 1 and 5),
  weather      jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Photos
create table public.photos (
  id           uuid primary key default uuid_generate_v4(),
  entry_id     uuid not null references public.journal_entries(id) on delete cascade,
  storage_path text not null,
  caption      text,
  taken_at     timestamptz,
  created_at   timestamptz default now()
);

-- Dépenses
create table public.expenses (
  id          uuid primary key default uuid_generate_v4(),
  trip_id     uuid not null references public.trips(id) on delete cascade,
  category    text not null check (category in ('accommodation','food','transport','equipment','other')),
  amount      numeric(10,2) not null,
  currency    text not null default 'EUR',
  description text,
  date        date not null,
  created_at  timestamptz default now()
);

-- Index géospatial
create index stages_location_idx on public.stages using gist(location);

-- Trigger updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_updated_at
  before update on public.trips
  for each row execute function update_updated_at();

create trigger journal_updated_at
  before update on public.journal_entries
  for each row execute function update_updated_at();

-- Créer le profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
