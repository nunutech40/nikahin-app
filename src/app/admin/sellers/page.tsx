import React, { Suspense } from "react";
import { db } from "@/db";
import { users, invitations } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { Store, Users, FileText, ChevronRight, ShieldCheck, Mail, Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RoyalBadge from "@/components/ui/RoyalBadge";
import RoyalEmptyState from "@/components/ui/RoyalEmptyState";
import Link from "next/link";
import AddSellerClient from "./AddSellerClient";

async function SellerListTable() {
    // Fetch all users with 'agency' role
    const agencies = await db.query.users.findMany({
        where: eq(users.role, "agency"),
        orderBy: [desc(users.createdAt)],
    });

    // Fetch stats per agency
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
            <div className="bg-white rounded-[32px] border border-slate-100 p-12">
                <RoyalEmptyState
                    title="Belum Ada Seller"
                    description="Semua partner agensi yang Anda daftarkan atau promote akan muncul di list ini."
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seller Information</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Base</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Sales</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Join Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {agencyStats.map((seller) => (
                            <tr key={seller.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                                            {seller.name ? (
                                                <span className="font-black text-lg">{seller.name.charAt(0)}</span>
                                            ) : (
                                                <Store className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 leading-tight">{seller.name || seller.email.split('@')[0]}</p>
                                            <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                <Mail className="w-3 h-3" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest">{seller.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                                            <Users className="w-3 h-3" /> {seller.customerCount}
                                        </div>
                                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em]">Users</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                                            <FileText className="w-3 h-3" /> {seller.invitationCount}
                                        </div>
                                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em]">Invites</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <p className="text-xs font-bold text-slate-500">{format(new Date(seller.createdAt), "dd MMM yyyy", { locale: id })}</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link
                                        href={`/admin/sellers/${seller.id}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all group/btn"
                                    >
                                        Insight <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function AdminSellersPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Manajemen Seller</h2>
                    <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        List partner agensi yang mengelola jaringan Nikahin.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="search"
                            placeholder="Search seller..."
                            className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all w-64"
                        />
                    </div>
                    <AddSellerClient />
                </div>
            </div>

            <Suspense fallback={
                <div className="bg-white rounded-[32px] border border-slate-50 animate-pulse p-10 space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl" />)}
                </div>
            }>
                <SellerListTable />
            </Suspense>
        </div>
    );
}
