import React from "react";
import { cn } from "@/lib/utils";

interface RoyalCardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    variant?: "default" | "glass" | "dark";
}

export default function RoyalCard({
    children,
    className,
    hoverable = true,
    variant = "default"
}: RoyalCardProps) {
    const variants = {
        default: "bg-white border-slate-100 shadow-xl shadow-slate-200/40",
        glass: "bg-white/70 backdrop-blur-md border-white/20 shadow-xl",
        dark: "bg-[#0F172A] border-slate-800 shadow-2xl text-white"
    };

    return (
        <div className={cn(
            "rounded-[32px] border p-6 transition-all duration-500 overflow-hidden relative",
            variants[variant],
            hoverable && "hover:border-amber-200 hover:shadow-2xl hover:shadow-slate-200/60",
            className
        )}>
            {/* Subtle decorative element for that premium feel */}
            {variant !== "dark" && (
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-amber-100/20 to-transparent rounded-full pointer-events-none" />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
