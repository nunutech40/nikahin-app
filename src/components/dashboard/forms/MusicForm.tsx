"use client";

import React, { useState } from 'react';
import { Music, AlertCircle, Headphones, Play, Pause, Check } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';
import { MUSIC_LIBRARY } from '@/data/musicLibrary';
import RoyalBadge from '@/components/ui/RoyalBadge';

interface MusicFormProps {
    musicUrl: string;
    onChange: (value: string) => void;
    errorSource: z.ZodError | null;
}

export default function MusicForm({ musicUrl, onChange, errorSource }: MusicFormProps) {
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);

    const togglePreview = (url: string) => {
        const audio = document.getElementById('preview-audio') as HTMLAudioElement;

        if (playingPreview === url) {
            setPlayingPreview(null);
            if (audio) audio.pause();
        } else {
            setPlayingPreview(url);
            if (audio) {
                audio.src = url;
                audio.play().catch(e => console.error("Audio play failed", e));
            }
        }
    };

    return (
        <div className="space-y-8">
            <audio id="preview-audio" className="hidden" onEnded={() => setPlayingPreview(null)} />

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                        <Music className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Musik Latar</h3>
                        <p className="text-xs text-slate-400">Bangun suasana romantis dengan musik pilihan</p>
                    </div>
                </div>
            </div>

            {/* Library Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Pilih dari Galeri</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">Recommended</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {MUSIC_LIBRARY.map((track) => {
                        const isSelected = musicUrl === track.url;
                        const isPlaying = playingPreview === track.url;

                        return (
                            <div
                                key={track.id}
                                className={`
                                    relative p-3 rounded-xl border transition-all duration-300 group
                                    ${isSelected
                                        ? "bg-sky-50 border-sky-200 shadow-sm ring-1 ring-sky-200"
                                        : "bg-white border-slate-100 hover:border-sky-100 hover:shadow-md"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => togglePreview(track.url)}
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0
                                            ${isPlaying
                                                ? "bg-sky-500 text-white shadow-lg shadow-sky-200 scale-110"
                                                : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-sky-500"
                                            }
                                        `}
                                        type="button"
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className={`text-sm font-bold truncate ${isSelected ? "text-sky-900" : "text-slate-700"}`}>
                                                {track.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <p className="text-[10px] font-medium text-slate-400">{track.category}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onChange(track.url)}
                                        className={`
                                            px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0
                                            ${isSelected
                                                ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                                                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                            }
                                        `}
                                        type="button"
                                    >
                                        {isSelected ? "Dipilih" : "Pilih"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-slate-400 font-medium">atau upload sendiri</span>
                </div>
            </div>

            <div className="space-y-4">
                <FormInput
                    label="Custom URL (MP3)"
                    value={musicUrl}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://example.com/audio/wedding-song.mp3"
                    error={getZodErrorByPath(errorSource, 'musicUrl')}
                    icon={<Headphones className="w-3.5 h-3.5" />}
                    helperText="Mendukung direct link file .mp3"
                />

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 text-xs text-amber-800 leading-relaxed shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold">Catatan:</p>
                        <ul className="list-disc list-inside space-y-0.5 opacity-80">
                            <li>Preview musik library menggunakan placeholder.</li>
                            <li>Gunakan link hosting Anda sendiri untuk performa terbaik jika perlu.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
