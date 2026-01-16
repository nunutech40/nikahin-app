"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { User, Mail, Shield, CheckCircle2, XCircle, RefreshCcw, Search, Phone, Package } from "lucide-react";
import { toggleUserStatus, updateUserRole } from "@/app/actions/admin";
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

    const filteredUsers = initialUsers.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="p-6 pb-2">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Cari user berdasarkan email..."
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
