"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";

// --- Initial Demo Data ---
const initialCampaigns = [
  { id: 1, name: "Autumn Offer", recipients: 120, sent: 120, delivered: 117, failed: 3, status: "Completed" },
  { id: 2, name: "Welcome Series", recipients: 48, sent: 48, delivered: 48, failed: 0, status: "Completed" },
  { id: 3, name: "Black Friday Teaser", recipients: 300, sent: 0, delivered: 0, failed: 0, status: "Scheduled" },
];

const templates = [
  { id: 1, name: "Welcome Email", subject: "Welcome to the family!", type: "Onboarding" },
  { id: 2, name: "Abandoned Cart", subject: "You left something behind...", type: "E-commerce" },
  { id: 3, name: "Monthly Newsletter", subject: "Here is what's new this month", type: "Newsletter" },
];

const sequences = [
  { id: 1, name: "New Lead Nurture", steps: 3, active: true, description: "Day 1: Welcome -> Day 3: Case Study -> Day 7: Book a call" },
  { id: 2, name: "Onboarding Flow", steps: 4, active: true, description: "Immediate: Login details -> Day 2: Tips -> Day 5: Check-in" },
  { id: 3, name: "Re-engagement", steps: 2, active: false, description: "Day 30: We miss you -> Day 35: Special offer" },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("Campaigns");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", recipients: "" });

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name) return;

    const newEntry = {
      id: Date.now(),
      name: newCampaign.name,
      recipients: parseInt(newCampaign.recipients) || 0,
      sent: 0,
      delivered: 0,
      failed: 0,
      status: "Scheduled",
    };

    setCampaigns([newEntry, ...campaigns]);
    setIsModalOpen(false);
    setNewCampaign({ name: "", recipients: "" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Email Automation"
          description="Campaigns, templates and sequences."
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          + New {activeTab === "Campaigns" ? "campaign" : activeTab === "Templates" ? "template" : "sequence"}
        </button>
      </div>

      <div className="flex space-x-1 rounded-lg bg-secondary/50 p-1 w-fit border border-border">
        {["Campaigns", "Templates", "Sequences"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Sent", value: "1,284" },
          { label: "Delivery rate", value: "97.1%" },
          { label: "Failure rate", value: "2.9%" },
          { label: "Open / reply", value: "n/a" },
        ].map((stat, i) => (
          <div key={i} className="glow-card rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {activeTab === "Campaigns" && (
        <div className="glow-card rounded-xl border border-border bg-card shadow-sm overflow-hidden animate-in fade-in">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="border-b border-border bg-secondary/30 text-xs uppercase text-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign</th>
                <th className="px-6 py-4 font-medium">Recipients</th>
                <th className="px-6 py-4 font-medium">Sent</th>
                <th className="px-6 py-4 font-medium">Delivered</th>
                <th className="px-6 py-4 font-medium">Failed</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{camp.name}</td>
                  <td className="px-6 py-4">{camp.recipients}</td>
                  <td className="px-6 py-4">{camp.sent}</td>
                  <td className="px-6 py-4">{camp.delivered}</td>
                  <td className="px-6 py-4">{camp.failed}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      camp.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : 
                      camp.status === "Scheduled" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Templates" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
          {templates.map((tpl) => (
            <div key={tpl.id} className="glow-card rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{tpl.name}</h3>
                  <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md">{tpl.type}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{tpl.subject}</p>
              </div>
              <button className="mt-4 w-full rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-secondary">
                Edit Template
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Sequences" && (
        <div className="space-y-4 animate-in fade-in">
          {sequences.map((seq) => (
            <div key={seq.id} className="glow-card rounded-xl border border-border bg-card p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground">{seq.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${seq.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                    {seq.active ? "Active" : "Draft"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{seq.description}</p>
              </div>
              <div className="text-sm font-medium text-foreground bg-secondary px-3 py-1.5 rounded-lg border border-border">
                {seq.steps} Steps
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-card shadow-xl animate-in fade-in zoom-in-95 border border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">Create New Campaign</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveCampaign} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  placeholder="e.g. Winter Sale"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Recipients (Estimated)</label>
                <input 
                  type="number" 
                  value={newCampaign.recipients}
                  onChange={(e) => setNewCampaign({...newCampaign, recipients: e.target.value})}
                  placeholder="e.g. 500"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
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
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}