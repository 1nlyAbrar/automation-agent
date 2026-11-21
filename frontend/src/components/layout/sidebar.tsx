"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function Sidebar({ open, onClose, collapsed, onToggleCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const labelClass = collapsed ? "md:sr-only" : "";

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border transition-transform duration-200 md:static md:translate-x-0",
          // LIGHT MODE: Deep purple fading to white
          "bg-gradient-to-b from-[#4c1d95] via-[#c4b5fd] to-white", 
          // DARK MODE: Deep black/purple fading to black
          "dark:bg-gradient-to-b dark:from-[#1c0a2e] dark:via-[#0f0518] dark:to-[#0a0a0a]",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:w-[72px]" : "md:w-64"
        )}
      >
        {/* Brand Logo - Clean & Centered */}
        <div className="flex w-full items-center justify-center pt-8 pb-6 px-4">
          <img 
            src="/logo.png" 
            alt="AlphaSys Logo" 
            className={cn(
              "w-auto object-contain drop-shadow-md",
              collapsed ? "h-8" : "h-20" // Good balanced size
            )} 
          />
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-6">
              <p
                className={cn(
                  "px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/60",
                  collapsed && "md:hidden"
                )}
              >
                {group.label}
              </p>
              <ul className="flex flex-col gap-1">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={onClose}
                        title={collapsed ? label : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-white/20 text-white shadow-sm backdrop-blur-sm dark:bg-primary/20 dark:text-primary"
                            : "text-white/80 hover:bg-white/10 hover:text-white dark:text-muted-foreground dark:hover:bg-secondary dark:hover:text-foreground",
                          collapsed && "md:justify-center md:px-0"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className={cn(labelClass)}>{label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 dark:border-sidebar-border hidden md:block">
          <button
            onClick={onToggleCollapsed}
            className="flex w-full items-center justify-center rounded-lg border border-white/30 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors dark:border-sidebar-border dark:text-muted-foreground dark:hover:bg-secondary"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}