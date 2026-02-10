"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    email: string;
    name?: string;
    role?: "admin" | "user";
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("disruptor_user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                // Re-verify role in case it was stored before roles were implemented
                if (parsed.email === "pedro.moneo@gmail.com") {
                    parsed.role = "admin";
                } else if (!parsed.role) {
                    parsed.role = "user";
                }
                setUser(parsed);
            } catch (e) {
                console.error("Failed to parse saved user", e);
            }
        }
    }, []);

    const login = (email: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const newUser: User = {
            email: normalizedEmail,
            role: normalizedEmail === "pedro.moneo@gmail.com" ? "admin" : "user",
        };
        setUser(newUser);
        localStorage.setItem("disruptor_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("disruptor_user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
