import React from "react";
import { db } from "@/db";
import { visitorLogs, invitations } from "@/db/schema";
import { desc, count, sql } from "drizzle-orm";
import { BarChart3, Clock, Globe, Smartphone, Monitor, Tablet, ArrowRight, MousePointer2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";
import RoyalEmptyState from "@/components/ui/RoyalEmptyState";

export default async function TrafficAnalyticsPage() {
    // 1. Fetch Latest 20 Visits
    const latestVisits = await db.query.visitorLogs.findMany({
        limit: 20,
        orderBy: [desc(visitorLogs.createdAt)],
        with: {
            invitation: true
        }
    });

    // 2. Fetch Top Invitations by Views
    const topInvitations = await db.select({
        slug: invitations.slug,
        viewCount: count(visitorLogs.id),
    })
        .from(invitations)
        .leftJoin(visitorLogs, sql`${invitations.id} = ${visitorLogs.invitationId}`)
        .groupBy(invitations.slug)
        .orderBy(desc(count(visitorLogs.id)))
        .limit(5);

    // 3. Device Distribution
    const deviceStats = await db.select({
        device: visitorLogs.device,
        count: count(visitorLogs.id),
    })
        .from(visitorLogs)
        .groupBy(visitorLogs.device);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Traffic Insights</h2>
                <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                    Analisis real-time siapa dan bagaimana orang mengakses platform Nikahin.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Device Distribution Card */}
                <RoyalCard className="lg:col-span-1 border-emerald-100/30">
                    <h3 className="font-serif font-black text-xl text-slate-800 mb-6 flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-emerald-500" />
                        Device Analytics
                    </h3>
                    <div className="space-y-4">
                        {deviceStats.length > 0 ? deviceStats.map((stat) => (
                            <div key={stat.device} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                <div className="flex items-center gap-3">
                                    {stat.device === "Mobile" ? <Smartphone className="w-4 h-4 text-blue-500" /> :
                                        stat.device === "Desktop" ? <Monitor className="w-4 h-4 text-indigo-500" /> :
                                            <Tablet className="w-4 h-4 text-amber-500" />}
                                    <span className="text-sm font-bold text-slate-600">{stat.device}</span>
                                </div>
                                <span className="text-sm font-black text-slate-900">{stat.count} <span className="text-[10px] text-slate-400 font-bold uppercase">Views</span></span>
                            </div>
                        )) : (
                            <p className="text-xs text-slate-400 italic">Belum ada data device...</p>
                        )}
                    </div>
                </RoyalCard>

                {/* Latest Traffic Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <RoyalCard>
                        <h3 className="font-serif font-black text-xl text-slate-800 mb-6 flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[#D4AF37]" />
                            Live Traffic Feed
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-slate-50">
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Path / Invitation</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform</th>
                                        <th className="pb-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {latestVisits.length > 0 ? latestVisits.map((visit) => (
                                        <tr key={visit.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">/{visit.invitation?.slug}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <RoyalBadge variant="neutral" className="text-[9px]">
                                                        {visit.os} • {visit.browser}
                                                    </RoyalBadge>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                    {format(new Date(visit.createdAt), "HH:mm:ss", { locale: id })}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="py-10">
                                                <RoyalEmptyState
                                                    title="No Traffic Yet"
                                                    description="Pantau log kunjungan real-time di sini saat user mulai mengakses undangan."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </RoyalCard>
                </div>
            </div>
        </div>
    );
}
