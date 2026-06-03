"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProfileAvatarFormProps = {
  avatarUrl: string | null;
  displayName: string;
};

export function ProfileAvatarForm({ avatarUrl, displayName }: ProfileAvatarFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onFileChange(file: File | undefined) {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const response = await fetch("/api/users/avatar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "No se pudo subir el avatar");
      setLoading(false);
      return;
    }

    formElement.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="section-card space-y-4 p-6 text-slate-100" aria-busy={loading}>
      <div className="flex items-center gap-4">
        {previewUrl ? (
          // Blob/object URLs for local preview are not supported by next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={`Avatar de ${displayName}`}
            className="h-20 w-20 rounded-full border border-white/25 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-white/25 bg-[rgba(200,154,66,0.16)] text-2xl font-bold text-(--brand-accent-2)">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div>
          <p className="font-title text-3xl text-(--brand-accent-2)">Tu avatar</p>
          <p className="subtle-text text-sm">Sube una imagen desde tu ordenador (max 2MB).</p>
        </div>
      </div>

      <input
        type="file"
        name="avatar"
        accept="image/*"
        className="input-pro"
        disabled={loading}
        required
        onChange={(event) => onFileChange(event.target.files?.[0])}
      />

      {error ? (
        <p className="status-note error-note text-sm" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      {loading ? <p className="status-note subtle-text text-xs">Subiendo imagen...</p> : null}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Subiendo..." : "Guardar avatar"}
      </button>
    </form>
  );
}
