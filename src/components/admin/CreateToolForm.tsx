"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateToolForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [status, setStatus] = useState("Beta");
    const [isUploading, setIsUploading] = useState(false);
    const [iconUrl, setIconUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [published, setPublished] = useState(false);

    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `tools/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setIconUrl(url);
        } catch (error) {
            console.error("Error uploading icon:", error);
            alert("Failed to upload icon.");
        } finally {
            setIsUploading(false);
        }
    };

    const handlePublish = async () => {
        if (!title || !description) {
            alert("Title and Description are required.");
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(db, "tools"), {
                title,
                description,
                link,
                status,
                iconUrl,
                createdAt: serverTimestamp(),
            });

            setPublished(true);
            setTitle("");
            setDescription("");
            setLink("");
            setStatus("Beta");
            setIconUrl("");
            setTimeout(() => setPublished(false), 5000);
        } catch (error) {
            console.error("Error publishing tool:", error);
            alert("Failed to publish tool.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Create New Tool</h4>
            {published && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-lg animate-fade-in">
                    Tool published successfully!
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Tool Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="Market Intelligence Dashboard"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none appearance-none"
                        >
                            <option value="Live">Live</option>
                            <option value="Beta">Beta</option>
                            <option value="Internal Only">Internal Only</option>
                            <option value="Coming Soon">Coming Soon</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Link (Optional)</label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Icon (Square Image)</label>
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-muted hover:border-accent transition-colors flex items-center justify-center gap-2">
                                {isUploading ? (
                                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                )}
                                {iconUrl ? "Change Icon" : "Upload Icon"}
                                <input type="file" className="hidden" accept="image/*" onChange={handleIconUpload} disabled={isUploading} />
                            </label>
                            {iconUrl && (
                                <div className="w-9 h-9 rounded bg-accent/10 flex items-center justify-center border border-border overflow-hidden">
                                    <img src={iconUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none h-24 resize-none"
                        placeholder="Real-time analysis of industry trends..."
                    />
                </div>

                <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="bg-accent hover:bg-accent-muted text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 uppercase tracking-widest mt-2 disabled:opacity-50"
                >
                    {isSaving ? "Publishing..." : "Publish Tool"}
                </button>
            </div>
        </div>
    );
}
