"use client";

import RichTextEditor from "./RichTextEditor";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

interface IdeaFormProps {
    initialData?: any;
    onComplete?: () => void;
    onCancel?: () => void;
}

export default function CreateIdeaForm({ initialData, onComplete, onCancel }: IdeaFormProps = {}) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
    const [date, setDate] = useState(initialData?.date || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [status, setStatus] = useState(initialData?.status || "published");
    const [isUploading, setIsUploading] = useState(false);


    const [isSaving, setIsSaving] = useState(false);
    const [published, setPublished] = useState(false);

    const handlePublish = async () => {
        if (!title || !content) {
            alert("Title and Content are required.");
            return;
        }

        setIsSaving(true);
        try {
            const data = {
                title,
                tags: tags.split(",").map((t: string) => t.trim()),
                date,
                excerpt,
                content,
                status,
                updatedAt: serverTimestamp(),
            };

            if (initialData?.id) {
                await updateDoc(doc(db, "ideas", initialData.id), data);
                setPublished(true);
            } else {
                await addDoc(collection(db, "ideas"), {
                    ...data,
                    createdAt: serverTimestamp(),
                });

                setPublished(true);
                setTitle("");
                setTags("");
                setDate("");
                setExcerpt("");
                setContent("");
                setStatus("published");
            }

            if (onComplete) onComplete();
            setTimeout(() => setPublished(false), 5000);
        } catch (error) {
            console.error("Error saving idea:", error);
            alert("Failed to save idea.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                {initialData?.id ? "Edit Idea" : "Create New Idea"}
            </h4>
            {published && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-lg animate-fade-in">
                    Idea published successfully!
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                        placeholder="The Future of Consulting..."
                    />
                </div>
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
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="AI, Strategy, Growth"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Date</label>
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                            placeholder="Feb 2026"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Excerpt</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none h-20"
                        placeholder="Brief summary of the article..."
                    />
                </div>

                {/* Rich Text Area */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Content</label>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                        onImageUpload={async (file: File) => {
                            const storageRef = ref(storage, `ideas/${Date.now()}_${file.name}`);
                            await uploadBytes(storageRef, file);
                            return await getDownloadURL(storageRef);
                        }}
                        placeholder="Start typing your content here..."
                    />
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        onClick={handlePublish}
                        disabled={isSaving}
                        className="flex-1 bg-accent hover:bg-accent-muted text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 uppercase tracking-widest disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : initialData?.id ? "Update Idea" : "Publish Idea"}
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
