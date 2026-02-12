"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";

const DefaultIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

export default function ToolsPage() {
    const [allTools, setAllTools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const q = query(collection(db, "tools"), where("status", "in", ["published", "featured"]));
                const querySnapshot = await getDocs(q);
                const tools = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setAllTools(tools);
            } catch (error) {
                console.error("Error fetching tools:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, []);

    return (
        <DashboardLayout activeSection="aitools">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Tools
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        We build proprietary AI systems to augment our experts and provide measurable advantages to our clients.
                        Explore our ecosystem of internal and client-facing tools.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allTools.map((tool) => (
                        <Link
                            key={tool.id}
                            href={`/tools/${tool.id}`}
                            className="group bg-surface rounded-xl border border-border p-6 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer block"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 overflow-hidden">
                                    {tool.iconUrl ? <img src={tool.iconUrl} className="w-full h-full object-cover" /> : <DefaultIcon />}
                                </div>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tool.stage === "Live"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : tool.stage === "Beta"
                                        ? "bg-accent/10 text-accent border-accent/20"
                                        : "bg-muted/10 text-muted border-muted/20"
                                    }`}>
                                    {tool.stage || tool.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                                {tool.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                {tool.excerpt || tool.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                Access Tool
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Confidentiality Notice */}
                <div className="mt-8 bg-accent/5 rounded-xl border border-accent/20 p-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-foreground mb-2">
                                Confidentiality & Access
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Some tools are restricted to active engagements or verified expert network members.
                                Sign in or contact your engagement leader to request full access to Disruptor's AI ecosystem.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
