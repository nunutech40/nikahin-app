# 🏗️ TRD: Technical Requirements Document - Nikahin App (v2)

Dokumen ini adalah spesifikasi teknis yang diperbarui berdasarkan **Iterasi 7: Admin & Feature Matrix**. Dokumen ini berfungsi sebagai panduan implementasi untuk fitur gating dan modularitas aplikasi.

---

## 1. Technical Stack (The "Elite" Stack)

*   **Framework:** Next.js 14+ (App Router)
*   **Database:** PostgreSQL (Remote)
*   **ORM:** Drizzle ORM (Pure TypeScript)
*   **Auth:** NextAuth.js (JWT Strategy)
*   **Styling:** Tailwind CSS + Framer Motion
*   **Gating:** Multi-layered Feature Gating (Server + Client)

---

## 2. Feature Gating Architecture

Sistem menggunakan standardisasi Kode Fitur (Snake Case) untuk sinkronisasi antara Database, Server Actions, dan UI.

### 2.1 Standard Feature Codes
Seluruh fitur direferensikan menggunakan kode unik berikut:
- `basic_info`, `countdown`, `google_maps`, `guestbook`, `rsvp_basic`, `single_event`, `cover_image`, `background_music`, `gallery_10` (**Core/Bronze**)
- `love_story`, `quotes`, `unlimited_events` (**Silver**)
- `gift_registry`, `custom_theme`, `gallery_unlimited`, `remove_branding` (**Gold**)
- `whatsapp_blast`, `custom_domain`, `video_background`, `live_streaming` (**Platinum**)

### 2.2 Core vs Package Features
- **Core Features**: Ditandai `isCore: true` di DB. Otomatis aktif untuk semua user (walaupun tidak terdaftar di paket).
- **Package Features**: Terdaftar di `package_features`. Hanya aktif jika paket user memilikinya.

---

## 3. Implementation Status Matrix

| Feature Code | Description | Status | UI/Theme Support |
| :--- | :--- | :--- | :--- |
| `basic_info` | Informasi dasar & orang tua | ✅ Done | Yes |
| `love_story` | Timeline perjalanan cinta | ✅ Done | Yes |
| `gallery_10` | Gallery (Max 10 foto) | ✅ Done | Yes |
| `gallery_unlimited`| Gallery (Tanpa batas) | ✅ Done | Yes |
| `gift_registry` | Kado digital & Alamat | ✅ Done | Yes |
| `background_music` | Lagu latar & Library | ✅ Done | Yes |
| `custom_theme` | Ganti warna & font | ✅ Done | Yes |
| `rsvp_basic` | Konfirmasi kehadiran | ✅ Done | Yes |
| `quotes` | Ayat suci & doa | ✅ Done | Yes |
| `unlimited_events` | Lebih dari 1 acara | ✅ Done | Yes |
| `remove_branding` | Hapus "Powered by Nikahin" | ✅ Done | Yes |
| `rsvp_export` | Download Data Tamu (Excel) | ✅ Done | Yes |
| `whatsapp_blast` | Kirim massal via WA | ❌ Planned | No |
| `custom_domain` | Domain kustom user | ❌ Infrastructure| No |
| `video_background` | Latar belakang video | ✅ Supported| Yes |
| `live_streaming` | Integrasi Zoom/YouTube | ✅ Supported| Yes |

---

## 4. Frontend Architecture & Decisions

### 4.1 React Portals for Modals
Untuk menghindari masalah stacking context (z-index) pada tampilan mobile atau nested layout, seluruh komponen **Modal/Popup** (seperti `AddGuestModal`) wajib menggunakan **React Portal**.
*   **Target:** `document.body`
*   **Reasoning:** Memastikan modal selalu tampil di layer paling atas (viewport) tanpa terpengaruh `overflow: hidden` dari container induk.

