"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AdminTab = "ideas" | "cases" | "users";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<AdminTab>("ideas");
    const { user } = useAuth();

    if (!user || user.role !== "admin") return null;

    return (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl animate-fade-in">
            <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-foreground">Admin Control Panel</h3>
                </div>
                <div className="flex bg-background/50 p-1 rounded-lg border border-border">
                    <button
                        onClick={() => setActiveTab("ideas")}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "ideas" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                            }`}
                    >
                        Ideas
                    </button>
                    <button
                        onClick={() => setActiveTab("cases")}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "cases" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                            }`}
                    >
                        Cases
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "users" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                            }`}
                    >
                        Users
                    </button>
                </div>
            </div>

            <div className="p-6">
                {activeTab === "ideas" && <CreateIdeaForm />}
                {activeTab === "cases" && <CreateCaseForm />}
                {activeTab === "users" && <UserManagement />}
            </div>
        </div>
    );
}

function CreateIdeaForm() {
    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Create New Idea</h4>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Title</label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="The Future of Consulting..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Tags (comma separated)</label>
                        <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="AI, Strategy, Growth" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Date</label>
                        <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="Feb 2026" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Excerpt</label>
                    <textarea className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none h-24" placeholder="Brief summary of the article..."></textarea>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Article URL</label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="https://..." />
                </div>
                <button className="bg-accent hover:bg-accent-muted text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 uppercase tracking-widest mt-2">
                    Publish Idea
                </button>
            </div>
        </div>
    );
}

function CreateCaseForm() {
    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Create New Case Study</h4>
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Client Sector</label>
                        <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="Fintech, Retail, etc." />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Title</label>
                        <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="Global Supply Chain Transformation" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Description</label>
                    <textarea className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none h-20" placeholder="What did we do?"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Measurable Result</label>
                        <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="45% Efficiency Gain" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Tags (comma separated)</label>
                        <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none" placeholder="AI, Supply Chain, Operations" />
                    </div>
                </div>
                <button className="bg-accent hover:bg-accent-muted text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 uppercase tracking-widest mt-2">
                    Publish Case
                </button>
            </div>
        </div>
    );
}

function UserManagement() {
    const clients = [
        { name: "John Smith", company: "Global Tech Corp", email: "john@globaltech.com", status: "Active" },
        { name: "Sarah Chen", company: "Innovative Retail", email: "sarah@inno.rest", status: "Active" },
    ];
    const experts = [
        { name: "Dr. Elena Vargas", expertise: "Generative AI", email: "elena@experts.net", status: "Verified" },
        { name: "Marcus Thorne", expertise: "Organizational Design", email: "marcus@experts.net", status: "Pending" },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Active Clients</h4>
                <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Name</th>
                                <th className="px-4 py-3 font-semibold">Company</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {clients.map((c, i) => (
                                <tr key={i} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{c.company}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-[10px] font-bold">{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Expert Network</h4>
                <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Name</th>
                                <th className="px-4 py-3 font-semibold">Expertise</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {experts.map((e, i) => (
                                <tr key={i} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-foreground">{e.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{e.expertise}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${e.status === "Verified" ? "bg-accent/10 text-accent" : "bg-orange-500/10 text-orange-500"
                                            }`}>
                                            {e.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
