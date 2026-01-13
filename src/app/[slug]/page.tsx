"use client";

import { useEffect, useState } from "react";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { MOCK_DATA } from "@/data/mockData";
import type { InvitationData } from "@/types/invitation";

/**
 * ============================================
 * INVITATION PAGE CONTROLLER
 * ============================================
 * 
 * This page acts as a thin controller layer that:
 * 1. Fetches invitation data based on slug
 * 2. Extracts guest name from URL query params
 * 3. Determines which theme component to render
 * 4. Passes data to theme component
 * 
 * Architecture:
 * - Page.tsx = Controller (data fetching & routing)
 * - Theme Component = View (presentation only)
 * - Data = Separated in /src/data or database
 * 
 * @future Database Integration (Iterasi 4)
 * - Replace MOCK_DATA with database query
 * - Implement getInvitationBySlug(slug)
 * - Add error handling for not found
 * 
 * @future Theme Registry (Phase 2.3)
 * - Implement dynamic theme loading
 * - Use getThemeComponent(themeId)
 */

interface PageProps {
    params: {
        slug: string;
    };
}

/**
 * Helper: Extract guest name from URL query parameter
 */
function useGuestName(): string | undefined {
    const [guestName, setGuestName] = useState<string | undefined>();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const name = urlParams.get("to");
            if (name) {
                setGuestName(decodeURIComponent(name));
            }
        }
    }, []);

    return guestName;
}

/**
 * Helper: Fetch invitation data based on slug
 * @future Replace with actual database query
 */
function getInvitationData(slug: string): InvitationData {
    // TODO (Iterasi 4): Fetch from database
    // const data = await db.query.invitations.findFirst({
    //     where: eq(invitations.slug, slug)
    // });
    // if (!data) notFound();
    // return data;

    // For now, return mock data
    return MOCK_DATA;
}

/**
 * Main Page Component
 */
export default function InvitationPage({ params }: PageProps) {
    const guestName = useGuestName();
    const invitationData = getInvitationData(params.slug);

    // TODO (Phase 2.3): Dynamic theme loading
    // const ThemeComponent = getThemeComponent(invitationData.themeId);
    // return <ThemeComponent data={invitationData} guestName={guestName} />;

    // For now, use BasicTheme
    return <BasicTheme data={invitationData} guestName={guestName} />;
}
