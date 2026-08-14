import type { Metadata, Viewport } from "next";
import { Outfit, Amiri } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import PWAInstaller from "@/components/PWAInstaller";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "EducaTech Online Islamic School | Multi-Tenant Platform",
  description: "Empowering global Islamic academies and schools with white-label virtual Quran education technology, verified Ijazah scholars, and real-time synchronization.",
  keywords: ["EducaTech", "Online Islamic School", "Multi-tenant SaaS", "Quran Academy", "Hifz", "Riwayah", "Tajweed", "Ijazah"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EducaTech",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${amiri.variable}`} style={{ colorScheme: 'only light' }}>
      <body className="antialiased" style={{ colorScheme: 'only light' }}>
        <Providers>
          {children}
          <PWAInstaller />
        </Providers>
      </body>
    </html>
  );
}
