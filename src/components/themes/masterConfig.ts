import { DynamicThemeConfig } from "@/types/invitation";

/**
 * DEFAULT MASTER CONFIGURATION
 * 
 * This is the fallback configuration for new themes or when a theme
 * has no specific config defined. It includes all available sections
 * in a logical order with standard variants.
 */
export const MASTER_THEME_CONFIG: DynamicThemeConfig = {
    global: {
        primaryColor: "#D4AF37", // Gold
        secondaryColor: "#F3E5AB", // Light Gold / Cream
        backgroundColor: "#FFFFFF",
        fontHeading: "Playfair Display",
        fontBody: "Inter",
        backgroundImage: undefined,
    },
    sections: [
        {
            id: "hero_section",
            type: "hero",
            variant: "fullscreen_center",
            order: 0,
            isVisible: true,
        },
        {
            id: "quote_section",
            type: "quote",
            variant: "centered_simple",
            order: 1,
            isVisible: true,
            backgroundColor: "#FAFAFA",
        },
        {
            id: "couple_section",
            type: "couple",
            variant: "card_grid",
            order: 2,
            isVisible: true,
        },
        {
            id: "event_section",
            type: "event",
            variant: "vertical_list",
            order: 3,
            isVisible: true,
        },
        {
            id: "love_story_section",
            type: "love_story",
            variant: "zig_zag",
            order: 4,
            isVisible: true,
        },
        {
            id: "gallery_section",
            type: "gallery",
            variant: "masonry_grid",
            order: 5,
            isVisible: true,
        },
        {
            id: "gift_section",
            type: "gift",
            variant: "card_grid", // Assuming generic card grid, specific variant might need update if defined differently
            order: 6,
            isVisible: true,
            backgroundColor: "#FAFAFA",
        },
        {
            id: "rsvp_section",
            type: "rsvp",
            variant: "standard_form", // Default fallback if specific variant not strict in interface yet (Wait, checking interface...)
            order: 7,
            isVisible: true,
        },
        {
            id: "closing_section",
            type: "closing",
            variant: "simple_centered",
            order: 8,
            isVisible: true,
        },
    ],
};
