import { createClient } from "@/lib/supabase/server";
import { leerEquipoPorId } from "@/lib/db/teams";
import type { Match } from "@/lib/db/types";

type MatchRow = {
  id: string;
  matchday: number;
  day: string;
  time: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
  status: "played" | "upcoming";
};

function mapMatchRow(row: MatchRow): Match {
  return {
    id: row.id,
    matchday: row.matchday,
    day: row.day,
    time: row.time,
    homeTeamId: row.home_team_id,
    awayTeamId: row.away_team_id,
    homeScore: row.home_score,
    awayScore: row.away_score,
    status: row.status,
  };
}

export type PartidoEnriquecido = Match & {
  homeTeamName: string;
  homeTeamCrest: string;
  awayTeamName: string;
  awayTeamCrest: string;
};

async function enriquecerPartido(match: Match): Promise<PartidoEnriquecido> {
  const [home, away] = await Promise.all([
    leerEquipoPorId(match.homeTeamId),
    leerEquipoPorId(match.awayTeamId),
  ]);

  return {
    ...match,
    homeTeamName: home?.name ?? match.homeTeamId,
    homeTeamCrest: home?.crest ?? "/escudos/default.svg",
    awayTeamName: away?.name ?? match.awayTeamId,
    awayTeamCrest: away?.crest ?? "/escudos/default.svg",
  };
}

export async function leerPartidos(): Promise<PartidoEnriquecido[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select("id,matchday,day,time,home_team_id,away_team_id,home_score,away_score,status")
    .order("day", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    throw new Error(`leerPartidos: ${error.message}`);
  }

  const matches = (data ?? []).map((row) => mapMatchRow(row as MatchRow));
  const enriched = await Promise.all(matches.map((match) => enriquecerPartido(match)));

  return enriched;
}

export async function leerPartidoPorId(id: string): Promise<PartidoEnriquecido | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select("id,matchday,day,time,home_team_id,away_team_id,home_score,away_score,status")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(`leerPartidoPorId: ${error.message}`);
  }

  const match = mapMatchRow(data as MatchRow);
  return enriquecerPartido(match);
}

export async function leerPartidosPorDia(): Promise<Record<string, PartidoEnriquecido[]>> {
  const matches = await leerPartidos();

  return matches.reduce<Record<string, PartidoEnriquecido[]>>((acc, match) => {
    if (!acc[match.day]) {
      acc[match.day] = [];
    }
    acc[match.day].push(match);
    return acc;
  }, {});
}

export async function leerUltimosResultados(limit = 5): Promise<PartidoEnriquecido[]> {
  const matches = await leerPartidos();
  const played = matches.filter((match) => match.status === "played");

  return played.reverse().slice(0, limit);
}

export async function leerProximosPartidos(limit = 5): Promise<PartidoEnriquecido[]> {
  const matches = await leerPartidos();
  const upcoming = matches.filter((match) => match.status === "upcoming");

  return upcoming.slice(0, limit);
}
