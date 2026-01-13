'use client';

import { Event } from '@/types/invitation';
import { Calendar, MapPin, Clock, Plus, Trash2 } from 'lucide-react';

interface EventFormProps {
    events: Event[];
    onChange: (index: number, field: keyof Event, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

export default function EventForm({ events, onChange, onAdd, onRemove }: EventFormProps) {
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

                    <div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4">
                        <Calendar className="w-5 h-5" />
                        <h3 className="font-serif text-lg font-semibold">Acara {index + 1}</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Acara</label>
                            <input
                                type="text"
                                value={event.name}
                                onChange={(e) => onChange(index, 'name', e.target.value)}
                                placeholder="Contoh: Akad Nikah"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                <input
                                    type="text"
                                    value={event.date}
                                    onChange={(e) => onChange(index, 'date', e.target.value)}
                                    placeholder="Sabtu, 15 Februari 2025"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={event.time}
                                        onChange={(e) => onChange(index, 'time', e.target.value)}
                                        placeholder="08:00 WIB"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Nama Tempat)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={event.location}
                                    onChange={(e) => onChange(index, 'location', e.target.value)}
                                    placeholder="Contoh: Masjid Agung Al-Azhar"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                            <textarea
                                value={event.address}
                                onChange={(e) => onChange(index, 'address', e.target.value)}
                                placeholder="Jl. Sisingamangaraja No.8..."
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
                            <input
                                type="text"
                                value={event.mapsLink}
                                onChange={(e) => onChange(index, 'mapsLink', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={onAdd}
                className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-primary-light)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/5 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Tambah Acara
            </button>
        </div>
    );
}
