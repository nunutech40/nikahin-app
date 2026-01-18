import { db } from "@/db";
import { invitations, guests, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { InvitationData } from "@/types/invitation";

/**
 * Fetch invitation data by slug including theme information and guests
 */
export async function getInvitationBySlug(slug: string) {
    try {
        const result = await db.query.invitations.findFirst({
            where: eq(invitations.slug, slug),
            with: {
                theme: true,
                package: {
                    with: {
                        features: {
                            with: {
                                feature: true,
                            },
                        },
                    },
                },
                guests: {
                    orderBy: [desc(guests.createdAt)],
                    limit: 50,
                }
            },
        });

        if (!result) return null;

        return {
            invitationId: result.id,
            themeId: result.theme?.slug || "basic",
            themeConfig: result.theme?.config as any,
            packageSlug: result.package?.slug || "bronze",
            data: result.content as InvitationData,
            features: result.package.features.map(pf => pf.feature.code),
            guests: result.guests,
        };
    } catch (error) {
        console.error("❌ Error fetching invitation:", error);
        return null;
    }
}
/**
 * Fetch all invitations belonging to a specific user
 */
export async function getUserInvitations(userId: number) {
    try {
        return await db.query.invitations.findMany({
            where: eq(invitations.userId, userId),
            orderBy: [desc(invitations.createdAt)],
            with: {
                theme: true,
            }
        });
    } catch (error) {
        console.error("❌ Error fetching user invitations:", error);
        return [];
    }
}

/**
 * Fetch a specific invitation for editing, with ownership check
 */
export async function getInvitationForEdit(invitationId: number, userId: number) {
    try {
        const result = await db.query.invitations.findFirst({
            where: and(
                eq(invitations.id, invitationId),
                eq(invitations.userId, userId)
            ),
            with: {
                theme: true,
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

        if (!result) return null;

        return {
            invitationId: result.id,
            themeId: result.theme?.slug || "basic",
            data: result.content as InvitationData,
            features: result.package.features.map(pf => pf.feature.code),
        };
    } catch (error) {
        console.error("❌ Error fetching invitation for edit:", error);
        return null;
    }
}
