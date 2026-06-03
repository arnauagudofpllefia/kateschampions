import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { hasRequiredRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/db/types";

const updateRoleSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["user", "editor", "admin"]),
});

async function assertAdminRole() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user || !role || !hasRequiredRole(role, "admin")) {
    redirect("/login");
  }
}

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export default async function AdminBackofficePage() {
  await assertAdminRole();

  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("id,name,email,role,created_at")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as UserRow[];

  async function updateRoleAction(formData: FormData) {
    "use server";

    await assertAdminRole();

    const parsed = updateRoleSchema.safeParse({
      id: formData.get("id"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      return;
    }

    const supabaseClient = await createClient();
    await supabaseClient
      .from("users")
      .update({ role: parsed.data.role })
      .eq("id", parsed.data.id);

    revalidatePath("/backoffice/admin");
  }

  return (
    <main className="pro-shell space-y-6">
      <h1 className="page-title text-slate-100">Backoffice Admin</h1>
      <p className="subtle-text text-sm">Gestion de usuarios y roles.</p>

      <section className="section-card p-5 text-slate-100">
        <div className="mt-2 space-y-3">
          {users.map((user) => (
            <form key={user.id} action={updateRoleAction} className="inner-panel flex flex-wrap items-end justify-between gap-3 p-4">
              <input type="hidden" name="id" value={user.id} />
              <div>
                <p className="font-semibold text-[#f8d66d]">{user.name}</p>
                <p className="text-sm text-slate-300">{user.email}</p>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <label className="text-xs text-slate-300">Rol</label>
                  <select name="role" defaultValue={user.role} className="input-pro" required>
                    <option value="user">USER</option>
                    <option value="editor">EDITOR</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
