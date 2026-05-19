import { NextResponse } from "next/server";
import { leerEquipoPorId } from "@/lib/db/teams";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const equipo = await leerEquipoPorId(id);

  if (!equipo) {
    return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ equipo });
}
