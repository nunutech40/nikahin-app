'use client';

import { InvitationData } from '@/types/invitation';
import { Gift, CreditCard, MapPin, Plus, Trash2 } from 'lucide-react';

interface GiftFormProps {
    giftOptions: InvitationData['giftOptions'];
    shippingAddress: InvitationData['shippingAddress'];
    onGiftOptionsChange: (newOptions: InvitationData['giftOptions']) => void;
    onAddressChange: (field: keyof InvitationData['shippingAddress'], value: string) => void;
    errors?: Record<string, string[] | undefined>;
}

export default function GiftForm({ giftOptions, shippingAddress, onGiftOptionsChange, onAddressChange, errors }: GiftFormProps) {
    const handleAddBank = () => {
        onGiftOptionsChange([
            ...giftOptions,
            { bankName: '', accountNumber: '', accountHolder: '', logo: '🏦' }
        ]);
    };

    const handleRemoveBank = (index: number) => {
        const newOptions = giftOptions.filter((_, i) => i !== index);
        onGiftOptionsChange(newOptions);
    };

    const handleBankChange = (index: number, field: keyof InvitationData['giftOptions'][0], value: string) => {
        const newOptions = [...giftOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };
        onGiftOptionsChange(newOptions);
    };

    return (
        <div className="space-y-8">
            {/* Bank Accounts Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="font-serif text-lg font-semibold">Rekening Bank</h3>
                </div>

                <div className="space-y-4">
                    {giftOptions.map((option, index) => (
                        <div key={index} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleRemoveBank(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Hapus Bank"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid grid-cols-[1fr_auto] gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                                        <input
                                            type="text"
                                            value={option.bankName}
                                            onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                                            placeholder="BCA"
                                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.[`giftOptions.${index}.bankName`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors?.[`giftOptions.${index}.bankName`] && (
                                            <p className="text-xs text-red-500 mt-1">{errors[`giftOptions.${index}.bankName`]?.[0]}</p>
                                        )}
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo/Emoji</label>
                                        <input
                                            type="text"
                                            value={option.logo}
                                            onChange={(e) => handleBankChange(index, 'logo', e.target.value)}
                                            placeholder="🏦"
                                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-center ${errors?.[`giftOptions.${index}.logo`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
                                    <input
                                        type="text"
                                        value={option.accountNumber}
                                        onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                                        placeholder="1234567890"
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all font-mono ${errors?.[`giftOptions.${index}.accountNumber`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors?.[`giftOptions.${index}.accountNumber`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`giftOptions.${index}.accountNumber`]?.[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                                    <input
                                        type="text"
                                        value={option.accountHolder}
                                        onChange={(e) => handleBankChange(index, 'accountHolder', e.target.value)}
                                        placeholder="Amanda Manopo"
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.[`giftOptions.${index}.accountHolder`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors?.[`giftOptions.${index}.accountHolder`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`giftOptions.${index}.accountHolder`]?.[0]}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddBank}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-primary-light)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/5 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Bank
                </button>
            </div>

            {/* Shipping Address Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--color-primary-dark)] border-b pb-2">
                    <Gift className="w-5 h-5" />
                    <h3 className="font-serif text-lg font-semibold">Alamat Kirim Hadiah</h3>
                </div>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
                        <input
                            type="text"
                            value={shippingAddress.recipient}
                            onChange={(e) => onAddressChange('recipient', e.target.value)}
                            placeholder="Contoh: Bapak Ahmad"
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all ${errors?.['shippingAddress.recipient'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['shippingAddress.recipient'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['shippingAddress.recipient']?.[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                        <textarea
                            value={shippingAddress.address}
                            onChange={(e) => onAddressChange('address', e.target.value)}
                            placeholder="Jl. Mawar No. 123..."
                            rows={3}
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all resize-none ${errors?.['shippingAddress.address'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors?.['shippingAddress.address'] && (
                            <p className="text-xs text-red-500 mt-1">{errors['shippingAddress.address']?.[0]}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
