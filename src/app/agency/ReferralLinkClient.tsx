"use client";

import React from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import RoyalCard from "@/components/ui/RoyalCard";

interface ReferralLinkClientProps {
    referralCode: string;
}

export default function ReferralLinkClient({ referralCode }: ReferralLinkClientProps) {
    const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralUrl);
        toast.success("Referral link copied!", {
            description: "Share this link with your clients to earn commission."
        });
    };

    return (
        <RoyalCard className="overflow-hidden border-2 border-emerald-100 bg-emerald-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Share2 className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Your Referral Engine</h3>
                    </div>
                    <p className="text-2xl font-black text-slate-800 tracking-tight mb-1">Dapatkan Client Baru</p>
                    <p className="text-sm text-slate-500">Bagikan link ini ke calon pengantin. Setiap registrasi akan otomatis masuk ke jaringan Anda.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="bg-white border border-emerald-100 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm min-w-[200px]">
                        <span className="text-sm font-bold text-slate-700 font-mono truncate max-w-[150px]">{referralCode}</span>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors ml-auto"
                            title="Copy Link"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Copy Link
                    </button>
                </div>
            </div>
        </RoyalCard>
    );
}
