"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

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
        </nav>

        <div className="flex items-center gap-2 text-sm text-slate-200">
          {session?.user ? (
            <>
              <span className="hidden md:inline">{session.user.name}</span>
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
      </nav>
    </header>
  );
}
