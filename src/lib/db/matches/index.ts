import { leerEquipoPorId } from "@/lib/db/teams";
import type { Match } from "@/lib/db/types";
import { leerDB } from "../file";

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
  const db = await leerDB();
  const enriched = await Promise.all(db.matches.map((match) => enriquecerPartido(match)));

  return enriched.sort((a, b) => {
    const dateA = `${a.day}T${a.time}`;
    const dateB = `${b.day}T${b.time}`;
    return dateA.localeCompare(dateB);
  });
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
