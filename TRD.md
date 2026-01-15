# 🏗️ TRD: Technical Requirements Document - Nikahin App

Dokumen ini adalah spesifikasi teknis yang menerjemahkan kebutuhan produk (PRD) ke dalam wilayah implementasi. Dokumen ini berfungsi sebagai **Source of Truth** untuk fitur yang sudah berjalan maupun yang akan dikembangkan.

---

## 1. Technical Stack (The "Elite" Stack)

Sesuai dengan `rekapstack.md`, aplikasi dibangun dengan fokus pada performa, type-safety, dan efisiensi resource:

*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS + Framer Motion (Animations)
*   **ORM:** Drizzle ORM (Lightweight & Type-safe)
*   **Database:** PostgreSQL (Remote with SSH Tunneling on port 5433)
*   **State & Validation:** React Context + Zod
*   **Package Manager:** pnpm (Speed & Disk Efficiency)

---

## 2. System Architecture

Aplikasi menggunakan pola **Theme-based Architecture** untuk memisahkan data dari presentasi.

### 2.1. Controller Logic
`app/[slug]/page.tsx` bertindak sebagai *Thin Controller*.
1. Mengambil data berdasarkan slug URL dari database (saat ini masih Mock Data).
2. Mengekstrak sapaan tamu dari Query Params (`?to=Name`).
3. Menentukan Tema ID dari data invitation.
4. Memanggil `ThemeRegistry` untuk mengambil komponen tema yang sesuai.

### 2.2. Theme Engine & Registry
*   **Theme Registry:** Lokasi pusat pendaftaran tema (`src/lib/themeRegistry.ts`). Setiap tema harus mendaftarkan metadata (id, name, component).
*   **The "Data" Prop:** Seluruh komponen tema wajib menerima prop tunggal bernama `data` dengan tipe `InvitationData`. Hal ini menjamin konsistensi saat user berganti-ganti tema.

---

### 3. Database Infrastructure
- **Provider**: PostgreSQL on Baremetal (IDCloudHost)
- **Database Name**: `nikahin_db_dev` (dedicated)
- **Schema Management**: Drizzle ORM (Pure TypeScript)
- **Connection**: Direct connection via IP `157.10.161.215` for development.
- **Isolation**: Previously planned with PostgreSQL Schema, now using a dedicated database for better security.

---

### 4. Database Schema (Drizzle ORM)
Schema diimplementasikan dengan fitur **Drizzle Relations** untuk query yang optimal.
- `users`: Multi-role (admin, customer, agency).
### 5. Authentication System (NextAuth.js)
- **Framework**: NextAuth.js v4 (App Router compatible).
- **Strategy**: JWT-based session management.
- **Provider**: Credentials Provider (Email & Password).
- **Security**: 
    - Middleware protection for all routes matching `/dashboard/:path*`.
    - Bcrypt password hashing.
    - Server-side user ownership validation (Phase 5.5).
- **Session Data**: Extends base session to include `id` and `role`.

---

### 6. User Experience Flows
#### 6.1. First Invitation Flow
Untuk user baru yang belum memiliki undangan:
1.  **Dashboard Detection**: Server component mengecek jumlah undangan user.
2.  **Empty State**: Jika 0, tampilkan form input `slug`.
3.  **Creation**: Menjalankan action `createInvitation` dengan:
    -   `themeId`: Mengambil basic theme dari DB.
    -   `packageId`: Mengambil paket basic dari DB.
    -   `content`: Menggunakan `MOCK_DATA` sebagai template awal.
4.  **Auto-Load**: Halaman reload dan langsung masuk ke mode editor.

```typescript
// features: Daftar modul fitur independen
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  code: varchar("code").unique().notNull(), // e.g. 'rsvp_system', 'premium_gallery'
  name: varchar("name").notNull(),
  isCore: boolean("is_core").default(false),
});

// package_features: Relasi fitur ke paket (Admin controlled)
export const packageFeatures = pgTable("package_features", {
  packageId: integer("package_id").references(() => packages.id),
  featureId: integer("feature_id").references(() => features.id),
});

// invitations: Ditambahkan package_id untuk kontrol akses
export const invitations = pgTable("invitations", {
  // ... existing fields
  packageId: integer("package_id").references(() => packages.id),
});
```

---

## 4. Application Logic: Feature Gating

Untuk menjamin modularitas seperti yang diminta di PRD:

1.  **Permission Check**: Setiap komponen UI di Dashboard (misal: `RSVPSection` atau `GalleryForm`) akan memanggil fungsi helper `canUseFeature(invitationData, 'feature_code')`.
2.  **Logic**: 
    - Jika fitur bertanda `isCore: true`, kembalikan `true`.
    - Jika tidak, cek apakah `feature_code` ada di dalam daftar fitur yang di-link ke `package_id` undangan tersebut.
3.  **UI Feedback**: Jika `false`, komponen akan menampilkan *Overlay* "Upgrade to Unlock" agar Admin bisa melakukan monetisasi.

---

## 5. Fitur & Status Implementasi (Current State)

### ✅ Fitur yang Sudah Selesai (Source of Truth)
1.  **Rendering Engine:** Halaman publik `[slug]` sudah bisa merender data secara dinamis mengalir ke komponen tema.
2.  **Basic Theme:** Komponen tema dasar (`BasicTheme.tsx`) dengan fitur lengkap:
    *   Responsive (Mobile-First)
    *   Animasi pembuka (Welcome Modal)
    *   Music Toggle & Bottom Navigation
    *   Dynamic Styles (CSS Variable Injection untuk warna & font).
3.  **Dashboard Editor:**
    *   Split-screen layout (Form di kiri, Preview Mobile di kanan).
    *   Sistem form modular: Info Mempelai, Acara, Galeri, Quotes, Musik, Pengaturan Tampilan.
4.  **Appearance System:** Integrasi Zod untuk validasi input dan sistem picker warna/font yang langsung mengubah preview.
5.  **Font System:** Dynamic loading Google Fonts di dalam tema berdasarkan input user.

### ⏳ Fitur yang Direncanakan (Planned)
1.  **Database Integration (Phase 4):** Mengganti Mock Data dengan koneksi PostgreSQL asli via Drizzle.
2.  **RSVP Server Actions:** Implementasi submit RSVP dari sisi Guest ke database.
3.  **Auth System (NextAuth):** Securing dashboard agar user hanya bisa edit data miliknya.
4.  **Admin Panel:** UI untuk Super Admin mengaktivasi user dan kelola tema.

---

## 5. Development Workflow

*   **Database Management:** Semua perubahan skema harus dilakukan via `drizzle-kit generate` dan `push`.
*   **SSH Tunneling:** Developer wajib menyalakan tunnel SSH ke DB IDCloudHost pada port 5433 sebelum menjalankan aplikasi di lokal (untuk Iterasi 4 nanti).
*   **Theme Development:** Developer yang ingin membuat tema baru cukup membuat komponen di `src/components/themes/` dan mendaftarkannya di `ThemeRegistry`.

---

**Nikahin App Technical Documentation**
*Dokumen ini harus diperbarui secara berkala seiring berjalannya fase pada `todo.md`.*
