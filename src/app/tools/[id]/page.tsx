"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

const DefaultIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

export default function ToolDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [tool, setTool] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            if (!params.id) return;
            try {
                const docRef = doc(db, "tools", params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTool({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such tool!");
                    router.push("/tools");
                }
            } catch (error) {
                console.error("Error fetching tool:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTool();
    }, [params.id, router]);

    if (loading) {
        return (
            <DashboardLayout activeSection="aitools">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!tool) return null;

    return (
        <DashboardLayout activeSection="aitools">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="mb-8">
                    <Link href="/tools" className="text-sm font-bold text-muted hover:text-accent transition-colors flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Tools
                    </Link>
                </div>

                <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                        <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center text-accent overflow-hidden border border-border/50 flex-shrink-0">
                            {tool.iconUrl ? <img src={tool.iconUrl} alt={tool.title} className="w-full h-full object-cover" /> : <DefaultIcon />}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{tool.title}</h1>
                                <span className={`text-xs font-mono px-3 py-1 rounded-full border ${tool.stage === "Live"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : tool.stage === "Beta"
                                        ? "bg-accent/10 text-accent border-accent/20"
                                        : "bg-muted/10 text-muted border-muted/20"
                                    }`}>
                                    {tool.stage || tool.status}
                                </span>
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">{tool.excerpt}</p>
                        </div>
                    </div>

                    <div
                        className="prose prose-invert prose-lg max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: tool.description }}
                    />

                    {tool.link && (
                        <div className="mt-12 pt-8 border-t border-border flex justify-end">
                            <a
                                href={tool.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-accent hover:bg-accent-muted text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center gap-3"
                            >
                                Launch Tool
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
