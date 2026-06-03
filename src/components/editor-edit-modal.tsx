"use client";

import { useId, useRef } from "react";

type EditorEditModalProps = {
  buttonLabel: string;
  title: string;
  description?: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
};

export function EditorEditModal({
  buttonLabel,
  title,
  description,
  submitLabel,
  action,
  children,
}: EditorEditModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" className="btn-primary" onClick={openModal}>
        {buttonLabel}
      </button>

      <dialog ref={dialogRef} className="editor-modal" aria-labelledby={titleId}>
        <form
          action={action}
          className="editor-modal-form"
          onSubmit={() => {
            closeModal();
          }}
        >
          <header className="space-y-1">
            <h3 id={titleId} className="font-title text-3xl text-(--brand-accent-2)">
              {title}
            </h3>
            {description ? <p className="subtle-text text-sm">{description}</p> : null}
          </header>

          <div className="space-y-2">{children}</div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {submitLabel}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
