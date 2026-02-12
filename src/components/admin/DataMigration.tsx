"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, updateDoc, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { experts } from "@/data/experts";

const staticTools = [
    {
        id: "market-intel",
        title: "Market Intelligence Dashboard",
        description: "Real-time analysis of industry trends and competitor movement using our university research network proprietary data.",
        link: "#",
        status: "Beta",
    },
    {
        id: "strategy-sim",
        title: "Strategic Change Simulator",
        description: "Model the impact of organizational shifts and market disruption before committing resources.",
        link: "#",
        status: "Internal Only",
    },
    {
        id: "venture-canvas",
        title: "Venture Builder Canvas",
        description: "Accelerate startup building within corporate environments with our AI-augmented validation framework.",
        link: "#",
        status: "Live",
    },
    {
        id: "talent-engine",
        title: "Leadership Matching Engine",
        description: "Align senior advisors and university fellows with complex business transformations using competency-based AI models.",
        link: "#",
        status: "Beta",
    },
];

const staticIdeas = [
    {
        tags: ["Intelligence", "Transformation"],
        title: "The End of the Junior Pyramid",
        excerpt: "Why AI doesn't just augment consulting—it eliminates the structural model that made Big Four firms profitable.",
        date: "Feb 2026",
        url: "/ideas/end-of-junior-pyramid",
    },
    {
        tags: ["Innovation", "Strategy"],
        title: "Three Horizons or Failure",
        excerpt: "Organizations managing only today's business are already dying. A framework for simultaneous management across all three horizons.",
        date: "Jan 2026",
        url: "/ideas/three-horizons",
    },
    {
        tags: ["Transformation", "Value"],
        title: "Value-Based Consulting Is Inevitable",
        excerpt: "When your consultant's revenue depends on your success, everything changes. The structural case for outcome-tied compensation.",
        date: "Jan 2026",
        url: "/ideas/value-based-consulting",
    },
    {
        tags: ["Intelligence", "AI"],
        title: "Academic Intelligence as Competitive Moat",
        excerpt: "Access to discoveries 18-24 months before publication creates permanent structural advantages others can't replicate.",
        date: "Dec 2025",
        url: "/ideas/academic-intelligence-moat",
    },
];

const staticCases = [
    {
        slug: "market-intelligence-pe",
        sector: "Private Equity",
        title: "Market Intelligence for $2B Fund",
        result: "Identified 3 acquisition targets in 6 weeks",
        tags: ["Intelligence", "AI-Powered"],
        description: "Comprehensive sector mapping combining 25 expert interviews with AI-synthesized market data. Living dashboard replaced static quarterly reports.",
        url: "/cases/market-intelligence-pe",
    },
    {
        slug: "digital-transformation-healthcare",
        sector: "Healthcare",
        title: "Digital Transformation Roadmap",
        result: "40% reduction in time-to-insight",
        tags: ["Transformation", "AI Augmentation"],
        description: "Redesigned data infrastructure and decision-making processes for a regional healthcare system. Placed a Chief Digital Officer to carry forward.",
        url: "/cases/digital-transformation-healthcare",
    },
    {
        slug: "innovation-lab-manufacturing",
        sector: "Manufacturing",
        title: "Innovation Lab Launch",
        result: "2 new ventures in Year 1",
        tags: ["Innovation", "Venture Building"],
        description: "Built an internal innovation capability from scratch, including methodology, team, and first two venture concepts through to market validation.",
        url: "/cases/innovation-lab-manufacturing",
    },
];

