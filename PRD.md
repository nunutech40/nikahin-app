# 💍 PRD: Nikahin - Digital Wedding Invitation SaaS

## 1. Project Overview & Value Proposition

Membangun platform **SaaS (Software as a Service)** untuk pembuatan undangan pernikahan digital berbasis tema yang elegan dan modern.

*   **Core Value:** Pemisahan antara **Data** dan **Presentasi**. Pengguna dapat menginput data satu kali, namun bebas mengganti tema kapan saja tanpa kehilangan informasi (*Data persistence across themes*).
*   **Efficiency:** Skalabilitas tinggi menggunakan satu *Core Engine* untuk menangani ribuan undangan secara dinamis.

---

## 2. User Personas & Flows

### A. Super Admin (System Owner)
*   **Goal:** Monetisasi, manajemen infrastruktur, dan kurasi desain.
*   **Flow:** Login → Dashboard Admin → List & Aktivasi User (Manual/Auto Payment Validation) → Manajemen Tema (CRUD Template).

### B. User (The Couple / Customer)
*   **Goal:** Membuat, merancang, dan mengelola undangan sendiri dengan mudah.
*   **Flow:** Register/Login → Input Data (Groom, Bride, Event, Maps, Gallery) → Pilih Tema → Preview → Publish → Bagikan Link.

### C. Guest (Public End-user)
*   **Goal:** Mendapatkan informasi detil acara dan memberikan respons.
*   **Flow:** Akses URL (`nikahin.app/slug`) → Animasi Pembuka → Lihat Konten (Timeline, Galeri, Lokasi) → Kirim RSVP & Ucapan.

---

## 3. Functional Requirements

### 3.1. Dynamic Theme Engine (The Core)
*   **Constraint:** Aplikasi menggunakan sistem *Theme Registry*.
*   **Controller Logic:** `app/[slug]/page.tsx` mengambil data dari database berdasarkan slug, lalu memanggil komponen tema yang sesuai dari `@/components/themes/`.
*   **Prop Pass:** Data dikirim ke komponen tema melalui satu prop tunggal bernama `data` untuk konsistensi antar tema.

### 3.2. Data Architecture (JSONB Content)
*   **Logic:** Menggunakan satu kolom **JSONB** bernama `content` pada tabel `invitations` untuk fleksibilitas field antar tema (Misal: Tema A butuh 10 foto, Tema B hanya 3).
*   **Wajib Field:**
    *   Info Mempelai (Nama, Orang Tua, Foto).
    *   Events (Nama Acara, Waktu, Lokasi, Link Google Maps).
    *   Gallery (Array of Image URLs).
    *   Quotes (Ayat/Kutipan).
    *   Theme Config (Colors & Fonts).

### 3.3. Management Dashboard
*   **Editor:** Interface CRUD untuk mengisi dan mengubah `invitations`.
*   **Media:** Integrasi dengan Storage (Supabase/Cloudinary) untuk manajemen aset gambar.
*   **Preview:** Live preview mode (Split screen) saat melakukan pengeditan data atau tema.

### 3.4. RSVP & Guestbook
*   **Guest Input:** Menggunakan Next.js Server Actions untuk performa optimal.
*   **Data:** Menyimpan `invitation_id`, `name`, `attendance_status`, dan `message`.
*   **Real-time Feedback:** Notifikasi atau update instan di sisi dashboard user saat ada RSVP baru.

---

## 4. Technical Stack & Architecture

### 4.1. System Stack
*   **Framework:** Next.js 14+ (App Router).
*   **ORM:** Drizzle ORM.
*   **Database:** PostgreSQL.
*   **Styling:** Tailwind CSS + Framer Motion (untuk animasi transisi premium).

### 4.2. Database Schema
```typescript
// Core Schema (Drizzle-like syntax)

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).default("customer"), // 'admin' | 'customer'
});

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  isFree: boolean("is_free").default(true),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  themeId: integer("theme_id").references(() => themes.id),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  content: jsonb("content").notNull(), // Data: Mempelai, Acara, Gallery, dsb.
  isPublished: boolean("is_published").default(false),
  musicUrl: text("music_url"),
});

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

## 5. Implementation Roadmap

### Phase 1: Core Rendering & DB
1. Setup Drizzle & Database Schema.
2. Implementasi `app/[slug]/page.tsx` controller.
3. Integrasi Mock Data untuk testing rendering.

### Phase 2: Theme Engine v1
1. Pembuatan `BasicTheme.tsx` (Mobile First).
2. Implementasi animasi pembuka menggunakan Framer Motion.
3. Sistem Registry Tema.

### Phase 3: Dashboard & Appearance
1. Setup Autentikasi User.
2. Form CRUD untuk data undangan.
3. Pengaturan Tampilan (Warna & Font Picker).
1. Live Preview integrasi.

---

## 6. Non-Functional Requirements

*   **Performance:** Optimalisasi gambar menggunakan `next/image` dan Lazy Loading.
*   **SEO:** Implementasi Server Side Rendering (SSR) untuk mendukung OpenGraph Metadata (Thumbnail saat link di-share di WhatsApp/Media Sosial).
*   **Security:** Proteksi API Routes dan validasi input menggunakan Zod.

---

## 7. SaaS Features & Future Roadmap

### 7.1. Appearance Customization
*   User dapat menyesuaikan palet warna (Primary/Secondary) dan pilihan font (Google Fonts integration) yang diaplikasikan ke tema secara dinamis.

### 7.2. Business Logic & Monetization
*   **Checkout & Pricing:** Tiered pricing (Free/Premium).
*   **Onboarding:** Otomatisasi pengiriman akses setelah pembayaran diverifikasi.

### 7.3. Agency & Affiliate
*   **Agency Mode:** Dashboard khusus untuk vendor undangan (reseller) untuk mengelola banyak klien dalam satu akun.
*   **Affiliate:** Sistem referral berbasis kode unik untuk strategi marketing organik.