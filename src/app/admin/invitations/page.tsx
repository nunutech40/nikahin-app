import React from "react";
import { db } from "@/db";
import { invitations, users, themes } from "@/db/schema";
import { desc } from "drizzle-orm";
import InvitationTableClient from "./InvitationTableClient";

export default async function AdminInvitationsPage() {
    const allInvitations = await db.query.invitations.findMany({
        with: {
            user: true,
            theme: true,
        },
        orderBy: [desc(invitations.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">Manajemen Undangan</h2>
                    <p className="text-slate-500">Pantau semua undangan digital yang aktif di sistem.</p>
                </div>
                <div className="px-4 py-2 bg-amber-50 rounded-xl text-amber-700 text-sm font-bold border border-amber-100 uppercase tracking-wider">
                    Total: {allInvitations.length} Undangan
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <InvitationTableClient initialInvitations={allInvitations as any} />
            </div>
        </div>
    );
}
