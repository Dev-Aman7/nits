import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/lib/content";
import "./globals.css";

/* Self-hosted through next/font — no render-blocking request to Google. */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-archivo",
  fallback: ["Helvetica", "sans-serif"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nitsengineering.com"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "bioprinting",
    "3D bioprinter",
    "digital light processing",
    "tissue engineering",
    "microtissues",
    "bio-medical research",
    "NITS Engineering",
  ],
  authors: [{ name: site.legalName }],
  icons: {
    icon: "/assets/nits-logo.png",
    apple: "/assets/nits-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: "/",
    images: [{ url: "/assets/nits-logo.png", width: 1063, height: 1063, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/assets/nits-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F3F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0C10" },
  ],
  colorScheme: "light",
};

/**
 * `js` is static on both server and client render, so there's nothing for
 * hydration to mismatch on. The reveal fallback (globals.css) assumes JS by
 * default and holds elements at opacity 0 until IntersectionObserver marks
 * them in view; the <noscript> style below undoes that pause for the rare
 * visitor with JS actually disabled, so nothing is ever stranded invisible.
 */
const NO_JS_FALLBACK = `.js [data-reveal] { animation-play-state: running !important; animation-duration: 1ms !important; }`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} js`}>
      <head>
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_JS_FALLBACK }} />
        </noscript>
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
