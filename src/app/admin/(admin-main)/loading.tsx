import React from "react";
import RoyalSkeleton from "@/components/ui/RoyalSkeleton";

export default function AdminLoading() {
    return (
        <div className="space-y-10 animate-pulse">
            <div className="space-y-4">
                <div className="h-10 w-64 bg-slate-200 rounded-xl" />
                <div className="h-4 w-96 bg-slate-100 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl mb-6" />
                        <div className="space-y-3">
                            <div className="h-2 w-20 bg-slate-100 rounded" />
                            <div className="h-8 w-12 bg-slate-50 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 h-[400px] bg-white rounded-[32px] border border-slate-100 shadow-sm" />
                <div className="lg:col-span-2 h-[400px] bg-white rounded-[32px] border border-slate-100 shadow-sm" />
            </div>
        </div>
    );
}
