import { NextResponse } from "next/server";
import { leerClasificacion } from "@/lib/db/teams";

export async function GET() {
  const clasificacion = await leerClasificacion();
  return NextResponse.json({ clasificacion });
}
