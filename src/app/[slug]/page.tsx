import React from "react";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/queries";
import { getThemeComponent } from "@/lib/themeRegistry";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { trackVisit } from "@/lib/analytics";

/**
 * ============================================
 * INVITATION PAGE CONTROLLER (Server Component)
 * ============================================
 */

import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        to?: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const result = await getInvitationBySlug(slug);

    if (!result) return { title: "Undangan Tidak Ditemukan" };

    const { data } = result;
    const bride = data.bride?.name || "Pengantin Wanita";
    const groom = data.groom?.name || "Pengantin Pria";
    const title = `The Wedding of ${bride} & ${groom} | Nikahin`;
    const description = `Buka undangan digital pernikahan ${bride} & ${groom}. Bergabunglah dalam kebahagiaan kami.`;

    // Priority: Cover Image -> First Gallery Image -> Default System Image
    const ogImage = data.coverImage || (data.gallery && data.gallery.length > 0 ? data.gallery[0] : "/favicon.png");

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://nikahin.app/${slug}`, // Gantilah dengan domain asli nanti
            siteName: "Nikahin",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
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

    // 2.5. Track Analytics (Internal)
    trackVisit(invitationId);

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
