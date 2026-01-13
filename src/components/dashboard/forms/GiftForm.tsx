'use client';

import { InvitationData } from '@/types/invitation';
import { Gift, CreditCard, Plus, Trash2, User } from 'lucide-react';
import { z } from 'zod';
import { getZodErrorByPath } from '@/lib/validation';
import FormInput from '../FormInput';

interface GiftFormProps {
    giftOptions: InvitationData['giftOptions'];
    shippingAddress: InvitationData['shippingAddress'];
    onGiftOptionsChange: (newOptions: InvitationData['giftOptions']) => void;
    onAddressChange: (field: keyof NonNullable<InvitationData['shippingAddress']>, value: string) => void;
    errorSource: z.ZodError | null;
}

export default function GiftForm({
    giftOptions = [],
    shippingAddress = { recipient: '', address: '' },
    onGiftOptionsChange,
    onAddressChange,
    errorSource
}: GiftFormProps) {
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

    const handleBankChange = (index: number, field: keyof NonNullable<InvitationData['giftOptions']>[0], value: string) => {
        const newOptions = [...giftOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };
        onGiftOptionsChange(newOptions);
    };

    return (
        <div className="space-y-12">
            {/* Bank Accounts Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Rekening Bank / e-Wallet</h3>
                        <p className="text-xs text-slate-400">Tujuan transfer untuk kado digital dari tamu</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {giftOptions.map((option, index) => (
                        <div key={index} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm relative group animate-in slide-in-from-right-2 duration-200">
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
                                <div className="grid grid-cols-[1fr_100px] gap-4">
                                    <FormInput
                                        label="Nama Bank / E-Wallet"
                                        value={option.bankName}
                                        onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                                        placeholder="Contoh: BCA / GoPay"
                                        error={getZodErrorByPath(errorSource, `giftOptions.${index}.bankName`)}
                                        required
                                    />
                                    <FormInput
                                        label="Logo"
                                        value={option.logo}
                                        onChange={(e) => handleBankChange(index, 'logo', e.target.value)}
                                        placeholder="🏦"
                                        className="text-center"
                                    />
                                </div>

                                <FormInput
                                    label="Nomor Rekening / HP"
                                    value={option.accountNumber}
                                    onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                                    placeholder="Masukkan angka saja"
                                    error={getZodErrorByPath(errorSource, `giftOptions.${index}.accountNumber`)}
                                    required
                                />

                                <FormInput
                                    label="Nama Pemilik Rekening"
                                    value={option.accountHolder}
                                    onChange={(e) => handleBankChange(index, 'accountHolder', e.target.value)}
                                    placeholder="Sesuai buku tabungan"
                                    error={getZodErrorByPath(errorSource, `giftOptions.${index}.accountHolder`)}
                                    icon={<User className="w-3.5 h-3.5" />}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddBank}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Pilihan Hadiah
                </button>
            </div>

            {/* Shipping Address Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <Gift className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Alamat Kirim Kado</h3>
                        <p className="text-xs text-slate-400">Untuk tamu yang ingin mengirimkan kado fisik</p>
                    </div>
                </div>

                <div className="grid gap-5">
                    <FormInput
                        label="Nama Penerima"
                        value={shippingAddress?.recipient}
                        onChange={(e) => onAddressChange('recipient', e.target.value)}
                        placeholder="Contoh: Bapak Ahmad"
                        error={getZodErrorByPath(errorSource, 'shippingAddress.recipient')}
                    />

                    <FormInput
                        label="Alamat Lengkap Pengiriman"
                        value={shippingAddress?.address}
                        onChange={(e) => onAddressChange('address', e.target.value)}
                        placeholder="Tulis alamat selengkap mungkin (No. Rumah, RT/RW, Kec/Kab)"
                        error={getZodErrorByPath(errorSource, 'shippingAddress.address')}
                        isTextArea
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
}
