"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function UserManagement() {
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
                    <thead className="bg-background border-b border-border">
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
                                    className="px-4 py-3 font-semibold cursor-pointer transition-colors hover:bg-white/50"
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
                            <tr key={u.id} className="transition-colors hover:bg-white/50">
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
