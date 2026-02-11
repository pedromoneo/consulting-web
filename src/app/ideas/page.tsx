"use client";

import React from "react";
import Link from "next/link";

const allIdeas = [
    {
        tags: ["Intelligence", "Transformation"],
        title: "The End of the Junior Pyramid",
        excerpt:
            "Why AI doesn't just augment consulting—it eliminates the structural model that made Big Four firms profitable.",
        date: "Feb 2026",
        url: "/ideas/end-of-junior-pyramid",
    },
    {
        tags: ["Innovation", "Strategy"],
        title: "Three Horizons or Failure",
        excerpt:
            "Organizations managing only today's business are already dying. A framework for simultaneous management across all three horizons.",
        date: "Jan 2026",
        url: "/ideas/three-horizons",
    },
    {
        tags: ["Transformation", "Value"],
        title: "Value-Based Consulting Is Inevitable",
        excerpt:
            "When your consultant's revenue depends on your success, everything changes. The structural case for outcome-tied compensation.",
        date: "Jan 2026",
        url: "/ideas/value-based-consulting",
    },
    {
        tags: ["Intelligence", "AI"],
        title: "Academic Intelligence as Competitive Moat",
        excerpt:
            "Access to discoveries 18-24 months before publication creates permanent structural advantages others can't replicate.",
        date: "Dec 2025",
        url: "/ideas/academic-intelligence-moat",
    },
];

export default function IdeasPage() {
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
                        Ideas
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Our research team continuously synthesizes academic findings with market reality.
                        Here's what we're thinking about.
                    </p>
                </div>

                {/* Ideas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allIdeas.map((idea, i) => (
                        <a
                            key={i}
                            href={idea.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full"
                        >
                            <div className="group bg-surface rounded-xl border border-border p-6 hover:border-accent/40 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {idea.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-2 py-0.5 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    <div className="flex-1" />
                                    <span className="text-[10px] font-mono text-muted">{idea.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-3">
                                    {idea.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                    {idea.excerpt}
                                </p>
                                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs font-bold text-accent uppercase tracking-widest">
                                        Read Article
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
