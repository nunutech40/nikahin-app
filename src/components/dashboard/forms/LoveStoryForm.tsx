'use client';

import { LoveStoryItem } from '@/types/invitation';
import { Heart, Plus, Trash2, Smile, Clock } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';

interface LoveStoryFormProps {
    loveStory: LoveStoryItem[];
    onChange: (newLoveStory: LoveStoryItem[]) => void;
    errorSource: z.ZodError | null;
}

export default function LoveStoryForm({ loveStory, onChange, errorSource }: LoveStoryFormProps) {
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
            <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Heart className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Cerita Cinta</h3>
                    <p className="text-xs text-slate-400">Bagikan momen perjalanan cinta Anda</p>
                </div>
            </div>

            <div className="space-y-6">
                {loveStory.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm relative group animate-in zoom-in-95 duration-200">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleRemove(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Hapus Cerita"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl bg-slate-50 w-10 h-10 flex items-center justify-center rounded-lg border border-slate-100">
                                {item.icon}
                            </span>
                            <h4 className="font-semibold text-slate-700 text-sm">Momen #{index + 1}</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-[1fr_100px] gap-4">
                                <FormInput
                                    label="Judul Momen"
                                    value={item.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    placeholder="Contoh: Pertama Ketemu"
                                    error={getZodErrorByPath(errorSource, `loveStory.${index}.title`)}
                                    required
                                />
                                <FormInput
                                    label="Emoji"
                                    value={item.icon}
                                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                                    placeholder="❤️"
                                    error={getZodErrorByPath(errorSource, `loveStory.${index}.icon`)}
                                    icon={<Smile className="w-3.5 h-3.5" />}
                                    className="text-center"
                                />
                            </div>

                            <FormInput
                                label="Waktu / Tahun"
                                value={item.date}
                                onChange={(e) => handleChange(index, 'date', e.target.value)}
                                placeholder="Contoh: Januari 2020"
                                error={getZodErrorByPath(errorSource, `loveStory.${index}.date`)}
                                icon={<Clock className="w-3.5 h-3.5" />}
                                required
                            />

                            <FormInput
                                label="Cerita Singkat"
                                value={item.story}
                                onChange={(e) => handleChange(index, 'story', e.target.value)}
                                placeholder="Ceritakan bagaimana momen ini terjadi..."
                                error={getZodErrorByPath(errorSource, `loveStory.${index}.story`)}
                                isTextArea
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAdd}
                className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Tambah Momen Cerita
            </button>
        </div>
    );
}
