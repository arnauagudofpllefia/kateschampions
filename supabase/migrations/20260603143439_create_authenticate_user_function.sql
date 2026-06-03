create extension if not exists pgcrypto;

create or replace function public.authenticate_user(
	p_email text,
	p_password text
)
returns setof public.users
language sql
security definer
set search_path = public
as $$
	select u.*
	from public.users u
	where lower(u.email) = lower(p_email)
		and extensions.crypt(p_password, u.password_hash) = u.password_hash
	limit 1;
$$;

grant execute on function public.authenticate_user(text, text) to anon;
grant execute on function public.authenticate_user(text, text) to authenticated;
