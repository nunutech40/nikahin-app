## 1. Project Goal & Value Proposition

Membangun platform **SaaS (Software as a Service)** untuk pembuatan undangan pernikahan digital berbasis tema.

- **Core Value:** User bisa kustomisasi data sekali, lalu ganti tema berkali-kali tanpa kehilangan data (*Separation of Data and Presentation*).
- **Efficiency:** Skalabilitas tinggi dengan satu *Core Engine* untuk ribuan undangan.

## 2. User Personas & Flows

### A. Super Admin (System Owner)

- **Goal:** Monetisasi dan manajemen infrastruktur.
- **Flow:** Login -> Lihat list user -> Aktivasi user (Manual payment validation) -> Manage themes (CRUD template).

### B. User (Customer/Bride-Groom)

- **Goal:** Membuat dan mengelola undangan sendiri.
- **Flow:** Register -> Login -> Input Data (Groom, Bride, Event, Maps, Gallery) -> Pilih Tema -> Publish -> Share Link.

### C. Guest (Public End-user)

- **Goal:** Mendapatkan informasi acara dan melakukan RSVP.
- **Flow:** Akses URL (`/slug`) -> Lihat konten -> Kirim RSVP & Ucapan.

---

## 3. Functional Requirements (Agentic Specs)

### 3.1. Dynamic Theme Engine (The Core)

- **Spec:** Aplikasi harus memisahkan logic pengambilan data dari database dengan logic UI Rendering.
- **Implementation:** `app/[slug]/page.tsx` bertindak sebagai *Controller*. Ia akan mengambil data berdasarkan `slug`, lalu memanggil komponen tema yang tersimpan di `@/components/themes/[theme_slug].tsx`.
- **Constraint:** Konten undangan harus dikirim ke komponen tema melalui satu *prop* tunggal: `data`.

### 3.2. Data Structure (JSONB Content)

- **Logic:** Karena tiap tema memiliki kebutuhan field yang berbeda (misal: Tema A butuh 5 foto, Tema B butuh video), gunakan kolom **JSONB** bernama `content` di tabel `invitations`.
- **Field Wajib di JSONB:**
    - `groom_name`, `groom_parent_name`.
    - `bride_name`, `bride_parent_name`.
    - `events`: Array of objects (nama acara, jam, alamat, link maps).
    - `gallery`: Array of strings (URL gambar).
    - `quotes`: Teks ayat atau kutipan.

### 3.3. Invitation Management (User Dashboard)

- **Feature:** Form CRUD untuk isi tabel `invitations`.
- **Media:** Integrasi dengan Storage (Supabase Storage/Cloudinary) untuk upload foto. Agent harus menghandle *state* upload dan menyimpan URL-nya ke dalam JSONB.

### 3.4. RSVP & Guestbook

- **Feature:** Form publik di sisi Guest.
- **Logic:** Menggunakan **Next.js Server Actions**. Input: `invitation_id`, `name`, `status` (Hadir/Tidak), `message`.
- **Real-time:** User bisa melihat update RSVP di dashboard mereka secara instan.

---

## 4. Technical Architecture (TRD)

### 4.1. System Stack

- **Framework:** Next.js 14+ (App Router).
- **ORM:** Drizzle ORM (Lightweight, Type-safe).
- **DB:** PostgreSQL (Baremetal on IDCloudHost, accessed via SSH Tunnel port 5433).
- **Styling:** Tailwind CSS + Framer Motion (untuk animasi transisi tema).

### 4.2. Database Schema (For Agent Implementation)

TypeScript

# 

`// Refined Schema for Agent
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).default("customer"), // 'admin' | 'customer'
});

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).unique().notNull(), // e.g., 'vintage-rose'
  name: varchar("name", { length: 100 }).notNull(),
  isFree: boolean("is_free").default(true),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  themeId: integer("theme_id").references(() => themes.id),
  slug: varchar("slug", { length: 100 }).unique().notNull(), // The URL
  content: jsonb("content").notNull(), // The meat: names, dates, maps
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
});`

---

## 5. Implementation Roadmap for Agentic AI

### Iterasi 1: Database & Core Rendering

