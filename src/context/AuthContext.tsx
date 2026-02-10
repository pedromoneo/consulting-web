"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
    auth,
    db
} from "@/lib/firebase";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface User {
    email: string;
    uid: string;
    name?: string;
    role?: "admin" | "user";
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    sendMagicLink: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Sync user with Firestore to get roles
    const syncUserRole = async (firebaseUser: FirebaseUser) => {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let role: "admin" | "user" = "user";

        // Hardcoded admin for specific email
        if (firebaseUser.email === "pedro.moneo@gmail.com") {
            role = "admin";
        }

        if (userSnap.exists()) {
            role = userSnap.data().role || role;
        } else {
            // Create user profile if doesn't exist
            await setDoc(userRef, {
                email: firebaseUser.email,
                role: role,
                createdAt: new Date().toISOString()
            }, { merge: true });
        }

        return role;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const role = await syncUserRole(firebaseUser);
                setUser({
                    email: firebaseUser.email || "",
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || undefined,
                    role: role
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Handle Magic Link completion
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            if (email) {
                signInWithEmailLink(auth, email, window.location.href)
                    .then(() => {
                        window.localStorage.removeItem('emailForSignIn');
                    })
                    .catch((error) => {
                        console.error("Error signing in with email link", error);
                    });
            }
        }

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const sendMagicLink = async (email: string) => {
        const actionCodeSettings = {
            url: window.location.origin,
            handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginWithGoogle,
                sendMagicLink,
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
