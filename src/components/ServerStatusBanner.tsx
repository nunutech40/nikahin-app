"use client";

import { AlertTriangle, Database, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

interface ServerStatusBannerProps {
    error?: Error | null;
    type?: "database" | "network" | "server";
}

export default function ServerStatusBanner({ error, type = "database" }: ServerStatusBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!error || !isVisible) return null;

    const getErrorDetails = () => {
        const errorMessage = error.message || error.toString();

        // Sanitize error message - hide IP addresses and ports
        const sanitizedMessage = errorMessage
            .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+/g, '[SERVER_ADDRESS]')
            .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[SERVER_IP]');

        // Database connection errors
        if (errorMessage.includes("ETIMEDOUT") || errorMessage.includes("timeout")) {
            return {
                icon: <WifiOff className="w-6 h-6" />,
                title: "Database Connection Timeout",
                message: "Tidak bisa terhubung ke database server",
                details: sanitizedMessage,
                suggestions: [
                    "Cek apakah server database sudah running",
                    "Verifikasi konfigurasi database di .env.local",
                    "Pastikan tidak ada firewall yang blocking koneksi",
                    "Cek saldo hosting masih aktif (jika menggunakan cloud hosting)"
                ],
                color: "red"
            };
        }

        if (errorMessage.includes("ECONNREFUSED")) {
            return {
                icon: <Database className="w-6 h-6" />,
                title: "Database Connection Refused",
                message: "Database server menolak koneksi",
                details: sanitizedMessage,
                suggestions: [
                    "Pastikan PostgreSQL service sudah running",
                    "Cek credentials (username/password) di .env.local",
                    "Verifikasi database name sudah benar"
                ],
                color: "red"
            };
        }

        if (errorMessage.includes("ENOTFOUND")) {
            return {
                icon: <Wifi className="w-6 h-6" />,
                title: "Database Host Not Found",
                message: "Hostname database tidak ditemukan",
                details: sanitizedMessage,
                suggestions: [
                    "Cek DB_HOST di .env.local",
                    "Pastikan DNS resolution berfungsi",
                    "Coba gunakan IP address langsung"
                ],
                color: "orange"
            };
        }

        // Generic error
        return {
            icon: <AlertTriangle className="w-6 h-6" />,
            title: "Server Error",
            message: "Terjadi kesalahan pada server",
            details: sanitizedMessage,
            suggestions: [
                "Cek terminal untuk error log lengkap",
                "Restart dev server (Ctrl+C, lalu pnpm dev)",
                "Verifikasi semua environment variables"
            ],
            color: "yellow"
        };
    };

    const errorInfo = getErrorDetails();

    const colorClasses = {
        red: {
            bg: "bg-red-50 dark:bg-red-950/20",
            border: "border-red-200 dark:border-red-800",
            text: "text-red-900 dark:text-red-100",
            icon: "text-red-600 dark:text-red-400",
            badge: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
        },
        orange: {
            bg: "bg-orange-50 dark:bg-orange-950/20",
            border: "border-orange-200 dark:border-orange-800",
            text: "text-orange-900 dark:text-orange-100",
            icon: "text-orange-600 dark:text-orange-400",
            badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200"
        },
        yellow: {
            bg: "bg-yellow-50 dark:bg-yellow-950/20",
            border: "border-yellow-200 dark:border-yellow-800",
            text: "text-yellow-900 dark:text-yellow-100",
            icon: "text-yellow-600 dark:text-yellow-400",
            badge: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
        }
    };

    const colors = colorClasses[errorInfo.color as keyof typeof colorClasses];

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${colors.bg} border-b ${colors.border} shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${colors.icon}`}>
                        {errorInfo.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-lg font-semibold ${colors.text}`}>
                                {errorInfo.title}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.badge}`}>
                                {type.toUpperCase()}
                            </span>
                        </div>

                        <p className={`text-sm ${colors.text} mb-2`}>
                            {errorInfo.message}
                        </p>

                        {/* Error Details (Collapsible) */}
                        <details className="mb-3">
                            <summary className={`text-xs ${colors.text} cursor-pointer hover:underline`}>
                                Lihat detail error
                            </summary>
                            <pre className={`mt-2 text-xs ${colors.text} bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto`}>
                                {errorInfo.details}
                            </pre>
                        </details>

                        {/* Suggestions */}
                        <div className="space-y-1">
                            <p className={`text-xs font-medium ${colors.text}`}>
                                💡 Saran perbaikan:
                            </p>
                            <ul className={`text-xs ${colors.text} space-y-1 ml-4`}>
                                {errorInfo.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="list-disc">
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className={`flex-shrink-0 ${colors.text} hover:opacity-70 transition-opacity`}
                        aria-label="Close banner"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
