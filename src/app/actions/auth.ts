"use server";

import { db } from "@/db";
import { users, packages, invitations, themes } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    name: z.string().min(2, "Nama minimal 2 karakter"),
    phone: z.string().min(10, "Nomor WhatsApp tidak valid"),
    role: z.enum(["customer", "agency"]).optional().default("customer"),
    referredByCode: z.string().optional(),
    selectedPackage: z.string().optional().default("bronze"), // Package selection
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

        // 3. Find referrer if code is provided
        let referrerId: number | undefined = undefined;
        if (validated.referredByCode) {
            const referrer = await db.query.users.findFirst({
                where: eq(users.referralCode, validated.referredByCode),
            });
            if (referrer) {
                referrerId = referrer.id;
            }
        }

        // 4. Find selected package
        const selectedPkg = await db.query.packages.findFirst({
            where: eq(packages.slug, validated.selectedPackage),
        });

        if (!selectedPkg) {
            return { success: false, error: "Paket tidak ditemukan" };
        }

        // 5. Generate referral code for agencies
        const referralCode = validated.role === 'agency'
            ? `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            : null;

        // 6. Insert user with package assignment
        const newUser = await db.insert(users).values({
            email: validated.email,
            password: hashedPassword,
            name: validated.name,
            phone: validated.phone,
            role: validated.role as "customer" | "agency" | "admin",
            packageId: selectedPkg.id, // Assign selected package
            isActive: false, // Testing Mode: User needs to pay to publish
            referralCode: referralCode,
            referredBy: referrerId,
        }).returning();

        const userId = newUser[0].id;

        // 7. AUTO-CREATE INITIAL DRAFT
        // This prevents the "Empty Dashboard" friction
        try {
            const defaultTheme = await db.query.themes.findFirst({
                where: eq(themes.isActive, true)
            });

            if (defaultTheme) {
                // Generate a base slug from name
                const baseSlug = validated.name.toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');

                const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(7)}`;

                const { MOCK_DATA } = await import("@/data/mockData");

                await db.insert(invitations).values({
                    userId: userId,
                    themeId: defaultTheme.id,
                    packageId: selectedPkg.id,
                    slug: uniqueSlug,
                    content: MOCK_DATA,
                    isPublished: false,
                });
            }
        } catch (draftError) {
            console.error("⚠️ Failed to create auto-draft:", draftError);
            // Non-blocking, user can still create manual draft later
        }

        return { success: true };
    } catch (error) {
        console.error("❌ Registration Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Gagal mendaftarkan akun" };
    }
}
