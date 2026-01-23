"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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

/**
 * Delete User (Super Admin only)
 * Also deletes all user's invitations
 */
export async function deleteUser(userId: number) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is authenticated
        if (!session?.user) {
            return { success: false, error: "Authentication required" };
        }

        const currentUserRole = (session.user as any).role;

        // Only super admin can delete users
        if (currentUserRole !== "admin") {
            return { success: false, error: "Unauthorized. Only super admin can delete users." };
        }

        // Prevent self-deletion
        const currentUserId = Number((session.user as any).id);
        if (currentUserId === userId) {
            return { success: false, error: "You cannot delete your own account." };
        }

        // Check if user exists
        const userToDelete = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!userToDelete) {
            return { success: false, error: "User not found" };
        }

        // Prevent deleting other admins
        if (userToDelete.role === "admin") {
            return { success: false, error: "Cannot delete other admin accounts." };
        }

        // Delete user's invitations first (foreign key constraint)
        const { invitations } = await import("@/db/schema");
        await db.delete(invitations).where(eq(invitations.userId, userId));

        // Delete user
        await db.delete(users).where(eq(users.id, userId));

        revalidatePath("/admin");
        revalidatePath("/admin/users");

        return {
            success: true,
            message: `User ${userToDelete.email} and all their invitations have been deleted.`
        };
    } catch (error) {
        console.error("❌ Delete User Error:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

/**
 * Update system settings (Global Config)
 */
export async function updateSystemSettings(settings: any) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        const { systemSettings } = await import("@/db/schema");

        await db.insert(systemSettings).values({
            key: "global_config",
            value: settings,
        }).onConflictDoUpdate({
            target: systemSettings.key,
            set: { value: settings }
        });

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating system settings:", error);
        return { success: false, error: "Failed to save settings." };
    }
}

/**
 * Get system settings
 */
export async function getSystemSettings() {
    try {
        const { systemSettings } = await import("@/db/schema");
        const settings = await db.query.systemSettings.findFirst({
            where: eq(systemSettings.key, "global_config")
        });

        return settings?.value || null;
    } catch (error) {
        console.error("Error getting system settings:", error);
        return null;
    }
}

/**
 * Get paginated users for Admin Panel
 */
export async function getPaginatedUsers({
    page = 1,
    limit = 10,
    search = "",
    tab = "customers"
}: {
    page?: number;
    limit?: number;
    search?: string;
    tab?: "staff" | "customers" | "demo";
}) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const { users, packages } = await import("@/db/schema");
        const { sql, or, ilike, and, eq, ne } = await import("drizzle-orm");

        const offset = (page - 1) * limit;

        // Build conditions based on tab and search
        let conditions: any[] = [];

        if (tab === "staff") {
            conditions.push(or(eq(users.role, "admin"), eq(users.role, "agency")));
        } else if (tab === "demo") {
            // Demo users are customers with package 'demo'
            const demoPkg = await db.query.packages.findFirst({ where: eq(packages.slug, "demo") });
            conditions.push(and(
                eq(users.role, "customer"),
                demoPkg ? eq(users.packageId, demoPkg.id) : undefined
            ));
        } else {
            // Regular customers (not staff, not demo)
            const demoPkg = await db.query.packages.findFirst({ where: eq(packages.slug, "demo") });
            conditions.push(and(
                eq(users.role, "customer"),
                demoPkg ? ne(users.packageId, demoPkg.id) : undefined
            ));
        }

        if (search) {
            conditions.push(or(
                ilike(users.email, `%${search}%`),
                ilike(users.name, `%${search}%`)
            ));
        }

        const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

        const data = await db.query.users.findMany({
            where: whereClause,
            limit,
            offset,
            with: {
                package: true,
            },
            orderBy: [desc(users.createdAt)],
        });

        // Get total count for this specific filter
        const totalResult = await db.select({ count: sql<number>`count(*)` })
            .from(users)
            .where(whereClause);

        const total = totalResult[0].count;

        return {
            success: true,
            data,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Error fetching paginated users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

/**
 * Get paginated invitations for Admin Panel
 */
export async function getPaginatedInvitations({
    page = 1,
    limit = 10,
    search = ""
}: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const { invitations, users } = await import("@/db/schema");
        const { sql, ilike, desc, or } = await import("drizzle-orm");

        const offset = (page - 1) * limit;

        let whereClause = undefined;
        if (search) {
            whereClause = ilike(invitations.slug, `%${search}%`);
        }

        const data = await db.query.invitations.findMany({
            where: whereClause,
            limit,
            offset,
            with: {
                user: true,
                theme: true,
            },
            orderBy: [desc(invitations.createdAt)],
        });

        const totalResult = await db.select({ count: sql<number>`count(*)` })
            .from(invitations)
            .where(whereClause);

        const total = totalResult[0].count;

        return {
            success: true,
            data,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Error fetching paginated invitations:", error);
        return { success: false, error: "Failed to fetch invitations" };
    }
}

/**
 * Update Package Details (Super Admin only)
 */
export async function updatePackageDetails(packageId: number, data: { name: string, description: string, price: number, originalPrice: number }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        const { packages } = await import("@/db/schema");
        await db
            .update(packages)
            .set({
                name: data.name,
                description: data.description,
                price: data.price,
                originalPrice: data.originalPrice,
                updatedAt: new Date()
            })
            .where(eq(packages.id, packageId));

        revalidatePath("/admin/settings");
        revalidatePath("/");
        revalidatePath("/dashboard/billing");

        return { success: true };
    } catch (error) {
        console.error("Error updating package details:", error);
        return { success: false, error: "Failed to update package details." };
    }
}
