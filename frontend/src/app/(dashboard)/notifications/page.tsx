"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";

const initialNotifications = [
  { id: 1, title: "New lead: Amelia Hart added", category: "New Lead Alerts", time: "2h ago", read: false },
  { id: 2, title: "Campaign \"Autumn Offer\" finished sending", category: "Email Status", time: "5h ago", read: false },
  { id: 3, title: "Follow-up due: Marcus Cole at 3:00 PM", category: "Follow-up Reminders", time: "Today", read: false },
  { id: 4, title: "Workflow \"Lead Welcome Sequence\" failed", category: "Workflow Failures", time: "Yesterday", read: false },
  { id: 5, title: "Weekly report is ready", category: "Report Alerts", time: "Yesterday", read: true },
  { id: 6, title: "New lead: Rafi Ahmed added", category: "New Lead Alerts", time: "2d ago", read: true },
];

export default function Page() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "Unread") return !n.read;
    if (filter === "Read") return n.read;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Notifications"
          description="Stay on top of what matters."
        />
        <button 
          onClick={markAllAsRead}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
        >
          <span>✓</span> Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {["All", "Unread", "Read"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === tab
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden glow-card">
        <div className="divide-y divide-border">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No {filter.toLowerCase()} notifications to show.
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div key={n.id} className={`p-4 flex items-center justify-between transition-colors ${n.read ? 'bg-secondary/20' : 'bg-card hover:bg-secondary/50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-primary'}`} />
                  
                  <div>
                    <h3 className={`text-sm ${n.read ? 'text-muted-foreground font-normal' : 'text-foreground font-semibold'}`}>
                      {n.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.category} · {n.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!n.read && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
