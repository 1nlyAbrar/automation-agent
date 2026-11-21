"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";

const initialWorkflows = [
  { id: 1, name: "Lead Welcome Sequence", trigger: "New lead received", status: "Failed", active: true },
  { id: 2, name: "Qualified Lead Alert", trigger: "Lead qualified", status: "Completed", active: true },
  { id: 3, name: "Follow-up Reminder", trigger: "Daily 09:00", status: "Completed", active: true },
  { id: 4, name: "Weekly Report Builder", trigger: "Monday 08:00", status: "Pending", active: false },
];

const executionHistory = [
  { id: "ex_1048", workflow: "Lead Welcome Sequence", status: "Failed", start: "09:12", end: "09:12", duration: "1.4s", error: "SMTP not configured" },
  { id: "ex_1047", workflow: "Follow-up Reminder", status: "Completed", start: "09:00", end: "09:00", duration: "0.8s", error: "-" },
  { id: "ex_1046", workflow: "Qualified Lead Alert", status: "Completed", start: "Nov 3", end: "Nov 3", duration: "0.6s", error: "-" },
];

export default function Page() {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: "", trigger: "" });

  const toggleWorkflow = (id: number) => {
    setWorkflows(workflows.map(wf => 
      wf.id === id ? { ...wf, active: !wf.active } : wf
    ));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflow.name || !newWorkflow.trigger) return;

    const newEntry = {
      id: Date.now(),
      name: newWorkflow.name,
      trigger: newWorkflow.trigger,
      status: "Pending",
      active: false,
    };

    setWorkflows([...workflows, newEntry]);
    setIsModalOpen(false);
    setNewWorkflow({ name: "", trigger: "" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Workflows"
          description="Automations powered by n8n."
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          + New workflow
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: workflows.length.toString() },
          { label: "Active", value: workflows.filter(w => w.active).length.toString() },
          { label: "Failed runs", value: "3" },
          { label: "Pending", value: workflows.filter(w => w.status === "Pending").length.toString() },
        ].map((stat, i) => (
          <div key={i} className="glow-card rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mt-2 text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glow-card rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {workflows.map((wf) => (
            <div key={wf.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <div>
                <h3 className="font-semibold text-foreground">{wf.name}</h3>
                <p className="text-sm text-muted-foreground">Trigger: {wf.trigger}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  wf.status === "Failed" ? "bg-destructive/10 text-destructive" : 
                  wf.status === "Completed" ? "bg-emerald-100 text-emerald-700" : 
                  "bg-amber-100 text-amber-700"
                }`}>
                  {wf.status}
                </span>
                
                <button 
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${wf.active ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${wf.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-card rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <h2 className="font-semibold text-foreground">Execution history</h2>
        </div>
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="border-b border-border text-xs uppercase text-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Workflow</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Start</th>
              <th className="px-6 py-4 font-medium">End</th>
              <th className="px-6 py-4 font-medium">Duration</th>
              <th className="px-6 py-4 font-medium">Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {executionHistory.map((ex) => (
              <tr key={ex.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-muted-foreground">{ex.id}</td>
                <td className="px-6 py-4 font-medium text-foreground">{ex.workflow}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    ex.status === "Failed" ? "bg-destructive/10 text-destructive" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {ex.status}
                  </span>
                </td>
                <td className="px-6 py-4">{ex.start}</td>
                <td className="px-6 py-4">{ex.end}</td>
                <td className="px-6 py-4">{ex.duration}</td>
                <td className="px-6 py-4">{ex.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-border bg-secondary/30 text-sm text-muted-foreground">
          Troubleshooting: "SMTP not configured" - add SMTP details under Settings - Integrations.
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-card shadow-xl animate-in fade-in zoom-in-95 border border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">Create Workflow</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Workflow Name</label>
                <input 
                  type="text" 
                  required
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                  placeholder="e.g. Customer Re-engagement"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Trigger Event</label>
                <select 
                  value={newWorkflow.trigger}
                  onChange={(e) => setNewWorkflow({...newWorkflow, trigger: e.target.value})}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a trigger...</option>
                  <option value="New lead received">New lead received</option>
                  <option value="Lead qualified">Lead qualified</option>
                  <option value="Email opened">Email opened</option>
                  <option value="Daily 09:00">Daily 09:00</option>
                  <option value="Monday 08:00">Monday 08:00</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}