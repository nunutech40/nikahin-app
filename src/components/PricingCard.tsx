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

    // Style variants based on packageSlug
    const allStyles = {
        silver: {
            container: "border-slate-100 bg-white shadow-xl shadow-slate-200/20",
            badge: "bg-slate-100 text-slate-600",
            price: "text-slate-900 font-black",
            button: "bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200/50",
            icon: "text-slate-400"
        },
        gold: {
            container: "border-[#B48C5E] bg-gradient-to-b from-[#B48C5E]/5 to-white shadow-2xl shadow-[#B48C5E]/20",
            badge: "bg-[#B48C5E] text-white",
            price: "text-[#B48C5E] font-black",
            button: "bg-[#B48C5E] text-white hover:bg-[#927519] shadow-lg shadow-[#B48C5E]/30",
            icon: "text-[#B48C5E]"
        },
        platinum: {
            container: "border-indigo-500/30 bg-slate-900 text-white shadow-2xl shadow-indigo-900/40",
            badge: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
            price: "text-white font-black",
            button: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/50",
            icon: "text-indigo-400"
        }
    };

    const packageType = (packageSlug as 'silver' | 'gold' | 'platinum') || 'silver';
    const styles = allStyles[packageType];
    const isPlatinum = packageType === 'platinum';

    return (
        <div
            className={`relative rounded-[2.5rem] p-10 border-2 transition-all hover:scale-[1.03] flex flex-col h-full group ${styles.container}`}
        >
            {/* Popular/Premium Badge */}
            {(popular || isPlatinum) && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 z-20 ${styles.badge}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    {isPlatinum ? "Eksklusif" : "Paling Populer"}
                </div>
            )}

            {/* Package Name */}
            <div className="text-center mb-8">
                <h3 className={`text-2xl font-black mb-2 tracking-tight ${isPlatinum ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <p className={`text-[11px] font-bold uppercase tracking-widest ${isPlatinum ? 'text-slate-400' : 'text-gray-500'}`}>{description}</p>
            </div>

            {/* Price */}
            <div className={`text-center mb-10 border-b pb-10 ${isPlatinum ? 'border-slate-800' : 'border-gray-50'}`}>
                {originalPrice && (
                    <div className={`text-sm line-through mb-1 font-bold ${isPlatinum ? 'text-slate-500' : 'text-gray-400'}`}>
                        {formatPrice(originalPrice)}
                    </div>
                )}
                <div className={`text-5xl font-black leading-none tracking-tighter mb-4 ${styles.price}`}>
                    {formatPrice(price)}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPlatinum ? 'text-slate-500' : 'text-gray-400'}`}>Sekali Bayar</div>
            </div>

            {/* Features Matrix */}
            <ul className="space-y-4 mb-12 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-4 ${feature.checked ? (isPlatinum ? 'text-slate-200' : 'text-gray-700') : (isPlatinum ? 'text-slate-600' : 'text-gray-300')}`}>
                        {feature.checked ? (
                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPlatinum ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        ) : (
                            <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300 opacity-50" />
                        )}
                        <span className="text-[13px] font-bold leading-snug">{feature.name}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <Link
                href={`/register?package=${packageSlug}`}
                className={`block w-full py-5 rounded-[1.25rem] font-black text-center uppercase tracking-[0.15em] text-xs transition-all ${styles.button}`}
            >
                Pilih Paket {name}
            </Link>

            {/* Testing Mode Notice */}
            <p className={`text-[10px] text-center mt-6 font-bold uppercase tracking-widest ${isPlatinum ? 'text-slate-500' : 'text-gray-400'}`}>
                ✨ Testing Mode: Aktif Seumur Hidup
            </p>
        </div>
    );
}
