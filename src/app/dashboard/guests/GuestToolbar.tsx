"use client";

import React, { useCallback, useTransition } from "react";
import { Search, ArrowUpDown, Download } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import * as XLSX from "xlsx";

export default function GuestToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") || "";
    const currentSort = searchParams.get("sort") || "latest";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = useDebouncedCallback((term: string) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString("search", term)}`);
        });
    }, 300);

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sortValue = e.target.value;
        startTransition(() => {
            router.push(`${pathname}?${createQueryString("sort", sortValue)}`);
        });
    };

    const handleDownloadTemplate = () => {
        const templateData = [
            {
                "Nama": "Bpk. Jokowi & Ibu Iriana",
                "Telepon": "6281234567890",
                "Kategori": "VIP",
                "Jumlah": 2
            },
            {
                "Nama": "Raffi Ahmad",
                "Telepon": "62811223344",
                "Kategori": "Artis",
                "Jumlah": 1
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template Tamu");
        XLSX.writeFile(workbook, "Template_Import_Tamu_Nikahin.xlsx");
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari nama tamu..."
                    defaultValue={currentSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-[#B48C5E] focus:ring-1 focus:ring-[#B48C5E] outline-none transition-all text-sm font-medium shadow-sm"
                />
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[180px] w-full md:w-auto">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                    value={currentSort}
                    onChange={handleSort}
                    className="w-full pl-11 pr-8 py-3 bg-white border border-slate-200 rounded-xl focus:border-[#B48C5E] focus:ring-1 focus:ring-[#B48C5E] outline-none transition-all text-sm font-medium shadow-sm appearance-none"
                >
                    <option value="latest">Terbaru</option>
                    <option value="name_asc">Nama (A-Z)</option>
                    <option value="status_wa">Status WA</option>
                    <option value="category">Kategori</option>
                </select>
                {/* Custom Arrow for select */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Download Template Button - moved here for easy access */}
            <button
                onClick={handleDownloadTemplate}
                className="hidden lg:flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-50 hover:text-[#B48C5E] transition-all shadow-sm whitespace-nowrap"
                title="Download Template Excel"
            >
                <Download className="w-4 h-4" />
                TEMPLATE
            </button>
        </div>
    );
}
