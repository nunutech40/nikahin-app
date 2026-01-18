"use client";

import { motion } from "framer-motion";
import { Heart, Quote } from "lucide-react";
import { Quotes, QuoteVariant } from "@/types/invitation";

interface QuoteSectionProps {
    quotes: Quotes;
    variant?: QuoteVariant;
}

export function QuoteSection({ quotes, variant = "centered_simple" }: QuoteSectionProps) {
    if (!quotes.verse) return null;

    // VARIANT: Centered Simple (Original)
    if (variant === "centered_simple") {
        return (
            <section className="section bg-[var(--color-rose-light)] py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <div className="text-[var(--color-primary)] flex justify-center mb-6">
                        <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <p className="font-serif text-lg md:text-xl italic text-[var(--color-text)] leading-relaxed mb-4">
                        &ldquo;{quotes.verse}&rdquo;
                    </p>
                    <p className="text-sm md:text-base text-[var(--color-primary-dark)] font-medium">
                        — {quotes.source}
                    </p>
                </motion.div>
            </section>
        );
    }

    // VARIANT: Card Backdrop (Card with shadow)
    if (variant === "card_backdrop") {
        return (
            <section className="section py-20 px-6 flex items-center justify-center bg-[var(--color-bg-2)]">
                <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl max-w-3xl text-center relative overflow-hidden">
                    <Quote className="absolute top-4 left-4 w-12 h-12 text-[var(--color-primary-light)] opacity-20 rotate-180" />
                    <Quote className="absolute bottom-4 right-4 w-12 h-12 text-[var(--color-primary-light)] opacity-20" />

                    <h3 className="text-lg md:text-2xl font-serif leading-relaxed text-[var(--color-primary-dark)] italic mb-6">
                        {quotes.verse}
                    </h3>
                    <div className="w-16 h-px bg-[var(--color-primary)] mx-auto mb-4" />
                    <p className="text-sm uppercase tracking-widest text-[var(--color-text-muted)]">
                        {quotes.source}
                    </p>
                </div>
            </section>
        );
    }

    // VARIANT: Floating Text (Transparent)
    if (variant === "floating_text") {
        return (
            <section className="section py-24 px-4 text-center">
                <div className="max-w-xl mx-auto border-y border-[var(--color-primary)] py-8">
                    <p className="font-serif text-xl md:text-2xl leading-loose">
                        {quotes.verse}
                    </p>
                    <p className="mt-4 text-sm font-bold">— {quotes.source}</p>
                </div>
            </section>
        );
    }

    return null;
}
