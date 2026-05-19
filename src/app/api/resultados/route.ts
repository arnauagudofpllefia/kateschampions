import { NextResponse } from "next/server";
import {
  leerEquiposDestacados,
  leerResumenHome,
} from "@/lib/db/dashboard";
import {
  leerProximosPartidos,
  leerUltimosResultados,
} from "@/lib/db/matches";
import { leerClasificacion } from "@/lib/db/teams";

export async function GET() {
  const [equiposDestacados, ultimosResultados, clasificacion, proximosPartidos, resumen] =
    await Promise.all([
      leerEquiposDestacados(3),
      leerUltimosResultados(5),
      leerClasificacion(),
      leerProximosPartidos(5),
      leerResumenHome(),
    ]);

  return NextResponse.json({
    equiposDestacados,
    ultimosResultados,
    clasificacion,
    proximosPartidos,
    resumen,
  });
}
