'use client';

import React from 'react';
import { Palette, ExternalLink, Sparkles, Heart, Star } from 'lucide-react';

interface ThemeShowcaseProps {
    themes: any[];
}

export function ThemeShowcase({ themes }: ThemeShowcaseProps) {
    // Only show active themes
    const activeThemes = themes.filter(t => t.isActive);

    return (
        <section className="py-24 bg-[#FDFBF7] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#B48C5E]/5 border border-[#B48C5E]/20 rounded-full text-[#B48C5E] font-black text-[10px] uppercase tracking-[0.25em] mb-6">
                        <Palette className="w-4 h-4" /> Gallery Collections
                    </div>
                    <h2 className="font-serif text-5xl md:text-7xl font-black text-[#1A1612] mb-6 tracking-tighter">
                        Temukan <span className="text-[#B48C5E]">Karya Seni</span> Undanganmu.
                    </h2>
                    <p className="text-lg text-[#1A1612]/40 max-w-2xl mx-auto font-bold leading-relaxed">
                        Pilih dari koleksi tema eksklusif yang dirancang oleh desainer profesional kami. <br className="hidden md:block" /> Ganti tema kapan saja dalam hitungan detik.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {activeThemes.map((theme, i) => (
                        <div
                            key={theme.id}
                            className="group relative bg-white rounded-[40px] border border-[#B48C5E]/5 overflow-hidden hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4"
                        >
                            {/* Theme Preview Image */}
                            <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                                {theme.previewImage ? (
                                    <img
                                        src={theme.previewImage}
                                        alt={theme.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                        <Palette className="w-12 h-12 text-slate-300" />
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-[#1A1612]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                    <a
                                        href={`/rizka-ayu?theme=${theme.slug}`}
                                        target="_blank"
                                        className="px-10 py-5 bg-[#B48C5E] text-white rounded-full font-black text-[10px] uppercase tracking-widest transform transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl shadow-[#B48C5E]/40"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Preview Live
                                    </a>
                                </div>

                                {/* Tier Badge */}
                                <div className="absolute top-6 left-6">
                                    <span className={`
                                        px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl
                                        ${theme.tier === 'platinum' ? 'bg-[#1A1612] text-white' :
                                            theme.tier === 'gold' ? 'bg-[#B48C5E] text-white' :
                                                'bg-emerald-600 text-white'}
                                    `}>
                                        {theme.tier}
                                    </span>
                                </div>
                            </div>

                            {/* Theme Info */}
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-black text-2xl text-[#1A1612] tracking-tight italic">{theme.name}</h3>
                                    {theme.tier === 'platinum' && <Sparkles className="w-5 h-5 text-indigo-400" />}
                                    {theme.tier === 'gold' && <Star className="w-5 h-5 text-[#B48C5E] fill-current" />}
                                </div>
                                <p className="text-[#121212]/40 text-xs font-bold leading-relaxed line-clamp-2 uppercase tracking-wider">{theme.description || "Desain kontemporer untuk momen sakral Anda."}</p>

                                <div className="mt-8 pt-8 border-t border-[#B48C5E]/5 flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(j => (
                                            <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                                <img src={`https://i.pravatar.cc/100?u=${theme.id}${j}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[9px] text-[#1A1612]/30 font-black uppercase tracking-[0.2em]">100+ Pasangan Bahagia</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <p className="text-[#1A1612]/40 font-bold text-xs uppercase tracking-[0.3em] mb-10">Ingin Desain Khusus Sesuai Konsepmu?</p>
                    <a
                        href="https://wa.me/your-number"
                        target="_blank"
                        className="inline-flex items-center gap-4 px-12 py-6 bg-[#1A1612] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#B48C5E] transition-all shadow-2xl shadow-black/10"
                    >
                        <Heart className="w-5 h-5 text-rose-500 fill-current" /> Konsultasi Tema Eksklusif
                    </a>
                </div>
            </div>
        </section>
    );
}
