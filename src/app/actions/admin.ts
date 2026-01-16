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

/**
 * Update user role (Super Admin only)
 */
export async function updateUserRole(userId: number, newRole: "admin" | "customer" | "agency") {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        await db
            .update(users)
            .set({ role: newRole })
            .where(eq(users.id, userId));

        revalidatePath("/admin/users");
        revalidatePath("/admin/sellers");
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: "Database error occurred." };
    }
}

/**
 * Direct Create Seller (Super Admin only)
 */
export async function createSeller(data: { name: string, email: string, phone: string, password: string }) {
    const session = await getServerSession(authOptions);
    const bcrypt = await import("bcrypt");

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        await db.insert(users).values({
            email: data.email,
            password: hashedPassword,
            name: data.name,
            phone: data.phone,
            role: "agency",
            isActive: true,
        });

        revalidatePath("/admin/sellers");
        revalidatePath("/admin/users");

        return { success: true };
    } catch (error: any) {
        if (error.code === '23505') { // Postgres unique violation
            return { success: false, error: "Email sudah terdaftar." };
        }
        console.error("Error creating seller:", error);
        return { success: false, error: "Gagal membuat akun seller." };
    }
}

/**
 * Update Package Features (Super Admin only)
 */
export async function updatePackageFeatures(packageId: number, featureIds: number[]) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        const { packageFeatures } = await import("@/db/schema");

        // Delete all existing features for this package
        await db.delete(packageFeatures).where(eq(packageFeatures.packageId, packageId));

        // Insert new features
        if (featureIds.length > 0) {
            await db.insert(packageFeatures).values(
                featureIds.map(featureId => ({
                    packageId,
                    featureId,
                }))
            );
        }

        revalidatePath("/admin/features");
        return { success: true };
    } catch (error) {
        console.error("Error updating package features:", error);
        return { success: false, error: "Failed to update package features." };
    }
}

/**
 * Toggle Feature Core/Default Status (Super Admin only)
 */
export async function toggleFeatureCoreStatus(featureId: number, currentStatus: boolean) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        const { features } = await import("@/db/schema");
        await db
            .update(features)
            .set({ isCore: !currentStatus })
            .where(eq(features.id, featureId));

        revalidatePath("/admin/features");
        return { success: true };
    } catch (error) {
        console.error("Error toggling feature core status:", error);
        return { success: false, error: "Failed to update feature status." };
    }
}
