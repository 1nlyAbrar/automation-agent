"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { StatusBadge, type BadgeTone } from "@/components/shared/status-badge";
import { downloadCsv, parseCsv, toCsv } from "@/lib/csv";
import { normalizeEmail } from "@/lib/validation/lead";
import {
  LEAD_SERVICES,
  LEAD_SOURCES,
  type Lead,
  type LeadService,
  type LeadSource,
} from "@/types/lead";

const MAX_BYTES = 1_000_000;
const MAX_ROWS = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = "name" | "email" | "business" | "phone" | "source" | "service";

const FIELDS: { key: FieldKey; label: string; required?: boolean; aliases: string[] }[] = [
  { key: "name", label: "Full name", required: true, aliases: ["name", "fullname", "contact", "contactname", "leadname"] },
  { key: "email", label: "Email", required: true, aliases: ["email", "emailaddress", "mail"] },
  { key: "business", label: "Business", aliases: ["business", "businessname", "company", "organization"] },
  { key: "phone", label: "Phone", aliases: ["phone", "phonenumber", "mobile", "tel"] },
  { key: "source", label: "Lead source", aliases: ["source", "leadsource"] },
  { key: "service", label: "Interested service", aliases: ["service", "interestedservice", "interest"] },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

function autoMap(header: string[]): Record<FieldKey, number> {
  const normalized = header.map(norm);
  const map = {} as Record<FieldKey, number>;
  for (const f of FIELDS) {
    map[f.key] = normalized.findIndex((h) => f.aliases.includes(h));
  }
  return map;
}

type RowState = "ok" | "duplicate" | "error";
type Analyzed = {
  line: number;
  name: string;
  email: string;
  business: string;
  phone: string;
  source: LeadSource;
  service: LeadService;
  state: RowState;
  reason: string;
};

const TONE: Record<RowState, BadgeTone> = { ok: "success", duplicate: "warning", error: "danger" };
const LABEL: Record<RowState, string> = { ok: "Ready", duplicate: "Duplicate", error: "Error" };

const matchOption = <T extends string>(list: readonly T[], v: string): T | undefined =>
  list.find((o) => o.toLowerCase() === v.trim().toLowerCase());

const selectClass =
  "w-full rounded-[10px] border border-border bg-card px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-primary";

export function ImportDialog({
  existingEmails,
  onImport,
  onClose,
}: {
  existingEmails: Set<string>;
  onImport: (leads: Lead[]) => void;
  onClose: () => void;
}) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [table, setTable] = useState<string[][] | null>(null);
  const [map, setMap] = useState<Record<FieldKey, number>>(() => autoMap([]));

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setError("");
    setTable(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a .csv file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("This file is larger than 1 MB. Split it into smaller files.");
      return;
    }
    const rows = parseCsv(await file.text());
    if (rows.length < 2) {
      setError("The file needs a header row and at least one data row.");
      return;
    }
    if (rows.length - 1 > MAX_ROWS) {
      setError(`This file has more than ${MAX_ROWS} rows. Split it into smaller files.`);
      return;
    }
    setFileName(file.name);
    setTable(rows);
    setMap(autoMap(rows[0]));
  }

  const analysis = useMemo<Analyzed[]>(() => {
    if (!table) return [];
    const seen = new Set<string>();
    const get = (cells: string[], k: FieldKey) =>
      map[k] >= 0 ? (cells[map[k]] ?? "").trim() : "";

    return table.slice(1).map((cells, i) => {
      const name = get(cells, "name");
      const email = normalizeEmail(get(cells, "email"));
      const rawSource = get(cells, "source");
      const rawService = get(cells, "service");
      let state: RowState = "ok";
      let reason = "";

      if (!name) {
        state = "error";
        reason = "Name is missing.";
      } else if (!EMAIL_RE.test(email)) {
        state = "error";
        reason = "Email is missing or invalid.";
      } else if (existingEmails.has(email)) {
        state = "duplicate";
        reason = "A lead with this email already exists.";
      } else if (seen.has(email)) {
        state = "duplicate";
        reason = "Email appears earlier in this file.";
      } else {
        seen.add(email);
      }

      return {
        line: i + 2,
        name,
        email,
        business: get(cells, "business"),
        phone: get(cells, "phone"),
        source: matchOption(LEAD_SOURCES, rawSource) ?? "Manual",
        service: matchOption(LEAD_SERVICES, rawService) ?? "Other",
        state,
        reason,
      };
    });
  }, [table, map, existingEmails]);

  const ready = analysis.filter((r) => r.state === "ok");
  const problems = analysis.filter((r) => r.state !== "ok");
  const mapped = map.name >= 0 && map.email >= 0;

  function downloadReport() {
    downloadCsv(
      "import-problems.csv",
      toCsv([
        ["Row", "Name", "Email", "Problem"],
        ...problems.map((r) => [String(r.line), r.name, r.email, r.reason]),
      ])
    );
  }

  function confirm() {
    const today = new Date().toISOString().slice(0, 10);
    onImport(
      ready.map((r) => ({
        id: crypto.randomUUID(),
        name: r.name,
        business: r.business || "-",
        email: r.email,
        phone: r.phone,
        website: "",
        category: "",
        source: r.source,
        service: r.service,
        message: "",
        score: 50,
        status: "New" as const,
        createdAt: today,
      }))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="csv-file"
          className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-dashed border-primary bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          <Upload className="size-4" />
          <span>{fileName || "Choose a CSV file (max 1 MB)"}</span>
        </label>
        <input id="csv-file" type="file" accept=".csv,text/csv" onChange={handleFile} className="sr-only" />
        <p className="mt-2 text-xs text-muted-foreground">
          Needs a header row with at least name and email columns. Unrecognised
          sources become &quot;Manual&quot; and unrecognised services become &quot;Other&quot;.
        </p>
        {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      {table && (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Column mapping</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`map-${f.key}`} className="mb-1 block text-xs font-medium">
                    {f.label}{f.required ? " *" : ""}
                  </label>
                  <select id={`map-${f.key}`} value={map[f.key]} className={selectClass}
                    onChange={(e) => setMap({ ...map, [f.key]: Number(e.target.value) })}>
                    <option value={-1}>Not in file</option>
                    {table[0].map((h, i) => (
                      <option key={i} value={i}>{h || `Column ${i + 1}`}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {!mapped && (
              <p role="alert" className="mt-2 text-sm text-destructive">
                Map both the name and email columns to continue.
              </p>
            )}
          </fieldset>

          <div className="flex flex-wrap gap-2 text-sm">
            <StatusBadge label={`${ready.length} ready`} tone="success" />
            <StatusBadge label={`${problems.filter((r) => r.state === "duplicate").length} duplicates`} tone="warning" />
            <StatusBadge label={`${problems.filter((r) => r.state === "error").length} errors`} tone="danger" />
          </div>

          <div className="overflow-x-auto rounded-[10px] border border-border">
            <table className="w-full text-sm">
              <caption className="sr-only">Import preview (first 6 rows)</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-3 py-2 font-medium">Row</th>
                  <th scope="col" className="px-3 py-2 font-medium">Name</th>
                  <th scope="col" className="px-3 py-2 font-medium">Email</th>
                  <th scope="col" className="px-3 py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {analysis.slice(0, 6).map((r) => (
                  <tr key={r.line} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">{r.line}</td>
                    <td className="px-3 py-2">{r.name || "-"}</td>
                    <td className="px-3 py-2">{r.email || "-"}</td>
                    <td className="px-3 py-2">
                      <StatusBadge label={LABEL[r.state]} tone={TONE[r.state]} />
                      {r.reason && <span className="ml-2 text-xs text-muted-foreground">{r.reason}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {analysis.length > 6 && (
            <p className="text-xs text-muted-foreground">
              Showing the first 6 of {analysis.length} rows.
            </p>
          )}
        </>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        {problems.length > 0 && (
          <button type="button" onClick={downloadReport}
            className="rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
            Download problem report
          </button>
        )}
        <button type="button" onClick={onClose}
          className="rounded-[10px] border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
          Cancel
        </button>
        <button type="button" onClick={confirm} disabled={!mapped || ready.length === 0}
          className="rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-sm transition hover:brightness-110 disabled:opacity-50">
          Import {ready.length} lead{ready.length === 1 ? "" : "s"}
        </button>
      </div>
    </div>
  );
}