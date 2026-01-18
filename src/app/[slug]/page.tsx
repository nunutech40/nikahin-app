import React from "react";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/queries";
import { getThemeComponent } from "@/lib/themeRegistry";
import { BasicTheme } from "@/components/themes/BasicTheme";
import { trackVisit } from "@/lib/analytics";
import DemoMarker from "@/components/DemoMarker";
import { DEMO_DATA } from "@/data/demoData";
import {
    canEditGiftRegistry,
    canEditThemeConfig,
    canEditLoveStory,
    canEditGallery,
    canEditQuotes,
    canEditMusic,
    canChangeCover
} from "@/lib/demoRestrictions";

export const dynamic = "force-dynamic";

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
        theme?: string;
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
    const { to, theme } = await searchParams; // Updated to extract 'theme'

    const guestName = to ? decodeURIComponent(to) : undefined;

    // 1. Fetch data from database
    const result = await getInvitationBySlug(slug);

    // 2. Handle not found
    if (!result) {
        return notFound();
    }

    const { data, themeId: dbThemeId, invitationId, guests, packageSlug, features } = result;

    // Allow overriding theme via URL param (e.g. ?theme=custom)
    const themeId = theme || dbThemeId;

    // 2.5. Track Analytics (Internal)
    trackVisit(invitationId);

    const isDemo = packageSlug === "demo";

    // 2.6. PREPARE DATA FOR PREVIEW
    // For Demo: Merge with DEMO_DATA and Force Platinum Features
    // For Others: Use user data but ensure 'features' list is up-to-date from package
    const previewData = isDemo ? {
        ...DEMO_DATA,
        ...data,
        // For features that are LOCKED in demo, we force the beautiful DEMO_DATA
        // For features that are OPEN in demo, we use the user's edits (data)
        giftOptions: canEditGiftRegistry(packageSlug) ? data.giftOptions : DEMO_DATA.giftOptions,
        themeConfig: canEditThemeConfig(packageSlug) ? data.themeConfig : DEMO_DATA.themeConfig,

        // Ensure sections take priority
        loveStory: canEditLoveStory(packageSlug) ? (data.loveStory || DEMO_DATA.loveStory) : DEMO_DATA.loveStory,
        gallery: canEditGallery(packageSlug) ? (data.gallery || DEMO_DATA.gallery) : DEMO_DATA.gallery,
        quotes: canEditQuotes(packageSlug) ? (data.quotes || DEMO_DATA.quotes) : DEMO_DATA.quotes,
        musicUrl: canEditMusic(packageSlug) ? (data.musicUrl || DEMO_DATA.musicUrl) : DEMO_DATA.musicUrl,
        coverImage: canChangeCover(packageSlug) ? (data.coverImage || DEMO_DATA.coverImage) : DEMO_DATA.coverImage,

        features: [
            'love_story', 'gallery_10', 'gallery_unlimited', 'gift_registry',
            'background_music', 'custom_theme', 'rsvp_basic', 'rsvp_export',
            'quotes', 'unlimited_events', 'remove_branding', 'cover_image',
            'video_background', 'live_streaming'
        ]
    } : {
        ...data,
        features: features // Ensure authoritative features from DB are used
    };

    // 3. Dynamic theme loading via registry
    const ThemeComponent = getThemeComponent(themeId);

    // 4. Fallback to BasicTheme if theme not found
    if (!ThemeComponent) {
        console.warn(
            `Theme "${themeId}" not found in registry. Falling back to BasicTheme.`
        );
        return (
            <div className="relative min-h-screen">
                <BasicTheme
                    data={previewData}
                    guestName={guestName}
                    invitationId={invitationId}
                    guests={guests}
                />
                {isDemo && <DemoMarker />}
            </div>
        );
    }

    // 5. Render the selected theme
    return (
        <div className="relative min-h-screen">
            <ThemeComponent
                data={previewData}
                guestName={guestName}
                invitationId={invitationId}
                guests={guests}
            />
            {isDemo && <DemoMarker />}
        </div>
    );
}
