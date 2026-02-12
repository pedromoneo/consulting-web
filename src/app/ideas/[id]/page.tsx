"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function IdeaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [idea, setIdea] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIdea = async () => {
            if (!params.id) return;
            try {
                const docRef = doc(db, "ideas", params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setIdea({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such idea!");
                    router.push("/ideas");
                }
            } catch (error) {
                console.error("Error fetching idea:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdea();
    }, [params.id, router]);

    if (loading) {
        return (
            <DashboardLayout activeSection="ideas">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!idea) return null;

    return (
        <DashboardLayout activeSection="ideas">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="mb-8">
                    <Link href="/ideas" className="text-sm font-bold text-muted hover:text-accent transition-colors flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Ideas
                    </Link>
                </div>

                <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col gap-6 items-start mb-10">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                                {idea.tags?.map((tag: string, index: number) => (
                                    <span key={index} className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-xs font-mono text-muted">{idea.date}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">{idea.title}</h1>
                        {idea.excerpt && (
                            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-accent pl-6 italic">
                                {idea.excerpt}
                            </p>
                        )}
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                        <p className="whitespace-pre-wrap">{idea.content}</p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border bg-accent/5 -mx-8 -mb-8 p-8 rounded-b-2xl">
                        <h3 className="text-lg font-bold text-foreground mb-4">Interested in this topic?</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Our research team provides custom intelligence briefs on this and related subjects.
                        </p>
                        <Link href="/#hire" className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-muted text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
                            Request Intelligence Brief
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
