# Rekap Stack

---

## Technical Stack Recap [Project: Undangan Online]

### 1. Core Development Stack

- **Language:** TypeScript (Strict Mode). Satu bahasa untuk Frontend dan Backend. Type-safe, cocok dengan mindset lo sebagai iOS/Android dev.
- **Framework:** **Next.js 14+ (App Router)**.
    - *Frontend:* React components dengan Server Component (RSC) untuk SEO dan speed.
    - *Backend:* Server Actions (meniadakan kebutuhan API routes manual untuk internal logic).
- **Styling:** **Tailwind CSS**. Standar industri untuk kustomisasi UI cepat tanpa *bloated* CSS files.
- **Database Interface:** **Drizzle ORM**. Lightweight, TypeScript-first, dan jauh lebih hemat SSD daripada Prisma.

### 2. Local Environment & SSD Optimization

Untuk menjaga SSD laptop lo tetap "bernafas" di tengah gempuran Xcode/Android Studio:

- **Node Manager:** `fnm` (Fast Node Manager) via Rust.
- **Package Manager:** `pnpm`. Wajib, untuk fitur *content-addressable store* yang menghemat *disk space* secara masif.
- **Runtime:** Node.js 20 (LTS).

### 3. Data & Security Architecture

- **Database:** PostgreSQL (Existing di server IDCloudHost).
- **Connection Strategy (Dev):** **SSH Tunneling**.
    - Port Local `5433` -> Port Remote `5432`.
    - Database Target: `undangan_dev` (Bikin DB baru khusus development).
- **Connection Strategy (Prod):** Localhost connection (Internal network di dalam server).
- **Secrets Management:** File `.env.local` (Local) dan Environment Variables (Server). **Dilarang keras push `.env` ke GitHub.**

### 4. Infrastructure & Deployment (The "Elite" Path)

Strategi untuk menjaga server tetap stabil (mengingat lo ada project Vapor di situ):

- **CI/CD:** **GitHub Actions**. Proses build (CPU/RAM intensive) dilakukan di server GitHub, bukan di server lo.
- **Containerization:** **Docker**. Aplikasi lo dibungkus jadi image. Menjamin "Jalan di local, jalan di server".
- **Orchestration:** **Docker Compose**. Untuk running Next.js app dan menghubungkannya dengan Postgres.
- **Process Manager:** **PM2**. Untuk monitoring logs dan auto-restart jika app crash di dalam container atau bare-metal.
- **Reverse Proxy:** **Nginx** (Existing). Untuk handle SSL (Certbot) dan routing domain ke port Next.js.

### 5. Application Structure (Monolith)

Satu repo untuk mempermudah manajemen:

- `src/app/`: Routing dan UI (Frontend).
- `src/db/`: Schema Drizzle dan konfigurasi database.
- `src/components/`: Reusable UI (Undangan templates, Admin dashboard).
- `src/lib/`: Utility functions dan Server Actions (Backend logic).

---

## Project Roadmap (Immediate Actions)

1. **Phase 1 (Setup):** Install `fnm` & `pnpm` -> Init Next.js -> Setup SSH Tunnel ke IDCloudHost.
2. **Phase 2 (Data):** Design DB Schema (Drizzle) -> Push schema ke `undangan_dev`.
3. **Phase 3 (MVP):** Bikin satu Page Template (`app/[slug]/page.tsx`) & Form RSVP.
4. **Phase 4 (Deploy):** Setup Dockerfile & GitHub Actions -> Live.

**Logic holds?** Ini sudah standar industri untuk *fullstack engineering* yang efisien. Lo nggak bakal buang waktu di infrastruktur yang nggak perlu.

Mau gue buatin **Drizzle Schema** pertama lo yang mencakup tabel `Invitations`, `Events`, dan `Guests` supaya lo tinggal *copy-paste* ke project?