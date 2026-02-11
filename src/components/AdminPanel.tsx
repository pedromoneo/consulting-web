"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CreateIdeaForm from "./admin/CreateIdeaForm";
import CreateCaseForm from "./admin/CreateCaseForm";
import CreateToolForm from "./admin/CreateToolForm";
import CreateExpertForm from "./admin/CreateExpertForm";
import UserManagement from "./admin/UserManagement";
import ManageContent from "./admin/ManageContent";
import DataMigration from "./admin/DataMigration";

type AdminTab = "ideas" | "cases" | "tools" | "experts";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<AdminTab>("ideas");
    const [editingItem, setEditingItem] = useState<any>(null);
    const { user } = useAuth();

    if (!user || user.role !== "admin") return null;

    const handleTabChange = (tab: AdminTab) => {
        setActiveTab(tab);
        setEditingItem(null);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const expertColumns = [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        {
            key: "imageUrl",
            label: "Photo",
            render: (item: any) => item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-full object-cover border border-border" /> : <div className="w-8 h-8 rounded-full bg-muted" />
        }
    ];

    const toolColumns = [
        {
            key: "iconUrl",
            label: "Icon",
            render: (item: any) => item.iconUrl ? <img src={item.iconUrl} alt={item.title} className="w-8 h-8 rounded bg-muted/10 object-cover border border-border" /> : <div className="w-8 h-8 rounded bg-muted" />
        },
        { key: "title", label: "Title" },
        {
            key: "stage",
            label: "Stage",
            render: (item: any) => (
                <span className={`text-[10px] px-2 py-0.5 rounded border ${item.stage === "Live" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                    item.stage === "Beta" ? "bg-accent/10 text-accent border-accent/20" :
                        "bg-muted/10 text-muted border-muted/20"
                    }`}>
                    {item.stage || item.status}
                </span>
            )
        },
    ];

    const ideaColumns = [
        { key: "title", label: "Title" },
        { key: "date", label: "Date" },
        {
            key: "tags",
            label: "Tags",
            render: (item: any) => (
                <div className="flex gap-1 flex-wrap max-w-[200px]">
                    {item.tags?.slice(0, 2).map((t: string, i: number) => (
                        <span key={i} className="text-[9px] bg-muted/20 px-1 py-0.5 rounded text-muted-foreground">{t}</span>
                    ))}
                    {item.tags?.length > 2 && <span className="text-[9px] text-muted-foreground">+{item.tags.length - 2}</span>}
                </div>
            )
        }
    ];

    const caseColumns = [
        { key: "title", label: "Title" },
        { key: "sector", label: "Sector" },
        { key: "result", label: "Result" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Content Section */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
                <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between flex-wrap gap-4 transition-colors hover:bg-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-foreground">Content Management</h3>
                    </div>

                    <div className="flex bg-background/50 p-1 rounded-lg border border-border overflow-x-auto max-w-full">
                        {["ideas", "cases", "tools", "experts"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab as AdminTab)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap capitalize ${activeTab === tab ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Form Slot (Create or Edit) */}
                    <div className="mb-8 p-4 bg-background/50 rounded-xl border border-border/50">
                        {activeTab === "ideas" && (
                            <CreateIdeaForm
                                key={editingItem?.id || "new"}
                                initialData={editingItem}
                                onComplete={() => setEditingItem(null)}
                                onCancel={() => setEditingItem(null)}
                            />
                        )}
                        {activeTab === "cases" && (
                            <CreateCaseForm
                                key={editingItem?.id || "new"}
                                initialData={editingItem}
                                onComplete={() => setEditingItem(null)}
                                onCancel={() => setEditingItem(null)}
                            />
                        )}
                        {activeTab === "tools" && (
                            <CreateToolForm
                                key={editingItem?.id || "new"}
                                initialData={editingItem}
                                onComplete={() => setEditingItem(null)}
                                onCancel={() => setEditingItem(null)}
                            />
                        )}
                        {activeTab === "experts" && (
                            <CreateExpertForm
                                key={editingItem?.id || "new"}
                                initialData={editingItem}
                                onComplete={() => setEditingItem(null)}
                                onCancel={() => setEditingItem(null)}
                            />
                        )}
                    </div>

                    {/* Manage List */}
                    {activeTab === "ideas" && <ManageContent collectionName="ideas" columns={ideaColumns} onEdit={handleEdit} />}
                    {activeTab === "cases" && <ManageContent collectionName="cases" columns={caseColumns} onEdit={handleEdit} />}
                    {activeTab === "tools" && <ManageContent collectionName="tools" columns={toolColumns} onEdit={handleEdit} />}
                    {activeTab === "experts" && <ManageContent collectionName="experts" columns={expertColumns} onEdit={handleEdit} />}
                </div>
            </div>

            {/* User Management Section */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
                <div className="border-b border-border bg-background px-6 py-4 transition-colors hover:bg-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-foreground">User Management</h3>
                    </div>
                </div>
                <div className="p-6">
                    <UserManagement />
                </div>
            </div>

            {/* Data Migration Section (Bottom) */}
            <div className="mt-8">
                <DataMigration />
            </div>
        </div>
    );
}
