import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, MotionProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const baseUrl = "https://getfinaloffer.vercel.app";
const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = stored === "light" || stored === "dark" ? stored : (systemDark ? "dark" : "light");
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  } catch {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GetFinalOffer - Verified Interviews, Direct Recruiter Outreach",
    template: "%s | GetFinalOffer",
  },
  description:
    "Verify your interview history once. Partner companies search for you by verified skills and reach out — no repeated technical screens.",
  keywords: [
    "job offers",
    "tech hiring",
    "verified interviews",
    "interview history",
    "verified skills",
    "verified engineers",
    "software engineer jobs",
    "recruiter search",
    "direct outreach",
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
    title: "GetFinalOffer - Verified Interviews, Direct Recruiter Outreach",
    description:
      "Verify your interview history once. Partner companies find you by verified skills and reach out directly.",
    url: baseUrl,
    siteName: "GetFinalOffer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "GetFinalOffer - Verified interview history with direct recruiter outreach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetFinalOffer - Verified Interviews, Direct Recruiter Outreach",
    description:
      "Verify your interview history once. Partner companies find you by verified skills and reach out directly.",
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
    { media: "(prefers-color-scheme: dark)", color: "#0c1222" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} bg-background text-foreground antialiased font-sans`}
      >
        <ThemeProvider>
          <MotionProvider>
            <div className="min-h-screen">
              <Header />
              {children}
              <Toaster />
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
