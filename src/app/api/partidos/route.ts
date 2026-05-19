import { NextResponse } from "next/server";
import { leerPartidos, leerPartidosPorDia } from "@/lib/db/matches";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agrupar = searchParams.get("agrupar");

  if (agrupar === "dia") {
    const partidosPorDia = await leerPartidosPorDia();
    return NextResponse.json({ partidosPorDia });
  }

  const partidos = await leerPartidos();
  return NextResponse.json({ partidos });
}
