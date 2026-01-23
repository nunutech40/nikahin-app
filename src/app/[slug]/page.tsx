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

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { to } = await searchParams;
    const result = await getInvitationBySlug(slug);

    if (!result) return { title: "Undangan Tidak Ditemukan - Nikahin" };

    const { data } = result;
    const bride = data.bride?.name || "Pengantin Wanita";
    const groom = data.groom?.name || "Pengantin Pria";
    const guestName = to ? decodeURIComponent(to) : "";

    // Create personalized title
    const title = guestName
        ? `Undangan Spesial untuk ${guestName} | ${bride} & ${groom}`
        : `The Wedding of ${bride} & ${groom} | Nikahin`;

    const description = `Buka undangan digital pernikahan ${bride} & ${groom}. Merupakan suatu kehormatan bagi kami jika Anda berkenan hadir dan memberikan doa restu.`;

    // Priority: Cover Image -> First Gallery Image -> Default System Image
    const ogImage = data.coverImage || (data.gallery && data.gallery.length > 0 ? data.gallery[0] : "/og-image.png");

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

    // 2.3. PROTECTION: Redirection for Unpaid accounts (Normal accounts only, Demo is always open)
    const isDemo = packageSlug === "demo";
    if (!isOwnerActive && !isDemo) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-amber-50 rounded-[32px] flex items-center justify-center mx-auto border border-amber-100 shadow-xl shadow-amber-900/5">
                        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-black text-slate-900 mb-4 tracking-tight italic">Eksklusivitas Sedang Disiapkan</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Undangan digital ini sedang dalam tahap finalisasi atau menunggu aktivasi pembayaran oleh pemiliknya.
                        </p>
                    </div>
                    <div className="pt-8 border-t border-slate-100">
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#B48C5E]">Powering by Nikahin Collective</p>
                    </div>
                </div>
            </div>
        );
    }

    // Allow overriding theme via URL param (e.g. ?theme=custom)
    const themeId = theme || dbThemeId;

    // 2.5. Track Analytics (Internal)
    trackVisit(invitationId);

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
