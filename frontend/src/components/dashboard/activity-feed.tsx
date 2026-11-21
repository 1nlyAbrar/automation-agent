import {
  CheckCheck,
  FileText,
  RefreshCw,
  Send,
  UserPlus,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { DEMO_ACTIVITY } from "@/lib/demo/overview";

const ICONS: Record<string, LucideIcon> = {
  lead: UserPlus,
  email: Send,
  status: RefreshCw,
  followup: CheckCheck,
  workflow: Workflow,
  report: FileText,
};

export function ActivityFeed() {
  return (
    <section className="glow-card rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-[15px] font-semibold">Recent activity</h2>
      <ul className="flex flex-col gap-4">
        {DEMO_ACTIVITY.map((a) => {
          const Icon = ICONS[a.type];
          return (
            <li key={a.id} className="flex items-start gap-3">
              <div className="grid size-8 flex-none place-items-center rounded-[10px] bg-secondary text-primary">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}