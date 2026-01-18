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
- `basic_info`, `countdown`, `google_maps`, `guestbook`, `rsvp_basic`, `single_event`, `cover_image` (**Core/Bronze**)
- `love_story`, `gallery_10`, `background_music`, `quotes`, `unlimited_events` (**Silver**)
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
| `whatsapp_blast` | Kirim massal via WA | ❌ Planned | No |
| `custom_domain` | Domain kustom user | ❌ Infrastructure| No |
| `video_background` | Latar belakang video | ✅ Supported| Yes |
| `live_streaming` | Integrasi Zoom/YouTube | ✅ Supported| Yes |

---

## 4. Security & Data Integrity

### 4.1 Server-side Sanitization
Setiap kali user menyimpan data via `saveInvitation`, server melakukan cek silang:
1. Mengambil daftar fitur yang diijinkan berdasarkan paket user.
2. Menghapus data di objek JSON jika user mencoba mengirim field premium tanpa ijin paket (e.g. menghapus `loveStory` jika paket user Bronze).

### 4.2 ownership Validation
Validasi kepemilikan undangan dilakukan di tingkat database mengacu pada `userId` di session, mencegah modifikasi antar user.

---

## 5. Development Guidelines (Iteration 8+)

### 5.1 Menambahkan Fitur Baru
1. Daftarkan kode di `src/types/invitation.ts` (FeatureCode).
2. Daftarkan metadata di `src/lib/features.ts`.
3. Tambahkan logic di `src/lib/features.ts -> canUseFeature`.
4. Bungkus komponen UI di dashboard dengan `<FeatureGate />`.
5. Update server action sanitization di `src/app/actions/invitation.ts`.

---

**Nikahin App Technical Documentation**
*Update Terakhir: 18 Januari 2026 - Iterasi 7: Granular Feature Gating.*
