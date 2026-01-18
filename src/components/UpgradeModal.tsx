"use client";

import { X, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
    message?: string;
}

export function UpgradeModal({ isOpen, onClose, feature, message }: UpgradeModalProps) {
    const { data: session } = useSession();
    if (!isOpen) return null;

    // Redirect to landing page pricing section as requested
    const upgradeLink = "/#pricing";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <Lock className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">
                        Fitur Terkunci
                    </h2>
                    <p className="text-gray-600 text-sm px-4">
                        {message || `Upgrade untuk menggunakan ${feature}`}
                    </p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Feature Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm font-semibold text-gray-500 mb-2">Fitur yang Dikunci:</p>
                        <p className="text-lg font-black text-gray-800 tracking-tight">{feature}</p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6 space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keuntungan Upgrade:</p>
                        <ul className="space-y-2 text-sm text-gray-600 font-medium">
                            <li className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                <span>Akses penuh semua fitur premium</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                <span>Save & publish undangan Anda</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                <span>Share ke tamu via WhatsApp</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="space-y-3">
                        <Link
                            href={upgradeLink}
                            onClick={onClose}
                            className="block w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#b28f1f] text-white rounded-2xl font-black text-center shadow-xl shadow-amber-200/50 hover:scale-[1.02] transition-all"
                        >
                            LIHAT PILIHAN PAKET
                        </Link>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
                        >
                            NANTI SAJA
                        </button>
                    </div>

                    {/* Note */}
                    <p className="mt-8 text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest">
                        💡 Anda masih bisa mencoba fitur di Editor
                    </p>
                </div>
            </div>
        </div>
    );
}
