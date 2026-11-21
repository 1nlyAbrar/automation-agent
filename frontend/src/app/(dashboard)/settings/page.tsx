"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";

export default function Page() {
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <PageHeader
        title="Settings"
        description="Profile, business and integrations."
      />

      <div className="space-y-6">
        {/* Top Row: Profile & Business */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Card */}
          <div className="glow-card rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full name</label>
                <input 
                  type="text" 
                  defaultValue="Alex Karim"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input 
                  type="email" 
                  defaultValue="alex@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Save changes
              </button>
            </form>
          </div>

          {/* Business Card */}
          <div className="glow-card rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">Business</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Business name</label>
                <input 
                  type="text" 
                  defaultValue="Northwind Digital"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Website</label>
                <input 
                  type="url" 
                  defaultValue="https://example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Save changes
              </button>
            </form>
          </div>
        </div>

        {/* Integrations */}
        <div className="glow-card rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold text-foreground">Integrations</h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { name: "Google Sheets", desc: "Import and export leads" },
              { name: "Email / SMTP", desc: "Send campaigns and sequences" },
              { name: "n8n Connection", desc: "Run workflows" },
              { name: "FastAPI Backend", desc: "Application API" },
              { name: "AI Model", desc: "Reports and assistant" },
            ].map((integration) => (
              <div key={integration.name} className="p-4 px-6 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{integration.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    Not configured
                  </span>
                  <button className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors shadow-sm">
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Security & Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Security Card */}
          <div className="glow-card rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Two-factor authentication</span>
                <button 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-foreground">Change password</span>
                <button className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors shadow-sm">
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Data Card */}
          <div className="glow-card rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">Data</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-foreground">Export all data</span>
              <button className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors shadow-sm">
                Export
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Retention policy will be set once the backend is live.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}