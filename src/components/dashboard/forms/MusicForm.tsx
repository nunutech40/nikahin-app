'use client';

import { Music, AlertCircle, Headphones } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';

interface MusicFormProps {
    musicUrl: string;
    onChange: (value: string) => void;
    errorSource: z.ZodError | null;
}

export default function MusicForm({ musicUrl, onChange, errorSource }: MusicFormProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                    <Music className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Musik Latar</h3>
                    <p className="text-xs text-slate-400">Musik yang akan diputar otomatis saat undangan dibuka</p>
                </div>
            </div>

            <div className="space-y-6">
                <FormInput
                    label="URL File Musik (MP3)"
                    value={musicUrl}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://example.com/audio/wedding-song.mp3"
                    error={getZodErrorByPath(errorSource, 'musicUrl')}
                    icon={<Headphones className="w-3.5 h-3.5" />}
                    helperText="Pastikan file berakhiran .mp3 untuk kompatibilitas terbaik"
                />

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 text-xs text-amber-800 leading-relaxed shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold">Tips Musik Latar:</p>
                        <ul className="list-disc list-inside space-y-0.5 opacity-80">
                            <li>Gunakan link langsung ke file (direct link)</li>
                            <li>Link dari YouTube, Spotify, atau Google Drive tidak didukung</li>
                            <li>Maksimal ukuran file disarankan di bawah 5MB agar load cepat</li>
                        </ul>
                    </div>
                </div>

                {musicUrl && !getZodErrorByPath(errorSource, 'musicUrl') && (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in zoom-in-95">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Preview Audio</p>
                        <audio controls src={musicUrl} className="w-full h-10">
                            Browser Anda tidak mendukung preview audio.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
}
