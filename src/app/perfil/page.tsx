import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ProfileAvatarForm } from "@/components/profile-avatar-form";
import { authOptions } from "@/lib/auth/options";
import { leerUsuarioPorId } from "@/lib/db/users";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await leerUsuarioPorId(session.user.id);

  const displayName = user?.name ?? session.user.name ?? "Usuario";
  const avatarUrl = user?.avatarUrl ?? session.user.avatarUrl ?? null;

  return (
    <main className="pro-shell max-w-2xl space-y-6">
      <h1 className="page-title text-slate-100">Perfil</h1>
      <p className="subtle-text">Gestiona tu avatar de usuario.</p>

      <ProfileAvatarForm avatarUrl={avatarUrl} displayName={displayName} />
    </main>
  );
}
