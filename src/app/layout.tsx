import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GameSessionProvider } from "@/app/(components)/game-session-provider";
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
  title: "El Impostor | Asignación de roles presencial",
  description:
    "Configura partidas, selecciona categoría y reparte palabra e impostor con una experiencia mobile-first pensada para pasar el dispositivo.",
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
        <GameSessionProvider>{children}</GameSessionProvider>
      </body>
    </html>
  );
}
