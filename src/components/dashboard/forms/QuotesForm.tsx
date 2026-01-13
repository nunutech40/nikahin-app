'use client';

import { Quotes } from '@/types/invitation';
import { Quote } from 'lucide-react';

interface QuotesFormProps {
    quotes: Quotes;
    onChange: (field: keyof Quotes, value: string) => void;
}

export default function QuotesForm({ quotes, onChange }: QuotesFormProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                <Quote className="w-5 h-5" />
                <h3 className="font-serif text-lg font-semibold">Kutipan & Doa</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Isi Kutipan / Ayat</label>
                    <textarea
                        value={quotes.verse}
                        onChange={(e) => onChange('verse', e.target.value)}
                        placeholder="Dan di antara tanda-tanda kekuasaan-Nya..."
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sumber</label>
                    <input
                        type="text"
                        value={quotes.source}
                        onChange={(e) => onChange('source', e.target.value)}
                        placeholder="QS. Ar-Rum: 21"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
