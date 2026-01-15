import { db } from "@/db";
import { invitations, guests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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
            data: result.content as InvitationData,
            features: result.package.features.map(pf => pf.feature.code),
            guests: result.guests,
        };
    } catch (error) {
        console.error("❌ Error fetching invitation:", error);
        return null;
    }
}
