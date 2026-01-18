import { DynamicThemeConfig } from "@/types/invitation";

/**
 * STANDARD THEME PRESET (Rizka-Ayu Style)
 * 
 * This represents the "Standard" elegant layout which was previously
 * hardcoded as BasicTheme. Now it's a dynamic configuration.
 */
export const STANDARD_THEME_CONFIG: DynamicThemeConfig = {
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
            id: "hero_preset",
            type: "hero",
            variant: "fullscreen_center",
            order: 0,
            isVisible: true,
        },
        {
            id: "quote_preset",
            type: "quote",
            variant: "centered_simple",
            order: 1,
            isVisible: true,
            backgroundColor: "#FAFAFA",
        },
        {
            id: "couple_preset",
            type: "couple",
            variant: "card_grid",
            order: 2,
            isVisible: true,
        },
        {
            id: "event_preset",
            type: "event",
            variant: "vertical_list",
            order: 3,
            isVisible: true,
        },
        {
            id: "love_story_preset",
            type: "love_story",
            variant: "zig_zag",
            order: 4,
            isVisible: true,
        },
        {
            id: "gallery_preset",
            type: "gallery",
            variant: "masonry_grid",
            order: 5,
            isVisible: true,
        },
        {
            id: "gift_preset",
            type: "gift",
            variant: "card_grid",
            order: 6,
            isVisible: true,
            backgroundColor: "#FAFAFA",
        },
        {
            id: "rsvp_preset",
            type: "rsvp",
            variant: "standard_form",
            order: 7,
            isVisible: true,
        },
        {
            id: "closing_preset",
            type: "closing",
            variant: "simple_centered",
            order: 8,
            isVisible: true,
        },
    ],
};

/**
 * MODERN DARK PRESET
 */
export const MODERN_DARK_CONFIG: DynamicThemeConfig = {
    global: {
        primaryColor: "#E2B808", // Bright Gold
        secondaryColor: "#1A1A1A", // Dark Gray
        backgroundColor: "#0F172A", // Slate 900
        fontHeading: "Cinzel",
        fontBody: "Montserrat",
        backgroundImage: undefined,
    },
    sections: [
        { id: "hero", type: "hero", variant: "minimal_split", order: 0, isVisible: true },
        { id: "couple", type: "couple", variant: "rounded_split", order: 1, isVisible: true },
        { id: "event", type: "event", variant: "vertical_list", order: 2, isVisible: true },
        { id: "gallery", type: "gallery", variant: "carousel_slider", order: 3, isVisible: true },
        { id: "rsvp", type: "rsvp", variant: "modal_popup", order: 4, isVisible: true },
        { id: "closing", type: "closing", variant: "full_image", order: 5, isVisible: true },
    ],
};
