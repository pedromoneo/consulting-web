"use client";

import RichTextEditor from "./RichTextEditor";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

interface CaseFormProps {
    initialData?: any;
    onComplete?: () => void;
    onCancel?: () => void;
}

export default function CreateCaseForm({ initialData, onComplete, onCancel }: CaseFormProps = {}) {
    const [sector, setSector] = useState(initialData?.sector || "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [result, setResult] = useState(initialData?.result || "");
    const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [status, setStatus] = useState(initialData?.status || "published");
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [published, setPublished] = useState(false);


    const handlePublish = async () => {
        if (!title || !description) {
            alert("Title and Description are required.");
            return;
        }

        setIsSaving(true);
        try {
            const data = {
                sector,
                title,
                result,
                tags: tags.split(",").map((t: string) => t.trim()),
                excerpt,
                description,
                status,
                updatedAt: serverTimestamp(),
            };

            if (initialData?.id) {
                await updateDoc(doc(db, "cases", initialData.id), data);
                setPublished(true);
            } else {
                await addDoc(collection(db, "cases"), {
                    ...data,
                    createdAt: serverTimestamp(),
                });

                setPublished(true);
                setSector("");
                setTitle("");
                setResult("");
                setTags("");
                setExcerpt("");
                setDescription("");
                setStatus("published");
            }

            if (onComplete) onComplete();
            setTimeout(() => setPublished(false), 5000);
        } catch (error) {
            console.error("Error saving case:", error);
            alert("Failed to save case study.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                {initialData?.id ? "Edit Case Study" : "Create New Case Study"}
            </h4>
            {published && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-lg animate-fade-in">
                    Case study published successfully!
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Client Sector</label>
                        <input
                            type="text"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="Fintech, Retail, etc."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="Global Supply Chain Transformation"
                        />
                    </div>
                </div>

                {/* Result and Tags moved above Description */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Visibility</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={`w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none appearance-none font-bold ${status === 'featured' ? 'text-accent' : status === 'published' ? 'text-green-500' : 'text-muted'
                                }`}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="featured">Featured</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Measurable Result</label>
                        <input
                            type="text"
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="45% Efficiency Gain"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="AI, Supply Chain, Operations"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Excerpt (Short Summary)</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none h-16 resize-none"
                        placeholder="Brief summary for list view..."
                    />
                </div>

                {/* Rich Text Description Area */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Description</label>
                    <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        onImageUpload={async (file: File) => {
                            const storageRef = ref(storage, `cases/${Date.now()}_${file.name}`);
                            await uploadBytes(storageRef, file);
                            return await getDownloadURL(storageRef);
                        }}
                        placeholder="Detail the case study..."
                    />
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        onClick={handlePublish}
                        disabled={isSaving}
                        className="flex-1 bg-accent hover:bg-accent-muted text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 uppercase tracking-widest disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : initialData?.id ? "Update Case Study" : "Publish Case Study"}
                    </button>
                    {initialData?.id && (
                        <button
                            onClick={onCancel}
                            className="bg-muted/20 hover:bg-muted/30 text-muted-foreground text-xs font-bold py-3 px-6 rounded-lg transition-all uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
