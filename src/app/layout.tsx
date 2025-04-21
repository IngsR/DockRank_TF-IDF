"use client";

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import Footer from '@/components/Footer';
import {useEffect, useState} from 'react';

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-secondary text-secondary-foreground p-8 shadow-md" style={{ height: '80px' }}>
          <nav className="container mx-auto flex justify-between items-center">
            <Link
              href="/"
              className="text-4xl font-bold transition-colors hover:text-accent"
            >
              Pencarian TF-IDF
            </Link>
            <ul className="flex space-x-10">
              <li>
                <Link
                  href="/search"
                  className={`relative text-lg transition-colors hover:text-accent ${
                    activeLink === '/search'
                      ? 'text-accent'
                      : 'text-secondary-foreground'
                  } header-link`}
                  style={{
                    '--underline-color': 'black',
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
                      ? 'text-accent'
                      : 'text-secondary-foreground'
                  } header-link`}
                  style={{
                    '--underline-color': 'black',
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
                      ? 'text-accent'
                      : 'text-secondary-foreground'
                  } header-link`}
                  style={{
                    '--underline-color': 'black',
                    fontSize: '1.2em'
                  }}
                >
                  Dokumen
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto p-4" style={{minHeight: 'calc(100vh - 80px - 60px)'}}>{children}</main>
          <Toaster />
          <Footer />
      </body>
    </html>
  );
}
