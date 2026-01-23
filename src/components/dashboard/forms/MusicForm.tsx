"use client";

import React, { useState, useRef } from 'react';
import { Music, AlertCircle, Headphones, Play, Pause, Check } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';
import { getPublicMusicList } from '@/app/actions/admin';
import RoyalBadge from '@/components/ui/RoyalBadge';
import AudioUpload from '../AudioUpload';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface MusicFormProps {
    musicUrl: string;
    onChange: (value: string) => void;
    errorSource: z.ZodError | null;
}

export default function MusicForm({ musicUrl, onChange, errorSource }: MusicFormProps) {
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const [musicLibrary, setMusicLibrary] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const audioInstance = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchMusic = async () => {
            setIsLoading(true);
            const result = await getPublicMusicList();
            if (result.success) {
                setMusicLibrary(result.data || []);
            }
            setIsLoading(false);
        };
        fetchMusic();
    }, []);

    const togglePreview = (url: string) => {
        // 1. Matikan audio yang sedang jalan jika ada
        if (audioInstance.current) {
            audioInstance.current.pause();
            const wasPlayingSame = playingPreview === url;
            audioInstance.current = null;

            if (wasPlayingSame) {
                setPlayingPreview(null);
                return;
            }
        }

        if (!url) return;

        // 2. Buat instance audio baru (Jauh lebih stabil di Mac/Safari)
        try {
            const newAudio = new Audio(url);
            newAudio.preload = "auto";

            audioInstance.current = newAudio;
            setPlayingPreview(url);

            const playPromise = newAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Playback failed:", error);
                    if (error.name === 'NotAllowedError') {
                        toast.error("Klik sekali lagi untuk memutar.");
                    } else if (error.name === 'NotSupportedError') {
                        toast.error("Format audio tidak didukung atau link rusak.");
                    }
                    setPlayingPreview(null);
                });
            }

            newAudio.onended = () => {
                setPlayingPreview(null);
                audioInstance.current = null;
            };

            newAudio.onerror = () => {
                console.error("Audio error event triggered");
                toast.error("File audio bermasalah atau tidak bisa diakses.");
                setPlayingPreview(null);
                audioInstance.current = null;
            };
        } catch (err) {
            console.error("Audio creation failed:", err);
            toast.error("Gagal memutar audio.");
            setPlayingPreview(null);
        }
    };

    // Cleanup saat ganti tab/halaman agar musik berhenti
    useEffect(() => {
        return () => {
            if (audioInstance.current) {
                audioInstance.current.pause();
                audioInstance.current = null;
            }
        };
    }, []);

    const isLibraryTrack = musicLibrary.some(track => track.url === musicUrl);

    return (
        <div className="space-y-8">
            {/* Audio tag dihapus, diganti dynamic object di atas */}

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
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Pilih dari Galeri Pilihan</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">10 Pilihan Utama</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {isLoading ? (
                        <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Memuat Lagu...</p>
                        </div>
                    ) : musicLibrary.map((track) => {
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
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest text-sky-500">{track.category}</p>
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
                    <span className="bg-white px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">atau pakai musik sendiri</span>
                </div>
            </div>

            <div className="space-y-6">
                <AudioUpload
                    onUploadSuccess={(url) => onChange(url)}
                    currentAudioUrl={!isLibraryTrack && musicUrl ? musicUrl : undefined}
                    onRemove={() => onChange('')}
                    label="Unggah File Lagu (MP3)"
                />

                <FormInput
                    label="Music Source URL (Opsional)"
                    value={musicUrl}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://example.com/audio/wedding-song.mp3"
                    error={getZodErrorByPath(errorSource, 'musicUrl')}
                    icon={<Headphones className="w-3.5 h-3.5" />}
                    helperText="Input manual URL MP3 jika tidak melalui upload"
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
