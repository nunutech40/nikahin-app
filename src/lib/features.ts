import { InvitationData, FeatureCode } from "@/types/invitation";

/**
 * Helper to check if a feature is accessible for a given invitation.
 * In a real app, this would check against the invitation's package privileges.
 * 
 * @param data InvitationData
 * @param code FeatureCode to check
 * @returns boolean
 */
export function canUseFeature(data: InvitationData, code: FeatureCode): boolean {
    // Core features that are always enabled for everyone
    const coreFeatures: FeatureCode[] = []; // Add codes here if needed

    if (coreFeatures.includes(code)) return true;

    // Check if feature is explicitly enabled in the invitation's features list
    // This list would be populated from the database based on the package_features pivot table
    return data.features?.includes(code) ?? false;
}

/**
 * List of feature metadata for display purposes
 */
export const FEATURE_METADATA: Record<FeatureCode, { name: string; description: string }> = {
    'love-story': {
        name: 'Cerita Cinta',
        description: 'Tampilkan perjalanan cinta Anda dalam bentuk timeline yang romantis.'
    },
    'gallery': {
        name: 'Galeri Foto',
        description: 'Unggah momen-momen indah Anda untuk dibagikan kepada tamu.'
    },
    'gift-registry': {
        name: 'Hadiah Digital',
        description: 'Mudahkan tamu memberikan kado melalui rekening atau alamat pengiriman.'
    },
    'background-music': {
        name: 'Musik Latar',
        description: 'Tambahkan suasana romantis dengan musik pilihan Anda.'
    },
    'custom-theme': {
        name: 'Kustomisasi Tampilan',
        description: 'Atur warna dan font sesuai keinginan untuk undangan yang unik.'
    },
    'rsvp': {
        name: 'Sistem RSVP',
        description: 'Kelola daftar kehadiran tamu secara otomatis dan instan.'
    },
    'quotes': {
        name: 'Kutipan & Doa',
        description: 'Sematkan ayat suci atau kata mutiara di undangan Anda.'
    },
    'multi-event': {
        name: 'Multi Acara',
        description: 'Tambahkan lebih dari satu rangkaian acara (misal: Akad dan Resepsi terpisah).'
    }
};
