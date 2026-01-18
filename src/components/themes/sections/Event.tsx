"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Event, EventVariant } from "@/types/invitation";

interface EventSectionProps {
    events: Event[];
    variant?: EventVariant;
}

export function EventSection({ events, variant = "vertical_list" }: EventSectionProps) {
    if (!events || events.length === 0) return null;

    // VARIANT: Vertical List (Original from BasicTheme)
    if (variant === "vertical_list") {
        return (
            <section id="event" className="section bg-gradient-to-b from-white to-[var(--color-cream)] scroll-mt-20 py-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <p className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Save The Date</p>
                    <h2 className="font-serif text-4xl text-[var(--color-primary-dark)]">Waktu & Tempat</h2>
                    <div className="ornament text-[var(--color-primary)] opacity-50 text-xl mt-2">❧</div>
                </motion.div>

                <div className="space-y-6 mt-8 max-w-xl mx-auto">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="glass bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-primary-dark)] text-center mb-4 font-bold">
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

    // VARIANT: Card Carousel (Horizontal Scroll for multiple events)
    if (variant === "card_carousel") {
        return (
            <section id="event" className="section py-20 px-4 bg-[var(--color-bg-2)]">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl mb-2">Our Special Day</h2>
                    <p className="text-[var(--color-text-muted)]">Bergabunglah dalam kebahagiaan kami</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-5xl mx-auto overflow-x-auto pb-4">
                    {events.map((event, index) => (
                        <div key={index} className="flex-1 min-w-[280px] bg-white p-8 rounded-[2rem] shadow-xl text-center border-t-8 border-[var(--color-primary)] relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {index + 1}
                            </div>

                            <h3 className="font-serif text-2xl mt-6 mb-4">{event.name}</h3>
                            <p className="font-medium text-[var(--color-primary-dark)] mb-2">{event.date}</p>
                            <p className="text-sm text-[var(--color-text-muted)] mb-6">{event.time}</p>

                            <div className="border-t pt-6">
                                <p className="font-bold mb-1">{event.location}</p>
                                <p className="text-xs text-gray-500 mb-6">{event.address}</p>
                                <a href={event.mapsLink} target="_blank" className="inline-block px-6 py-2 bg-gray-100 rounded-full text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                                    Google Maps
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // VARIANT: Bento Grid (Compact) - Placeholder if not implemented fully, fall back to Vertical
    return (
        <section className="section py-20 px-4">
            <div className="text-center mb-10">
                <h2 className="font-serif text-4xl">Events</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {events.map((event, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                        <h3 className="font-bold text-xl mb-1">{event.name}</h3>
                        <p className="text-sm text-[var(--color-primary)] mb-2">{event.date} @ {event.time}</p>
                        <p className="text-xs text-gray-600">{event.location}</p>
                        <a href={event.mapsLink} className="text-xs underline mt-2 block">Map</a>
                    </div>
                ))}
            </div>
        </section>
    )

    return null;
}
