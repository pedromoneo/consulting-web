"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type LoginStep = "choose" | "magic-link-sent";

export default function LoginModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [step, setStep] = useState<LoginStep>("choose");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { loginWithGoogle, sendMagicLink } = useAuth();

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep("choose");
                setEmail("");
                setError("");
                setIsLoading(false);
            }, 300);
        }
    }, [isOpen]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            onClose();
        } catch (err: any) {
            console.error("Google Login Error:", err);
            setError(err.message || "Failed to login with Google");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }
        setError("");
        setIsLoading(true);
        try {
            await sendMagicLink(email);
            setStep("magic-link-sent");
        } catch (err: any) {
            console.error("Magic Link Error:", err);
            setError(err.message || "Failed to send magic link");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative px-8 pt-8 pb-4">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                    >
                        <svg
                            width="16"
                            height="16"
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

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm font-mono">D</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                {step === "choose" && "Sign in to Disruptor"}
                                {step === "magic-link-sent" && "Check your inbox"}
                            </h2>
                            <p className="text-xs text-muted">
                                {step === "choose" && "Access your premium AI-native consultancy dashboard"}
                                {step === "magic-link-sent" &&
                                    `We've sent a magic login link to ${email}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                    {/* Step: Choose method */}
                    {step === "choose" && (
                        <div className="space-y-4">
                            {/* Google Login */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-white hover:bg-surface-hover transition-all text-sm font-bold text-foreground hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="text-muted-foreground group-hover:text-foreground">Continue with Google</span>
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 py-1">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-[10px] text-muted uppercase tracking-widest font-bold">
                                    or magic link
                                </span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* Magic Link Form */}
                            <form onSubmit={handleSendMagicLink} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="login-email"
                                        className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5"
                                    >
                                        Professional Email
                                    </label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError("");
                                        }}
                                        placeholder="you@company.com"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                    />
                                    {error && (
                                        <p className="text-xs text-red-500 mt-1.5 text-center">{error}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-orange-600 text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Magic Link"
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step: Magic Link Sent */}
                    {step === "magic-link-sent" && (
                        <div className="text-center space-y-6 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Click the link we&apos;ve sent to your email to sign in instantly.
                                    Check your spam folder if it doesn&apos;t arrive in a minute.
                                </p>
                            </div>
                            <button
                                onClick={() => setStep("choose")}
                                className="text-xs text-accent hover:underline font-bold uppercase tracking-widest"
                            >
                                Try another method
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
