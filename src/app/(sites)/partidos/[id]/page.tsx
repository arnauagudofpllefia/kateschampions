import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchComments } from "@/components/match-comments";
import { TeamName } from "@/components/team-name";
import { leerComentariosPorPartido } from "@/lib/db/comments";
import { leerPartidoPorId } from "@/lib/db/matches";

export default async function PartidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partido = await leerPartidoPorId(id);

  if (!partido) {
    notFound();
  }

  const comentarios = await leerComentariosPorPartido(id);

  return (
    <main className="pro-shell space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="page-title text-slate-100">Detalle del partido</h1>
        <Link href="/partidos" className="btn-primary">
          Volver a partidos
        </Link>
      </div>

      <section className="section-card p-6 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2 text-lg font-semibold">
            <TeamName name={partido.homeTeamName} crest={partido.homeTeamCrest} />
            <span className="text-slate-400">vs</span>
            <TeamName name={partido.awayTeamName} crest={partido.awayTeamCrest} />
          </p>
          <span className="badge-pro">Jornada {partido.matchday}</span>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          <p>Fecha: {partido.day}</p>
          <p>Hora: {partido.time}</p>
          <p>Estado: {partido.status === "played" ? "Finalizado" : "Pendiente"}</p>
          <p>
            Marcador: {partido.homeScore ?? "-"} - {partido.awayScore ?? "-"}
          </p>
        </div>
      </section>

      <MatchComments matchId={partido.id} initialComments={comentarios} />
    </main>
  );
}
