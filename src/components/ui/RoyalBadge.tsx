import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "gold";

interface RoyalBadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    icon?: React.ElementType;
}

export default function RoyalBadge({
    children,
    variant = "neutral",
    className,
    icon: Icon
}: RoyalBadgeProps) {
    const variants: Record<BadgeVariant, string> = {
        success: "bg-emerald-50 text-emerald-600 border-emerald-100",
        warning: "bg-amber-50 text-amber-600 border-amber-100",
        error: "bg-rose-50 text-rose-600 border-rose-100",
        info: "bg-blue-50 text-blue-600 border-blue-100",
        neutral: "bg-slate-50 text-slate-400 border-slate-100",
        gold: "bg-amber-50 text-[#D4AF37] border-amber-100 shadow-sm"
    };

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all duration-300",
            variants[variant],
            className
        )}>
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </span>
    );
}
