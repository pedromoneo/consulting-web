"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CreateIdeaForm from "./admin/CreateIdeaForm";
import CreateCaseForm from "./admin/CreateCaseForm";
import CreateToolForm from "./admin/CreateToolForm";
import CreateExpertForm from "./admin/CreateExpertForm";
import UserManagement from "./admin/UserManagement";

type AdminTab = "ideas" | "cases" | "tools" | "experts";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<AdminTab>("ideas");
    const { user } = useAuth();

    if (!user || user.role !== "admin") return null;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Content Section */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
                <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-foreground">Content Management</h3>
                    </div>
                    <div className="flex bg-background/50 p-1 rounded-lg border border-border overflow-x-auto max-w-full">
                        <button
                            onClick={() => setActiveTab("ideas")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${activeTab === "ideas" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                                }`}
                        >
                            Ideas
                        </button>
                        <button
                            onClick={() => setActiveTab("cases")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${activeTab === "cases" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                                }`}
                        >
                            Cases
                        </button>
                        <button
                            onClick={() => setActiveTab("tools")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${activeTab === "tools" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                                }`}
                        >
                            Tools
                        </button>
                        <button
                            onClick={() => setActiveTab("experts")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${activeTab === "experts" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                                }`}
                        >
                            Experts
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === "ideas" && <CreateIdeaForm />}
                    {activeTab === "cases" && <CreateCaseForm />}
                    {activeTab === "tools" && <CreateToolForm />}
                    {activeTab === "experts" && <CreateExpertForm />}
                </div>
            </div>

            {/* User Management Section */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-foreground">User Management</h3>
                    </div>
                </div>
                <div className="p-6">
                    <UserManagement />
                </div>
            </div>
        </div>
    );
}
