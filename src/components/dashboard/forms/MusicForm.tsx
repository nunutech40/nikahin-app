'use client';

import { Music, AlertCircle } from 'lucide-react';

interface MusicFormProps {
    musicUrl: string;
    onChange: (value: string) => void;
    errors?: Record<string, string[] | undefined>;
}

export default function MusicForm({ musicUrl, onChange, errors }: MusicFormProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                <Music className="w-5 h-5" />
                <h3 className="font-serif text-lg font-semibold">Musik Latar</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Musik (MP3)</label>
                    <input
                        type="text"
                        value={musicUrl}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://example.com/song.mp3"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['musicUrl'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                    />
                    {errors?.['musicUrl'] && (
                        <p className="text-xs text-red-500 mt-1">{errors['musicUrl'][0]}</p>
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 text-sm text-blue-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>
                        Gunakan direct link file MP3 agar musik dapat diputar otomatis.
                        Link dari YouTube atau Spotify tidak akan berjalan.
                    </p>
                </div>

                {musicUrl && (
                    <div className="pt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview Audio:</p>
                        <audio controls src={musicUrl} className="w-full rounded-lg">
                            Browser Anda tidak mendukung elemen audio.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
}
