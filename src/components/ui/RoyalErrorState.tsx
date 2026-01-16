import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface RoyalErrorStateProps {
    title?: string;
    description?: string;
    reset?: () => void;
    className?: string;
    showHome?: boolean;
}

export default function RoyalErrorState({
    title = "Ups, ada kendala teknis",
    description = "Sepertinya terjadi kesalahan saat memuat data. Jangan khawatir, silakan coba lagi atau hubungi tim support kami.",
    reset,
    className,
    showHome = true
}: RoyalErrorStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center min-h-[400px] py-20 px-6 text-center animate-in fade-in zoom-in-95 duration-700",
            className
        )}>
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-rose-100/30 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-white to-rose-50 border border-rose-100 rounded-[2.5rem] shadow-xl shadow-rose-200/50 flex items-center justify-center text-rose-500">
                    <AlertCircle className="w-12 h-12" />
                </div>
            </div>

            <h3 className="text-2xl font-serif font-black text-slate-800 mb-3 tracking-tight">
                {title}
            </h3>

            <p className="text-slate-400 text-sm max-w-[400px] leading-relaxed mb-10">
                {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                {reset && (
                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Coba Muat Ulang
                    </button>
                )}

                {showHome && (
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Kembali ke Home
                    </Link>
                )}
            </div>

            <div className="mt-12">
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                    Nikahin Technical Protection System
                </p>
            </div>
        </div>
    );
}
