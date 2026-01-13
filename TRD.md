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

## 3. Database Schema (Source of Truth)

Skema database dirancang untuk fleksibilitas maksimal menggunakan kolom JSONB untuk konten undangan.

```typescript
// src/db/schema.ts

// 1. Users & Auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).default("customer"), // 'admin' | 'customer'
  isActive: boolean("is_active").default(false),
});

// 2. Themes Metadata
export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  isFree: boolean("is_free").default(true),
  metadata: jsonb("metadata"), // Thumbnail URL, styles, etc.
});

// 3. Invitations (The Core)
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  themeId: integer("theme_id").references(() => themes.id),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  content: jsonb("content").notNull(), // Data: grooming, bride, events, gallery, quotes, themeConfig
  isPublished: boolean("is_published").default(false),
  musicUrl: text("music_url"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. Guests & RSVP
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id").references(() => invitations.id),
  name: varchar("name", { length: 100 }).notNull(),
  attendance: varchar("attendance", { length: 20 }), // 'hadir' | 'tidak'
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

---

## 4. Fitur & Status Implementasi (Current State)

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
