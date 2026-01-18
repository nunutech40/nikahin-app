"use client";

import { Heart } from "lucide-react";

export function FloatingHearts() {
    return (
        <>
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <Heart
                        key={i}
                        className="absolute text-[#FFE5E5] opacity-20 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            fontSize: `${20 + Math.random() * 30}px`
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
