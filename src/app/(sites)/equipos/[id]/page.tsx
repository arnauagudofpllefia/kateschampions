import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamName } from "@/components/team-name";
import { leerPartidos } from "@/lib/db/matches";
import { leerEquipoPorId } from "@/lib/db/teams";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EquipoDetallePage({ params }: Props) {
  const { id } = await params;
  const equipo = await leerEquipoPorId(id);

  if (!equipo) {
    notFound();
  }

  const partidos = (await leerPartidos()).filter(
    (partido) => partido.homeTeamId === id || partido.awayTeamId === id,
  );

  return (
    <main className="pro-shell max-w-5xl">
      <Link href="/equipos" className="text-sm font-semibold text-[#f8d66d] hover:underline">
        Volver a equipos
      </Link>

      <section className="hero-panel mt-4 rounded-3xl border border-white/20 p-6">
        <h1 className="page-title text-slate-100">
          <TeamName name={equipo.name} crest={equipo.crest} size="lg" className="text-inherit" />
        </h1>
        <p className="subtle-text mt-1">
          {equipo.country} · Grupo {equipo.group}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <article className="inner-panel p-4 text-slate-100">
            <p className="text-xs uppercase text-slate-300">Entrenador</p>
            <p className="mt-1 text-lg font-bold">{equipo.coach}</p>
          </article>
          <article className="inner-panel p-4 text-slate-100">
            <p className="text-xs uppercase text-slate-300">Estadio</p>
            <p className="mt-1 text-lg font-bold">{equipo.stadium}</p>
          </article>
          <article className="inner-panel p-4 text-slate-100">
            <p className="text-xs uppercase text-slate-300">Puntos</p>
            <p className="mt-1 text-lg font-bold">{equipo.points}</p>
          </article>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="page-title text-3xl text-slate-100">Partidos del equipo</h2>
        <div className="mt-4 space-y-3">
          {partidos.map((partido) => (
            <article key={partido.id} className="section-card p-4 text-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <TeamName name={partido.homeTeamName} crest={partido.homeTeamCrest} size="sm" />
                    <span className="text-slate-400">vs</span>
                    <TeamName name={partido.awayTeamName} crest={partido.awayTeamCrest} size="sm" />
                  </span>
                </p>
                <span className="subtle-text text-sm">
                  {partido.day} · {partido.time}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#f8d66d]">
                {partido.status === "played"
                  ? `Resultado: ${partido.homeScore} - ${partido.awayScore}`
                  : "Pendiente"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
