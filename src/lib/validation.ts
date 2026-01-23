import { z } from 'zod';

/**
 * ============================================
 * DESCRIPTIVE VALIDATION SCHEMAS
 * ============================================
 * 
 * Using Zod to enforce strict data integrity with 
 * user-friendly, descriptive error messages.
 */

// 1. Person Schema (for Groom & Bride)
const personSchema = z.object({
    name: z.string()
        .min(2, "Nama panggilan terlalu pendek (minimal 2 karakter)")
        .max(50, "Nama panggilan terlalu panjang (maksimal 50 karakter)"),
    fullName: z.string()
        .min(3, "Nama lengkap sesuai identitas wajib diisi (minimal 3 karakter)")
        .max(150, "Nama lengkap tidak boleh lebih dari 150 karakter"),
    parentName: z.string()
        .min(3, "Nama orang tua wajib diisi (minimal 3 karakter)")
        .max(200, "Nama orang tua terlalu panjang"),
    photo: z.string()
        .refine((val) => {
            if (!val) return true;
            try {
                new URL(val);
                return true;
            } catch (e) {
                return val.startsWith('/uploads') || val.startsWith('/images');
            }
        }, {
            message: "Mohon masukkan link foto yang valid (internal path atau http/https)"
        })
        .optional()
        .or(z.literal("")),
});

// 2. Event Schema
const eventSchema = z.object({
    name: z.string()
        .min(3, "Berikan nama acara yang jelas (contoh: Akad Nikah, Resepsi)")
        .max(100, "Nama acara terlalu panjang"),
    date: z.string()
        .min(1, "Tanggal pelaksanaan acara harus ditentukan"),
    time: z.string()
        .min(1, "Waktu/Jam acara wajib diisi (contoh: 08:00 - Selesai)"),
    location: z.string()
        .min(3, "Nama tempat/gedung wajib diisi (minimal 3 karakter)"),
    address: z.string()
        .min(10, "Alamat lengkap wajib diisi agar tamu mudah menemukan lokasi")
        .max(500, "Alamat terlalu panjang"),
    mapsLink: z.string()
        .url("Link Google Maps tidak valid. Pastikan link diawali dengan http/https")
        .optional()
        .or(z.literal("")),
});

// 3. Love Story Schema
const loveStoryItemSchema = z.object({
    title: z.string()
        .min(3, "Judul momen wajib diisi (contoh: Pertama Ketemu)")
        .max(100, "Judul momen terlalu panjang"),
    date: z.string()
        .min(1, "Beri tahu kapan momen ini terjadi (contoh: Tahun 2020)"),
    story: z.string()
        .min(10, "Ceritakan sedikit lebih detail tentang momen ini (minimal 10 karakter)")
        .max(1000, "Cerita terlalu panjang (maksimal 1000 karakter)"),
    icon: z.string()
        .optional()
        .or(z.literal("")),
});

// 4. Quotes Schema
const quotesSchema = z.object({
    verse: z.string()
        .min(10, "Kutipan atau ayat terlalu pendek (minimal 10 karakter)")
        .max(2000, "Kutipan terlalu panjang")
        .default(""),
    source: z.string()
        .min(2, "Sebutkan sumber kutipan (contoh: Ar-Rum: 21)")
        .max(100, "Sumber kutipan terlalu panjang")
        .default(""),
}).optional().default({ verse: "", source: "" });

// 5. Gift/Transfer Options Schema
const bankAccountSchema = z.object({
    bankName: z.string()
        .min(2, "Nama Bank/Dompet Digital wajib diisi (contoh: BCA, GoPay)")
        .max(50, "Nama bank terlalu panjang"),
    accountNumber: z.string()
        .min(5, "Nomor rekening/HP tidak valid (minimal 5 digit)")
        .max(50, "Nomor rekening terlalu panjang")
        .regex(/^[0-9-]+$/, "Format nomor rekening hanya boleh angka dan tanda hubung (-)"),
    accountHolder: z.string()
        .min(3, "Nama pemilik rekening wajib diisi sesuai buku tabungan")
        .max(150, "Nama pemilik terlalu panjang"),
    logo: z.string().optional(),
});

// 6. Shipping Address Schema
const shippingAddressSchema = z.object({
    recipient: z.string()
        .min(3, "Nama penerima paket wajib diisi")
        .optional()
        .or(z.literal("")),
    address: z.string()
        .min(10, "Alamat pengiriman kado fisik harus lengkap")
        .optional()
        .or(z.literal("")),
}).optional();

// 7. Theme Config Schema
const themeConfigSchema = z.object({
    primaryColor: z.string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, "Format warna tidak valid")
        .default("#D4AF37"),
    secondaryColor: z.string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, "Format warna tidak valid")
        .default("#F3E5AB"),
    backgroundColor: z.string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, "Format warna tidak valid")
        .default("#FFFFFF"),
    fontHeading: z.string()
        .default("Playfair Display"),
    fontBody: z.string()
        .default("Inter"),
}).optional();

// 8. Main Invitation Schema
export const invitationSchema = z.object({
    slug: z.string()
        .min(3, "Link undangan (slug) minimal 3 karakter")
        .max(100, "Link undangan terlalu panjang (maksimal 100 karakter)")
        .regex(/^[a-z0-9-]+$/, "Link hanya boleh berisi huruf kecil, angka, dan tanda hubung (-) tanpa spasi"),
    weddingDate: z.string()
        .min(1, "Tanggal utama pernikahan wajib diisi untuk sistem CountDown"),
    groom: personSchema,
    bride: personSchema,
    events: z.array(eventSchema)
        .min(1, "Wajib ada minimal 1 acara (misal: Akad Nikah)")
        .default([]),
    loveStory: z.array(loveStoryItemSchema).optional().default([]),
    quotes: quotesSchema,
    musicUrl: z.string()
        .refine((val) => {
            if (!val) return true;
            try {
                new URL(val);
                return true;
            } catch (e) {
                return val.startsWith('/uploads') || val.startsWith('/music');
            }
        }, {
            message: "Link musik tidak valid. Gunakan link MP3 atau URL (http/https) yang didukung"
        })
        .optional()
        .or(z.literal("")),
    giftOptions: z.array(bankAccountSchema).optional().default([]),
    shippingAddress: shippingAddressSchema,
    gallery: z.array(
        z.string().refine((val) => {
            if (!val) return true;
            try {
                new URL(val);
                return true;
            } catch (e) {
                return val.startsWith('/uploads') || val.startsWith('/images');
            }
        }, {
            message: "Salah satu link foto galeri tidak valid"
        })
    ).optional(),
    themeConfig: themeConfigSchema.optional(),
    coverImage: z.string()
        .refine((val) => {
            if (!val) return true;
            try {
                new URL(val);
                return true;
            } catch (e) {
                return val.startsWith('/uploads') || val.startsWith('/images');
            }
        }, {
            message: "Link foto sampul tidak valid"
        })
        .optional()
        .or(z.literal("")),
});

export type InvitationSchemaType = z.infer<typeof invitationSchema>;

/**
 * Helper to get error message from ZodError using path string
 * Example path: "groom.name" or "events.0.name"
 */
export function getZodErrorByPath(error: z.ZodError | null, path: string): string | undefined {
    if (!error) return undefined;
    const issue = error.issues.find((i) => i.path.join('.') === path);
    return issue?.message;
}
