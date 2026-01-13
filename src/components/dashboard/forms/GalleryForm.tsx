'use client';

import { Image as ImageIcon, Plus, X, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface GalleryFormProps {
    gallery: string[];
    onChange: (newGallery: string[]) => void;
    errors?: Record<string, string[] | undefined>;
}

export default function GalleryForm({ gallery, onChange, errors }: GalleryFormProps) {
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
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                <ImageIcon className="w-5 h-5" />
                <h3 className="font-serif text-lg font-semibold">Galeri Foto</h3>
            </div>

            <div className="grid gap-4">
                {gallery.map((url, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm ${errors?.[`gallery.${index}`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    title="Hapus Foto"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {errors?.[`gallery.${index}`] && (
                                <p className="text-xs text-red-500">{errors[`gallery.${index}`]?.[0]}</p>
                            )}

                            {/* Image Preview */}
                            {url && (
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    <Image
                                        src={url}
                                        alt={`Gallery ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            // Fallback or error handling could be improved
                                            (e.target as any).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAdd}
                className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-primary-light)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/5 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Tambah Foto
            </button>
        </div>
    );
}
