"use client";

import { useState, useEffect } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AIToolsPage() {
    const [tools, setTools] = useState<any[]>([]);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const q = query(collection(db, "tools"), where("status", "==", "featured"));
                const querySnapshot = await getDocs(q);
                const dynamicTools = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTools(dynamicTools);
            } catch (error) {
                console.error("Error fetching tools:", error);
            }
        };

        fetchTools();
    }, []);

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
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 overflow-hidden">
                                {tool.iconUrl ? (
                                    <img src={tool.iconUrl} alt={tool.title} className="w-full h-full object-cover" />
                                ) : (
                                    tool.icon
                                )}
                            </div>
                            <div className="flex-1" />
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${tool.stage === "Live"
                                ? "bg-green-500/10 text-green-500"
                                : tool.stage === "Beta"
                                    ? "bg-accent/10 text-accent"
                                    : "bg-surface-hover text-muted"
                                }`}>
                                {tool.stage || tool.status}
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
