"use client";

import React, { useState } from "react";
import Link from "next/link";
import { experts } from "@/data/experts";

export default function ExpertsPage() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Get all unique tags
    const allTags = Array.from(new Set(experts.flatMap(expert => expert.tags))).sort();

    // Filter experts based on selected tag
    const filteredExperts = selectedTag
        ? experts.filter(expert => expert.tags.includes(selectedTag))
        : experts;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-16 max-w-7xl">
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
                        Our Experts
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        We deploy world-class senior practitioners across every engagement.
                        Filter by expertise to find the right partner for your transformation.
                    </p>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedTag === null
                                ? "bg-accent text-white"
                                : "bg-surface hover:bg-surface-hover text-muted-foreground"
                            }`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedTag === tag
                                    ? "bg-accent text-white"
                                    : "bg-surface hover:bg-surface-hover text-muted-foreground"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Experts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredExperts.map((expert) => (
                        <div
                            key={expert.id}
                            className="bg-surface rounded-xl border border-border p-6 hover:border-accent/40 shadow-sm hover:shadow-md transition-all h-full flex flex-col group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-accent/10 border border-border">
                                        <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">{expert.name}</h4>
                                        <p className="text-xs text-muted-foreground font-medium">{expert.role}</p>
                                    </div>
                                </div>
                                <a
                                    href={expert.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted hover:text-[#0077b5] transition-colors p-1"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                                {expert.bio}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {expert.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="text-[10px] uppercase tracking-wider font-bold bg-accent/5 text-accent px-2 py-1 rounded border border-accent/10"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredExperts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No experts found with the selected filter.</p>
                        <button
                            onClick={() => setSelectedTag(null)}
                            className="mt-4 text-accent hover:underline text-sm"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
