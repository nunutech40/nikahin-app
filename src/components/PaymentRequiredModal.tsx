"use client";

import { X, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PaymentRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    packageName: string;
    packagePrice: number;
}

export function PaymentRequiredModal({ isOpen, onClose, packageName, packagePrice }: PaymentRequiredModalProps) {
    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

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
                        <AlertCircle className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">
                        Undangan Belum Bisa Dipublish
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Selesaikan pembayaran untuk mempublish undangan Anda
                    </p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Package Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-500">Paket Anda:</span>
                            <span className="text-lg font-black text-gray-800">{packageName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-500">Total Pembayaran:</span>
                            <span className="text-2xl font-black text-[#D4AF37]">{formatPrice(packagePrice)}</span>
                        </div>
                    </div>

                    {/* Benefits Reminder */}
                    <div className="mb-6 space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Yang Anda Dapatkan:</p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-[#D4AF37] mt-0.5">✓</span>
                                <span>Akses penuh semua fitur {packageName}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#D4AF37] mt-0.5">✓</span>
                                <span>Undangan langsung live & bisa dibagikan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#D4AF37] mt-0.5">✓</span>
                                <span>Support 24/7 dari tim Nikahin</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/payment"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-[#D4AF37] text-white rounded-2xl font-black uppercase tracking-wider hover:bg-[#b28f1f] transition-all shadow-lg shadow-amber-200/50"
                        >
                            <CreditCard className="w-5 h-5" />
                            Bayar Sekarang
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                        >
                            Nanti Saja
                        </button>
                    </div>

                    {/* Note */}
                    <p className="mt-6 text-xs text-center text-gray-400">
                        💡 Anda masih bisa edit dan preview undangan kapan saja
                    </p>
                </div>
            </div>
        </div>
    );
}
