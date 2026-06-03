"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const avatarSrc = session?.user?.avatarUrl ?? "/avatars/default-user.svg";
  const role = session?.user?.role;
  const canAccessEditor = role ? hasRequiredRole(role, "editor") : false;
  const canAccessAdmin = role ? hasRequiredRole(role, "admin") : false;

  const headerLinks = [
    ...links,
    ...(canAccessEditor ? [{ href: "/backoffice/editor", label: "Editor" }] : []),
    ...(canAccessAdmin ? [{ href: "/backoffice/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="header-shell sticky top-0 z-30">
      <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-7">
        <Link href="/" className="flex items-center gap-2 text-(--brand-accent-2)">
          <Image
            src="/images/infochampions-logo.svg"
            alt="InfoChampions logo"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="font-title text-2xl leading-none tracking-wide">InfoChampions</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {headerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-chip ${
                pathname === link.href
                  ? "nav-chip-active"
                  : "hover:text-(--brand-accent-2)"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-sm text-slate-200">
          {session?.user ? (
            <>
              <Link
                href="/perfil"
                className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-white/25 bg-white/5"
                aria-label="Ir al perfil"
                title={`${session.user.name} (${session.user.role.toUpperCase()})`}
              >
                <Image
                  src={avatarSrc}
                  alt={`Avatar de ${session.user.name}`}
                  width={40}
                  height={40}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-primary"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Registro
              </Link>
            </>
          )}

          <button
            type="button"
            className="nav-chip md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="main-mobile-navigation"
            aria-label="Abrir menu"
          >
            Menu
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mx-auto w-full max-w-295 px-4 pb-3 sm:px-6 lg:px-7 md:hidden">
          <div className="mobile-menu-panel p-3">
            <nav id="main-mobile-navigation" className="grid gap-2" aria-label="Navegacion principal movil">
              {headerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    pathname === link.href
                      ? "border border-[rgba(200,154,66,0.38)] bg-[rgba(200,154,66,0.11)] text-(--brand-accent-2)"
                      : "border border-transparent text-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
