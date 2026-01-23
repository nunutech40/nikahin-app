import React from "react";
import { getSystemSettings } from "@/app/actions/admin";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
    const initialSettings = await getSystemSettings();

    return (
        <div className="space-y-10 max-w-5xl">
            {/* Header */}
            <div>
                <h2 className="text-4xl font-black text-slate-900 font-serif tracking-tight">Pengaturan Sistem</h2>
                <p className="text-slate-400 mt-2 font-medium">Konfigurasi global platform Nikahin.</p>
            </div>

            <SettingsClient initialSettings={initialSettings} />
        </div>
    );
}
