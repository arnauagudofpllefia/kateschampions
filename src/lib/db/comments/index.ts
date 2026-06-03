import { createClient } from "@/lib/supabase/server";

export type MatchComment = {
  id: string;
  matchId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
};

type MatchCommentRow = {
  id: string;
  match_id: string;
  user_id: string;
  content: string;
  created_at: string;
  users: {
    name: string;
  } | null;
};

function mapCommentRow(row: MatchCommentRow): MatchComment {
  return {
    id: row.id,
    matchId: row.match_id,
    userId: row.user_id,
    userName: row.users?.name ?? "Usuario",
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function leerComentariosPorPartido(matchId: string): Promise<MatchComment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("match_comments")
    .select("id,match_id,user_id,content,created_at,users(name)")
    .eq("match_id", matchId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`leerComentariosPorPartido: ${error.message}`);
  }

  return (data ?? []).map((row) => mapCommentRow(row as MatchCommentRow));
}

export async function crearComentario(input: {
  matchId: string;
  userId: string;
  content: string;
}): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("match_comments").insert({
    match_id: input.matchId,
    user_id: input.userId,
    content: input.content.trim(),
  });

  if (error) {
    throw new Error(`crearComentario: ${error.message}`);
  }
}
