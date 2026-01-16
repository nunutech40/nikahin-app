# 🏗️ TRD: Technical Requirements Document - Nikahin App

Dokumen ini adalah spesifikasi teknis yang menerjemahkan kebutuhan produk (PRD) ke dalam wilayah implementasi. Dokumen ini berfungsi sebagai **Source of Truth** untuk fitur yang sudah berjalan maupun yang akan dikembangkan.

---

## 🔗 Global Strategy & Links
Aplikasi ini dikembangkan berdasarkan panduan strategis berikut:
- **Product Roadmap:** [todo.md](./todo.md) (Tracking Progres per Iterasi)
- **Product Requirements:** [PRD.md](./PRD.md) (Definisi Fitur & Value)
- **Backfill History:** [inject-user-data.ts](./inject-user-data.ts) (Maintenance Script)

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

### 7. UI Design System (Royal Gold Edition)
The application uses a premium "Royal Gold" design system for the administrative and customer interfaces.
- **Core Palette**: Deep Obsidian (#0F172A), Champagne Gold (#D4AF37), and Clean White (#FDFCFB).
- **Typography**: Playfair Display (Serif) for headings, Montserrat (Sans-serif) for body text.
- **Reusable Components**: 
    - `RoyalCard`: Premium glassmorphism/gold accent cards.
    - `RoyalBadge`: Multi-variant status indicators.
    - `RoyalSkeleton`: Pulse loading states with gold gradients.
    - `RoyalEmptyState`: Stylized "No Data" states with gold glow.
    - `RoyalErrorState`: Graceful, premium recovery screens.
- **Notifications**: Sonner-based toast notifications for real-time feedback.

---

## 5. Fitur & Status Implementasi (Current State)

### ✅ Fitur yang Sudah Selesai (Source of Truth)
1.  **Database Integration (Iteration 4):** PostgreSQL integration via Drizzle ORM is fully operational.
2.  **Auth System (Iteration 5):** NextAuth.js JWT authentication with role-based access control (Admin/Customer).
3.  **Super Admin Panel (Iteration 6):** Full user management, invitation monitoring, and platform analytics.
4.  **Royal UI System:** Modern premium aesthetic with standardized reusable library.
5.  **Dashboard Editor:** Split-screen layout with real-time preview and dynamic feature gating.

### ⏳ Fitur yang Direncanakan (Planned)
1.  **RSVP Dashboard:** Detailed analytics for guest responses using Server Components and `inArray` filtering for multi-invitation support.
2.  **Email Notification Trigger:** Integration with `submitRSVP` action to fire asynchronous email alerts via **Resend API** or **Nodemailer**, containing the guest details and a CTA to view in-app.
3.  **Theme Marketplace:** UI for admins to manage themes and templates.

---

**Nikahin App Technical Documentation**
*Dokumen ini diperbarui pada Iterasi 6 - Super Admin Panel.*
