"use client";

import { X, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
    message?: string;
}

export function UpgradeModal({ isOpen, onClose, feature, message }: UpgradeModalProps) {
    if (!isOpen) return null;

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
                    <p className="text-gray-600 text-sm">
                        {message || `Upgrade untuk menggunakan ${feature}`}
                    </p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Feature Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm font-semibold text-gray-500 mb-2">Fitur yang Dikunci:</p>
                        <p className="text-lg font-black text-gray-800">{feature}</p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-6 space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dengan Upgrade:</p>
                        <ul className="space-y-2 text-sm text-gray-600">
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
                            <li className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                <span>Support 24/7 dari tim Nikahin</span>
                            </li>
                        </ul>
                    </div>

                    {/* Package Options */}
                    <div className="mb-6 space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Paket:</p>

                        <Link
                            href="/register?package=bronze"
                            className="block w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-800">🥉 Bronze</p>
                                    <p className="text-xs text-gray-500">Fitur basic</p>
                                </div>
                                <p className="font-black text-gray-800">Gratis</p>
                            </div>
                        </Link>

                        <Link
                            href="/register?package=silver"
                            className="block w-full p-4 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-xl border-2 border-[#D4AF37] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-800">🥈 Silver <span className="text-xs text-[#D4AF37]">⭐ BEST VALUE</span></p>
                                    <p className="text-xs text-gray-500">Fitur lengkap</p>
                                </div>
                                <p className="font-black text-[#D4AF37]">Rp 150k</p>
                            </div>
                        </Link>

                        <Link
                            href="/register?package=gold"
                            className="block w-full p-4 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 rounded-xl border border-yellow-200 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-800">🥇 Gold <span className="text-xs text-yellow-600">👑 PREMIUM</span></p>
                                    <p className="text-xs text-gray-500">Fitur eksklusif</p>
                                </div>
                                <p className="font-black text-yellow-600">Rp 300k</p>
                            </div>
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                    >
                        Nanti Saja
                    </button>

                    {/* Note */}
                    <p className="mt-6 text-xs text-center text-gray-400">
                        💡 Anda masih bisa edit dan preview undangan
                    </p>
                </div>
            </div>
        </div>
    );
}
