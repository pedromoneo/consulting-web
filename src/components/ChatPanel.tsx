"use client";

import React, { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    messages: any[];
    onSendMessage: (message: string) => Promise<void>;
    isLoading: boolean;
    userContextString?: string;
    className?: string;
}

export default function ChatPanel({
    isOpen,
    onClose,
    messages,
    onSendMessage,
    isLoading,
    className = "",
}: ChatPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = React.useState("");

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        await onSendMessage(input);
        setInput("");
    };

    return (
        <>
            {/* Overlay for mobile (and desktop if preferred, but usually implies modal) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Slide-over Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-surface border-l border-border z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                    } ${className}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                            <span className="text-accent text-lg">✨</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-foreground">Disruptor AI</h3>
                            <p className="text-[10px] text-muted-foreground">
                                Your always-on intelligence partner
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium mb-1">How can we help?</p>
                            <p className="text-xs text-muted-foreground">
                                Ask about our services, experts, or cases.
                            </p>
                        </div>
                    ) : (
                        messages.map((m: any, i: number) => (
                            <ChatMessage key={m.id || i} type={m.role === "user" ? "user" : "assistant"}>
                                {m.content}
                            </ChatMessage>
                        ))
                    )}
                    {isLoading && (
                        <ChatMessage type="assistant">
                            <div className="flex gap-1 items-center h-6">
                                <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </ChatMessage>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-surface">
                    <ChatInput
                        input={input}
                        handleInputChange={(e) => setInput(e.target.value)}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        placeholder="Ask anything..."
                    />
                </div>
            </div>
        </>
    );
}
