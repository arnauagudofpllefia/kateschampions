create table if not exists public.users (
	id uuid primary key,
	name text not null,
	email text not null unique,
	password_hash text not null,
	role text not null default 'user' check (role = 'user'),
	created_at timestamptz not null default now()
);

alter table public.users enable row level security;

grant select, insert, update, delete on table public.users to authenticated;
grant select, insert on table public.users to anon;

create policy "users_select_authenticated"
	on public.users
	for select
	to authenticated
	using (true);

create policy "users_insert_public"
	on public.users
	for insert
	to anon, authenticated
	with check (true);

insert into public.users (
	id,
	name,
	email,
	password_hash,
	role,
	created_at
) values (
	'b9f9d7f2-1111-4a2f-9d9f-9f0d8b1d0001',
	'Demo User',
	'demo@champions.local',
	'$2b$10$JQf1BbT2W6Yq5SzuAB6lweMOI6teLoI0lp4rWuIwoMvVJE9idhraS',
	'user',
	'2026-05-01T00:00:00.000Z'
)
on conflict (email) do update set
	name = excluded.name,
	password_hash = excluded.password_hash,
	role = excluded.role,
	created_at = excluded.created_at;
