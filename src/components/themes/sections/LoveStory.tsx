"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { LoveStoryItem, LoveStoryVariant } from "@/types/invitation";

interface LoveStoryProps {
    stories: LoveStoryItem[];
    variant?: LoveStoryVariant;
}

export function LoveStory({ stories, variant = "zig_zag" }: LoveStoryProps) {
    if (!stories || stories.length === 0) return null;

    // VARIANT: Zig Zag (Original from BasicTheme - Alternating Sides)
    if (variant === "zig_zag") {
        return (
            <section id="love-story" className="section bg-gradient-to-b from-[var(--color-cream)] to-white py-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm uppercase tracking-widest text-[var(--color-primary)] mb-2">Our Journey</p>
                    <h2 className="font-serif text-4xl text-[var(--color-primary-dark)]">Kisah Cinta Kami</h2>
                    <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto rounded-full mt-4" />
                </motion.div>

                <div className="relative max-w-3xl mx-auto">
                    {/* Timeline Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary-light)] via-[var(--color-primary)] to-[var(--color-primary-light)] transform -translate-x-1/2 hidden md:block" />

                    {/* Timeline Items */}
                    <div className="space-y-12 md:space-y-16">
                        {stories.map((story, index) => {
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
                                        <div className="glass bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
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

    // VARIANT: Vertical Timeline (Straight down, non-alternating)
    if (variant === "vertical_timeline") {
        return (
            <section id="love-story" className="section py-20 px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl mb-4">Our Love Story</h2>
                </div>
                <div className="max-w-2xl mx-auto space-y-8 relative pl-8 border-l-2 border-[var(--color-primary-light)]">
                    {stories.map((story, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-[var(--color-primary)] border-4 border-white" />

                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-1 block">{story.date}</span>
                            <h3 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">{story.icon} {story.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{story.story}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // VARIANT: Carousel (Horizontal)
    if (variant === "carousel") {
        return (
            <section className="section py-20 px-4 bg-[var(--color-bg-2)]">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl">Timeless Moments</h2>
                </div>
                <div className="flex overflow-x-auto gap-6 pb-8 px-4 snap-x">
                    {stories.map((story, index) => (
                        <div key={index} className="snap-center flex-shrink-0 w-[300px] bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[var(--color-primary)]">
                            <div className="text-4xl mb-4">{story.icon}</div>
                            <h3 className="font-serif text-xl font-bold mb-1">{story.title}</h3>
                            <p className="text-xs text-[var(--color-primary)] font-bold mb-4 uppercase">{story.date}</p>
                            <p className="text-sm text-gray-600">{story.story}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return null;
}