export default function DataMigration() {
    const [status, setStatus] = useState("idle");
    const [log, setLog] = useState<string[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    const syncExpertPhotos = async () => {
        setStatus("migrating");
        setLog([]);
        addLog("Syncing expert photos with local data...");
        try {
            const q = query(collection(db, "experts"));
            const snap = await getDocs(q);
            let updatedCount = 0;

            for (const docSnap of snap.docs) {
                const data = docSnap.data();
                // Match by id if available, otherwise by name
                const expertSource = experts.find(e => e.id === data.id || e.name === data.name);

                if (expertSource && expertSource.imageUrl !== data.imageUrl) {
                    await updateDoc(docSnap.ref, {
                        imageUrl: expertSource.imageUrl
                    });
                    addLog(`Updated photo for: ${expertSource.name}`);
                    updatedCount++;
                }
            }

            addLog(`Successfully updated ${updatedCount} expert records.`);
            setStatus("done");
        } catch (e: any) {
            console.error(e);
            addLog(`Error syncing: ${e.message || e}`);
            setStatus("error");
        }
    };

    const migrate = async () => {
        setShowConfirm(false);
        setStatus("migrating");
        setLog([]);

        try {
            // Experts
            addLog("Migrating Experts...");
            for (const expert of experts) {
                await addDoc(collection(db, "experts"), {
                    ...expert,
                    status: "featured",
                    createdAt: serverTimestamp()
                });
            }
            addLog(`Migrated ${experts.length} experts.`);

            // Tools
            addLog("Migrating Tools...");
            for (const tool of staticTools) {
                const { status: legacyStatus, ...rest } = tool;
                await addDoc(collection(db, "tools"), {
                    ...rest,
                    stage: legacyStatus,
                    status: "featured",
                    createdAt: serverTimestamp()
                });
            }
            addLog(`Migrated ${staticTools.length} tools.`);

            // Ideas
            addLog("Migrating Ideas...");
            for (const idea of staticIdeas) {
                await addDoc(collection(db, "ideas"), {
                    ...idea,
                    content: idea.excerpt,
                    status: "featured",
                    createdAt: serverTimestamp()
                });
            }
            addLog(`Migrated ${staticIdeas.length} ideas.`);

            // Cases
            addLog("Migrating Cases...");
            for (const c of staticCases) {
                await addDoc(collection(db, "cases"), {
                    ...c,
                    status: "featured",
                    createdAt: serverTimestamp()
                });
            }
            addLog(`Migrated ${staticCases.length} cases.`);

            setStatus("done");
        } catch (e: any) {
            console.error(e);
            addLog(`Error: ${e.message || e}`);
            setStatus("error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 border border-dashed border-red-500/30 bg-red-500/5 rounded-xl shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-red-500">Database Initialization</h3>
                        <p className="text-xs text-muted-foreground">Import all original static content into Firestore.</p>
                    </div>
                </div>

                {!showConfirm && status === "idle" && (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
                    >
                        Initialize Database
                    </button>
                )}

                {showConfirm && (
                    <div className="flex flex-col gap-3 animate-fade-in">
                        <p className="text-xs font-medium text-red-600 dark:text-red-400">
                            Warning: This will create duplicates if already run. Are you sure?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={migrate}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-md"
                            >
                                Yes, Migrate Now
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-muted/20 hover:bg-muted/30 text-muted-foreground px-6 py-2 rounded-lg text-xs font-bold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border border-dashed border-accent/30 bg-accent/5 rounded-xl shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 4v1m0 14v1m-7-7h-1m16 0h-1m-4.24-4.24l.7-.7M5.64 18.36l.7-.7M18.36 18.36l-.7-.7M5.64 5.64l.7.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-accent">Sync Expert Data</h3>
                        <p className="text-xs text-muted-foreground">Update existing Firestore records with new photo URLs from experts.ts.</p>
                    </div>
                </div>

                {status === "idle" && (
                    <button
                        onClick={syncExpertPhotos}
                        className="bg-accent hover:bg-accent-muted text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-accent/20 active:scale-95"
                    >
                        Sync Photo URLs
                    </button>
                )}
            </div>

            <div className="p-6 border border-dashed border-red-500/30 bg-red-500/5 rounded-xl shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-red-500">Cleanup Duplicates</h3>
                        <p className="text-xs text-muted-foreground">Remove duplicate entries from all collections. Keeps the oldest version.</p>
                    </div>
                </div>

                {status === "idle" && (
                    <button
                        onClick={async () => {
                            if (!confirm("Are you sure you want to delete duplicate entries? This cannot be undone.")) return;
                            setStatus("migrating");
                            setLog([]);
                            addLog("Starting cleanup...");

                            try {
                                const collections = ["experts", "tools", "ideas", "cases"];

                                for (const colName of collections) {
                                    addLog(`Checking ${colName}...`);
                                    const q = query(collection(db, colName));
                                    const snap = await getDocs(q);

                                    const groups: Record<string, any[]> = {};

                                    // Group by unique field (title or name)
                                    snap.docs.forEach(doc => {
                                        const data = doc.data();
                                        const key = data.title || data.name || data.id; // Fallback to id if title/name missing
                                        if (!key) return;

                                        if (!groups[key]) groups[key] = [];
                                        groups[key].push({ id: doc.id, ...data, createdAt: data.createdAt });
                                    });

                                    let deletedCount = 0;

                                    for (const key in groups) {
                                        const items = groups[key];
                                        if (items.length > 1) {
                                            // Sort by createdAt (oldest first)
                                            items.sort((a, b) => {
                                                const timeA = a.createdAt?.seconds || 0;
                                                const timeB = b.createdAt?.seconds || 0;
                                                return timeA - timeB;
                                            });

                                            // Keep first (oldest), delete rest
                                            const toDelete = items.slice(1);

                                            for (const item of toDelete) {
                                                await deleteDoc(doc(db, colName, item.id));
                                                deletedCount++;
                                            }
                                        }
                                    }

                                    if (deletedCount > 0) {
                                        addLog(`Removed ${deletedCount} duplicates from ${colName}.`);
                                    } else {
                                        addLog(`No duplicates found in ${colName}.`);
                                    }
                                }

                                setStatus("done");
                                addLog("Cleanup complete.");
                            } catch (e: any) {
                                console.error(e);
                                addLog(`Error cleanup: ${e.message || e}`);
                                setStatus("error");
                            }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
                    >
                        Remove Duplicates
                    </button>
                )}
            </div>

            {(status === "migrating" || status === "done" || status === "error") && (
                <div className="mt-4 p-4 bg-surface border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${status === 'migrating' ? 'bg-amber-500 animate-pulse' : status === 'done' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {status === "migrating" ? "Operation in progress..." : status === "done" ? "Operation success" : "Operation failed"}
                        </span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1 border border-white/5">
                        {log.map((l, i) => (
                            <div key={i} className="text-[10px] font-mono text-muted-foreground flex gap-2">
                                <span className="opacity-30">[{i + 1}]</span>
                                <span>{l}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => { setStatus("idle"); setLog([]); }}
                        className="mt-4 text-[10px] text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest"
                    >
                        Reset Status
                    </button>
                </div>
            )}
        </div>
    );
}
