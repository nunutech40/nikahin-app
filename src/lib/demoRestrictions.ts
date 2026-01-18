/**
 * Helper functions for Demo package restrictions
 * Strategy: Show everything (with beautiful defaults), allow basic personalization, block premium edits
 */

export function isDemoPackage(packageSlug?: string): boolean {
    return packageSlug === "demo";
}

// ===== ALLOWED EDITS (Basic Personalization) =====
export function canEditCoupleInfo(packageSlug?: string): boolean {
    // Demo users CAN edit couple names, parents, etc
    return true; // Always allowed
}

export function canEditEventInfo(packageSlug?: string): boolean {
    // Demo users CAN edit event date, time, location
    return true; // Always allowed
}

export function canChangeCover(packageSlug?: string): boolean {
    // Demo users CAN change cover image
    return true; // Always allowed
}

// ===== BLOCKED EDITS (Premium Features) =====
export function canEditGallery(packageSlug?: string): boolean {
    // Demo users CANNOT edit gallery (use default)
    return !isDemoPackage(packageSlug);
}

export function canEditLoveStory(packageSlug?: string): boolean {
    // Demo users CANNOT edit love story (use default)
    return !isDemoPackage(packageSlug);
}

export function canEditMusic(packageSlug?: string): boolean {
    // Demo users CANNOT change music (use default)
    return !isDemoPackage(packageSlug);
}

export function canEditQuotes(packageSlug?: string): boolean {
    // Demo users CANNOT edit quotes (use default)
    return !isDemoPackage(packageSlug);
}

export function canEditGiftRegistry(packageSlug?: string): boolean {
    // Demo users CANNOT edit gift registry (use default)
    return !isDemoPackage(packageSlug);
}

export function canEditThemeConfig(packageSlug?: string): boolean {
    // Demo users CANNOT edit theme config (use default)
    return !isDemoPackage(packageSlug);
}

// ===== BLOCKED ACTIONS =====
export function canAccessLivePreview(packageSlug?: string): boolean {
    // Demo users cannot access live preview
    return !isDemoPackage(packageSlug);
}

export function canCopyLink(packageSlug?: string): boolean {
    // Demo users cannot copy link
    return !isDemoPackage(packageSlug);
}

export function canShareWhatsApp(packageSlug?: string): boolean {
    // Demo users cannot share to WhatsApp
    return !isDemoPackage(packageSlug);
}

export function canSaveInvitation(packageSlug?: string): boolean {
    // Demo users cannot save (data not persisted)
    return !isDemoPackage(packageSlug);
}

export function canPublishInvitation(packageSlug?: string, isActive?: boolean): boolean {
    // Demo users cannot publish
    if (isDemoPackage(packageSlug)) return false;

    // Paid packages need to be active (paid)
    return isActive === true;
}
