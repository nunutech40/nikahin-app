"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    Heart,
    ChevronDown,
    Send,
    Gift,
    Copy,
    Check,
    Sparkles,
    MessageCircle,
} from "lucide-react";

// Components
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { MusicToggle } from "@/components/ui/MusicToggle";

// Types
export interface BasicThemeProps {
    data: {
        slug: string;
        weddingDate: string;
        groom: {
            name: string;
            fullName: string;
            parentName: string;
            photo: string;
        };
        bride: {
            name: string;
            fullName: string;
            parentName: string;
            photo: string;
        };
        events: Array<{
            name: string;
            date: string;
            time: string;
            location: string;
            address: string;
            mapsLink: string;
        }>;
        loveStory: Array<{
            title: string;
            date: string;
            story: string;
            icon: string;
        }>;
        gallery: string[];
        quotes: {
            verse: string;
            source: string;
        };
        musicUrl: string;
        giftOptions: Array<{
            bankName: string;
            accountNumber: string;
            accountHolder: string;
            logo: string;
        }>;
        shippingAddress: {
            recipient: string;
            address: string;
        };
    };
    guestName?: string;
    isPreview?: boolean; // Flag to disable container styling for dashboard preview
    isMobile?: boolean; // Flag to force mobile layout (single column)
}

// =====================================================
// INTERNAL COMPONENTS
// =====================================================

// Confetti Celebration Component
function ConfettiCelebration() {
    const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; duration: number; color: string }>>([]);

    useEffect(() => {
        const particles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
            duration: 2 + Math.random() * 2,
            color: ['#c9a96e', '#d4af37', '#f4e4c1', '#e8b4b8', '#ffd700'][Math.floor(Math.random() * 5)],
        }));
        setConfetti(particles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confetti.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{ y: -20, x: `${particle.x}vw`, opacity: 1, rotate: 0 }}
                    animate={{
                        y: '110vh',
                        rotate: 360 * 3,
                        opacity: 0,
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        ease: 'easeIn',
                    }}
                    className="absolute w-2 h-2 md:w-3 md:h-3"
                    style={{
                        backgroundColor: particle.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                    }}
                />
            ))}
        </div>
    );
}

// Countdown Timer Component
function CountdownTimer({ weddingDate }: { weddingDate: string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(weddingDate) - +new Date();

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
    }, [weddingDate]);

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

