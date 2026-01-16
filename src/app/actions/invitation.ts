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

        if (!allowedFeatures.includes('gallery')) {
            sanitizedContent.gallery = [];
        }

        if (!allowedFeatures.includes('love-story')) {
            sanitizedContent.loveStory = [];
        }

        if (!allowedFeatures.includes('background-music')) {
            sanitizedContent.musicUrl = "";
        }

        if (!allowedFeatures.includes('gift-registry')) {
            sanitizedContent.giftOptions = [];
            sanitizedContent.shippingAddress = null;
        }

        if (!allowedFeatures.includes('custom-theme')) {
            // Reset to default/null so renderer uses default theme values
            if (sanitizedContent.themeConfig) {
                delete sanitizedContent.themeConfig;
            }
        }

        if (!allowedFeatures.includes('multi-event') && sanitizedContent.events && sanitizedContent.events.length > 1) {
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
            isPublished: true,
        }).returning();

        return { success: true, data: result[0] };
    } catch (error) {
        console.error("❌ Create Invitation Error:", error);
        return { success: false, error: "Gagal membuat undangan" };
    }
}
