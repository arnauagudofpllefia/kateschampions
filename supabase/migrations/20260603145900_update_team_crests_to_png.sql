update public.teams
set crest = case id
	when 'rm' then '/escudos/rm.png'
	when 'mci' then '/escudos/mci.png'
	when 'psg' then '/escudos/psg.png'
	when 'fcb' then '/escudos/fcb.png'
	when 'bay' then '/escudos/bay.png'
	when 'int' then '/escudos/int.png'
	when 'liv' then '/escudos/liv.png'
	when 'atm' then '/escudos/atm.png'
	else crest
end
where id in ('rm', 'mci', 'psg', 'fcb', 'bay', 'int', 'liv', 'atm');
