"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfilePage({
    onOpenLogin,
    mode = "full"
}: {
    onOpenLogin: () => void;
    mode?: "full" | "join";
}) {
    const { user, isAuthenticated } = useAuth();

    // Role status
    const [isClient, setIsClient] = useState(false);
    const [isExpert, setIsExpert] = useState(false);
    const [isFellow, setIsFellow] = useState(false);

    // Common fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedin, setLinkedin] = useState("");

    // Client-specific fields
    const [clientCompany, setClientCompany] = useState("");
    const [clientChallenges, setClientChallenges] = useState("");

    // Expert-specific fields
    const [expertBio, setExpertBio] = useState("");

    // Fellow-specific fields
    const [fellowUniversity, setFellowUniversity] = useState("");
    const [fellowMajor, setFellowMajor] = useState("");
    const [fellowGradYear, setFellowGradYear] = useState("");

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load data from Firestore when user is available
    useEffect(() => {
        const loadUserData = async () => {
            if (!user?.uid) return;

            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();

                    // Try to get name from any of the profiles or top level if it existed
                    const p = data.clientProfile || data.expertProfile || data.fellowProfile || {};
                    setFirstName(p.firstName || "");
                    setLastName(p.lastName || "");
                    setEmail(data.email || p.email || "");
                    setPhone(p.phone || "");
                    setLinkedin(p.linkedin || "");

                    // Client data
                    if (data.clientProfile) {
                        setIsClient(true);
                        setClientCompany(data.clientProfile.company || "");
                        setClientChallenges(data.clientProfile.challenges || "");
                    }

                    // Expert data
                    if (data.expertProfile) {
                        setIsExpert(true);
                        setExpertBio(data.expertProfile.bio || "");
                    }

                    // Fellow data
                    if (data.fellowProfile) {
                        setIsFellow(true);
                        setFellowUniversity(data.fellowProfile.university || "");
                        setFellowMajor(data.fellowProfile.major || "");
                        setFellowGradYear(data.fellowProfile.gradYear || "");
                    }
                } else if (user.email) {
                    setEmail(user.email);
                }
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };

        loadUserData();
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            onOpenLogin();
            return;
        }

        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user!.uid);

            const updates: any = {
                updatedAt: new Date().toISOString()
            };

            if (isClient) {
                updates.clientProfile = {
                    firstName,
                    lastName,
                    email,
                    phone,
                    company: clientCompany,
                    challenges: clientChallenges,
                    updatedAt: new Date().toISOString()
                };
            }

            if (isExpert) {
                updates.expertProfile = {
                    firstName,
                    lastName,
                    email,
                    phone,
                    linkedin,
                    bio: expertBio,
                    updatedAt: new Date().toISOString()
                };
            }

            if (isFellow) {
                updates.fellowProfile = {
                    firstName,
                    lastName,
                    email,
                    phone,
                    linkedin,
                    university: fellowUniversity,
                    major: fellowMajor,
                    gradYear: fellowGradYear,
                    updatedAt: new Date().toISOString()
                };
            }

            await setDoc(userRef, updates, { merge: true });

            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass =
        "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all";
    const labelClass = "block text-xs font-medium text-foreground mb-1.5";

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
                    Tell us about yourself
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                    {mode === "join"
                        ? "Provide your details below to help us personalize your experience. You can choose to be an expert or a university fellow."
                        : "Provide your details below to help us personalize your experience. You can choose to be a client, an expert, or a university fellow."}
                </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
                {/* 1. General Information */}
                <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">General Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className={labelClass}>First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={labelClass}>LinkedIn Profile (URL)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </span>
                            <input
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Role Selection */}
                <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        I am interested in being a...
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(mode === "full" || isClient) && (
                            <RoleCheckbox
                                label="Client"
                                description="I need strategic consulting"
                                isActive={isClient}
                                toggle={() => setIsClient(!isClient)}
                                iconColor="text-blue-500"
                            />
                        )}
                        <RoleCheckbox
                            label="Expert"
                            description="I want to join the network"
                            isActive={isExpert}
                            toggle={() => setIsExpert(!isExpert)}
                            iconColor="text-violet-500"
                        />
                        <RoleCheckbox
                            label="University Fellow"
                            description="I'm a student seeking projects"
                            isActive={isFellow}
                            toggle={() => setIsFellow(!isFellow)}
                            iconColor="text-emerald-500"
                        />
                    </div>
                </div>

                {/* 3. Role-Specific Details */}
                {(isClient || isExpert || isFellow) && (
                    <div className="space-y-6">
                        {isClient && (
                            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 animate-fade-in-up">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                                            <rect x="2" y="7" width="20" height="14" rx="2" />
                                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-foreground">Client Details</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className={labelClass}>Company Name</label>
                                        <input
                                            type="text"
                                            value={clientCompany}
                                            onChange={(e) => setClientCompany(e.target.value)}
                                            placeholder="Your Organization"
                                            className={inputClass}
                                            required={isClient}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelClass}>Main Challenges</label>
                                        <textarea
                                            value={clientChallenges}
                                            onChange={(e) => setClientChallenges(e.target.value)}
                                            placeholder="What strategic issues are you tackling?"
                                            rows={3}
                                            className={`${inputClass} resize-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isExpert && (
                            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 animate-fade-in-up">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-foreground">Expert Details</h4>
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Professional Bio / Expertise</label>
                                    <textarea
                                        value={expertBio}
                                        onChange={(e) => setExpertBio(e.target.value)}
                                        placeholder="Summarize your experience and core competencies..."
                                        rows={4}
                                        required={isExpert}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                            </div>
                        )}

                        {isFellow && (
                            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 animate-fade-in-up">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-foreground">University Fellow Details</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className={labelClass}>University / School</label>
                                        <input
                                            type="text"
                                            value={fellowUniversity}
                                            onChange={(e) => setFellowUniversity(e.target.value)}
                                            placeholder="University Name"
                                            required={isFellow}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelClass}>Major / Study Field</label>
                                        <input
                                            type="text"
                                            value={fellowMajor}
                                            onChange={(e) => setFellowMajor(e.target.value)}
                                            placeholder="Area of Study"
                                            required={isFellow}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={labelClass}>Graduation Year</label>
                                        <input
                                            type="text"
                                            value={fellowGradYear}
                                            onChange={(e) => setFellowGradYear(e.target.value)}
                                            placeholder="2027"
                                            required={isFellow}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3.5 bg-gradient-to-r from-accent to-orange-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-accent/30 disabled:opacity-50 min-w-[200px]"
                            >
                                {isLoading ? "Saving..." : "Save My Profile"}
                            </button>
                            {isSubmitted && (
                                <span className="flex items-center gap-2 text-sm text-green-600 font-medium animate-fade-in-up">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Profile updated successfully!
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Note */}
                <div className="flex items-start gap-4 bg-accent/5 border border-accent/10 rounded-2xl p-5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent mt-0.5 flex-shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        We respect your data. Your information is used only to facilitate collaboration within the Disruptor network. If you apply as an Expert or Fellow, our team will review your details and reach out within 48 hours.
                    </p>
                </div>
            </form>
        </div>
    );
}

function RoleCheckbox({ label, description, isActive, toggle, iconColor }: {
    label: string,
    description: string,
    isActive: boolean,
    toggle: () => void,
    iconColor: string
}) {
    return (
        <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isActive ? "border-accent bg-accent/5 shadow-md" : "border-border hover:border-border-light"
                }`}
        >
            <input
                type="checkbox"
                checked={isActive}
                onChange={toggle}
                className="sr-only"
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isActive ? "bg-accent border-accent" : "border-border-light"
                }`}>
                {isActive && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>
            <div>
                <div className={`text-sm font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                </div>
                <div className="text-[10px] text-muted leading-tight">
                    {description}
                </div>
            </div>
        </label>
    );
}
