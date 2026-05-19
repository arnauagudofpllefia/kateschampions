import { leerProximosPartidos, leerUltimosResultados } from "@/lib/db/matches";
import { leerClasificacion } from "@/lib/db/teams";

export async function leerEquiposDestacados(limit = 3) {
  const table = await leerClasificacion();
  return table.slice(0, limit);
}

export async function leerResumenHome() {
  const [clasificacion, ultimosResultados, proximosPartidos] = await Promise.all([
    leerClasificacion(),
    leerUltimosResultados(4),
    leerProximosPartidos(4),
  ]);

  return {
    totalEquipos: clasificacion.length,
    totalPartidosJugados: ultimosResultados.length,
    totalPartidosProximos: proximosPartidos.length,
    top3: clasificacion.slice(0, 3),
  };
}
