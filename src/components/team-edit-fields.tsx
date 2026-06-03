"use client";

import { useState } from "react";

type TeamEditFieldsProps = {
  teamId: string;
  name: string;
  crest: string;
  coach: string;
  stadium: string;
};

export function TeamEditFields({ teamId, name, crest, coach, stadium }: TeamEditFieldsProps) {
  const [crestUrl, setCrestUrl] = useState(crest);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function onUploadCrest() {
    if (!selectedFile) {
      setUploadError("Selecciona una imagen primero");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("teamId", teamId);
    formData.append("crest", selectedFile);

    const response = await fetch("/api/teams/crest", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setUploadError(payload.error ?? "No se pudo subir el escudo");
      setUploading(false);
      return;
    }

    const payload = (await response.json()) as { crestUrl: string };
    setCrestUrl(payload.crestUrl);
    setSelectedFile(null);
    setUploading(false);
  }

  return (
    <>
      <input type="hidden" name="id" value={teamId} />
      <input type="hidden" name="crest" value={crestUrl} />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Escudo del equipo</p>
        {crestUrl ? (
          // Remote URLs may not be configured for next/image. Use img for admin preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={crestUrl}
            alt={`Escudo de ${name}`}
            className="h-20 w-20 rounded-md border border-white/25 bg-white/5 object-contain p-1"
          />
        ) : (
          <div className="empty-note inline-flex h-20 w-20 items-center justify-center text-xs">
            Sin escudo
          </div>
        )}
      </div>

      <label className="text-sm">Cambiar escudo (archivo)</label>
      <input
        type="file"
        accept="image/*"
        className="input-pro"
        disabled={uploading}
        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
      />
      <button type="button" className="btn-ghost" onClick={onUploadCrest} disabled={uploading}>
        {uploading ? "Subiendo escudo..." : "Subir escudo"}
      </button>

      {uploadError ? (
        <p className="status-note error-note text-sm" role="alert" aria-live="polite">
          {uploadError}
        </p>
      ) : null}

      <p className="subtle-text text-xs">
        URL del escudo actual: <span className="text-slate-200">{crestUrl}</span>
      </p>

      <label className="text-sm">Nombre</label>
      <input name="name" defaultValue={name} className="input-pro" required />
      <label className="text-sm">Entrenador</label>
      <input name="coach" defaultValue={coach} className="input-pro" required />
      <label className="text-sm">Estadio</label>
      <input name="stadium" defaultValue={stadium} className="input-pro" required />
    </>
  );
}
