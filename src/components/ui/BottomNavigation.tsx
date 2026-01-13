"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Camera, MessageCircle, LucideIcon } from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface BottomNavigationProps {
    activeSection: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: "couple", label: "Mempelai", icon: Users },
    { id: "event", label: "Acara", icon: Calendar },
    { id: "gallery", label: "Galeri", icon: Camera },
    { id: "rsvp", label: "RSVP", icon: MessageCircle },
];

export function BottomNavigation({ activeSection }: BottomNavigationProps) {
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

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-[100] pb-safe"
        >
            {/* Glassmorphism Container */}
            <div className="relative mx-auto max-w-[800px]">
                {/* Background Blur Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-white/80 backdrop-blur-xl" />

                {/* Top Border Gradient */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-30" />

                {/* Navigation Items Container */}
                <div className="relative flex items-center justify-around gap-2 px-4 py-3">
                    {NAV_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="relative flex flex-1 max-w-[100px] flex-col items-center gap-1.5 rounded-2xl px-3 py-2.5 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                {/* Active Background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/30"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Hover Background */}
                                {!isActive && (
                                    <div className="absolute inset-0 rounded-2xl bg-[var(--color-primary)]/0 transition-colors duration-300 hover:bg-[var(--color-primary)]/10" />
                                )}

                                {/* Icon */}
                                <div className="relative z-10">
                                    <Icon
                                        className={`h-5 w-5 transition-all duration-300 ${isActive
                                                ? "text-white drop-shadow-sm"
                                                : "text-[var(--color-primary)]"
                                            }`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>

                                {/* Label */}
                                <span
                                    className={`relative z-10 text-[0.7rem] font-medium transition-all duration-300 ${isActive
                                            ? "text-white font-semibold"
                                            : "text-[var(--color-text-muted)]"
                                        }`}
                                >
                                    {item.label}
                                </span>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 right-1/2 h-1.5 w-1.5 translate-x-1/2 rounded-full bg-white shadow-sm"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Bottom Safe Area Padding */}
                <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
        </motion.nav>
    );
}
