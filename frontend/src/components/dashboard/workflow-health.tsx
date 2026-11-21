import { DEMO_WORKFLOW_STATS as s } from "@/lib/demo/overview";
import { StatusBadge } from "@/components/shared/status-badge";

export function WorkflowHealth() {
  const healthy = s.failed === 0;
  const rows = [
    { label: "Active workflows", value: s.active, cls: "" },
    { label: "Successful executions", value: s.successful, cls: "text-success" },
    { label: "Failed executions", value: s.failed, cls: "text-destructive" },
    { label: "Pending executions", value: s.pending, cls: "" },
  ];
  return (
    <section className="glow-card rounded-2xl border border-border bg-card p-5">
      <h2 className="text-[15px] font-semibold">Workflow health</h2>
      <div className="my-3">
        <StatusBadge
          label={healthy ? "✓ All systems healthy" : "✓ Attention needed"}
          tone={healthy ? "success" : "warning"}
        />
      </div>
      {rows.map((r) => (
        <div key={r.label}
          className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-0">
          <span>{r.label}</span>
          <b className={r.cls}>{r.value}</b>
        </div>
      ))}
    </section>
  );
}