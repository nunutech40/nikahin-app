"use client";

import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";

interface Feature {
    name: string;
    checked: boolean;
}

interface PricingCardProps {
    name: string;
    packageSlug: string;
    price: number;
    description: string;
    features: Feature[];
    popular?: boolean;
    originalPrice?: number;
}

export function PricingCard({ name, packageSlug, price, description, features, popular, originalPrice }: PricingCardProps) {
    const formatPrice = (price: number) => {
        if (price === 0) return "Gratis";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div
            className={`relative rounded-3xl p-8 border-2 transition-all hover:scale-[1.02] flex flex-col h-full ${popular
                ? "border-[#D4AF37] bg-gradient-to-b from-amber-50/50 to-white shadow-2xl shadow-amber-200/40"
                : "border-gray-100 bg-white"
                }`}
        >
            {/* Popular Badge */}
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#D4AF37] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Paling Populer
                </div>
            )}

            {/* Package Name */}
            <div className="text-center mb-6">
                <h3 className="text-xl font-black text-gray-900 mb-1">{name}</h3>
                <p className="text-xs text-gray-500 font-medium px-4">{description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-8 border-b border-gray-50 pb-8">
                {originalPrice && (
                    <div className="text-sm text-gray-400 line-through mb-1 font-bold">
                        {formatPrice(originalPrice)}
                    </div>
                )}
                <div className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">
                    {formatPrice(price)}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sekali Bayar</div>
            </div>

            {/* Features Matrix */}
            <ul className="space-y-3.5 mb-10 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-3 ${feature.checked ? "text-gray-700" : "text-gray-300"}`}>
                        {feature.checked ? (
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs font-semibold leading-tight">{feature.name}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <Link
                href={`/register?package=${packageSlug}`}
                className={`block w-full py-4 rounded-2xl font-black text-center uppercase tracking-wider transition-all ${popular
                    ? "bg-[#D4AF37] text-white hover:bg-[#b28f1f] shadow-lg shadow-amber-200/50"
                    : "bg-gray-100 text-gray-700 hover:bg-[#D4AF37] hover:text-white"
                    }`}
            >
                Pilih Paket {name}
            </Link>

            {/* Testing Mode Notice */}
            <p className="text-xs text-center text-gray-400 mt-4 font-medium">
                ✨ Test semua fitur gratis, bayar saat publish
            </p>
        </div>
    );
}
