"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Toggle user activation status (for Admin only)
 */
export async function toggleUserStatus(userId: number, currentStatus: boolean) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        await db
            .update(users)
            .set({ isActive: !currentStatus })
            .where(eq(users.id, userId));

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error toggling user status:", error);
        return { success: false, error: "Database error occurred." };
    }
}

/**
 * Delete invitation (Admin only)
 */
export async function deleteInvitation(invitationId: number) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        const { invitations } = await import("@/db/schema");
        await db.delete(invitations).where(eq(invitations.id, invitationId));

        revalidatePath("/admin/invitations");
        return { success: true };
    } catch (error) {
        console.error("Error deleting invitation:", error);
        return { success: false, error: "Failed to delete invitation." };
    }
}
