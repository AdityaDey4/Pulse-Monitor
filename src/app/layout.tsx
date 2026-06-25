import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import SessionWrapper from "@/providers/session-wrapper";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layouts/thems/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Pulse Monitor",
    template: "%s | Pulse Monitor",
  },
  description:
    "Production-grade uptime monitoring platform with real-time alerts, analytics, availability tracking, and monitoring dashboards.",
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
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SessionWrapper>{children}</SessionWrapper>

            <Toaster
              richColors
              position="top-right"
              closeButton
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}