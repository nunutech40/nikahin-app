import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { invitations, guests } from "@/db/schema";
import { eq, desc, asc, and, ilike } from "drizzle-orm";
import {
    Users,
    ArrowLeft,
    Plus,
    Download,
    Search,
    MessageCircle,
    UserCircle,
    Smartphone
} from "lucide-react";
import Link from "next/link";
import RoyalCard from "@/components/ui/RoyalCard";
import ImportExcelButton from "./ImportExcelButton";
import AddGuestModal from "./AddGuestModal";
import GuestListTable from "./GuestListTable";
import GuestWrapper from "./GuestWrapper";
import GuestToolbar from "./GuestToolbar";


export default async function GuestManagementPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userId = Number((session.user as any).id);

    // 1. Get user's invitation
    const userInvitations = await db.query.invitations.findMany({
        where: eq(invitations.userId, userId),
    });

    if (userInvitations.length === 0) {
        redirect("/dashboard");
    }

    const activeInvitation = userInvitations[0];
    const invitationId = activeInvitation.id;

    // 2. Parse Search Params
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'latest';

    // 3. Build Query Conditions
    const whereConditions = [eq(guests.invitationId, invitationId)];
    if (search) {
        whereConditions.push(ilike(guests.name, `%${search}%`));
    }

    // 4. Build Sort Order
    let orderBy;
    switch (sort) {
        case 'name_asc':
            orderBy = [asc(guests.name)];
            break;
        case 'status_wa':
            orderBy = [desc(guests.isInvited), asc(guests.name)];
            break;
        case 'category':
            orderBy = [asc(guests.category), asc(guests.name)];
            break;
        case 'latest':
        default:
            orderBy = [desc(guests.updatedAt), desc(guests.createdAt)];
            break;
    }

    // 5. Get guests
    const allGuests = await db.query.guests.findMany({
        where: and(...whereConditions),
        orderBy: orderBy,
    });

    // 6. Get stats (Always from ALL guests, ignoring filters)
    // We need a separate query for stats if we want accurate total counts even when filtering
    // Or we can just calculate stats from allGuests if we consider stats should reflect filtered view?
    // Usually "Total Daftar Tamu" implies ALL guests. 
    // Let's fetch ALL guests for stats, and filtered guests for table. 
    // To optimize, maybe we can do a count query or just fetch all for now since dataset isn't huge yet.
    // For now, let's just make a second query for stats to be safe and accurate.

    const allGuestsForStats = await db.query.guests.findMany({
        where: eq(guests.invitationId, invitationId),
    });

    const stats = {
        total: allGuestsForStats.length,
        invited: allGuestsForStats.filter(g => g.isInvited).length,
        responded: allGuestsForStats.filter(g => g.attendance).length,
        totalPax: allGuestsForStats.reduce((acc, g) => acc + (g.pax || 0), 0)
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 overflow-hidden">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 pt-8 pb-12 shadow-sm relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Users className="w-64 h-64 -rotate-12" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#B48C5E] hover:border-[#B48C5E]/20 transition-all shadow-sm"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 font-serif tracking-tight italic">Manajemen Tamu</h1>
                                <p className="text-[#B48C5E] text-[10px] font-black uppercase tracking-[0.3em] mt-2">Daftar Undangan & WhatsApp Blast</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ImportExcelButton invitationId={invitationId} />
                            <GuestWrapper invitationId={invitationId} />
                        </div>
                    </div>

                    {/* Toolbar Area (Search & Sort) */}
                    <div className="mb-8">
                        <GuestToolbar />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <RoyalCard variant="glass" className="p-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Users className="w-12 h-12" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Daftar Tamu</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">Kontak</span>
                            </div>
                        </RoyalCard>

                        <RoyalCard variant="glass" className="p-6 border-l-4 border-l-[#B48C5E] relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-12 h-12" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">WA Terkirim</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.invited}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">/ {stats.total}</span>
                            </div>
                        </RoyalCard>

                        <RoyalCard variant="glass" className="p-6 border-l-4 border-l-emerald-500 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <UserCircle className="w-12 h-12" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Telah Respon</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.responded}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">RSVP</span>
                            </div>
                        </RoyalCard>

                        <RoyalCard variant="glass" className="p-6 border-l-4 border-l-indigo-500 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Smartphone className="w-12 h-12" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Pax (Orang)</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.totalPax}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">Estimasi</span>
                            </div>
                        </RoyalCard>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col gap-8">
                    {/* Table Area */}
                    <div className="flex-1">
                        <GuestListTable guests={allGuests} invitationSlug={activeInvitation.slug} />

                        <div className="mt-12 text-center bg-slate-100/50 p-12 rounded-[40px] border border-dashed border-slate-200">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Sudah selesai mengatur daftar tamu?</p>
                            <Link
                                href="#"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#B48C5E] text-white rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-[#B48C5E]/30 transition-all"
                            >
                                <Smartphone className="w-4 h-4" />
                                MULAI WHATSAPP BLAST
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
