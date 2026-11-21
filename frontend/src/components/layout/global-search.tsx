"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

// Searches pages for now. Searching records (leads, campaigns) arrives with the backend.
export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? NAV_ITEMS.filter((n) => n.label.toLowerCase().includes(q)) : [];
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (href: string) => {
    router.push(href);
    setQuery("");
    setOpen(false);
  };

  const showPanel = open && query.trim() !== "";

  return (
    <div ref={ref} className="relative hidden w-64 md:block lg:w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        role="combobox"
        aria-label="Search pages"
        aria-expanded={showPanel}
        aria-controls="global-search-results"
        aria-autocomplete="list"
        placeholder="Search pages"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setIndex((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && results[index]) {
            go(results[index].href);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className="glow-sm w-full rounded-[10px] border border-border bg-card py-2 pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
      />
      {showPanel && (
        <ul
          id="global-search-results"
          role="listbox"
          className="glow-modal absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-popover p-1.5"
        >
          {results.map((r, i) => (
            <li key={r.href} role="option" aria-selected={i === index}>
              <button
                type="button"
                onClick={() => go(r.href)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  i === index ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary"
                )}
              >
                <r.icon className="size-4 text-primary" />
                {r.label}
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">No pages match.</li>
          )}
        </ul>
      )}
    </div>
  );
}