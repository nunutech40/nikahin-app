'use client';

import { Quotes } from '@/types/invitation';
import { Quote } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';

interface QuotesFormProps {
    quotes: Quotes;
    onChange: (field: keyof Quotes, value: string) => void;
    errorSource: z.ZodError | null;
}

export default function QuotesForm({ quotes, onChange, errorSource }: QuotesFormProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <Quote className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Kutipan & Doa</h3>
                    <p className="text-xs text-slate-400">Ayat suci atau doa restu untuk pernikahan Anda</p>
                </div>
            </div>

            <div className="space-y-5">
                <FormInput
                    label="Isi Kutipan / Ayat"
                    value={quotes.verse}
                    onChange={(e) => onChange('verse', e.target.value)}
                    placeholder="Contoh: Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan..."
                    error={getZodErrorByPath(errorSource, 'quotes.verse')}
                    isTextArea
                    rows={5}
                    required
                />

                <FormInput
                    label="Sumber Kutipan (Opsional)"
                    value={quotes.source}
                    onChange={(e) => onChange('source', e.target.value)}
                    placeholder="Contoh: QS. Ar-Rum: 21"
                    error={getZodErrorByPath(errorSource, 'quotes.source')}
                    required
                />
            </div>
        </div>
    );
}
