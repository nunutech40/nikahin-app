"use client";

import React, { useState } from "react";
import { X, UserPlus, Phone, Tag, Users as UsersIcon, Loader2 } from "lucide-react";
import RoyalCard from "@/components/ui/RoyalCard";
import { addGuest } from "@/app/actions/guests";
import { toast } from "sonner";

interface AddGuestModalProps {
    invitationId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function AddGuestModal({ invitationId, isOpen, onClose }: AddGuestModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        category: "Umum",
        pax: 1
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Nama tamu harus diisi");
            return;
        }

        setIsLoading(true);
        try {
            const result = await addGuest(invitationId, formData);
            if (result.success) {
                toast.success("Tamu berhasil ditambahkan!");
                setFormData({ name: "", phone: "", category: "Umum", pax: 1 });
                onClose();
                window.location.reload();
            } else {
                toast.error(result.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg animate-in fade-in zoom-in duration-300">
                <RoyalCard className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#B48C5E]">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 font-serif">Tambah Tamu</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Input Tamu Secara Manual</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Lengkap *</label>
                            <div className="relative">
                                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Bpk. Heru & Keluarga"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#B48C5E]/30 outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">No. WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="tel"
                                        placeholder="62812xxx"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#B48C5E]/30 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kategori</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder="Keluarga/Teman/VIP"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#B48C5E]/30 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jumlah Undangan (Pax)</label>
                            <div className="relative">
                                <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.pax}
                                    onChange={(e) => setFormData({ ...formData, pax: parseInt(e.target.value) })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#B48C5E]/30 outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-[#B48C5E] text-white rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-[#B48C5E]/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <UserPlus className="w-5 h-5" />
                            )}
                            SIMPAN TAMU
                        </button>
                    </form>
                </RoyalCard>
            </div>
        </div>
    );
}
