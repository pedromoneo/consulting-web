"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import UserChatLogs from "./UserChatLogs";

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedUserForChat, setSelectedUserForChat] = useState<{ id: string, name: string } | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
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
                    expertStatus: expert?.status || (expert ? "pending" : null),
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

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                "expertProfile.status": newStatus
            });

            // If approved, trigger email (mocked for now)
            if (newStatus === "approved") {
                console.log(`Sending welcome email to user ${userId}`);
                try {
                    await fetch("/api/send-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, type: "expert-approval" })
                    });
                } catch (e) {
                    console.error("Failed to send email", e);
                }
            }

            // Refresh list
            fetchUsers();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

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

    // Pagination logic
    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                    <thead className="bg-background border-b border-border">
                        <tr>
                            {[
                                { key: 'name', label: 'Name' },
                                { key: 'email', label: 'Email' },
                                { key: 'company', label: 'Company' },
                                { key: 'role', label: 'Type' },
                                { key: 'status', label: 'Status' },
                                { key: 'actions', label: 'Actions' }
                            ].map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.key !== 'actions' && handleSort(col.key)}
                                    className={`px-4 py-3 font-semibold ${col.key !== 'actions' ? 'cursor-pointer hover:bg-white/50' : ''} transition-colors`}
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
                        {paginatedUsers.map((u) => (
                            <tr key={u.id} className="transition-colors hover:bg-white/50">
                                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{u.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                                <td className="px-4 py-3 text-muted-foreground">{u.company}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role.includes('Expert') ? 'bg-violet-500/10 text-violet-500' :
                                        u.role === 'Fellow' ? 'bg-emerald-500/10 text-emerald-500' :
                                            u.role === 'Hybrid' || u.role === 'Multi' ? 'bg-accent/10 text-accent' :
                                                'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {u.role.includes('Expert') ? (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.expertStatus === 'approved' ? 'bg-green-500/10 text-green-500' :
                                            u.expertStatus === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-600'
                                            }`}>
                                            {u.expertStatus === 'approved' ? 'Expert' :
                                                u.expertStatus === 'rejected' ? 'Rejected' :
                                                    'Review'}
                                        </span>
                                    ) : (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Admin' ? 'bg-red-500/10 text-red-500' :
                                            u.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                                'bg-orange-500/10 text-orange-500'
                                            }`}>
                                            {u.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 items-center">
                                        <button
                                            onClick={() => setSelectedUserForChat({ id: u.id, name: u.name })}
                                            className="text-[10px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 px-2 py-1 rounded font-bold transition-colors border border-sky-500/20"
                                        >
                                            Logs
                                        </button>
                                        {u.role.includes('Expert') && u.expertStatus !== 'approved' && u.expertStatus !== 'rejected' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(u.id, "approved")}
                                                    className="text-[10px] bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded font-bold transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(u.id, "rejected")}
                                                    className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2 py-1 rounded font-bold transition-colors border border-red-500/20"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 bg-background border border-border rounded-lg p-3">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="text-xs px-3 py-1.5 rounded bg-muted/10 hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-[10px] text-muted-foreground font-mono">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="text-xs px-3 py-1.5 rounded bg-muted/10 hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
            {/* Chat Logs Modal */}
            {selectedUserForChat && (
                <UserChatLogs
                    userId={selectedUserForChat.id}
                    userName={selectedUserForChat.name}
                    onClose={() => setSelectedUserForChat(null)}
                />
            )}
        </div>
    );
}
