"use client";

import React from "react";
import { Sparkles, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DemoMarker() {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none overflow-hidden">
            {/* 
        Container is pointer-events-none so users can click THROUGH it 
        to interact with the invitation behind.
      */}

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-[340px] sm:w-[500px]"
            >
                {/* Glass Card - Highly Transparent */}
                <div className="bg-slate-900/40 backdrop-blur-sm rounded-[2.5rem] p-8 sm:p-10 border border-white/20 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">

                    {/* Animated Glow opacity */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-purple-500/10 opacity-50" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-5">

                        {/* Badge */}
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                            <Eye className="w-3 h-3 text-white/90" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/90">
                                Preview Mode
                            </span>
                        </div>

                        {/* Main Text */}
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-md">
                                DEMO<br />
                                <span className="text-amber-400">NIKAHIN</span>
                            </h2>
                            <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
                                Platinum Features Unlocked
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="w-12 h-px bg-white/20" />

                        <p className="text-xs text-white/80 leading-relaxed font-medium">
                            Tampilan ini menggunakan data demo. Buat undangan aslimu sekarang.
                        </p>

                        {/* Button - POINTER EVENTS AUTO so it can be clicked */}
                        <Link
                            href="/register"
                            className="pointer-events-auto bg-white hover:bg-slate-200 text-slate-900 w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 group mt-2"
                        >
                            Buat Gratis
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}
