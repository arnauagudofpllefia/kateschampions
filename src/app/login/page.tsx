"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("demo@champions.local");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    router.push(result?.url ?? "/");
    router.refresh();
  }

  return (
    <main className="pro-shell flex max-w-md flex-1 items-center">
      <form onSubmit={onSubmit} className="form-shell w-full p-6 text-slate-100">
        <h1 className="page-title text-4xl text-slate-100">Login</h1>
        <p className="subtle-text mt-1 text-sm">Accede para guardar tu sesion.</p>

        <label className="mt-6 block text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-pro mt-2"
          required
        />

        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input-pro mt-2"
          required
        />

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-[#f8d66d] hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </main>
  );
}
