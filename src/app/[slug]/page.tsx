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
import { InvitationData } from "@/types/invitation";

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

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { to } = await searchParams;
    const result = await getInvitationBySlug(slug);

    if (!result) return { title: "Undangan Tidak Ditemukan - Nikahin" };

    const { data, packageSlug } = result;
    const isDemo = packageSlug === "demo";

    // Use merged data for metadata too!
    const previewData = isDemo ? {
        ...DEMO_DATA,
        ...data,
        groom: { ...DEMO_DATA.groom, ...(data.groom || {}) },
        bride: { ...DEMO_DATA.bride, ...(data.bride || {}) },
    } : data;

    const bride = previewData.bride?.name || "Pengantin Wanita";
    const groom = previewData.groom?.name || "Pengantin Pria";
    const guestName = to ? decodeURIComponent(to) : "";

    // Create personalized title
    const title = guestName
        ? `Undangan Spesial untuk ${guestName} | ${bride} & ${groom}`
        : `The Wedding of ${bride} & ${groom} | Nikahin`;

    const description = `Buka undangan digital pernikahan ${bride} & ${groom}. Merupakan suatu kehormatan bagi kami jika Anda berkenan hadir dan memberikan doa restu.`;

    // Priority: Cover Image -> First Gallery Image -> Default System Image
    const ogImage = previewData.coverImage || (previewData.gallery && previewData.gallery.length > 0 ? previewData.gallery[0] : "/og-image.png");

    // Get system settings for root domain (in production)
    const { getSystemSettings } = await import("@/app/actions/admin");
    const settings = await getSystemSettings() as any;
    const baseUrl = settings?.siteUrl || "https://nikahin.app";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `${baseUrl}/${slug}`,
            siteName: settings?.appName || "Nikahin",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `The Wedding of ${bride} & ${groom}`,
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

    const { data, themeId: dbThemeId, invitationId, guests, packageSlug, features, isOwnerActive } = result;

    const isDemo = packageSlug === "demo";

    // 2.3. DATA PREPARATION
    // We prioritize user data, but for Demo we overlay it on top of beautiful DEMO_DATA
    // so they see a "complete" invitation even if they've only edited a few fields.
    const previewData: any = isDemo ? {
        ...DEMO_DATA,
        ...data,
        // Ensure even if data.groom/bride is partial, we merge it properly
        groom: { ...DEMO_DATA.groom, ...(data.groom || {}) },
        bride: { ...DEMO_DATA.bride, ...(data.bride || {}) },
        // Tease all features for Demo
        features: [
            'love_story', 'gallery_10', 'gallery_unlimited', 'gift_registry',
            'background_music', 'custom_theme', 'rsvp_basic', 'rsvp_export',
            'quotes', 'unlimited_events', 'remove_branding', 'cover_image',
            'video_background', 'live_streaming'
        ]
    } : {
        ...data,
        features: features
    };

    // Allow overriding theme via URL param (e.g. ?theme=custom)
    const themeId = theme || dbThemeId;

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

    // 5. Generate JSON-LD Structured Data for SEO
    const weddingEvent = previewData.events?.[0];
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": `The Wedding of ${previewData.bride?.name || "Bride"} & ${previewData.groom?.name || "Groom"}`,
        "description": `Undangan pernikahan digital ${previewData.bride?.name || "Bride"} dan ${previewData.groom?.name || "Groom"}. Bergabunglah dalam kebahagiaan kami.`,
        "startDate": weddingEvent?.date || previewData.weddingDate,
        "endDate": weddingEvent?.date || previewData.weddingDate,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": weddingEvent?.location ? {
            "@type": "Place",
            "name": weddingEvent.location,
            "address": weddingEvent.address || weddingEvent.location
        } : undefined,
        "image": previewData.coverImage || previewData.gallery?.[0] || "/favicon.png",
        "organizer": {
            "@type": "Person",
            "name": `${previewData.bride?.name || "Bride"} & ${previewData.groom?.name || "Groom"}`
        },
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "price": "0",
            "priceCurrency": "IDR",
            "url": `https://nikahin.app/${slug}`
        }
    };

    // 6. Render the selected theme
    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="relative min-h-screen">
                <ThemeComponent
                    data={previewData}
                    dynamicConfig={result.themeConfig}
                    guestName={guestName}
                    invitationId={invitationId}
                    guests={guests}
                />
                {isDemo && <DemoMarker />}
            </div>
        </>
    );
}
