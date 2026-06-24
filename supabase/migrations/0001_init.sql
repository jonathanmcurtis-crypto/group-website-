create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.trip_members (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  title text not null,
  notes text,
  google_place_id text not null,
  address text,
  lat double precision not null,
  lng double precision not null,
  proposed_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.votes (
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  value integer not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (proposal_id, user_id)
);

create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  day date not null,
  starts_at time not null,
  ends_at time,
  notes text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  paid_by uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount_cents integer not null check (amount_cents > 0),
  spent_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.expense_splits (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  unique (expense_id, user_id)
);

create index on public.trip_members(user_id);
create index on public.proposals(trip_id);
create index on public.itinerary_items(trip_id, day, starts_at);
create index on public.expenses(trip_id);
create index on public.expense_splits(user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email) values (new.id, new.email) on conflict (id) do update set email = excluded.email;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_trip_member(target_trip uuid) returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.trip_members tm where tm.trip_id = target_trip and tm.user_id = auth.uid());
$$;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.proposals enable row level security;
alter table public.votes enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_splits enable row level security;

create policy "profiles are visible to authenticated users" on public.profiles for select to authenticated using (true);
create policy "users can update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "members read trips" on public.trips for select to authenticated using (public.is_trip_member(id));
create policy "authenticated users create trips" on public.trips for insert to authenticated with check (created_by = auth.uid());
create policy "owners update trips" on public.trips for update to authenticated using (exists(select 1 from public.trip_members tm where tm.trip_id = id and tm.user_id = auth.uid() and tm.role = 'owner'));

create policy "members read trip members" on public.trip_members for select to authenticated using (public.is_trip_member(trip_id));
create policy "owners add members" on public.trip_members for insert to authenticated with check (exists(select 1 from public.trips t where t.id = trip_id and t.created_by = auth.uid()) or exists(select 1 from public.trip_members tm where tm.trip_id = trip_id and tm.user_id = auth.uid() and tm.role = 'owner'));
create policy "owners remove members" on public.trip_members for delete to authenticated using (exists(select 1 from public.trip_members tm where tm.trip_id = trip_id and tm.user_id = auth.uid() and tm.role = 'owner'));

create policy "members read proposals" on public.proposals for select to authenticated using (public.is_trip_member(trip_id));
create policy "members create proposals" on public.proposals for insert to authenticated with check (public.is_trip_member(trip_id) and proposed_by = auth.uid());
create policy "proposers update proposals" on public.proposals for update to authenticated using (public.is_trip_member(trip_id) and proposed_by = auth.uid());

create policy "members read votes" on public.votes for select to authenticated using (exists(select 1 from public.proposals p where p.id = proposal_id and public.is_trip_member(p.trip_id)));
create policy "members vote" on public.votes for insert to authenticated with check (user_id = auth.uid() and exists(select 1 from public.proposals p where p.id = proposal_id and public.is_trip_member(p.trip_id)));
create policy "members update own vote" on public.votes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "members read itinerary" on public.itinerary_items for select to authenticated using (public.is_trip_member(trip_id));
create policy "members schedule itinerary" on public.itinerary_items for insert to authenticated with check (public.is_trip_member(trip_id) and created_by = auth.uid());
create policy "members update itinerary" on public.itinerary_items for update to authenticated using (public.is_trip_member(trip_id));

create policy "members read expenses" on public.expenses for select to authenticated using (public.is_trip_member(trip_id));
create policy "members create expenses" on public.expenses for insert to authenticated with check (public.is_trip_member(trip_id) and paid_by = auth.uid());
create policy "members read expense splits" on public.expense_splits for select to authenticated using (exists(select 1 from public.expenses e where e.id = expense_id and public.is_trip_member(e.trip_id)));
create policy "members create expense splits" on public.expense_splits for insert to authenticated with check (exists(select 1 from public.expenses e where e.id = expense_id and public.is_trip_member(e.trip_id)));
