import { InvitationData } from "@/types/invitation";

/**
 * Rich demo data with beautiful defaults
 * Used for Demo package users to showcase all features
 */
export const DEMO_DATA: InvitationData = {
    slug: "demo-preview",
    weddingDate: "2024-12-25T08:00:00",
    groom: {
        name: "Ahmad Rizki",
        fullName: "Ahmad Rizki Maulana",
        parentName: "Bapak Suryanto & Ibu Siti Aminah",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    bride: {
        name: "Siti Nurhaliza",
        fullName: "Siti Nurhaliza Putri",
        parentName: "Bapak Hadi Wijaya & Ibu Dewi Lestari",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    events: [
        {
            name: "Akad Nikah",
            date: "Rabu, 25 Desember 2024",
            time: "08:00 WIB",
            location: "Masjid Al-Ikhlas",
            address: "Jl. Merdeka No. 123, Jakarta Selatan",
            mapsLink: "https://maps.google.com/?q=Masjid+Al-Ikhlas+Jakarta"
        },
        {
            name: "Resepsi Pernikahan",
            date: "Rabu, 25 Desember 2024",
            time: "11:00 - 14:00 WIB",
            location: "Grand Ballroom Hotel Mulia",
            address: "Jl. Asia Afrika No. 8, Jakarta Pusat",
            mapsLink: "https://maps.google.com/?q=Hotel+Mulia+Jakarta"
        }
    ],
    loveStory: [
        {
            title: "Pertemuan Pertama",
            date: "2018",
            story: "Kami bertemu pertama kali di kampus saat orientasi mahasiswa baru. Siapa sangka pertemuan singkat itu menjadi awal dari segalanya.",
            icon: "💫"
        },
        {
            title: "Menjadi Sahabat",
            date: "2019",
            story: "Dari teman sekelas, kami menjadi sahabat yang selalu berbagi cerita, tawa, dan dukungan di setiap langkah.",
            icon: "🌸"
        },
        {
            title: "Perasaan Tumbuh",
            date: "2020",
            story: "Di tengah pandemi, kami menyadari bahwa perasaan kami lebih dari sekadar persahabatan. Jarak membuat hati semakin dekat.",
            icon: "💕"
        },
        {
            title: "Lamaran",
            date: "2022",
            story: "Dengan restu kedua orang tua, kami resmi bertunangan. Moment yang paling membahagiakan dalam hidup kami.",
            icon: "💍"
        },
        {
            title: "Pernikahan",
            date: "2024",
            story: "Hari yang kami tunggu-tunggu akhirnya tiba. Kami siap memulai babak baru sebagai suami istri.",
            icon: "👰‍♀️🤵‍♂️"
        }
    ],
    gallery: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1525258437537-2a1f2e3b1c8f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&h=600&fit=crop"
    ],
    quotes: {
        verse: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.",
        source: "QS. Ar-Rum: 21"
    },
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    giftOptions: [
        {
            bankName: "Bank Central Asia (BCA)",
            accountNumber: "1234567890",
            accountHolder: "Ahmad Rizki",
            logo: "🏦"
        },
        {
            bankName: "Bank Mandiri",
            accountNumber: "0987654321",
            accountHolder: "Siti Nurhaliza",
            logo: "🏦"
        },
        {
            bankName: "GoPay",
            accountNumber: "081234567890",
            accountHolder: "Ahmad Rizki",
            logo: "💳"
        }
    ],
    shippingAddress: {
        recipient: "Ahmad Rizki & Siti Nurhaliza",
        address: "Jl. Kebahagiaan No. 99, Jakarta Selatan 12345"
    },
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
    themeConfig: {
        primaryColor: "#D4AF37",
        secondaryColor: "#8B7355",
        backgroundColor: "#FFFFFF",
        fontHeading: "Playfair Display",
        fontBody: "Inter"
    },
    features: [
        'love_story',
        'gallery_unlimited',
        'gift_registry',
        'background_music',
        'custom_theme',
        'rsvp_basic',
        'rsvp_export',
        'quotes',
        'unlimited_events',
        'remove_branding',
        'cover_image'
    ]
};
