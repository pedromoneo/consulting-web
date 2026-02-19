"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";

export default function CasesPage() {
    const [allCases, setAllCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const q = query(collection(db, "cases"), where("status", "in", ["published", "featured"]));
                const querySnapshot = await getDocs(q);
                const cases = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setAllCases(cases);
            } catch (error) {
                console.error("Error fetching cases:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    return (
        <DashboardLayout activeSection="cases">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Header */}
                <div className="mb-12">
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
                    {allCases.map((c) => (
                        <Link
                            key={c.id}
                            href={`/cases/${c.id}`}
                            className="block h-full group"
                        >
                            <div className="bg-surface rounded-xl border border-border p-6 hover:border-accent/40 hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted bg-surface-hover px-2 py-0.5 rounded">
                                        {c.sector}
                                    </span>
                                    {c.tags?.map((tag: string, index: number) => (
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
                                    {c.excerpt || (c.description ? c.description.replace(/<[^>]*>?/gm, '').substring(0, 200) + "..." : "")}
                                </p>

                                {c.result && (
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
                                )}

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
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
