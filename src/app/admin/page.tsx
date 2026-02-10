"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AdminPanel from "@/components/AdminPanel";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-mono text-muted">Authenticating Admin Access...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                activeSection="admin"
                onNavigate={(id) => {
                    if (id === "admin") return;
                    router.push(`/#${id}`);
                }}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpenLogin={() => { }} // Admin is already logged in
            />

            <main className="flex-1 flex flex-col overflow-hidden bg-background">
                {/* Header */}
                <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-surface/50 backdrop-blur-sm flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs font-mono text-muted">
                            disruptor.admin
                        </span>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-background/50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-foreground">Admin Portal</h2>
                            <p className="text-sm text-muted">Manage system content, ideas, case studies, and users.</p>
                        </div>

                        <AdminPanel />
                    </div>
                </div>
            </main>
        </div>
    );
}
