"use client"; // Required for usePathname hook

import type { Metadata as NextMetadata } from "next"; // Use alias to avoid conflict
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import Header from "@/components/Header"; // Import the new Header component
import { metadata as nextMetadata } from "@/metadata";

// export const metadata: Metadata = nextMetadata; // Metadata export moved to metadata.ts and handled by Next.js

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* No manual <link rel="icon"> tags */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header /> {/* Use the Header component */}
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
