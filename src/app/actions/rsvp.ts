"use server";

import { db } from "@/db";
import { guests, invitations, users } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { sendRSVPNotification } from "@/lib/mail";

const rsvpSchema = z.object({
    invitationId: z.number(),
    name: z.string().min(1, "Nama wajib diisi"),
    attendance: z.enum(["hadir", "tidak", "ragu"]),
    message: z.string().optional(),
});

export async function submitRSVP(formData: z.infer<typeof rsvpSchema>) {
    try {
        const validated = rsvpSchema.parse(formData);

        // 1. Insert RSVP
        await db.insert(guests).values({
            invitationId: validated.invitationId,
            name: validated.name,
            attendance: validated.attendance,
            message: validated.message,
        });

        // 2. Fetch User/Owner info for notification
        const invitation = await db.query.invitations.findFirst({
            where: eq(invitations.id, validated.invitationId),
            with: {
                user: true
            }
        });

        if (invitation && invitation.user) {
            // Trigger email notification (don't await to keep RSVP fast, or await for reliability)
            await sendRSVPNotification({
                to: invitation.user.email,
                customerName: invitation.user.name || "User",
                guestName: validated.name,
                attendance: validated.attendance,
                message: validated.message,
                invitationSlug: invitation.slug
            });
        }

        return { success: true };
    } catch (error) {
        console.error("❌ RSVP Submission Error:", error);
        return { success: false, error: "Gagal mengirim konfirmasi" };
    }
}
