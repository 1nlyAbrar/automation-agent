"use client";

import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  title,
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "md" | "lg";
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className={`m-auto w-[calc(100%-2rem)] ${
        size === "lg" ? "max-w-3xl" : "max-w-lg"
      } rounded-2xl border border-border bg-card p-0 text-card-foreground glow-modal backdrop:bg-black/40`}
    >
      <div className="max-h-[85vh] overflow-y-auto p-6">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
        {open && children}
      </div>
    </dialog>
  );
}