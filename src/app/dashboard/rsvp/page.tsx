import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { invitations, guests } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Users,
    CheckCircle2,
    XCircle,
    HelpCircle,
    MessageSquare,
    Calendar,
    ArrowLeft,
    Download
} from "lucide-react";
import Link from "next/link";
import RoyalCard from "@/components/ui/RoyalCard";
import RoyalBadge from "@/components/ui/RoyalBadge";
import ExportRSVPButton from "./ExportRSVPButton";
import StatCard from "../StatCard";

export default async function RSVPInboxPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userId = Number((session.user as any).id);

    // 1. Get all invitations for this user
    const userInvitations = await db.query.invitations.findMany({
        where: eq(invitations.userId, userId),
    });

    const invitationIds = userInvitations.map(inv => inv.id);

    // 2. Get all RSVPs for these invitations
    const allRSVPs = invitationIds.length > 0
        ? await db.query.guests.findMany({
            where: inArray(guests.invitationId, invitationIds),
            orderBy: [desc(guests.createdAt)],
            with: {
                invitation: true
            }
        })
        : [];

    const stats = {
        total: allRSVPs.length,
        hadir: allRSVPs.filter(r => r.attendance === 'hadir').length,
        tidak: allRSVPs.filter(r => r.attendance === 'tidak').length,
        ragu: allRSVPs.filter(r => r.attendance === 'ragu').length,
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 pt-8 pb-12 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/dashboard"
                            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight">RSVP Inbox</h1>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manajemen & Rekap Kehadiran Tamu</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <StatCard
                            title="Total RSVP"
                            value={stats.total}
                            icon={Users}
                            variant="info"
                        />
                        <StatCard
                            title="Hadir"
                            value={stats.hadir}
                            icon={CheckCircle2}
                            variant="success"
                        />
                        <StatCard
                            title="Tidak Hadir"
                            value={stats.tidak}
                            icon={XCircle}
                            variant="danger"
                        />
                        <StatCard
                            title="Ragu-ragu"
                            value={stats.ragu}
                            icon={HelpCircle}
                            variant="warning"
                        />
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif font-black text-xl text-slate-800">Daftar Konfirmasi Terbaru</h2>
                    <ExportRSVPButton data={allRSVPs} />
                </div>

                {allRSVPs.length === 0 ? (
                    <RoyalCard className="py-20 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Belum Ada RSVP</h3>
                        <p className="text-slate-400 max-w-xs">Tamu undangan Anda belum ada yang mengisi konfirmasi kehadiran.</p>
                    </RoyalCard>
                ) : (
                    <div className="space-y-4">
                        {allRSVPs.map((rsvp) => (
                            <RoyalCard key={rsvp.id} className="group hover:border-amber-200 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm
                                            ${rsvp.attendance === 'hadir' ? 'bg-emerald-50 text-emerald-600' :
                                                rsvp.attendance === 'tidak' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-amber-50 text-amber-600'}
                                        `}>
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-slate-900 text-lg">{rsvp.name}</h4>
                                                <RoyalBadge variant={
                                                    rsvp.attendance === 'hadir' ? 'success' :
                                                        rsvp.attendance === 'tidak' ? 'error' : 'warning'
                                                }>
                                                    {(rsvp.attendance || 'ragu').toUpperCase()}
                                                </RoyalBadge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1">
                                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(rsvp.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    Via: {rsvp.invitation?.slug || 'unknown'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {rsvp.message && (
                                        <div className="flex-1 md:max-w-md bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-600 text-sm">
                                            "{rsvp.message}"
                                        </div>
                                    )}
                                </div>
                            </RoyalCard>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
