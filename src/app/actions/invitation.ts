"use server";

import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveInvitation(invitationId: number, content: any) {
    try {
        await db.update(invitations)
            .set({
                content,
                updatedAt: new Date(),
            })
            .where(eq(invitations.id, invitationId));

        // Revalidate the invitation page if needed
        // revalidatePath('/[slug]', 'page');

        return { success: true };
    } catch (error) {
        console.error("❌ Save Invitation Error:", error);
        return { success: false, error: "Gagal menyimpan data" };
    }
}

export async function createInvitation(userId: number, themeId: number, packageId: number, slug: string, content: any) {
    try {
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
