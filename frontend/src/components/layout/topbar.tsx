"use client";

import { Search, Bell, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [dateString, setDateString] = useState("");

  // This runs only on the client side after the page loads
  useEffect(() => {
    setMounted(true);
    const date = new Date();
    setDateString(
      date.toLocaleDateString("en-US", {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    );
  }, []);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      
      {/* Left Side: Mobile Menu & Date Badge */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Date Badge - Only renders when mounted */}
        {mounted && (
          <div className="hidden items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 md:flex">
            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              {dateString}
            </span>
          </div>
        )}
      </div>

      {/* Right Side: Search, Actions, Profile */}
      <div className="flex items-center gap-3">
        
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-64 rounded-md border border-input bg-secondary/50 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <Link 
          href="/leads"
          className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 md:block"
        >
          + New
        </Link>

        {/* Theme Toggle - Prevents hydration mismatch by waiting for mount */}
        {mounted ? (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        ) : (
          <div className="h-9 w-9 rounded-md bg-transparent" /> // Placeholder to prevent layout shift
        )}

        <Link href="/notifications" className="relative rounded-md p-2 text-muted-foreground hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Link>

        <Link href="/settings" className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground cursor-pointer hover:opacity-80 transition-opacity">
          AK
        </Link>
      </div>
    </header>
  );
}