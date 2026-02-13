"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface SystemPromptFormProps {
    onComplete?: () => void;
    onCancel?: () => void;
}

const RECOMMENDED_PROMPT = `You are the AI assistant for Disruptor, an AI-Native Innovation & Transformation Consultancy.
Your goal is to guide potential clients to understand their needs and how we can help, but you must do this sequentially, like a real human consultant.

COMPANY PROFILE:
- We deploy world-class senior experts augmented by AI to create measurable business value.
- No junior associates. No hours billed. Compensation is tied to outcomes.
- Service Areas: Intelligence (market research), Transformation (strategic change), Innovation (venture building), Handoff (executive placement).
- Unique Value: University research network (knowledge 18-24mo ahead of market), Programmed Disconnection (we place a permanent leader to sustain work).

INTERACTION RULES:
0. RESEARCH FIRST: Use Google Search to gather real-time context about the user's company or challenge BEFORE responding.
1. ONE QUESTION AT A TIME: Never ask multiple questions in a single response. Wait for the user to answer before asking the next one.
2. BE CONCISE: Keep responses short (1-3 sentences). Avoid long paragraphs.
3. BE DIRECTIVE: Guide the conversation naturally.
   - Start by understanding their company or role if unknown.
   - Then, ask about their specific biggest challenge.
   - Then, explain how our model fits that challenge.
   - Finally, ask if they want to speak with an expert.
4. TONE: Professional but conversational. Not robotic.

EXAMPLE FLOW:
User: "Hi"
You: "Hello. To better assist you, could you briefly tell me about your role or company?"
User: "I own a retail chain in Mexico."
You: "That is interesting. What is the biggest challenge your retail chain is currently facing?"
User: "Supply chain efficiency."
You: "We specialize in Transformation. Our senior experts can optimize your supply chain using AI-driven insights. Would you like to explore how this would work?"

If the user wants to engage further, direct them to hello@disruptor.consulting.
`;

export default function SystemPromptForm({ onComplete, onCancel }: SystemPromptFormProps) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const docRef = doc(db, "tools", "chat-config"); // Using tools collection as fallback for permissions
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPrompt(docSnap.data().systemPrompt || "");
                } else {
                    // Pre-fill with recommended if empty
                    setPrompt(RECOMMENDED_PROMPT);
                }
            } catch (error) {
                console.error("Error fetching system prompt:", error);
            } finally {
                setFetching(false);
            }
        };

        fetchPrompt();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await setDoc(doc(db, "tools", "chat-config"), {
                systemPrompt: prompt,
                updatedAt: new Date(),
                // Add dummy fields to mimic a 'tool' if validation is strict (optional but safer)
                title: "Chat Config",
                type: "config",
                status: "internal"
            }, { merge: true });

            onComplete?.();
            alert("System prompt updated successfully!");
        } catch (error) {
            console.error("Error saving system prompt:", error);
            alert("Failed to update system prompt.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="text-sm text-muted p-4">Loading configuration...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            AI Chatbot System Instructions
                        </label>
                        <div className="text-xs text-muted-foreground">
                            These instructions define the persona, scope, and behavior of the AI assistant.
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm("Replace current instructions with the recommended sequential flow?")) {
                                setPrompt(RECOMMENDED_PROMPT);
                            }
                        }}
                        className="text-xs px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
                        Reset to Recommended
                    </button>
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-mono text-sm"
                    placeholder="Enter strict system instructions here..."
                    required
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-accent hover:bg-accent-muted text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        "Update Instructions"
                    )}
                </button>
            </div>
        </form>
    );
}