1. Setup Drizzle dan push schema ke Postgres.
2. Bikin Mock Data di database untuk satu `slug`.
3. Bikin Route `app/[slug]/page.tsx` yang bisa fetch data dan tampilkan JSON sederhana.

### Iterasi 2: Theme Component v1

1. Bikin `components/themes/BasicTheme.tsx`.
2. Styling menggunakan Tailwind (Mobile First).
3. Implementasi animasi masuk (fade-in) menggunakan Framer Motion.

### Iterasi 3: User Dashboard & Auth

1. Setup NextAuth atau library auth sederhana.
2. Bikin Form untuk edit `content` JSONB.
3. Implementasi preview undangan (Split screen: Editor di kiri, Preview Mobile di kanan).

---

## 6. Security & Performance (Non-Functional)

- **Security:** Whitelist IP untuk SSH Tunnel (Jalur Local dev).
- **Performance:** Gunakan `next/image` untuk optimasi foto undangan yang diupload user.
- **SEO:** Server Side Rendering (SSR) untuk page `[slug]` agar *metadata* (OpenGraph) muncul saat link di-share di WhatsApp.

---

**Logic holds.** Ini dokumentasi yang cukup "bergizi" buat lo kasih ke Agentic AI (kayak Cursor, Windsurf, atau GPT-Engineer). Dia bakal tau relasi tabelnya, cara kerjanya, dan batasan teknisnya.

Gatot's Advice:

Jangan suruh AI-nya bikin semuanya sekaligus. Suruh dia selesaikan Iterasi 1 dulu. Begitu koneksi DB sukses, baru lanjut ke UI.

Mau gue buatin **System Prompt** spesifik yang bisa lo *copy-paste* ke AI Agent lo supaya dia nggak melenceng dari TRD ini?

---

## 7. Additional Features & Future Roadmap

### 7.1. Theme & Appearance Settings (Phase 3 Extension)
- **Goal:** Memberikan kontrol visual dasar kepada user.
- **Components:** Tab baru di Dashboard "Tampilan".
- **Fields:**
    - **Palette:** Pilihan warna (Primary, Secondary, Accent).
    - **Typography:** Pilihan Font Pair (Heading Font, Body Font).
    - **Cover:** Khusus untuk halaman depan (sampul), opsional upload foto sampul khusus jika berbeda dari galeri.

### 7.2. Theme System Architecture (Designer Ecosystem)
- **Concept:** Sistem tema berbasis *constraint* agar desainer bisa berkontribusi.
- **Mechanism:**
    - Menyediakan **Base Theme Props Types** yang ketat.
    - Desainer membuat komponen React yang menerima props tersebut.
    - Tema didaftarkan ke `ThemeRegistry`.
- **User Flow:** User memilih tema dari "Theme Marketplace" di dashboard -> Preview instan dengan data mereka -> Apply.

### 7.3. Business Logic (SaaS B2C)
- **Flow:**
    1. **Landing Page:** Marketing & Pricing.
    2. **Checkout:** User memilih paket -> Payment.
    3. **Validation:** Verifikasi pembayaran (Manual/Gateway).
    4. **Onboarding:** Sistem mengirim email berisi Username/Password (atau Magic Link).
    5. **Access:** User login ke dashboard untuk mengelola undangan.

### 7.4. Affiliate System (Marketing)
- **Concept:** Memberikan komisi kepada user/marketer yang mengajak user baru.
- **Requirement:** Generate kode referral unik, tracking pendaftar via kode, dashboard komisi.

### 7.5. B2B / Agency Mode (White Label)
- **Goal:** Model bisnis Reseller/Agency. Vendor undangan fisik bisa bundle undangan digital.
- **Hierarchy:**
    - **Super Admin:** Owner System (Monetisasi & Infra).
    - **Agency Admin:** Membeli slot/kredit dalam jumlah banyak. Punya dashboard sendiri untuk memanage banyak klien (couple).
    - **End User (Couple):** (Opsional) Bisa diberi akses terbatas atau dikelola penuh oleh Agency.
- **Note:** Tidak menjual source code, tapi menjual akses platform (SaaS Multi-tenancy).