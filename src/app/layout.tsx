import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Reservas - Reserva tu Cita",
  description: "Sistema completo de reservas de citas con interfaz moderna y gestión administrativa. Reserva de manera rápida y sencilla.",
  keywords: ["reservas", "citas", "sistema", "appointment", "booking"],
  authors: [{ name: "Sistema de Reservas" }],
  creator: "Sistema de Reservas",
  publisher: "Sistema de Reservas",
  openGraph: {
    title: "Sistema de Reservas - Reserva tu Cita",
    description: "Sistema completo de reservas de citas con interfaz moderna y gestión administrativa.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de Reservas - Reserva tu Cita",
    description: "Sistema completo de reservas de citas con interfaz moderna y gestión administrativa.",
  },
  robots: "index, follow",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
