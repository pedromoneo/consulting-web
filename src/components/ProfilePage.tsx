"use client";

import { useState } from "react";

export default function ProfilePage() {
    const [isClient, setIsClient] = useState(false);
    const [isExpert, setIsExpert] = useState(false);

    // Client fields
    const [clientFirstName, setClientFirstName] = useState("");
    const [clientLastName, setClientLastName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientCompany, setClientCompany] = useState("");
    const [clientChallenges, setClientChallenges] = useState("");

    // Expert fields
    const [expertFirstName, setExpertFirstName] = useState("");
    const [expertLastName, setExpertLastName] = useState("");
    const [expertEmail, setExpertEmail] = useState("");
    const [expertPhone, setExpertPhone] = useState("");
    const [expertLinkedin, setExpertLinkedin] = useState("");
    const [expertBio, setExpertBio] = useState("");

    const [clientSubmitted, setClientSubmitted] = useState(false);
    const [expertSubmitted, setExpertSubmitted] = useState(false);

    const handleClientSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Send to Firebase
        setClientSubmitted(true);
        setTimeout(() => setClientSubmitted(false), 4000);
    };

    const handleExpertSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Send to Firebase / notify talent team
        setExpertSubmitted(true);
        setTimeout(() => setExpertSubmitted(false), 4000);
    };

    const inputClass =
        "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all";
    const labelClass = "block text-xs font-medium text-foreground mb-1.5";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 text-[10px] text-muted font-mono bg-surface px-3 py-1.5 rounded-full border border-border mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    YOUR PROFILE
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
                    Tell us about yourself
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                    Select your role to help us personalize your experience. You can be
                    both a client and an expert.
                </p>
            </div>

            {/* Role Selection */}
            <div className="bg-surface rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    I am a...
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Client checkbox */}
                    <label
                        className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isClient
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-border-light"
                            }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isClient
                                    ? "bg-accent border-accent"
                                    : "border-border-light"
                                }`}
                        >
                            {isClient && (
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            checked={isClient}
                            onChange={(e) => setIsClient(e.target.checked)}
                            className="sr-only"
                        />
                        <div>
                            <div className="text-sm font-semibold text-foreground">
                                Client
                            </div>
                            <div className="text-xs text-muted">
                                I&apos;m looking for consulting services
                            </div>
                        </div>
                    </label>

                    {/* Expert checkbox */}
                    <label
                        className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isExpert
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-border-light"
                            }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isExpert
                                    ? "bg-accent border-accent"
                                    : "border-border-light"
                                }`}
                        >
                            {isExpert && (
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            checked={isExpert}
                            onChange={(e) => setIsExpert(e.target.checked)}
                            className="sr-only"
                        />
                        <div>
                            <div className="text-sm font-semibold text-foreground">
                                Expert
                            </div>
                            <div className="text-xs text-muted">
                                I want to join the expert network
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Client Form */}
            {isClient && (
                <form
                    onSubmit={handleClientSubmit}
                    className="bg-surface rounded-xl border border-border p-6 space-y-5 animate-fade-in-up"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="text-blue-600"
                            >
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground">
                                Client Profile
                            </h3>
                            <p className="text-xs text-muted">
                                Tell us about you and your business challenges
                            </p>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="client-first-name" className={labelClass}>
                                First Name
                            </label>
                            <input
                                id="client-first-name"
                                type="text"
                                value={clientFirstName}
                                onChange={(e) => setClientFirstName(e.target.value)}
                                placeholder="John"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="client-last-name" className={labelClass}>
                                Last Name
                            </label>
                            <input
                                id="client-last-name"
                                type="text"
                                value={clientLastName}
                                onChange={(e) => setClientLastName(e.target.value)}
                                placeholder="Smith"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="client-email" className={labelClass}>
                                Email
                            </label>
                            <input
                                id="client-email"
                                type="email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                placeholder="john@company.com"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="client-phone" className={labelClass}>
                                Phone
                            </label>
                            <input
                                id="client-phone"
                                type="tel"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="client-company" className={labelClass}>
                            Company Name
                        </label>
                        <input
                            id="client-company"
                            type="text"
                            value={clientCompany}
                            onChange={(e) => setClientCompany(e.target.value)}
                            placeholder="Acme Corporation"
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Challenges */}
                    <div>
                        <label htmlFor="client-challenges" className={labelClass}>
                            Your Challenges
                        </label>
                        <p className="text-xs text-muted mb-2">
                            Tell us about the challenges you&apos;re facing. This helps us
                            understand how we can best support you.
                        </p>
                        <textarea
                            id="client-challenges"
                            rows={5}
                            value={clientChallenges}
                            onChange={(e) => setClientChallenges(e.target.value)}
                            placeholder="What problems are you trying to solve? What does success look like for your organization? Are there specific areas where you need expertise?"
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-accent to-orange-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                        >
                            Save Client Profile
                        </button>
                        {clientSubmitted && (
                            <span className="flex items-center gap-2 text-sm text-green-600 font-medium animate-fade-in-up">
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
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Profile saved successfully!
                            </span>
                        )}
                    </div>
                </form>
            )}

            {/* Expert Form */}
            {isExpert && (
                <form
                    onSubmit={handleExpertSubmit}
                    className="bg-surface rounded-xl border border-border p-6 space-y-5 animate-fade-in-up"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="text-violet-600"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground">
                                Expert Profile
                            </h3>
                            <p className="text-xs text-muted">
                                Our talent team will review your profile and get in touch
                            </p>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expert-first-name" className={labelClass}>
                                First Name
                            </label>
                            <input
                                id="expert-first-name"
                                type="text"
                                value={expertFirstName}
                                onChange={(e) => setExpertFirstName(e.target.value)}
                                placeholder="Jane"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="expert-last-name" className={labelClass}>
                                Last Name
                            </label>
                            <input
                                id="expert-last-name"
                                type="text"
                                value={expertLastName}
                                onChange={(e) => setExpertLastName(e.target.value)}
                                placeholder="Doe"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expert-email" className={labelClass}>
                                Email
                            </label>
                            <input
                                id="expert-email"
                                type="email"
                                value={expertEmail}
                                onChange={(e) => setExpertEmail(e.target.value)}
                                placeholder="jane@example.com"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="expert-phone" className={labelClass}>
                                Phone
                            </label>
                            <input
                                id="expert-phone"
                                type="tel"
                                value={expertPhone}
                                onChange={(e) => setExpertPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label htmlFor="expert-linkedin" className={labelClass}>
                            LinkedIn Profile
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </span>
                            <input
                                id="expert-linkedin"
                                type="url"
                                value={expertLinkedin}
                                onChange={(e) => setExpertLinkedin(e.target.value)}
                                placeholder="https://linkedin.com/in/your-profile"
                                required
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="expert-bio" className={labelClass}>
                            About You
                        </label>
                        <p className="text-xs text-muted mb-2">
                            A brief description of your expertise, experience, and what you
                            bring to the table.
                        </p>
                        <textarea
                            id="expert-bio"
                            rows={5}
                            value={expertBio}
                            onChange={(e) => setExpertBio(e.target.value)}
                            placeholder="Tell us about your areas of expertise, years of experience, notable achievements, and what kind of engagements interest you..."
                            required
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-accent to-orange-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                        >
                            Submit for Review
                        </button>
                        {expertSubmitted && (
                            <span className="flex items-center gap-2 text-sm text-green-600 font-medium animate-fade-in-up">
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
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Submitted! Our talent team will be in touch.
                            </span>
                        )}
                    </div>

                    {/* Info note */}
                    <div className="flex items-start gap-3 bg-accent/5 border border-accent/10 rounded-xl p-4">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-accent mt-0.5 flex-shrink-0"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            After submitting, our talent team will review your profile and
                            schedule a call to discuss potential collaborations. We typically
                            respond within 48 hours.
                        </p>
                    </div>
                </form>
            )}

            {/* Empty state */}
            {!isClient && !isExpert && (
                <div className="bg-surface rounded-xl border border-border border-dashed p-12 text-center animate-fade-in-up">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-accent"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                        Select your role above to get started
                    </p>
                    <p className="text-xs text-muted">
                        You can select both options if applicable
                    </p>
                </div>
            )}
        </div>
    );
}
