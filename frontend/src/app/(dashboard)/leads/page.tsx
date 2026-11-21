"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";

type Lead = {
  id: number;
  lead_id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
};

export default function Page() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch leads from the database on page load
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads/get");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Failed to load leads", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });

      if (!res.ok) throw new Error("Failed to add lead");

      setIsModalOpen(false);
      setNewLead({ name: "", email: "", phone: "" });
      
      // Refresh the list to show the new lead from the database
      await fetchLeads();
    } catch (error) {
      console.error(error);
      alert("Failed to add lead. Check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Leads"
          description="Manage your potential customers."
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          + Add Lead
        </button>
      </div>

      <div className="glow-card rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase text-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Lead ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Loading leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No leads found. Click "+ Add Lead" to create one.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {lead.lead_id}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      lead.status === "New" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : 
                      lead.status === "Qualified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : 
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-card shadow-xl animate-in fade-in zoom-in-95 border border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">Add New Lead</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="e.g. john@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="e.g. 01712345678"
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
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}