alter table public.users
drop constraint if exists users_role_check;

alter table public.users
add constraint users_role_check
check (role in ('user', 'editor', 'admin'));

insert into public.users (id, name, email, password_hash, role, created_at)
values
	(
		'9a2b1f30-4fe5-48d1-a6f6-0f2f3257e101',
		'Editor Demo',
		'editor@champions.local',
		extensions.crypt('editor123', extensions.gen_salt('bf')),
		'editor',
		now()
	),
	(
		'3cf8f93c-b982-4efc-bcef-41f11f496f2a',
		'Admin Demo',
		'admin@champions.local',
		extensions.crypt('admin123', extensions.gen_salt('bf')),
		'admin',
		now()
	)
on conflict (email) do update set
	name = excluded.name,
	password_hash = excluded.password_hash,
	role = excluded.role;

create table if not exists public.match_comments (
	id uuid primary key default gen_random_uuid(),
	match_id text not null references public.matches(id) on delete cascade,
	user_id uuid not null references public.users(id) on delete cascade,
	content text not null check (char_length(trim(content)) between 2 and 500),
	created_at timestamptz not null default now()
);

alter table public.match_comments enable row level security;

grant select on table public.match_comments to anon;
grant select, insert, update, delete on table public.match_comments to authenticated;
grant insert on table public.match_comments to anon;

create policy "match_comments_select_public"
	on public.match_comments
	for select
	to anon, authenticated
	using (true);

create policy "match_comments_insert_public"
	on public.match_comments
	for insert
	to anon, authenticated
	with check (true);
