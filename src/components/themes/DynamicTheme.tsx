"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { canUseFeature } from "@/lib/features";
import { InvitationData, DynamicThemeConfig, SectionBlock } from "@/types/invitation";
import { MASTER_THEME_CONFIG } from "@/components/themes/masterConfig";

// SECTIONS
import { Hero } from "./sections/Hero";
import { QuoteSection } from "./sections/Quote"; // Note: exported as QuoteSection
import { Couple } from "./sections/Couple";
import { EventSection } from "./sections/Event"; // Note: exported as EventSection
import { LoveStory } from "./sections/LoveStory";
import { Gallery } from "./sections/Gallery";
import { GiftSection } from "./sections/Gift"; // Note: exported as GiftSection
import { Rsvp } from "./sections/Rsvp";
import { Closing } from "./sections/Closing";

// UI Helpers
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { MusicToggle } from "@/components/ui/MusicToggle";
// Assuming Confetti is available or I need to import it. BasicTheme had it inline. 
// I should extract ConfettiCelebration to UI if I want it here.
// For now, I'll omit Confetti or extract it quickly. 
// Let's omit Confetti for this step to reduce complexity, or duplicate it inside if critical. 
// It adds nice flair. I'll omit it for the MVP of DynamicTheme.

interface DynamicThemeProps {
    data: InvitationData;
    guestName?: string;
    isPreview?: boolean;
    isMobile?: boolean; // For dashboard preview forcing
    invitationId?: number;
    guests?: any[]; // For Guestbook/RSVP messages if passed down
    dynamicConfig?: DynamicThemeConfig; // Added for passing pre-resolved config
}

