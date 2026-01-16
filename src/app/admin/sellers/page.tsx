import React, { Suspense } from "react";
import { db } from "@/db";
import { users, invitations } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { Store, Users, FileText, ArrowRight, ShieldCheck, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";
import RoyalEmptyState from "@/components/ui/RoyalEmptyState";
import Link from "next/link";

async function SellerList() {
    // Fetch all users with 'agency' role
    const agencies = await db.query.users.findMany({
        where: eq(users.role, "agency"),
        orderBy: [desc(users.createdAt)],
    });

    // Fetch stats per agency (Quick & dirty for demo, in production use better aggregation)
    const agencyStats = await Promise.all(agencies.map(async (agency) => {
        const [customerCount, invitationCount] = await Promise.all([
            db.select({ value: count() }).from(users).where(eq(users.referredBy, agency.id)),
            db.select({ value: count() })
                .from(invitations)
                .innerJoin(users, eq(invitations.userId, users.id))
                .where(eq(users.referredBy, agency.id))
        ]);

        return {
            ...agency,
            customerCount: customerCount[0].value,
            invitationCount: invitationCount[0].value
        };
    }));

    if (agencyStats.length === 0) {
        return (
            <RoyalEmptyState
                title="No Sellers Found"
                description="Belum ada akun dengan role 'Agency'. Tambahkan seller baru untuk mulai mengembangkan jaringan bisnis Anda."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agencyStats.map((seller) => (
                <RoyalCard key={seller.id} className="relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform duration-700" />

                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                <Store className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{seller.email.split('@')[0]}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{seller.email}</p>
                                </div>
                            </div>
                        </div>
                        <RoyalBadge variant={seller.isActive ? "success" : "neutral"}>
                            {seller.isActive ? "Authorized" : "Reviewing"}
                        </RoyalBadge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                            <div className="flex items-center gap-2 mb-1">
                                <Users className="w-3.5 h-3.5 text-blue-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Base</p>
                            </div>
                            <p className="text-2xl font-black text-slate-900">{seller.customerCount} <span className="text-[10px] text-slate-400">Users</span></p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-3.5 h-3.5 text-amber-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Sales</p>
                            </div>
                            <p className="text-2xl font-black text-slate-900">{seller.invitationCount} <span className="text-[10px] text-slate-400">Invites</span></p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-300" />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Joined {format(new Date(seller.createdAt), "MMM yyyy")}</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                            Manage Portfolio <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </RoyalCard>
            ))}
        </div>
    );
}

export default function AdminSellersPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Manajemen Seller</h2>
                    <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        Pantau dan audit performa jaringan Agensi/Seller Anda.
                    </p>
                </div>
                <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all">
                    Register New Seller
                </button>
            </div>

            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-8">{[1, 2].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[32px] animate-pulse" />)}</div>}>
                <SellerList />
            </Suspense>
        </div>
    );
}
