import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Katalis — Jurnal & Catatan Klinis Dokter Gigi",
  description: "Tulisan tentang pengalaman klinis, opini, ulasan alat dan bahan, serta studi kasus nyata dari praktik sehari-hari seorang dokter gigi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const scriptProps = typeof window === 'undefined' ? undefined : ({ type: 'application/json' } as const);

  return (
    <html lang="id" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider scriptProps={scriptProps} attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
