"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateIdeaForm() {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [date, setDate] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `ideas/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            // Insert image markdown or HTML into content
            const imgTag = `\n![${file.name}](${url})\n`;
            setContent(prev => prev + imgTag);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const formatText = (command: string) => {
        // Simple markdown helpers
        if (command === 'bold') setContent(prev => prev + ' **text** ');
        if (command === 'italic') setContent(prev => prev + ' *text* ');
        if (command === 'h2') setContent(prev => prev + '\n## Heading\n');
    };

    const [isSaving, setIsSaving] = useState(false);
    const [published, setPublished] = useState(false);

    const handlePublish = async () => {
        if (!title || !content) {
            alert("Title and Content are required.");
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(db, "ideas"), {
                title,
                tags: tags.split(",").map(t => t.trim()),
                date,
                excerpt,
                content,
                createdAt: serverTimestamp(),
            });

            setPublished(true);
            setTitle("");
            setTags("");
            setDate("");
            setExcerpt("");
            setContent("");
            setTimeout(() => setPublished(false), 5000);
        } catch (error) {
            console.error("Error publishing idea:", error);
            alert("Failed to publish idea.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Create New Idea</h4>
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
                <div className="grid grid-cols-2 gap-4">
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
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Content (Rich Text / Markdown)</label>
                        <div className="flex items-center gap-2">
                            <button onClick={() => formatText('bold')} className="p-1.5 hover:bg-surface rounded text-xs border border-border" title="Bold">B</button>
                            <button onClick={() => formatText('italic')} className="p-1.5 hover:bg-surface rounded text-xs border border-border italic" title="Italic">I</button>
                            <button onClick={() => formatText('h2')} className="p-1.5 hover:bg-surface rounded text-xs border border-border font-bold" title="H2">H2</button>
                            <label className="cursor-pointer p-1.5 hover:bg-surface rounded text-xs border border-border flex items-center gap-1">
                                {isUploading ? '...' : (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                    </svg>
                                )}
                                Image
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                        </div>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none h-64 font-mono"
                        placeholder="Start typing your content here... supports Markdown."
                    />
                </div>

                <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="bg-accent hover:bg-accent-muted text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 uppercase tracking-widest mt-2 disabled:opacity-50"
                >
                    {isSaving ? "Publishing..." : "Publish Idea"}
                </button>
            </div>
        </div>
    );
}
