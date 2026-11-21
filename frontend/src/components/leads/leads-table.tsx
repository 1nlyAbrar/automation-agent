"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search, Trash2, Upload } from "lucide-react";
import { DemoBanner, PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/shared/modal";
import { StatusBadge, type BadgeTone } from "@/components/shared/status-badge";
import { ImportDialog } from "./import-dialog";
import { LeadDetail } from "./lead-detail";
import { LeadForm } from "./lead-form";
import { downloadCsv, toCsv } from "@/lib/csv";
import { DEMO_LEADS } from "@/lib/demo/leads";
import { normalizeEmail, type LeadFormValues } from "@/lib/validation/lead";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
  type LeadStatus,
} from "@/types/lead";

const PAGE_SIZE = 8;
const STATUS_TONE: Record<LeadStatus, BadgeTone> = {
  New: "neutral",
  Qualified: "primary",
  Contacted: "warning",
  Interested: "primary",
  Converted: "success",
  Rejected: "danger",
};

const controlClass =
  "rounded-[10px] border border-border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary";
const secondaryBtn =
  "inline-flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50";

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [notesById, setNotesById] = useState<Record<string, string[]>>({});
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"newest" | "score">("newest");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Lead | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const selected = leads.find((l) => l.id === selectedId) ?? null;
  const existingEmails = useMemo(
    () => new Set(leads.map((l) => normalizeEmail(l.email))),
    [leads]
  );
  const dateInvalid = from !== "" && to !== "" && from > to;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .filter(
        (l) =>
          (status === "all" || l.status === status) &&
          (source === "all" || l.source === source) &&
          (!from || dateInvalid || l.createdAt >= from) &&
          (!to || dateInvalid || l.createdAt <= to) &&
          (!q || [l.name, l.email, l.business].some((v) => v.toLowerCase().includes(q)))
      )
      .sort((a, b) =>
        sort === "score" ? b.score - a.score : b.createdAt.localeCompare(a.createdAt)
      );
  }, [leads, query, status, source, from, to, dateInvalid, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const filtersActive =
    query !== "" || status !== "all" || source !== "all" || from !== "" || to !== "";

  const resetPage = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setSource("all");
    setFrom("");
    setTo("");
    setPage(1);
  };

  const addLead = (v: LeadFormValues): string | null => {
    const email = normalizeEmail(v.email);
    const dupe = leads.find((l) => normalizeEmail(l.email) === email);
    if (dupe) return `A lead with this email already exists (${dupe.name}).`;
    setLeads((prev) => [
      {
        id: crypto.randomUUID(),
        name: v.name,
        business: v.business || "-",
        email,
        phone: v.phone,
        website: v.website,
        category: v.category,
        source: v.source,
        service: v.service,
        message: v.message,
        score: 50,
        status: "New",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setAdding(false);
    setNotice(`${v.name} added (demo only, not saved).`);
    return null;
  };

  const importLeads = (incoming: Lead[]) => {
    setLeads((prev) => [...incoming, ...prev]);
    setImporting(false);
    setNotice(`Imported ${incoming.length} lead${incoming.length === 1 ? "" : "s"} (demo only, not saved).`);
  };

  const exportCsv = () => {
    const header = ["Name", "Business", "Email", "Phone", "Website", "Category", "Source", "Service", "Score", "Status", "Created"];
    const body = filtered.map((l) => [
      l.name, l.business, l.email, l.phone, l.website, l.category,
      l.source, l.service, String(l.score), l.status, l.createdAt,
    ]);
    downloadCsv(`leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([header, ...body]));
    setNotice(`Exported ${filtered.length} lead${filtered.length === 1 ? "" : "s"}.`);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setLeads((prev) => prev.filter((l) => l.id !== toDelete.id));
    setNotice(`${toDelete.name} deleted.`);
    setToDelete(null);
  };

  return (
    <>
      <PageHeader title="Leads" description="Capture, qualify and convert your leads.">
        <button type="button" onClick={exportCsv} disabled={filtered.length === 0} className={secondaryBtn}>
          <Download className="size-4" /> Export CSV
        </button>
        <button type="button" onClick={() => setImporting(true)} className={secondaryBtn}>
          <Upload className="size-4" /> Import CSV
        </button>
        <button type="button" onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Plus className="size-4" /> Add lead
        </button>
      </PageHeader>
      <DemoBanner />

      <p aria-live="polite" className="mb-2 h-5 text-sm font-medium text-success">{notice}</p>

      <section className="glow-card rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="relative min-w-56 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="search" value={query} aria-label="Search leads"
              onChange={(e) => resetPage(setQuery)(e.target.value)}
              placeholder="Search name, email or business"
              className={`${controlClass} w-full pl-9`} />
          </div>
          <select value={status} aria-label="Filter by status" className={controlClass}
            onChange={(e) => resetPage(setStatus)(e.target.value)}>
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={source} aria-label="Filter by source" className={controlClass}
            onChange={(e) => resetPage(setSource)(e.target.value)}>
            <option value="all">All sources</option>
            {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="from" className="text-muted-foreground">Created</label>
            <input id="from" type="date" value={from} max={to || undefined} className={controlClass}
              onChange={(e) => resetPage(setFrom)(e.target.value)} />
            <span className="text-muted-foreground">to</span>
            <label htmlFor="to" className="sr-only">Created to</label>
            <input id="to" type="date" value={to} min={from || undefined} className={controlClass}
              onChange={(e) => resetPage(setTo)(e.target.value)} />
          </div>
          <select value={sort} aria-label="Sort leads" className={controlClass}
            onChange={(e) => setSort(e.target.value as "newest" | "score")}>
            <option value="newest">Newest first</option>
            <option value="score">Highest score</option>
          </select>
          {filtersActive && (
            <button type="button" onClick={clearFilters}
              className="text-sm font-medium text-primary hover:underline">
              Clear filters
            </button>
          )}
        </div>
        {dateInvalid && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            The start date is after the end date, so the date filter is ignored.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {["Lead", "Business", "Source", "Service", "Score", "Status", "Created", ""].map((h, i) => (
                  <th key={i} scope="col" className="whitespace-nowrap px-3 py-2 font-medium">
                    {h || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-background">
                  <td className="whitespace-nowrap px-3 py-3">
                    <button type="button" onClick={() => setSelectedId(l.id)}
                      className="text-left font-medium hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
                      {l.name}
                    </button>
                    <div className="text-xs text-muted-foreground">{l.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{l.business}</td>
                  <td className="whitespace-nowrap px-3 py-3">{l.source}</td>
                  <td className="whitespace-nowrap px-3 py-3">{l.service}</td>
                  <td className="px-3 py-3 font-semibold">{l.score}</td>
                  <td className="px-3 py-3"><StatusBadge label={l.status} tone={STATUS_TONE[l.status]} /></td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{l.createdAt}</td>
                  <td className="px-3 py-3 text-right">
                    <button type="button" onClick={() => setToDelete(l)} aria-label={`Delete ${l.name}`}
                      className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive focus-visible:outline-2 focus-visible:outline-primary">
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center text-muted-foreground">
                    No leads match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} lead{filtered.length === 1 ? "" : "s"}</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={current <= 1} onClick={() => setPage(current - 1)}
              className="rounded-lg border border-border px-3 py-1 transition-colors hover:border-primary hover:text-primary disabled:opacity-40">
              Previous
            </button>
            <span>Page {current} of {pages}</span>
            <button type="button" disabled={current >= pages} onClick={() => setPage(current + 1)}
              className="rounded-lg border border-border px-3 py-1 transition-colors hover:border-primary hover:text-primary disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </section>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add lead">
        <LeadForm onSubmit={addLead} onCancel={() => setAdding(false)} />
      </Modal>

      <Modal open={importing} onClose={() => setImporting(false)} title="Import leads from CSV" size="lg">
        <ImportDialog existingEmails={existingEmails} onImport={importLeads} onClose={() => setImporting(false)} />
      </Modal>

      <Modal open={!!selected} onClose={() => setSelectedId(null)} title={selected?.name ?? "Lead details"} size="lg">
        {selected && (
          <LeadDetail
            lead={selected}
            notes={notesById[selected.id] ?? []}
            onStatus={(s) => {
              setLeads((prev) => prev.map((l) => (l.id === selected.id ? { ...l, status: s } : l)));
              setNotice(`${selected.name} marked ${s}.`);
            }}
            onAddNote={(text) =>
              setNotesById((prev) => ({ ...prev, [selected.id]: [text, ...(prev[selected.id] ?? [])] }))
            }
            onClose={() => setSelectedId(null)}
          />
        )}
      </Modal>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete this lead?">
        <p className="text-sm text-muted-foreground">
          {toDelete?.name} will be removed. This can&apos;t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setToDelete(null)} className={secondaryBtn}>
            Cancel
          </button>
          <button type="button" onClick={confirmDelete}
            className="rounded-[10px] bg-destructive px-4 py-2 text-sm font-medium text-white transition hover:brightness-110">
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}