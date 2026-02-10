"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";

type AdminTab = "ideas" | "cases";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<AdminTab>("ideas");
    const { user } = useAuth();

    if (!user || user.role !== "admin") return null;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Content Section */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
                <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-foreground">Content Management</h3>
                    </div>
                    <div className="flex bg-background/50 p-1 rounded-lg border border-border">
                        <button
                            onClick={() => setActiveTab("ideas")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "ideas" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                                }`}
                        >
                            Ideas
                        </button>
                        <button
                            onClick={() => setActiveTab("cases")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "cases" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"
                                }`}
                        >
                            Cases
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === "ideas" && <CreateIdeaForm />}
                    {activeTab === "cases" && <CreateCaseForm />}
                </div>
            </div>

            {/* User Management Section */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
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
        </div>
    );
}



function CreateIdeaForm() {
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
            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

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

function CreateCaseForm() {
    const [sector, setSector] = useState("");
    const [title, setTitle] = useState("");
    const [result, setResult] = useState("");
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [published, setPublished] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `cases/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            const imgTag = `\n![${file.name}](${url})\n`;
            setDescription(prev => prev + imgTag);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const formatText = (command: string) => {
        if (command === 'bold') setDescription(prev => prev + ' **text** ');
        if (command === 'italic') setDescription(prev => prev + ' *text* ');
        if (command === 'h2') setDescription(prev => prev + '\n## Heading\n');
    };

    const handlePublish = async () => {
        if (!title || !description) {
            alert("Title and Description are required.");
            return;
        }

        setIsSaving(true);
        try {
            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            await addDoc(collection(db, "cases"), {
                sector,
                title,
                result,
                tags: tags.split(",").map(t => t.trim()),
                description,
                createdAt: serverTimestamp(),
            });

            setPublished(true);
            setSector("");
            setTitle("");
            setResult("");
            setTags("");
            setDescription("");
            setTimeout(() => setPublished(false), 5000);
        } catch (error) {
            console.error("Error publishing case:", error);
            alert("Failed to publish case study.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Create New Case Study</h4>
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
                <div className="grid grid-cols-2 gap-4">
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

                {/* Rich Text Description Area */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Description (Rich Text / Markdown)</label>
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none h-64 font-mono"
                        placeholder="Detail the case study... supports Markdown."
                    />
                </div>

                <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="bg-accent hover:bg-accent-muted text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 uppercase tracking-widest mt-2 disabled:opacity-50"
                >
                    {isSaving ? "Publishing..." : "Publish Case Study"}
                </button>
            </div>
        </div>
    );
}

function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Extract name and details from profiles
                    const client = data.clientProfile;
                    const expert = data.expertProfile;
                    const fellow = data.fellowProfile;

                    let role = "New";
                    const roles = [];
                    if (client) roles.push("Client");
                    if (expert) roles.push("Expert");
                    if (fellow) roles.push("Fellow");

                    if (roles.length > 2) role = "Multi";
                    else if (roles.length === 2) role = "Hybrid";
                    else if (roles.length === 1) role = roles[0];

                    return {
                        id: doc.id,
                        name: client ? `${client.firstName} ${client.lastName}` : (expert ? `${expert.firstName} ${expert.lastName}` : (fellow ? `${fellow.firstName} ${fellow.lastName}` : "Unnamed User")),
                        email: data.email || client?.email || expert?.email || fellow?.email || "No Email",
                        company: client?.company || fellow?.university || "N/A",
                        role,
                        status: data.role === "admin" ? "Admin" : (client || expert || fellow ? "Active" : "Pending"),
                        createdAt: data.createdAt
                    };
                });
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const filteredAndSortedUsers = users
        .filter(u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.company.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const factor = sortOrder === "asc" ? 1 : -1;
            const valA = a[sortField]?.toString().toLowerCase() || "";
            const valB = b[sortField]?.toString().toLowerCase() || "";
            return valA.localeCompare(valB) * factor;
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users by name, email, or company..."
                        className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none"
                    />
                </div>
                <div className="text-xs text-muted font-medium">
                    {filteredAndSortedUsers.length} Users found
                </div>
            </div>

            {/* Users Table */}
            <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            {[
                                { key: 'name', label: 'Name' },
                                { key: 'email', label: 'Email' },
                                { key: 'company', label: 'Company' },
                                { key: 'role', label: 'Type' },
                                { key: 'status', label: 'Status' }
                            ].map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {sortField === col.key && (
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={sortOrder === 'desc' ? 'rotate-180' : ''}>
                                                <path d="m18 15-6-6-6 6" />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredAndSortedUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{u.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                                <td className="px-4 py-3 text-muted-foreground">{u.company}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'Expert' ? 'bg-violet-500/10 text-violet-500' :
                                            u.role === 'Fellow' ? 'bg-emerald-500/10 text-emerald-500' :
                                                u.role === 'Hybrid' || u.role === 'Multi' ? 'bg-accent/10 text-accent' :
                                                    'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Admin' ? 'bg-red-500/10 text-red-500' :
                                        u.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                            'bg-orange-500/10 text-orange-500'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAndSortedUsers.length === 0 && (
                    <div className="p-8 text-center text-muted text-sm">
                        No users found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
