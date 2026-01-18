"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { InvitationData, HeroVariant, ThemeConfig } from "@/types/invitation";

interface HeroProps {
    data: InvitationData;
    guestName?: string;
    variant?: HeroVariant;
    onOpen: () => void;
}

export function Hero({ data, guestName, variant = "fullscreen_center", onOpen }: HeroProps) {
    const coverImage = data.coverImage || "/images/couple/hero-couple.png";

    // RENDER VARIANT: Fullscreen Center (Original)
    if (variant === "fullscreen_center") {
        return (
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-12"
                style={{
                    background: "linear-gradient(135deg, var(--color-bg-1, #FFF) 0%, var(--color-bg-2, #F3E5AB) 50%, var(--color-bg-3, #FFF) 100%)",
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
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
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
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--color-primary-dark)] mb-3 leading-tight font-heading">
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
                                    src={coverImage}
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
                </div>
            </motion.section>
        );
    }

    // RENDER VARIANT: Minimal Split (New)
    if (variant === "minimal_split") {
        return (
            <motion.section
                className="relative min-h-screen flex flex-col lg:flex-row"
            >
                {/* Left Side: Image */}
                <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen">
                    <Image
                        src={coverImage}
                        alt={`${data.groom.name} & ${data.bride.name}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Right Side: Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-[var(--color-bg-1)]">
                    <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[var(--color-text-muted)] mb-4 font-light">
                        The Wedding Of
                    </p>
                    <h1 className="font-serif text-5xl md:text-7xl text-[var(--color-primary-dark)] mb-6 text-center leading-tight">
                        {data.groom.name} <br /> <span className="text-[var(--color-primary)]">&</span> <br /> {data.bride.name}
                    </h1>

                    {guestName && (
                        <div className="mb-8 text-center bg-white p-6 border border-gray-100 shadow-sm rounded-none w-full max-w-sm">
                            <p className="text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">Kepada Yth.</p>
                            <p className="text-xl font-serif text-[var(--color-primary-dark)]">{guestName}</p>
                        </div>
                    )}

                    <button
                        onClick={onOpen}
                        className="px-10 py-4 bg-[var(--color-primary-dark)] text-white uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors"
                    >
                        Buka Undangan
                    </button>

                    <div className="mt-12 scale-75 origin-top">
                        <CountdownTimer weddingDate={data.weddingDate} />
                    </div>
                </div>
            </motion.section>
        );
    }

    // RENDER VARIANT: Card Overlap (New)
    if (variant === "card_overlap") {
        return (
            <motion.section
                className="relative min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-2)]"
            >
                <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden p-8 text-center pt-[320px]">
                    {/* Image sticking out top */}
                    <div className="absolute top-0 left-0 w-full h-[300px]">
                        <Image
                            src={coverImage}
                            alt="Couple"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
                    </div>

                    <div className="relative z-10">
                        <h1 className="font-serif text-4xl text-[var(--color-primary-dark)] mb-2">
                            {data.groom.name} & {data.bride.name}
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mb-6">
                            {data.events[0]?.date}
                        </p>

                        {guestName && (
                            <div className="bg-[var(--color-bg-2)] rounded-2xl p-4 mb-6">
                                <p className="text-xs text-[var(--color-text-muted)]">Kepada Yth.</p>
                                <p className="font-medium text-[var(--color-text)]">{guestName}</p>
                            </div>
                        )}

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onOpen}
                            className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-medium shadow-lg shadow-[var(--color-primary)]/30"
                        >
                            Buka Undangan
                        </motion.button>
                    </div>
                </div>
            </motion.section>
        );
    }

    // Default fallback to fullscreen if variant not found
    return (
        <Hero data={data} guestName={guestName} variant="fullscreen_center" onOpen={onOpen} />
    );
}
