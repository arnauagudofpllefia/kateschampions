import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { hasRequiredRole } from "@/lib/auth/roles";
import { leerPartidos } from "@/lib/db/matches";
import { leerEquipos } from "@/lib/db/teams";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditorEditModal } from "@/components/editor-edit-modal";
import { TeamEditFields } from "@/components/team-edit-fields";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";

const teamUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  crest: z.string().trim().min(1).max(200),
  coach: z.string().trim().min(2).max(80),
  stadium: z.string().trim().min(2).max(120),
});

const teamCreateSchema = z.object({
  id: z.string().trim().min(2).max(24).regex(/^[a-z0-9_-]+$/),
  name: z.string().trim().min(2).max(80),
  crest: z.string().trim().min(1).max(200),
  country: z.string().trim().min(2).max(80),
  group: z.string().trim().min(1).max(8),
  stadium: z.string().trim().min(2).max(120),
  coach: z.string().trim().min(2).max(80),
});

const teamDeleteSchema = z.object({
  id: z.string().trim().min(1),
});

const matchUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["played", "upcoming"]),
  day: z.string().trim().min(10).max(10),
  time: z.string().trim().min(4).max(5),
  homeScore: z.string().trim(),
  awayScore: z.string().trim(),
});

const matchCreateSchema = z.object({
  id: z.string().trim().min(2).max(24).regex(/^[a-z0-9_-]+$/),
  matchday: z.coerce.number().int().min(1).max(99),
  day: z.string().trim().min(10).max(10),
  time: z.string().trim().min(4).max(5),
  homeTeamId: z.string().trim().min(1),
  awayTeamId: z.string().trim().min(1),
  status: z.enum(["played", "upcoming"]),
  homeScore: z.string().trim(),
  awayScore: z.string().trim(),
});

