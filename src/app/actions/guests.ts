"use server";

import { db } from "@/db";
import { guests } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addGuest(invitationId: number, data: { name: string; phone?: string; category?: string; pax?: number }) {
    try {
        await db.insert(guests).values({
            invitationId,
            name: data.name,
            phone: data.phone,
            category: data.category || "Umum",
            pax: data.pax || 1,
        });
        revalidatePath("/dashboard/guests");
        return { success: true };
    } catch (error) {
        console.error("Error adding guest:", error);
        return { success: false, error: "Gagal menambah tamu" };
    }
}

export async function importGuests(invitationId: number, guestList: any[]) {
    try {
        // guestList should be an array of { name, phone, category, pax }
        const values = guestList.map(g => ({
            invitationId,
            name: g.name,
            phone: g.phone?.toString() || null,
            category: g.category || "Umum",
            pax: g.pax ? parseInt(g.pax) : 1,
        }));

        if (values.length === 0) return { success: true };

        await db.insert(guests).values(values);
        revalidatePath("/dashboard/guests");
        return { success: true, count: values.length };
    } catch (error) {
        console.error("Error importing guests:", error);
        return { success: false, error: "Gagal mengimport data" };
    }
}

export async function deleteGuest(id: number) {
    try {
        await db.delete(guests).where(eq(guests.id, id));
        revalidatePath("/dashboard/guests");
        return { success: true };
    } catch (error) {
        console.error("Error deleting guest:", error);
        return { success: false, error: "Gagal menghapus tamu" };
    }
}