### 4.2 Hydration Strategies
Untuk mengurangi error mismatch pada atribut HTML yang dinamis (misal: class dari extension browser), gunakan `suppressHydrationWarning` pada tag `<html>`.

---

## 5. Security & Data Integrity

### 4.1 Server-side Sanitization
Setiap kali user menyimpan data via `saveInvitation`, server melakukan cek silang:
1. Mengambil daftar fitur yang diijinkan berdasarkan paket user.
2. Menghapus data di objek JSON jika user mencoba mengirim field premium tanpa ijin paket (e.g. menghapus `loveStory` jika paket user Bronze).

### 4.2 ownership Validation
Validasi kepemilikan undangan dilakukan di tingkat database mengacu pada `userId` di session, mencegah modifikasi antar user.

---

### 6. Development Guidelines (Iteration 8+)

### 6.1 Menambahkan Fitur Baru
1. Daftarkan kode di `src/types/invitation.ts` (FeatureCode).
2. Daftarkan metadata di `src/lib/features.ts`.
3. Tambahkan logic di `src/lib/features.ts -> canUseFeature`.
4. Bungkus komponen UI di dashboard dengan `<FeatureGate />`.
5. Update server action sanitization di `src/app/actions/invitation.ts`.

---

## 7. Dynamic Theme Engine (Theme Builder) - Iteration 9

Sistem "No-Code Theme Builder" memungkinkan Admin & Seller membuat variasi tema tanpa coding, menggunakan komponen "Lego Blocks" yang sudah disediakan developer.

### 7.1 Architecture Concept: "Stack of Sections"
Tema tidak lagi *hardcoded* sebagai satu file React, melainkan satu komponen renderer (`DynamicTheme.tsx`) yang membaca konfigurasi JSON.

**Prinsip Utama:**
1.  **Vertical Stack:** Komponen disusun secara vertikal (Atas ke Bawah). Tidak ada drag-and-drop posisi pixel (absolute).
2.  **Orderable:** Urutan seksi bisa diubah (e.g., *Quote* di atas *Mempelai*).
3.  **Toggleable:** Seksi bisa dinonaktifkan (Hidden).
4.  **Completeness:** Tema **WAJIB** mengandung konfigurasi untuk seluruh fitur standar (Hero, Couple, Event, Gallery, dll) agar kompatibel dengan semua Paket (Bronze/Silver/Gold).

### 7.2 Data Structure (`themes.config`)
Kolom `config` (JSONB) pada tabel `themes` akan menyimpan definisi tema:

```json
{
  "global": {
    "fontHeading": "Playfair Display",
    "fontBody": "Inter",
    "primaryColor": "#D4AF37",
    "secondaryColor": "#F3E5AB",
    "backgroundColor": "#FFFFFF",
    "backgroundImage": "https://assets.nikahin.com/..."
  },
  "sections": [
    { 
      "id": "hero", 
      "type": "hero_section",
      "variant": "fullscreen_center", // Pilihan varian (A/B/C)
      "isVisible": true,
      "order": 0 
    },
    { 
      "id": "couple", 
      "type": "couple_section",
      "variant": "card_overlap", 
      "isVisible": true,
      "order": 1 
    }
    // ... semua seksi lainnya
  ]
}
```

### 7.3 Constraints (Batasan Kontributor)
Agar sistem tetap *maintainable* dan valid:
*   **No Custom CSS/JS:** Kontributor tidak bisa menyuntikkan kode custom. Hanya memilih opsi yang disediakan.
*   **Mandatory Sections:** Editor akan menolak simpan jika seksi krusial (Mempelai, Acara) dihapus.
*   **Variant Only:** Layout hanya bisa dipilih dari varian yang sudah dikoding developer (misal: *Gallery Grid* vs *Gallery Masonry*).

---

**Nikahin App Technical Documentation**
*Update Terakhir: 23 Januari 2026 - Iterasi 11/12: Platform Settings & Music Library.*