// Hero Section
function HeroSection({ onOpen, guestName, data }: { onOpen: () => void; guestName?: string; data: BasicThemeProps['data'] }) {
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
                <div className="absolute inset-0 opacity-5">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
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

                    {/* Couple Names */}
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--color-primary-dark)] mb-3 leading-tight">
                        {data.groom.name} <span className="text-[var(--color-primary)]">&</span> {data.bride.name}
                    </h1>
                </motion.div>

                {/* Couple Photo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                        <div className="absolute inset-0 rounded-[3rem] border-2 border-[var(--color-primary)] p-3 animate-pulse-slow rotate-3">
                            <div className="absolute inset-0 rounded-[2.5rem] border border-[var(--color-primary-light)] m-2 -rotate-3" />
                        </div>
                        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                            <Image
                                src="/images/couple/hero-couple.png"
                                alt={`${data.groom.name} & ${data.bride.name}`}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Invitation Text */}
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
                    {data.events[0]?.date || "Sabtu, 15 Februari 2025"}
                </motion.p>

                {/* Countdown Timer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="mb-8"
                >
                    <CountdownTimer weddingDate={data.weddingDate} />
                </motion.div>

                {/* Open Invitation Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpen}
                    className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
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
function QuoteSection({ quotes }: { quotes: BasicThemeProps['data']['quotes'] }) {
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
                    &ldquo;{quotes.verse}&rdquo;
                </p>
                <p className="text-sm md:text-base text-[var(--color-primary-dark)] font-medium">
                    — {quotes.source}
                </p>
            </motion.div>
        </section>
    );
}

// Couple Section
function CoupleSection({ groom, bride }: { groom: BasicThemeProps['data']['groom']; bride: BasicThemeProps['data']['bride'] }) {
    return (
        <section id="couple" className="section scroll-mt-20 bg-gradient-to-b from-white via-[var(--color-cream)] to-white">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Bismillahirrahmanirrahim</p>
                <h2 className="section-title">Mempelai</h2>
                <div className="ornament" />
            </motion.div>

            <div className="mt-12 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Groom */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)]/20 to-transparent rounded-3xl transform rotate-3 scale-105" />

                        <div className="relative glass rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                            <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-[2.5rem] border-2 border-[var(--color-primary)] animate-pulse-slow rotate-6" />
                                <div className="absolute inset-2 rounded-[2.2rem] border border-[var(--color-primary-light)] opacity-50 -rotate-3" />
                                <div className="absolute inset-4 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                                    <Image
                                        src={groom.photo}
                                        alt={groom.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--color-primary-dark)] mb-3 text-center leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {groom.fullName}
                            </h3>

                            <div className="flex items-center justify-center gap-2 mb-3">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
                                <Heart className="w-4 h-4 text-[var(--color-primary)] fill-current" />
                                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
                            </div>

                            <p className="text-sm md:text-base text-[var(--color-text-light)] text-center mb-2 font-light">
                                Putra dari
                            </p>
                            <p className="text-sm md:text-base text-[var(--color-text)] text-center leading-relaxed">
                                {groom.parentName}
                            </p>
                        </div>
                    </motion.div>

                    {/* Bride */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl from-[var(--color-rose-light)]/20 to-transparent rounded-3xl transform -rotate-3 scale-105" />

                        <div className="relative glass rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                            <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-[2.5rem] border-2 border-[var(--color-primary)] animate-pulse-slow -rotate-6" />
                                <div className="absolute inset-2 rounded-[2.2rem] border border-[var(--color-primary-light)] opacity-50 rotate-3" />
                                <div className="absolute inset-4 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                                    <Image
                                        src={bride.photo}
                                        alt={bride.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--color-primary-dark)] mb-3 text-center leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {bride.fullName}
                            </h3>

                            <div className="flex items-center justify-center gap-2 mb-3">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
                                <Heart className="w-4 h-4 text-[var(--color-primary)] fill-current" />
                                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
                            </div>

                            <p className="text-sm md:text-base text-[var(--color-text-light)] text-center mb-2 font-light">
                                Putri dari
                            </p>
                            <p className="text-sm md:text-base text-[var(--color-text)] text-center leading-relaxed">
                                {bride.parentName}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Heart Connector */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-2xl border-4 border-white">
                        <Heart className="w-10 h-10 text-white fill-current animate-pulse" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Event Section
function EventSection({ events }: { events: BasicThemeProps['data']['events'] }) {
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
                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="glass rounded-2xl p-6 shadow-lg"
                    >
                        <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-primary-dark)] text-center mb-4 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
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

