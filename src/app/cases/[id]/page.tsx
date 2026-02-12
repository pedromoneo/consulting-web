"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function CaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [caseStudy, setCaseStudy] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCase = async () => {
            if (!params.id) return;
            try {
                const docRef = doc(db, "cases", params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCaseStudy({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such case study!");
                    router.push("/cases");
                }
            } catch (error) {
                console.error("Error fetching case study:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCase();
    }, [params.id, router]);

    if (loading) {
        return (
            <DashboardLayout activeSection="cases">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!caseStudy) return null;

    return (
        <DashboardLayout activeSection="cases">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="mb-8">
                    <Link href="/cases" className="text-sm font-bold text-muted hover:text-accent transition-colors flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Cases
                    </Link>
                </div>

                <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col gap-6 items-start mb-10">
                        <div className="w-full flex flex-wrap gap-2 items-center text-[10px] uppercase font-bold tracking-wider">
                            <span className="text-muted bg-surface-hover px-3 py-1 rounded-full border border-border">
                                {caseStudy.sector}
                            </span>
                            {caseStudy.tags?.map((tag: string, index: number) => (
                                <span key={index} className="text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">{caseStudy.title}</h1>

                        {caseStudy.result && (
                            <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 px-6 py-4 rounded-xl w-full">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-green-500 tracking-widest">Outcome</p>
                                    <p className="text-lg font-bold text-foreground">{caseStudy.result}</p>
                                </div>
                            </div>
                        )}

                        {caseStudy.excerpt && (
                            <p className="text-xl text-muted-foreground leading-relaxed font-light">
                                {caseStudy.excerpt}
                            </p>
                        )}
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                        <p className="whitespace-pre-wrap">{caseStudy.description}</p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border bg-accent/5 -mx-8 -mb-8 p-8 rounded-b-2xl">
                        <h3 className="text-lg font-bold text-foreground mb-4">Facing accurate challenge?</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            See how our experts can deliver similar results for your organization.
                        </p>
                        <Link href="/#hire" className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-muted text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
                            Start a Conversation
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
