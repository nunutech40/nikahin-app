import React from "react";
import { db } from "@/db";
import { users, packages } from "@/db/schema";
import { desc, sql, or, eq, and, ne } from "drizzle-orm";
import UserTableClient from "./UserTableClient";

export default async function AdminUsersPage() {
    // Initial fetch for first page
    const initialLimit = 10;
    const initialUsers = await db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
        limit: initialLimit,
        where: and(ne(users.role, "admin"), ne(users.role, "agency")), // Default to customers tab
        with: {
            package: true,
        },
    });

    // Get counts for tabs
    const staffCountResult = await db.select({ count: sql<number>`count(*)` })
        .from(users)
        .where(or(eq(users.role, "admin"), eq(users.role, "agency")));

    // Get demo package ID
    const demoPkg = await db.query.packages.findFirst({ where: eq(packages.slug, "demo") });

    const demoCountResult = await db.select({ count: sql<number>`count(*)` })
        .from(users)
        .where(and(
            eq(users.role, "customer"),
            demoPkg ? eq(users.packageId, demoPkg.id) : sql`false`
        ));

    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);

    const staffCount = staffCountResult[0].count;
    const demoCount = demoCountResult[0].count;
    const totalUsers = totalUsersResult[0].count;
    const customerCount = totalUsers - staffCount - demoCount;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">Manajemen User</h2>
                    <p className="text-slate-500">Kelola akses pendaftar dan status akun pasangan.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-bold border border-emerald-100 uppercase tracking-wider">
                    Total: {totalUsers} Users
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <UserTableClient
                    initialUsers={initialUsers as any}
                    initialTotal={customerCount}
                    initialStaffCount={staffCount}
                    initialDemoCount={demoCount}
                    initialCustomerCount={customerCount}
                />
            </div>
        </div>
    );
}
