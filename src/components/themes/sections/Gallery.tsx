"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GalleryVariant } from "@/types/invitation";

interface GalleryProps {
    gallery: string[];
    variant?: GalleryVariant;
}

export function Gallery({ gallery, variant = "masonry_grid" }: GalleryProps) {
    if (!gallery || gallery.length === 0) return null;

    // VARIANT: Masonry Grid (Original from BasicTheme - Bento Style)
    if (variant === "masonry_grid") {
        return (
            <section id="gallery" className="section scroll-mt-20 py-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm uppercase text-[var(--color-primary)] mb-2">Our Moments</p>
                    <h2 className="font-serif text-4xl text-[var(--color-primary-dark)]">Galeri Foto</h2>
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

    // VARIANT: Standard Grid (Uniform 3-column)
    if (variant === "standard_grid") {
        return (
            <section id="gallery" className="section py-20 px-4 bg-[var(--color-bg-2)]">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl mb-4">Gallery</h2>
                    <div className="w-16 h-1 bg-[var(--color-primary)] mx-auto" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 max-w-4xl mx-auto">
                    {gallery.map((photo, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="relative aspect-[4/5] rounded-xl overflow-hidden"
                        >
                            <Image
                                src={photo}
                                alt={`Gallery ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </section>
        );
    }

    // VARIANT: Carousel Slider (Horizontal Scroll)
    if (variant === "carousel_slider") {
        return (
            <section id="gallery" className="section py-20 overflow-hidden">
                <div className="text-center mb-8 px-4">
                    <h2 className="font-serif text-4xl">Sweet Memories</h2>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-8 pb-8 no-scrollbar">
                    {gallery.map((photo, index) => (
                        <div
                            key={index}
                            className="snap-center flex-shrink-0 w-[80vw] md:w-[400px] h-[50vh] md:h-[600px] relative rounded-2xl overflow-hidden shadow-xl"
                        >
                            <Image
                                src={photo}
                                alt={`Gallery ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return null;
}
