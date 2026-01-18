import { InvitationData, FeatureCode } from "@/types/invitation";

/**
 * Helper to check if a feature is accessible for a given invitation.
 * 
 * @param data InvitationData
 * @param code FeatureCode to check
 * @returns boolean
 */
export function canUseFeature(data: InvitationData, code: FeatureCode | string): boolean {
    const userFeatures = data.features || [];

    // Core features that are always enabled for everyone
    const coreFeatures: string[] = [
        'basic_info',
        'countdown',
        'google_maps',
        'guestbook',
        'single_event'
    ];

    if (coreFeatures.includes(code)) return true;

    // Special logic for tiered features
    if (code === 'gallery') {
        return userFeatures.includes('gallery_10') || userFeatures.includes('gallery_unlimited');
    }

    if (code === 'rsvp') {
        return userFeatures.includes('rsvp_basic') || userFeatures.includes('rsvp_export');
    }

    if (code === 'music') {
        return userFeatures.includes('background_music');
    }

    if (code === 'multi-event') {
        return userFeatures.includes('unlimited_events');
    }

    if (code === 'quotes') {
        return userFeatures.includes('quotes');
    }

    // Check if feature is explicitly enabled in the invitation's features list
    return userFeatures.includes(code);
}

/**
 * List of feature metadata for display purposes
 */
export const FEATURE_METADATA: Record<string, { name: string; description: string }> = {
    'love_story': {
        name: 'Cerita Cinta',
        description: 'Tampilkan perjalanan cinta Anda dalam bentuk timeline yang romantis.'
    },
    'gallery_10': {
        name: 'Galeri Foto (10)',
        description: 'Unggah hingga 10 foto momen indah Anda.'
    },
    'gallery_unlimited': {
        name: 'Galeri Foto Unlimited',
        description: 'Unggah foto sepuasnya untuk dibagikan kepada tamu.'
    },
    'gift_registry': {
        name: 'Hadiah Digital',
        description: 'Mudahkan tamu memberikan kado melalui rekening atau alamat pengiriman.'
    },
    'background_music': {
        name: 'Musik Latar',
        description: 'Tambahkan suasana romantis dengan musik pilihan Anda.'
    },
    'custom_theme': {
        name: 'Kustomisasi Tampilan',
        description: 'Atur warna dan font sesuai keinginan untuk undangan yang unik.'
    },
    'rsvp_basic': {
        name: 'Sistem RSVP',
        description: 'Kelola daftar kehadiran tamu secara otomatis.'
    },
    'rsvp_export': {
        name: 'Export RSVP',
        description: 'Download daftar tamu dalam format Excel/CSV.'
    },
    'quotes': {
        name: 'Kutipan & Doa',
        description: 'Sematkan ayat suci atau kata mutiara di undangan Anda.'
    },
    'unlimited_events': {
        name: 'Multi Acara',
        description: 'Tambahkan lebih dari satu rangkaian acara (misal: Akad dan Resepsi terpisah).'
    },
    'remove_branding': {
        name: 'Hapus Branding',
        description: 'Hilangkan tulisan "Powered by Nikahin" di bagian bawah undangan.'
    },
    'cover_image': {
        name: 'Foto Sampul Premium',
        description: 'Gunakan foto sampul kustom untuk mempercantik pembukaan undangan.'
    },
    'video_background': {
        name: 'Video Background',
        description: 'Latar belakang video yang elegan untuk kesan lebih dramatis.'
    },
    'live_streaming': {
        name: 'Live Streaming',
        description: 'Integrasi link Zoom/YouTube untuk tamu yang tidak bisa hadir.'
    }
};
