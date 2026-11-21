"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildSeries, DEMO_TODAY } from "@/lib/demo/overview";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;
type RangeKey = "7" | "30" | "90" | "custom";

const PRESETS: { key: RangeKey; label: string }[] = [
  { key: "7", label: "Last 7 Days" },
  { key: "30", label: "Last 30 Days" },
  { key: "90", label: "Last 90 Days" },
  { key: "custom", label: "Custom" },
];

const toIso = (d: Date) => d.toISOString().slice(0, 10);
const fromIso = (s: string) => new Date(`${s}T00:00:00Z`);

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  boxShadow: "0 8px 24px -8px rgba(0,0,0,0.1)",
};
const axisTick = { fontSize: 12, fill: "var(--muted-foreground)" };

function ChartCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "glow-card rounded-2xl border border-border bg-card p-5",
        className
      )}
    >
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {subtitle && (
        <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>
      )}
      <div className="h-60 w-full">{children}</div>
    </section>
  );
}

export function AnalyticsCharts({ 
  sidePanel, 
  timeRange: externalRange 
}: { 
  sidePanel: React.ReactNode; 
  timeRange?: string;
}) {
  const [range, setRange] = useState<RangeKey>((externalRange as RangeKey) || "30");
  const [from, setFrom] = useState(
    toIso(new Date(DEMO_TODAY.getTime() - 29 * DAY))
  );
  const [to, setTo] = useState(toIso(DEMO_TODAY));

  const { data, error, label, totalLeads } = useMemo(() => {
    const fallback = new Date(DEMO_TODAY.getTime() - 29 * DAY);
    let start = fallback;
    let end = DEMO_TODAY;
    let error = "";

    const activeRange = externalRange || range;

    if (activeRange === "custom") {
      const s = fromIso(from);
      const e = fromIso(to);
      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || s > e) {
        error = "Choose a start date that is on or before the end date.";
      } else if ((e.getTime() - s.getTime()) / DAY > 365) {
        error = "Custom ranges are limited to one year.";
      } else {
        start = s;
        end = e;
      }
    } else {
      start = new Date(DEMO_TODAY.getTime() - (Number(activeRange) - 1) * DAY);
    }

    const data = buildSeries(start, end);
    return {
      data,
      error,
      label: `${toIso(start)} to ${toIso(end)}`,
      totalLeads: data.reduce((sum, p) => sum + p.leads, 0),
    };
  }, [range, externalRange, from, to]);

  const inputClass =
    "rounded-[10px] border border-border bg-card px-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <div>
      {/* Time Range Buttons */}
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => setRange(preset.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors border",
              range === preset.key
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="flex-1 text-lg font-semibold tracking-tight">
          Analytics &amp; performance
        </h2>
        
        {range === "custom" && !externalRange && (
          <div className="flex items-center gap-2 text-sm">
            <label className="sr-only" htmlFor="from">From</label>
            <input id="from" type="date" value={from} max={to}
              onChange={(e) => setFrom(e.target.value)} className={inputClass} />
            <span className="text-muted-foreground">to</span>
            <label className="sr-only" htmlFor="to">To</label>
            <input id="to" type="date" value={to} min={from}
              max={toIso(DEMO_TODAY)}
              onChange={(e) => setTo(e.target.value)} className={inputClass} />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {error} Showing the last 30 days instead.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Lead generation"
          subtitle={`${totalLeads} demo leads - ${label}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="leads" name="New leads"
                stroke="#4f46e5" strokeWidth={2.5} fill="url(#leadFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        {sidePanel}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ChartCard title="Conversion rate" subtitle="Share of new leads that converted (demo)">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} unit="%" />
              <Tooltip contentStyle={tooltipStyle}
                formatter={(value) => `${Number(value).toFixed(1)}%`} />
              <Line type="monotone" dataKey="conversion" name="Conversion"
                stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Email performance"
          subtitle="Open and reply rates need provider tracking (not configured)">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="delivered" name="Delivered" stackId="e" fill="#10b981" />
              <Bar dataKey="failed" name="Failed" stackId="e" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}