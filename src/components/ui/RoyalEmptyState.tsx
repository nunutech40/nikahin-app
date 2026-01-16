import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface RoyalEmptyStateProps {
    icon?: React.ElementType;
    title: string;
    description?: string;
    className?: string;
    action?: React.ReactNode;
}

export default function RoyalEmptyState({
    icon: Icon = Search,
    title,
    description,
    className,
    action
}: RoyalEmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700",
            className
        )}>
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-amber-100/30 blur-2xl rounded-full scale-150" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300">
                    <Icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>

            <h3 className="text-xl font-serif font-black text-slate-800 mb-2 tracking-tight">
                {title}
            </h3>

            {description && (
                <p className="text-slate-400 text-sm max-w-[280px] leading-relaxed mb-8">
                    {description}
                </p>
            )}

            {action && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                    {action}
                </div>
            )}
        </div>
    );
}