const matchDeleteSchema = z.object({
  id: z.string().trim().min(1),
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

    const supabase = createAdminClient();
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
    revalidatePath("/clasificacion");
    revalidatePath("/backoffice/editor");
  }

  async function createTeamAction(formData: FormData) {
    "use server";

    await assertEditorRole();

    const parsed = teamCreateSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      crest: formData.get("crest"),
      country: formData.get("country"),
      group: formData.get("group"),
      stadium: formData.get("stadium"),
      coach: formData.get("coach"),
    });

    if (!parsed.success) {
      return;
    }

    const supabase = createAdminClient();
    await supabase.from("teams").insert({
      id: parsed.data.id,
      name: parsed.data.name,
      crest: parsed.data.crest,
      country: parsed.data.country,
      group: parsed.data.group,
      stadium: parsed.data.stadium,
      coach: parsed.data.coach,
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      points: 0,
    });

    revalidatePath("/equipos");
    revalidatePath("/clasificacion");
    revalidatePath("/backoffice/editor");
  }

  async function deleteTeamAction(formData: FormData) {
    "use server";

    await assertEditorRole();

    const parsed = teamDeleteSchema.safeParse({
      id: formData.get("id"),
    });

    if (!parsed.success) {
      return;
    }

    const supabase = createAdminClient();
    await supabase.from("teams").delete().eq("id", parsed.data.id);

    revalidatePath("/equipos");
    revalidatePath("/partidos");
    revalidatePath("/resultados");
    revalidatePath("/clasificacion");
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

    const supabase = createAdminClient();
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

  async function createMatchAction(formData: FormData) {
    "use server";

    await assertEditorRole();

    const parsed = matchCreateSchema.safeParse({
      id: formData.get("id"),
      matchday: formData.get("matchday"),
      day: formData.get("day"),
      time: formData.get("time"),
      homeTeamId: formData.get("homeTeamId"),
      awayTeamId: formData.get("awayTeamId"),
      status: formData.get("status"),
      homeScore: formData.get("homeScore"),
      awayScore: formData.get("awayScore"),
    });

    if (!parsed.success || parsed.data.homeTeamId === parsed.data.awayTeamId) {
      return;
    }

    const homeScore = parsed.data.homeScore === "" ? null : Number(parsed.data.homeScore);
    const awayScore = parsed.data.awayScore === "" ? null : Number(parsed.data.awayScore);

    const supabase = createAdminClient();
    await supabase.from("matches").insert({
      id: parsed.data.id,
      matchday: parsed.data.matchday,
      day: parsed.data.day,
      time: parsed.data.time,
      home_team_id: parsed.data.homeTeamId,
      away_team_id: parsed.data.awayTeamId,
      status: parsed.data.status,
      home_score: homeScore,
      away_score: awayScore,
    });

    revalidatePath("/partidos");
    revalidatePath("/resultados");
    revalidatePath("/backoffice/editor");
  }

  async function deleteMatchAction(formData: FormData) {
    "use server";

    await assertEditorRole();

    const parsed = matchDeleteSchema.safeParse({
      id: formData.get("id"),
    });

    if (!parsed.success) {
      return;
    }

    const supabase = createAdminClient();
    await supabase.from("matches").delete().eq("id", parsed.data.id);

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
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-title text-3xl text-(--brand-accent-2)">Equipos</h2>
          <EditorEditModal
            buttonLabel="Crear equipo"
            title="Crear equipo"
            description="Completa los datos para registrar un nuevo equipo."
            submitLabel="Crear equipo"
            action={createTeamAction}
          >
            <label className="text-xs text-slate-300">ID (slug)</label>
            <input name="id" className="input-pro" placeholder="ej: ars" required />
            <label className="text-xs text-slate-300">Nombre</label>
            <input name="name" className="input-pro" placeholder="Arsenal" required />
            <label className="text-xs text-slate-300">Escudo (URL o ruta)</label>
            <input name="crest" className="input-pro" placeholder="/escudos/ars.png" required />
            <label className="text-xs text-slate-300">Pais</label>
            <input name="country" className="input-pro" placeholder="Inglaterra" required />
            <label className="text-xs text-slate-300">Grupo</label>
            <input name="group" className="input-pro" placeholder="A" required />
            <label className="text-xs text-slate-300">Estadio</label>
            <input name="stadium" className="input-pro" placeholder="Emirates Stadium" required />
            <label className="text-xs text-slate-300">Entrenador</label>
            <input name="coach" className="input-pro" placeholder="Mikel Arteta" required />
          </EditorEditModal>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {equipos.map((team) => (
            <article key={team.id} className="inner-panel space-y-3 p-4">
              <div className="flex items-start gap-3">
                {/* Keep plain img to support both local paths and remote storage URLs. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={team.crest}
                  alt={`Escudo de ${team.name}`}
                  className="h-12 w-12 rounded-md border border-white/25 bg-white/5 object-contain p-1"
                />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-(--brand-accent-2)">{team.name}</p>
                  <p className="text-sm text-slate-300">{team.country} · Grupo {team.group}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <p>Escudo: disponible</p>
                <p>Entrenador: {team.coach}</p>
                <p className="col-span-2">Estadio: {team.stadium}</p>
              </div>

              <EditorEditModal
                buttonLabel="Editar equipo"
                title={`Editar ${team.name}`}
                description="Actualiza nombre, escudo, entrenador y estadio."
                submitLabel="Guardar equipo"
                action={updateTeamAction}
              >
                <TeamEditFields
                  teamId={team.id}
                  name={team.name}
                  crest={team.crest}
                  coach={team.coach}
                  stadium={team.stadium}
                />
              </EditorEditModal>

              <form action={deleteTeamAction}>
                <input type="hidden" name="id" value={team.id} />
                <ConfirmSubmitButton
                  label="Eliminar equipo"
                  confirmMessage={`Vas a eliminar el equipo ${team.name}. Esta accion no se puede deshacer.`}
                />
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card p-5 text-slate-100">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-title text-3xl text-(--brand-accent-2)">Partidos</h2>
          <EditorEditModal
            buttonLabel="Crear partido"
            title="Crear partido"
            description="Registra un nuevo partido en el calendario."
            submitLabel="Crear partido"
            action={createMatchAction}
          >
            <label className="text-xs text-slate-300">ID (slug)</label>
            <input name="id" className="input-pro" placeholder="ej: m9" required />
            <label className="text-xs text-slate-300">Jornada</label>
            <input name="matchday" type="number" min={1} className="input-pro" required />
            <label className="text-xs text-slate-300">Fecha (YYYY-MM-DD)</label>
            <input name="day" className="input-pro" placeholder="2026-06-01" required />
            <label className="text-xs text-slate-300">Hora</label>
            <input name="time" className="input-pro" placeholder="21:00" required />
            <label className="text-xs text-slate-300">Local</label>
            <select name="homeTeamId" className="input-pro" required>
              {equipos.map((team) => (
                <option key={`home-${team.id}`} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <label className="text-xs text-slate-300">Visitante</label>
            <select name="awayTeamId" className="input-pro" required>
              {equipos.map((team) => (
                <option key={`away-${team.id}`} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <label className="text-xs text-slate-300">Estado</label>
            <select name="status" className="input-pro" required>
              <option value="upcoming">upcoming</option>
              <option value="played">played</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-300">Goles local</label>
                <input name="homeScore" type="number" min={0} className="input-pro mt-1" />
              </div>
              <div>
                <label className="text-xs text-slate-300">Goles visitante</label>
                <input name="awayScore" type="number" min={0} className="input-pro mt-1" />
              </div>
            </div>
          </EditorEditModal>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {partidos.map((match) => (
            <article key={match.id} className="inner-panel space-y-3 p-4">
              <div className="space-y-1">
                <p className="font-semibold text-(--brand-accent-2)">
                  {match.homeTeamName} vs {match.awayTeamName}
                </p>
                <p className="text-sm text-slate-300">
                  {match.day} · {match.time} · {match.status}
                </p>
                <p className="text-sm text-slate-300">
                  Marcador: {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
                </p>
              </div>

              <EditorEditModal
                buttonLabel="Editar partido"
                title="Editar partido"
                description="Actualiza fecha, hora, estado y marcador."
                submitLabel="Guardar partido"
                action={updateMatchAction}
              >
                <input type="hidden" name="id" value={match.id} />
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
              </EditorEditModal>

              <form action={deleteMatchAction}>
                <input type="hidden" name="id" value={match.id} />
                <ConfirmSubmitButton
                  label="Eliminar partido"
                  confirmMessage={`Vas a eliminar el partido ${match.homeTeamName} vs ${match.awayTeamName}. Esta accion no se puede deshacer.`}
                />
              </form>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
