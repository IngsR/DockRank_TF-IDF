"use client";

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Metadata } from 'next';
import { metadata as nextMetadata } from '@/metadata';

// export const metadata: Metadata = nextMetadata; // Re-enable metadata export if needed

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <header className="bg-secondary text-secondary-foreground p-6 shadow-md" style={{ height: '90px' }}> {/* Increased height */}
          <nav className="container mx-auto flex justify-between items-center h-full">
            <Link
              href="/"
              className="text-4xl font-bold transition-colors hover:text-accent"
            > Project TD-IDF      
            </Link>
            <ul className="flex space-x-10">
              <li>
                <Link
                  href="/search"
                  className={`relative text-lg transition-colors hover:text-accent ${
                    activeLink === '/search'
                      ? 'text-accent font-semibold' // Make active link stand out more
                      : 'text-secondary-foreground'
                  } header-link`}
                  style={{
                    fontSize: '1.2em'
                  }}
                >
                  Pencarian
                </Link>
              </li>
              <li>
                <Link
                  href="/add-document"
                  className={`relative text-lg transition-colors hover:text-accent ${
                    activeLink === '/add-document'
                      ? 'text-accent font-semibold'
                      : 'text-secondary-foreground'
                  } header-link`}
                  style={{
                    fontSize: '1.2em'
                  }}
                >
                  Tambah Dokumen
                </Link>
              </li>
              <li>
                <Link
                  href="/documents"
                  className={`relative text-lg transition-colors hover:text-accent ${
                    activeLink === '/documents'
                      ? 'text-accent font-semibold'
                      : 'text-secondary-foreground'
                  } header-link`}
                  style={{
                    fontSize: '1.2em'
                  }}
                >
                  Dokumen
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto p-4">{children}</main>
          <Toaster />
          <Footer />
      </body>
    </html>
  );
}
