"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import LoginModal from "./LoginModal";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeSection?: string;
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (open: boolean) => void;
    isLoginOpen?: boolean;
    setIsLoginOpen?: (open: boolean) => void;
}

export default function DashboardLayout({
    children,
    activeSection: propActiveSection,
    isSidebarOpen: propSidebarOpen,
    setIsSidebarOpen: propSetSidebarOpen,
    isLoginOpen: propLoginOpen,
    setIsLoginOpen: propSetLoginOpen
}: DashboardLayoutProps) {
    const [internalSidebarOpen, setInternalSidebarOpen] = useState(false);
    const [internalShowLogin, setInternalShowLogin] = useState(false);
    const pathname = usePathname();

    const sidebarOpen = propSidebarOpen !== undefined ? propSidebarOpen : internalSidebarOpen;
    const setSidebarOpen = propSetSidebarOpen || setInternalSidebarOpen;
    const showLogin = propLoginOpen !== undefined ? propLoginOpen : internalShowLogin;
    const setShowLogin = propSetLoginOpen || setInternalShowLogin;

    // Determine active section based on pathname if not provided
    const activeSection = propActiveSection || (
        pathname === "/" ? "home" :
            pathname.startsWith("/ideas") ? "ideas" :
                pathname.startsWith("/cases") ? "cases" :
                    pathname.startsWith("/experts") ? "experts" :
                        pathname.startsWith("/tools") ? "aitools" :
                            pathname.startsWith("/aitools") ? "aitools" :
                                "home"
    );

    const handleNavigate = (id: string) => {
        if (pathname === "/") {
            const el = document.getElementById(id);
            const container = document.getElementById("main-scroll-container");

            if (el && container) {
                const elTop = el.getBoundingClientRect().top;
                const containerTop = container.getBoundingClientRect().top;
                // Scroll the container to align element to top, with 20px padding
                container.scrollTo({
                    top: container.scrollTop + (elTop - containerTop) - 20,
                    behavior: "smooth"
                });
                return;
            }
        }

        // On other pages or if element not found, navigate to home with hash
        window.location.href = `/#${id}`;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar
                activeSection={activeSection}
                onNavigate={handleNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpenLogin={() => setShowLogin(true)}
            />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-surface/50 backdrop-blur-sm flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs font-mono text-muted">
                            {activeSection === "home" ? "/home" : `/${activeSection}`}
                        </span>
                    </Link>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2 text-xs text-muted">
                        <span className="hidden sm:inline">AI-Native Innovation & Transformation</span>
                        <div className="w-px h-4 bg-border hidden sm:block" />
                        <a href="mailto:hello@disruptor.consulting" className="text-accent hover:text-accent-muted transition-colors hidden sm:inline">
                            Contact
                        </a>
                    </div>
                </header>

                {/* Content Area */}
                <div id="main-scroll-container" className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
            />
        </div>
    );
}
