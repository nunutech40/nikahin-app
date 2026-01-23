"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { User, Mail, Shield, CheckCircle2, XCircle, RefreshCcw, Search, Phone, Package, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { toggleUserStatus, updateUserRole, deleteUser, getPaginatedUsers } from "@/app/actions/admin";
import { toast } from "sonner";
import RoyalEmptyState from "@/components/ui/RoyalEmptyState";
import RoyalBadge from "@/components/ui/RoyalBadge";

interface UserTableClientProps {
    initialUsers: any[];
    initialTotal: number;
    initialStaffCount: number;
    initialDemoCount: number;
    initialCustomerCount: number;
}

export default function UserTableClient({
    initialUsers,
    initialTotal,
    initialStaffCount,
    initialDemoCount,
    initialCustomerCount
}: UserTableClientProps) {
    const [users, setUsers] = useState<any[]>(initialUsers);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [roleLoadingId, setRoleLoadingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"staff" | "customers" | "demo">("customers");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(initialTotal);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialUsers.length < initialTotal);
    const [isSearching, setIsSearching] = useState(false);

    // Tab counts (could be updated if needed, but for now we use initials and update customers/demo/staff if needed)
    // Actually, it's better to keep counts separate if we want real-time accuracy, but let's stick to initial for now or fetch them.
    const [counts, setCounts] = useState({
        staff: initialStaffCount,
        demo: initialDemoCount,
        customers: initialCustomerCount
    });

    // Helper to fetch data
    const fetchUsers = useCallback(async (pageNum: number, searchVal: string, tabVal: any, isNew: boolean = false) => {
        if (isNew) setIsSearching(true);
        else setIsLoadingMore(true);

        try {
            const result = await getPaginatedUsers({
                page: pageNum,
                limit: 10,
                search: searchVal,
                tab: tabVal as any
            });

            if (result.success && result.data) {
                if (isNew) {
                    setUsers(result.data);
                    setTotal(result.total || 0);
                    setHasMore(result.data.length < (result.total || 0));
                } else {
                    setUsers(prev => [...prev, ...result.data!]);
                    setHasMore((users.length + result.data.length) < (result.total || 0));
                }
            }
        } catch (error) {
            toast.error("Gagal memuat data user");
        } finally {
            setIsSearching(false);
            setIsLoadingMore(false);
        }
    }, [users.length]);

    // Handle search and tab changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) {
                fetchUsers(1, searchQuery, activeTab.includes("customers") ? "customers" : activeTab.includes("demo") ? "demo" : "staff", true);
            } else {
                setPage(1); // This will trigger the page change effect
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, activeTab]);

    // Handle page changes
    useEffect(() => {
        if (page > 1) {
            fetchUsers(page, searchQuery, activeTab.includes("customers") ? "customers" : activeTab.includes("demo") ? "demo" : "staff", false);
        }
    }, [page]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        setLoadingId(userId);
        try {
            const result = await toggleUserStatus(userId, currentStatus);
            if (result.success) {
                toast.success(currentStatus ? "Akun dinonaktifkan" : "Akun berhasil diaktifkan");
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
            } else {
                toast.error(result.error || "Gagal mengubah status user");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleToggleRole = async (userId: number, currentRole: string) => {
        const newRole = currentRole === "agency" ? "customer" : "agency";
        setRoleLoadingId(userId);
        try {
            const result = await updateUserRole(userId, newRole);
            if (result.success) {
                toast.success(`User berhasil diubah menjadi ${newRole.toUpperCase()}`);
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                toast.error(result.error || "Gagal mengubah role");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setRoleLoadingId(null);
        }
    };

    const handleDeleteUser = async (userId: number, userEmail: string) => {
        if (!confirm(`⚠️ PERINGATAN!\n\nAnda yakin ingin menghapus user:\n${userEmail}\n\nSemua undangan user ini juga akan dihapus!\n\nTindakan ini TIDAK BISA dibatalkan!`)) {
            return;
        }

        setLoadingId(userId);
        try {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success(result.message || "User berhasil dihapus");
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                toast.error(result.error || "Gagal menghapus user");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Tabs & Search */}
            <div className="p-6 pb-2 space-y-6">
                <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
                    <button
                        onClick={() => {
                            setActiveTab("customers");
                            setPage(1);
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab.includes("customers")
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        CUSTOMER
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab.includes("customers") ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400"
                            }`}>
                            {counts.customers}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("demo");
                            setPage(1);
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab.includes("demo")
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        DEMO USERS
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab.includes("demo") ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400"
                            }`}>
                            {counts.demo}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("staff");
                            setPage(1);
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab.includes("staff")
                            ? "bg-[#D4AF37] text-white shadow-lg shadow-amber-500/20"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        ADMIN & SELLER
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab.includes("staff") ? "bg-white/20 text-white" : "bg-slate-200 text-slate-400"
                            }`}>
                            {counts.staff}
                        </span>
                    </button>
                </div>

                <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isSearching ? "text-[#D4AF37] animate-pulse" : "text-slate-300"}`} />
                    <input
                        type="text"
                        placeholder={`Cari ${activeTab.includes("staff") ? "admin/seller" : activeTab.includes("demo") ? "demo user" : "customer"} berdasarkan nama atau email...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                    />
                </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi User</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Role & Access</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Paket</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Terdaftar</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.length > 0 ? users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-all overflow-hidden">
                                            {user.name ? (
                                                <span className="font-black text-lg text-[#D4AF37]">{user.name.charAt(0)}</span>
                                            ) : (
                                                <User className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 line-clamp-1">{user.name || user.email.split('@')[0]}</p>
                                            <div className="flex flex-col gap-0.5 mt-0.5">
                                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <a
                                                        href={`https://wa.me/${user.phone.replace(/^0/, '62')}`}
                                                        target="_blank"
                                                        className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold hover:underline"
                                                    >
                                                        <Phone className="w-3 h-3" />
                                                        {user.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button
                                        onClick={() => user.role !== 'admin' && handleToggleRole(user.id, user.role)}
                                        disabled={roleLoadingId === user.id || user.role === 'admin'}
                                        className={`transition-transform active:scale-95 ${user.role !== 'admin' ? 'cursor-pointer' : 'cursor-default'}`}
                                        title={user.role !== 'admin' ? "Klik untuk ganti Role" : "Admin role cannot be changed"}
                                    >
                                        <RoyalBadge
                                            variant={user.role === 'admin' ? "gold" : user.role === 'agency' ? "success" : "info"}
                                            icon={Shield}
                                            className={roleLoadingId === user.id ? "animate-pulse" : ""}
                                        >
                                            {user.role === 'agency' ? 'Seller (Agency)' : user.role}
                                        </RoyalBadge>
                                    </button>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {user.package ? (
                                        <RoyalBadge
                                            variant={
                                                user.package.slug === 'gold' ? 'gold' :
                                                    user.package.slug === 'silver' ? 'neutral' :
                                                        'info'
                                            }
                                            icon={Package}
                                        >
                                            {user.package.name}
                                        </RoyalBadge>
                                    ) : (
                                        <span className="text-xs text-slate-300 font-medium">Belum berlangganan</span>
                                    )}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <RoyalBadge variant={user.isActive ? "success" : "neutral"} icon={user.isActive ? CheckCircle2 : XCircle}>
                                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                                    </RoyalBadge>
                                </td>
                                <td className="px-6 py-5 text-center text-sm text-slate-500 font-medium">
                                    {format(new Date(user.createdAt), "d MMM yyyy", { locale: id })}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                                            disabled={loadingId === user.id}
                                            className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                    ${user.isActive
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}
                    disabled:opacity-50
                  `}
                                        >
                                            {loadingId === user.id ? (
                                                <RefreshCcw className="w-4 h-4 animate-spin" />
                                            ) : user.isActive ? 'Nonaktifkan' : 'Aktifkan Akun'}
                                        </button>

                                        {/* Delete Button (only for non-admin users) */}
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                disabled={loadingId === user.id}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                                                title="Hapus user & semua undangannya"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : isSearching ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Mencari data...</p>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    <RoyalEmptyState
                                        title="User tidak ditemukan"
                                        description="Coba gunakan email lain atau hapus filter pencarian kamu."
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Load More */}
            {hasMore && (
                <div className="p-8 flex justify-center border-t border-slate-50 bg-slate-50/30">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all group disabled:opacity-50"
                    >
                        {isLoadingMore ? (
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                        ) : (
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        )}
                        Load More Users ({users.length} of {total})
                    </button>
                </div>
            )}
        </div>
    );
}

