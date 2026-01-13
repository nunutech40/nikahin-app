import { InvitationData } from "@/types/invitation";

// =====================================================
// MOCK DATA - Will be replaced with database data
// =====================================================

export const MOCK_DATA: InvitationData = {
    slug: "rizka-ayu",
    weddingDate: "2025-02-15T08:00:00", // ISO format for countdown
    groom: {
        name: "Robert Downey",
        fullName: "Robert Downey Junior",
        parentName: "Bapak Ahmad Nugraha & Ibu Siti Fatimah",
        photo: "/images/couple/groom-portrait.png",
    },
    bride: {
        name: "Dakot Johnson",
        fullName: "Dakot Johnson",
        parentName: "Bapak Hendra Kusuma & Ibu Dewi Anggraeni",
        photo: "/images/couple/bride-portrait.png",
    },
    events: [
        {
            name: "Akad Nikah",
            date: "Sabtu, 15 Februari 2025",
            time: "08:00 - 10:00 WIB",
            location: "Masjid Al-Ikhlas",
            address: "Jl. Merdeka No. 123, Jakarta Selatan",
            mapsLink: "https://maps.google.com/?q=-6.2088,106.8456",
        },
        {
            name: "Resepsi",
            date: "Sabtu, 15 Februari 2025",
            time: "11:00 - 14:00 WIB",
            location: "Balai Kartini",
            address: "Jl. Gatot Subroto Kav. 37, Jakarta Selatan",
            mapsLink: "https://maps.google.com/?q=-6.2295,106.8295",
        },
    ],
    loveStory: [
        {
            title: "Pertemuan Pertama",
            date: "Januari 2020",
            story: "Takdir mempertemukan kami di sebuah acara kampus. Tatapan pertama yang canggung, senyuman yang malu-malu, dan percakapan singkat yang ternyata menjadi awal dari segalanya.",
            icon: "💫",
        },
        {
            title: "Jatuh Cinta",
            date: "Maret 2020",
            story: "Dari teman biasa menjadi teman dekat, lalu tanpa sadar hati mulai berbisik. Setiap hari terasa lebih indah karena ada kamu yang selalu menemani.",
            icon: "💕",
        },
        {
            title: "Menjalin Hubungan",
            date: "Juni 2020",
            story: "Dengan restu keluarga, kami memutuskan untuk menjalani hubungan yang serius. Belajar saling memahami, saling mendukung, dan tumbuh bersama.",
            icon: "🌸",
        },
        {
            title: "Lamaran",
            date: "Desember 2024",
            story: "Momen yang paling ditunggu akhirnya tiba. Dengan penuh kebahagiaan dan air mata haru, kami memutuskan untuk melangkah ke jenjang yang lebih serius.",
            icon: "💍",
        },
        {
            title: "Pernikahan",
            date: "Februari 2025",
            story: "Dan hari ini, kami akan mengikat janji suci di hadapan Allah SWT dan keluarga. Sebuah awal baru untuk menjalani hidup bersama selamanya.",
            icon: "👰‍♀️🤵‍♂️",
        },
    ],
    gallery: [
        "/images/couple/wedding-romantic.png",
        "/images/couple/hero-couple.png",
        "/images/couple/prewedding-beach.png",
    ],
    quotes: {
        verse:
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
        source: "QS. Ar-Rum: 21",
    },
    bankAccounts: [
        {
            bank: "Bank Central Asia (BCA)",
            accountNumber: "1234567890",
            accountName: "Robert Downey",
        },
        {
            bank: "Bank Mandiri",
            accountNumber: "9876543210",
            accountName: "Dakot Johnson",
        },
    ],
    musicUrl: "/music/wedding-bgm.mp3",
    giftOptions: [
        {
            bankName: "Bank Central Asia (BCA)",
            accountNumber: "1234567890",
            accountHolder: "Robert Downey",
            logo: "🏦",
        },
        {
            bankName: "Bank Mandiri",
            accountNumber: "9876543210",
            accountHolder: "Dakot Johnson",
            logo: "🏦",
        },
        {
            bankName: "Bank Rakyat Indonesia (BRI)",
            accountNumber: "5555666677",
            accountHolder: "Robert & Dakot",
            logo: "🏦",
        },
    ],
    shippingAddress: {
        recipient: "Robert Downey & Dakot Johnson",
        address: "Jl. Merdeka No. 123, RT 05/RW 03, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12345",
    },
    coverImage: "/images/couple/hero-couple.png",
    themeConfig: {
        primaryColor: "#D4AF37", // Gold
        secondaryColor: "#F3E5AB", // Light Gold
        fontHeading: "Playfair Display",
        fontBody: "Inter",
    },
    // Mocking a 'Professional' package with all features enabled
    packageId: "pkg_professional",
    features: [
        'love-story',
        'gallery',
        'gift-registry',
        'background-music',
        'custom-theme',
        'rsvp',
        'quotes'
    ],
};
