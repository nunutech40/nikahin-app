"use client";

import { motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";

interface MusicToggleProps {
    isPlaying: boolean;
    onToggle: () => void;
}

export function MusicToggle({ isPlaying, onToggle }: MusicToggleProps) {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 }}
            onClick={onToggle}
            className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-primary-light)] bg-white shadow-lg transition-all hover:bg-[var(--color-primary-light)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {isPlaying ? (
                <Music className="h-5 w-5 animate-pulse text-[var(--color-primary)]" />
            ) : (
                <VolumeX className="h-5 w-5 text-[var(--color-text-muted)]" />
            )}
        </motion.button>
    );
}