// Love Story Section
function LoveStorySection({ loveStory }: { loveStory: BasicThemeProps['data']['loveStory'] }) {
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
                    {loveStory.map((story, index) => {
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
function GallerySection({ gallery }: { gallery: string[] }) {
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
                {gallery.map((photo, index) => (
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
function GiftSection({ giftOptions, shippingAddress }: { giftOptions: BasicThemeProps['data']['giftOptions']; shippingAddress: BasicThemeProps['data']['shippingAddress'] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAddress, setCopiedAddress] = useState(false);

    const handleCopy = (accountNumber: string, index: number) => {
        navigator.clipboard.writeText(accountNumber);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(shippingAddress.address);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % giftOptions.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? giftOptions.length - 1 : prev - 1
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

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-sm md:text-base text-[var(--color-text-light)] max-w-xl mx-auto mt-4 mb-8"
            >
                Doa restu Anda adalah hadiah terindah bagi kami. Namun jika memberi adalah ungkapan kasih, Anda dapat mengirimkan melalui:
            </motion.p>

            {/* Bank Account Carousel */}
            <div className="max-w-md mx-auto mb-12">
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="glass rounded-2xl p-6 shadow-lg"
                        >
                            <div className="text-center mb-4">
                                <span className="text-4xl mb-2 block">{giftOptions[currentSlide].logo}</span>
                                <h3 className="font-serif text-xl md:text-2xl text-[var(--color-primary-dark)] font-semibold">
                                    {giftOptions[currentSlide].bankName}
                                </h3>
                            </div>

                            <div className="bg-white/50 rounded-xl p-4 mb-3">
                                <p className="text-xs md:text-sm text-[var(--color-text-light)] mb-1">
                                    Nomor Rekening
                                </p>
                                <p className="text-lg md:text-xl font-mono font-bold text-[var(--color-primary-dark)]">
                                    {giftOptions[currentSlide].accountNumber}
                                </p>
                                <p className="text-sm md:text-base text-[var(--color-text)] mt-1">
                                    a.n. {giftOptions[currentSlide].accountHolder}
                                </p>
                            </div>

                            <button
                                onClick={() => handleCopy(giftOptions[currentSlide].accountNumber, currentSlide)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-primary)] text-white text-sm md:text-base font-medium hover:bg-[var(--color-primary-dark)] transition-all"
                            >
                                {copiedIndex === currentSlide ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Tersalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Salin Nomor Rekening
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {giftOptions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                    ? "bg-[var(--color-primary)] w-6"
                                    : "bg-[var(--color-primary)]/30"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-md mx-auto"
            >
                <div className="glass rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Gift className="w-5 h-5 text-[var(--color-primary)]" />
                        <h3 className="font-serif text-lg md:text-xl text-[var(--color-primary-dark)] font-semibold">
                            Kirim Hadiah
                        </h3>
                    </div>

                    <div className="bg-white/50 rounded-xl p-4 mb-3">
                        <p className="text-xs md:text-sm text-[var(--color-text-light)] mb-1">
                            Alamat Pengiriman
                        </p>
                        <p className="text-sm md:text-base text-[var(--color-text)] font-medium mb-1">
                            {shippingAddress.recipient}
                        </p>
                        <p className="text-xs md:text-sm text-[var(--color-text)] leading-relaxed">
                            {shippingAddress.address}
                        </p>
                    </div>

                    <button
                        onClick={handleCopyAddress}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] text-sm md:text-base font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all"
                    >
                        {copiedAddress ? (
                            <>
                                <Check className="w-4 h-4" />
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Implement Server Action
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("RSVP Submitted:", formData);
        setIsSubmitting(false);

        // Reset form
        setFormData({ name: "", attendance: "", message: "" });
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="max-w-md mx-auto mt-8 glass rounded-2xl p-6 md:p-8 shadow-lg"
            >
                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                        />
                    </div>

                    <div>
                        <select
                            value={formData.attendance}
                            onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                        >
                            <option value="">Konfirmasi Kehadiran</option>
                            <option value="hadir">Hadir</option>
                            <option value="tidak">Tidak Hadir</option>
                            <option value="ragu">Masih Ragu</option>
                        </select>
                    </div>

                    <div>
                        <textarea
                            placeholder="Ucapan & Doa (Opsional)"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm md:text-base font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                    </button>
                </div>
            </motion.form>
        </section>
    );
}

// Guestbook Section
function GuestBookSection() {
    // TODO: Fetch from database
    const guestMessages = [
        {
            name: "Sarah & Ahmad",
            message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
            time: "2 jam yang lalu",
        },
        {
            name: "Keluarga Besar Wijaya",
            message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair. Selamat!",
            time: "5 jam yang lalu",
        },
    ];

    return (
        <section className="section bg-[var(--color-rose-light)]">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p className="section-subtitle">Wishes & Prayers</p>
                <h2 className="section-title">Buku Tamu</h2>
                <div className="ornament" />
            </motion.div>

            <div className="max-w-2xl mx-auto mt-8 space-y-4">
                {guestMessages.map((guest, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="glass rounded-2xl p-5 shadow-lg"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-[var(--color-primary-dark)]">
                                        {guest.name}
                                    </h4>
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                        {guest.time}
                                    </span>
                                </div>
                                <p className="text-sm md:text-base text-[var(--color-text)] leading-relaxed">
                                    {guest.message}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// Footer Section
function FooterSection({ data }: { data: BasicThemeProps['data'] }) {
    return (
        <footer className="section bg-gradient-to-b from-white to-[var(--color-cream)] text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <Heart className="w-8 h-8 mx-auto text-[var(--color-primary)] fill-current mb-4" />
                <p className="font-serif text-xl md:text-2xl text-[var(--color-primary-dark)] mb-2">
                    Terima Kasih
                </p>
                <p className="text-sm md:text-base text-[var(--color-text-light)] mb-6">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                </p>
                <div className="ornament-dot text-[var(--color-primary)]">
                    <Heart className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-6">
                    {data.groom.name} & {data.bride.name}
                </p>
            </motion.div>
        </footer>
    );
}

// =====================================================
// MAIN THEME COMPONENT
// =====================================================

export function BasicTheme({ data, guestName, isPreview = false, isMobile = false }: BasicThemeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [activeSection, setActiveSection] = useState("couple");

    const handleOpen = () => {
        setIsOpen(true);
        setIsMusicPlaying(true);
        setShowConfetti(true);
        setShowWelcome(true);

        setTimeout(() => setShowConfetti(false), 4000);
        setTimeout(() => setShowWelcome(false), 3500);
    };

    const toggleMusic = () => {
        setIsMusicPlaying(!isMusicPlaying);
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
        <div className={`min-h-screen ${isPreview ? "preview-wrapper" : ""}`} style={{ background: "linear-gradient(to bottom, #faf8f5, #f5e6e6)" }}>
            {isPreview && (
                <style>{`
                    /* Base Preview Styles (Positioning) - Applies to both Mobile & Desktop Preview */
                    .preview-wrapper { position: relative !important; overflow-x: hidden !important; min-height: 100% !important; }
                    
                    /* 1. Generic Fixed Elements Override (Safety Net) */
                    .preview-wrapper .fixed { position: absolute !important; }

                    /* 2. Welcome Modal - Sticky Full Screen */
                    .preview-wrapper .fixed.inset-0.z-40 { position: sticky !important; top: 0 !important; height: 100vh !important; z-index: 50 !important; }
                    
                    /* 3. Music Toggle (Button) - Absolute Top (Scrolls away) / Fixes "Sticky Love Overlap" */
                    .preview-wrapper button.fixed { position: absolute !important; top: 1.5rem !important; right: 1.5rem !important; z-index: 30 !important; }

                    /* 4. Bottom Navigation (Nav) - Restore for BOTH Mobile & Desktop */
                    /* Sticky Bottom: Mimics app-bar behavior inside the scrollable container */
                    .preview-wrapper nav.fixed { position: sticky !important; bottom: 0 !important; z-index: 40 !important; width: 100% !important; }

                    /* 5. Mobile Layout Enforcer (CRITICAL) */
                    /* Force hide desktop-only elements that Tailwind exposes because the browser window is wide */
                    ${isMobile ? `
                        /* Hide the "Heart Connector" (lg:flex) and Timeline Line (md:block) which are overlapping text in mobile view */
                        .preview-wrapper .lg\\:flex { display: none !important; }
                        .preview-wrapper .md\\:block { display: none !important; }
                        
                        /* Force single column layout */
                        .preview-wrapper .md\\:flex-row { flex-direction: column !important; }
                        .preview-wrapper .md\\:flex-row-reverse { flex-direction: column !important; }
                        .preview-wrapper .md\\:text-right { text-align: left !important; }
                        .preview-wrapper .md\\:text-left { text-align: left !important; }
                    ` : ''}
                    
                    /* Welcome Modal Sizing for Preview */
                    .preview-wrapper .fixed.inset-0.z-40 .glass {
                         width: 90% !important;
                         max-width: ${isMobile ? "none" : "32rem"} !important; /* Limit width on desktop preview */
                         padding: 1.5rem !important;
                         margin: 0 !important;
                    }
                    .preview-wrapper .fixed.inset-0.z-40 .glass h2 { font-size: 1.5rem !important; }

                    /* Mobile Layout Forces - ONLY applies if isMobile is true */
                    /* GENERAL GRID & SPACING */
                    .mobile-force .grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                    .mobile-force h1 { font-size: 2.5rem !important; line-height: 1.2 !important; margin-bottom: 0.5rem !important; }
                    .mobile-force h3 { font-size: 1.75rem !important; line-height: 1.2 !important; }
                    .mobile-force .section { padding: 2rem 1rem !important; }
                    .mobile-force .glass { padding: 1.5rem !important; }
                    .mobile-force .w-56, .mobile-force .h-56, .mobile-force .md\\:w-64, .mobile-force .md\\:h-64 { width: 10rem !important; height: 10rem !important; margin: 0 auto 1.5rem auto !important; }
                    
                    /* LOVE STORY TIMELINE FIXES */
                    /* Force flex direction to row (default) instead of reverse stuff from desktop */
                    .mobile-force .md\\:flex-row { flex-direction: row !important; }
                    .mobile-force .md\\:flex-row-reverse { flex-direction: row !important; }
                    
                    /* Reset text alignment to left */
                    .mobile-force .md\\:text-right { text-align: left !important; }
                    .mobile-force .md\\:text-left { text-align: left !important; }
                    
                    /* Reset justify content */
                    .mobile-force .md\\:justify-end { justify-content: flex-start !important; }
                    .mobile-force .md\\:justify-start { justify-content: flex-start !important; }

                    /* Hide desktop-only elements (Timeline center line & dots, Spacers) */
                    /* Targeting the center line */
                    .mobile-force .absolute.left-1\\/2.hidden.md\\:block { display: none !important; }
                    /* Targeting the dots */
                    .mobile-force .hidden.md\\:flex.absolute { display: none !important; }
                    /* Targeting the spacers */
                    .mobile-force .hidden.md\\:block.flex-1 { display: none !important; }
                    
                    /* Show mobile-only elements (Icons) */
                    .mobile-force .md\\:hidden { display: flex !important; }
                `}</style>
            )}
            <div className={`${isPreview ? "preview-mode" : "invitation-container"} ${isMobile ? "mobile-force" : ""}`}>
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <HeroSection key="hero" onOpen={handleOpen} guestName={guestName} data={data} />
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="content-with-nav"
                        >
                            <QuoteSection quotes={data.quotes} />
                            <CoupleSection groom={data.groom} bride={data.bride} />
                            <EventSection events={data.events} />
                            <LoveStorySection loveStory={data.loveStory} />
                            <GallerySection gallery={data.gallery} />
                            <GiftSection giftOptions={data.giftOptions} shippingAddress={data.shippingAddress} />
                            <RSVPSection />
                            <GuestBookSection />
                            <FooterSection data={data} />
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

            {showConfetti && <ConfettiCelebration />}

            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="glass rounded-3xl p-8 md:p-12 shadow-2xl max-w-md mx-4 text-center border-2 border-[var(--color-primary)]/30"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="mb-4"
                            >
                                <Heart className="w-16 h-16 mx-auto text-[var(--color-primary)] fill-current" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-serif text-2xl md:text-3xl text-[var(--color-primary-dark)] mb-2"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Selamat Datang!
                            </motion.h2>
                            {guestName && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg md:text-xl text-[var(--color-primary)] font-medium mb-3"
                                >
                                    {guestName}
                                </motion.p>
                            )}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm md:text-base text-[var(--color-text-light)]"
                            >
                                Terima kasih telah menjadi bagian dari hari istimewa kami
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
