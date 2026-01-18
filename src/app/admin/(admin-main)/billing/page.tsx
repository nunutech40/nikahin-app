import React from "react";
import { db } from "@/db";
import { transactions, users, packages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import {
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    ExternalLink,
    Banknote,
    User as UserIcon,
    Package
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";
import BillingClientActions from "@/app/admin/billing/BillingClientActions";

export default async function AdminBillingPage() {
    // Fetch all transactions with relations
    const allTransactions = await db.query.transactions.findMany({
        orderBy: [desc(transactions.createdAt)],
        with: {
            user: true,
            package: true
        }
    }) as any[]; // Type cast to avoid relation inference issues in linting

    const stats = {
        pending: allTransactions.filter(tx => tx.status === "pending").length,
        approved: allTransactions.filter(tx => tx.status === "approved").length,
        totalRevenue: allTransactions
            .filter(tx => tx.status === "approved")
            .reduce((sum, tx) => sum + tx.amount, 0),
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Billing Hub</h2>
                    <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Verifikasi pembayaran & aktivasi akun premium.
                    </p>
                </div>

                <div className="flex gap-4">
                    <RoyalCard variant="glass" className="py-2 px-6 flex items-center gap-3 border-l-4 border-l-emerald-500">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Banknote className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
                            <p className="text-lg font-black text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                    </RoyalCard>
                    <RoyalCard variant="glass" className="py-2 px-6 flex items-center gap-3 border-l-4 border-l-amber-500">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                            <p className="text-lg font-black text-slate-900">{stats.pending}</p>
                        </div>
                    </RoyalCard>
                </div>
            </div>

            {/* List */}
            <RoyalCard>
                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-2">Customer / Date</th>
                                <th className="px-6 py-2">Package / Amount</th>
                                <th className="px-6 py-2">Proof</th>
                                <th className="px-6 py-2">Status</th>
                                <th className="px-6 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTransactions.map((tx) => (
                                <tr key={tx.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <td className="px-6 py-4 bg-slate-50/50 rounded-l-2xl border-y border-l border-slate-100 group-hover:bg-white transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm leading-tight">{tx.user?.name || "Unknown User"}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                    {format(new Date(tx.createdAt), "dd MMM yyyy", { locale: id })}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white transition-colors uppercase">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="font-black text-slate-700 text-xs">{tx.package?.name || "Basic"}</span>
                                        </div>
                                        <p className="text-sm font-black text-emerald-600">{formatCurrency(tx.amount)}</p>
                                    </td>

                                    <td className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white transition-colors">
                                        {tx.paymentProof ? (
                                            <a
                                                href={tx.paymentProof}
                                                target="_blank"
                                                className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline decoration-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View Receipt
                                            </a>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">No Proof</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white transition-colors">
                                        <RoyalBadge variant={
                                            tx.status === "approved" ? "success" :
                                                tx.status === "rejected" ? "error" : "warning"
                                        }>
                                            {tx.status}
                                        </RoyalBadge>
                                    </td>

                                    <td className="px-6 py-4 bg-slate-50/50 rounded-r-2xl border-y border-r border-slate-100 group-hover:bg-white transition-colors text-right">
                                        {tx.status === "pending" ? (
                                            <BillingClientActions transactionId={tx.id} />
                                        ) : (
                                            <div className="flex items-center justify-end gap-2 text-slate-300">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Handled</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {allTransactions.length === 0 && (
                        <div className="py-20 flex flex-col items-center text-center">
                            <CreditCard className="w-16 h-16 text-slate-100 mb-4" />
                            <p className="text-slate-400 font-medium italic">Belum ada transaksi yang tercatat.</p>
                        </div>
                    )}
                </div>
            </RoyalCard>
        </div>
    );
}
