"use client";

import { useState } from "react";
import { StatusBadge, type BadgeTone } from "@/components/shared/status-badge";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/types/lead";

const STATUS_TONE: Record<LeadStatus, BadgeTone> = {
  New: "neutral",
  Qualified: "primary",
  Contacted: "warning",
  Interested: "primary",
  Converted: "success",
  Rejected: "danger",
};

const fieldClass =
  "w-full rounded-[10px] border border-border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-primary";

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{value || "-"}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export function LeadDetail({
  lead,
  notes,
  onStatus,
  onAddNote,
  onClose,
}: {
  lead: Lead;
  notes: string[];
  onStatus: (status: LeadStatus) => void;
  onAddNote: (text: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="flex-1 text-sm text-muted-foreground">
          {lead.name}
          {lead.business && lead.business !== "-" ? ` Â· ${lead.business}` : ""}
        </p>
        <StatusBadge label={lead.status} tone={STATUS_TONE[lead.status]} />
        <StatusBadge label={`Score ${lead.score}`} />
      </div>

      <Section title="Contact profile">
        <dl className="grid gap-3 sm:grid-cols-2">
          <Info label="Full name" value={lead.name} />
          <Info label="Email" value={lead.email} />
          <Info label="Phone" value={lead.phone} />
          <Info label="Website" value={lead.website} />
        </dl>
      </Section>

      <Section title="Business information">
        <dl className="grid gap-3 sm:grid-cols-2">
          <Info label="Business" value={lead.business} />
          <Info label="Category" value={lead.category} />
          <Info label="Lead source" value={lead.source} />
          <Info label="Interested service" value={lead.service} />
        </dl>
        {lead.message && (
          <p className="mt-3 rounded-[10px] bg-muted p-3 text-sm">{lead.message}</p>
        )}
      </Section>

      <Section title="Status">
        <label htmlFor="lead-status" className="sr-only">Lead status</label>
        <select
          id="lead-status"
          value={lead.status}
          onChange={(e) => onStatus(e.target.value as LeadStatus)}
          className={`${fieldClass} sm:max-w-56`}
        >
          {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Section>

      <Section title="Interaction history">
        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex gap-2">
            <span className="text-muted-foreground">{lead.createdAt}</span>
            <span>Lead captured via {lead.source}</span>
          </li>
        </ul>
      </Section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <section>
          <h3 className="mb-2 text-sm font-semibold">Email history</h3>
          <p className="rounded-[10px] border border-dashed border-border p-3 text-sm text-muted-foreground">
            No emails recorded yet. Sent emails will appear here once email
            automation is connected.
          </p>
        </section>
        <section>
          <h3 className="mb-2 text-sm font-semibold">Follow-up history</h3>
          <p className="rounded-[10px] border border-dashed border-border p-3 text-sm text-muted-foreground">
            No follow-ups yet. Scheduled follow-ups will appear here.
          </p>
        </section>
      </div>

      <Section title="Notes">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const text = draft.trim();
            if (!text) return;
            onAddNote(text);
            setDraft("");
          }}
        >
          <label htmlFor="lead-note" className="sr-only">Add a note</label>
          <input
            id="lead-note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a note"
            maxLength={500}
            className={fieldClass}
          />
          <button type="submit"
            className="rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-sm transition hover:brightness-110">
            Add
          </button>
        </form>
        <ul className="mt-3 flex flex-col gap-2">
          {notes.map((n, i) => (
            <li key={i} className="rounded-[10px] bg-muted px-3 py-2 text-sm">{n}</li>
          ))}
          {notes.length === 0 && (
            <li className="text-sm text-muted-foreground">No notes yet.</li>
          )}
        </ul>
      </Section>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onClose}
          className="rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
          Close
        </button>
      </div>
    </div>
  );
}