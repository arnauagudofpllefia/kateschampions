import { NextResponse } from "next/server";
import { leerEquipos } from "@/lib/db/teams";

export async function GET() {
  const equipos = await leerEquipos();
  return NextResponse.json({ equipos });
}
