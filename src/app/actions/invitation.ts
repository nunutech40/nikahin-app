"use server";

import { db } from "@/db";
import { invitations, packages, packageFeatures, features } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Save/Update an invitation with ownership and feature access checks
 */
export async function saveInvitation(invitationId: number, content: any) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { success: false, error: "Authentication required" };
        }

        const userId = Number((session.user as any).id);

        // 1. Fetch invitation with package entitlements
        const invitation = await db.query.invitations.findFirst({
            where: and(eq(invitations.id, invitationId), eq(invitations.userId, userId)),
            with: {
                package: {
                    with: {
                        features: {
                            with: {
                                feature: true
                            }
                        }
                    }
                }
            }
        });

        if (!invitation) {
            return { success: false, error: "Invitation not found or unauthorized" };
        }

        // 2. Extract allowed feature codes
        // @ts-ignore - Drizzle relation typing can be tricky here
        const allowedFeatures = invitation.package?.features.map((pf: any) => pf.feature.code) || [];

        // 3. Sanitize content based on entitlements
        const sanitizedContent = { ...content };

        if (!allowedFeatures.includes('gallery_10') && !allowedFeatures.includes('gallery_unlimited')) {
            sanitizedContent.gallery = [];
        }

        if (!allowedFeatures.includes('love_story')) {
            sanitizedContent.loveStory = [];
        }

        if (!allowedFeatures.includes('background_music')) {
            sanitizedContent.musicUrl = "";
        }

        if (!allowedFeatures.includes('gift_registry')) {
            sanitizedContent.giftOptions = [];
            sanitizedContent.shippingAddress = null;
        }

        if (!allowedFeatures.includes('custom_theme')) {
            // Reset to default/null so renderer uses default theme values
            if (sanitizedContent.themeConfig) {
                delete sanitizedContent.themeConfig;
            }
        }

        if (!allowedFeatures.includes('unlimited_events') && sanitizedContent.events && sanitizedContent.events.length > 1) {
            sanitizedContent.events = [sanitizedContent.events[0]];
        }

        // 4. Update with sanitized content
        await db.update(invitations)
            .set({
                content: sanitizedContent,
                updatedAt: new Date(),
            })
            .where(eq(invitations.id, invitationId));

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
            isPublished: false, // Changed: Default to unpublished (Testing Mode)
        }).returning();

        return { success: true, data: result[0] };
    } catch (error) {
        console.error("❌ Create Invitation Error:", error);
        return { success: false, error: "Gagal membuat undangan" };
    }
}

/**
 * Publish an invitation (Testing Mode: Requires user.isActive = true)
 */
export async function publishInvitation(invitationId: number) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { success: false, error: "Authentication required" };
        }

        const userId = Number((session.user as any).id);

        // 1. Check if user is active (has paid)
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            with: {
                package: true
            }
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // 2. TESTING MODE CHECK: User must be active to publish
        if (!user.isActive) {
            return {
                success: false,
                error: "payment_required",
                message: "Silakan lakukan pembayaran terlebih dahulu untuk mempublish undangan Anda",
                packageName: user.package?.name || "Unknown",
                packagePrice: user.package?.price || 0
            };
        }

        // 3. Verify ownership
        const invitation = await db.query.invitations.findFirst({
            where: and(eq(invitations.id, invitationId), eq(invitations.userId, userId))
        });

        if (!invitation) {
            return { success: false, error: "Invitation not found or unauthorized" };
        }

        // 4. Publish the invitation
        await db.update(invitations)
            .set({
                isPublished: true,
                updatedAt: new Date(),
            })
            .where(eq(invitations.id, invitationId));

        revalidatePath(`/${invitation.slug}`);
        revalidatePath("/dashboard");

        return { success: true, message: "Undangan berhasil dipublish!" };
    } catch (error) {
        console.error("❌ Publish Invitation Error:", error);
        return { success: false, error: "Gagal mempublish undangan" };
    }
}

/**
 * Update the theme of an invitation
 */
export async function updateInvitationTheme(invitationId: number, themeId: number) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { success: false, error: "Authentication required" };
        }

        const userId = Number((session.user as any).id);

        // Verify ownership
        const invitation = await db.query.invitations.findFirst({
            where: and(eq(invitations.id, invitationId), eq(invitations.userId, userId))
        });

        if (!invitation) {
            return { success: false, error: "Invitation not found or unauthorized" };
        }

        await db.update(invitations)
            .set({
                themeId: themeId,
                updatedAt: new Date(),
            })
            .where(eq(invitations.id, invitationId));

        revalidatePath(`/${invitation.slug}`);
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("❌ Update Theme Error:", error);
        return { success: false, error: "Gagal memperbarui tema" };
    }
}
