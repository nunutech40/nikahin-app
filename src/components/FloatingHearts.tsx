"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export function FloatingHearts() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <Heart
                        key={i}
                        className="absolute text-[#FFE5E5] opacity-20 animate-float"
                        style={{
                            left: `${(i * 17 + Math.random() * 10) % 100}%`, // Slightly more stable randomness
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            width: `${20 + Math.random() * 30}px`,
                            height: `${20 + Math.random() * 30}px`,
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                :global(.animate-float) {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}
