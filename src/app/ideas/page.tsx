"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";

export default function IdeasPage() {
    const [allIdeas, setAllIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const q = query(collection(db, "ideas"), where("status", "in", ["published", "featured"]));
                const querySnapshot = await getDocs(q);
                const ideas = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setAllIdeas(ideas);
            } catch (error) {
                console.error("Error fetching ideas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, []);

    return (
        <DashboardLayout activeSection="ideas">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Header */}
                <div className="mb-12">
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
                    {allIdeas.map((idea) => (
                        <Link
                            key={idea.id}
                            href={`/ideas/view?id=${idea.id}`}
                            className="block h-full group"
                        >
                            <div className="bg-surface rounded-xl border border-border p-6 hover:border-accent/40 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {idea.tags?.map((tag: string, index: number) => (
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
                                    {idea.excerpt || (idea.content ? idea.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." : "")}
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
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
