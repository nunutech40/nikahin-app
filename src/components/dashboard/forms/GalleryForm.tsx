'use client';

import { Image as ImageIcon, Plus } from 'lucide-react';
import Image from 'next/image';
import { z } from 'zod';
import ImageUpload from '../ImageUpload';

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
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Galeri Foto</h3>
                        <p className="text-xs text-slate-400">Maksimal 10 foto momen terbaik Anda</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{gallery.length}/10 Foto</span>
                </div>
            </div>

            {/* Visual Summary Grid (Premium Look) */}
            {gallery.some(url => url !== "") && (
                <div className="grid grid-cols-5 gap-3 p-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    {Array.from({ length: 10 }).map((_, i) => {
                        const url = gallery[i];
                        return (
                            <div key={i} className="aspect-square rounded-xl bg-white border border-slate-100 overflow-hidden relative group shadow-sm">
                                {url ? (
                                    <Image
                                        src={url}
                                        alt="Preview"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="absolute top-1 left-1 w-4 h-4 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                                    {i + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="grid gap-6">
                {gallery.map((url, index) => (
                    <div key={index} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ImageUpload
                            label={`Foto Galeri ${index + 1}`}
                            currentImageUrl={url}
                            onUploadSuccess={(newUrl) => handleChange(index, newUrl)}
                            onRemove={() => handleRemove(index)}
                        />
                    </div>
                ))}
            </div>

            {gallery.length < 10 && (
                <button
                    onClick={handleAdd}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-widest"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Tambah Slot Foto
                </button>
            )}
        </div>
    );
}
