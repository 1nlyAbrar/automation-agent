"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/overview");
        router.refresh();
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-[#f8f7fc] dark:bg-[#0f0518]">
      
      {/* Purple Glow (Top Left) */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: "radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.5) 0%, transparent 60%)" 
        }}
      ></div>

      {/* Yellow Glow (Bottom Right) */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: "radial-gradient(circle at 100% 100%, rgba(255, 200, 0, 0.3) 0%, transparent 60%)" 
        }}
      ></div>

      {/* BIG BACKGROUND WATERMARK LOGO */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img 
          src="/logo.png" 
          alt="Watermark" 
          className="w-[120vw] max-w-[1200px] opacity-[0.04] dark:opacity-[0.06] object-contain select-none blur-sm"
        />
      </div>

      {/* Futuristic Purple Glassmorphism Login Card */}
      <div className="z-10 w-full max-w-md space-y-8 rounded-3xl p-10 
        bg-purple-600/10 
        border border-purple-500/30 
        backdrop-blur-2xl 
        shadow-[0_0_40px_-10px_rgba(124,58,237,0.4),0_20px_40px_-10px_rgba(0,0,0,0.1)]
        hover:shadow-[0_0_60px_-5px_rgba(124,58,237,0.6),0_25px_50px_-10px_rgba(0,0,0,0.15)]
        hover:-translate-y-1
        transition-all duration-500 ease-out
        animate-in fade-in zoom-in-95
      ">
        
        <div className="text-center space-y-2">
          {/* HIGHLIGHTED INNER LOGO (Bigger & Glowing) */}
          <div className="relative mx-auto w-fit mb-6">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-30 rounded-full"></div>
            <img 
              src="/logo.png" 
              alt="AlphaSys" 
              className="relative h-20 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
            />
          </div>
          
          {/* Eye-catching gradient title */}
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#a855f7]">
            Welcome Back
          </h2>
          
          {/* Sleeker subtitle */}
          <p className="text-sm font-medium text-muted-foreground">
            Enter your credentials to access the AlphaSys command center
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center border border-destructive/20">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-purple-500/30 bg-white/50 px-4 py-3 text-sm font-medium text-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all dark:bg-black/20 placeholder:text-muted-foreground/50"
                placeholder="admin@alphasys.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 mb-2 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-purple-500/30 bg-white/50 px-4 py-3 text-sm font-medium text-foreground focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all dark:bg-black/20 placeholder:text-muted-foreground/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a855f7] py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:brightness-110 transition-all disabled:opacity-50 mt-6 uppercase"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}