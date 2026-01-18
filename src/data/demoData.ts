import { InvitationData } from "@/types/invitation";

/**
 * Rich demo data with beautiful defaults
 * Used for Demo package users to showcase all features
 */
export const DEMO_DATA: InvitationData = {
    slug: "demo-preview",
    groom: {
        name: "Ahmad Rizki",
        nickname: "Rizki",
        father: "Bapak Suryanto",
        mother: "Ibu Siti Aminah",
        instagram: "@ahmadrizki",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    bride: {
        name: "Siti Nurhaliza",
        nickname: "Siti",
        father: "Bapak Hadi Wijaya",
        mother: "Ibu Dewi Lestari",
        instagram: "@sitinurhaliza",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    events: [
        {
            name: "Akad Nikah",
            date: "2024-12-25",
            time: "08:00 WIB",
            location: "Masjid Al-Ikhlas",
            address: "Jl. Merdeka No. 123, Jakarta Selatan",
            mapsLink: "https://maps.google.com/?q=Masjid+Al-Ikhlas+Jakarta"
        },
        {
            name: "Resepsi Pernikahan",
            date: "2024-12-25",
            time: "11:00 - 14:00 WIB",
            location: "Grand Ballroom Hotel Mulia",
            address: "Jl. Asia Afrika No. 8, Jakarta Pusat",
            mapsLink: "https://maps.google.com/?q=Hotel+Mulia+Jakarta"
        }
    ],
    loveStory: [
        {
            year: "2018",
            title: "Pertemuan Pertama",
            description: "Kami bertemu pertama kali di kampus saat orientasi mahasiswa baru. Siapa sangka pertemuan singkat itu menjadi awal dari segalanya."
        },
        {
            year: "2019",
            title: "Menjadi Sahabat",
            description: "Dari teman sekelas, kami menjadi sahabat yang selalu berbagi cerita, tawa, dan dukungan di setiap langkah."
        },
        {
            year: "2020",
            title: "Perasaan Tumbuh",
            description: "Di tengah pandemi, kami menyadari bahwa perasaan kami lebih dari sekadar persahabatan. Jarak membuat hati semakin dekat."
        },
        {
            year: "2022",
            title: "Lamaran",
            description: "Dengan restu kedua orang tua, kami resmi bertunangan. Moment yang paling membahagiakan dalam hidup kami."
        },
        {
            year: "2024",
            title: "Pernikahan",
            description: "Hari yang kami tunggu-tunggu akhirnya tiba. Kami siap memulai babak baru sebagai suami istri."
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
    giftOptions: [
        {
            type: "bank",
            label: "Transfer Bank BCA",
            accountNumber: "1234567890",
            accountName: "Ahmad Rizki"
        },
        {
            type: "bank",
            label: "Transfer Bank Mandiri",
            accountNumber: "0987654321",
            accountName: "Siti Nurhaliza"
        },
        {
            type: "ewallet",
            label: "GoPay",
            accountNumber: "081234567890",
            accountName: "Ahmad Rizki"
        }
    ],
    shippingAddress: {
        recipient: "Ahmad Rizki & Siti Nurhaliza",
        phone: "081234567890",
        address: "Jl. Kebahagiaan No. 99, Jakarta Selatan 12345"
    },
    quotes: {
        text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.",
        author: "QS. Ar-Rum: 21"
    },
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
    themeConfig: {
        primaryColor: "#D4AF37",
        secondaryColor: "#8B7355",
        fontFamily: "Playfair Display"
    },
    features: [] // Will be populated from package
};
