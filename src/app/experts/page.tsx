"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";

export default function ExpertsPage() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [allExperts, setAllExperts] = useState<any[]>([]);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const q = query(collection(db, "experts"), where("status", "in", ["published", "featured"]));
                const querySnapshot = await getDocs(q);
                const expertsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllExperts(expertsData);
            } catch (error) {
                console.error("Error fetching experts:", error);
            }
        };

        fetchExperts();
    }, []);

    // Get all unique tags
    const allTags = Array.from(new Set(allExperts.flatMap((expert: any) => expert.tags || []))).sort();

    // Toggle tag selection
    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Filter experts based on selected tags (must have all selected tags)
    const filteredExperts = selectedTags.length > 0
        ? allExperts.filter(expert =>
            selectedTags.every(tag => expert.tags?.includes(tag))
        )
        : allExperts;

    return (
        <DashboardLayout activeSection="experts">
            <div className="container mx-auto px-4 py-16 max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Our Experts
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        We deploy world-class senior practitioners across every engagement.
                        Filter by expertise to find the right partner for your transformation.
                    </p>
                </div>

                {/* Filter Tags */}
                <div className="mb-10 pb-6 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-muted uppercase tracking-widest">Filter by Skills</p>
                        {selectedTags.length > 0 && (
                            <button
                                onClick={() => setSelectedTags([])}
                                className="text-[10px] text-accent hover:underline font-bold uppercase tracking-tighter"
                            >
                                Clear All ({selectedTags.length})
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedTags([])}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedTags.length === 0
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "bg-surface hover:bg-surface-hover text-muted-foreground border border-border"
                                }`}
                        >
                            All
                        </button>
                        {allTags.map((tag: string) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${selectedTags.includes(tag)
                                    ? "bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105"
                                    : "bg-surface hover:bg-surface-hover text-muted-foreground border-border hover:border-accent/40"
                                    }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    {tag}
                                    {selectedTags.includes(tag) && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Experts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredExperts.map((expert) => (
                        <div
                            key={expert.id}
                            className="bg-surface rounded-xl border border-border p-6 hover:border-accent/40 shadow-sm hover:shadow-md transition-all h-full flex flex-col group"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-accent/10 border border-border">
                                        <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">{expert.name}</h4>
                                        <p className="text-xs text-muted-foreground font-medium">{expert.role}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                                {expert.bio}
                            </p>

                            <div className="flex flex-col gap-4 mt-auto">
                                <div className="flex flex-wrap gap-2">
                                    {expert.tags?.map((tag: any) => (
                                        <span
                                            key={tag}
                                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border transition-colors ${selectedTags.includes(tag)
                                                ? "bg-accent text-white border-accent"
                                                : "bg-accent/5 text-accent border-accent/10"
                                                }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <a
                                    href={expert.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted hover:text-[#0077b5] transition-colors flex-shrink-0"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredExperts.length === 0 && (
                    <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground">No experts found with all the selected filters.</p>
                        <button
                            onClick={() => setSelectedTags([])}
                            className="mt-4 text-accent hover:underline text-sm font-bold"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
