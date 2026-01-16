import React from "react";
import RoyalCard from "@/components/ui/RoyalCard";
import { CheckCircle2, XCircle, HelpCircle, Activity } from "lucide-react";

interface RSVPBreakdownProps {
    hadir: number;
    tidak: number;
    ragu: number;
    total: number;
}

export default function RSVPBreakdown({ hadir, tidak, ragu, total }: RSVPBreakdownProps) {
    const stats = [
        { label: "Hadir", value: hadir, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", barColor: "bg-emerald-500" },
        { label: "Tidak", value: tidak, icon: XCircle, color: "text-rose-500", bg: "bg-rose-50", barColor: "bg-rose-500" },
        { label: "Ragu", value: ragu, icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-50", barColor: "bg-amber-500" },
    ];

    return (
        <RoyalCard className="h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif font-black text-xl text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-indigo-600" />
                    </div>
                    RSVP Insights
                </h3>
            </div>

            <div className="space-y-6">
                {stats.map((stat) => {
                    const percentage = total > 0 ? (stat.value / total) * 100 : 0;
                    return (
                        <div key={stat.label} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">{stat.label}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-slate-900">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-slate-400 ml-1">({percentage.toFixed(0)}%)</span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${stat.barColor} transition-all duration-1000 ease-out`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Kontribusi</span>
                    <span className="text-lg font-black text-slate-900">{total} <span className="text-xs font-bold text-slate-400">Ucapan</span></span>
                </div>
            </div>
        </RoyalCard>
    );
}
