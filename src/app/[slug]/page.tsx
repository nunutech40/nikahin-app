import React from "react";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/queries";
import { getThemeComponent } from "@/lib/themeRegistry";
import { BasicTheme } from "@/components/themes/BasicTheme";

/**
 * ============================================
 * INVITATION PAGE CONTROLLER (Server Component)
 * ============================================
 */

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        to?: string;
    }>;
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
    // Unwrap promises
    const { slug } = await params;
    const { to } = await searchParams;

    const guestName = to ? decodeURIComponent(to) : undefined;

    // 1. Fetch data from database
    const result = await getInvitationBySlug(slug);

    // 2. Handle not found
    if (!result) {
        return notFound();
    }

    const { data, themeId, invitationId, guests } = result;

    // 3. Dynamic theme loading via registry
    const ThemeComponent = getThemeComponent(themeId);

    // 4. Fallback to BasicTheme if theme not found
    if (!ThemeComponent) {
        console.warn(
            `Theme "${themeId}" not found in registry. Falling back to BasicTheme.`
        );
        return (
            <BasicTheme
                data={data}
                guestName={guestName}
                invitationId={invitationId}
                guests={guests}
            />
        );
    }

    // 5. Render the selected theme
    return (
        <ThemeComponent
            data={data}
            guestName={guestName}
            invitationId={invitationId}
            guests={guests}
        />
    );
}
