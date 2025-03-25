import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const font = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Humilhador de GitHub",
  description: "O analisador mais sincero de perfis.",
  openGraph: {
    title: "Humilhador de GitHub",
    description: "O analisador mais sincero de perfis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${font.variable} pb-24 bg-gray-50 antialiased`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
