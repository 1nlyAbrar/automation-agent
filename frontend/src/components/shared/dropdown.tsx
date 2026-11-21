"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const menuItemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-primary";

export function Dropdown({
  label,
  trigger,
  align = "right",
  className,
  panelClassName,
  children,
}: {
  label: string;
  trigger: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  panelClassName?: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "glow-modal absolute top-full z-50 mt-2 min-w-56 rounded-xl border border-border bg-popover p-1.5",
            align === "right" ? "right-0" : "left-0",
            panelClassName
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}