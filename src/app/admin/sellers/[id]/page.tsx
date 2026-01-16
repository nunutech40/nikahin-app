import React, { Suspense } from "react";
import { db } from "@/db";
import { users, invitations, visitorLogs } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import {
    Users,
    FileText,
    BarChart3,
    ArrowLeft,
    Store,
    Mail,
    TrendingUp,
    ExternalLink,
    Smartphone,
    Monitor,
    Tablet,
    Heart
} from "lucide-react";
import Link from "next/link";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";
import { notFound } from "next/navigation";

// --- SUB-COMPONENTS ---

async function SellerDetailStats({ sellerId }: { sellerId: number }) {
    // Isolated queries for THIS specific seller
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
        { label: "Total Klien", value: String(u[0].value), icon: Users, gradient: "from-blue-600 to-indigo-700" },
        { label: "Undangan Terjual", value: String(i[0].value), icon: FileText, gradient: "from-emerald-600 to-teal-700" },
        { label: "Total Views", value: String(v[0].value), icon: BarChart3, gradient: "from-amber-500 to-orange-600" },
        { label: "Profit Share (Est)", value: "Rp 0", icon: TrendingUp, gradient: "from-rose-500 to-pink-600" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
                <RoyalCard key={stat.label} variant="glass">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-6 shadow-lg shadow-slate-200`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</p>
                </RoyalCard>
            ))}
        </div>
    );
}

async function SellerActivityList({ sellerId }: { sellerId: number }) {
    const sellerCustomers = await db.query.users.findMany({
        where: eq(users.referredBy, sellerId),
        with: {
            invitations: true
        },
        orderBy: (users, { desc }) => [desc(users.createdAt)]
    });

    return (
        <RoyalCard>
            <h3 className="font-serif font-black text-xl text-slate-800 mb-8">Daftar Portofolio Klien</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Customer</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Invitations</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Preview</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sellerCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td className="py-5">
                                    <p className="text-sm font-bold text-slate-900">{customer.email}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="py-5 text-center">
                                    <span className="text-sm font-black text-slate-800">{customer.invitations.length}</span>
                                </td>
                                <td className="py-5 text-center">
                                    <RoyalBadge variant={customer.isActive ? "success" : "neutral"}>
                                        {customer.isActive ? "Active" : "Pending"}
                                    </RoyalBadge>
                                </td>
                                <td className="py-5 text-right">
                                    {customer.invitations[0] ? (
                                        <Link href={`/${customer.invitations[0].slug}`} target="_blank" className="inline-flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#D4AF37] transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </RoyalCard>
    );
}

// --- MAIN PAGE ---

export default async function SellerInsightPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idParam } = await params;
    const sellerId = parseInt(idParam);
    const seller = await db.query.users.findFirst({
        where: eq(users.id, sellerId)
    });

    if (!seller || seller.role !== "agency") return notFound();

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="flex items-center gap-6">
                <Link href="/admin/sellers" className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Seller Insights: {seller.email.split('@')[0]}</h2>
                        <RoyalBadge variant="success">Partner Account</RoyalBadge>
                    </div>
                    <p className="text-slate-400 mt-1 font-medium flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <Mail className="w-3 h-3 text-[#D4AF37]" /> {seller.email}
                    </p>
                </div>
            </div>

            <Suspense fallback={<div className="h-40 bg-slate-50 rounded-[32px] animate-pulse" />}>
                <SellerDetailStats sellerId={sellerId} />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <Suspense fallback={<div className="h-96 bg-slate-50 rounded-[32px] animate-pulse" />}>
                        <SellerActivityList sellerId={sellerId} />
                    </Suspense>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <RoyalCard className="bg-[#0F172A] text-white border-transparent">
                        <h4 className="font-serif font-black text-lg mb-6 flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Growth Audit
                        </h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Status</span>
                                <span className="text-xs font-black text-emerald-400 uppercase">Excellent</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversion Rate</span>
                                <span className="text-xs font-black text-white">4.2%</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Health</span>
                                <span className="text-xs font-black text-blue-400 uppercase">Verified</span>
                            </div>
                        </div>
                    </RoyalCard>

                    <RoyalCard>
                        <h4 className="font-serif font-black text-lg text-slate-800 mb-6">Device Loyalty</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3 text-slate-600"><Smartphone className="w-4 h-4" /> <span className="text-xs font-bold">Mobile</span></div>
                                <span className="text-xs font-black text-slate-900">82%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3 text-slate-600"><Monitor className="w-4 h-4" /> <span className="text-xs font-bold">Desktop</span></div>
                                <span className="text-xs font-black text-slate-900">15%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3 text-slate-600"><Tablet className="w-4 h-4" /> <span className="text-xs font-bold">Tablet</span></div>
                                <span className="text-xs font-black text-slate-900">3%</span>
                            </div>
                        </div>
                    </RoyalCard>
                </div>
            </div>
        </div>
    );
}
