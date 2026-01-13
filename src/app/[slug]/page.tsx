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
    gallery: [
        "/images/gallery-1.png",
        "/images/gallery-2.png",
        "/images/gallery-3.png",
    ],
    quotes: {
        verse:
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
        source: "QS. Ar-Rum: 21",
    },
    musicUrl: "/music/wedding-bgm.mp3",
    giftInfo: {
        bankName: "Bank Central Asia (BCA)",
        accountNumber: "1234567890",
        accountHolder: "Muhammad Rizka F.N.",
    },
};

// =====================================================
// COMPONENTS
// =====================================================

// Cover / Hero Section
function HeroSection({ onOpen }: { onOpen: () => void }) {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: "linear-gradient(to bottom, #faf8f5, #fffef9)",
            }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20">
                <Image
                    src="/images/hero-bg.png"
                    alt="Wedding Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-8 py-16">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm uppercase tracking-[0.3em] text-[var(--color-text-muted)] mb-4"
                >
                    The Wedding Of
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-primary-dark)] mb-2"
                >
                    {MOCK_DATA.groom.name}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl md:text-4xl text-[var(--color-primary)] my-3"
                >
                    &
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-primary-dark)] mb-8"
                >
                    {MOCK_DATA.bride.name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-sm md:text-base text-[var(--color-text-light)] mb-12"
                >
                    {MOCK_DATA.events[0].date}
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpen}
                    className="btn-primary flex items-center gap-2 mx-auto"
                >
                    Buka Undangan
                    <ChevronDown className="w-4 h-4 animate-bounce" />
                </motion.button>
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

// Gift Section
function GiftSection() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(MOCK_DATA.giftInfo.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

                <div className="glass rounded-2xl p-6 shadow-lg text-center">
                    <Gift className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
                    <p className="text-sm md:text-base text-[var(--color-text-light)] mb-1">
                        {MOCK_DATA.giftInfo.bankName}
                    </p>
                    <p className="font-mono text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-1">
                        {MOCK_DATA.giftInfo.accountNumber}
                    </p>
                    <p className="text-sm md:text-base text-[var(--color-text-light)] mb-4">
                        a.n. {MOCK_DATA.giftInfo.accountHolder}
                    </p>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-white border border-[var(--color-primary-light)] text-sm md:text-base text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all"
                    >
                        {copied ? (
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
            </motion.div>
        </section>
    );
}

// RSVP Section
function RSVPSection() {
    const [formData, setFormData] = useState({
        name: "",
        attendance: "",
        message: "",
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

                <div>
                    <textarea
                        placeholder="Ucapan & Doa untuk Mempelai"
                        className="input-wedding min-h-[120px] resize-none"
                        value={formData.message}
                        onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                        }
                    />
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
                        <HeroSection key="hero" onOpen={handleOpen} />
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
                            <GallerySection />
                            <GiftSection />
                            <RSVPSection />
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
