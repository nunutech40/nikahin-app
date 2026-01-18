"use client";

import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { importGuests } from "@/app/actions/guests";

interface ImportExcelButtonProps {
    invitationId: number;
}

export default function ImportExcelButton({ invitationId }: ImportExcelButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];

                // Map Excel columns to our schema
                // Try to find columns like "Nama", "Phone", "Kategori", "Pax"
                const guestList = json.map(row => ({
                    name: row.Nama || row.name || row.Name || row["Full Name"],
                    phone: row.Telepon || row.phone || row.WhatsApp || row.HP || row["No HP"],
                    category: row.Kategori || row.category || row.Group || "Umum",
                    pax: row.Pax || row.pax || row.Jumlah || 1
                })).filter(g => g.name); // Filter out empty rows

                if (guestList.length === 0) {
                    toast.error("Format Excel tidak sesuai atau data kosong.");
                    setIsImporting(false);
                    return;
                }

                const result = await importGuests(invitationId, guestList);
                if (result.success) {
                    toast.success(`Berhasil mengimport ${result.count} tamu!`);
                    // Refresh current page
                    window.location.reload();
                } else {
                    toast.error(result.error);
                }
            } catch (err) {
                console.error(err);
                toast.error("Gagal membaca file Excel.");
            } finally {
                setIsImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 px-6 py-3 bg-[#1A1612] text-white rounded-2xl font-black text-sm hover:bg-[#B48C5E] transition-all disabled:opacity-50"
            >
                {isImporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <FileSpreadsheet className="w-4 h-4" />
                )}
                IMPORT EXCEL
            </button>
        </>
    );
}
