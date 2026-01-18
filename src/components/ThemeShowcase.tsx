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
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">
                        <Palette className="w-3 h-3" /> Catalog Tema
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Desain Premium untuk <span className="text-[#D4AF37]">Momen Spesial</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Pilih dari koleksi tema eksklusif kami. Ganti tema kapan saja tanpa perlu input ulang data.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeThemes.map((theme, i) => (
                        <div
                            key={theme.id}
                            className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Theme Preview Image */}
                            <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                {theme.previewImage ? (
                                    <img
                                        src={theme.previewImage}
                                        alt={theme.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                        <Palette className="w-12 h-12 text-slate-300" />
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    <a
                                        href={`/rizka-ayu?theme=${theme.slug}`}
                                        target="_blank"
                                        className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Preview Live
                                    </a>
                                </div>

                                {/* Tier Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`
                                        px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg
                                        ${theme.tier === 'platinum' ? 'bg-purple-500 text-white' :
                                            theme.tier === 'gold' ? 'bg-amber-500 text-white' :
                                                'bg-emerald-500 text-white'}
                                    `}>
                                        {theme.tier}
                                    </span>
                                </div>
                            </div>

                            {/* Theme Info */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl text-gray-900">{theme.name}</h3>
                                    {theme.tier === 'platinum' && <Sparkles className="w-5 h-5 text-purple-400" />}
                                    {theme.tier === 'gold' && <Star className="w-5 h-5 text-amber-400 fill-current" />}
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-2">{theme.description || "Desain elegan untuk pernikahan impian Anda."}</p>

                                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(j => (
                                            <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?u=${theme.id}${j}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Sudah dipakai 100+ pasangan</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-500 font-medium mb-6">Punya request tema khusus? Kami bisa buatkan eksklusif untukmu.</p>
                    <a
                        href="https://wa.me/your-number"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                    >
                        <Heart className="w-5 h-5 text-rose-500 fill-current" /> Konsultasi Tema Custom
                    </a>
                </div>
            </div>
        </section>
    );
}
