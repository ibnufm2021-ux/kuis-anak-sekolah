import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generator Kuis Mandiri Anak | Bikin Soal Interaktif Offline",
  description: "Aplikasi ramah orang tua untuk membuat paket kuis interaktif mandiri berformat .html yang bisa dibuka di HP, tablet, dan laptop tanpa perlu internet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-amber-50/30 text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}
