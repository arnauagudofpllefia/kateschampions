import { createClient } from "@/lib/supabase/server";
import type { Team } from "@/lib/db/types";

type TeamRow = {
  id: string;
  name: string;
  crest: string;
  country: string;
  group: string;
  stadium: string;
  coach: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
};

function mapTeamRow(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    crest: row.crest,
    country: row.country,
    group: row.group,
    stadium: row.stadium,
    coach: row.coach,
    played: row.played,
    won: row.won,
    draw: row.draw,
    lost: row.lost,
    goalsFor: row.goals_for,
    goalsAgainst: row.goals_against,
    points: row.points,
  };
}

export async function leerEquipos(): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("id,name,crest,country,group,stadium,coach,played,won,draw,lost,goals_for,goals_against,points")
    .order("points", { ascending: false })
    .order("goals_for", { ascending: false });

  if (error) {
    throw new Error(`leerEquipos: ${error.message}`);
  }

  return (data ?? []).map((row) => mapTeamRow(row as TeamRow));
}

export async function leerEquipoPorId(id: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("id,name,crest,country,group,stadium,coach,played,won,draw,lost,goals_for,goals_against,points")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(`leerEquipoPorId: ${error.message}`);
  }

  return mapTeamRow(data as TeamRow);
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
