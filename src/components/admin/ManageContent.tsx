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
                ...doc.data(),
                id: doc.id
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

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const checkDelete = (id: string) => {
        setItemToDelete(id);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        const id = itemToDelete;
        setDeletingId(id);
        setItemToDelete(null); // Close modal

        // Optimistic update
        const previousItems = [...items];
        setItems(prev => prev.filter(i => i.id !== id));

        console.log(`Attempting to delete item ${id} from collection ${collectionName}`);

        try {
            await deleteDoc(doc(db, collectionName, id));
            console.log(`Successfully deleted item ${id}`);
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item: " + (error as any).message);
            setItems(previousItems); // Revert on error
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted text-xs">Loading content...</div>;

    if (items.length === 0) return (
        <div className="p-8 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted text-sm">No items found in {collectionName}.</p>
        </div>
    );

    return (
        <div className="border border-border rounded-xl overflow-hidden overflow-x-auto mt-8 bg-surface/50 backdrop-blur-sm relative">
            {itemToDelete && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-2xl max-w-sm w-full space-y-4">
                        <div className="space-y-2 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Delete Item?</h3>
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete this item? This action cannot be undone.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="px-4 py-2 rounded-lg bg-muted/10 hover:bg-muted/20 text-muted-foreground font-bold text-xs transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow-lg shadow-red-500/20"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-background px-4 py-3 border-b border-border text-left flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Manage {collectionName}</h4>
                <span className="text-[10px] text-muted-foreground font-mono bg-muted/10 px-2 py-0.5 rounded">{items.length} items</span>
            </div>
            <table className="w-full text-left text-xs">
                {/* ... (thead remains same) ... */}
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
                        <tr key={item.id} className={`transition-colors text-left hover:bg-white/50 ${deletingId === item.id ? 'opacity-50 pointer-events-none' : ''}`}>
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
                                            disabled={deletingId === item.id}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => checkDelete(item.id)}
                                        className="text-muted hover:text-red-500 transition-colors p-1"
                                        title="Delete"
                                        disabled={deletingId === item.id}
                                    >
                                        {deletingId === item.id ? (
                                            <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        )}
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
