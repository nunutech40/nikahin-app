"use client";

import { Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface FeatureLockBadgeProps {
    featureName: string;
    requiredPackage: "silver" | "gold";
    currentPackage?: string;
}

export function FeatureLockBadge({ featureName, requiredPackage, currentPackage }: FeatureLockBadgeProps) {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const packageInfo = {
        silver: {
            name: "Silver",
            price: 150000,
            emoji: "🥈",
            color: "from-gray-400 to-gray-600"
        },
        gold: {
            name: "Gold",
            price: 300000,
            emoji: "🥇",
            color: "from-yellow-400 to-yellow-600"
        }
    };

    const info = packageInfo[requiredPackage];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            {/* Lock Badge */}
            <button
                onClick={() => setShowUpgradeModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-xs font-bold text-amber-700 hover:shadow-lg transition-all cursor-pointer"
            >
                <Lock className="w-3 h-3" />
                Perlu {info.emoji} {info.name}
            </button>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                        >
                            <span className="text-gray-500 text-xl">×</span>
                        </button>

                        {/* Header */}
                        <div className={`bg-gradient-to-br ${info.color} p-8 text-center`}>
                            <div className="text-6xl mb-4">{info.emoji}</div>
                            <h2 className="text-2xl font-black text-white mb-2">
                                Upgrade ke {info.name}
                            </h2>
                            <p className="text-white/90 text-sm">
                                Unlock fitur premium untuk undangan yang lebih menarik
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Feature Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Fitur yang Dikunci:</p>
                                        <p className="text-lg font-black text-gray-800">{featureName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <span className="text-sm font-semibold text-gray-500">Harga Upgrade:</span>
                                    <span className="text-2xl font-black text-[#D4AF37]">{formatPrice(info.price)}</span>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="mb-6 space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dengan Upgrade {info.name}:</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                        <span>Akses penuh fitur {featureName}</span>
                                    </li>
                                    {requiredPackage === "silver" && (
                                        <>
                                            <li className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                                <span>Musik latar, galeri 10 foto, quotes</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                                <span>RSVP export CSV, unlimited events</span>
                                            </li>
                                        </>
                                    )}
                                    {requiredPackage === "gold" && (
                                        <>
                                            <li className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                                <span>Love story timeline, gift registry</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                                <span>Custom colors & fonts, remove branding</span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/#pricing"
                                    target="_blank"
                                    className={`flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r ${info.color} text-white rounded-2xl font-black uppercase tracking-wider hover:shadow-lg transition-all`}
                                >
                                    Upgrade Sekarang
                                </Link>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="w-full py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                                >
                                    Nanti Saja
                                </button>
                            </div>

                            {/* Note */}
                            <p className="mt-6 text-xs text-center text-gray-400">
                                💡 Paket Anda saat ini: {currentPackage || "Bronze"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
