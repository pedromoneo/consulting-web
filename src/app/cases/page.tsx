"use client";

import React from "react";
import Link from "next/link";

const allCases = [
    {
        slug: "market-intelligence-pe",
        sector: "Private Equity",
        title: "Market Intelligence for $2B Fund",
        result: "Identified 3 acquisition targets in 6 weeks",
        tags: ["Intelligence", "AI-Powered"],
        description:
            "Comprehensive sector mapping combining 25 expert interviews with AI-synthesized market data. Living dashboard replaced static quarterly reports.",
        url: "/cases/market-intelligence-pe",
    },
    {
        slug: "digital-transformation-healthcare",
        sector: "Healthcare",
        title: "Digital Transformation Roadmap",
        result: "40% reduction in time-to-insight",
        tags: ["Transformation", "AI Augmentation"],
        description:
            "Redesigned data infrastructure and decision-making processes for a regional healthcare system. Placed a Chief Digital Officer to carry forward.",
        url: "/cases/digital-transformation-healthcare",
    },
    {
        slug: "innovation-lab-manufacturing",
        sector: "Manufacturing",
        title: "Innovation Lab Launch",
        result: "2 new ventures in Year 1",
        tags: ["Innovation", "Venture Building"],
        description:
            "Built an internal innovation capability from scratch, including methodology, team, and first two venture concepts through to market validation.",
        url: "/cases/innovation-lab-manufacturing",
    },
];

export default function CasesPage() {
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
                        Case Studies
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Every engagement produces documented, attributed results.
                        Here are representative examples of the value we create.
                    </p>
                </div>

                {/* Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allCases.map((c, i) => (
                        <a
                            key={i}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full"
                        >
                            <div className="group bg-surface rounded-xl border border-border p-6 hover:border-accent/40 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted bg-surface-hover px-2 py-0.5 rounded">
                                        {c.sector}
                                    </span>
                                    {c.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-2 py-0.5 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-3">
                                    {c.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                                    {c.description}
                                </p>

                                <div className="flex items-center gap-2 bg-accent/5 border border-accent/10 rounded-lg px-3 py-2 mb-4">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-accent flex-shrink-0"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <span className="text-xs font-bold text-foreground uppercase tracking-tight">
                                        {c.result}
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs font-bold text-accent uppercase tracking-widest">
                                        View Case Study
                                    </span>
                                    <svg
                                        width="16"
                                        height="16"
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
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
