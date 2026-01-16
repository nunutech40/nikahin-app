"use client";

import React from "react";
import { Download } from "lucide-react";

interface ExportRSVPButtonProps {
    data: any[];
}

export default function ExportRSVPButton({ data }: ExportRSVPButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) return;

        // 1. Define headers
        const headers = ["Nama", "Kehadiran", "Pesan", "Tanggal", "Invitation Slug"];

        // 2. Map data to rows
        const rows = data.map(item => [
            item.name,
            item.attendance,
            `"${(item.message || "").replace(/"/g, '""')}"`, // Escape quotes for CSV
            new Date(item.createdAt).toLocaleString("id-ID"),
            item.invitation?.slug || ""
        ]);

        // 3. Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // 4. Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `RSVP_Nikahin_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
        >
            <Download className="w-4 h-4" /> Export CSV
        </button>
    );
}
