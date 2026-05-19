import type { Team } from "@/lib/db/types";
import { leerDB } from "../file";

export async function leerEquipos(): Promise<Team[]> {
  const db = await leerDB();
  return [...db.teams].sort((a, b) => b.points - a.points || b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst));
}

export async function leerEquipoPorId(id: string): Promise<Team | null> {
  const db = await leerDB();
  return db.teams.find((team) => team.id === id) ?? null;
}

export async function leerClasificacion(): Promise<Team[]> {
  const teams = await leerEquipos();
  return [...teams].sort((a, b) => {
    const pointDiff = b.points - a.points;
    if (pointDiff !== 0) return pointDiff;

    const goalDiffA = a.goalsFor - a.goalsAgainst;
    const goalDiffB = b.goalsFor - b.goalsAgainst;
    const goalDiffDiff = goalDiffB - goalDiffA;
    if (goalDiffDiff !== 0) return goalDiffDiff;

    return b.goalsFor - a.goalsFor;
  });
}
