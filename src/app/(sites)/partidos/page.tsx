import { leerPartidosPorDia } from "@/lib/db/matches";
import { TeamName } from "@/components/team-name";

export default async function PartidosPage() {
  const partidosPorDia = await leerPartidosPorDia();
  const dias = Object.keys(partidosPorDia).sort((a, b) => a.localeCompare(b));

  return (
    <main className="pro-shell">
      <h1 className="page-title text-slate-100">Partidos por dia</h1>
      <p className="subtle-text mt-2">Calendario completo separado por jornada diaria.</p>

      <div className="mt-8 space-y-6">
        {dias.map((dia) => (
          <section key={dia} className="section-card p-5">
            <h2 className="font-title text-3xl text-[#f8d66d]">{dia}</h2>
            <div className="mt-4 grid gap-3">
              {partidosPorDia[dia].map((partido) => (
                <article key={partido.id} className="inner-panel p-4 text-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <TeamName name={partido.homeTeamName} crest={partido.homeTeamCrest} size="sm" />
                        <span className="text-slate-400">vs</span>
                        <TeamName name={partido.awayTeamName} crest={partido.awayTeamCrest} size="sm" />
                      </span>
                    </p>
                    <span className="badge-pro">
                      {partido.time}
                    </span>
                  </div>
                  <p className="subtle-text mt-2 text-sm">
                    {partido.status === "played"
                      ? `Resultado final: ${partido.homeScore} - ${partido.awayScore}`
                      : "Partido pendiente"}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
