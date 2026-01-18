# 💍 Nikahin - Digital Wedding Invitation Platform

> **Undangan pernikahan digital yang elegan, modern, dan mudah dikustomisasi**

Nikahin adalah platform **SaaS (Software as a Service)** untuk pembuatan undangan pernikahan digital berbasis tema yang elegan, modern, dan mudah digunakan. Dengan fokus pada pemisahan Konten dan Tampilan, Nikahin memungkinkan pasangan mengganti tema instan tanpa repot.

**Update Terbaru:** Platform kini mendukung **Multi-tier Agency System**, memungkinkan partner bisnis (Seller) untuk mengelola klien mereka sendiri di bawah ekosistem Nikahin.

## ✨ Features & Packages

Nikahin hadir dengan sistem paket modular yang fleksibel:

- 🥉 **Bronze (Free)**: Undangan dasar, 10 foto galeri, RSVP basic, dan tema standar.
- 🥈 **Silver (Best Value)**: Semua fitur Bronze + Love Story, Musik Latar, Kutipan Doa, dan Multi-acara.
- 🥇 **Gold (Premium)**: Semua fitur Silver + Hadiah Digital, Custom Tema (Warna/Font), **Guest Management (Import Excel)**, Galeri Tanpa Batas, dan Hapus Branding.
- 💎 **Platinum (Elite)**: Semua fitur Gold + Custom Domain, Video Background, Live Streaming, dan WhatsApp Blast.
- 🧪 **Demo Mode**: Mencoba seluruh fitur Platinum secara gratis dengan data demo yang cantik.

## 🏗️ Architecture & Theme System

Nikahin menggunakan **theme-based architecture** yang memisahkan data (InvitationData) dari presentasi (UI Components). Arsitektur ini memungkinkan pembuatan tema baru secara independen tanpa mengganggu logika inti aplikasi.

Untuk detail teknis mengenai cara kerja sistem tema dan panduan pengembangan tema kustom, silakan baca dokumentasi kami:
👉 **[Theme Development Guide](./docs/THEME_DEVELOPMENT.md)**

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** PostgreSQL via Drizzle ORM (**Implemented**)
- **Authentication:** NextAuth.js (JWT Strategy) (**Implemented**)
- **Deployment:** Vercel / Docker Container (**Ready**)

## 📁 Project Structure

```
src/
├── app/
│   ├── [slug]/                   # Public invitation pages
│   ├── dashboard/                # User editor & analytics
│   ├── admin/                    # Super Admin management
│   └── api/                      # Auth & API endpoints
├── components/
│   ├── themes/                   # Theme implementations (BasicTheme, etc.)
│   ├── dashboard/                # Editor components
│   └── ui/                       # Reusable Royal UI components
├── lib/
│   ├── features.ts               # Feature gating logic
│   └── themeRegistry.ts          # Theme loader system
└── db/
    └── schema.ts                 # Database definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended)

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
pnpm install
```

2. Setup Database:
```bash
# Push schema to your PostgreSQL
pnpm db:push
# Seed initial data (Packages, Themes, Admin)
pnpm db:seed
```

3. Run the development server:
```bash
pnpm dev
```

## 📋 Development Roadmap

- [x] **Iteration 1**: Core Renderer (Hero, Couple, Events)
- [x] **Iteration 2**: Theme Engine (Decoupling Content from UI)
- [x] **Iteration 3**: Real-time Editor Dashboard (Live Preview)
- [x] **Iteration 4**: Database Integration (Persistence & RSVP)
- [x] **Iteration 5**: Authentication & Data Isolation
- [x] **Iteration 6**: Super Admin & Agency Management
- [x] **Iteration 7**: Multi-tier Package System & Feature Gating (With Strict Preview Logic)
- [x] **Iteration 8**: Commercial Launch Readiness (Pricing, SEO, Analytics, Refined Demo Flow)
- [ ] **Iteration 9**: Automated Payment & WhatsApp Integration (Planned)

## 📄 Documentation Highlights
- [Preview & Input Logic](./docs/logic/preview_logic.md) - **(New)** Rules for Demo vs Paid User feature access.
- [Theme Development Guide](./docs/THEME_DEVELOPMENT.md) - Guide for creating custom themes.
- [PRD.md](./PRD.md) - Product Requirements.


---

## 🛠️ Tech Stack & Database Setup

### Admin & Operations
- **Panel Address**: `/admin` (Protected by role-based middleware)
- **Monitoring**: User base tracking, Invitation moderation, System wide stats.
- **Tools**: Lucide React for Admin UI, Date-fns for localization.

### Authentication & Security
- **Auth Provider**: NextAuth.js (Credentials Provider)
- **Hashing**: Bcrypt (Round 10)
- **Session Layer**: JWT (JSON Web Token)
- **Role Control**: Middleware protection for `/dashboard/*`
- **Data Isolation**: Server-side user ownership checks on all DB operations.

### Database Scripts
Tersedia beberapa perintah untuk manajemen database:
- `pnpm db:generate`: Membuat file migrasi dari schema.
- `pnpm db:push`: Sinkronisasi schema langsung ke database server.
- `pnpm db:seed`: Memasukkan data awal (sample packages, themes, user, & invitation).
- `pnpm db:studio`: GUI browser untuk melihat data.
- `pnpm db:schema`: (Legacy) Untuk setup schema isolasi jika diperlukan.

## 🧪 Testing

```bash
# Run tests (Coming Soon)
pnpm test

# Run E2E tests (Coming Soon)
pnpm test:e2e

# Run Lighthouse audit
pnpm lighthouse
```

## 📖 Documentation

- [Theme Development Guide](./docs/THEME_DEVELOPMENT.md) - Panduan membuat tema kustom
- [PRD.md](./PRD.md) - Product Requirements Document
- [todo.md](./todo.md) - Development roadmap dan task tracking

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

Jika ada pertanyaan atau masalah:
- Buka issue di GitHub
- Lihat dokumentasi di folder `/docs`
- Check roadmap di `todo.md`

---

**Built with ❤️ by the Nikahin Team**

*Making wedding invitations beautiful and accessible for everyone*
