# 💍 Nikahin - Digital Wedding Invitation Platform

> **Undangan pernikahan digital yang elegan, modern, dan mudah dikustomisasi**

Nikahin adalah platform SaaS untuk membuat undangan pernikahan digital dengan berbagai pilihan tema. Dibangun dengan teknologi modern untuk memberikan pengalaman terbaik bagi pengguna dan tamu undangan.

## ✨ Features

- 🎨 **Multiple Themes** - Berbagai pilihan tema yang dapat disesuaikan
- 📱 **Mobile-First Design** - Optimized untuk semua ukuran layar
- 🎵 **Background Music** - Musik latar yang dapat dikustomisasi
- 📸 **Photo Gallery** - Galeri foto dengan layout yang menarik
- 💌 **RSVP System** - Sistem konfirmasi kehadiran tamu
- 📝 **Guestbook** - Buku tamu digital untuk ucapan
- 🎁 **Gift Registry** - Informasi rekening untuk hadiah
- ⏱️ **Countdown Timer** - Hitung mundur menuju hari pernikahan
- 🌐 **Personalized URL** - URL unik untuk setiap undangan
- 👤 **Guest Personalization** - Sapaan personal untuk setiap tamu

## 🏗️ Architecture & Theme System

Nikahin menggunakan **theme-based architecture** yang memisahkan data (InvitationData) dari presentasi (UI Components). Arsitektur ini memungkinkan pembuatan tema baru secara independen tanpa mengganggu logika inti aplikasi.

Untuk detail teknis mengenai cara kerja sistem tema dan panduan pengembangan tema kustom, silakan baca dokumentasi kami:
👉 **[Theme Development Guide](./docs/THEME_DEVELOPMENT.md)**

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** PostgreSQL (via Drizzle ORM) - *Coming Soon*
- **Authentication:** NextAuth.js - *Coming Soon*
- **Deployment:** Vercel - *Coming Soon*

## 📁 Project Structure

```
src/
├── app/
│   ├── [slug]/
│   │   └── page.tsx              # Invitation page controller
│   └── dashboard/                # User dashboard (Coming Soon)
├── components/
│   ├── themes/
│   │   └── BasicTheme.tsx        # Theme components
│   ├── BottomNavigation.tsx      # Shared components
│   └── MusicToggle.tsx
├── lib/
│   └── themeRegistry.ts          # Theme registration system
├── types/
│   └── invitation.ts             # TypeScript type definitions
└── data/
    └── mockData.ts               # Mock data for development
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nikahin-app
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000/rizka-ayu?to=YourName](http://localhost:3000/rizka-ayu?to=YourName) in your browser

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Coming Soon)
DATABASE_URL=postgresql://user:password@localhost:5432/nikahin

# NextAuth (Coming Soon)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📋 Development Roadmap

-   [x] Iterasi 1: Renderer Dasar (Hero, Guest Greeting, Music)
-   [x] Iterasi 2: Theme Engine (Theme Registry, Dynamic Color/Font)
-   [x] Iterasi 3: User Dashboard - Data Entry (Form components, Live Preview)
-   [x] Iterasi 4: Database Integration (PostgreSQL, Drizzle ORM, Live RSVP)
-   [x] Iterasi 5: Auth & User Management (NextAuth, Secure Routes, Data Isolation)
-   [x] Iterasi 6: Super Admin Panel (User Control, Global Monitoring, Analytics)

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
