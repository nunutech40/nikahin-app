'use client';

import { Person } from '@/types/invitation';
import { User, Heart } from 'lucide-react';

interface CoupleInfoFormProps {
    groom: Person;
    bride: Person;
    onChange: (section: 'groom' | 'bride', field: keyof Person, value: string) => void;
    errors?: Record<string, string[] | undefined>;
}

export default function CoupleInfoForm({ groom, bride, onChange, errors }: CoupleInfoFormProps) {
    return (
        <div className="space-y-8">
            {/* Groom Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                    <User className="w-5 h-5" />
                    <h3 className="font-serif text-lg font-semibold">Data Mempelai Pria</h3>
                </div>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                        <input
                            type="text"
                            value={groom.name}
                            onChange={(e) => onChange('groom', 'name', e.target.value)}
                            placeholder="Contoh: Romeo"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['groom.name'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['groom.name'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['groom.name'][0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={groom.fullName}
                            onChange={(e) => onChange('groom', 'fullName', e.target.value)}
                            placeholder="Contoh: Romeo Montague, S.Kom"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['groom.fullName'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['groom.fullName'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['groom.fullName'][0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua</label>
                        <input
                            type="text"
                            value={groom.parentName}
                            onChange={(e) => onChange('groom', 'parentName', e.target.value)}
                            placeholder="Putra dari Bpk... & Ibu..."
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['groom.parentName'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['groom.parentName'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['groom.parentName'][0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profile (URL)</label>
                        <input
                            type="text"
                            value={groom.photo}
                            onChange={(e) => onChange('groom', 'photo', e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['groom.photo'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['groom.photo'] ? (
                            <p className="text-xs text-red-500 mt-1">{errors['groom.photo'][0]}</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">*Sementara gunakan URL gambar</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bride Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                    <Heart className="w-5 h-5" />
                    <h3 className="font-serif text-lg font-semibold">Data Mempelai Wanita</h3>
                </div>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan</label>
                        <input
                            type="text"
                            value={bride.name}
                            onChange={(e) => onChange('bride', 'name', e.target.value)}
                            placeholder="Contoh: Juliet"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['bride.name'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['bride.name'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['bride.name'][0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={bride.fullName}
                            onChange={(e) => onChange('bride', 'fullName', e.target.value)}
                            placeholder="Contoh: Juliet Capulet, S.Ked"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['bride.fullName'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['bride.fullName'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['bride.fullName'][0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua</label>
                        <input
                            type="text"
                            value={bride.parentName}
                            onChange={(e) => onChange('bride', 'parentName', e.target.value)}
                            placeholder="Putri dari Bpk... & Ibu..."
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['bride.parentName'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['bride.parentName'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['bride.parentName'][0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profile (URL)</label>
                        <input
                            type="text"
                            value={bride.photo}
                            onChange={(e) => onChange('bride', 'photo', e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['bride.photo'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['bride.photo'] ? (
                            <p className="text-xs text-red-500 mt-1">{errors['bride.photo'][0]}</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">*Sementara gunakan URL gambar</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
