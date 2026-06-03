"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { hasRequiredRole } from "@/lib/auth/roles";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipos", label: "Equipos" },
  { href: "/partidos", label: "Partidos" },
  { href: "/resultados", label: "Resultados" },
  { href: "/clasificacion", label: "Clasificacion" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const canAccessEditor = role ? hasRequiredRole(role, "editor") : false;
  const canAccessAdmin = role ? hasRequiredRole(role, "admin") : false;

  return (
    <header className="sticky top-0 z-30 border-b border-white/15 bg-[#091224]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-[#f8d66d]">
          <span className="badge-pro">UCL</span>
          <span className="font-title text-2xl leading-none tracking-wider">Champions Hub</span>
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-semibold text-slate-100 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border px-3 py-1.5 ${
                pathname === link.href
                  ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                  : "border-white/20 hover:border-[#f8d66d]/65 hover:text-[#f8d66d]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {canAccessEditor ? (
            <Link
              href="/backoffice/editor"
              className={`rounded-full border px-3 py-1.5 ${
                pathname === "/backoffice/editor"
                  ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                  : "border-white/20 hover:border-[#f8d66d]/65 hover:text-[#f8d66d]"
              }`}
            >
              Backoffice Editor
            </Link>
          ) : null}
          {canAccessAdmin ? (
            <Link
              href="/backoffice/admin"
              className={`rounded-full border px-3 py-1.5 ${
                pathname === "/backoffice/admin"
                  ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                  : "border-white/20 hover:border-[#f8d66d]/65 hover:text-[#f8d66d]"
              }`}
            >
              Backoffice Admin
            </Link>
          ) : null}
          {session?.user ? (
            <Link
              href="/perfil"
              className={`rounded-full border px-3 py-1.5 ${
                pathname === "/perfil"
                  ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                  : "border-white/20 hover:border-[#f8d66d]/65 hover:text-[#f8d66d]"
              }`}
            >
              Perfil
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 text-sm text-slate-200">
          {session?.user ? (
            <>
              <Link
                href="/perfil"
                className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-[#f8d66d]/15"
                aria-label="Ir al perfil"
                title={`${session.user.name} (${session.user.role.toUpperCase()})`}
              >
                {session.user.avatarUrl ? (
                  <Image
                    src={session.user.avatarUrl}
                    alt={`Avatar de ${session.user.name}`}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-semibold text-[#f8d66d]">
                    {session.user.name?.slice(0, 1).toUpperCase() ?? "U"}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-3 py-1 hover:text-[#f8d66d]">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-6xl flex-wrap gap-2 px-4 pb-3 md:hidden sm:px-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              pathname === link.href
                ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                : "border-white/20 text-slate-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
        {canAccessEditor ? (
          <Link
            href="/backoffice/editor"
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              pathname === "/backoffice/editor"
                ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                : "border-white/20 text-slate-100"
            }`}
          >
            Editor
          </Link>
        ) : null}
        {canAccessAdmin ? (
          <Link
            href="/backoffice/admin"
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              pathname === "/backoffice/admin"
                ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                : "border-white/20 text-slate-100"
            }`}
          >
            Admin
          </Link>
        ) : null}
        {session?.user ? (
          <Link
            href="/perfil"
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              pathname === "/perfil"
                ? "border-[#f8d66d]/60 bg-[#f8d66d]/15 text-[#f8d66d]"
                : "border-white/20 text-slate-100"
            }`}
          >
            Perfil
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
