'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi'; // Contoh menggunakan react-icons

export default function Header() {
    const pathname = usePathname();
    const [activeLink, setActiveLink] = useState(pathname);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu mobile

    useEffect(() => {
        setActiveLink(pathname);
        // Tutup menu saat navigasi berpindah halaman
        setIsMenuOpen(false);
    }, [pathname]);

    // Fungsi untuk toggle menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navLinks = [
        { href: '/search', label: 'Pencarian' },
        { href: '/add-document', label: 'Tambah Dokumen' },
        { href: '/documents', label: 'MyDokumen' },
    ];

    return (
        <header className="bg-secondary text-secondary-foreground p-6 shadow-md relative">
            <div className="container mx-auto flex justify-between items-center h-full">
                <Link
                    href="/"
                    className="text-3xl md:text-4xl font-bold transition-colors hover:text-accent"
                >
                    DocRank Explorer
                </Link>

                {/* Tombol Hamburger untuk Mobile */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-3xl">
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Navigasi untuk Desktop */}
                <nav className="hidden md:flex items-center">
                    <ul className="flex space-x-10 items-center">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`relative text-lg transition-colors hover:text-accent ${
                                        activeLink === link.href
                                            ? 'text-accent font-semibold'
                                            : 'text-secondary-foreground'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Navigasi untuk Mobile (Dropdown) */}
            {isMenuOpen && (
                <nav className="md:hidden absolute top-full left-0 w-full bg-secondary shadow-md">
                    <ul className="flex flex-col items-center space-y-6 py-8">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`relative text-xl transition-colors hover:text-accent ${
                                        activeLink === link.href
                                            ? 'text-accent font-semibold'
                                            : 'text-secondary-foreground'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}
