'use client';

import { Image as ImageIcon, Plus, X, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';

interface GalleryFormProps {
    gallery: string[];
    onChange: (newGallery: string[]) => void;
    errorSource: z.ZodError | null;
}

export default function GalleryForm({ gallery, onChange, errorSource }: GalleryFormProps) {
    const handleAdd = () => {
        onChange([...gallery, '']);
    };

    const handleRemove = (index: number) => {
        const newGallery = gallery.filter((_, i) => i !== index);
        onChange(newGallery);
    };

    const handleChange = (index: number, value: string) => {
        const newGallery = [...gallery];
        newGallery[index] = value;
        onChange(newGallery);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                    <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Galeri Foto</h3>
                    <p className="text-xs text-slate-400">Unggah momen bahagia Anda (Maksimal 10 foto)</p>
                </div>
            </div>

            <div className="grid gap-6">
                {gallery.map((url, index) => (
                    <div key={index} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <FormInput
                                    label={`Link Foto ${index + 1}`}
                                    value={url}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    error={getZodErrorByPath(errorSource, `gallery.${index}`)}
                                    icon={<LinkIcon className="w-3.5 h-3.5" />}
                                />
                            </div>
                            <button
                                onClick={() => handleRemove(index)}
                                className="mt-8 p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                                title="Hapus Foto"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Preview Card */}
                        {url && !getZodErrorByPath(errorSource, `gallery.${index}`) && (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md group">
                                <Image
                                    src={url}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    unoptimized // Useful for external URLs without config
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleAdd}
                className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group"
            >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Tambah Foto Galeri
            </button>
        </div>
    );
}
