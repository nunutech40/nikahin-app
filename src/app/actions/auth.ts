"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    name: z.string().min(2, "Nama minimal 2 karakter"),
    phone: z.string().min(10, "Nomor WhatsApp tidak valid"),
    role: z.enum(["customer", "agency"]).optional().default("customer"),
});

export async function registerUser(formData: any) {
    try {
        const validated = registerSchema.parse(formData);

        // 1. Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, validated.email),
        });

        if (existingUser) {
            return { success: false, error: "Email sudah terdaftar" };
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // 3. Insert user
        await db.insert(users).values({
            email: validated.email,
            password: hashedPassword,
            name: validated.name,
            phone: validated.phone,
            role: validated.role as "customer" | "agency" | "admin",
            isActive: true, // Default to true for now
        });

        return { success: true };
    } catch (error) {
        console.error("❌ Registration Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Gagal mendaftarkan akun" };
    }
}
