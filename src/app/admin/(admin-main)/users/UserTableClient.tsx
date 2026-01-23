"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { User, Mail, Shield, CheckCircle2, XCircle, RefreshCcw, Search, Phone, Package, Trash2 } from "lucide-react";
import { toggleUserStatus, updateUserRole, deleteUser } from "@/app/actions/admin";
import { toast } from "sonner";
import RoyalEmptyState from "@/components/ui/RoyalEmptyState";
import RoyalBadge from "@/components/ui/RoyalBadge";

interface UserTableClientProps {
    initialUsers: any[];
}

export default function UserTableClient({ initialUsers }: UserTableClientProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [roleLoadingId, setRoleLoadingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"staff" | "customers" | "demo">("customers");

    const filteredUsers = initialUsers.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const isStaff = user.role === 'admin' || user.role === 'agency';
        const isDemo = user.package?.slug === 'demo';

        if (activeTab === "staff") return matchesSearch && isStaff;
        if (activeTab === "demo") return matchesSearch && isDemo && !isStaff;
        return matchesSearch && !isStaff && !isDemo;
    });

    // Pre-calculate counts for tabs
    const staffCount = initialUsers.filter(u => u.role === 'admin' || u.role === 'agency').length;
    const demoCount = initialUsers.filter(u => u.package?.slug === 'demo' && u.role !== 'admin' && u.role !== 'agency').length;
    const customerCount = initialUsers.length - staffCount - demoCount;

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        setLoadingId(userId);
        try {
            const result = await toggleUserStatus(userId, currentStatus);
            if (result.success) {
                toast.success(currentStatus ? "Akun dinonaktifkan" : "Akun berhasil diaktifkan");
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
                // Refresh page to update list
                window.location.reload();
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
                        onClick={() => setActiveTab("customers")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "customers"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        CUSTOMER
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "customers" ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400"
                            }`}>
                            {customerCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("demo")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "demo"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        DEMO USERS
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "demo" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400"
                            }`}>
                            {demoCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("staff")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "staff"
                            ? "bg-[#D4AF37] text-white shadow-lg shadow-amber-500/20"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        ADMIN & SELLER
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "staff" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-400"
                            }`}>
                            {staffCount}
                        </span>
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder={`Cari ${activeTab === "staff" ? "admin/seller" : activeTab === "demo" ? "demo user" : "customer"} berdasarkan nama atau email...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
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
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
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
                        )) : (
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
        </div>
    );
}
