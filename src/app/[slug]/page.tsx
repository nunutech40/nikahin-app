"use client";

import React, { useEffect, useState } from "react";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { MOCK_DATA } from "@/data/mockData";
import type { InvitationData } from "@/types/invitation";
import {
    getThemeComponent,
    getDefaultThemeId,
} from "@/lib/themeRegistry";

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
 * - Theme Registry = Dynamic theme loading system
 * 
 * @future Database Integration (Iterasi 4)
 * - Replace MOCK_DATA with database query
 * - Implement getInvitationBySlug(slug)
 * - Add error handling for not found
 */

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
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
 * Helper: Get theme ID for this invitation
 * @future Fetch from database invitation.themeId
 */
function getInvitationThemeId(invitationData: InvitationData): string {
    // TODO (Iterasi 4): Get from database
    // return invitationData.themeId;

    // For now, use default theme
    return getDefaultThemeId();
}

/**
 * Main Page Component
 */
export default function InvitationPage({ params }: PageProps) {
    // Unwrap params Promise (Next.js 15 requirement)
    const { slug } = React.use(params);

    const guestName = useGuestName();
    const invitationData = getInvitationData(slug);
    const themeId = getInvitationThemeId(invitationData);

    // Dynamic theme loading via registry
    const ThemeComponent = getThemeComponent(themeId);

    // Fallback to BasicTheme if theme not found
    if (!ThemeComponent) {
        console.warn(
            `Theme "${themeId}" not found in registry. Falling back to BasicTheme.`
        );
        return <BasicTheme data={invitationData} guestName={guestName} />;
    }

    // Render the selected theme
    return <ThemeComponent data={invitationData} guestName={guestName} />;
}
