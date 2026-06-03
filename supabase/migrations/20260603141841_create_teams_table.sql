create table if not exists public.teams (
	id text primary key,
	name text not null,
	crest text not null,
	country text not null,
	"group" text not null,
	stadium text not null,
	coach text not null,
	played integer not null default 0,
	won integer not null default 0,
	draw integer not null default 0,
	lost integer not null default 0,
	goals_for integer not null default 0,
	goals_against integer not null default 0,
	points integer not null default 0
);

alter table public.teams enable row level security;

grant select on table public.teams to anon;
grant select on table public.teams to authenticated;

create policy "teams_select_public"
	on public.teams
	for select
	to anon, authenticated
	using (true);

insert into public.teams (
	id,
	name,
	crest,
	country,
	"group",
	stadium,
	coach,
	played,
	won,
	draw,
	lost,
	goals_for,
	goals_against,
	points
) values
	('rm', 'Real Madrid', '/escudos/rm.svg', 'Espana', 'A', 'Santiago Bernabeu', 'Carlo Ancelotti', 6, 4, 1, 1, 12, 6, 13),
	('mci', 'Manchester City', '/escudos/mci.svg', 'Inglaterra', 'A', 'Etihad Stadium', 'Pep Guardiola', 6, 4, 2, 0, 14, 5, 14),
	('psg', 'Paris Saint-Germain', '/escudos/psg.svg', 'Francia', 'B', 'Parc des Princes', 'Luis Enrique', 6, 3, 1, 2, 10, 8, 10),
	('fcb', 'FC Barcelona', '/escudos/fcb.svg', 'Espana', 'B', 'Estadi Olimpic Lluis Companys', 'Hansi Flick', 6, 3, 2, 1, 11, 7, 11),
	('bay', 'Bayern Munich', '/escudos/bay.svg', 'Alemania', 'C', 'Allianz Arena', 'Vincent Kompany', 6, 5, 0, 1, 16, 6, 15),
	('int', 'Inter Milan', '/escudos/int.svg', 'Italia', 'C', 'San Siro', 'Simone Inzaghi', 6, 3, 2, 1, 9, 5, 11),
	('liv', 'Liverpool', '/escudos/liv.svg', 'Inglaterra', 'D', 'Anfield', 'Arne Slot', 6, 4, 1, 1, 13, 7, 13),
	('atm', 'Atletico de Madrid', '/escudos/atm.svg', 'Espana', 'D', 'Metropolitano', 'Diego Simeone', 6, 2, 2, 2, 8, 8, 8)
on conflict (id) do update set
	name = excluded.name,
	crest = excluded.crest,
	country = excluded.country,
	"group" = excluded."group",
	stadium = excluded.stadium,
	coach = excluded.coach,
	played = excluded.played,
	won = excluded.won,
	draw = excluded.draw,
	lost = excluded.lost,
	goals_for = excluded.goals_for,
	goals_against = excluded.goals_against,
	points = excluded.points;
