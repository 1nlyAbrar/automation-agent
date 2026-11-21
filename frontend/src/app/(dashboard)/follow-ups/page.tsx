"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";

// --- Data Types ---
type FollowUp = {
  id: number;
  name: string;
  date: string; // Format: "YYYY-MM-DDTHH:mm"
  type: string;
  priority: string;
};

// --- Initial Demo Data ---
const initialFollowUps: FollowUp[] = [
  { id: 1, name: "Marcus Cole", date: "2026-11-04T15:00", type: "Call", priority: "High" },
  { id: 2, name: "Nadia Rahman", date: "2026-11-05T11:00", type: "Email", priority: "Medium" },
  { id: 3, name: "Sara Khan", date: "2026-11-07T14:30", type: "Meeting", priority: "Medium" },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);
  
  // Form State
  const [newTask, setNewTask] = useState({ name: "", time: "12:00", type: "Call", priority: "Medium" });

  // --- Logic to add a new follow-up ---
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name || !selectedDate) return;

    const fullDate = `${selectedDate}T${newTask.time}`;
    
    const newEntry: FollowUp = {
      id: Date.now(),
      name: newTask.name,
      date: fullDate,
      type: newTask.type,
      priority: newTask.priority,
    };

    setFollowUps([...followUps, newEntry]);
    setIsModalOpen(false);
    setNewTask({ name: "", time: "12:00", type: "Call", priority: "Medium" });
  };

  // --- Helper to format dates for the list ---
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  // --- Calendar Logic ---
  const generateCalendar = () => {
    const year = 2026;
    const month = 10; // November (0-indexed)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="py-2 text-transparent">0</div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const hasFollowUp = followUps.some((f: FollowUp) => f.date.startsWith(dateStr));
      
      days.push(
        <div 
          key={i} 
          onClick={() => { setSelectedDate(dateStr); setIsModalOpen(true); }}
          className={`py-2 rounded-md cursor-pointer transition-colors relative flex flex-col items-center justify-center
            ${i === 4 ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-secondary"}
          `}
        >
          {i}
          {hasFollowUp && (
            <span className={`w-1 h-1 rounded-full absolute bottom-1 ${i === 4 ? 'bg-white' : 'bg-primary'}`}></span>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Follow-ups"
          description="Never let a lead go cold."
        />
        <button 
          onClick={() => { setSelectedDate("2026-11-15"); setIsModalOpen(true); }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          + Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glow-card rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border p-2 flex space-x-1 bg-secondary/30">
              {["Upcoming", "Overdue", "Completed"].map((tab) => (
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

            <div className="divide-y divide-border">
              {activeTab === "Upcoming" && followUps.map((task: FollowUp) => (
                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-foreground">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(task.date)} · {task.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      task.priority === "High" ? "bg-destructive/10 text-destructive" : "bg-[#FFC800]/20 text-yellow-600 dark:text-[#FFC800]"
                    }`}>
                      {task.priority}
                    </span>
                    <button className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500 transition-colors">
                      ✓
                    </button>
                  </div>
                </div>
              ))}
              {activeTab !== "Upcoming" && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No {activeTab.toLowerCase()} follow-ups to show.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Calendar */}
        <div className="lg:col-span-1">
          <div className="glow-card rounded-xl border border-border bg-card shadow-sm p-5">
            <h3 className="font-semibold text-foreground mb-4">November 2026</h3>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-xs font-medium text-muted-foreground py-1">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {generateCalendar()}
            </div>
          </div>
        </div>

      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-card shadow-xl animate-in fade-in zoom-in-95 border border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold text-foreground">Schedule Follow-up</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Lead Name</label>
                <input 
                  type="text" 
                  required
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                  <input 
                    type="time" 
                    required
                    value={newTask.time}
                    onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                  <select 
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>Call</option>
                    <option>Email</option>
                    <option>Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
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
                  Save Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}