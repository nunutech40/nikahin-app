import React from "react";
import { Lock } from "lucide-react";
import { FeatureCode } from "@/types/invitation";
import { FEATURE_METADATA } from "@/lib/features";

interface FeatureGateProps {
    canUse: boolean;
    featureCode: FeatureCode;
    children: React.ReactNode;
}

export default function FeatureGate({ canUse, featureCode, children }: FeatureGateProps) {
    if (canUse) {
        return <>{children}</>;
    }

    const metadata = FEATURE_METADATA[featureCode];

    return (
        <div className="relative group">
            {/* Blurry Overlay with Lock Icon */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl border-2 border-dashed border-slate-200 transition-all group-hover:bg-white/80">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[280px] text-center animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">{metadata?.name || 'Fitur Terkunci'}</h3>
                    <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                        {metadata?.description || 'Fitur ini tidak tersedia dalam paket Anda saat ini.'}
                    </p>
                    <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-amber-200">
                        Upgrade Paket Sekarang
                    </button>
                </div>
            </div>

            {/* Content (Disabled/Dimmed) */}
            <div className="opacity-40 grayscale-[0.5] pointer-events-none select-none">
                {children}
            </div>
        </div>
    );
}
