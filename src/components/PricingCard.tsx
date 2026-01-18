"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

interface PricingCardProps {
    name: string;
    packageSlug: string;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
}

export function PricingCard({ name, packageSlug, price, description, features, popular }: PricingCardProps) {
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
            className={`relative rounded-3xl p-8 border-2 transition-all hover:scale-105 ${popular
                ? "border-[#D4AF37] bg-gradient-to-b from-amber-50 to-white shadow-2xl shadow-amber-200/50"
                : "border-gray-100 bg-white shadow-xl shadow-gray-100/20 hover:border-[#D4AF37]"
                }`}
        >
            {/* Popular Badge */}
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#D4AF37] text-white rounded-full text-sm font-black uppercase tracking-wider shadow-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Paling Populer
                </div>
            )}

            {/* Package Name */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-gray-800 mb-2">{name}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
                <div className="text-5xl font-black text-[#D4AF37] mb-2">
                    {formatPrice(price)}
                </div>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
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
