import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import PageTransition from "@/src/components/PageTransition";
import FloatingSidebar from "@/src/components/FloatingSidebar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const pliant = localFont({
  src: [
    {
      path: "../../public/fonts/Pliant-Variable.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pliant-Italic-Variable.ttf",
      style: "italic",
    }
  ],
  variable: "--font-pliant",
});

export const metadata: Metadata = {
  title: "Horus",
  description: "Red de protección inteligente con tecnología NFC.",
  icons: {
    icon: "/logos-horus-5.svg",
    apple: "/logos-horus-5.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pliant.variable} ${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--h-bg)] text-[var(--h-text)] transition-colors duration-200">
        <Script id="sw-cleanup" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(regs) {
              regs.forEach(function(reg) { reg.unregister(); });
            });
          }
        `}</Script>
        <ThemeProvider>
          <FloatingSidebar />
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
