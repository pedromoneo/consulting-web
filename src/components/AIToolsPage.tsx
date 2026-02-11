"use client";

import { useState } from "react";

const tools = [
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

export default function AIToolsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Tools</h3>
                <p className="text-muted-foreground max-w-2xl">
                    We build proprietary AI systems to augment our experts and provide
                    measurable advantages to our clients. Explore our ecosystem of internal
                    and client-facing tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        className="group bg-surface rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                {tool.icon}
                            </div>
                            <div className="flex-1" />
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${tool.status === "Live"
                                ? "bg-green-500/10 text-green-500"
                                : tool.status === "Beta"
                                    ? "bg-accent/10 text-accent"
                                    : "bg-surface-hover text-muted"
                                }`}>
                                {tool.status}
                            </span>
                        </div>

                        <h4 className="text-base font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                            {tool.title}
                        </h4>

                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                            {tool.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                                Access Tool
                            </span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all"
                            >
                                <path d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-accent/5 rounded-xl border border-accent/20 p-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                            Confidentiality & Access
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Some tools are restricted to active engagements or verified expert network members.
                            Sign in or contact your engagement leader to request full access to Disruptor's AI ecosystem.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
