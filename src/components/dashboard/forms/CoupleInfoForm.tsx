'use client';

import { Person } from '@/types/invitation';
import { User, Heart, Camera } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';

interface CoupleInfoFormProps {
    groom: Person;
    bride: Person;
    onChange: (section: 'groom' | 'bride', field: keyof Person, value: string) => void;
    errorSource: z.ZodError | null;
}

export default function CoupleInfoForm({ groom, bride, onChange, errorSource }: CoupleInfoFormProps) {
    return (
        <div className="space-y-12">
            {/* Groom Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Mempelai Pria</h3>
                        <p className="text-xs text-slate-400">Informasi lengkap calon mempelai pria</p>
                    </div>
                </div>

                <div className="grid gap-5">
                    <FormInput
                        label="Nama Panggilan"
                        value={groom.name}
                        onChange={(e) => onChange('groom', 'name', e.target.value)}
                        placeholder="Contoh: Romeo"
                        error={getZodErrorByPath(errorSource, 'groom.name')}
                        maxLength={50}
                        required
                    />

                    <FormInput
                        label="Nama Lengkap"
                        value={groom.fullName}
                        onChange={(e) => onChange('groom', 'fullName', e.target.value)}
                        placeholder="Contoh: Romeo Montague, S.Kom"
                        error={getZodErrorByPath(errorSource, 'groom.fullName')}
                        maxLength={150}
                        required
                    />

                    <FormInput
                        label="Nama Orang Tua"
                        value={groom.parentName}
                        onChange={(e) => onChange('groom', 'parentName', e.target.value)}
                        placeholder="Putra dari Bpk... & Ibu..."
                        error={getZodErrorByPath(errorSource, 'groom.parentName')}
                        maxLength={200}
                        required
                    />

                    <FormInput
                        label="Foto Profile (URL)"
                        value={groom.photo}
                        onChange={(e) => onChange('groom', 'photo', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        error={getZodErrorByPath(errorSource, 'groom.photo')}
                        icon={<Camera className="w-3.5 h-3.5" />}
                        helperText="Gunakan URL gambar publik (Imgur, Cloudinary, dll)"
                    />
                </div>
            </div>

            {/* Bride Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                        <Heart className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Mempelai Wanita</h3>
                        <p className="text-xs text-slate-400">Informasi lengkap calon mempelai wanita</p>
                    </div>
                </div>

                <div className="grid gap-5">
                    <FormInput
                        label="Nama Panggilan"
                        value={bride.name}
                        onChange={(e) => onChange('bride', 'name', e.target.value)}
                        placeholder="Contoh: Juliet"
                        error={getZodErrorByPath(errorSource, 'bride.name')}
                        maxLength={50}
                        required
                    />

                    <FormInput
                        label="Nama Lengkap"
                        value={bride.fullName}
                        onChange={(e) => onChange('bride', 'fullName', e.target.value)}
                        placeholder="Contoh: Juliet Capulet, S.Ked"
                        error={getZodErrorByPath(errorSource, 'bride.fullName')}
                        maxLength={150}
                        required
                    />

                    <FormInput
                        label="Nama Orang Tua"
                        value={bride.parentName}
                        onChange={(e) => onChange('bride', 'parentName', e.target.value)}
                        placeholder="Putri dari Bpk... & Ibu..."
                        error={getZodErrorByPath(errorSource, 'bride.parentName')}
                        maxLength={200}
                        required
                    />

                    <FormInput
                        label="Foto Profile (URL)"
                        value={bride.photo}
                        onChange={(e) => onChange('bride', 'photo', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        error={getZodErrorByPath(errorSource, 'bride.photo')}
                        icon={<Camera className="w-3.5 h-3.5" />}
                        helperText="Gunakan URL gambar publik (Imgur, Cloudinary, dll)"
                    />
                </div>
            </div>
        </div>
    );
}
