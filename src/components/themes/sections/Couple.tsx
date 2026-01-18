"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles, Instagram } from "lucide-react"; // Added Instagram just in case for future
import { InvitationData, CoupleVariant, Person } from "@/types/invitation";

interface CoupleProps {
    groom: Person;
    bride: Person;
    variant?: CoupleVariant;
}

export function Couple({ groom, bride, variant = "card_grid" }: CoupleProps) {

    // VARIANT: Card Grid (Original Layout from BasicTheme)
    if (variant === "card_grid") {
        return (
            <section id="couple" className="section scroll-mt-20 bg-gradient-to-b from-white via-[var(--color-cream)] to-white py-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm uppercase tracking-widest text-[var(--color-primary)] mb-2">Bismillahirrahmanirrahim</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-primary-dark)] mb-4">Mempelai</h2>
                    <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto rounded-full" />
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

                            <div className="relative glass bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
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

                                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--color-primary-dark)] mb-3 text-center leading-tight">
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

                            <div className="relative glass bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
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

                                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--color-primary-dark)] mb-3 text-center leading-tight">
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
                </div>
            </section>
        );
    }

    // VARIANT: Rounded Split (New - Minimalist side-by-side circles)
    if (variant === "rounded_split") {
        return (
            <section id="couple" className="section py-20 px-4 flex flex-col items-center">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl mb-4">Groom & Bride</h2>
                    <p className="text-[var(--color-text-muted)]">Kami memohon ridho-Nya</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
                    {/* Groom */}
                    <div className="text-center">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[var(--color-primary)] mb-6 mx-auto">
                            <Image src={groom.photo} alt={groom.name} fill className="object-cover" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold mb-2">{groom.name}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] max-w-[200px] mx-auto">{groom.parentName}</p>
                    </div>

                    {/* Ampersand */}
                    <div className="font-serif text-6xl text-[var(--color-primary-light)]">&</div>

                    {/* Bride */}
                    <div className="text-center">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[var(--color-primary)] mb-6 mx-auto">
                            <Image src={bride.photo} alt={bride.name} fill className="object-cover" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold mb-2">{bride.name}</h3>
                        <p className="text-sm text-[var(--color-text-muted)] max-w-[200px] mx-auto">{bride.parentName}</p>
                    </div>
                </div>
            </section>
        );
    }

    // VARIANT: Vertical Timeline (New - Stacked vertical)
    if (variant === "vertical_timeline") {
        return (
            <section id="couple" className="section py-20 px-6 bg-[var(--color-bg-2)]">
                {/* Groom */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-16 max-w-4xl mx-auto">
                    <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
                        <h3 className="font-serif text-4xl mb-2">{groom.fullName}</h3>
                        <p className="text-[var(--color-text-muted)] mb-4">The Groom</p>
                        <p className="text-sm italic">Putra tercinta dari {groom.parentName}</p>
                    </div>
                    <div className="relative w-full md:w-1/2 h-[400px] rounded-none md:rounded-l-full overflow-hidden order-1 md:order-2">
                        <Image src={groom.photo} alt={groom.name} fill className="object-cover" />
                    </div>
                </div>

                {/* Bride */}
                <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
                    <div className="relative w-full md:w-1/2 h-[400px] rounded-none md:rounded-r-full overflow-hidden">
                        <Image src={bride.photo} alt={bride.name} fill className="object-cover" />
                    </div>
                    <div className="w-full md:w-1/2 md:text-left">
                        <h3 className="font-serif text-4xl mb-2">{bride.fullName}</h3>
                        <p className="text-[var(--color-text-muted)] mb-4">The Bride</p>
                        <p className="text-sm italic">Putri tercinta dari {bride.parentName}</p>
                    </div>
                </div>
            </section>
        );
    }

    return null;
}
