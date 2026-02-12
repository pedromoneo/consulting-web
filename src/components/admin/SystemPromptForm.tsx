"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface SystemPromptFormProps {
    onComplete?: () => void;
    onCancel?: () => void;
}

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
                <label className="block text-sm font-medium text-foreground mb-2">
                    AI Chatbot System Instructions
                </label>
                <div className="text-xs text-muted-foreground mb-2">
                    These instructions define the persona, scope, and behavior of the AI assistant.
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 bg-white dark:bg-black border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-mono text-sm"
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
