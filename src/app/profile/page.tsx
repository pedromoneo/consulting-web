"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProfilePage from "@/components/ProfilePage";
import LoginModal from "@/components/LoginModal";
import Link from "next/link";

export default function Profile() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            setShowLogin(true);
        }
    }, [user, loading]);

    const handleNavigate = (id: string) => {
        // Navigate to homepage with hash
        window.location.href = `/#${id}`;
    };

    // Prevent hydration mismatch by rendering null until mounted (or handle loading)
    // But useAuth handles loading state nicely.

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar
                activeSection="profile"
                onNavigate={handleNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpenLogin={() => setShowLogin(true)}
            />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-surface/80 backdrop-blur shrink-0">
                    <Link href="/" className="font-bold text-foreground hover:opacity-80 transition-opacity">DISRUPTOR</Link>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-muted-foreground"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-12 w-full">
                    <div className="max-w-5xl mx-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                            </div>
                        ) : user ? (
                            <ProfilePage onOpenLogin={() => setShowLogin(true)} mode="full" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                                <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
                                <p className="text-muted-foreground mb-8">You need to be logged in to view your profile.</p>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
                                >
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <LoginModal
                isOpen={showLogin}
                onClose={() => {
                    setShowLogin(false);
                    if (!user && !loading) {
                        router.push("/");
                    }
                }}
            />
        </div>
    );
}
