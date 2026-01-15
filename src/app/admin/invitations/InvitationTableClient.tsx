"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, User, Palette, ExternalLink, Trash2, Globe, Lock, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { deleteInvitation } from "@/app/actions/admin";

interface InvitationTableClientProps {
    initialInvitations: any[];
}

export default function InvitationTableClient({ initialInvitations }: InvitationTableClientProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleDelete = async (id: number, slug: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus undangan "${slug}"? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        setLoadingId(id);
        try {
            const result = await deleteInvitation(id);
            if (!result.success) {
                alert(result.error);
            }
        } catch (err) {
            alert("Terjadi kesalahan sistem saat menghapus.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Undangan & URL</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pemilik</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Tema</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {initialInvitations.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-all">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">/{inv.slug}</p>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-1 uppercase font-bold tracking-wider">
                                            <Globe className="w-3 h-3" />
                                            {format(new Date(inv.createdAt), "d MMM yyyy", { locale: id })}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <User className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
                                        {inv.user?.email || 'N/A'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                    <Palette className="w-3 h-3 text-[#D4AF37]" />
                                    {inv.theme?.name || 'Basic'}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className={`inline-flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest ${inv.isPublished ? 'text-emerald-600' : 'text-slate-400'
                                    }`}>
                                    {inv.isPublished ? (
                                        <Globe className="w-3.5 h-3.5" />
                                    ) : (
                                        <Lock className="w-3.5 h-3.5" />
                                    )}
                                    {inv.isPublished ? 'Live' : 'Draft'}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 text-right">
                                    <Link
                                        href={`/${inv.slug}`}
                                        target="_blank"
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="Lihat Undangan"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(inv.id, inv.slug)}
                                        disabled={loadingId === inv.id}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Hapus Undangan"
                                    >
                                        {loadingId === inv.id ? (
                                            <RefreshCcw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
