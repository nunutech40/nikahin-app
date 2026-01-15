"use server";

import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Save/Update an invitation with ownership check
 */
export async function saveInvitation(invitationId: number, content: any) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { success: false, error: "Authentication required" };
        }

        const userId = Number((session.user as any).id);

        // Update with ownership check in WHERE clause
        const result = await db.update(invitations)
            .set({
                content,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(invitations.id, invitationId),
                    eq(invitations.userId, userId)
                )
            );

        if (result.rowCount === 0) {
            return { success: false, error: "Invitation not found or unauthorized" };
        }

        return { success: true };
    } catch (error) {
        console.error("❌ Save Invitation Error:", error);
        return { success: false, error: "Gagal menyimpan data" };
    }
}

/**
 * Create a new invitation for the current user
 */
export async function createInvitation(themeId: number, packageId: number, slug: string, content: any) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { success: false, error: "Authentication required" };
        }

        const userId = Number((session.user as any).id);

        const result = await db.insert(invitations).values({
            userId,
            themeId,
            packageId,
            slug,
            content,
            isPublished: true,
        }).returning();

        return { success: true, data: result[0] };
    } catch (error) {
        console.error("❌ Create Invitation Error:", error);
        return { success: false, error: "Gagal membuat undangan" };
    }
}
