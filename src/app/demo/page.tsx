"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DynamicTheme } from "@/components/themes/DynamicTheme";
import { DEMO_DATA } from "@/data/demoData";
import { getThemeComponent } from "@/lib/themeRegistry";

/**
 * Demo Page / Preview Iframe Handler
 * This page can render any theme with demo data.
 * It's primarily used by the Theme Builder's iframe.
 */
function DemoPageContent() {
    const searchParams = useSearchParams();
    const themeId = searchParams.get("theme") || "basic";

    // 1. Get Theme Component
    const ThemeComponent = getThemeComponent(themeId);

    // 2. If theme not found, fallback to DynamicTheme or a basic message
    if (!ThemeComponent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-500">
                Theme "{themeId}" not found.
            </div>
        );
    }

    // 3. Render Theme with Demo Data
    return (
        <ThemeComponent
            data={DEMO_DATA as any}
            guestName="Tamu Undangan"
            isPreview={true}
        />
    );
}

export default function DemoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-serif italic">Loading Preview...</div>}>
            <DemoPageContent />
        </Suspense>
    );
}
