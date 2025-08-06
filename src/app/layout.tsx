import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Education - Eğitim Platformu",
  description: "Modern eğitim yönetim platformu. TypeScript, Tailwind CSS ve shadcn/ui ile geliştirilmiştir.",
  keywords: ["Education", "Eğitim", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Öğretim", "React"],
  authors: [{ name: "Education Team" }],
  openGraph: {
    title: "Education",
    description: "Modern eğitim yönetim platformu",
    url: "https://education.com",
    siteName: "Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education",
    description: "Modern eğitim yönetim platformu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
