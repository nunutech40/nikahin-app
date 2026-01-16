import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Nikahin - Undangan Pernikahan Digital",
  description: "Platform undangan pernikahan digital berbasis tema yang elegan dan modern",
};

import { AuthProvider } from "@/components/providers/AuthProvider";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased font-montserrat`}
      >
        <Toaster position="top-center" richColors />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
