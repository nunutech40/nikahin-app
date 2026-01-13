"use client";

import { useEffect, useState } from "react";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { MOCK_DATA } from "@/data/mockData";

/**
 * Dynamic Invitation Page
 * 
 * This page acts as a controller that:
 * 1. Fetches invitation data based on slug
 * 2. Determines which theme to use
 * 3. Renders the theme component with data
 * 
 * Future: Will fetch from database instead of using MOCK_DATA
 */

interface PageProps {
    params: {
        slug: string;
    };
}

export default function InvitationPage({ params }: PageProps) {
    const [guestName, setGuestName] = useState<string | undefined>();

    // Extract guest name from URL parameter
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const name = urlParams.get("to");
            if (name) {
                setGuestName(decodeURIComponent(name));
            }
        }
    }, []);

    // TODO: Fetch invitation data from database based on params.slug
    // const invitationData = await getInvitationBySlug(params.slug);

    // TODO: Determine theme based on invitation data
    // const ThemeComponent = getThemeComponent(invitationData.themeId);

    // For now, use MOCK_DATA and BasicTheme
    const invitationData = MOCK_DATA;

    return (
        <BasicTheme
            data={invitationData}
            guestName={guestName}
        />
    );
}