export function DynamicTheme({ data, guestName, isPreview = false, isMobile = false, invitationId, guests, dynamicConfig }: DynamicThemeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    // 1. Resolve Configuration (Merge DB Config with Master Defaults)
    // We treat the data.themeConfig from DB as partial, but here we assume it maps to the types properly.
    // If data.themeConfig is missing, we use MASTER. 
    // Ideally, we should parse the JSON column. Drizzle handles jsonb as object.

    // However, data.themeConfig in 'invitation.ts' is currently just `ThemeConfig` (Global Styles).
    // The `themes` table has `config`, but `InvitationData` interface might need updating if we pass the FULL config here.
    // Wait, `InvitationData` has `themeConfig?: ThemeConfig`.
    // The `config` column in DB is the Dynamic structure (sections + global).
    // The current `InvitationData` passed to props usually comes from the transformed API response.
    // I need to ensure `data` includes the `dynamicConfig` or similar.

    // Looking at `invitation.ts`, I only added `themeConfig?: ThemeConfig`.
    // I defined `DynamicThemeConfig` but didn't add it to `InvitationData`?
    // Let's check `invitation.ts`.
    // `themeConfig?: ThemeConfig;` at line 131.
    // I need to add `builderConfig?: DynamicThemeConfig` or structure it better.
    // OR, I assume `themeConfig` IS the `DynamicThemeConfig`?
    // In `invitation.ts`, `DynamicThemeConfig` contains `{ global: ThemeConfig, sections: ... }`.
    // If the DB column `config` stores the whole object, then `InvitationData` should reflect that.

    // Currently `BasicTheme` expects `data.themeConfig` to be `ThemeConfig`.
    // If I change `InvitationData.themeConfig` to be `DynamicThemeConfig`, `BasicTheme` will break.
    // So I should probably add a NEW field to `InvitationData`, e.g., `dynamicConfig`.

    // For this implementation, I will assume `data` has a property `themeConfig` that *might* be the old style,
    // OR a new property `dynamicConfig`. 
    // For now, let's use a local variable merged with MASTER defaults.

    // TODO: In the real app, we need to make sure the controller passes this data.
    // For now, I'll assume we default to MASTER_THEME_CONFIG if input is missing.

    // LIVE PREVIEW STATE
    const [activeConfig, setActiveConfig] = useState<DynamicThemeConfig>(() => {
        if (dynamicConfig) return dynamicConfig;
        return MASTER_THEME_CONFIG;
    });

    // Listen for config updates from Admin Builder (Iframe Parent)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'THEME_UPDATE' && event.data?.config) {
                console.log("[DynamicTheme] Received live update:", event.data.config);
                setActiveConfig(event.data.config);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("message", handleMessage);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("message", handleMessage);
            }
        };
    }, []);

    // Use global styles
    const globalStyles = activeConfig.global;
    const sortedSections = [...activeConfig.sections].sort((a, b) => a.order - b.order);
    const heroSectionConfig = activeConfig.sections.find(s => s.type === 'hero');

    const handleOpen = () => {
        setIsOpen(true);
        setIsMusicPlaying(true);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    };

    const toggleMusic = () => {
        setIsMusicPlaying(!isMusicPlaying);
    };

    // Component Mapper
    const renderSection = (section: SectionBlock) => {
        if (!section.isVisible) return null;

        // Wrapper Style (optional background override)
        const style = section.backgroundColor ? { backgroundColor: section.backgroundColor } : {};

        return (
            <div key={section.id} style={style}>
                {(() => {
                    switch (section.type) {
                        case 'hero':
                            return <Hero data={data} guestName={guestName} variant={section.variant as any} onOpen={() => { }} />;
                        case 'quote':
                            return <QuoteSection quotes={data.quotes} variant={section.variant as any} />;
                        case 'couple':
                            return <Couple groom={data.groom} bride={data.bride} variant={section.variant as any} />;
                        case 'event':
                            return <EventSection events={data.events} variant={section.variant as any} />;
                        case 'love_story':
                            if (!canUseFeature(data, 'love_story')) return null;
                            return <LoveStory stories={data.loveStory} variant={section.variant as any} />;
                        case 'gallery':
                            if (!canUseFeature(data, 'gallery')) return null;
                            return <Gallery gallery={data.gallery} variant={section.variant as any} />;
                        case 'gift':
                            if (!canUseFeature(data, 'gift_registry')) return null;
                            return <GiftSection giftOptions={data.giftOptions} shippingAddress={data.shippingAddress} variant={section.variant as any} />;
                        case 'rsvp':
                            if (!canUseFeature(data, 'rsvp')) return null;
                            return <Rsvp invitationId={invitationId} variant={section.variant as any} />;
                        case 'closing':
                            return <Closing data={data} variant={section.variant as any} />;
                        default:
                            return null;
                    }
                })()}
            </div>
        );
    };

    return (
        <div
            className={`min-h-screen ${isPreview ? "preview-wrapper" : ""} ${isMobile ? "mobile-force" : ""}`}
            style={{
                '--color-primary': globalStyles.primaryColor,
                '--color-secondary': globalStyles.secondaryColor,
                '--color-bg-1': globalStyles.backgroundColor, // Basic mapping
                '--color-bg-2': globalStyles.secondaryColor, // Fallback
                '--color-primary-dark': globalStyles.primaryColor, // Should calculate darker shade
                '--color-primary-light': globalStyles.secondaryColor, // Should calculate lighter shade
                // BasicTheme uses hex + opacity logic, we might need a utility for that.
                // keeping it simple for now. 
            } as React.CSSProperties}
        >
            {/* Dynamic Fonts Injection */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=${globalStyles.fontHeading.replace(/ /g, '+')}:wght@400;700&family=${globalStyles.fontBody.replace(/ /g, '+')}:wght@300;400;600&display=swap');
                
                :root {
                    --font-heading: '${globalStyles.fontHeading}', serif;
                    --font-body: '${globalStyles.fontBody}', sans-serif;
                }
                
                h1, h2, h3, .font-serif, .font-heading { font-family: var(--font-heading) !important; }
                body, p, .font-sans { font-family: var(--font-body) !important; }
            `}} />

            {/* Content Logic */}
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    // COVER MODE
                    // We use the configured Hero variant as the cover
                    <motion.div key="cover" exit={{ opacity: 0, y: -100 }} transition={{ duration: 0.8 }}>
                        <Hero
                            data={data}
                            guestName={guestName}
                            // @ts-ignore
                            variant={heroSectionConfig?.variant || 'fullscreen_center'}
                            onOpen={handleOpen}
                        />
                    </motion.div>
                ) : (
                    // OPEN MODE
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="content-flow"
                    >
                        {sortedSections.map(section => {
                            // If we don't want Hero to appear again in content, skip it here
                            // OR render it as a header without the Open button.
                            // BasicTheme skips it. Let's skip it if order is 0?
                            // Better: Users might want it. But typically Hero is the Cover.
                            // I will skip 'hero' type in the content flow for now to match BasicTheme feel.
                            if (section.type === 'hero') return null;
                            return renderSection(section);
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Controls */}
            {isOpen && (
                <>
                    {canUseFeature(data, 'background_music') && <MusicToggle isPlaying={isMusicPlaying} onToggle={toggleMusic} />}
                    {/* Bottom Nav usually requires active section tracking, implemented in BasicTheme via scroll listener. 
                        Omitting for brevity in this iteration, but can be added. 
                    */}
                </>
            )}
        </div>
    );
}
