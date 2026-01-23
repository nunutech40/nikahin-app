"use client";

import React, { useState, useEffect } from "react";
import RoyalCard from "@/components/ui/RoyalCard";
import { Copy, Share2, MessageCircle, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareFormProps {
    slug: string;
    groomName: string;
    brideName: string;
}

export default function ShareForm({ slug, groomName, brideName }: ShareFormProps) {
    const [guestName, setGuestName] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const invitationUrl = `${origin}/${slug}`;
    const personalizedUrl = guestName
        ? `${invitationUrl}?to=${encodeURIComponent(guestName)}`
        : invitationUrl;

    const defaultMessage = `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i ${guestName || '[Nama Tamu]'} untuk menghadiri acara pernikahan kami:\n\n${groomName} & ${brideName}\n\nInfo selengkapnya silakan buka link undangan berikut:\n${personalizedUrl}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;

    const handleCopy = () => {
        navigator.clipboard.writeText(personalizedUrl);
        setIsCopied(true);
        toast.success("Link berhasil disalin!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleShareWA = () => {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;
        window.open(waUrl, "_blank");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-black text-slate-900 font-serif tracking-tight mb-2">Bagikan Undangan</h3>
                <p className="text-slate-500 text-sm">Sebarkan kabar bahagia Anda kepada keluarga dan sahabat dengan mudah.</p>
            </div>

            <RoyalCard className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Tamu (Opsional)</label>
                    <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Contoh: Bpk. Jajang & Kel."
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#D4AF37] outline-none transition-all font-bold text-slate-700"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">Nama ini akan muncul di halaman pembuka undangan tamu.</p>
                </div>

                <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Link Undangan Anda</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-xs font-mono text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">
                            {personalizedUrl}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white shrink-0"
                        >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    <p className="text-[10px] text-slate-500 italic font-medium">
                        * Gunakan link ini untuk disebar secara manual di sosial media atau grup chat.
                    </p>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pratinjau Pesan WhatsApp</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap font-bold h-48 overflow-y-auto custom-scrollbar">
                        {defaultMessage}
                    </div>

                    <button
                        onClick={handleShareWA}
                        className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd5b] text-white rounded-2xl font-black text-sm shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Share2 className="w-4 h-4" />
                        Kirim via WhatsApp Sekarang
                    </button>
                </div>
            </RoyalCard>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 border-dashed">
                <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                    💡 **Tips:** Untuk pengiriman massal ke ratusan tamu sekaligus, Anda bisa menggunakan fitur di menu **Tamu** (fitur WA Blast) untuk menghemat waktu.
                </p>
            </div>
        </div>
    );
}
