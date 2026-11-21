import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { UpcomingFollowups } from "@/components/dashboard/upcoming-followups";
import { WorkflowHealth } from "@/components/dashboard/workflow-health";
import { PageHeader } from "@/components/layout/page-header";

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Good morning, Alex"
        description="Here's how your business looks today."
      />
      
      <KpiGrid />
      <div className="mt-8">
        <AnalyticsCharts sidePanel={<WorkflowHealth />} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ActivityFeed />
        <UpcomingFollowups />
      </div>
    </>
  );
}
