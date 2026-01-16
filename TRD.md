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

#### 4.1. Core Tables
*   **`users`**: Multi-role (admin, customer, agency). Memiliki `package_id` untuk menentukan tier langganan.
*   **`features`**: Daftar modul fitur independen (e.g. `rsvp`, `gallery`, `music`). Memiliki flag `is_core`.
*   **`packages`**: Definisi paket (Bronze, Silver, Gold) dengan harga dan status aktif.
*   **`package_features`**: Pivot table yang menghubungkan `packages` dengan `features` (Many-to-Many).
*   **`invitations`**: Inti data undangan, terhubung ke `users`, `themes`, dan `packages`.
*   **`themes`**: Daftar tema yang tersedia.

#### 4.2. Transactional Tables
*   **`guests`**: Data tamu (RSVP & Guestbook).
*   **`transactions`**: Log pembayaran dan status pesanan.
*   **`visitor_logs`**: Data analytics pengunjung per undangan.

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

// 6.2. Feature Matrix & Packages (Implemented Iteration 7)
// Memungkinkan Admin mengatur tiering fitur secara dinamis via UI Matrix.


---

## 4. Application Logic: Feature Gating

Untuk menjamin modularitas seperti yang diminta di PRD:

1.  **Helper Library**: Implementasi di `src/lib/featureGating.ts` yang menyediakan fungsi:
    - `hasFeatureAccess(userId, featureCode)`: Cek akses fitur tunggal.
    - `getUserFeatures(userId)`: Ambil semua kode fitur yang dimiliki user.
    - `getUserPackageInfo(userId)`: Ambil info detail paket dan fitur.
2.  **Server Component Integration**: Query menggunakan `db.query.users.findFirst` dengan relation `package -> features -> feature` untuk efisiensi.
3.  **Logic**: 
    - Jika fitur bertanda `isCore: true`, fitur tersebut bisa diakses oleh semua paket (walaupun tidak terdaftar di `package_features`).
    - Jika tidak, sistem mengecek kecocokan `code` fitur di dalam paket user.
4.  **UI Feedback**: Jika akses ditolak, Editor akan menampilkan *Overlay* "Upgrade to Unlock" atau menyembunyikan opsi konfigurasi premium.

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
