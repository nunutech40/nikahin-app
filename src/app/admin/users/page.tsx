import React from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import UserTableClient from "./UserTableClient";

export default async function AdminUsersPage() {
    const allUsers = await db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">Manajemen User</h2>
                    <p className="text-slate-500">Kelola akses pendaftar dan status akun pasangan.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-bold border border-emerald-100 uppercase tracking-wider">
                    Total: {allUsers.length} Users
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <UserTableClient initialUsers={allUsers as any} />
            </div>
        </div>
    );
}
