"use server";

import { db } from "@/db";
import { guests } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const rsvpSchema = z.object({
    invitationId: z.number(),
    name: z.string().min(1, "Nama wajib diisi"),
    attendance: z.enum(["hadir", "tidak", "ragu"]),
    message: z.string().optional(),
});

export async function submitRSVP(formData: z.infer<typeof rsvpSchema>) {
    try {
        const validated = rsvpSchema.parse(formData);

        await db.insert(guests).values({
            invitationId: validated.invitationId,
            name: validated.name,
            attendance: validated.attendance,
            message: validated.message,
        });

        // Revalidate the invitation page to show updated guestbook
        // We'll need the slug for this, let's assume we pass it or just use revalidatePath
        // Since we don't have the slug here easily, we can just return success

        return { success: true };
    } catch (error) {
        console.error("❌ RSVP Submission Error:", error);
        return { success: false, error: "Gagal mengirim konfirmasi" };
    }
}
