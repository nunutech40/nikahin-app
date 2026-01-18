"use server";

import { db } from "@/db";
import { themes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DynamicThemeConfig } from "@/types/invitation";
import { revalidatePath } from "next/cache";

export async function saveThemeConfig(
    slug: string,
    config: DynamicThemeConfig,
    metadata?: { name: string; description?: string; category?: string; isFree?: boolean }
) {
    try {
        // 1. Check if theme exists
        const existingTheme = await db.query.themes.findFirst({
            where: eq(themes.slug, slug),
        });

        const dataToSave = {
            config: config,
            updatedAt: new Date(),
            ...(metadata?.name && { name: metadata.name }),
            ...(metadata?.description && { description: metadata.description }),
            ...(metadata?.category && { category: metadata.category }),
            ...(metadata?.isFree !== undefined && { isFree: metadata.isFree }),
        };

        if (existingTheme) {
            // Update existing
            await db.update(themes)
                .set(dataToSave)
                .where(eq(themes.slug, slug));
        } else {
            // Create new theme
            await db.insert(themes).values({
                slug: slug,
                name: metadata?.name || slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: metadata?.description || "Tema dinamis yang dibuat dengan No-Code Builder",
                config: config,
                category: metadata?.category || "dynamic",
                isFree: metadata?.isFree || false
            });
        }

        revalidatePath("/admin/themes");
        revalidatePath(`/admin/themes/builder/${slug}`);

        return { success: true };
    } catch (error) {
        console.error("Failed to save theme config:", error);
        return { success: false, error: "Failed to save configuration" };
    }
}

export async function getThemeConfig(slug: string) {
    try {
        const theme = await db.query.themes.findFirst({
            where: eq(themes.slug, slug),
        });

        if (!theme) {
            return { success: false, error: "Theme not found" };
        }

        return {
            success: true,
            config: theme.config as DynamicThemeConfig,
            metadata: {
                name: theme.name || "",
                description: theme.description || "",
                category: theme.category || "dynamic",
                isFree: theme.isFree || false
            }
        };
    } catch (error) {
        console.error("Failed to fetch theme config:", error);
        return { success: false, error: "Failed to fetch configuration" };
    }
}

export async function listThemes() {
    try {
        const allThemes = await db.query.themes.findMany({
            orderBy: (themes, { desc }) => [desc(themes.updatedAt)]
        });
        return { success: true, themes: allThemes };
    } catch (error) {
        console.error("Failed to fetch themes:", error);
        return { success: false, error: "Failed to fetch themes" };
    }
}
