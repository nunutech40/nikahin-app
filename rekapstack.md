# 🛠️ Technical Stack Recap: Nikahin App

Dokumen ini merangkum seluruh teknologi dan konfigurasi yang digunakan dalam pengembangan platform Nikahin. Perancangan ini didasarkan pada efisiensi performa, keamanan, serta optimalisasi sumber daya (disk space & RAM).

---

## 1. Core Development Stack

*   **Language:** **TypeScript** (Strict Mode). Digunakan di seluruh ekosistem (Frontend & Backend) untuk menjamin *Type-Safety*.
*   **Framework:** **Next.js 14+ (App Router)**.
    *   **Frontend:** React Components dengan optimalisasi Server Components (RSC) untuk SEO.
    *   **Backend:** Server Actions sebagai pengganti API Routes manual untuk efisiensi logic internal.
*   **Styling:** **Tailwind CSS**. Digunakan untuk kustomisasi UI yang cepat dan ringan.
*   **Database Interface:** **Drizzle ORM**. Driver *TypeScript-first* yang ringan, performa tinggi, dan hemat ruang disk.
*   **Animations:** **Framer Motion**. Untuk memberikan pengalaman pengguna yang premium melalui animasi transisi.

---

## 2. Local Environment & Optimization

Konfigurasi ini dioptimalkan untuk menjaga performa mesin pengembang (SSD & RAM):

*   **Node Manager:** `fnm` (Fast Node Manager) – Berbasis Rust, memberikan manajemen versi Node yang sangat cepat.
*   **Package Manager:** `pnpm`. Wajib digunakan karena fitur *content-addressable store* yang menghemat penggunaan SSD secara masif.
*   **Runtime:** Node.js 20 (LTS).

---

## 3. Data & Security Architecture

*   **Database:** PostgreSQL (Housed on IDCloudHost).
*   **Connection Strategy (Development):** **SSH Tunneling**.
    *   Local Port: `5433` → Remote Port: `5432`.
    *   Target DB: `undangan_dev` (Lingkungan isolasi untuk pengembangan).
*   **Connection Strategy (Production):** Koneksi Localhost (Internal network di dalam server).
*   **Secrets Management:** 
    *   Local: `.env.local` (Dilarang keras masuk ke version control).
    *   Production: Environment Variables pada dashboard deployment.

---

## 4. Infrastructure & Deployment (CI/CD)

Strategi untuk menjaga stabilitas server (Vapor/Next.js coexistence):

*   **CI/CD Pipeline:** **GitHub Actions**. Proses build dilakukan di cloud (GitHub Runner) untuk menghemat sumber daya CPU/RAM server produksi.
*   **Containerization:** **Docker**. Menjamin konsistensi lingkungan jalannya aplikasi antara lokal dan server.
*   **Orchestration:** **Docker Compose**. Mengelola kontainer Next.js dan integrasi dengan database.
*   **Process Manager:** **PM2**. Digunakan di dalam kontainer atau bare-metal untuk monitoring log dan mekanisme *auto-restart*.
*   **Reverse Proxy:** **Nginx**. Menangani terminasi SSL (Certbot) dan routing trafik ke port aplikasi.

---

## 5. Application Structure (Monolith)

Struktur folder terpusat untuk mempermudah manajemen kode:

*   `src/app/`: Routing, UI Pages, dan Server Components.
*   `src/db/`: Definisi Schema Drizzle, konfigurasi koneksi, dan migrasi.
*   `src/components/`: Kumpulan komponen UI (Themes, Dashboard, Shared UI).
*   `src/lib/`: Logic backend, Server Actions, validasi schemas, dan helper functions.
*   `src/types/`: Definisi TypeScript Interface global.

---

## 6. Implementation Roadmap

1.  **Phase 1 (Setup):** Inisialisasi Project (pnpm/fnm) → Konfigurasi SSH Tunnel → integrasi Drizzle.
2.  **Phase 2 (Data):** Perancangan Schema Database → Push Schema ke `undangan_dev`.
3.  **Phase 3 (MVP):** Implementasi Controller Page (`app/[slug]`) → Integrasi Theme Engine → Form RSVP.
4.  **Phase 4 (Deployment):** Dockerization → Setup GitHub Actions → Live Production.