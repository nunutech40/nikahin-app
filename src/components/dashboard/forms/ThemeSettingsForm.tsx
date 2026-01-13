'use client';

import { ThemeConfig } from '@/types/invitation';
import { Palette, Type, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ThemeSettingsFormProps {
    themeConfig: ThemeConfig;
    coverImage: string;
    onConfigChange: (field: keyof ThemeConfig, value: string) => void;
    onCoverChange: (value: string) => void;
    errors?: Record<string, string[] | undefined>;
}

const FONT_OPTIONS_HEADING = [
    { value: 'Playfair Display', label: 'Playfair Display (Serif, Elegant)' },
    { value: 'Great Vibes', label: 'Great Vibes (Cursive, Romantic)' },
    { value: 'Cinzel', label: 'Cinzel (Serif, Classic)' },
    { value: 'Montserrat', label: 'Montserrat (Sans, Modern)' },
];

const FONT_OPTIONS_BODY = [
    { value: 'Inter', label: 'Inter (Clean, Modern)' },
    { value: 'Lato', label: 'Lato (Friendly, Round)' },
    { value: 'Open Sans', label: 'Open Sans (Neutral, Readable)' },
    { value: 'Merriweather', label: 'Merriweather (Serif, Traditional)' },
];

export default function ThemeSettingsForm({ themeConfig, coverImage, onConfigChange, onCoverChange, errors }: ThemeSettingsFormProps) {
    return (
        <div className="space-y-8">
            {/* Color Palette Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                    <Palette className="w-5 h-5" />
                    <h3 className="font-serif text-lg font-semibold">Warna Tema</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warna Utama (Primary)</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={themeConfig.primaryColor}
                                onChange={(e) => onConfigChange('primaryColor', e.target.value)}
                                className="h-10 w-12 rounded cursor-pointer border border-gray-300 p-1"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={themeConfig.primaryColor}
                                    onChange={(e) => onConfigChange('primaryColor', e.target.value)}
                                    placeholder="#000000"
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all uppercase ${errors?.['themeConfig.primaryColor'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors?.['themeConfig.primaryColor'] && (
                                    <p className="text-xs text-red-500 mt-1">{errors['themeConfig.primaryColor'][0]}</p>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Digunakan untuk tombol utama, judul, dan aksen penting.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warna Pendukung (Secondary)</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={themeConfig.secondaryColor}
                                onChange={(e) => onConfigChange('secondaryColor', e.target.value)}
                                className="h-10 w-12 rounded cursor-pointer border border-gray-300 p-1"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={themeConfig.secondaryColor}
                                    onChange={(e) => onConfigChange('secondaryColor', e.target.value)}
                                    placeholder="#000000"
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all uppercase ${errors?.['themeConfig.secondaryColor'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors?.['themeConfig.secondaryColor'] && (
                                    <p className="text-xs text-red-500 mt-1">{errors['themeConfig.secondaryColor'][0]}</p>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Digunakan untuk latar belakang elemen, border, atau dekorasi.</p>
                    </div>
                </div>
            </div>

            {/* Typography Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                    <Type className="w-5 h-5" />
                    <h3 className="font-serif text-lg font-semibold">Tipografi / Font</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Font Judul (Heading)</label>
                        <select
                            value={themeConfig.fontHeading}
                            onChange={(e) => onConfigChange('fontHeading', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all bg-white"
                        >
                            {FONT_OPTIONS_HEADING.map(font => (
                                <option key={font.value} value={font.value}>{font.label}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: themeConfig.fontHeading }}>Preview: The Wedding of Romeo & Juliet</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Font Isi (Body)</label>
                        <select
                            value={themeConfig.fontBody}
                            onChange={(e) => onConfigChange('fontBody', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all bg-white"
                        >
                            {FONT_OPTIONS_BODY.map(font => (
                                <option key={font.value} value={font.value}>{font.label}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: themeConfig.fontBody }}>Preview: Kami mengundang Anda untuk hadir...</p>
                    </div>
                </div>
            </div>

            {/* Cover Image Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                    <ImageIcon className="w-5 h-5" />
                    <h3 className="font-serif text-lg font-semibold">Sampul Undangan</h3>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto Sampul Utama</label>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={coverImage}
                                onChange={(e) => onCoverChange(e.target.value)}
                                placeholder="https://example.com/cover-photo.jpg"
                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['coverImage'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {errors?.['coverImage'] && (
                                <p className="text-xs text-red-500 mt-1">{errors['coverImage'][0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 text-sm text-blue-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>
                            Foto ini akan muncul di halaman pembuka (Sampul Depan) undangan.
                            Jika dikosongkan, sistem akan menggunakan foto dari galeri atau foto mempelai.
                        </p>
                    </div>

                    {coverImage && (
                        <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={coverImage}
                                alt="Cover Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
