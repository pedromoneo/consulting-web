"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type LoginStep = "choose" | "otp-email" | "otp-verify";

export default function LoginModal({
    isOpen,
    onClose,
    onSkip,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSkip?: () => void;
}) {
    const [step, setStep] = useState<LoginStep>("choose");
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep("choose");
                setEmail("");
                setOtpCode(["", "", "", "", "", ""]);
                setError("");
                setIsLoading(false);
            }, 300);
        }
    }, [isOpen]);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // TODO: Implement actual Google OAuth
        setTimeout(() => {
            setIsLoading(false);
            alert("Google login integration coming soon");
        }, 1000);
    };

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }
        setError("");
        setIsLoading(true);
        // TODO: Implement actual OTP sending
        setTimeout(() => {
            setIsLoading(false);
            setStep("otp-verify");
        }, 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newCode = [...otpCode];
        newCode[index] = value;
        setOtpCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otpCode[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpCode.join("");
        if (code.length < 6) {
            setError("Please enter the full 6-digit code");
            return;
        }
        setError("");
        setIsLoading(true);
        // TODO: Implement actual OTP verification
        setTimeout(() => {
            setIsLoading(false);
            login(email);
            onClose();
        }, 1000);
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
                                {step === "otp-email" && "Sign in with Email"}
                                {step === "otp-verify" && "Enter verification code"}
                            </h2>
                            <p className="text-xs text-muted">
                                {step === "choose" && "Access your consultancy dashboard"}
                                {step === "otp-email" &&
                                    "We'll send you a one-time verification code"}
                                {step === "otp-verify" && (
                                    <>
                                        Sent to{" "}
                                        <span className="text-foreground font-medium">{email}</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                    {/* Step: Choose method */}
                    {step === "choose" && (
                        <div className="space-y-3">
                            {/* Google Login */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-white hover:bg-surface-hover transition-all text-sm font-medium text-foreground hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                {isLoading ? "Connecting..." : "Continue with Google"}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 py-1">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-muted uppercase tracking-wider">
                                    or
                                </span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* OTP Login */}
                            <button
                                onClick={() => setStep("otp-email")}
                                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-white hover:bg-surface-hover transition-all text-sm font-medium text-foreground hover:shadow-md hover:-translate-y-0.5"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Continue with Email Code
                            </button>

                            {/* Skip for now */}
                            {onSkip && (
                                <button
                                    onClick={() => {
                                        onSkip();
                                        onClose();
                                    }}
                                    className="w-full text-center text-xs text-muted hover:text-accent transition-colors py-2 mt-1"
                                >
                                    Skip for now →
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step: Enter email for OTP */}
                    {step === "otp-email" && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="login-email"
                                    className="block text-xs font-medium text-muted mb-1.5"
                                >
                                    Email address
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
                                    autoFocus
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                />
                                {error && (
                                    <p className="text-xs text-red-500 mt-1.5">{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-orange-600 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Sending code...
                                    </span>
                                ) : (
                                    "Send verification code"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep("choose");
                                    setError("");
                                }}
                                className="w-full text-center text-xs text-muted hover:text-foreground transition-colors py-1"
                            >
                                ← Back to sign in options
                            </button>
                        </form>
                    )}

                    {/* Step: Verify OTP code */}
                    {step === "otp-verify" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                                <div className="flex justify-center gap-2 mb-1">
                                    {otpCode.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            autoFocus={i === 0}
                                            className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                                        />
                                    ))}
                                </div>
                                {error && (
                                    <p className="text-xs text-red-500 mt-1.5 text-center">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-orange-600 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    "Verify & sign in"
                                )}
                            </button>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("otp-email");
                                        setOtpCode(["", "", "", "", "", ""]);
                                        setError("");
                                    }}
                                    className="text-xs text-muted hover:text-foreground transition-colors"
                                >
                                    ← Change email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // TODO: Resend OTP
                                        setOtpCode(["", "", "", "", "", ""]);
                                        setError("");
                                    }}
                                    className="text-xs text-accent hover:text-accent-muted transition-colors font-medium"
                                >
                                    Resend code
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
