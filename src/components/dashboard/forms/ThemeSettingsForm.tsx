'use client';

import { ThemeConfig } from '@/types/invitation';
import { Palette, Type, Image as ImageIcon, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';
import ImageUpload from '../ImageUpload';
import FeatureGate from '../FeatureGate';

interface ThemeSettingsFormProps {
    themeConfig: ThemeConfig;
    coverImage: string;
    onConfigChange: (field: keyof ThemeConfig, value: string) => void;
    onCoverChange: (value: string) => void;
    errorSource: z.ZodError | null;
    canCustomizePalette?: boolean;
    canCustomizeTypography?: boolean;
    canCustomizeCover?: boolean;
}

const FONT_OPTIONS_HEADING = [
    { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
    { value: 'Great Vibes', label: 'Great Vibes (Romantic)' },
    { value: 'Cinzel', label: 'Cinzel (Classic)' },
    { value: 'Montserrat', label: 'Montserrat (Modern)' },
];

const FONT_OPTIONS_BODY = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Lato', label: 'Lato (Round)' },
    { value: 'Open Sans', label: 'Neutral' },
    { value: 'Merriweather', label: 'Traditional' },
];

export default function ThemeSettingsForm({
    themeConfig,
    coverImage,
    onConfigChange,
    onCoverChange,
    errorSource,
    canCustomizePalette = true,
    canCustomizeTypography = true,
    canCustomizeCover = true
}: ThemeSettingsFormProps) {
    return (
        <div className="space-y-12">
            <FeatureGate canUse={canCustomizePalette} featureCode="custom_theme">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Palet Warna</h3>
                            <p className="text-xs text-slate-400">Sesuaikan warna utama undangan Anda</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[13px] font-semibold text-slate-700 block">Warna Utama</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={themeConfig.primaryColor}
                                    onChange={(e) => onConfigChange('primaryColor', e.target.value)}
                                    className="h-11 w-14 rounded-xl cursor-pointer border-2 border-slate-100 p-1 bg-white"
                                />
                                <div className="flex-1">
                                    <FormInput
                                        label=""
                                        value={themeConfig.primaryColor}
                                        onChange={(e) => onConfigChange('primaryColor', e.target.value)}
                                        placeholder="#000000"
                                        error={getZodErrorByPath(errorSource, 'themeConfig.primaryColor')}
                                        className="uppercase font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[13px] font-semibold text-slate-700 block">Warna Sekunder</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={themeConfig.secondaryColor}
                                    onChange={(e) => onConfigChange('secondaryColor', e.target.value)}
                                    className="h-11 w-14 rounded-xl cursor-pointer border-2 border-slate-100 p-1 bg-white"
                                />
                                <div className="flex-1">
                                    <FormInput
                                        label=""
                                        value={themeConfig.secondaryColor}
                                        onChange={(e) => onConfigChange('secondaryColor', e.target.value)}
                                        placeholder="#000000"
                                        error={getZodErrorByPath(errorSource, 'themeConfig.secondaryColor')}
                                        className="uppercase font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FeatureGate>

            <FeatureGate canUse={canCustomizeTypography} featureCode="custom_theme">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <Type className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Tipografi</h3>
                            <p className="text-xs text-slate-400">Pilih kombinasi font yang serasi</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-700 block">Font Judul</label>
                            <select
                                value={themeConfig.fontHeading}
                                onChange={(e) => onConfigChange('fontHeading', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 outline-none transition-all focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 bg-white text-sm"
                            >
                                {FONT_OPTIONS_HEADING.map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </select>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mt-2">
                                <p className="text-xl text-slate-800" style={{ fontFamily: themeConfig.fontHeading }}>
                                    {themeConfig.fontHeading}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-700 block">Font Isi</label>
                            <select
                                value={themeConfig.fontBody}
                                onChange={(e) => onConfigChange('fontBody', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 outline-none transition-all focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 bg-white text-sm"
                            >
                                {FONT_OPTIONS_BODY.map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </select>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mt-2">
                                <p className="text-sm text-slate-600 line-clamp-2" style={{ fontFamily: themeConfig.fontBody }}>
                                    Menghadirkan kebahagiaan sejati dalam momen yang penuh berkah ini. {themeConfig.fontBody}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </FeatureGate>

            <FeatureGate canUse={canCustomizeCover} featureCode="cover_image">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Foto Sampul</h3>
                            <p className="text-xs text-slate-400">Foto utama yang muncul saat tamu membuka link</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ImageUpload
                            label="Foto Sampul (Opening)"
                            currentImageUrl={coverImage}
                            onUploadSuccess={(url) => onCoverChange(url)}
                            onRemove={() => onCoverChange('')}
                        />

                        {coverImage && (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={coverImage}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover animate-in fade-in duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Live Preview Sampul aktif</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </FeatureGate>
        </div>
    );
}
