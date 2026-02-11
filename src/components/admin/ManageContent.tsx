"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Column = {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
};

interface ManageContentProps {
    collectionName: string;
    columns: Column[];
    onEdit?: (item: any) => void;
}

export default function ManageContent({ collectionName, columns, onEdit }: ManageContentProps) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    useEffect(() => {
        const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(data);
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName]);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedItems = [...items].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let valA = a[key] ?? "";
        let valB = b[key] ?? "";

        // Handle specific types (arrays, objects)
        if (Array.isArray(valA)) valA = valA.join(" ");
        if (Array.isArray(valB)) valB = valB.join(" ");

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, collectionName, id), { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item");
        }
    };

    if (loading) return <div className="p-8 text-center text-muted text-xs">Loading content...</div>;

    if (items.length === 0) return (
        <div className="p-8 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted text-sm">No items found in {collectionName}.</p>
        </div>
    );

    return (
        <div className="border border-border rounded-xl overflow-hidden overflow-x-auto mt-8 bg-surface/50 backdrop-blur-sm">
            <div className="bg-background px-4 py-3 border-b border-border text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Manage {collectionName}</h4>
            </div>
            <table className="w-full text-left text-xs">
                <thead className="bg-background border-b border-border">
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className="px-4 py-4 font-bold text-foreground/90 uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors hover:bg-white/50"
                                onClick={() => handleSort(col.key)}
                            >
                                <div className="flex items-center gap-2">
                                    {col.label}
                                    <span className="text-accent/50">
                                        {sortConfig?.key === col.key ? (
                                            sortConfig.direction === "asc" ? "↑" : "↓"
                                        ) : "↕"}
                                    </span>
                                </div>
                            </th>
                        ))}
                        <th
                            className="px-4 py-4 font-bold text-foreground/90 uppercase tracking-widest w-32 cursor-pointer transition-colors hover:bg-white/50"
                            onClick={() => handleSort("status")}
                        >
                            <div className="flex items-center gap-2">
                                Status
                                <span className="text-accent/50">
                                    {sortConfig?.key === "status" ? (
                                        sortConfig.direction === "asc" ? "↑" : "↓"
                                    ) : "↕"}
                                </span>
                            </div>
                        </th>
                        <th className="px-4 py-4 font-bold text-foreground/90 uppercase tracking-widest w-24 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {sortedItems.map((item) => (
                        <tr key={item.id} className="transition-colors group text-left hover:bg-white/50">
                            {columns.map(col => (
                                <td key={col.key} className="px-4 py-4 font-medium text-foreground whitespace-nowrap">
                                    {col.render ? col.render(item) : item[col.key]}
                                </td>
                            ))}
                            <td className="px-4 py-4 text-center">
                                <select
                                    value={item.status || "draft"}
                                    onChange={(e) => updateStatus(item.id, e.target.value)}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border outline-none cursor-pointer w-full appearance-none text-center transition-all ${item.status === 'featured' ? 'bg-accent text-white border-accent shadow-sm' :
                                        item.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            'bg-background text-muted-foreground border-border'
                                        }`}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="featured">Featured</option>
                                </select>
                            </td>
                            <td className="px-4 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-right">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-muted hover:text-accent transition-colors p-1"
                                            title="Edit"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="text-muted hover:text-red-500 transition-colors p-1"
                                        title="Delete"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
