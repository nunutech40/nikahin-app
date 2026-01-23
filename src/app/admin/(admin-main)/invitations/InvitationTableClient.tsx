"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, User, Palette, ExternalLink, Trash2, Globe, Lock, RefreshCcw, Search, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteInvitation, getPaginatedInvitations } from "@/app/actions/admin";
import { toast } from "sonner";
import RoyalEmptyState from "@/components/ui/RoyalEmptyState";
import RoyalBadge from "@/components/ui/RoyalBadge";

interface InvitationTableClientProps {
    initialInvitations: any[];
    initialTotal: number;
}

export default function InvitationTableClient({ initialInvitations, initialTotal }: InvitationTableClientProps) {
    const [invitations, setInvitations] = useState<any[]>(initialInvitations);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(initialTotal);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialInvitations.length < initialTotal);
    const [isSearching, setIsSearching] = useState(false);

    // Helper to fetch data
    const fetchInvitations = useCallback(async (pageNum: number, searchVal: string, isNew: boolean = false) => {
        if (isNew) setIsSearching(true);
        else setIsLoadingMore(true);

        try {
            const result = await getPaginatedInvitations({
                page: pageNum,
                limit: 10,
                search: searchVal
            });

            if (result.success && result.data) {
                if (isNew) {
                    setInvitations(result.data);
                    setTotal(result.total || 0);
                    setHasMore(result.data.length < (result.total || 0));
                } else {
                    setInvitations(prev => [...prev, ...result.data!]);
                    setHasMore((invitations.length + result.data.length) < (result.total || 0));
                }
            }
        } catch (error) {
            toast.error("Gagal memuat data undangan");
        } finally {
            setIsSearching(false);
            setIsLoadingMore(false);
        }
    }, [invitations.length]);

    // Handle search change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) {
                fetchInvitations(1, searchQuery, true);
            } else {
                setPage(1); // Triggers the page change effect below
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle page change
    useEffect(() => {
        if (page > 1) {
            fetchInvitations(page, searchQuery, false);
        }
    }, [page]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const handleDelete = async (id: number, slug: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus undangan "${slug}"? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }

        setLoadingId(id);
        try {
            const result = await deleteInvitation(id);
            if (result.success) {
                toast.success(`Undangan /${slug} berhasil dihapus`);
                setInvitations(prev => prev.filter(inv => inv.id !== id));
                setTotal(prev => prev - 1);
            } else {
                toast.error(result.error || "Gagal menghapus undangan");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem saat menghapus.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="p-6 pb-2">
                <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isSearching ? "text-[#D4AF37] animate-pulse" : "text-slate-300"}`} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan slug..."
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
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Undangan & URL</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pemilik</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center" >Tema</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invitations.length > 0 ? invitations.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-all">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-tight">/{inv.slug}</p>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
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
                                    <RoyalBadge variant="neutral" icon={Palette}>
                                        {inv.theme?.name || 'Basic'}
                                    </RoyalBadge>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <RoyalBadge variant={inv.isPublished ? "gold" : "neutral"} icon={inv.isPublished ? Globe : Lock}>
                                        {inv.isPublished ? 'Live' : 'Draft'}
                                    </RoyalBadge>
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
                        )) : isSearching ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Mencari data...</p>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan={5}>
                                    <RoyalEmptyState
                                        title="Undangan tidak ditemukan"
                                        description="Slug yang kamu cari tidak terdaftar di sistem."
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
                        Load More Invitations ({invitations.length} of {total})
                    </button>
                </div>
            )}
        </div>
    );
}

