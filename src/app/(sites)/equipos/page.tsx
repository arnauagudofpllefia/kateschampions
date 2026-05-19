import Link from "next/link";
import { TeamName } from "@/components/team-name";
import { leerEquipos } from "@/lib/db/teams";

export default async function EquiposPage() {
  const equipos = await leerEquipos();

  return (
    <main className="pro-shell">
      <h1 className="page-title text-slate-100">Equipos Champions</h1>
      <p className="subtle-text mt-2 max-w-2xl">
        Vista general de todos los equipos participantes.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {equipos.map((equipo) => (
          <Link
            key={equipo.id}
            href={`/equipos/${equipo.id}`}
            className="section-card group p-5 transition hover:-translate-y-1 hover:border-[#f8d66d]/60"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-slate-100 group-hover:text-[#f8d66d]">
                <TeamName name={equipo.name} crest={equipo.crest} />
              </h2>
              <span className="badge-pro">
                Grupo {equipo.group}
              </span>
            </div>
            <p className="subtle-text mt-2 text-sm">{equipo.country}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-200">
              <p>Pts: {equipo.points}</p>
              <p>GF: {equipo.goalsFor}</p>
              <p>GC: {equipo.goalsAgainst}</p>
              <p>DG: {equipo.goalsFor - equipo.goalsAgainst}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
