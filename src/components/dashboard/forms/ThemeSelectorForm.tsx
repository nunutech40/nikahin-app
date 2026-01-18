'use client';

import { ThemeMetadata } from '@/lib/themeRegistry';
import { Palette, Check, Lock, ChevronRight, Layout, Sparkles } from 'lucide-react';
import React from 'react';

interface ThemeSelectorFormProps {
    themes: any[];
    currentThemeId: string;
    onThemeChange: (themeId: number) => void;
    userPackageSlug: string;
}

export default function ThemeSelectorForm({
    themes,
    currentThemeId,
    onThemeChange,
    userPackageSlug
}: ThemeSelectorFormProps) {
    // Tier mapping for business logic
    const canAccessTier = (tier: string) => {
        if (userPackageSlug === 'platinum' || userPackageSlug === 'agency' || userPackageSlug === 'admin') return true;
        if (userPackageSlug === 'gold' && (tier === 'gold' || tier === 'free')) return true;
        if (userPackageSlug === 'silver' && (tier === 'free')) return true;
        if (userPackageSlug === 'bronze' && (tier === 'free')) return true;
        if (userPackageSlug === 'demo') return tier === 'free';
        return tier === 'free';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Layout className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Pilih Tema</h3>
                    <p className="text-xs text-slate-400">Pilih desain dasar yang paling Anda sukai</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {themes.map((theme) => {
                    const isSelected = currentThemeId === theme.slug;
                    const isLocked = !canAccessTier(theme.tier);

                    return (
                        <button
                            key={theme.id}
                            disabled={isLocked}
                            onClick={() => onThemeChange(theme.id)}
                            className={`
                                relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                                ${isSelected
                                    ? "border-amber-500 bg-amber-50/30"
                                    : isLocked
                                        ? "border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed"
                                        : "border-slate-100 bg-white hover:border-amber-200"
                                }
                            `}
                        >
                            {/* Theme Thumbnail (Mock) */}
                            <div className="w-20 h-14 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                {theme.previewImage ? (
                                    <img src={theme.previewImage} alt={theme.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Palette className="w-6 h-6" />
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm text-slate-800 truncate">{theme.name}</h4>
                                    {theme.tier !== 'free' && (
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${theme.tier === 'platinum' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {theme.tier}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{theme.description}</p>
                            </div>

                            <div className="flex-shrink-0">
                                {isSelected ? (
                                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white">
                                        <Check className="w-4 h-4" />
                                    </div>
                                ) : isLocked ? (
                                    <Lock className="w-5 h-5 text-slate-300" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {userPackageSlug === 'demo' && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Upgrade paket Anda untuk membuka akses ke tema Premium (Gold & Platinum) yang lebih eksklusif!
                    </p>
                </div>
            )}
        </div>
    );
}
