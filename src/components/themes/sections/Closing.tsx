"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { InvitationData, ClosingVariant } from "@/types/invitation";
import { canUseFeature } from "@/lib/features";

interface ClosingProps {
    data: InvitationData;
    variant?: ClosingVariant;
}

export function Closing({ data, variant = "simple_centered" }: ClosingProps) {

    // VARIANT: Simple Centered (Original from BasicTheme)
    if (variant === "simple_centered") {
        return (
            <footer className="section bg-gradient-to-b from-white to-[var(--color-cream)] text-center py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Heart className="w-8 h-8 mx-auto text-[var(--color-primary)] fill-current mb-4" />
                    <p className="font-serif text-xl md:text-2xl text-[var(--color-primary-dark)] mb-2">
                        Terima Kasih
                    </p>
                    <p className="text-sm md:text-base text-[var(--color-text-light)] mb-6 max-w-lg mx-auto">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                    </p>
                    <div className="flex justify-center mb-6 text-[var(--color-primary)] opacity-50">
                        ❧
                    </div>
                    <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-6 font-serif italic">
                        {data.groom.name} & {data.bride.name}
                    </p>
                </motion.div>

                {/* Footer Branding */}
                {!canUseFeature(data, 'remove_branding') && (
                    <div className="py-8 mt-12 border-t border-[var(--color-primary-light)]/20">
                        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mb-1">
                            Create your own wedding invitation at
                        </p>
                        <a
                            href="https://nikahin.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-slate-900 hover:text-[var(--color-primary)] transition-colors"
                        >
                            NIKAHIN.APP
                        </a>
                    </div>
                )}
            </footer>
        );
    }

    // VARIANT: Full Image (Background Image)
    if (variant === "full_image") {
        return (
            <footer className="relative h-[50vh] flex items-center justify-center text-center text-white">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    {/* Placeholder for actual image if available in data, or use primary color as fallback */}
                    <div className="absolute inset-0 bg-[var(--color-primary-dark)] opacity-90" />
                    {data.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={data.coverImage} alt="Closing" className="w-full h-full object-cover mix-blend-overlay opacity-50" />
                    )}
                </div>

                <div className="relative z-10 p-8 max-w-2xl">
                    <p className="font-serif text-3xl md:text-5xl mb-6">Thank You</p>
                    <p className="text-lg opacity-90 mb-8">We can't wait to see you!</p>
                    <h3 className="font-serif text-2xl">{data.groom.name} & {data.bride.name}</h3>
                </div>

                {!canUseFeature(data, 'remove_branding') && (
                    <div className="absolute bottom-4 left-0 right-0 text-center opacity-70">
                        <a href="https://nikahin.app" className="text-[10px] uppercase tracking-widest hover:underline">Powered by Nikahin.App</a>
                    </div>
                )}
            </footer>
        );
    }

    return null;
}
