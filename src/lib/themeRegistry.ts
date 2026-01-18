import { ComponentType } from "react";
import { InvitationData } from "@/types/invitation";

/**
 * ============================================
 * THEME REGISTRY
 * ============================================
 * 
 * Central registry for all available wedding invitation themes.
 * This enables dynamic theme loading based on database configuration.
 * 
 * Architecture:
 * - Each theme is a React component that accepts InvitationData
 * - Themes are registered with metadata (name, description, pricing)
 * - Controller uses getThemeComponent() to load the correct theme
 * 
 * Usage:
 * ```typescript
 * const ThemeComponent = getThemeComponent('basic');
 * return <ThemeComponent data={invitationData} guestName={guestName} />;
 * ```
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Props that all theme components must accept
 */
export interface ThemeProps {
    data: InvitationData;
    guestName?: string;
    invitationId?: number;
    guests?: any[];
    isPreview?: boolean;
    isMobile?: boolean;
    /** For builder-based themes: the layout configuration */
    dynamicConfig?: any;
}

/**
 * Metadata for each theme
 */
export interface ThemeMetadata {
    /** Unique identifier for the theme */
    id: string;
    /** Display name shown to users */
    name: string;
    /** Short description of the theme */
    description: string;
    /** Whether this theme is free or requires payment */
    isFree: boolean;
    /** Preview image URL for theme selection */
    previewImage?: string;
    /** Theme category (e.g., 'modern', 'classic', 'elegant') */
    category?: string;
    /** Whether this theme can be edited via the dynamic builder */
    isDynamic?: boolean;
    /** Access Tier: 'free', 'gold', 'platinum' */
    tier: 'free' | 'gold' | 'platinum';
    /** Whether the theme is visible and can be used */
    isActive: boolean;
}

/**
 * Complete theme registration entry
 */
export interface ThemeRegistration {
    metadata: ThemeMetadata;
    component: ComponentType<ThemeProps>;
}

// ============================================
// THEME IMPORTS
// ============================================

import { BasicTheme } from "@/components/themes/BasicTheme";
import { DynamicTheme } from "@/components/themes/DynamicTheme";

// Future themes will be imported here:
// import { ElegantTheme } from "@/components/themes/ElegantTheme";
// import { ModernTheme } from "@/components/themes/ModernTheme";
// import { ClassicTheme } from "@/components/themes/ClassicTheme";

// ============================================
// THEME REGISTRY MAP
// ============================================

/**
 * Registry of all available themes
 * Key: theme ID (used in database)
 * Value: Theme registration (metadata + component)
 */
const THEME_REGISTRY: Record<string, ThemeRegistration> = {
    basic: {
        metadata: {
            id: "basic",
            name: "Basic Theme",
            description:
                "Undangan pernikahan dengan desain modern dan elegan. Cocok untuk berbagai jenis acara pernikahan.",
            isFree: true,
            tier: "free",
            isActive: true,
            category: "modern",
            previewImage: "/images/themes/basic-preview.png",
        },
        component: BasicTheme,
    },
    standard: {
        metadata: {
            id: "standard",
            name: "Standard Elegant",
            description: "Desain klasik rizka-ayu yang elegan dan bersih. Pilihan terbaik untuk pernikahan formal.",
            isFree: true,
            tier: "free",
            isActive: true,
            category: "elegant",
            previewImage: "/images/themes/basic-preview.png",
        },
        component: DynamicTheme,
    },
    custom: {
        metadata: {
            id: "custom",
            name: "Custom Theme (Builder)",
            description: "Tema dinamis yang dibuat dengan No-Code Builder",
            isFree: false,
            tier: "gold",
            isActive: true,
            category: "dynamic",
            previewImage: "/images/themes/custom-preview.png",
        },
        component: DynamicTheme,
    },

    // Future themes can be added here:
    // elegant: {
    //     metadata: {
    //         id: "elegant",
    //         name: "Elegant Theme",
    //         description: "Desain mewah dengan animasi premium dan efek glassmorphism",
    //         isFree: false,
    //         category: "elegant",
    //         previewImage: "/images/themes/elegant-preview.png",
    //     },
    //     component: ElegantTheme,
    // },
};

// ============================================
// PUBLIC API
// ============================================

/**
 * Get theme component by theme ID
 * 
 * @param themeId - Unique theme identifier
 * @returns Theme component or null if not found
 * 
 * @example
 * ```typescript
 * const ThemeComponent = getThemeComponent('basic');
 * if (ThemeComponent) {
 *     return <ThemeComponent data={data} guestName={name} />;
 * }
 * ```
 */
export function getThemeComponent(
    themeId: string
): ComponentType<ThemeProps> | null {
    const registration = THEME_REGISTRY[themeId];
    if (registration) return registration.component;

    // Fallback for Dynamic Themes (Builder-based)
    // If it's not in our hardcoded registry, we treat it as a dynamic theme
    return DynamicTheme as any;
}

/**
 * Get theme metadata by theme ID
 * 
 * @param themeId - Unique theme identifier
 * @returns Theme metadata or null if not found
 */
export function getThemeMetadata(themeId: string): ThemeMetadata | null {
    const registration = THEME_REGISTRY[themeId];
    return registration ? registration.metadata : null;
}

/**
 * Get all available themes
 * 
 * @returns Array of all theme registrations
 * 
 * @example
 * ```typescript
 * const themes = getAllThemes();
 * // Use in theme selector UI
 * themes.map(theme => (
 *     <ThemeCard key={theme.metadata.id} theme={theme.metadata} />
 * ))
 * ```
 */
export function getAllThemes(): ThemeRegistration[] {
    return Object.values(THEME_REGISTRY);
}

/**
 * Get only free themes
 * 
 * @returns Array of free theme registrations
 */
export function getFreeThemes(): ThemeRegistration[] {
    return getAllThemes().filter((theme) => theme.metadata.isFree);
}

/**
 * Get only premium (paid) themes
 * 
 * @returns Array of premium theme registrations
 */
export function getPremiumThemes(): ThemeRegistration[] {
    return getAllThemes().filter((theme) => !theme.metadata.isFree);
}

/**
 * Get themes by category
 * 
 * @param category - Theme category to filter by
 * @returns Array of theme registrations in the specified category
 */
export function getThemesByCategory(category: string): ThemeRegistration[] {
    return getAllThemes().filter(
        (theme) => theme.metadata.category === category
    );
}

/**
 * Check if a theme exists
 * 
 * @param themeId - Theme ID to check
 * @returns True if theme exists, false otherwise
 */
export function themeExists(themeId: string): boolean {
    return themeId in THEME_REGISTRY;
}

/**
 * Get default theme ID
 * Used as fallback when user hasn't selected a theme
 * 
 * @returns Default theme ID
 */
export function getDefaultThemeId(): string {
    return "basic";
}

// ============================================
// CONSTANTS
// ============================================

/**
 * List of all available theme IDs
 */
export const AVAILABLE_THEME_IDS = Object.keys(THEME_REGISTRY);

/**
 * Total number of registered themes
 */
export const TOTAL_THEMES = AVAILABLE_THEME_IDS.length;
