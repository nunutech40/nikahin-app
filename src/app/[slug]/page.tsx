"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    Heart,
    Music,
    VolumeX,
    ChevronDown,
    Send,
    Gift,
    Copy,
    Check,
    Users,
    Camera,
    MessageCircle,
} from "lucide-react";

// =====================================================
// MOCK DATA - Akan diganti dengan data dari database
// =====================================================
const MOCK_DATA = {
    slug: "rizka-ayu",
    weddingDate: "2025-02-15T08:00:00", // ISO format for countdown
    groom: {
        name: "Robert Downey",
        fullName: "Robert Downey Junior",
        parentName: "Bapak Ahmad Nugraha & Ibu Siti Fatimah",
        photo: "/images/gallery-2.png",
    },
    bride: {
        name: "Dakot Johnson",
        fullName: "Dakot Johnson",
        parentName: "Bapak Hendra Kusuma & Ibu Dewi Anggraeni",
        photo: "/images/gallery-2.png",
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
};

// =====================================================
// COMPONENTS
// =====================================================

// Countdown Timer Component - Compact & Elegant
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(MOCK_DATA.weddingDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds },
    ];

    return (
        <div className="flex gap-2 md:gap-3 justify-center items-center">
            {timeUnits.map((unit, index) => (
                <motion.div
                    key={unit.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                    className="flex flex-col items-center"
                >
                    <div className="min-w-[3.5rem] md:min-w-[4rem] px-3 py-2 md:px-4 md:py-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border border-[var(--color-primary-light)]/20">
                        <span className="text-xl md:text-2xl font-serif font-bold text-[var(--color-primary-dark)] block">
                            {String(unit.value).padStart(2, "0")}
                        </span>
                    </div>
                    <span className="text-[0.65rem] md:text-xs text-[var(--color-text-muted)] mt-1.5 font-light uppercase tracking-wider">
                        {unit.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}

// Cover / Hero Section - REDESIGNED FOR WOW FACTOR
function HeroSection({ onOpen, guestName }: { onOpen: () => void; guestName?: string }) {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-12"
            style={{
                background: "linear-gradient(135deg, #fdfbf7 0%, #f8f4ed 50%, #fef9f3 100%)",
            }}
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Subtle floral pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Gradient overlays for depth */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary-light)] rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-rose-light)] rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Elegant Top Ornament */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-center gap-3 text-[var(--color-primary)]">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
                        <Heart className="w-5 h-5 fill-current" />
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
                    </div>
                </motion.div>

                {/* Invitation Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[var(--color-text-muted)] mb-2 font-light">
                        The Wedding Of
                    </p>

                    {/* Couple Names - Using Nicknames */}
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--color-primary-dark)] mb-3 leading-tight">
                        Robert <span className="text-[var(--color-primary)]">&</span> Dakot
                    </h1>
                </motion.div>

                {/* Couple Photo - Prominent & Elegant */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                        {/* Decorative frame */}
                        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] p-3 animate-pulse-slow">
                            <div className="absolute inset-0 rounded-full border border-[var(--color-primary-light)] m-2" />
                        </div>

                        {/* Photo */}
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                            <Image
                                src="/images/couple/hero-couple.png"
                                alt="Robert & Dakot"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Invitation Text - Warm & Personal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6 max-w-md mx-auto"
                >
                    {guestName && (
                        <div className="mb-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-[var(--color-primary-light)]/30">
                            <p className="text-xs md:text-sm text-[var(--color-text-muted)] mb-1 font-light">
                                Kepada Yth.
                            </p>
                            <p className="text-lg md:text-xl font-serif text-[var(--color-primary-dark)] font-semibold">
                                {guestName}
                            </p>
                        </div>
                    )}

                    <p className="text-sm md:text-base text-[var(--color-text)] leading-relaxed font-light">
                        Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berbagi kebahagiaan di hari istimewa kami
                    </p>
                </motion.div>

                {/* Date */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-sm md:text-base text-[var(--color-primary-dark)] font-medium mb-6"
                >
                    Sabtu, 15 Februari 2025
                </motion.p>

                {/* Countdown Timer - Compact & Elegant */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="mb-8"
                >
                    <CountdownTimer />
                </motion.div>

                {/* Open Invitation Button - Subtle but Noticeable */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpen}
                    className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative">Buka Undangan</span>
                    <ChevronDown className="relative w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </motion.button>

                {/* Bottom Ornament */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-12"
                >
                    <div className="flex items-center justify-center gap-2 text-[var(--color-text-muted)] text-xs">
                        <div className="w-8 h-px bg-[var(--color-text-muted)]/30" />
                        <span className="font-light">Scroll untuk membuka</span>
                        <div className="w-8 h-px bg-[var(--color-text-muted)]/30" />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}

// Quote Section
function QuoteSection() {
    return (
        <section className="section bg-[var(--color-rose-light)]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-2xl mx-auto"
            >
                <div className="ornament-dot text-[var(--color-primary)]">
                    <Heart className="w-5 h-5 fill-current" />
                </div>
                <p className="font-serif text-lg md:text-xl italic text-[var(--color-text)] leading-relaxed mt-6 mb-4">
                    &ldquo;{MOCK_DATA.quotes.verse}&rdquo;
                </p>
                <p className="text-sm md:text-base text-[var(--color-primary-dark)] font-medium">
                    — {MOCK_DATA.quotes.source}
                </p>
            </motion.div>
        </section>
    );
}

// Couple Profile Section
function CoupleSection() {
    return (
        <section id="couple" className="section scroll-mt-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Bismillahirrahmanirrahim</p>
                <h2 className="section-title">Mempelai</h2>
                <div className="ornament" />
            </motion.div>

            <div className="space-y-12 mt-8 max-w-xl mx-auto">
                {/* Groom */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] p-2">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                    src={MOCK_DATA.groom.photo}
                                    alt={MOCK_DATA.groom.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-primary-dark)] mb-2">
                        {MOCK_DATA.groom.fullName}
                    </h3>
                    <p className="text-sm md:text-base text-[var(--color-text-light)]">
                        Putra dari
                    </p>
                    <p className="text-sm md:text-base text-[var(--color-text)]">
                        {MOCK_DATA.groom.parentName}
                    </p>
                </motion.div>

                {/* Heart Divider */}
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                        <Heart className="w-6 h-6 text-[var(--color-primary)] fill-current" />
                    </div>
                </motion.div>

                {/* Bride */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] p-2">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                    src={MOCK_DATA.bride.photo}
                                    alt={MOCK_DATA.bride.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-primary-dark)] mb-2">
                        {MOCK_DATA.bride.fullName}
                    </h3>
                    <p className="text-sm md:text-base text-[var(--color-text-light)]">
                        Putri dari
                    </p>
                    <p className="text-sm md:text-base text-[var(--color-text)]">
                        {MOCK_DATA.bride.parentName}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

// Event Details Section
function EventSection() {
    return (
        <section id="event" className="section bg-gradient-to-b from-white to-[var(--color-cream)] scroll-mt-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Save The Date</p>
                <h2 className="section-title">Waktu & Tempat</h2>
                <div className="ornament" />
            </motion.div>

            <div className="space-y-6 mt-8 max-w-xl mx-auto">
                {MOCK_DATA.events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="glass rounded-2xl p-6 shadow-lg"
                    >
                        <h3 className="font-serif text-xl md:text-2xl text-[var(--color-primary-dark)] text-center mb-4">
                            {event.name}
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[var(--color-text)]">
                                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                                <span className="text-sm md:text-base">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[var(--color-text)]">
                                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                                <span className="text-sm md:text-base">{event.time}</span>
                            </div>
                            <div className="flex items-start gap-3 text-[var(--color-text)]">
                                <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm md:text-base font-medium">{event.location}</p>
                                    <p className="text-xs md:text-sm text-[var(--color-text-light)]">
                                        {event.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={event.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] text-sm md:text-base font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all"
                        >
                            <MapPin className="w-4 h-4" />
                            Lihat Lokasi
                        </a>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// Love Story Section - EMOTIONAL & ENGAGING
function LoveStorySection() {
    return (
        <section className="section bg-gradient-to-b from-[var(--color-cream)] to-white">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Our Journey</p>
                <h2 className="section-title">Kisah Cinta Kami</h2>
                <div className="ornament" />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-sm md:text-base text-[var(--color-text-light)] max-w-2xl mx-auto mt-4 mb-12"
            >
                Setiap cinta memiliki ceritanya sendiri. Ini adalah perjalanan kami,
                dari pertemuan pertama hingga hari yang paling ditunggu.
            </motion.p>

            <div className="relative max-w-3xl mx-auto">
                {/* Timeline Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary-light)] via-[var(--color-primary)] to-[var(--color-primary-light)] transform -translate-x-1/2 hidden md:block" />

                {/* Timeline Items */}
                <div className="space-y-12 md:space-y-16">
                    {MOCK_DATA.loveStory.map((story, index) => {
                        const isLeft = index % 2 === 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex items-center gap-4 md:gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Content Card */}
                                <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                                    <div className="glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
                                            <span className="text-3xl">{story.icon}</span>
                                            <div>
                                                <h3 className="font-serif text-xl md:text-2xl text-[var(--color-primary-dark)] font-semibold">
                                                    {story.title}
                                                </h3>
                                                <p className="text-xs md:text-sm text-[var(--color-primary)] font-medium">
                                                    {story.date}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm md:text-base text-[var(--color-text)] leading-relaxed">
                                            {story.story}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline Dot */}
                                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-white shadow-lg z-10" />

                                {/* Mobile Icon */}
                                <div className="md:hidden flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-2xl">
                                    {story.icon}
                                </div>

                                {/* Spacer for desktop */}
                                <div className="hidden md:block flex-1" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Heart at the end */}
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="flex justify-center mt-12"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-xl">
                        <Heart className="w-8 h-8 text-white fill-current animate-pulse" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Gallery Section
function GallerySection() {
    return (
        <section id="gallery" className="section scroll-mt-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Our Moments</p>
                <h2 className="section-title">Galeri Foto</h2>
                <div className="ornament" />
            </motion.div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 max-w-2xl mx-auto">
                {MOCK_DATA.gallery.map((photo, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative rounded-2xl overflow-hidden shadow-lg ${index === 0 ? "col-span-2 aspect-video" : "aspect-square"
                            }`}
                    >
                        <Image
                            src={photo}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// Gift Section with Swipeable Carousel
function GiftSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAddress, setCopiedAddress] = useState(false);

    const handleCopy = (accountNumber: string, index: number) => {
        navigator.clipboard.writeText(accountNumber);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(MOCK_DATA.shippingAddress.address);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % MOCK_DATA.giftOptions.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? MOCK_DATA.giftOptions.length - 1 : prev - 1
        );
    };

    return (
        <section className="section bg-[var(--color-rose-light)]">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Wedding Gift</p>
                <h2 className="section-title">Amplop Digital</h2>
                <div className="ornament" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 max-w-xl mx-auto"
            >
                <p className="text-center text-sm md:text-base text-[var(--color-text-light)] mb-6">
                    Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih
                    dapat melalui:
                </p>

                {/* Swipeable Carousel */}
                <div className="relative">
                    {/* Cards Container */}
                    <div className="overflow-hidden rounded-2xl">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${currentSlide * 100}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {MOCK_DATA.giftOptions.map((gift, index) => (
                                <div
                                    key={index}
                                    className="min-w-full px-2"
                                >
                                    <div className="glass rounded-2xl p-6 shadow-lg text-center">
                                        <div className="text-4xl mb-4">{gift.logo}</div>
                                        <p className="text-sm md:text-base text-[var(--color-text-light)] mb-1">
                                            {gift.bankName}
                                        </p>
                                        <p className="font-mono text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-1">
                                            {gift.accountNumber}
                                        </p>
                                        <p className="text-sm md:text-base text-[var(--color-text-light)] mb-4">
                                            a.n. {gift.accountHolder}
                                        </p>
                                        <button
                                            onClick={() => handleCopy(gift.accountNumber, index)}
                                            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-white border border-[var(--color-primary-light)] text-sm md:text-base text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all"
                                        >
                                            {copiedIndex === index ? (
                                                <>
                                                    <Check className="w-4 h-4 text-green-500" />
                                                    Tersalin!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Salin Nomor
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    {MOCK_DATA.giftOptions.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all z-10"
                                aria-label="Previous"
                            >
                                ‹
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all z-10"
                                aria-label="Next"
                            >
                                ›
                            </button>
                        </>
                    )}

                    {/* Dots Indicator */}
                    {MOCK_DATA.giftOptions.length > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {MOCK_DATA.giftOptions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${currentSlide === index
                                        ? "bg-[var(--color-primary)] w-6"
                                        : "bg-[var(--color-primary-light)]"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Shipping Address */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                >
                    <p className="text-center text-sm md:text-base text-[var(--color-text-light)] mb-4">
                        Atau kirim kado fisik ke:
                    </p>
                    <div className="glass rounded-2xl p-6 shadow-lg">
                        <p className="text-sm md:text-base font-semibold text-[var(--color-text)] mb-2">
                            {MOCK_DATA.shippingAddress.recipient}
                        </p>
                        <p className="text-sm md:text-base text-[var(--color-text-light)] mb-4 leading-relaxed">
                            {MOCK_DATA.shippingAddress.address}
                        </p>
                        <button
                            onClick={handleCopyAddress}
                            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-white border border-[var(--color-primary-light)] text-sm md:text-base text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all"
                        >
                            {copiedAddress ? (
                                <>
                                    <Check className="w-4 h-4 text-green-500" />
                                    Tersalin!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Salin Alamat
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

// RSVP Section
function RSVPSection() {
    const [formData, setFormData] = useState({
        name: "",
        attendance: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Connect to database
        console.log("RSVP Submitted:", formData);
        alert("Terima kasih atas konfirmasi kehadiranmu!");
    };

    return (
        <section id="rsvp" className="section scroll-mt-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Konfirmasi Kehadiran</p>
                <h2 className="section-title">RSVP</h2>
                <div className="ornament" />
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="mt-8 space-y-4 max-w-xl mx-auto"
            >
                <div>
                    <input
                        type="text"
                        placeholder="Nama Lengkap"
                        className="input-wedding"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <select
                        className="input-wedding appearance-none cursor-pointer"
                        value={formData.attendance}
                        onChange={(e) =>
                            setFormData({ ...formData, attendance: e.target.value })
                        }
                        required
                    >
                        <option value="" disabled>
                            Konfirmasi Kehadiran
                        </option>
                        <option value="hadir">Ya, Saya Akan Hadir</option>
                        <option value="tidak">Maaf, Saya Tidak Bisa Hadir</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    Kirim Konfirmasi
                </button>
            </motion.form>
        </section>
    );
}

// Guest Book Section - Separate from RSVP
function GuestBookSection() {
    const [wishes, setWishes] = useState([
        {
            name: "Budi Santoso",
            message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallah!",
            date: "2 hari yang lalu",
        },
        {
            name: "Siti Nurhaliza",
            message: "MasyaAllah, bahagia sekali melihat kalian berdua. Semoga langgeng sampai kakek nenek ya! ❤️",
            date: "3 hari yang lalu",
        },
        {
            name: "Ahmad Fauzi",
            message: "Congratulations! Wishing you both a lifetime of love and happiness together.",
            date: "5 hari yang lalu",
        },
    ]);

    const [newWish, setNewWish] = useState({
        name: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Connect to database
        console.log("Wish Submitted:", newWish);

        // Add to local state (temporary)
        setWishes([
            {
                name: newWish.name,
                message: newWish.message,
                date: "Baru saja",
            },
            ...wishes,
        ]);

        // Reset form
        setNewWish({ name: "", message: "" });
        alert("Terima kasih atas ucapan dan doanya! 🙏");
    };

    return (
        <section className="section bg-gradient-to-b from-white to-[var(--color-cream)]">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Wishes & Prayers</p>
                <h2 className="section-title">Buku Tamu</h2>
                <div className="ornament" />
            </motion.div>

            <div className="mt-8 max-w-2xl mx-auto">
                {/* Form to add new wish */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className="glass rounded-2xl p-6 shadow-lg mb-8"
                >
                    <h3 className="font-serif text-xl md:text-2xl text-[var(--color-primary-dark)] mb-4 text-center">
                        Kirim Ucapan & Doa
                    </h3>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nama Anda"
                            className="input-wedding"
                            value={newWish.name}
                            onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                            required
                        />

                        <textarea
                            placeholder="Tulis ucapan & doa untuk mempelai..."
                            className="input-wedding min-h-[120px] resize-none"
                            value={newWish.message}
                            onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                            required
                        />

                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Kirim Ucapan
                        </button>
                    </div>
                </motion.form>

                {/* Display wishes */}
                <div className="space-y-4">
                    <h3 className="font-serif text-lg md:text-xl text-[var(--color-primary-dark)] mb-4">
                        Ucapan dari Tamu ({wishes.length})
                    </h3>

                    {wishes.map((wish, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass rounded-xl p-5 shadow-md"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--color-primary)] font-semibold">
                                        {wish.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-[var(--color-text)] text-sm md:text-base">
                                            {wish.name}
                                        </h4>
                                        <span className="text-xs text-[var(--color-text-muted)]">
                                            {wish.date}
                                        </span>
                                    </div>
                                    <p className="text-sm md:text-base text-[var(--color-text-light)] leading-relaxed">
                                        {wish.message}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


// Footer Section
function FooterSection() {
    return (
        <footer className="section bg-[var(--color-primary-dark)] text-white text-center">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="text-sm md:text-base opacity-80 mb-4">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami
                    <br />
                    apabila Bapak/Ibu/Saudara/i berkenan hadir
                    <br />
                    untuk memberikan doa restu.
                </p>
                <h3 className="font-serif text-2xl md:text-3xl mb-2">
                    {MOCK_DATA.groom.name} & {MOCK_DATA.bride.name}
                </h3>
                <p className="text-xs opacity-60 mt-8">
                    Made with ❤️ by{" "}
                    <span className="font-semibold">Nikahin.</span>
                </p>
            </motion.div>
        </footer>
    );
}

// Bottom Navigation
function BottomNavigation({ activeSection }: { activeSection: string }) {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Account for fixed nav height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    const navItems = [
        { id: "couple", label: "Mempelai", icon: Users },
        { id: "event", label: "Acara", icon: Calendar },
        { id: "gallery", label: "Galeri", icon: Camera },
        { id: "rsvp", label: "RSVP", icon: MessageCircle },
    ];

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                        >
                            <Icon className="nav-icon" />
                            <span className="nav-label">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

// Music Toggle Button
function MusicToggle({
    isPlaying,
    onToggle,
}: {
    isPlaying: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 }}
            onClick={onToggle}
            className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border border-[var(--color-primary-light)] hover:bg-[var(--color-primary-light)] transition-all"
        >
            {isPlaying ? (
                <Music className="w-5 h-5 text-[var(--color-primary)] animate-pulse" />
            ) : (
                <VolumeX className="w-5 h-5 text-[var(--color-text-muted)]" />
            )}
        </motion.button>
    );
}

// =====================================================
// MAIN PAGE COMPONENT
// =====================================================

export default function InvitationPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [activeSection, setActiveSection] = useState("couple");
    const [guestName, setGuestName] = useState<string | undefined>(undefined);

    // Extract guest name from URL parameter
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const name = params.get("to");
            if (name) {
                setGuestName(decodeURIComponent(name));
            }
        }
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setIsMusicPlaying(true);
        // TODO: Play background music
    };

    const toggleMusic = () => {
        setIsMusicPlaying(!isMusicPlaying);
        // TODO: Toggle audio playback
    };

    // Track active section on scroll
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleScroll = () => {
            const sections = ["couple", "event", "gallery", "rsvp"];
            const scrollPosition = window.scrollY + 200;

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #faf8f5, #f5e6e6)" }}>
            <div className="invitation-container">
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <HeroSection key="hero" onOpen={handleOpen} guestName={guestName} />
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="content-with-nav"
                        >
                            <QuoteSection />
                            <CoupleSection />
                            <EventSection />
                            <LoveStorySection />
                            <GallerySection />
                            <GiftSection />
                            <RSVPSection />
                            <GuestBookSection />
                            <FooterSection />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isOpen && (
                <>
                    <MusicToggle isPlaying={isMusicPlaying} onToggle={toggleMusic} />
                    <BottomNavigation activeSection={activeSection} />
                </>
            )}
        </div>
    );
}

