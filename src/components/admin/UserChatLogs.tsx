import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, orderBy, getDocs } from "firebase/firestore";

interface UserChatLogsProps {
    userId: string;
    userName: string;
    onClose: () => void;
}

export default function UserChatLogs({ userId, userName, onClose }: UserChatLogsProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                // Fetch 'current' chat log document
                const chatRef = doc(db, "users", userId, "chatHistory", "current");
                const chatSnap = await getDoc(chatRef);

                if (chatSnap.exists()) {
                    setMessages(chatSnap.data().messages || []);
                } else {
                    // Try to fetch subcollection if 'messages' field is missing (initially planned arrays)
                    // But our implementation uses arrayUnion on 'messages' field.
                    // If empty, set empty array.
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error fetching chat logs:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchChat();
    }, [userId]);

    const handleAnalyze = async () => {
        if (messages.length === 0) return;
        setAnalyzing(true);
        try {
            const response = await fetch("/api/analyze-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages,
                    userContext: { id: userId, name: userName }
                })
            });
            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to analyze chat.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleDeleteMessage = async (index: number) => {
        // Optimistic update
        const newMessages = [...messages];
        newMessages.splice(index, 1);
        setMessages(newMessages);

        try {
            const chatRef = doc(db, "users", userId, "chatHistory", "current");
            await updateDoc(chatRef, {
                messages: newMessages
            });
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message.");
            // Revert state if needed, or just let the user refresh
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-background w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-surface border-b border-border p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Chat History: {userName}</h3>
                        <p className="text-xs text-muted">ID: {userId}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted/10 rounded-full transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-muted py-12">No chat history found for this user.</div>
                        ) : (
                            messages.map((m, idx) => (
                                <div key={idx} className={`flex items-center gap-2 group ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${m.role === 'user'
                                        ? 'bg-accent/10 border border-accent/20 rounded-tr-sm'
                                        : 'bg-white border border-border rounded-tl-sm shadow-sm'
                                        }`}>
                                        <div className="font-xs font-bold mb-1 opacity-50 uppercase tracking-wider text-[10px]">
                                            {m.role}
                                        </div>
                                        <div className="whitespace-pre-wrap">{m.content}</div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteMessage(idx)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                        title="Delete message"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Analysis Panel */}
                    <div className="w-full md:w-1/3 border-l border-border bg-surface flex flex-col">
                        <div className="p-4 border-b border-border bg-background">
                            <button
                                onClick={handleAnalyze}
                                disabled={analyzing || messages.length === 0}
                                className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-bold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {analyzing ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                        Analyze with AI
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {summary ? (
                                <div className="space-y-4">
                                    <div className="text-xs font-bold text-muted uppercase mb-2">AI Insights</div>
                                    {(() => {
                                        let parsed = null;
                                        try {
                                            const cleaned = summary.replace(/```json\n?|\n?```/g, "").trim();
                                            parsed = JSON.parse(cleaned);
                                        } catch (e) {
                                            parsed = null;
                                        }

                                        if (parsed) {
                                            return (
                                                <div className="space-y-4 animate-fade-in-up">
                                                    {parsed.client_summary && (
                                                        <div className="bg-surface/50 p-4 rounded-xl border border-border shadow-sm">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                                </div>
                                                                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Client Profile</h4>
                                                            </div>
                                                            <div className="space-y-2 text-xs">
                                                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                    <span className="text-muted">Role:</span>
                                                                    <span className="font-medium text-foreground">{parsed.client_summary.client_role || "Unknown"}</span>
                                                                </div>
                                                                <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                    <span className="text-muted">Company:</span>
                                                                    <span className="font-medium text-foreground">{parsed.client_summary.client_company || "Unknown"}</span>
                                                                </div>
                                                                <div className="pt-2 border-t border-border mt-2">
                                                                    <span className="block text-muted mb-1">Background:</span>
                                                                    <p className="leading-relaxed text-muted-foreground">{parsed.client_summary.client_background || "Unknown"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {parsed.problem_analysis && (
                                                        <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 shadow-sm">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="p-1.5 bg-red-500/10 rounded-lg text-red-500">
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                                                </div>
                                                                <h4 className="font-bold text-xs uppercase tracking-wider text-red-600/90">Pain Points</h4>
                                                            </div>
                                                            <p className="text-xs leading-relaxed text-foreground/80 mb-3">{parsed.problem_analysis.client_problem}</p>
                                                            <div className="text-xs font-bold text-red-600/80 mb-1">Needs:</div>
                                                            <p className="text-xs leading-relaxed text-foreground/80">{parsed.problem_analysis.client_needs}</p>
                                                        </div>
                                                    )}

                                                    {parsed.disruptor_solution && (
                                                        <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 shadow-sm">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                                                </div>
                                                                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600/90">Strategic Fit</h4>
                                                            </div>
                                                            <p className="text-xs leading-relaxed text-foreground/80">{parsed.disruptor_solution.how_disruptor_can_help}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // Fallback to plain text
                                        return (
                                            <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-medium">
                                                {summary}
                                            </div>
                                        );
                                    })()}
                                </div>
                            ) : (
                                <div className="text-center text-muted text-xs py-8 px-4">
                                    Click analyze to generate a summary of the client's needs and context.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
