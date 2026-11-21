// DEMO DATA ONLY. Replaced by backend API responses in a later stage.
export const DEMO_KPIS = [
  { key: "total", label: "Total Leads", value: "10", change: 12.4 },
  { key: "new", label: "New Leads", value: "2", change: 8.1 },
  { key: "qualified", label: "Qualified Leads", value: "2", change: 3.0 },
  { key: "converted", label: "Converted Customers", value: "2", change: -2.5 },
  { key: "emails", label: "Emails Sent", value: "1,284", change: 18.2 },
  { key: "followups", label: "Pending Follow-ups", value: "5", change: null },
] as const;

const DAY = 86_400_000;
export const DEMO_TODAY = new Date(Date.UTC(2026, 10, 4));

export type SeriesPoint = {
  label: string;
  leads: number;
  conversion: number;
  sent: number;
  delivered: number;
  failed: number;
};

// Deterministic (no Math.random) so server and browser always agree.
function dayValues(m: number) {
  const leads = Math.max(
    1,
    Math.round(4 + 2 * Math.sin(m * 1.3) + 1.5 * Math.cos(m * 0.5))
  );
  const sent = Math.max(
    5,
    Math.round(30 + 12 * Math.sin(m * 0.9) + 8 * Math.cos(m * 0.4))
  );
  const failed = Math.round(sent * 0.03) + (m % 7 === 0 ? 1 : 0);
  const converted = Math.max(
    0,
    Math.round(leads * 0.22 + 0.6 * Math.sin(m * 2.1))
  );
  return { leads, sent, failed, converted };
}

export function buildSeries(start: Date, end: Date): SeriesPoint[] {
  const first = Math.floor(start.getTime() / DAY);
  const last = Math.floor(end.getTime() / DAY);
  const days = Math.max(1, last - first + 1);
  const step = Math.ceil(days / 30);
  const points: SeriesPoint[] = [];

  for (let i = 0; i < days; i += step) {
    let leads = 0;
    let sent = 0;
    let failed = 0;
    let converted = 0;
    for (let j = i; j < Math.min(i + step, days); j++) {
      const v = dayValues(first + j);
      leads += v.leads;
      sent += v.sent;
      failed += v.failed;
      converted += v.converted;
    }
    points.push({
      label: new Date((first + i) * DAY).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      leads,
      conversion: leads > 0 ? Math.round((converted / leads) * 1000) / 10 : 0,
      sent,
      delivered: sent - failed,
      failed,
    });
  }
  return points;
}

export const DEMO_ACTIVITY = [
  { id: "a1", type: "lead", text: "New lead added: Amelia Hart", time: "2 hours ago" },
  { id: "a2", type: "email", text: "Email sent: Autumn Offer to 120 leads", time: "5 hours ago" },
  { id: "a3", type: "status", text: "Lead status updated: Marcus Cole to Interested", time: "Yesterday" },
  { id: "a4", type: "followup", text: "Follow-up completed: Priya Nair", time: "Yesterday" },
  { id: "a5", type: "workflow", text: "Workflow executed: Follow-up Reminder", time: "Yesterday" },
  { id: "a6", type: "report", text: "Report generated: Weekly summary", time: "2 days ago" },
] as const;

export const DEMO_FOLLOWUPS = [
  { id: "f1", customer: "Marcus Cole", when: "Today, 3:00 PM", type: "Call", priority: "High", status: "Scheduled" },
  { id: "f2", customer: "Nadia Rahman", when: "Tomorrow, 11:00 AM", type: "Email", priority: "Medium", status: "Scheduled" },
  { id: "f3", customer: "Sara Khan", when: "Nov 7, 2:30 PM", type: "Meeting", priority: "Medium", status: "Scheduled" },
  { id: "f4", customer: "Hiro Tanaka", when: "Nov 9, 10:00 AM", type: "Call", priority: "Low", status: "Scheduled" },
] as const;

export const DEMO_WORKFLOW_STATS = {
  active: 3,
  successful: 142,
  failed: 3,
  pending: 2,
};