/**
 * ============================================
 * TYPE DEFINITIONS FOR WEDDING INVITATION
 * ============================================
 * 
 * These types define the data structure for wedding invitations.
 * All theme components must accept InvitationData as props.
 * 
 * @module types/invitation
 */

/**
 * Person information (Groom or Bride)
 */
export interface Person {
    /** Display name (e.g., "Robert Downey") */
    name: string;
    /** Full name with title (e.g., "Robert Downey Junior") */
    fullName: string;
    /** Parent names (e.g., "Bapak Ahmad & Ibu Siti") */
    parentName: string;
    /** Path to portrait photo */
    photo: string;
}

/**
 * Wedding event details (Akad Nikah, Resepsi, etc.)
 */
export interface Event {
    /** Event name (e.g., "Akad Nikah", "Resepsi") */
    name: string;
    /** Date in readable format (e.g., "Sabtu, 15 Februari 2025") */
    date: string;
    /** Time range (e.g., "08:00 - 10:00 WIB") */
    time: string;
    /** Venue name (e.g., "Masjid Al-Ikhlas") */
    location: string;
    /** Full address */
    address: string;
    /** Google Maps link */
    mapsLink: string;
}

/**
 * Love story timeline item
 */
export interface LoveStoryItem {
    /** Timeline title (e.g., "Pertemuan Pertama") */
    title: string;
    /** Date or period (e.g., "Januari 2020") */
    date: string;
    /** Story description */
    story: string;
    /** Emoji or icon */
    icon: string;
}

/**
 * Religious quote or verse
 */
export interface Quotes {
    /** Quote text or verse */
    verse: string;
    /** Source reference (e.g., "QS. Ar-Rum: 21") */
    source: string;
}

/**
 * Bank account for gifts (legacy format)
 * @deprecated Use giftOptions instead
 */
export interface BankAccount {
    /** Bank name */
    bank: string;
    /** Account number */
    accountNumber: string;
    /** Account holder name */
    accountName: string;
}

/**
 * Complete invitation data structure
 * This is the main interface that all theme components receive as props
 */
export interface InvitationData {
    /** URL-friendly slug (e.g., "rizka-ayu") */
    slug: string;
    /** Wedding date in ISO format for countdown (e.g., "2025-02-15T08:00:00") */
    weddingDate: string;
    /** Groom information */
    groom: Person;
    /** Bride information */
    bride: Person;
    /** List of wedding events (Akad, Resepsi, etc.) */
    events: Event[];
    /** Love story timeline */
    loveStory: LoveStoryItem[];
    /** Gallery image paths */
    gallery: string[];
    /** Religious quote */
    quotes: Quotes;
    /** Bank accounts for gifts (legacy) */
    bankAccounts?: BankAccount[];
    /** Background music URL */
    musicUrl: string;
    /** Gift options with detailed info */
    giftOptions: Array<{
        /** Bank name (e.g., "Bank Central Asia (BCA)") */
        bankName: string;
        /** Account number */
        accountNumber: string;
        /** Account holder name */
        accountHolder: string;
        /** Bank logo (emoji or image path) */
        logo: string;
    }>;
    /** Physical gift shipping address */
    shippingAddress: {
        /** Recipient name */
        recipient: string;
        /** Full shipping address */
        address: string;
    };
    /** Cover Image URL (Optional) */
    coverImage?: string;
    /** Video Background URL (Optional - Platinum) */
    videoBackgroundUrl?: string;
    /** Live Streaming URL (Optional - Platinum) */
    liveStreamingUrl?: string;
    /** Theme Configuration */
    themeConfig?: ThemeConfig;
    /** Package ID (linked to Feature Gating) */
    packageId?: string;
    /** List of explicitly enabled feature codes for this invitation */
    features?: string[];
}

/**
 * Feature Gating Module
 */
export type FeatureCode =
    | 'love_story'
    | 'gallery_10'
    | 'gallery_unlimited'
    | 'gift_registry'
    | 'background_music'
    | 'custom_theme'
    | 'rsvp_basic'
    | 'rsvp_export'
    | 'quotes'
    | 'unlimited_events'
    | 'remove_branding'
    | 'custom_domain'
    | 'video_background'
    | 'live_streaming'
    | 'guest_filter'
    | 'whatsapp_blast'
    | 'priority_support'
    | 'cover_image';

/**
 * Theme Customization Configuration
 */
export interface ThemeConfig {
    /** Primary color hex code */
    primaryColor: string;
    /** Secondary color hex code */
    secondaryColor: string;
    /** Background color hex code */
    backgroundColor: string;
    /** Optional background image URL */
    backgroundImage?: string;
    /** Font family for headings */
    fontHeading: string;
    /** Font family for body text */
    fontBody: string;
}

/**
 * ======================================
 * DYNAMIC THEME BUILDER TYPES (Iterasi 9)
 * ======================================
 */

/**
 * Section Types available in the builder
 */
export type SectionType =
    | 'hero'
    | 'quote'
    | 'couple'
    | 'event'
    | 'gallery'
    | 'love_story'
    | 'rsvp'
    | 'gift'
    | 'closing';

/**
 * Valid variants for each section type
 * Used to map to specific React Components
 */
export type HeroVariant = 'fullscreen_center' | 'card_overlap' | 'minimal_split';
export type CoupleVariant = 'card_grid' | 'rounded_split' | 'vertical_timeline';
export type GalleryVariant = 'masonry_grid' | 'carousel_slider' | 'standard_grid';
export type QuoteVariant = 'centered_simple' | 'card_backdrop' | 'floating_text';
export type EventVariant = 'vertical_list' | 'card_carousel' | 'bento_grid';
export type LoveStoryVariant = 'vertical_timeline' | 'zig_zag' | 'carousel';
export type RsvpVariant = 'standard_form' | 'modal_popup';
export type GiftVariant = 'simple_list' | 'card_grid' | 'qr_modal';
export type ClosingVariant = 'simple_centered' | 'full_image';

/**
 * Configuration for a single section block
 */
export interface SectionBlock {
    /** Unique ID for drag-and-drop */
    id: string;
    /** The type of content to render */
    type: SectionType;
    /** The specific layout variant to use */
    variant: string;
    /** Sort order (0 = top) */
    order: number;
    /** Is this section currently visible? */
    isVisible: boolean;
    /** Optional override for section-specific background */
    backgroundColor?: string;
}

/**
 * The Master JSON Structure for `themes.config` column
 */
export interface DynamicThemeConfig {
    /** Global styling rules */
    global: ThemeConfig;
    /** Ordered list of sections */
    sections: SectionBlock[];
}

/**
 * Navigation item for bottom navigation
 */
export interface NavItem {
    /** Unique identifier */
    id: string;
    /** Display label */
    label: string;
    /** Icon component */
    icon: React.ComponentType<{ className?: string }>;
}
