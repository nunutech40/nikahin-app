'use client';

import { LoveStoryItem } from '@/types/invitation';
import { Heart, Calendar, FileText, Plus, Trash2, Smile } from 'lucide-react';

interface LoveStoryFormProps {
    loveStory: LoveStoryItem[];
    onChange: (newLoveStory: LoveStoryItem[]) => void;
    errors?: Record<string, string[] | undefined>;
}

export default function LoveStoryForm({ loveStory, onChange, errors }: LoveStoryFormProps) {
    const handleAdd = () => {
        onChange([
            ...loveStory,
            { title: '', date: '', story: '', icon: '❤️' }
        ]);
    };

    const handleRemove = (index: number) => {
        const newLoveStory = loveStory.filter((_, i) => i !== index);
        onChange(newLoveStory);
    };

    const handleChange = (index: number, field: keyof LoveStoryItem, value: string) => {
        const newLoveStory = [...loveStory];
        newLoveStory[index] = { ...newLoveStory[index], [field]: value };
        onChange(newLoveStory);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                <Heart className="w-5 h-5" />
                <h3 className="font-serif text-lg font-semibold">Kisah Cinta</h3>
            </div>

            <div className="space-y-6">
                {loveStory.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleRemove(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Hapus Cerita"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4">
                            <span className="text-xl bg-[var(--color-primary-light)]/20 w-8 h-8 flex items-center justify-center rounded-full">
                                {item.icon}
                            </span>
                            <h4 className="font-medium">Cerita {index + 1}</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-[1fr_auto] gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Momen</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        placeholder="Pertemuan Pertama"
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.[`loveStory.${index}.title`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors?.[`loveStory.${index}.title`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`loveStory.${index}.title`]?.[0]}</p>
                                    )}
                                </div>
                                <div className="w-24">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                                    <div className="relative">
                                        <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={item.icon}
                                            onChange={(e) => handleChange(index, 'icon', e.target.value)}
                                            placeholder="❤️"
                                            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-center ${errors?.[`loveStory.${index}.icon`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    {errors?.[`loveStory.${index}.icon`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`loveStory.${index}.icon`]?.[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal / Periode</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={item.date}
                                        onChange={(e) => handleChange(index, 'date', e.target.value)}
                                        placeholder="Januari 2020"
                                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.[`loveStory.${index}.date`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors?.[`loveStory.${index}.date`] && (
                                    <p className="text-xs text-red-500 mt-1">{errors[`loveStory.${index}.date`]?.[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cerita Singkat</label>
                                <textarea
                                    value={item.story}
                                    onChange={(e) => handleChange(index, 'story', e.target.value)}
                                    placeholder="Kami bertemu di sebuah kedai kopi..."
                                    rows={3}
                                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all resize-none ${errors?.[`loveStory.${index}.story`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors?.[`loveStory.${index}.story`] && (
                                    <p className="text-xs text-red-500 mt-1">{errors[`loveStory.${index}.story`]?.[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAdd}
                className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-primary-light)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/5 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Tambah Cerita
            </button>
        </div>
    );
}

