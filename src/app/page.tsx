import Link from "next/link";
import { TeamName } from "@/components/team-name";
import { leerResumenHome } from "@/lib/db/dashboard";
import { leerPartidosPorDia } from "@/lib/db/matches";

export default async function HomePage() {
  const [resumen, partidosPorDia] = await Promise.all([
    leerResumenHome(),
    leerPartidosPorDia(),
  ]);

  const dias = Object.keys(partidosPorDia).sort((a, b) => a.localeCompare(b));

  return (
    <main className="pro-shell">
      <section className="hero-panel home-hero-image rounded-2xl p-6 sm:p-10">
        <p className="font-title text-base uppercase tracking-[0.18em] text-(--brand-accent-2)">
          InfoChampions
        </p>
        <h1 className="mt-2 text-4xl leading-tight font-title text-slate-100 sm:text-5xl lg:max-w-3xl">
          Todo en una sola pantalla
        </h1>
        <p className="subtle-text mt-4 max-w-2xl">
          Informacion de equipos, calendario, resultados y clasificacion con una arquitectura
          lista para conectar a Supabase mas adelante.
        </p>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="inner-panel p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-300">Equipos</p>
            <p className="kpi-value mt-1 text-slate-100">{resumen.totalEquipos}</p>
          </article>
          <article className="inner-panel p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-300">Ultimos resultados</p>
            <p className="kpi-value mt-1 text-slate-100">
              {resumen.totalPartidosJugados}
            </p>
          </article>
          <article className="inner-panel p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-300">Proximos</p>
            <p className="kpi-value mt-1 text-slate-100">
              {resumen.totalPartidosProximos}
            </p>
          </article>
          <article className="inner-panel p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-300">Lider actual</p>
            {resumen.top3[0] ? (
              <p className="mt-1 text-lg font-bold text-(--brand-accent-2)">
                <TeamName name={resumen.top3[0].name} crest={resumen.top3[0].crest} size="sm" />
              </p>
            ) : null}
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/equipos" className="btn-primary">
            Ver equipos
          </Link>
          <Link href="/partidos" className="btn-ghost">
            Ver partidos
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="section-card p-5">
          <h2 className="text-2xl font-semibold text-slate-100">Top 3 clasificacion</h2>
          <ul className="mt-4 space-y-3">
            {resumen.top3.map((team, index) => (
              <li key={team.id} className="inner-panel flex items-center justify-between p-3 text-slate-100">
                <span className="inline-flex items-center gap-2">
                  <span>{index + 1}.</span>
                  <TeamName name={team.name} crest={team.crest} />
                </span>
                <span className="font-semibold text-(--brand-accent-2)">{team.points} pts</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="section-card p-5">
          <h2 className="text-2xl font-semibold text-slate-100">Partidos por dia</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {dias.map((dia) => (
              <li key={dia} className="inner-panel p-3">
                <p className="font-semibold text-(--brand-accent-2)">{dia}</p>
                <p className="mt-1">{partidosPorDia[dia].length} partidos programados</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
