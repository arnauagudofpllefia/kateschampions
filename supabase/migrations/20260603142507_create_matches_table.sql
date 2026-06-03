create table if not exists public.matches (
	id text primary key,
	matchday integer not null,
	day date not null,
	time text not null,
	home_team_id text not null references public.teams(id) on delete cascade,
	away_team_id text not null references public.teams(id) on delete cascade,
	home_score integer,
	away_score integer,
	status text not null check (status in ('played', 'upcoming'))
);

alter table public.matches enable row level security;

grant select on table public.matches to anon;
grant select on table public.matches to authenticated;

create policy "matches_select_public"
	on public.matches
	for select
	to anon, authenticated
	using (true);

insert into public.matches (
	id,
	matchday,
	day,
	time,
	home_team_id,
	away_team_id,
	home_score,
	away_score,
	status
) values
	('m1', 1, '2026-05-14', '21:00', 'rm', 'mci', 2, 2, 'played'),
	('m2', 1, '2026-05-14', '18:45', 'psg', 'fcb', 1, 2, 'played'),
	('m3', 1, '2026-05-14', '21:00', 'bay', 'int', 3, 1, 'played'),
	('m4', 1, '2026-05-15', '21:00', 'liv', 'atm', 1, 0, 'played'),
	('m5', 2, '2026-05-20', '18:45', 'mci', 'psg', null, null, 'upcoming'),
	('m6', 2, '2026-05-20', '21:00', 'fcb', 'bay', null, null, 'upcoming'),
	('m7', 2, '2026-05-21', '21:00', 'int', 'liv', null, null, 'upcoming'),
	('m8', 2, '2026-05-21', '18:45', 'atm', 'rm', null, null, 'upcoming')
on conflict (id) do update set
	matchday = excluded.matchday,
	day = excluded.day,
	time = excluded.time,
	home_team_id = excluded.home_team_id,
	away_team_id = excluded.away_team_id,
	home_score = excluded.home_score,
	away_score = excluded.away_score,
	status = excluded.status;
