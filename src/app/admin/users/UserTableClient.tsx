"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { User, Mail, Shield, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { toggleUserStatus } from "@/app/actions/admin";

interface UserTableClientProps {
    initialUsers: any[];
}

export default function UserTableClient({ initialUsers }: UserTableClientProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        setLoadingId(userId);
        try {
            const result = await toggleUserStatus(userId, currentStatus);
            if (!result.success) {
                alert(result.error);
            }
        } catch (err) {
            alert("Terjadi kesalahan sistem.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi User</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Role</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Terdaftar</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {initialUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-all">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 line-clamp-1">{user.email.split('@')[0]}</p>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.role === 'admin'
                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                    }`}>
                                    <Shield className="w-3 h-3" />
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className={`inline-flex items-center gap-1.5 font-semibold text-xs ${user.isActive ? 'text-emerald-600' : 'text-slate-400'
                                    }`}>
                                    {user.isActive ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Aktif</>
                                    ) : (
                                        <><XCircle className="w-4 h-4" /> Nonaktif</>
                                    )}
                                </div>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
