import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    variant?: "default" | "success" | "warning" | "danger" | "info";
    className?: string;
}

export default function StatCard({
    title,
    value,
    subtext,
    icon: Icon,
    variant = "default",
    className
}: StatCardProps) {
    const variants = {
        default: {
            bg: "bg-white",
            border: "border-slate-100",
            iconBg: "bg-slate-50",
            iconColor: "text-slate-600",
            indicator: null
        },
        success: {
            bg: "bg-emerald-50/50",
            border: "border-emerald-100",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-700",
            indicator: "bg-emerald-500"
        },
        warning: {
            bg: "bg-amber-50/50",
            border: "border-amber-100",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-700",
            indicator: "bg-amber-500"
        },
        danger: {
            bg: "bg-rose-50/50",
            border: "border-rose-100",
            iconBg: "bg-rose-100",
            iconColor: "text-rose-700",
            indicator: "bg-rose-500"
        },
        info: {
            bg: "bg-blue-50/50",
            border: "border-blue-100",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-700",
            indicator: "bg-blue-500"
        }
    };

    const style = variants[variant];

    return (
        <div className={cn(
            "relative p-6 rounded-[28px] border transition-all duration-300 group hover:shadow-lg",
            style.bg,
            style.border,
            className
        )}>
            {/* Status Indicator Line (Optional) */}
            {style.indicator && (
                <div className={cn("absolute left-0 top-6 bottom-6 w-1 rounded-r-lg", style.indicator)} />
            )}

            <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", style.iconBg, style.iconColor)}>
                    <Icon className="w-6 h-6" />
                </div>
                {/* Decorative Pattern - Subtle */}
                <div className={cn("hidden md:block w-16 h-16 absolute -right-2 -top-2 opacity-5 pointer-events-none rounded-full blur-xl", style.indicator || "bg-slate-400")} />
            </div>

            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
                    {subtext && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtext}</span>}
                </div>
            </div>
        </div>
    );
}
