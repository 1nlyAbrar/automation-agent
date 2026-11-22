"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { WorkflowHealth } from "@/components/dashboard/workflow-health";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { UpcomingFollowups } from "@/components/dashboard/upcoming-followups";

export default function Page() {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <PageHeader
        title="Good morning, Abrar"
        description="Here's how your business looks today."
      />

      {/* Interactive Time Range Filter */}
      <div className="flex justify-end gap-1 rounded-lg border border-border bg-card p-1 w-fit ml-auto shadow-sm">
        {[
          { key: "7", label: "Last 7 Days" },
          { key: "30", label: "Last 30 Days" },
          { key: "90", label: "Last 90 Days" },
        ].map((range) => (
          <button
            key={range.key}
            onClick={() => setTimeRange(range.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              timeRange === range.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Top Stats */}
      <KpiGrid />

      {/* Charts & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsCharts timeRange={timeRange} sidePanel={<WorkflowHealth />} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <WorkflowHealth />
          <ActivityFeed />
          <UpcomingFollowups />
        </div>
      </div>
    </div>
  );
}