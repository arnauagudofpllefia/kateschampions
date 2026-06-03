"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "No se pudo registrar el usuario");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });

    router.refresh();
  }

  return (
    <main className="pro-shell flex max-w-md flex-1 items-center">
      <form onSubmit={onSubmit} className="form-shell w-full p-6 text-slate-100" aria-busy={loading}>
        <h1 className="page-title text-4xl text-slate-100">Registro</h1>
        <p className="subtle-text mt-1 text-sm">Crea una cuenta con rol user.</p>

        <label className="mt-6 block text-sm font-semibold">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="input-pro mt-2"
          autoComplete="name"
          disabled={loading}
          required
        />

        <label className="mt-4 block text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-pro mt-2"
          autoComplete="email"
          disabled={loading}
          required
        />

        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input-pro mt-2"
          autoComplete="new-password"
          disabled={loading}
          required
          minLength={6}
        />

        {error ? (
          <p className="status-note error-note mt-3 text-sm" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-(--brand-accent-2) hover:underline">
            Inicia sesion
          </Link>
        </p>
      </form>
    </main>
  );
}
