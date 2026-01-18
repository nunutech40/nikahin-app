"use client";

import React, { useState } from "react";
import {
    Users,
    Trash2,
    Copy,
    ExternalLink,
    MoreHorizontal,
    Phone,
    Tag,
    UserCircle,
    CheckCircle2,
    Clock,
    MessageCircle
} from "lucide-react";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { deleteGuest } from "@/app/actions/guests";
import { toast } from "sonner";

interface GuestListTableProps {
    guests: any[];
    invitationSlug: string;
}

export default function GuestListTable({ guests, invitationSlug }: GuestListTableProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(guests.map(g => g.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(pid => pid !== id));
        }
    };

    const isAllSelected = guests.length > 0 && selectedIds.length === guests.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < guests.length;

    const handleDelete = async (guestId: number) => {
        if (!confirm("Hapus tamu ini dari daftar?")) return;

        try {
            const result = await deleteGuest(guestId);
            if (result.success) {
                toast.success("Tamu dihapus.");
                window.location.reload();
            } else {
                toast.error(result.error);
            }
        } catch (err) {
            toast.error("Gagal menghapus.");
        }
    };

    const copyInviteLink = (guestName: string) => {
        const encodedName = encodeURIComponent(guestName);
        const link = `${window.location.origin}/${invitationSlug}?to=${encodedName}`;
        navigator.clipboard.writeText(link);
        toast.success("Link undangan disalin!");
    };

    const openPreview = (guestName: string) => {
        const encodedName = encodeURIComponent(guestName);
        window.open(`/${invitationSlug}?to=${encodedName}`, "_blank");
    };

    if (guests.length === 0) {
        return (
            <RoyalCard className="py-20 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                    <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 font-serif">Daftar Tamu Kosong</h3>
                <p className="text-slate-400 max-w-xs text-sm font-bold">Mulai dengan menambahkan tamu secara manual atau import dari Excel.</p>
            </RoyalCard>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        <th className="px-6 py-2">
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-[#B48C5E] focus:ring-[#B48C5E] cursor-pointer"
                                />
                                <span>Tamu</span>
                            </div>
                        </th>
                        <th className="px-6 py-2">WhatsApp</th>
                        <th className="px-6 py-2">Kategori</th>
                        <th className="px-6 py-2">Pax</th>
                        <th className="px-6 py-2">Status WA</th>
                        <th className="px-6 py-2">Konfirmasi</th>
                        <th className="px-6 py-2 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) => (
                        <tr key={guest.id} className="group transition-all">
                            <td className="bg-white rounded-l-3xl px-6 py-4 shadow-sm group-hover:shadow-md border-y border-l border-slate-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(guest.id)}
                                        onChange={(e) => handleSelectOne(guest.id, e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-[#B48C5E] focus:ring-[#B48C5E] cursor-pointer"
                                    />
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#B48C5E]">
                                        <UserCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-sm italic">{guest.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: G-{guest.id.toString().padStart(4, '0')}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="bg-white px-6 py-4 shadow-sm border-y border-slate-100 group-hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                                    <Phone className="w-3.5 h-3.5 text-slate-300" />
                                    {guest.phone || "-"}
                                </div>
                            </td>
                            <td className="bg-white px-6 py-4 shadow-sm border-y border-slate-100 group-hover:shadow-md transition-all">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 uppercase">
                                    <Tag className="w-3 h-3" />
                                    {guest.category}
                                </span>
                            </td>
                            <td className="bg-white px-6 py-4 shadow-sm border-y border-slate-100 group-hover:shadow-md transition-all">
                                <span className="text-xs font-black text-slate-900">{guest.pax} Orang</span>
                            </td>
                            <td className="bg-white px-6 py-4 shadow-sm border-y border-slate-100 group-hover:shadow-md transition-all">
                                {guest.isInvited ? (
                                    <RoyalBadge variant="success">TERKIRIM</RoyalBadge>
                                ) : (
                                    <RoyalBadge variant="neutral">BELUM KIRIM</RoyalBadge>
                                )}
                            </td>
                            <td className="bg-white px-6 py-4 shadow-sm border-y border-slate-100 group-hover:shadow-md transition-all">
                                <RoyalBadge variant={
                                    guest.attendance === 'hadir' ? 'success' :
                                        guest.attendance === 'tidak' ? 'error' :
                                            guest.attendance === 'ragu' ? 'warning' : 'neutral'
                                }>
                                    {(guest.attendance || "Belum Respon").toUpperCase()}
                                </RoyalBadge>
                            </td>
                            <td className="bg-white rounded-r-3xl px-6 py-4 shadow-sm border-y border-r border-slate-100 group-hover:shadow-md transition-all text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => copyInviteLink(guest.name)}
                                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                                        title="Salin Link Undangan"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openPreview(guest.name)}
                                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors"
                                        title="Buka Preview"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(guest.id)}
                                        className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                                        title="Hapus Tamu"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1612] text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-6 animate-in slide-in-from-bottom-10 slide-in-from-left-0 duration-300">
                    <div className="text-xs font-bold pl-2">
                        <span className="text-[#B48C5E] text-lg">{selectedIds.length}</span> tamu terpilih
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <button className="flex items-center gap-2 hover:text-[#B48C5E] transition-colors text-xs font-black uppercase tracking-wider">
                        <MessageCircle className="w-4 h-4" />
                        Kirim WA
                    </button>
                    <button
                        onClick={() => {
                            if (confirm(`Hapus ${selectedIds.length} tamu terpilih?`)) {
                                selectedIds.forEach(id => deleteGuest(id));
                                handleSelectAll(false);
                            }
                        }}
                        className="flex items-center gap-2 hover:text-rose-500 transition-colors text-xs font-black uppercase tracking-wider"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}
