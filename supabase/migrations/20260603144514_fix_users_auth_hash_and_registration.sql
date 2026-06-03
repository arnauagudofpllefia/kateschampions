update public.users
set password_hash = extensions.crypt('demo123', extensions.gen_salt('bf'))
where email = 'demo@champions.local';

create or replace function public.create_user(
	p_name text,
	p_email text,
	p_password text
)
returns setof public.users
language plpgsql
security definer
set search_path = public
as $$
declare
	inserted_user public.users;
begin
	insert into public.users (
		id,
		name,
		email,
		password_hash,
		role,
		created_at
	) values (
		gen_random_uuid(),
		p_name,
		lower(p_email),
		extensions.crypt(p_password, extensions.gen_salt('bf')),
		'user',
		now()
	)
	returning * into inserted_user;

	return next inserted_user;
end;
$$;

grant execute on function public.create_user(text, text, text) to anon;
grant execute on function public.create_user(text, text, text) to authenticated;
