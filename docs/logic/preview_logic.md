# Logic Preview & Input Data

This document defines the strict logic for User Input restrictions and Preview rendering behavior based on the user's package level.

## 1. User Demo (Ghost/Trial User)
*   **Package Slug**: `demo`
*   **Input Capabilities**:
    *   Restricted to **Basic** & **Silver** features only.
    *   **Allowed**: Couple Info, Event Info, Gallery (Limited), Quotes, Music, Cover Image.
    *   **Blocked**: Gift Registry, Custom Theme (Fonts/Colors).
*   **Preview Behavior**:
    *   **Mode**: **FULL PLATINUM EXPERIENCE**.
    *   **Logic**: User inputs are merged with `DEMO_DATA`.
    *   **Mechanism**:
        *   If user has input data (e.g., Couple Name), show User Data.
        *   If feature is locked (e.g., Gift Registry), show `DEMO_DATA` (e.g., 'Bank BCA - Demo Account').
    *   **Goal**: To make the user desire the full premium features ("Ngiler").

## 2. User Silver (Authorized Customer)
*   **Package Slug**: `silver`
*   **Input Capabilities**:
    *   Restricted to **Silver** features.
    *   **Allowed**: Couple, Event, Gallery, Quotes, Music.
    *   **Blocked**: Gift Registry, Custom Theme.
*   **Preview Behavior**:
    *   **Mode**: **PURE SILVER (REALISTIC)**.
    *   **Logic**: Strictly displays what the user has input.
    *   **Strict Rule**:
        *   **NO** `DEMO_DATA` merging.
        *   **NO** Gift Registry section (even if data exists in DB, it must be hidden).
        *   **NO** Custom Colors (must use default).
    *   **Goal**: Honest representation of what they paid for.

## 3. User Gold / Platinum (Authorized Customer)
*   **Package Slug**: `gold` / `platinum`
*   **Input Capabilities**:
    *   **Full Access** (Gold/Platinum features).
    *   **Allowed**: All of the above + Gift Registry, Custom Theme, Unlimited Gallery, etc.
*   **Preview Behavior**:
    *   **Mode**: **PURE GOLD/PLATINUM**.
    *   **Logic**: Strictly displays what the user has input.
    *   **Strict Rule**:
        *   **NO** `DEMO_DATA` merging.
        *   Shows full content because they have access to populate it.
    *   **Goal**: Full functional preview of their final product.

---

## Technical Implementation Checklist
- [ ] **DashboardClient**: Ensure `previewData` construction adheres to these rules.
- [ ] **FeatureGating**: Ensure `canUseFeature` checks authoritative package limits, not just JSON data.
- [ ] **Renderer (BasicTheme)**: Ensure every section has a `canUseFeature` guard.
- [ ] **Server Data**: Ensure dashboard loads authoritative `features` list from the `package` table, overriding any stale `features` array in `content` JSON.
