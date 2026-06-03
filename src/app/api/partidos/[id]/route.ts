import { NextResponse } from "next/server";
import { leerPartidoPorId } from "@/lib/db/matches";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const partido = await leerPartidoPorId(id);

  if (!partido) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ partido });
}
