import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users, invitations, visitorLogs } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { Users, FileText, BarChart3, TrendingUp, Calendar, ArrowRight, Heart, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";

// --- SUB-COMPONENTS (Data Isolation Logic) ---

async function AgencyStatsGrid({ sellerId }: { sellerId: number }) {
    // Isolated queries: Only count users REFERRED BY this seller
    const [u, i, v] = await Promise.all([
        db.select({ value: count() }).from(users).where(eq(users.referredBy, sellerId)),
        db.select({ value: count() })
            .from(invitations)
            .innerJoin(users, eq(invitations.userId, users.id))
            .where(eq(users.referredBy, sellerId)),
        db.select({ value: count() })
            .from(visitorLogs)
            .innerJoin(invitations, eq(visitorLogs.invitationId, invitations.id))
            .innerJoin(users, eq(invitations.userId, users.id))
            .where(eq(users.referredBy, sellerId)),
    ]);

    const stats = [
        { label: "Direct Customers", value: String(u[0].value), icon: Users, gradient: "from-emerald-600 to-teal-700", shadow: "shadow-emerald-200" },
        { label: "Sold Invitations", value: String(i[0].value), icon: FileText, gradient: "from-blue-600 to-indigo-700", shadow: "shadow-blue-200" },
        { label: "Partner Views", value: String(v[0].value), icon: BarChart3, gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-200" },
        { label: "Commission Est.", value: "Rp 0", icon: TrendingUp, gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-200" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
                <RoyalCard key={stat.label} hoverable className="relative overflow-hidden group">
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-6 shadow-xl ${stat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
                    </div>
                </RoyalCard>
            ))}
        </div>
    );
}

async function AgencyRecentActivity({ sellerId }: { sellerId: number }) {
    // Isolated Activity
    const [latestUsers, latestInvitations] = await Promise.all([
        db.query.users.findMany({
            where: eq(users.referredBy, sellerId),
            limit: 5,
            orderBy: [desc(users.createdAt)]
        }),
        db.query.invitations.findMany({
            limit: 5,
            with: { user: true },
            orderBy: [desc(invitations.createdAt)],
            where: sql`EXISTS (SELECT 1 FROM ${users} WHERE ${users.id} = ${invitations.userId} AND ${users.referredBy} = ${sellerId})`
        })
    ]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* My Customers */}
            <RoyalCard>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <h3 className="font-serif font-black text-xl text-slate-800 flex items-center gap-3">
                            My New Clients
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Growth Audit List</p>
                    </div>
                    <Link href="/agency/customers" className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 transition-colors">View All</Link>
                </div>
                <div className="space-y-4">
                    {latestUsers.length > 0 ? latestUsers.map(u => (
                        <div key={u.id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:border-emerald-200 transition-all group">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 font-black shadow-sm group-hover:scale-110 transition-transform">
                                    {u.name?.charAt(0) || "U"}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-black text-slate-900 leading-tight">{u.name || u.email.split('@')[0]}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{format(new Date(u.createdAt), "d MMM", { locale: id })}</p>
                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                        {u.phone && (
                                            <a href={`https://wa.me/${u.phone.replace(/^0/, '62')}`} target="_blank" className="flex items-center gap-1 text-emerald-600 text-[9px] font-black hover:underline uppercase">
                                                <Phone className="w-2.5 h-2.5" /> Client WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <RoyalBadge variant={u.isActive ? "success" : "neutral"}>{u.isActive ? "Active" : "Pending"}</RoyalBadge>
                        </div>
                    )) : <p className="text-sm text-slate-400 italic">No customers yet...</p>}
                </div>
            </RoyalCard>

            {/* Managed Invitations */}
            <RoyalCard>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <h3 className="font-serif font-black text-xl text-slate-800 flex items-center gap-3">
                            Client Invitations
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active Sales pipeline</p>
                    </div>
                    <Link href="/agency/invitations" className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 transition-colors">View All</Link>
                </div>
                <div className="space-y-4">
                    {latestInvitations.length > 0 ? latestInvitations.map(inv => (
                        <div key={inv.id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:border-blue-200 transition-all group">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-black text-slate-900 leading-tight">/{inv.slug}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 truncate max-w-[120px]">By {inv.user?.name || inv.user?.email}</p>
                                </div>
                            </div>
                            <RoyalBadge variant={inv.isPublished ? "success" : "neutral"}>{inv.isPublished ? "Live" : "Draft"}</RoyalBadge>
                        </div>
                    )) : <p className="text-sm text-slate-400 italic">No invitations created yet...</p>}
                </div>
            </RoyalCard>
        </div>
    );
}

// --- MAIN PAGE ---

export default async function AgencyDashboardPage() {
    const session = await getServerSession(authOptions);
    const sellerId = Number((session?.user as any)?.id);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Seller Overview</h2>
                    <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Managing your successful wedding agency network.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm self-start">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}</span>
                </div>
            </div>

            <Suspense fallback={<div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />}>
                <AgencyStatsGrid sellerId={sellerId} />
            </Suspense>

            <Suspense fallback={<div className="h-96 bg-slate-100 rounded-[32px] animate-pulse" />}>
                <AgencyRecentActivity sellerId={sellerId} />
            </Suspense>
        </div>
    );
}
