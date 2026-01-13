import { z } from 'zod';

// Person Schema (for Groom & Bride)
const personSchema = z.object({
    name: z.string().min(1, "Nama panggilan wajib diisi"),
    fullName: z.string().min(1, "Nama lengkap wajib diisi"),
    parentName: z.string().optional(), // Boleh kosong dulu
    photo: z.string().url("Format URL foto tidak valid").optional().or(z.literal("")),
});

// Event Schema
const eventSchema = z.object({
    name: z.string().min(1, "Nama acara wajib diisi"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    time: z.string().min(1, "Waktu wajib diisi"),
    location: z.string().min(1, "Lokasi wajib diisi"),
    address: z.string().optional(),
    mapsLink: z.string().url("Format link Google Maps tidak valid").optional().or(z.literal("")),
});

// Love Story Schema
const loveStoryItemSchema = z.object({
    title: z.string().min(1, "Judul momen wajib diisi"),
    date: z.string().min(1, "Tanggal momen wajib diisi"),
    story: z.string().min(1, "Cerita wajib diisi"),
    icon: z.string().emoji("Harus berupa emoji").optional().or(z.literal("")),
});

// Quotes Schema
const quotesSchema = z.object({
    verse: z.string().min(1, "Kutipan/Ayat wajib diisi"),
    source: z.string().min(1, "Sumber kutipan wajib diisi"),
});

// Bank Account Schema
const bankAccountSchema = z.object({
    bankName: z.string().min(1, "Nama bank wajib diisi"),
    accountNumber: z.string().min(1, "Nomor rekening wajib diisi"),
    accountHolder: z.string().min(1, "Nama pemilik rekening wajib diisi"),
    logo: z.string().optional(),
});

// Shipping Address Schema
const shippingAddressSchema = z.object({
    recipient: z.string().optional(),
    address: z.string().optional(),
}).optional();

// Theme Config Schema
const themeConfigSchema = z.object({
    primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Kode warna harus berupa Hex valid (contoh: #FFFFFF)"),
    secondaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Kode warna harus berupa Hex valid"),
    fontHeading: z.string().min(1, "Font heading wajib dipilih"),
    fontBody: z.string().min(1, "Font body wajib dipilih"),
});

// Main Invitation Schema
export const invitationSchema = z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip").min(3, "Slug minimal 3 karakter"),
    weddingDate: z.string().optional(), // ISO String verification handled later
    groom: personSchema,
    bride: personSchema,
    events: z.array(eventSchema).min(1, "Minimal harus ada 1 acara"),
    loveStory: z.array(loveStoryItemSchema).optional(),
    quotes: quotesSchema,
    musicUrl: z.string().url("Format URL musik tidak valid").optional().or(z.literal("")),
    giftOptions: z.array(bankAccountSchema).optional(),
    shippingAddress: shippingAddressSchema,
    gallery: z.array(z.string().url("URL galeri tidak valid")).optional(),
    themeConfig: themeConfigSchema.optional(),
    coverImage: z.string().url("Format URL cover tidak valid").optional().or(z.literal("")),
});

// Helper for single field validation (if needed for instant feedback)
export type InvitationSchemaType = z.infer<typeof invitationSchema>;
