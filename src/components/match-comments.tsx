"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { MatchComment } from "@/lib/db/comments";

type MatchCommentsProps = {
  matchId: string;
  initialComments: MatchComment[];
};

export function MatchComments({ matchId, initialComments }: MatchCommentsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/partidos/${matchId}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "No se pudo publicar el comentario");
      setLoading(false);
      return;
    }

    setContent("");
    const updated = await fetch(`/api/partidos/${matchId}/comentarios`, { cache: "no-store" });
    const payload = (await updated.json()) as { comentarios: MatchComment[] };
    setComments(payload.comentarios);
    setLoading(false);
    router.refresh();
  }

  return (
    <section className="section-card p-5 text-slate-100">
      <h2 className="font-title text-3xl text-[#f8d66d]">Comentarios</h2>
      <p className="subtle-text mt-1 text-sm">Debate del partido para usuarios registrados.</p>

      {session?.user ? (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="input-pro min-h-24"
            placeholder="Comparte tu opinion del partido..."
            maxLength={500}
            required
          />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Publicando..." : "Publicar comentario"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-300">Inicia sesion para comentar este partido.</p>
      )}

      <div className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-300">Aun no hay comentarios.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="inner-panel p-3">
              <header className="flex items-center justify-between gap-3">
                <p className="font-semibold text-[#f8d66d]">{comment.userName}</p>
                <time className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleString("es-ES")}
                </time>
              </header>
              <p className="mt-2 text-sm text-slate-100">{comment.content}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
