import { leerClasificacion } from "@/lib/db/teams";
import { TeamName } from "@/components/team-name";

export default async function ClasificacionPage() {
  const clasificacion = await leerClasificacion();

  return (
    <main className="pro-shell">
      <h1 className="page-title text-slate-100">Clasificacion general</h1>
      <p className="subtle-text mt-2">Formato liga con todos los equipos participantes.</p>

      <section className="section-card mt-8 overflow-x-auto p-4">
        <table className="table-pro w-full min-w-[760px] text-left text-sm text-slate-200">
          <thead>
            <tr>
              <th className="px-2 py-3">Pos</th>
              <th className="px-2 py-3">Equipo</th>
              <th className="px-2 py-3">PJ</th>
              <th className="px-2 py-3">G</th>
              <th className="px-2 py-3">E</th>
              <th className="px-2 py-3">P</th>
              <th className="px-2 py-3">GF</th>
              <th className="px-2 py-3">GC</th>
              <th className="px-2 py-3">DG</th>
              <th className="px-2 py-3">Pts</th>
            </tr>
          </thead>
          <tbody>
            {clasificacion.map((team, index) => (
              <tr key={team.id}>
                <td className="px-2 py-3">{index + 1}</td>
                <td className="px-2 py-3 font-semibold">
                  <TeamName name={team.name} crest={team.crest} size="sm" />
                </td>
                <td className="px-2 py-3">{team.played}</td>
                <td className="px-2 py-3">{team.won}</td>
                <td className="px-2 py-3">{team.draw}</td>
                <td className="px-2 py-3">{team.lost}</td>
                <td className="px-2 py-3">{team.goalsFor}</td>
                <td className="px-2 py-3">{team.goalsAgainst}</td>
                <td className="px-2 py-3">{team.goalsFor - team.goalsAgainst}</td>
                <td className="px-2 py-3 font-bold text-[#f8d66d]">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
