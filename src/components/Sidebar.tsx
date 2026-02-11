"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import LoginModal from "./LoginModal";
import Link from "next/link";

const navItems = [
  { id: "home", label: "Welcome", icon: "spark" },
  { id: "services", label: "Services", icon: "grid" },
  { id: "ideas", label: "Ideas", icon: "lightbulb" },
  { id: "cases", label: "Cases", icon: "folder" },
  { id: "aitools", label: "Tools", icon: "cpu" },
  { id: "about", label: "About", icon: "users" },
  { id: "hire", label: "Hire Us", icon: "briefcase" },
  { id: "talent", label: "Join Us", icon: "star" },

];

const icons: Record<string, React.ReactNode> = {
  spark: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1m-7.07-2.93l.7-.7M5.64 5.64l-.7-.7m14.12 0l-.7.7M18.36 18.36l.7.7M3 12h1m16 0h1m-5.65-4.35a4 4 0 1 1-5.66 5.66 4 4 0 0 1 5.66-5.66" />
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  lightbulb: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6m-5 3h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  briefcase: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" />
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  cpu: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2" />
    </svg>
  ),
};

export default function Sidebar({
  activeSection,
  onNavigate,
  isOpen,
  onClose,
  onOpenLogin,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}) {
  const { user, logout, loading } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity p-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">D</span>
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide text-foreground">
              DISRUPTOR
            </h1>
            <p className="text-[10px] text-muted tracking-widest uppercase">
              AI-Native Consultancy
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] text-muted uppercase tracking-widest px-3 py-2">
            Conversations
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${activeSection === item.id
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-hover border border-transparent"
                }`}
            >
              <span
                className={
                  activeSection === item.id ? "text-accent" : "text-muted"
                }
              >
                {icons[item.icon]}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Auth Section */}
          {user ? (
            <div className="space-y-2">
              <div
                className="px-3 py-2 rounded-lg bg-background/50 border border-border cursor-pointer hover:bg-surface-hover hover:border-accent/40 transition-all group"
                onClick={() => window.location.href = "/profile"}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20 group-hover:border-accent transition-colors">
                    <span className="text-accent text-xs font-bold">{user.email[0].toUpperCase()}</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-foreground truncate">{user.email}</p>
                    <p className="text-[9px] text-accent font-bold uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
              </div>
              {user.role === "admin" && (
                <button
                  onClick={() => window.location.href = "/admin"}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-accent bg-accent/5 hover:bg-accent/10 border border-accent/20 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Admin Panel
                </button>
              )}
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenLogin()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-center text-muted-foreground hover:text-foreground hover:bg-surface-hover border border-transparent hover:border-border transition-all group"
            >
              <span className="text-muted group-hover:text-accent transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </span>
              Sign In
            </button>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 text-xs text-muted">
            <div className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-orange-500' : 'bg-green-500'}`} />
            <span>{loading ? 'Authenticating...' : 'AI systems online'}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
