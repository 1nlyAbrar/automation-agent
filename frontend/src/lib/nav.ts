import {
  Bell,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/overview", label: "Overview", icon: LayoutDashboard },
      { href: "/leads", label: "Leads", icon: Users },
      { href: "/email-automation", label: "Email Automation", icon: Mail },
      { href: "/follow-ups", label: "Follow-ups", icon: CalendarCheck },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/ai-reports", label: "AI Reports", icon: Sparkles },
      { href: "/workflows", label: "Workflows", icon: Workflow },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/notifications", label: "Notifications", icon: Bell },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);