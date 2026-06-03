import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { hasRequiredRole } from "@/lib/auth/roles";
import { leerPartidos } from "@/lib/db/matches";
import { leerEquipos } from "@/lib/db/teams";
import { createClient } from "@/lib/supabase/server";

const teamUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  crest: z.string().trim().min(1).max(200),
  coach: z.string().trim().min(2).max(80),
  stadium: z.string().trim().min(2).max(120),
});

const matchUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["played", "upcoming"]),
  day: z.string().trim().min(10).max(10),
  time: z.string().trim().min(4).max(5),
  homeScore: z.string().trim(),
  awayScore: z.string().trim(),
});

async function assertEditorRole() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user || !role || !hasRequiredRole(role, "editor")) {
    redirect("/login");
  }
}

export default async function EditorBackofficePage() {
  await assertEditorRole();

  const [equipos, partidos] = await Promise.all([leerEquipos(), leerPartidos()]);

  async function updateTeamAction(formData: FormData) {
    "use server";

    await assertEditorRole();

    const parsed = teamUpdateSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      crest: formData.get("crest"),
      coach: formData.get("coach"),
      stadium: formData.get("stadium"),
    });

    if (!parsed.success) {
      return;
    }

    const supabase = await createClient();
    await supabase
      .from("teams")
      .update({
        name: parsed.data.name,
        crest: parsed.data.crest,
        coach: parsed.data.coach,
        stadium: parsed.data.stadium,
      })
      .eq("id", parsed.data.id);

    revalidatePath("/equipos");
    revalidatePath("/backoffice/editor");
  }

  async function updateMatchAction(formData: FormData) {
    "use server";

    await assertEditorRole();

    const parsed = matchUpdateSchema.safeParse({
      id: formData.get("id"),
      status: formData.get("status"),
      day: formData.get("day"),
      time: formData.get("time"),
      homeScore: formData.get("homeScore"),
      awayScore: formData.get("awayScore"),
    });

    if (!parsed.success) {
      return;
    }

    const homeScore = parsed.data.homeScore === "" ? null : Number(parsed.data.homeScore);
    const awayScore = parsed.data.awayScore === "" ? null : Number(parsed.data.awayScore);

    const supabase = await createClient();
    await supabase
      .from("matches")
      .update({
        status: parsed.data.status,
        day: parsed.data.day,
        time: parsed.data.time,
        home_score: homeScore,
        away_score: awayScore,
      })
      .eq("id", parsed.data.id);

    revalidatePath("/partidos");
    revalidatePath("/resultados");
    revalidatePath("/backoffice/editor");
  }

  return (
    <main className="pro-shell space-y-8">
      <h1 className="page-title text-slate-100">Backoffice Editor</h1>
      <p className="subtle-text text-sm">
        Gestion de equipos, escudos y estado de partidos.
      </p>

      <section className="section-card p-5 text-slate-100">
        <h2 className="font-title text-3xl text-[#f8d66d]">Equipos</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {equipos.map((team) => (
            <form key={team.id} action={updateTeamAction} className="inner-panel space-y-2 p-4">
              <input type="hidden" name="id" value={team.id} />
              <label className="text-sm">Nombre</label>
              <input name="name" defaultValue={team.name} className="input-pro" required />
              <label className="text-sm">Escudo</label>
              <input name="crest" defaultValue={team.crest} className="input-pro" required />
              <label className="text-sm">Entrenador</label>
              <input name="coach" defaultValue={team.coach} className="input-pro" required />
              <label className="text-sm">Estadio</label>
              <input name="stadium" defaultValue={team.stadium} className="input-pro" required />
              <button type="submit" className="btn-primary mt-2">Guardar equipo</button>
            </form>
          ))}
        </div>
      </section>

      <section className="section-card p-5 text-slate-100">
        <h2 className="font-title text-3xl text-[#f8d66d]">Partidos</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {partidos.map((match) => (
            <form key={match.id} action={updateMatchAction} className="inner-panel space-y-2 p-4">
              <input type="hidden" name="id" value={match.id} />
              <p className="font-semibold text-[#f8d66d]">
                {match.homeTeamName} vs {match.awayTeamName}
              </p>
              <label className="text-sm">Fecha (YYYY-MM-DD)</label>
              <input name="day" defaultValue={match.day} className="input-pro" required />
              <label className="text-sm">Hora</label>
              <input name="time" defaultValue={match.time} className="input-pro" required />
              <label className="text-sm">Estado</label>
              <select name="status" defaultValue={match.status} className="input-pro" required>
                <option value="upcoming">upcoming</option>
                <option value="played">played</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">Goles local</label>
                  <input
                    type="number"
                    min={0}
                    name="homeScore"
                    defaultValue={match.homeScore ?? ""}
                    className="input-pro"
                  />
                </div>
                <div>
                  <label className="text-sm">Goles visitante</label>
                  <input
                    type="number"
                    min={0}
                    name="awayScore"
                    defaultValue={match.awayScore ?? ""}
                    className="input-pro"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-2">Guardar partido</button>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
