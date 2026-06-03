"use client";

type ConfirmSubmitButtonProps = {
  label: string;
  confirmMessage: string;
  className?: string;
};

export function ConfirmSubmitButton({
  label,
  confirmMessage,
  className = "btn-ghost",
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        const accepted = window.confirm(confirmMessage);
        if (!accepted) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
