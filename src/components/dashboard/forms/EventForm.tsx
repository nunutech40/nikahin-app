'use client';

import { Event } from '@/types/invitation';
import { Calendar, MapPin, Clock, Plus, Trash2, Lock } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';

interface EventFormProps {
    events: Event[];
    onChange: (index: number, field: keyof Event, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    errorSource: z.ZodError | null;
    canAddMore: boolean;
}

export default function EventForm({ events, onChange, onAdd, onRemove, errorSource, canAddMore }: EventFormProps) {
    return (
        <div className="space-y-6">
            {events.map((event, index) => (
                <div key={index} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onRemove(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Hapus Acara"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4 border-b border-slate-50 pb-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <h3 className="font-semibold text-slate-800">Acara {index + 1}</h3>
                    </div>

                    <div className="space-y-4">
                        <FormInput
                            label="Nama Acara"
                            value={event.name}
                            onChange={(e) => onChange(index, 'name', e.target.value)}
                            placeholder="Contoh: Akad Nikah"
                            error={getZodErrorByPath(errorSource, `events.${index}.name`)}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Tanggal"
                                value={event.date}
                                onChange={(e) => onChange(index, 'date', e.target.value)}
                                placeholder="Sabtu, 15 Februari 2025"
                                error={getZodErrorByPath(errorSource, `events.${index}.date`)}
                                required
                            />
                            <FormInput
                                label="Waktu"
                                value={event.time}
                                onChange={(e) => onChange(index, 'time', e.target.value)}
                                placeholder="08:00 WIB"
                                error={getZodErrorByPath(errorSource, `events.${index}.time`)}
                                icon={<Clock className="w-3.5 h-3.5" />}
                                required
                            />
                        </div>

                        <FormInput
                            label="Lokasi (Nama Tempat)"
                            value={event.location}
                            onChange={(e) => onChange(index, 'location', e.target.value)}
                            placeholder="Contoh: Masjid Agung Al-Azhar"
                            error={getZodErrorByPath(errorSource, `events.${index}.location`)}
                            icon={<MapPin className="w-3.5 h-3.5" />}
                            required
                        />

                        <FormInput
                            label="Alamat Lengkap"
                            value={event.address}
                            onChange={(e) => onChange(index, 'address', e.target.value)}
                            placeholder="Jl. Sisingamangaraja No.8..."
                            error={getZodErrorByPath(errorSource, `events.${index}.address`)}
                            isTextArea
                            rows={2}
                            required
                        />

                        <FormInput
                            label="Link Google Maps"
                            value={event.mapsLink}
                            onChange={(e) => onChange(index, 'mapsLink', e.target.value)}
                            placeholder="https://maps.google.com/..."
                            error={getZodErrorByPath(errorSource, `events.${index}.mapsLink`)}
                            helperText="Masukkan link 'Share' dari Google Maps"
                        />
                    </div>
                </div>
            ))}

            {canAddMore && (
                <button
                    onClick={onAdd}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Tambah Rangkaian Acara
                </button>
            )}

            {!canAddMore && events.length < 2 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="font-medium">Upgrade paket Professional untuk menambahkan lebih dari satu acara.</p>
                </div>
            )}
        </div>
    );
}
