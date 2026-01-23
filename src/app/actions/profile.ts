"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    phone: z.string().min(10, "Nomor WhatsApp tidak valid"),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

/**
 * Update user basic profile
 */
export async function updateProfile(data: { name: string, phone: string }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const userId = Number((session.user as any).id);

    try {
        const validated = profileSchema.parse(data);

        await db.update(users)
            .set({
                name: validated.name,
                phone: validated.phone,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        revalidatePath("/dashboard/profile");
        return { success: true };
    } catch (error) {
        console.error("Profile Update Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Gagal memperbarui profil" };
    }
}

/**
 * Update user password
 */
export async function updatePassword(data: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const userId = Number((session.user as any).id);

    try {
        const validated = passwordSchema.parse(data);

        // Get user from DB to check current password
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) return { success: false, error: "User tidak ditemukan" };

        // Verify current password
        const passwordMatch = await bcrypt.compare(validated.currentPassword, user.password);
        if (!passwordMatch) {
            return { success: false, error: "Password saat ini salah" };
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(validated.newPassword, 10);

        await db.update(users)
            .set({
                password: hashedNewPassword,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        return { success: true };
    } catch (error) {
        console.error("Password Update Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Gagal memperbarui password" };
    }
}
