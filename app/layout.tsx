import type { Metadata, Viewport } from "next";
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

const baseUrl = "https://getfinaloffer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GetFinalOffer - Skip Interviews, Get Competing Offers",
    template: "%s | GetFinalOffer",
  },
  description:
    "Verify your interview history once. Top tech companies skip technical rounds and compete with direct salary offers. Join 10,000+ engineers who landed their dream jobs.",
  keywords: [
    "job offers",
    "tech hiring",
    "skip interviews",
    "salary negotiation",
    "verified engineers",
    "software engineer jobs",
    "direct offers",
    "competing offers",
  ],
  authors: [{ name: "GetFinalOffer" }],
  creator: "GetFinalOffer",
  publisher: "GetFinalOffer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "GetFinalOffer - Skip Interviews, Get Competing Offers",
    description:
      "Verify once. Interview never. Get competing offers from top tech companies.",
    url: baseUrl,
    siteName: "GetFinalOffer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "GetFinalOffer - Skip Interviews, Get Competing Offers from Top Tech Companies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetFinalOffer - Skip Interviews, Get Competing Offers",
    description:
      "Verify once. Interview never. Get competing offers from top tech companies.",
    images: ["/opengraph-image.png"],
    creator: "@getfinaloffer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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