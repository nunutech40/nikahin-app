"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CountdownTimer({ weddingDate }: { weddingDate: string }) {
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
