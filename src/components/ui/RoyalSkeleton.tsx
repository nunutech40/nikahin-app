import React from "react";
import { cn } from "@/lib/utils";

interface RoyalSkeletonProps {
    className?: string;
    variant?: "default" | "royal";
}

export default function RoyalSkeleton({ className, variant = "default" }: RoyalSkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-2xl",
                variant === "default" && "bg-slate-200",
                variant === "royal" && "bg-gradient-to-r from-slate-100 via-amber-50/30 to-slate-100",
                className
            )}
        />
    );
}

export function RoyalSkeletonGrid({ count = 4, className }: { count?: number, className?: string }) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-50 space-y-4 shadow-sm">
                    <RoyalSkeleton className="w-14 h-14" />
                    <div className="space-y-2">
                        <RoyalSkeleton className="h-4 w-24" />
                        <RoyalSkeleton className="h-10 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}
