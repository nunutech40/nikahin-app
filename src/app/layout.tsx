import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import { getSystemSettings } from "./actions/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings() as any;
  return {
    title: settings?.metaTitle || "Nikahin - Undangan Pernikahan Digital",
    description: settings?.metaDesc || "Platform undangan pernikahan digital berbasis tema yang elegan dan modern",
    icons: {
      icon: "/favicon.png",
      apple: "/apple-icon.png",
    },
    openGraph: {
      images: [settings?.ogImage || "/og-image.png"],
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSystemSettings() as any;
  const session = await getServerSession(authOptions);

  // Maintenance check
  const isMaintenance = settings?.isMaintenance === true;
  const isAdmin = (session?.user as any)?.role === "admin";

  if (isMaintenance && !isAdmin) {
    return (
      <html lang="id">
        <body className={`${montserrat.variable} font-montserrat bg-[#FDFBF7] flex items-center justify-center min-h-screen p-6 text-center`}>
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-serif font-black text-[#1A1612]">Sedang Maintenance</h1>
            <p className="text-[#1A1612]/50 font-bold leading-relaxed">
              Halo! Kami sedang melakukan pembaruan sistem untuk memberikan pengalaman yang lebih baik. Kami akan segera kembali!
            </p>
            <div className="pt-6 border-t border-slate-200">
              <p className="text-[10px] uppercase font-black tracking-widest text-[#B48C5E]">Powering by {settings?.appName || "Nikahin"}</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased font-montserrat`}
      >
        <Toaster position="top-center" richColors />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
