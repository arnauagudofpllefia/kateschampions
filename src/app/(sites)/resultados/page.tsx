import { leerEquiposDestacados } from "@/lib/db/dashboard";
import { TeamName } from "@/components/team-name";
import { leerProximosPartidos, leerUltimosResultados } from "@/lib/db/matches";
import { leerClasificacion } from "@/lib/db/teams";

export default async function ResultadosPage() {
  const [destacados, ultimos, clasificacion, proximos] = await Promise.all([
    leerEquiposDestacados(3),
    leerUltimosResultados(4),
    leerClasificacion(),
    leerProximosPartidos(4),
  ]);

  return (
    <main className="pro-shell">
      <h1 className="page-title text-slate-100">Resultados y resumen</h1>
      <p className="subtle-text mt-2 max-w-3xl">
        Equipos destacados, ultimos marcadores, clasificacion parcial y proximos cruces.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {destacados.map((team, index) => (
          <article key={team.id} className="hero-panel rounded-xl border-[rgba(200,154,66,0.45)] p-4 text-slate-100">
            <p className="text-xs uppercase tracking-[0.12em] text-(--brand-accent-2)">Destacado #{index + 1}</p>
            <h2 className="mt-2 text-xl font-semibold">
              <TeamName name={team.name} crest={team.crest} />
            </h2>
            <p className="subtle-text mt-1 text-sm">{team.country}</p>
            <p className="mt-3 text-sm">{team.points} pts</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="section-card p-5">
          <h3 className="text-xl font-semibold text-slate-100">Ultimos resultados</h3>
          <ul className="mt-4 space-y-2 text-slate-200">
            {ultimos.map((match) => (
              <li key={match.id} className="inner-panel p-3 text-sm">
                <p className="font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <TeamName name={match.homeTeamName} crest={match.homeTeamCrest} size="sm" />
                    <span>
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <TeamName name={match.awayTeamName} crest={match.awayTeamCrest} size="sm" />
                  </span>
                </p>
                <p className="subtle-text mt-1 text-xs">{match.day}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="section-card p-5">
          <h3 className="text-xl font-semibold text-slate-100">Proximos partidos</h3>
          <ul className="mt-4 space-y-2 text-slate-200">
            {proximos.map((match) => (
              <li key={match.id} className="inner-panel p-3 text-sm">
                <p className="font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <TeamName name={match.homeTeamName} crest={match.homeTeamCrest} size="sm" />
                    <span className="text-slate-400">vs</span>
                    <TeamName name={match.awayTeamName} crest={match.awayTeamCrest} size="sm" />
                  </span>
                </p>
                <p className="subtle-text mt-1 text-xs">
                  {match.day} · {match.time}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-card mt-8 p-5">
        <h3 className="text-xl font-semibold text-slate-100">Clasificacion (Top 5)</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="table-pro w-full text-left text-sm text-slate-200">
            <thead>
              <tr>
                <th className="pb-2">#</th>
                <th className="pb-2">Equipo</th>
                <th className="pb-2">Pts</th>
                <th className="pb-2">DG</th>
              </tr>
            </thead>
            <tbody>
              {clasificacion.slice(0, 5).map((team, index) => (
                <tr key={team.id} className="border-t border-white/10">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">
                    <TeamName name={team.name} crest={team.crest} size="sm" />
                  </td>
                  <td className="py-2">{team.points}</td>
                  <td className="py-2">{team.goalsFor - team.goalsAgainst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
