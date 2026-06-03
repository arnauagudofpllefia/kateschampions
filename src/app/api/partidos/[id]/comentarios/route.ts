import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { crearComentario, leerComentariosPorPartido } from "@/lib/db/comments";
import { leerPartidoPorId } from "@/lib/db/matches";

const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "El comentario es demasiado corto")
    .max(500, "El comentario supera 500 caracteres"),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const partido = await leerPartidoPorId(id);

  if (!partido) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  const comentarios = await leerComentariosPorPartido(id);
  return NextResponse.json({ comentarios });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesion" }, { status: 401 });
  }

  const { id } = await context.params;
  const partido = await leerPartidoPorId(id);

  if (!partido) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  const body = (await request.json()) as unknown;
  const parsed = createCommentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos invalidos" },
      { status: 400 },
    );
  }

  await crearComentario({
    matchId: id,
    userId: session.user.id,
    content: parsed.data.content,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
