"use client";

import React from "react";
import Link from "next/link";

const allTools = [
    {
        id: "market-intel",
        title: "Market Intelligence Dashboard",
        description: "Real-time analysis of industry trends and competitor movement using our university research network proprietary data.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        link: "#",
        status: "Beta",
    },
    {
        id: "strategy-sim",
        title: "Strategic Change Simulator",
        description: "Model the impact of organizational shifts and market disruption before committing resources.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
            </svg>
        ),
        link: "#",
        status: "Internal Only",
    },
    {
        id: "venture-canvas",
        title: "Venture Builder Canvas",
        description: "Accelerate startup building within corporate environments with our AI-augmented validation framework.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
            </svg>
        ),
        link: "#",
        status: "Live",
    },
    {
        id: "talent-engine",
        title: "Leadership Matching Engine",
        description: "Align senior advisors and university fellows with complex business transformations using competency-based AI models.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
            </svg>
        ),
        link: "#",
        status: "Beta",
    },
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
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
                        <div
                            key={tool.id}
                            className="group bg-surface rounded-xl border border-border p-6 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                    {tool.icon}
                                </div>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tool.status === "Live"
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : tool.status === "Beta"
                                            ? "bg-accent/10 text-accent border-accent/20"
                                            : "bg-muted/10 text-muted border-muted/20"
                                    }`}>
                                    {tool.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                                {tool.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                {tool.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                Access Tool
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </div>
                        </div>
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
        </div>
    );
}
