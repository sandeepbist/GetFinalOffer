import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentSession } from "@/lib/auth/current-user";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetFinalOffer",
  description: "Land your dream job with confidence",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  await getCurrentSession();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-950`}
      >
        <Header />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}