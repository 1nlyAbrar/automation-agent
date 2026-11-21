import { Users, UserPlus, CheckCircle, Home, Mail, Calendar } from "lucide-react";

const kpis = [
  { label: "Total Leads", value: "10", trend: "+12.4%", isUp: true, icon: Users },
  { label: "New Leads", value: "2", trend: "+8.1%", isUp: true, icon: UserPlus },
  { label: "Qualified Leads", value: "2", trend: "+3%", isUp: true, icon: CheckCircle },
  { label: "Converted Customers", value: "2", trend: "-4.2%", isUp: false, icon: Home },
  { label: "Emails Sent", value: "1,284", trend: "+18.2%", isUp: true, icon: Mail },
  { label: "Pending Follow-ups", value: "5", trend: "+2", isUp: true, icon: Calendar },
];

export function KpiGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <kpi.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-sm font-medium ${
                kpi.isUp ? "text-yellow-500 dark:text-[#FFC800]" : "text-rose-600"
              }`}
            >
              {kpi.isUp ? "↑" : "↓"} {kpi.trend}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}