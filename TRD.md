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

78: ---
79: 
80: ## 6. Dynamic Theme Engine (Theme Builder) - Iteration 9
81: 
82: Sistem "No-Code Theme Builder" memungkinkan Admin & Seller membuat variasi tema tanpa coding, menggunakan komponen "Lego Blocks" yang sudah disediakan developer.
83: 
84: ### 6.1 Architecture Concept: "Stack of Sections"
85: Tema tidak lagi *hardcoded* sebagai satu file React, melainkan satu komponen renderer (`DynamicTheme.tsx`) yang membaca konfigurasi JSON.
86: 
87: **Prinsip Utama:**
88: 1.  **Vertical Stack:** Komponen disusun secara vertikal (Atas ke Bawah). Tidak ada drag-and-drop posisi pixel (absolute).
89: 2.  **Orderable:** Urutan seksi bisa diubah (e.g., *Quote* di atas *Mempelai*).
90: 3.  **Toggleable:** Seksi bisa dinonaktifkan (Hidden).
91: 4.  **Completeness:** Tema **WAJIB** mengandung konfigurasi untuk seluruh fitur standar (Hero, Couple, Event, Gallery, dll) agar kompatibel dengan semua Paket (Bronze/Silver/Gold).
92: 
93: ### 6.2 Data Structure (`themes.config`)
94: Kolom `config` (JSONB) pada tabel `themes` akan menyimpan definisi tema:
95: 
96: ```json
97: {
98:   "global": {
99:     "fontHeading": "Playfair Display",
100:     "fontBody": "Inter",
101:     "primaryColor": "#D4AF37",
102:     "secondaryColor": "#F3E5AB",
103:     "backgroundColor": "#FFFFFF",
104:     "backgroundImage": "https://assets.nikahin.com/..."
105:   },
106:   "sections": [
107:     { 
108:       "id": "hero", 
109:       "type": "hero_section",
110:       "variant": "fullscreen_center", // Pilihan varian (A/B/C)
111:       "isVisible": true,
112:       "order": 0 
113:     },
114:     { 
115:       "id": "couple", 
116:       "type": "couple_section",
117:       "variant": "card_overlap", 
118:       "isVisible": true,
119:       "order": 1 
120:     }
121:     // ... semua seksi lainnya
122:   ]
123: }
124: ```
125: 
126: ### 6.3 Constraints (Batasan Kontributor)
127: Agar sistem tetap *maintainable* dan valid:
128: *   **No Custom CSS/JS:** Kontributor tidak bisa menyuntikkan kode custom. Hanya memilih opsi yang disediakan.
129: *   **Mandatory Sections:** Editor akan menolak simpan jika seksi krusial (Mempelai, Acara) dihapus.
130: *   **Variant Only:** Layout hanya bisa dipilih dari varian yang sudah dikoding developer (misal: *Gallery Grid* vs *Gallery Masonry*).
131: 
132: ---


**Nikahin App Technical Documentation**
*Update Terakhir: 18 Januari 2026 - Iterasi 7: Granular Feature Gating.*
