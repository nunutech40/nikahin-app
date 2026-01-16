"use server";

import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateTransactionStatus(transactionId: number, status: "approved" | "rejected") {
    try {
        // 1. Get the transaction to find the user
        const tx = await db.query.transactions.findFirst({
            where: eq(transactions.id, transactionId),
        });

        if (!tx) {
            return { success: false, error: "Transaksi tidak ditemukan" };
        }

        // 2. Update transaction status
        await db.update(transactions)
            .set({
                status,
                updatedAt: new Date()
            })
            .where(eq(transactions.id, transactionId));

        // 3. If approved, activate the user's account (SaaS activation logic)
        if (status === "approved") {
            await db.update(users)
                .set({
                    isActive: true,
                    updatedAt: new Date()
                })
                .where(eq(users.id, tx.userId));
        }

        revalidatePath("/admin/billing");
        return { success: true };
    } catch (error) {
        console.error("❌ Billing Update Error:", error);
        return { success: false, error: "Gagal memperbarui status transaksi" };
    }
}
