import Link from "next/link";
import { DEMO_FOLLOWUPS } from "@/lib/demo/overview";
import { StatusBadge, type BadgeTone } from "@/components/shared/status-badge";

const PRIORITY_TONE: Record<string, BadgeTone> = {
  High: "danger",
  Medium: "warning",
  Low: "neutral",
};

export function UpcomingFollowups() {
  return (
    <section className="glow-card rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center">
        <h2 className="flex-1 text-[15px] font-semibold">Upcoming follow-ups</h2>
        <Link href="/follow-ups"
          className="text-[13px] font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      {DEMO_FOLLOWUPS.map((f) => (
        <div key={f.id}
          className="flex items-center gap-3 border-b border-border py-3 last:border-0">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{f.customer}</p>
            <p className="text-xs text-muted-foreground">
              {f.when} Â· {f.type} Â· {f.status}
            </p>
          </div>
          <StatusBadge label={f.priority} tone={PRIORITY_TONE[f.priority]} />
        </div>
      ))}
    </section>
  );
}